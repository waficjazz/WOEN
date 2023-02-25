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

export const saveOutputParams = async (containerId: string, outputParams: any, jid: number) => {
  try {
    if (outputParams) {
      outputParams.map(async (param: any) => {
        let value = await getArchive(containerId, param.path);
        console.log(value);
        await prisma.outputParamsValue.create({
          data: {
            outputParamsId: param.id,
            value: value,
            jobId: jid,
          },
        });
      });
    }
  } catch (err) {
    console.log(err);
  }
};
