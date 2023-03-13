import { Request, Response, NextFunction } from "express";
import { PrismaClient, STATUS } from "@prisma/client";
import { createWorkflow, getFirstJobs, runJob, updateWorkflow } from "../services/wokflow-services";
import { pauseContainer, unpauseContainer, waitContainer } from "../services/container-services";
import { messageOneUser } from "../utils/socket";
import { IWorkflow, RequestWithUserId } from "../types";
import { updateJob, updateJobTemplate } from "../services/job-services";
const HttpError = require("../utils/http-error");
import { initTemplate } from "../services/w-template-services";

const createWorkflowTemplate = async (req: RequestWithUserId, res: Response, next: NextFunction) => {
  const { name, projectId, params } = req.body;
  let workflow;
  try {
    workflow = await initTemplate(name, req.userId, projectId, params);
  } catch (err) {
    const error = new HttpError("Could not create workflow template.", 500);
    return next(error);
  }
  res.status(201).json(workflow);
};

module.exports = {
  createWorkflowTemplate,
};
