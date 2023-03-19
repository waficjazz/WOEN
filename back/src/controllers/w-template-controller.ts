import { Request, Response, NextFunction } from "express";
import { IFJOB, IJob, RequestWithUserId } from "../types";
import { updateJob, updateJobTemplate } from "../services/job-services";
import { jobTemplate, PrismaClient, workflowTemplate, container } from "@prisma/client";
const HttpError = require("../utils/http-error");
import { createJobTemplate, initTemplate, getCoords, updateTemplate } from "../services/w-template-services";

const submitWorkflowTemplate = async (req: RequestWithUserId, res: Response, next: NextFunction) => {
  const { name, projectId, params, jobs } = req.body;
  let template: workflowTemplate;
  let jobMapping: { [key: string]: number } = {};
  // let coords;
  try {
    template = await initTemplate(name, req.userId, projectId, params);
    const { coors, succers } = getCoords(jobs);
    await Promise.all(
      jobs.map(async (j: IFJOB) => {
        let job = await createJobTemplate(j, template.id);
        jobMapping[job.name] = job.id;
      })
    );
    let placements: { [key: string]: [number, number] } = {};
    Object.entries(coors).map(([key, value]) => {
      let k = jobMapping[key].toString();
      placements[k] = value;
    });
    await updateTemplate(template.id, { placements });
    await Promise.all(
      jobs.map(async (j: IFJOB) => {
        let dependencies = j.dependencies?.map((dep) => {
          return jobMapping[dep].toString();
        });
        let successors = succers[j.name]?.map((succ) => {
          return jobMapping[succ].toString();
        });
        await updateJobTemplate(jobMapping[j.name], { successors: successors || [], dependencies: dependencies || [] });
      })
    );
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
