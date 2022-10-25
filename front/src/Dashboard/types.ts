export interface ISContainer {
  id: string;
  name: string;
  image: string;
  commands?: string[];
}

export interface IJob {
  id: string;
  name: string;
  image: string;
  commands?: string[];
  dependencies?: string[];
  successors?: string[];
  status?: string;
}

export interface IConnection {
  [key: string]: string[];
}
