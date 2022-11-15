import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { join } from "path";
import ws from "./wokflow-services";
const prisma = new PrismaClient();

const createWorkflowContainer = async (
  image: string,
  CMD: string[],
  name: string,
  wid: number,
  jid: number,
  hostName?: string,
  domainName?: string
) => {
  const url = `http://localhost:2375/images/create?fromImage=${image}`;
  console.log("aaa");
  const response = await axios.post(url);
  if (!response || response.status !== 200) {
    const error = new HttpError("Could not pull image.", 500);
    return error;
  } else {
    const url = `http://localhost:2375/containers/create?name=${name}`;
    try {
      const response = await axios.post(url, {
        Hostname: hostName,
        Domainname: domainName,
        Image: image,
        Cmd: CMD,
      });
      if (!response || response.status !== 201) {
        const error = new HttpError("Could not create container.", 500);
        return error;
      }
      console.log("posted");
      runWorkflowContainer(response.data.Id, wid, jid);
    } catch (err) {
      const error = new HttpError("Could not create container.", 500);
      return error;
    }
    // }
  }
};

const waitContainer = async (containerId: string, wid: number, jid: number) => {
  try {
    console.log("waiting", jid);
    const url = `http://localhost:2375/containers/${containerId}/wait`;
    const response = await axios.post(url);
    if (!response || response.status !== 200) {
      const error = new HttpError("Could not wait for container.", 500);
      return error;
    }
    if (response.data.StatusCode === 0) {
      let job;
      try {
        job = await prisma.job.findUnique({
          where: {
            id: jid,
          },
        });
        if (job && job.successors.length > 0) {
          await Promise.all(
            job.successors.map(async (j) => {
              await ws.runJob(parseInt(j), wid, 0);
            })
          );
        } else {
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

const runWorkflowContainer = async (containerId: string, wid: number, jid: number) => {
  try {
    const url = `http://localhost:2375/containers/${containerId}/start`;
    const response = await axios.post(url);
    if (!response || response.status !== 204) {
      const error = new HttpError("Could not start container.", 500);
      return error;
    }
    waitContainer(containerId, wid, jid);
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
