import { PrismaClient } from "@prisma/client";
const HttpError = require("../utils/http-error");

const prisma = new PrismaClient();

const createWorkflow = async (req: any, res: any, next: any) => {
  const { name } = req.body;
  let workflow;
  try {
    workflow = await prisma.workflow.create({
      data: {
        name,
      },
    });
  } catch (err) {
    const error = new HttpError("Could not create workflow.", 500);
    return next(error);
  }
  res.status(201).json(workflow);
};

const getWorkflows = async (req: any, res: any, next: any) => {
  try {
    const workflows = await prisma.workflow.findMany();
    if (workflows.length === 0) {
      const error = new HttpError("Could not find workflows.", 404);
      return next(error);
    }
    res.status(200).json(workflows);
  } catch (err) {
    const error = new HttpError("Could not get workflows.", 500);
    return next(error);
  }
};

const createJob = async (req: any, res: any, next: any) => {
  const { name, workflowId, containerId } = req.body;
  try {
    const job = await prisma.job.create({
      data: {
        name,
        workflowId,
        containerId,
      },
    });
    // if (!job) {
    //   const error = new HttpError("Could not create job.", 500);
    //   return next(error);
    // }
    res.status(201).json(job);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Could not create job.", 500);
    return next(error);
  }
};

const getWorkflowJobs = async (req: any, res: any, next: any) => {
  const workflowId = req.params.wid;
  try {
    const jobs = await prisma.job.findMany({
      where: {
        workflowId: parseInt(workflowId),
      },
    });
    res.status(200).json(jobs);
  } catch (err) {
    const error = new HttpError("Could not get jobs.", 500);
    return next(error);
  }
};

const upateJobDependencies = async (req: any, res: any, next: any) => {
  const { jobId, successors, dependencies } = req.body;
  try {
    const job = await prisma.job.update({
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
module.exports = {
  createJob,
  createWorkflow,
  getWorkflows,
  upateJobDependencies,
  getWorkflowJobs,
};
