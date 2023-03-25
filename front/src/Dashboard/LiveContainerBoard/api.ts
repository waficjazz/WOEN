import Axios from "../../axios";

export const getContainers = () => {
  return Axios.get("/containers/list");
};

export const removeContainer = (data: any) => {
  return Axios.delete("/containers/remove", { data: data });
};

export const createContainer = (data: any) => {
  return Axios.post("/containers/create", data);
};

export const conatainerLogs = (data: any) => {
  return Axios.post("/containers/logs", data);
};

export const containerSaveLive = (data: any) => {
  return Axios.post("/containers/saveLive", data);
};

export const containerSave = (data: any) => {
  return Axios.post("/containers/save", { container: data });
};

export const containerPause = (data: any) => {
  return Axios.post("/containers/pause", data);
};

export const containerUnpause = (data: any) => {
  return Axios.post("/containers/unpause", data);
};

export const containerRun = (data: any) => {
  return Axios.post("/containers/run", data);
};
