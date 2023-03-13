import { jobTemplate, PrismaClient, workflowTemplate, container } from "@prisma/client";
import { createWorkflowContainer } from "./container-services";
import { redisc } from "..";
import { IJob, ITParams, IWorkflow, IWParams } from "../types";
import { messageOneUser } from "../utils/socket";
import { checkCondtion, updateJob } from "./job-services";
import { pushParamsArgs } from "@redis/search/dist/commands";
const prisma = new PrismaClient();

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

export const createJobTemplate = async (j: jobTemplate, wtid: number, uid: number, container: container) => {
  let job: jobTemplate;
  try {
    job = await prisma.jobTemplate.create({
      data: {
        name: j.name,
        condition: j.condition,
        workflowTemplate: {
          connect: {
            id: wtid,
          },
        },
        container: {
          create: container,
        },
      },
    });
  } catch (err) {
    throw err;
  }
  return job;
};

// userId: req.userId,
// name: name.slice(1),
// image: Image,
// commands: Cmd,
// envs: Env,
// user: User,
// workingDir: WorkingDir,
