import { PrismaClient } from "@prisma/client";
import { createWorkflow, getFirstJobs, runJob, updateWorkflow } from "../services/wokflow-services";
import { pauseContainer, unpauseContainer, waitContainer } from "../services/container-services";
import { messageOneUser } from "../utils/socket";
import { IWorkflow } from "../types";
import { updateJob } from "../services/job-services";
const HttpError = require("../utils/http-error");

const prisma = new PrismaClient();

const deleteWorkflowTemplate = async (req: any, res: any, next: any) => {
  const tid = req.params.tid;
  try {
    await prisma.workflowTemplate.delete({
      where: {
        id: parseInt(tid),
      },
    });
    res.status(200).json({ message: "Template deleted." });
  } catch (err) {
    const error = new HttpError("Could not delete template.", 500);
    return next(error);
  }
};

const deleteWorkflow = async (req: any, res: any, next: any) => {
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

const getAllWorkflows = async (req: any, res: any, next: any) => {
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

const getWorkflowTemplate = async (req: any, res: any, next: any) => {
  const wid = req.params.wid;
  let workflow;
  try {
    workflow = await prisma.workflowTemplate.findUnique({
      where: {
        id: parseInt(wid),
      },
      include: {
        // jobTemplates: true,
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

const getWorkflow = async (req: any, res: any, next: any) => {
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
const createWorkflowTemplate = async (req: any, res: any, next: any) => {
  //get user id for jwt token

  const { name, projectId } = req.body;
  let workflow;
  try {
    workflow = await prisma.workflowTemplate.create({
      data: {
        projectId: projectId,
        userId: req.userId,
        name,
      },
    });
  } catch (err) {
    const error = new HttpError("Could not create workflow.", 500);
    return next(error);
  }
  res.status(201).json(workflow);
};

const getAllWorkflowsTemplates = async (req: any, res: any, next: any) => {
  let workflows;
  try {
    workflows = await prisma.workflowTemplate.findMany({
      where: {
        projectId: parseInt(req.params.pid),
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

const createJobTemplate = async (req: any, res: any, next: any) => {
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

const deleteJobTemplate = async (req: any, res: any, next: any) => {
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

const pauseJob = async (req: any, res: any, next: any) => {
  const jobId = req.params.jid;
  let job, ujob;
  try {
    job = await prisma.job.findUnique({
      where: {
        id: parseInt(jobId),
      },
    });
    await pauseContainer(job?.containerInstance!!);
    ujob = await updateJob(parseInt(jobId), { status: "paused" });
  } catch (err) {
    const error = new HttpError("Could not pause job.", 500);
    return next(error);
  }
  res.status(200).json(ujob);
};

const unpauseJob = async (req: any, res: any, next: any) => {
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
    ujob = await updateJob(parseInt(jobId), { status: "running" });
    if (job?.workflow.status === "paused") await updateWorkflow(job?.workflow.id, { status: "running" });
    //TODO waiting container http request already , so it will not be enable again (other solution is close connection once paused)
    // if (job) waitContainer(uid, job?.containerInstance!!, job?.workflowId, parseInt(jobId));
  } catch (err) {
    const error = new HttpError("Could not resume job.", 500);
    return next(error);
  }
  res.status(200).json(ujob);
};

const resumeWorkflow = async (req: any, res: any, next: any) => {
  const workflowId = req.params.wid;
  const uid = req.userUd;
  let jobs, uworkflow;
  let ujobs = [];
  try {
    jobs = await prisma.job.findMany({
      where: {
        workflowId: parseInt(workflowId),
        status: "paused",
      },
    });
    for (let i = 0; i < jobs.length; i++) {
      let ujob;
      await unpauseContainer(jobs[i].containerInstance!!);
      ujob = await updateJob(jobs[i].id, { status: "running" });
      ujobs.push(ujob);
    }
    uworkflow = await updateWorkflow(parseInt(workflowId), { status: "running" });
  } catch (err) {
    const error = new HttpError("Could not resume workflow.", 500);
    return next(error);
  }
  res.status(200).json({ jobs: ujobs, workflow: uworkflow });
};

const pauseWokflow = async (req: any, res: any, next: any) => {
  const workflowId = req.params.wid;
  let workflow, uworkflow;
  let jobs;
  let ujobs = [];
  try {
    jobs = await prisma.job.findMany({
      where: {
        workflowId: parseInt(workflowId),
        status: "running",
      },
    });
    for (let i = 0; i < jobs.length; i++) {
      let ujob;
      await pauseContainer(jobs[i].containerInstance!!);
      ujob = await updateJob(jobs[i].id, { status: "paused" });
      ujobs.push(ujob);
    }
    uworkflow = await updateWorkflow(parseInt(workflowId), { status: "paused" });
  } catch (err) {
    const error = new HttpError("Could not pause workflow.", 500);
    return next(error);
  }
  res.status(200).json({ jobs: ujobs, workflow: uworkflow });
};

const updateWorkflowPlacements = async (req: any, res: any, next: any) => {
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

const upateJobDependencies = async (req: any, res: any, next: any) => {
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

const initWorkflow = async (req: any, res: any, next: any) => {
  let workflow: IWorkflow | undefined;
  let firstJobsId: number[] | undefined;
  const { name, templateId, projectId } = req.body;
  try {
    workflow = await createWorkflow(req.userId, name, templateId, projectId);
    messageOneUser(req.userId, "wfs", workflow);
    if (workflow !== undefined) {
      firstJobsId = await getFirstJobs(workflow.id);
    }
    if (firstJobsId !== undefined)
      await Promise.all(
        firstJobsId.map(async (id) => {
          if (workflow !== undefined) {
            await runJob(req.userId, templateId, workflow.id, id);
          }
        })
      );
    let updatedWorkflow = await updateWorkflow(workflow!!.id, { status: "running" });
    messageOneUser(req.userId, "wfs", updatedWorkflow);
  } catch (err) {
    const error = new HttpError("Could not update job.", 500);
    return next(error);
  }

  res.status(201).json(workflow);
};

const setOutputParams = async (req: any, res: any, next: any) => {
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

const setInputParams = async (req: any, res: any, next: any) => {
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

const getJTInputParams = async (req: any, res: any, next: any) => {
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

const getJTOutputParams = async (req: any, res: any, next: any) => {
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
  createWorkflowTemplate,
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
};
