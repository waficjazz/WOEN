import Axios from "../../axios";
import { IProject } from "../../types";

export const userSignUp = (data?: IProject) => {
  return Axios.post("/user/project", data);
};
