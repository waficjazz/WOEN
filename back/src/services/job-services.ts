import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const updateJob = async (jid: number, data: any) => {
  try {
    let job = await prisma.job.update({
      where: {
        id: jid,
      },
      data,
    });
    return job;
  } catch (err) {
    console.log(err);
  }
};
