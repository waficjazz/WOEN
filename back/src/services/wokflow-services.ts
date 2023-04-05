import { Prisma, PrismaClient, STATUS } from "@prisma/client";
import { createWorkflowContainer } from "./container-services";
import { redisc } from "..";
import { IJob, IWorkflow, IWParams } from "../types";
import { messageOneUser } from "../utils/socket";
import { checkCondtion, updateJob } from "./job-services";
import { pushParamsArgs } from "@redis/search/dist/commands";
const prisma = new PrismaClient();

export const createWorkflow = async (
  userId: number,
  name: string,
  templateId: number,
  pid: number,
  params: IWParams[]
): Promise<IWorkflow | undefined> => {
  let workflow: IWorkflow;
  let jobsTemplate;
  try {
    jobsTemplate = await prisma.jobTemplate.findMany({
      where: {
        workflowTemplateId: templateId,
      },
    });
    workflow = await prisma.workflow.create({
      data: {
        userId: userId,
        name,
        workflowTemplateId: templateId,
        totalJobs: jobsTemplate.length,
        projectId: pid,
        workflowParam: {
          createMany: {
            data: params ?? [],
          },
        },
      },
      include: {
        workflowParam: true,
      },
    });
  } catch (err) {
    throw err;
  }
  try {
    let jobs: IJob[] = [];
    if (jobsTemplate.length > 0)
      jobsTemplate?.map((jt, i) => {
        let status: STATUS = STATUS.pending;
        if (jt.condition) {
          let check = checkCondtion(jt.condition, workflow.workflowParam as any);
          if (!check) status = STATUS.skiped;
          const uworkflow = updateWorkflow(workflow.id, { totalJobs: { increment: -1 } });
          messageOneUser(userId, `wfs`, uworkflow);
        }
        let containerId = jt["containerId"] || 0;
        let jobTemplateId = jt["id"];
        let workflowId = workflow.id;
        let name = jt["name"];
        let successors = jt["successors"];
        let dependencies = jt["dependencies"];
        jobs.push({ jobTemplateId, workflowId, name, successors, dependencies, containerId, status });
      });
    let response = await prisma.job.createMany({ data: jobs });
  } catch (err) {
    throw err;
  }
  await setJobsMapping(workflow.id);
  await setworkflowPlacemet(workflow.id, templateId);
  if (workflow !== undefined) return workflow;
};

export const setJobsMapping = async (wid: number) => {
  let jobs: any[];
  let idMap: { [x: string]: any } = {};
  let tids: string[] = [];
  try {
    jobs = await prisma.job.findMany({
      where: {
        workflowId: wid,
      },
    });
    jobs.map((job) => {
      let tmp = [...tids];
      tids = [...tmp, ...job.dependencies, ...job.successors];
    });
    tids.map((id) => {
      jobs.map((job) => {
        if (job.jobTemplateId == id) idMap[id] = job.id;
      });
    });
    await prisma.workflow.update({
      where: {
        id: wid,
      },
      data: {
        jidsMap: idMap,
      },
    });
  } catch (err) {
    throw err;
  }
};

///check if it possible to update this function to use ids mapping
const setworkflowPlacemet = async (wid: number, wtid: number) => {
  interface IPlacement {
    [key: string]: [number, number];
  }
  let jobs;

  let placments: IPlacement = {};
  try {
    let workflowTemplate = await prisma.workflowTemplate.findUnique({
      where: {
        id: wtid,
      },
    });

    jobs = await prisma.job.findMany({
      where: {
        workflowId: wid,
      },
    });
    if (workflowTemplate != null && jobs) {
      let placmentTemplate: IPlacement = workflowTemplate.placements as IPlacement;
      jobs.map((j) => {
        let jtid;
        if (j.jobTemplateId != null) {
          jtid = j.jobTemplateId;
        }
        if (jtid) placments[j.id] = placmentTemplate[jtid.toString()];
      });
    }
    //update workflow with placement
    let updatedJob = await prisma.workflow.update({
      where: {
        id: wid,
      },
      data: {
        placements: placments,
      },
    });
    return updatedJob;
  } catch (err) {
    throw err;
  }
};

export const getFirstJobs = async (wid: number) => {
  let jobs;
  try {
    jobs = await prisma.job.findMany({
      where: {
        workflowId: wid,
      },
    });
    let firstJobsId: number[] = [];
    jobs.map((job) => {
      if (job.dependencies.length == 0) firstJobsId.push(job.id);
    });
    return firstJobsId;
  } catch (err) {
    throw err;
  }
};

export const runJob = async (uid: number, jtid: number, wid: number, jid: number, wparams: IWParams[] | null | undefined) => {
  let job;
  try {
    if (jid > 0) {
      job = await prisma.job.findUnique({
        where: {
          id: jid,
        },
        include: {
          container: true,
          jobTemplate: {
            include: {
              inputParams: true,
            },
          },
        },
      });
      updateWorkflow(wid, { startedAt: new Date() });
    } else {
      job = await prisma.job.findFirst({
        where: {
          workflowId: wid,
          jobTemplateId: jtid,
        },
        include: {
          container: true,
          jobTemplate: {
            include: {
              inputParams: true,
            },
          },
        },
      });
    }
    if (job)
      if (job?.status !== STATUS.skiped) {
        let checkCond = true;
        let container = job.container;
        interface IInput {
          name: string | null;
          value: string;
        }
        ///this part is where we apply workflow params
        if (wparams && wparams.length > 0) {
          wparams.map((param) => {
            const regex = new RegExp(`{{workflow.${param.name}}}`, "g");
            container!!.commands[2] = container!!.commands[2].replace(regex, param.value);
          });
        }
        let result: IInput[] = [];
        if (job.jobTemplate?.inputParams) {
          ///this part is where we get inputs value
          ///checkk skip here
          let inputParams = job.jobTemplate.inputParams;
          if (inputParams.length > 0) {
            await Promise.all(
              inputParams.map(async (param) => {
                let paramValue = await prisma.outputParamsValue.findFirst({
                  where: {
                    outputParamsId: param.outputParamsId,
                    workflowId: wid,
                  },
                });
                if (paramValue) {
                  result.push({ name: param.name, value: paramValue.value });
                }
              })
            );
            if (job.jobTemplate.condition) {
              checkCond = checkCondtion(job.jobTemplate.condition, wparams, result);
            }
            if (checkCond) {
              result.forEach((input) => {
                const regex = new RegExp(`{{${input.name}}}`, "g");
                container!!.commands[2] = container!!.commands[2].replace(regex, input.value);
              });
            }
          }
        }
        if (checkCond) {
          if (job.dependencies.length !== 0) {
            if (!redisc.isOpen) await redisc.connect();
            let l = await redisc.lLen(`${jtid}${wid}`);
            if (job.dependencies.length != l) return;
          }

          let cname = container?.name + Math.random().toString(36).substring(2, 6);
          createWorkflowContainer(uid, wparams, container!!.image, container!!.commands, cname, wid, job.id);
        } else {
          let uJob = await updateJob(job.id, { status: STATUS.skiped });
          const workflow = await updateWorkflow(wid, { totalJobs: { increment: -1 } });
          messageOneUser(uid, `wfs`, workflow);
          await messageOneUser(uid, `w${wid.toString()}`, uJob);
          await triggerNextJobs(uid, job as IJob, wid, jid, wparams);
        }
      } else {
        await triggerNextJobs(uid, job as IJob, wid, jid, wparams);
      }
  } catch (err) {
    throw err;
  }
};

export const triggerNextJobs = async (uid: number, job: IJob, wid: number, jid: number, wparams: IWParams[] | null | undefined) => {
  if (job && job.successors.length > 0) {
    if (!redisc.isOpen) await redisc.connect();

    await Promise.all(
      job.successors.map(async (j) => {
        await redisc.lPush(`${j}${wid}`, jid.toString());
        await runJob(uid, parseInt(j), wid, 0, wparams);
      })
    );
    await redisc.disconnect();
  } else {
    console.log("done");
  }
};

export const updateWorkflow = async (wid: number, data: any) => {
  try {
    let workflow = await prisma.workflow.update({
      where: {
        id: wid,
      },
      data,
      include: {
        owner: {
          select: {
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return workflow;
  } catch (err) {
    throw err;
  }
};
