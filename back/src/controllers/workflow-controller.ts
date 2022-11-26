import { PrismaClient } from "@prisma/client";
const HttpError = require("../utils/http-error");

const prisma = new PrismaClient();

// const startWorkflow =  async (req: any, res: any, next: any) => {

const getAllWorkflows = async (req: any, res: any, next: any) => {
  let workflows;
  try {
    workflows = await prisma.workflow.findMany();
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

const createWorklow = async () => {
  const workflow = await prisma.workflow.create({
    data: {
      name: "My workflow",
      workflowTemplateId: 1,
    },
  });
  console.log(workflow);
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
        jobTemplates: true,
      },
    });
  } catch (err) {
    const error = new HttpError("Something went wrong, could not find a workflow.", 500);
    return next(error);
  }
  if (!workflow) {
    const error = new HttpError("Could not find a workflow for the provided id.", 404);
    return next(error);
  }
  res.json({ workflow: workflow });
};

const createWorkflowTemplate = async (req: any, res: any, next: any) => {
  const { name } = req.body;
  let workflow;
  try {
    workflow = await prisma.workflowTemplate.create({
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

const getAllWorkflowsTemplates = async (req: any, res: any, next: any) => {
  let workflows;
  try {
    workflows = await prisma.workflowTemplate.findMany();
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

const updateWorkflowPlacements = async (req: any, res: any, next: any) => {
  const { placements } = req.body;
  const workflowId = req.params.wid;
  console.log(placements);
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
module.exports = {
  createWorklow,
  createJobTemplate,
  getWorkflowTemplate,
  createWorkflowTemplate,
  getAllWorkflowsTemplates,
  upateJobDependencies,
  updateWorkflowPlacements,
  deleteJobTemplate,
  getAllWorkflows,
};
