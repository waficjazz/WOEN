import Axios from "../../axios";

export const getContainers = () => {
  return Axios.get("/containers/saved");
};
