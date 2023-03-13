import { Prisma, PrismaClient, STATUS } from "@prisma/client";
import { createWorkflowContainer } from "./container-services";
import { redisc } from "..";
import { IJob, ITParams, IWorkflow, IWParams } from "../types";
import { messageOneUser } from "../utils/socket";
import { checkCondtion, updateJob } from "./job-services";
import { pushParamsArgs } from "@redis/search/dist/commands";
const prisma = new PrismaClient();

export const createWorkflowTemplate = async (name: string, uid: number, projectId: number, params: ITParams[]) => {
  let workflow;
  try {
    workflow = await prisma.workflowTemplate.create({
      data: {
        name,
        projectId,
        userId: uid,
        parameters: {
          createMany: {
            data: params,
            skipDuplicates: true,
          },
        },
      },
    });
  } catch (err) {
    const error = new HttpError("Could not create workflow.", 500);
    return error;
  }
  return workflow;
};
