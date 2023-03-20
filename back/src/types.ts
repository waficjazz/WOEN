import { STATUS } from "@prisma/client";
import { Request } from "express";
import { jobTemplate, PrismaClient, outputParams, container } from "@prisma/client";

export interface RequestWithUserId extends Request {
  userId: number;
}

export interface IWorkflow {
  id: number;
  name: string;
  jobs?: any;
  status: string;
  workflowParam?: IWParams[];
}

export interface IJob {
  name: string;
  jobTemplateId: number;
  containerId: number;
  workflowId: number;
  successors: string[];
  dependencies: string[];
  status: STATUS;
}

export interface IWParams {
  name: string;
  value: any;
}

export interface ITParams {
  name: string;
  default: string;
}

export interface ISworkflowTemplate {
  name: string;
  params?: IWParams[];
}

export interface outputsCreate {
  name: string;
  path: string;
}
export interface inputsCreate {
  name: string;
  from?: string;
  outputParamsId: number;
  jobTemplateId: number;
}

export interface IFJOB extends jobTemplate {
  container: container;
  outputs?: outputsCreate[];
  inputs?: inputsCreate[];
}
