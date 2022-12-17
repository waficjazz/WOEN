export type InputEvent = React.ChangeEvent<HTMLInputElement>;

export interface ISContainer {
  id: number;
  name: string;
  image: string;
  commands?: string[];
}

export interface IJob {
  id: number;
  name: string;
  image: string;
  commands?: string[];
  dependencies?: string[];
  successors?: string[];
  status?: string;
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
}

export interface IConnection {
  [key: string]: string[] | undefined;
}

export interface IWorkflow {
  id: string;
  name: string;
  owner: any;
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
  password?: string;
  confirmPassword?: string;
}
