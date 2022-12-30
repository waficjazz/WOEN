import Axios from "../../axios";

export const pauseWorkflow = (wid: string) => {
  return Axios.post(`/workflow/${wid}/pause`);
};

export const pauseJob = (jid: number) => {
  return Axios.post(`/workflow/job/${jid}/pause`);
};

export const unpauseJob = (jid: number) => {
  return Axios.post(`/workflow/job/${jid}/unpause`);
};

export const getWorkflowJobs = (wid: string) => {
  return Axios.get(`/workflow/one/${wid}`);
};

export const deleteWorkflow = (wid: string) => {
  return Axios.delete(`/workflow/one/${wid}`);
};

export const getWorkflows = () => {
  return Axios.get(`/workflow/all`);
};
