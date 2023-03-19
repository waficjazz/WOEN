import { jobTemplate, PrismaClient, workflowTemplate, container } from "@prisma/client";
import { createWorkflowContainer } from "./container-services";
import { redisc } from "..";
import { IFJOB, IJob, ITParams, IWorkflow, IWParams } from "../types";
import { messageOneUser } from "../utils/socket";
import { checkCondtion, updateJob } from "./job-services";
import { pushParamsArgs } from "@redis/search/dist/commands";
import { Key } from "readline";
const prisma = new PrismaClient();

let drawed: string[] = [];
interface succers {
  [key: string]: string[];
}

type Placement = [number, number];
let levels: Levels = {};
interface Levels {
  [key: number]: string[];
}

export const initTemplate = async (name: string, uid: number, projectId: number, params: ITParams[]) => {
  let workflow: workflowTemplate;
  try {
    const data: any = {
      name,
      projectId,
      userId: uid,
    };
    if (params && params.length > 0) {
      data.parameters = {
        createMany: {
          data: params,
          skipDuplicates: true,
        },
      };
    }
    workflow = await prisma.workflowTemplate.create({
      data,
    });
  } catch (err) {
    throw err;
  }
  return workflow;
};

export const updateTemplate = async (tid: number, data: any) => {
  let template: workflowTemplate;
  try {
    template = await prisma.workflowTemplate.update({
      where: {
        id: tid,
      },
      data,
    });
  } catch (err) {
    throw err;
  }
  return template;
};

export const createJobTemplate = async (j: IFJOB, wtid: number) => {
  let container: container;
  let jobTemplate: jobTemplate;
  try {
    container = await prisma.container.create({
      data: {
        ...j.container,
      },
    });
    jobTemplate = await prisma.jobTemplate.create({
      data: {
        name: j.name,
        workflowTemplateId: wtid,
        containerId: container.id,
        outputParams: {
          createMany: {
            data: j.outputs ?? [],
          },
        },
      },
    });
  } catch (err) {
    throw err;
  }
  return jobTemplate;
};

function getRoot(jobArray: IJob[]) {
  let arr: string[] = [];
  jobArray.map((job) => {
    if (job.dependencies && job.dependencies.length == 0) {
      arr.push(job.name);
    }
  });
  return arr;
}

function getDependencyPlacement(jobArray: IJob[]) {
  let succers: succers = {};
  jobArray.map((job) => {
    if (job.dependencies) {
      job.dependencies.map((dep) => {
        if (succers[dep]) succers[dep] = [...succers[dep], job.name];
        else succers[dep] = [job.name];
      });
    }
  });
  let root = getRoot(jobArray);
  let tmp: string[] = [];
  let i = 0;
  levels[0] = root;
  let nextLevel: string[] = [];
  nextLevel = nextLevel.concat(root);
  while (nextLevel.length > 0) {
    tmp = [];
    i++;
    nextLevel.forEach((element) => {
      if (succers === undefined) return 0;
      if (succers[element] !== undefined) {
        tmp = tmp.concat(succers[element]);
      }
    });
    levels[i] = [...new Set(tmp)];
    nextLevel = tmp;
  }
  Object.entries(levels).forEach(([key, value]) => {
    value.forEach((e: string) => {
      if (!drawed.includes(e)) {
        drawed.push(e);
      } else {
        Object.entries(levels).forEach(([key1, value1]) => {
          value1.forEach((e1: string) => {
            if (key !== key1) {
              if (e1 === e) {
                value1.splice(value1.indexOf(e1), 1);
              }
            }
          });
        });
      }
    });
  });
  return { levels, succers };
}

interface coor {
  [key: string]: [number, number];
}

export const getCoords = (jobArray: IJob[]): { coors: coor; succers: succers } => {
  let coors: coor = {};
  let { levels, succers } = getDependencyPlacement(jobArray);
  Object.entries(levels).forEach(([key, value]) => {
    let x = 0;
    value.map((val: string, i: number) => {
      if (val && key) {
        coors[val] = [x, Number(key)];
        if (i % 2 == 0) {
          x++;
        }
        x = x * -1;
      }
    });
  });
  return { coors, succers };
};

// userId: req.userId,
// name: name.slice(1),
// image: Image,
// commands: Cmd,
// envs: Env,
// user: User,
// workingDir: WorkingDir,
