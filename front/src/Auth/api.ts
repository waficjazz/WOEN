import Axios from "../axios";
import { IUser } from "../types";

export const userSignUp = (data: IUser) => {
  return Axios.post("/user/signup", data);
};
