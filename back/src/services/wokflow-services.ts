import { PrismaClient } from "@prisma/client";

import wc from "./container-services";
import { redisc } from "..";

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

//create workflow jobs from job template
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
    console.log("enter test");
    if (job) {
      if (job.dependencies.length !== 0) {
        let l = await redisc.lLen(`${jtid}${wid}`);
        if (job.dependencies.length != l) return;
      }
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

const createWorklow = async () => {
  const workflow = await prisma.workflow.create({
    data: {
      name: "My workflow",
      workflowTemplateId: 1,
    },
  });
  console.log(workflow);
};

export default module.exports = {
  createWorklow,
  createJobsFromTemplate: createJobsFromTemplate,
  runJob: runJob,
};
