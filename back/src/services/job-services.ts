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
    throw err;
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
    throw err;
  }
};

export const checkCondtion = (cond: string, wparams: any, inparams?: any) => {
  ////handle double quotes from front as well as add automatic spaces
  let arr = cond.split(/\s+/);
  const pattern1 = /\bworkflow\.(\w+)([!=~]{1,2})(\w+)\b/;
  const pattern2 = /\binputs\.(\w+)([!=~]{1,2})(\w+)\b/;
  const opPattern = /(\w+)([!=~]{1,2})(\w+)/;
  // const pattern = /\bworkflow\.[^\s]([!=~]{1,2})+\b/;
  let operator = "==";
  arr.map((e) => {
    const match = e.match(opPattern);
    if (match) {
      operator = match[2];
    }
    if (pattern1.test(e)) {
      cond = cond.replace(e, isPresent(wparams, e, "workflow."));
    }
    if (pattern2.test(e)) {
      if (!inparams || inparams.length == 0) cond = cond.replace(e, "true");
      else {
        cond = cond.replace(e, isPresent(inparams, e, "inputs."));
      }
    }
  });
  function isPresent(wparams: any, e: string, type: "workflow." | "inputs.") {
    let kv = e.split(type)[1].split(operator);
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
              value: value.slice(0, -1), //remove the \n
              jobId: jid,
              workflowId: wid,
            },
          });
        })
      );
    }
  } catch (err) {
    throw err;
  }
};
