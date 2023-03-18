import { jobTemplate, PrismaClient, workflowTemplate, container } from "@prisma/client";
import { createWorkflowContainer } from "./container-services";
import { redisc } from "..";
import { IFJOB, IJob, ITParams, IWorkflow, IWParams } from "../types";
import { messageOneUser } from "../utils/socket";
import { checkCondtion, updateJob } from "./job-services";
import { pushParamsArgs } from "@redis/search/dist/commands";
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

export const createJobTemplate = async (j: IFJOB, wtid: number) => {
  let container: container;
  try {
    container = await prisma.container.create({
      data: {
        ...j.container,
        jobtemplates: {
          create: {
            name: j.name,
            workflowTemplateId: wtid,
          },
        },
      },
    });
  } catch (err) {
    throw err;
  }
  return container;
};

function getRoot(jobArray: IJob[]) {
  console.log(jobArray);
  let arr: string[] = [];
  jobArray.map((job) => {
    if (job.dependencies && job.dependencies.length == 0) {
      arr.push(job.name);
    }
  });
  console.log(arr);
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
  return levels;
}

interface coor {
  [key: string]: [number, number];
}
let coors: coor = {};

export const getCoords = (jobArray: IJob[]) => {
  console.log("see coors", jobArray);
  let levels = getDependencyPlacement(jobArray);
  console.log("see levels", levels);
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
  return coors;
};

// userId: req.userId,
// name: name.slice(1),
// image: Image,
// commands: Cmd,
// envs: Env,
// user: User,
// workingDir: WorkingDir,
