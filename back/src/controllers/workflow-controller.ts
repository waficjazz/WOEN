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

module.exports = {
  createWorkflow,
  getWorkflows,
};
