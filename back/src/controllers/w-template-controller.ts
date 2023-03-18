import { Request, Response, NextFunction } from "express";
import { IFJOB, IJob, RequestWithUserId } from "../types";
import { updateJob, updateJobTemplate } from "../services/job-services";
import { jobTemplate, PrismaClient, workflowTemplate, container } from "@prisma/client";
const HttpError = require("../utils/http-error");
import { createJobTemplate, initTemplate, getCoords } from "../services/w-template-services";

const submitWorkflowTemplate = async (req: RequestWithUserId, res: Response, next: NextFunction) => {
  const { name, projectId, params, jobs } = req.body;
  let template: workflowTemplate;
  let coords = {};
  try {
    // template = await initTemplate(name, req.userId, projectId, params);
    coords = getCoords(jobs);
    console.log("coors", coords);
    await Promise.all(
      jobs.map(async (job: IFJOB) => {
        await createJobTemplate(job, template.id);
      })
    );
    //update template with placements
    //update jobs with dependencies and successors
  } catch (err) {
    const error = new HttpError("Could not create workflow template.", 500);
    console.log(err);
    return next(error);
  }
  res.status(201).json({});
};

const createWorkflowTemplate = async (req: RequestWithUserId, res: Response, next: NextFunction) => {
  const { name, projectId, params } = req.body;
  let template: workflowTemplate;
  try {
    template = await initTemplate(name, req.userId, projectId, params);
  } catch (err) {
    const error = new HttpError("Could not create workflow template.", 500);
    console.log(err);
    return next(error);
  }
  res.status(201).json(template);
};

module.exports = {
  createWorkflowTemplate,
  submitWorkflowTemplate,
};
