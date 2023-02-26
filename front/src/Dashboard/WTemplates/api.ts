import Axios from "../../axios";
import { ICWTemplate, IWTemplate } from "../../types";

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

export const getSavedContainers = () => {
  return Axios.get("/containers/saved");
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

export const deleteTemplate = (id: number) => {
  return Axios.delete(`/workflow/template/${id}`);
};

export const getTemplate = (id: string) => {
  return Axios.get(`/workflow/template/${id}`);
};
