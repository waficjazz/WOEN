import { jobTemplate, PrismaClient, workflowTemplate, container } from "@prisma/client";
import { createWorkflowContainer } from "./container-services";
import { redisc } from "..";
import { IFJOB, IJob, ITParams, IWorkflow, IWParams } from "../types";
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

// userId: req.userId,
// name: name.slice(1),
// image: Image,
// commands: Cmd,
// envs: Env,
// user: User,
// workingDir: WorkingDir,
