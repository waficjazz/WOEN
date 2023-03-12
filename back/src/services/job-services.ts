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
  const pattern = /\bworkflow\.(\w+)([!=~]{1,2})(\w+)\b/;
  // const pattern = /\bworkflow\.[^\s]([!=~]{1,2})+\b/;
  let operator = "==";
  arr.map((e) => {
    const match = e.match(pattern);
    if (match) {
      operator = match[2];
    }
    if (pattern.test(e)) {
      cond = cond.replace(e, isWorkflowFirsEqual(wparams, e));
    }
  });
  function isWorkflowFirsEqual(wparams: any, e: string) {
    let kv = e.split("workflow.")[1].split(operator);
    let valueCheck = false;

    return wparams.some((obj: any) => {
      if (operator == "==") {
        valueCheck = obj.value === kv[1];
      }
      if (operator == "!=") {
        valueCheck = obj.value !== kv[1];
      }
      if (obj.name === kv[0]) {
        return valueCheck;
      }
      return false;
    });
  }
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
