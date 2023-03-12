import { PrismaClient, STATUS } from "@prisma/client";
import axios from "axios";
const tar = require("tar");
const stream = require("stream");
import { runJob, updateWorkflow } from "./wokflow-services";
import { redisc } from "..";
import { io } from "../index";
import { messageOneUser } from "../utils/socket";
import { updateJob, saveOutputParamsValue } from "./job-services";
import { IWParams } from "../types";
const HttpError = require("../utils/http-error");

const prisma = new PrismaClient();

export const createWorkflowContainer = async (
  uid: number,
  wparams: IWParams[] | null,
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
      //TO DO// separate run workflow from create &&  commun funcition for job and container
      let job = await updateJob(jid, { containerInstance: response.data.Id });
      if (job?.status !== STATUS.skiped) runWorkflowContainer(uid, response.data.Id, wid, jid, wparams);
    }
  } catch (err) {
    console.log(err);
  }
};

export const waitContainer = async (uid: number, containerId: string, wid: number, jid: number, wparams: IWParams[] | null) => {
  let exitCode: number;
  try {
    const url = `http://localhost:2375/containers/${containerId}/wait`;
    const response = await axios.post(url);
    if (!response || response.status !== 200) {
      const error = new HttpError("Could not wait for container.", 500);
      return error;
    }
    if (response.data) {
      exitCode = response.data.StatusCode;
      await updateJob(jid, { finishedAt: new Date() });
      if (exitCode === 0) {
        /// add redis check if job is retry

        let workflow = await prisma.workflow.findUnique({
          where: {
            id: wid,
          },
        });
        let completed = workflow!!.completedJobs + 1;
        let updatedWorkflow = await updateWorkflow(wid, { completedJobs: completed });
        if (updatedWorkflow)
          if (updatedWorkflow.totalJobs === completed) {
            let finishedWorkflow = await updateWorkflow(wid, { status: STATUS.success, finishedAt: new Date() });
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
            include: {
              jobTemplate: {
                include: {
                  outputParams: true,
                },
              },
            },
          });
          if (job) if (job.jobTemplate?.outputParams) await saveOutputParamsValue(containerId, job.jobTemplate?.outputParams, jid, wid);
          if (job && job.successors.length > 0) {
            if (!redisc.isOpen) await redisc.connect();

            await Promise.all(
              job.successors.map(async (j) => {
                /// successsor job id are template ids
                // TODO check for duplictate entry as multple wait could exist for same conatainer
                await redisc.lPush(`${j}${wid}`, jid.toString());

                //// check below two line if moved outside loop parallele job does not update
                let uJob = await updateJob(jid, { status: STATUS.success, exitCode: exitCode });
                messageOneUser(uid, `w${wid.toString()}`, uJob);
                await runJob(uid, parseInt(j), wid, 0, wparams);
              })
            );
            await redisc.disconnect();
          } else {
            let job = await updateJob(jid, { status: STATUS.success, exitCode: exitCode });
            // io.emit(`w${wid.toString()}`, job);
            messageOneUser(uid, `w${wid.toString()}`, job);
            console.log("done");
          }
        } catch (err) {
          return err;
        }
      } else {
        let fJob = await updateJob(jid, { status: STATUS.failed, exitCode: exitCode });
        messageOneUser(uid, `w${wid.toString()}`, fJob);
      }
    }
  } catch (err) {
    const error = new HttpError("Could not wait for container.", 500);
    return error;
  }
};

export const pauseContainer = async (containerId: string) => {
  try {
    const url = `http://localhost:2375/containers/${containerId}/pause`;
    const response = await axios.post(url);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const unpauseContainer = async (containerId: string) => {
  try {
    const url = `http://localhost:2375/containers/${containerId}/unpause`;
    const response = await axios.post(url);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getArchive = async (containerId: string, path: string): Promise<string> => {
  try {
    const url = `http://localhost:2375/containers/${containerId}/archive?path=${path}`;
    const response = await axios.get(url, { responseType: "stream" });
    const tarParser = new tar.Parse();
    const contentStream = new stream.Writable();
    let content = "";
    contentStream._write = function (chunk: any, encoding: any, done: any) {
      content += chunk.toString();
      done();
    };
    response.data.pipe(tarParser).on("entry", function (entry: any) {
      entry.pipe(contentStream);
    });
    return new Promise<string>((resolve) => {
      response.data.on("end", function () {
        resolve(content);
      });
    });
  } catch (err) {
    console.log(err);
    return err as any;
  }
};

const runWorkflowContainer = async (uid: number, containerId: string, wid: number, jid: number, wparams: IWParams[] | null) => {
  try {
    // io.emit(`w${wid.toString()}`, job);
    const url = `http://localhost:2375/containers/${containerId}/start`;
    const response = await axios.post(url);
    if (!response || response.status !== 204) {
      const error = new HttpError("Could not start container.", 500);
      return error;
    }
    let job = await updateJob(jid, { status: STATUS.running, startedAt: new Date() });
    messageOneUser(uid, `w${wid.toString()}`, job);
    waitContainer(uid, containerId, wid, jid, wparams);
  } catch (err) {
    const error = new HttpError("Could not start container.", 500);
    return error;
  }
};
