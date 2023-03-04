export type InputEvent = React.ChangeEvent<HTMLInputElement>;

export interface ISContainer {
  id: number;
  name: string;
  image: string;
  commands?: string[];
  envs?: string[];
  createdAt?: string;
}

export interface inputsParams {
  id?: number | string;
  name: string;
  from?: number;
  outputParamsId: number;
  jobTemplateId: number;
  outputParams?: outputsParams;
}

export interface outputsParams {
  id?: number | string;
  jobTemplateId: number;
  name: string;
  path: string;
}

export interface IJob {
  id: number;
  name: string;
  image: string;
  commands?: string[];
  dependencies?: string[];
  successors?: string[];
  status?: string;
  outputParams?: outputsParams[];
  container?: ISContainer;
  createdAt?: string;
  updatedAt?: string;
}

export interface IWJob {
  id: number;
  name: string;
  dependencies?: string[];
  successors?: string[];
  status?: string;
  createdAt: string;
  updatedAt: string;
  containerId: number;
  workflowId: number;
  jobTemplateId: number;
  startedAt?: string;
  finishedAt?: string;
  container?: ISContainer;
  exitCode?: number;
  containerInstance?: string;
}

export interface IConnection {
  [key: string]: string[] | undefined;
}

export interface IWorkflow {
  id: string;
  name: string;
  owner: string;
  status: string;
  placements?: any;
  totalJobs: number;
  completedJobs: number;
  finishedAt?: string;
  startedAt?: string;
}

export interface IPlacement {
  [key: string]: [number, number];
}

export interface IUser {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface ISignIn {
  username: string | null;
  email: string | null;
  password: string;
}

export interface IWTemplate {
  id: number | string;
  name: string;
  placements: IPlacement;
  createdAt?: string;
  updatedAt?: string;
  owner?: string;
}
export interface ICWTemplate {
  name: string;
  projectId: number;
}

export interface IProject {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IGroup {
  id?: number;
  name: string;
  owner?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
