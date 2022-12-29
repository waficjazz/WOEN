import Axios from "../../axios";

export const pauseWorkflow = (wid: string) => {
  return Axios.post(`/workflow/${wid}/pause`);
};

export const pauseJob = (jid: number) => {
  return Axios.post(`/workflow/job/${jid}/pause`);
};
