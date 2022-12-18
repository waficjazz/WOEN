import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { runJob, updateWorkflowStatus } from "./wokflow-services";
import { redisc } from "..";
import { io } from "../index";
import { messageOneUser } from "../utils/socket";
import { updateJobStatus } from "./job-services";
const HttpError = require("../utils/http-error");

const prisma = new PrismaClient();

const createWorkflowContainer = async (
  uid: number,
  image: string,
  CMD: string[],
  name: string,
  wid: number,
  jid: number,
  hostName?: string,
  domainName?: string
) => {
  const url = `http://localhost:2375/images/create?fromImage=${image}`;
  try {
    const response = await axios.post(url);
    if (!response || response.status !== 200) {
      console.log("err");
    } else {
      const url = `http://localhost:2375/containers/create?name=${name}`;
      const response = await axios.post(url, {
        Hostname: hostName,
        Domainname: domainName,
        Image: image,
        Cmd: CMD,
      });
      if (!response || response.status !== 201) {
        console.log("error2");
      }
      runWorkflowContainer(uid, response.data.Id, wid, jid);
    }
  } catch (err) {
    console.log(err);
  }
};

const waitContainer = async (uid: number, containerId: string, wid: number, jid: number) => {
  try {
    const url = `http://localhost:2375/containers/${containerId}/wait`;
    const response = await axios.post(url);
    if (!response || response.status !== 200) {
      const error = new HttpError("Could not wait for container.", 500);
      return error;
    }
    if (response.data.StatusCode === 0) {
      /// add redis check if job is retry
      let workflow = await prisma.workflow.findUnique({
        where: {
          id: wid,
        },
      });
      let completed = workflow!!.completedJobs + 1;
      let updatedWorkflow = await updateWorkflowStatus(wid, { completedJobs: completed });
      if (updatedWorkflow)
        if (updatedWorkflow.totalJobs === completed) {
          let finishedWorkflow = await updateWorkflowStatus(wid, { status: "finished", finishedAt: new Date() });
          messageOneUser(uid, "wfs", finishedWorkflow);
        } else {
          messageOneUser(uid, "wfs", updatedWorkflow);
        }
      let job;
      try {
        job = await prisma.job.findUnique({
          where: {
            id: jid,
          },
        });
        if (job && job.successors.length > 0) {
          if (!redisc.isOpen) await redisc.connect();
          await Promise.all(
            job.successors.map(async (j) => {
              await redisc.lPush(`${j}${wid}`, jid.toString());
              let job = await updateJobStatus(jid, "finished");
              messageOneUser(uid, `w${wid.toString()}`, job);
              // io.emit(`w${wid.toString()}`, job);
              await runJob(uid, parseInt(j), wid, 0);
            })
          );
          await redisc.disconnect();
        } else {
          let job = await updateJobStatus(jid, "finished");
          // io.emit(`w${wid.toString()}`, job);
          messageOneUser(uid, `w${wid.toString()}`, job);
          console.log("done");
        }
      } catch (err) {
        return err;
      }
    }
  } catch (err) {
    const error = new HttpError("Could not wait for container.", 500);
    return error;
  }
};

const runWorkflowContainer = async (uid: number, containerId: string, wid: number, jid: number) => {
  try {
    // io.emit(`w${wid.toString()}`, job);
    const url = `http://localhost:2375/containers/${containerId}/start`;
    const response = await axios.post(url);
    if (!response || response.status !== 204) {
      const error = new HttpError("Could not start container.", 500);
      return error;
    }
    let job = await updateJobStatus(jid, "running");
    messageOneUser(uid, `w${wid.toString()}`, job);
    waitContainer(uid, containerId, wid, jid);
  } catch (err) {
    const error = new HttpError("Could not start container.", 500);
    return error;
  }
};

export default module.exports = {
  createWorkflowContainer: createWorkflowContainer,
  runWorkflowContainer,
  waitContainer,
};
