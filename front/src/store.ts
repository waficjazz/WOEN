import { atom } from "jotai";
import { ISContainer, IConnection, IJob } from "./Dashboard/types";

export const aJobs = atom<IJob[]>([]);
export const aConnect = atom<IConnection>({});
export const aDepends = atom<IConnection>({});
export const aSelectedJob = atom<number>(0);
export const aShowMenu = atom("");
