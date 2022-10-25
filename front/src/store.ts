import { atom } from "jotai";
import { ISContainer, IConnection } from "./Dashboard/types";

export const aJobs = atom<ISContainer[]>([]);
export const aConnect = atom<IConnection>({});
export const aSelectedJob = atom("");
export const aShowMenu = atom("");
