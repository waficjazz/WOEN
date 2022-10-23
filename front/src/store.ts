import { atom } from "jotai";
import { ISContainer } from "./Dashboard/types";

export const aJobs = atom<ISContainer[]>([]);
export const aConnect = atom(new Map());
export const aSelectedJob = atom("");
export const aShowMenu = atom("");
