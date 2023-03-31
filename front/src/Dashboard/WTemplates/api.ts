import Axios from "../../axios";
import { ICWTemplate, ITemplateParam, IWTemplate } from "../../types";

export const initWorkflow = (data: any) => {
  return Axios.post(`/workflow/init`, data);
};

export const getAllTemplates = (pid: number) => {
  return Axios.get(`/workflow/all/templates/${pid}`);
};

export const createWorkflow = (data: ICWTemplate) => {
  return Axios.post("/workflow/create", data);
};

export const createJob = (data: any) => {
  return Axios.post("/workflow/job/create", data);
};

export const updateJob = (data: any) => {
  return Axios.post("/workflow/job/update", data);
};

export const getSavedContainers = (pid: number) => {
  return Axios.get(`/containers/saved/${pid}`);
};

export const updatePlacements = (id: string, data: any) => {
  return Axios.post(`/workflow/${id}/placement`, data);
};

export const setOutParams = (data: any) => {
  return Axios.post("/workflow/job/outParams", { params: data });
};

export const getOutParams = (jtid: number) => {
  return Axios.get(`/workflow/job/outParams/${jtid}`);
};

export const setInParams = (data: any) => {
  return Axios.post("/workflow/job/inParams", { params: data });
};

export const getInParams = (jtid: number) => {
  return Axios.get(`/workflow/job/inParams/${jtid}`);
};

export const deleteTemplate = (id: string) => {
  return Axios.delete(`/workflow/template/${id}`);
};

export const deleteJobTemplate = (id: number) => {
  return Axios.delete(`/workflow/jobtemplate/${id}`);
};

export const getTemplate = (id: string) => {
  return Axios.get(`/workflow/template/${id}`);
};

export const addWorkflowParam = (data: ITemplateParam[]) => {
  return Axios.post("/workflow/addParams", { params: data });
};

export const setCondition = (id: string, condition: string) => {
  return Axios.post(`/workflow/job/${id}/setCond`, { condition });
};
