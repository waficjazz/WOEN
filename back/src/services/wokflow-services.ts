import { Prisma, PrismaClient } from "@prisma/client";
import wc from "./container-services";
import { redisc } from "..";
import { IJob, IWorkflow } from "../types";
import { io } from "../index";
const prisma = new PrismaClient();

export const createWorkflow = async (userId: number, name: string, templateId: number): Promise<IWorkflow | undefined> => {
  let workflow: IWorkflow;
  try {
    workflow = await prisma.workflow.create({
      data: {
        userId: userId,
        name,
        workflowTemplateId: templateId,
      },
    });
  } catch (err) {
    return err as undefined;
  }
  let jobsTemplate;
  try {
    jobsTemplate = await prisma.jobTemplate.findMany({
      where: {
        workflowTemplateId: templateId,
      },
    });

    let jobs: IJob[] = [];
    if (jobsTemplate.length > 0)
      jobsTemplate?.map((jt, i) => {
        let containerId = jt["containerId"] || 0;
        let jobTemplateId = jt["id"];
        let workflowId = workflow.id;
        let name = jt["name"];
        let successors = jt["successors"];
        let dependencies = jt["dependencies"];
        jobs.push({ jobTemplateId, workflowId, name, successors, dependencies, containerId });
      });
    let response = await prisma.job.createMany({ data: jobs });
  } catch (err) {
    console.log(err);
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
    console.log(err);
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
    console.log(err);
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
    console.log(err);
  }
};

export const runJob = async (jtid: number, wid: number, jid: number) => {
  let job;
  try {
    if (jid > 0) {
      job = await prisma.job.findUnique({
        where: {
          id: jid,
        },
        include: {
          container: true,
        },
      });
    } else {
      job = await prisma.job.findFirst({
        where: {
          workflowId: wid,
          jobTemplateId: jtid,
        },
        include: {
          container: true,
        },
      });
    }
    if (job) {
      if (job.dependencies.length !== 0) {
        let l = await redisc.lLen(`${jtid}${wid}`);
        if (job.dependencies.length != l) return;
      }
    }
    if (job) {
      let container = job.container;
      let cname = container?.name + Math.random().toString(36).substring(2, 6);
      wc.createWorkflowContainer(container!!.image, container!!.commands, cname, wid, job.id);
    }
  } catch (err) {
    return err;
  }
};
