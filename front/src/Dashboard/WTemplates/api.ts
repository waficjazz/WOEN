import Axios from "../../axios";

export const initWorkflow = (data: any) => {
  return Axios.post(`/workflow/init`, data);
};

export const getAllTemplates = () => {
  return Axios.get("/workflow/all/templates");
};

export const createWorkflow = (data: any) => {
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

export const deleteTemplate = (id: number) => {
  return Axios.delete(`/workflow/template/${id}`);
};

export const getTemplate = (id: string) => {
  return Axios.get(`/workflow/template/${id}`);
};
