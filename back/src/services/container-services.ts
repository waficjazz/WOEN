import { PrismaClient, STATUS } from "@prisma/client";
import axios from "axios";
const tar = require("tar");
const stream = require("stream");
import { runJob, triggerNextJobs, updateWorkflow } from "./wokflow-services";
import { redisc } from "..";
import { io } from "../index";
import { messageOneUser } from "../utils/socket";
import { updateJob, saveOutputParamsValue } from "./job-services";
import { IJob, IWParams } from "../types";
const HttpError = require("../utils/http-error");
const DHOST = process.env.DHOST || "localhost";
const DPORT = process.env.DPORT || "2375";

const prisma = new PrismaClient();

export const createWorkflowContainer = async (
  uid: number,
  wparams: IWParams[] | null | undefined,
  image: string,
  CMD: string[],
  name: string,
  wid: number,
  jid: number,
  hostName?: string,
  domainName?: string
) => {
  const [imageName, tag] = image.split(":");
  const finalTag = tag ? tag : "latest";
  const url = `http://${DHOST}:${DPORT}/images/create?fromImage=${imageName}&tag=${finalTag}`;
  try {
    console.log("before respponse");
    const response = await axios.post(url);
    console.log("after respponse", response);
    if (!response || response.status !== 200) {
      console.log("err");
    } else {
      const url = `http://${DHOST}:${DPORT}/containers/create?name=${name}`;
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
      await updateJob(jid, { containerInstance: response.data.Id });
      runWorkflowContainer(uid, response.data.Id, wid, jid, wparams);
    }
  } catch (err) {
    throw err;
  }
};

export const waitContainer = async (uid: number, containerId: string, wid: number, jid: number, wparams: IWParams[] | null | undefined) => {
  let exitCode: number;
  try {
    const url = `http://${DHOST}:${DPORT}/containers/${containerId}/wait`;
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

        let uJob = await updateJob(jid, { status: STATUS.success, exitCode: exitCode });
        await messageOneUser(uid, `w${wid.toString()}`, uJob);

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
            await triggerNextJobs(uid, job as IJob, wid, job.id, wparams);
          }
        } catch (err) {
          throw err;
        }
      } else {
        const fJob = await updateJob(jid, { status: STATUS.failed, exitCode: exitCode });
        messageOneUser(uid, `w${wid.toString()}`, fJob);
        const fWorkflow = await updateWorkflow(wid, { status: STATUS.failed, finishedAt: new Date() });
        messageOneUser(uid, "wfs", fWorkflow);
      }
    }
  } catch (err) {
    const error = new HttpError("Could not wait for container.", 500);
    throw err;
  }
};

export const pauseContainer = async (containerId: string) => {
  try {
    const url = `http://${DHOST}:${DPORT}/containers/${containerId}/pause`;
    const response = await axios.post(url);
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const unpauseContainer = async (containerId: string) => {
  try {
    const url = `http://${DHOST}:${DPORT}/containers/${containerId}/unpause`;
    const response = await axios.post(url);
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getArchive = async (containerId: string, path: string): Promise<string> => {
  try {
    const url = `http://${DHOST}:${DPORT}/containers/${containerId}/archive?path=${path}`;
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
    throw err;
  }
};

const runWorkflowContainer = async (uid: number, containerId: string, wid: number, jid: number, wparams: IWParams[] | null | undefined) => {
  try {
    // io.emit(`w${wid.toString()}`, job);
    const url = `http://${DHOST}:${DPORT}/containers/${containerId}/start`;
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
    throw error;
  }
};
