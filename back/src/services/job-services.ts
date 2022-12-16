import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const updateJobStatus = async (jid: number, status: string) => {
  try {
    let job = await prisma.job.update({
      where: {
        id: jid,
      },
      data: {
        status: status,
      },
    });
    return job;
  } catch (err) {
    console.log(err);
  }
};
