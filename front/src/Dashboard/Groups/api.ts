import Axios from "../../axios";
import { IGroup } from "../../types";

export const createGroup = (data: IGroup | undefined) => {
  return Axios.post("/user/group", data);
};

export const getGroups = () => {
  return Axios.get("/user/all/groups");
};
