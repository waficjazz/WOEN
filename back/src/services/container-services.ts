import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { runJob } from "./wokflow-services";
import { redisc } from "..";
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
      runWorkflowContainer(response.data.Id, wid, jid);
    }
  } catch (err) {
    console.log(err);
  }
};

const waitContainer = async (containerId: string, wid: number, jid: number) => {
  try {
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
          await redisc.connect();
          await Promise.all(
            job.successors.map(async (j) => {
              await redisc.lPush(`${j}${wid}`, jid.toString());
              await runJob(parseInt(j), wid, 0);
            })
          );
          await redisc.disconnect();
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
