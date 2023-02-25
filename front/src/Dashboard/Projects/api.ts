import Axios from "../../axios";
import { IProject } from "../../types";

export const createProject = (data?: IProject) => {
  return Axios.post("/user/project", data);
};

export const getProjects = () => {
  return Axios.get("/user/all/projects");
};
