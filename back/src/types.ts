import { STATUS } from "@prisma/client";
import { Request } from "express";

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
