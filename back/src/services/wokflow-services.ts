import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface job {
  name: string;
  jobTemplateId: number;
  workflowId: number;
  successors: string[];
  dependencies: string[];
}

const createJobsFromTemplate = async () => {
  let jobsTemplate;
  try {
    jobsTemplate = await prisma.jobTemplate.findMany({
      where: {
        workflowTemplateId: 1,
      },
    });

    let jobs: job[] = [];
    if (jobsTemplate.length > 0)
      jobsTemplate?.map((jt, i) => {
        let jobTemplateId = jt["id"];
        let workflowId = 1;
        let name = jt["name"];
        let successors = jt["successors"];
        let dependencies = jt["dependencies"];
        jobs.push({ jobTemplateId, workflowId, name, successors, dependencies });
      });
    let response = await prisma.job.createMany({ data: jobs });
  } catch (err) {
    console.log(err);
  }
};

const runJob = async (jid: number) => {
  //// get job container
  const response = await prisma.job.findUnique({
    where: {
      id: jid,
    },
    include: {
      container: true,
    },
  });
};

module.exports = {
  createJobsFromTemplate,
};
