import { Request, Response, NextFunction } from "express";
import { PrismaClient, STATUS } from "@prisma/client";
import { createWorkflow, getFirstJobs, runJob, updateWorkflow } from "../services/wokflow-services";
import { pauseContainer, unpauseContainer, waitContainer } from "../services/container-services";
import { messageOneUser } from "../utils/socket";
import { IWorkflow, RequestWithUserId } from "../types";
import { updateJob, updateJobTemplate } from "../services/job-services";
const HttpError = require("../utils/http-error");
import { db } from "../db/db";
import { workflowTemplate, WorkflowTemplate, NewWorkflowTemplate } from "../db/schema";
import { eq } from "drizzle-orm/expressions";

const prisma = new PrismaClient();

const deleteWorkflowTemplate = async (req: Request, res: Response, next: NextFunction) => {
  const tid = req.params.tid;
  try {
    await db.delete(workflowTemplate).where(eq(workflowTemplate.id, parseInt(tid)));
    res.status(200).json({ message: "Template deleted." });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Could not delete template.", 500);
    return next(error);
  }
};

const deleteWorkflow = async (req: Request, res: Response, next: NextFunction) => {
  const wid = req.params.wid;
  try {
    await prisma.workflow.delete({
      where: {
        id: parseInt(wid),
      },
    });
    res.status(200).json({ message: "Workflow deleted." });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Could not delete workflos.", 500);
    return next(error);
  }
};

const getAllWorkflows = async (req: Request, res: Response, next: NextFunction) => {
  let workflows;

  try {
    workflows = await prisma.workflow.findMany({
      where: {
        projectId: parseInt(req.params.pid),
      },
      orderBy: {
        createdAt: "desc",
      },
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
    if (workflows.length === 0) {
      const error = new HttpError("Could not find workflows.", 404);
      return next(error);
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError("Could not get workflows.", 500);
    return next(error);
  }
  res.status(200).json(workflows);
};

const getWorkflowTemplate = async (req: Request, res: Response, next: NextFunction) => {
  const wid = req.params.wid;
  let workflow;
  try {
    workflow = await prisma.workflowTemplate.findUnique({
      where: {
        id: parseInt(wid),
      },
      include: {
        parameters: true,
        jobTemplates: {
          include: {
            outputParams: true,
            container: true,
          },
        },
      },
    });
  } catch (err) {
    const error = new HttpError("Something went wrong, could not find a workflow template.", 500);
    return next(error);
  }
  if (!workflow) {
    const error = new HttpError("Could not find a workflow template for the provided id.", 404);
    return next(error);
  }
  res.json({ workflow: workflow });
};

const getWorkflow = async (req: Request, res: Response, next: NextFunction) => {
  const wid = req.params.wid;
  let workflow;
  try {
    workflow = await prisma.workflow.findUnique({
      where: {
        id: parseInt(wid),
      },
      include: {
        jobs: {
          include: {
            container: true,
          },
        },
      },
    });
  } catch (err) {
    const error = new HttpError("Could not find a workflow for the provided id.", 404);
    return next(error);
  }
  res.json(workflow);
};

const getAllWorkflowsTemplates = async (req: Request, res: Response, next: NextFunction) => {
  let workflows;
  try {
    workflows = await prisma.workflowTemplate.findMany({
      where: {
        projectId: parseInt(req.params.pid),
      },
      include: {
        parameters: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (workflows.length === 0) {
      const error = new HttpError("Could not find workflows.", 404);
      return next(error);
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError("Could not get workflows.", 500);
    return next(error);
  }
  res.status(200).json(workflows);
};

const createJobTemplate = async (req: Request, res: Response, next: NextFunction) => {
  const { name, workflowTemplateId, containerId } = req.body;
  let job;
  try {
    job = await prisma.jobTemplate.create({
      data: {
        name,
        workflowTemplateId,
        containerId,
      },
    });
    // if (!job) {
    //   const error = new HttpError("Could not create job.", 500);
    //   return next(error);
    // }
  } catch (err) {
    console.log(err);
    const error = new HttpError("Could not create job.", 500);
    return next(error);
  }
  res.status(201).json(job);
};

const deleteJobTemplate = async (req: Request, res: Response, next: NextFunction) => {
  const jobId = req.params.jid;
  let job;
  try {
    job = await prisma.jobTemplate.delete({
      where: {
        id: parseInt(jobId),
      },
    });
  } catch (err) {
    const error = new HttpError("Could not delete job.", 500);
    return next(error);
  }
  res.status(200).json(job);
};

const pauseJob = async (req: Request, res: Response, next: NextFunction) => {
  const jobId = req.params.jid;
  let job, ujob;
  try {
    job = await prisma.job.findUnique({
      where: {
        id: parseInt(jobId),
      },
    });
    await pauseContainer(job?.containerInstance!!);
    ujob = await updateJob(parseInt(jobId), { status: STATUS.paused });
  } catch (err) {
    const error = new HttpError("Could not pause job.", 500);
    return next(error);
  }
  res.status(200).json(ujob);
};

const unpauseJob = async (req: RequestWithUserId, res: Response, next: NextFunction) => {
  const jobId = req.params.jid;
  const uid = req.userId;
  let job, ujob;
  try {
    job = await prisma.job.findUnique({
      where: {
        id: parseInt(jobId),
      },
      include: {
        workflow: true,
      },
    });
    await unpauseContainer(job?.containerInstance!!);
    ujob = await updateJob(parseInt(jobId), { status: STATUS.running });
    if (job?.workflow.status === STATUS.paused) await updateWorkflow(job?.workflow.id, { status: STATUS.running });
    //TODO waiting container http request already , so it will not be enable again (other solution is close connection once paused)
    // if (job) waitContainer(uid, job?.containerInstance!!, job?.workflowId, parseInt(jobId));
  } catch (err) {
    const error = new HttpError("Could not resume job.", 500);
    return next(error);
  }
  res.status(200).json(ujob);
};

const resumeWorkflow = async (req: RequestWithUserId, res: Response, next: NextFunction) => {
  const workflowId = req.params.wid;
  const uid = req.userId;
  let jobs, uworkflow;
  let ujobs = [];
  try {
    jobs = await prisma.job.findMany({
      where: {
        workflowId: parseInt(workflowId),
        status: STATUS.paused,
      },
    });
    for (let i = 0; i < jobs.length; i++) {
      let ujob;
      await unpauseContainer(jobs[i].containerInstance!!);
      ujob = await updateJob(jobs[i].id, { status: STATUS.running });
      ujobs.push(ujob);
    }
    uworkflow = await updateWorkflow(parseInt(workflowId), { status: STATUS.running });
  } catch (err) {
    const error = new HttpError("Could not resume workflow.", 500);
    return next(error);
  }
  res.status(200).json({ jobs: ujobs, workflow: uworkflow });
};

const pauseWokflow = async (req: Request, res: Response, next: NextFunction) => {
  const workflowId = req.params.wid;
  let workflow, uworkflow;
  let jobs;
  let ujobs = [];
  try {
    jobs = await prisma.job.findMany({
      where: {
        workflowId: parseInt(workflowId),
        status: STATUS.running,
      },
    });
    for (let i = 0; i < jobs.length; i++) {
      let ujob;
      await pauseContainer(jobs[i].containerInstance!!);
      ujob = await updateJob(jobs[i].id, { status: STATUS.paused });
      ujobs.push(ujob);
    }
    uworkflow = await updateWorkflow(parseInt(workflowId), { status: STATUS.paused });
  } catch (err) {
    const error = new HttpError("Could not pause workflow.", 500);
    return next(error);
  }
  res.status(200).json({ jobs: ujobs, workflow: uworkflow });
};

const updateWorkflowPlacements = async (req: Request, res: Response, next: NextFunction) => {
  const { placements } = req.body;
  const workflowId = req.params.wid;
  try {
    const workflow = await prisma.workflowTemplate.update({
      where: {
        id: parseInt(workflowId),
      },
      data: {
        placements,
      },
    });
    res.status(200).json(workflow);
  } catch (err) {
    const error = new HttpError("Could not update workflow.", 500);
    console.log(error);
    return next(error);
  }
};

const upateJobDependencies = async (req: Request, res: Response, next: NextFunction) => {
  const { jobId, successors, dependencies } = req.body;
  try {
    const job = await prisma.jobTemplate.update({
      where: {
        id: jobId,
      },
      data: {
        successors,
        dependencies,
      },
    });
    res.status(201).json(job);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Could not update job.", 500);
    return next(error);
  }
};

const initWorkflow = async (req: RequestWithUserId, res: Response, next: NextFunction) => {
  let workflow: IWorkflow | undefined;
  let firstJobsId: number[] | undefined;
  const { name, templateName, projectId, params } = req.body;
  try {
    let wname = name;
    const template = await prisma.workflowTemplate.findUnique({
      where: {
        name_projectId: {
          name: templateName,
          projectId: parseInt(projectId),
        },
      },
    });
    if (wname == undefined) {
      let rand = Math.random().toString(36).substring(2, 6);
      wname = templateName + rand;
    }
    if (template === null) throw new Error("Template not found");
    workflow = await createWorkflow(req.userId, wname, template.id, projectId, params);
    messageOneUser(req.userId, "wfs", workflow);
    if (workflow !== undefined) {
      firstJobsId = await getFirstJobs(workflow.id);
    }
    if (firstJobsId !== undefined)
      await Promise.all(
        firstJobsId.map(async (id) => {
          if (workflow !== undefined) {
            await runJob(req.userId, template.id, workflow.id, id, params);
          }
        })
      );
    const updatedWorkflow = await updateWorkflow(workflow!!.id, { status: STATUS.running });
    messageOneUser(req.userId, "wfs", updatedWorkflow);
    res.status(201).json(updatedWorkflow);
  } catch (err) {
    const error = new HttpError("Could not init workflow.", 500);
    return next(error);
  }
};

const setOutputParams = async (req: Request, res: Response, next: NextFunction) => {
  const { params } = req.body;
  try {
    await prisma.outputParams.createMany({
      data: params,
      skipDuplicates: true,
    });

    res.status(201).json(params);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Could not update output Params.", 500);
    return next(error);
  }
};

const setInputParams = async (req: Request, res: Response, next: NextFunction) => {
  const { params } = req.body;
  try {
    await prisma.inputParams.createMany({
      data: params,
    });

    res.status(201).json(params);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Could not update input Params.", 500);
    return next(error);
  }
};

const setTemplateParams = async (req: Request, res: Response, next: NextFunction) => {
  const { params } = req.body;
  try {
    await prisma.workflowTemplateParam.createMany({
      data: params,
    });
    res.status(201).json(params);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Could not add workflow Params.", 500);
    return next(error);
  }
};

const setJobCondition = async (req: Request, res: Response, next: NextFunction) => {
  const jtid = req.params.jtid;
  const { condition } = req.body;
  let job, ujob;
  try {
    job = await prisma.jobTemplate.findUnique({
      where: {
        id: parseInt(jtid),
      },
    });
    ujob = await updateJobTemplate(parseInt(jtid), { condition: condition });
  } catch (err) {
    const error = new HttpError("Could not set job condtion.", 500);
    return next(error);
  }
  res.status(200).json(ujob);
};

const getJTInputParams = async (req: Request, res: Response, next: NextFunction) => {
  const jtid = req.params.jtid;
  try {
    const params = await prisma.inputParams.findMany({
      where: {
        jobTemplateId: parseInt(jtid),
      },
      select: {
        jobTemplateId: true,
        name: true,
        outputParams: true,
        outputParamsId: true,
      },
    });
    if (params) res.status(200).json(params);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Could not get Output Params.", 500);
    return next(error);
  }
};

const getJTOutputParams = async (req: Request, res: Response, next: NextFunction) => {
  const jtid = req.params.jtid;
  try {
    const params = await prisma.outputParams.findMany({
      where: {
        jobTemplateId: parseInt(jtid),
      },
      select: {
        path: true,
        name: true,
        jobTemplateId: true,
      },
    });
    if (params) res.status(200).json(params);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Could not get Output Params.", 500);
    return next(error);
  }
};

module.exports = {
  getJTInputParams,
  setInputParams,
  getJTOutputParams,
  setOutputParams,
  getWorkflow,
  createJobTemplate,
  getWorkflowTemplate,
  getAllWorkflowsTemplates,
  upateJobDependencies,
  updateWorkflowPlacements,
  deleteJobTemplate,
  getAllWorkflows,
  initWorkflow,
  deleteWorkflow,
  deleteWorkflowTemplate,
  pauseJob,
  unpauseJob,
  pauseWokflow,
  resumeWorkflow,
  setTemplateParams,
  setJobCondition,
};
