import { PrismaClient } from "@prisma/client";
import { getArchive } from "./container-services";
const prisma = new PrismaClient();

export const updateJob = async (jid: number, data: any) => {
  try {
    let job = await prisma.job.update({
      where: {
        id: jid,
      },
      include: {
        container: true,
      },
      data,
    });
    return job;
  } catch (err) {
    console.log(err);
  }
};

export const updateJobTemplate = async (jtid: number, data: any) => {
  try {
    let job = await prisma.jobTemplate.update({
      where: {
        id: jtid,
      },
      data,
    });
    return job;
  } catch (err) {
    console.log(err);
  }
};

export const checkCondtion = (cond: string, wparams: any) => {
  let arr = cond.split(/\s+/);
  console.log(cond, wparams);
  arr.map((e) => {
    if (/\bworkflow\.[^\s]+\b/.test(e)) {
      cond = cond.replace(e, isWorkflowFirsEqual(wparams, e));
    }
  });
  function isWorkflowFirsEqual(wparams: any, e: string) {
    let kv = e.split("workflow.")[1].split("==");
    console.log(kv);
    return wparams.some((obj: any) => obj.name === kv[0] && obj.value === kv[1]);
  }

  console.log(cond, eval(cond));
  return eval(cond);
};

export const saveOutputParamsValue = async (containerId: string, outputParams: any, jid: number, wid: number) => {
  try {
    if (outputParams) {
      await Promise.all(
        outputParams.map(async (param: any) => {
          let value = await getArchive(containerId, param.path);
          await prisma.outputParamsValue.create({
            data: {
              outputParamsId: param.id,
              value: value,
              jobId: jid,
              workflowId: wid,
            },
          });
        })
      );
    }
  } catch (err) {
    console.log(err);
  }
};
