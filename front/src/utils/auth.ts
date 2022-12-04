import { IUser } from "../types";

export const updateUser = (token: string, user: IUser) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  return {
    token,
    user: user ? JSON.parse(user) : null,
  };
};

export const removeUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
