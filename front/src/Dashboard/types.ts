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

export interface IConnection {
  [key: string]: string[] | undefined;
}

export interface IWorkflow {
  id: string;
  name: string;
  placements?: any;
}

export interface IPlacement {
  [key: string]: [number, number];
}
