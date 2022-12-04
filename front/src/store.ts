import { atom } from "jotai";
import { IPlacement, IConnection, IJob, IUser } from "./types";

export const aJobs = atom<IJob[]>([]);
export const aConnect = atom<IConnection>({});
export const aDepends = atom<IConnection>({});
export const aSelectedJob = atom<number>(0);
export const aShowMenu = atom("");
export const aUser = atom<IUser>({} as IUser);
export const aIsLoggedIn = atom(false);
