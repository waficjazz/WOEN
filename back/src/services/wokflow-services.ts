import { PrismaClient } from "@prisma/client";

import wc from "./container-services";
const prisma = new PrismaClient();
// const containerS = require("./container-services");
interface job {
  name: string;
  jobTemplateId: number;
  containerId: number;
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
        let containerId = jt["containerId"] || 0;
        let jobTemplateId = jt["id"];
        let workflowId = 1;
        let name = jt["name"];
        let successors = jt["successors"];
        let dependencies = jt["dependencies"];
        jobs.push({ jobTemplateId, workflowId, name, successors, dependencies, containerId });
      });
    let response = await prisma.job.createMany({ data: jobs });
  } catch (err) {
    console.log(err);
  }
};

const runJob = async (jtid: number, wid: number, jid: number) => {
  //// get job container
  console.log("enter run job", jtid, wid, jid);
  let job;
  try {
    if (jid > 0) {
      job = await prisma.job.findUnique({
        where: {
          id: jid,
        },
        include: {
          container: true,
        },
      });
    } else {
      console.log("enter else in job");
      job = await prisma.job.findFirst({
        where: {
          workflowId: wid,
          jobTemplateId: jtid,
        },
        include: {
          container: true,
        },
      });
    }
    if (job) {
      let container = job.container;
      let cname = container?.name + Math.random().toString(36).substring(2, 6);
      wc.createWorkflowContainer(container!!.image, container!!.commands, cname, wid, job.id);
    }
  } catch (err) {
    return err;
  }
};

export default module.exports = {
  createJobsFromTemplate,
  runJob: runJob,
};
