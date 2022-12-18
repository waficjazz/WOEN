import { PrismaClient } from "@prisma/client";
import { createWorkflow, getFirstJobs, runJob, updateWorkflowStatus } from "../services/wokflow-services";
import { messageOneUser } from "../utils/socket";
import { IWorkflow } from "../types";
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
        userId: req.userId,
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
        jobTemplates: true,
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
        jobs: true,
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

  const { name } = req.body;
  let workflow;
  try {
    workflow = await prisma.workflowTemplate.create({
      data: {
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
        userId: req.userId,
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
  const { name, templateId } = req.body;
  try {
    workflow = await createWorkflow(req.userId, name, templateId);
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
    let updatedWorkflow = await updateWorkflowStatus(workflow!!.id, { status: "running" });
    messageOneUser(req.userId, "wfs", updatedWorkflow);
  } catch (err) {
    console.log(err);
    const error = new HttpError("Could not update job.", 500);
    return next(error);
  }

  res.status(201).json(workflow);
};

module.exports = {
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
};
