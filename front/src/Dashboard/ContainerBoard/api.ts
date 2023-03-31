import Axios from "../../axios";

export const getContainers = (pid: number) => {
  return Axios.get(`/containers/saved/${pid}`);
};
