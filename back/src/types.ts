import { Request } from "express";

export interface RequestWithUserId extends Request {
  userId: number;
}

export interface IWorkflow {
  id: number;
  name: string;
  jobs?: any;
  status: string;
}

export interface IJob {
  name: string;
  jobTemplateId: number;
  containerId: number;
  workflowId: number;
  successors: string[];
  dependencies: string[];
}

export interface IWParams {
  name: string;
  value: any;
}
