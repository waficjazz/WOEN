import Axios from "../axios";
import { IUser, ISignIn } from "../types";

export const userSignUp = (data: IUser) => {
  return Axios.post("/user/signup", data);
};

export const userSignIn = (data: ISignIn) => {
  return Axios.post("/user/login", data);
};
