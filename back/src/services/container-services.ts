import { PrismaClient } from "@prisma/client";
import axios from "axios";
const prisma = new PrismaClient();

const createWorkflowContainer = async (image: string, CMD: string, name: string, hostName: string, domainName: string) => {
  const url = `http://localhost:2375/images/create?fromImage=${image}`;
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
      runWorkflowContainer(response.data.Id);
    } catch (err) {
      const error = new HttpError("Could not create container.", 500);
      return error;
    }
    // }
  }
};

const waitContainer = async (containerId: string) => {
  try {
    const url = `http://localhost:2375/containers/${containerId}/wait`;
    const response = await axios.post(url);
    if (!response || response.status !== 200) {
      const error = new HttpError("Could not wait for container.", 500);
      return error;
    }
    if (response.data.StatusCode === 0) console.log("finished");
  } catch (err) {
    const error = new HttpError("Could not wait for container.", 500);
    return error;
  }
};

const runWorkflowContainer = async (containerId: string) => {
  try {
    const url = `http://localhost:2375/containers/${containerId}/start`;
    const response = await axios.post(url);
    if (!response || response.status !== 204) {
      const error = new HttpError("Could not start container.", 500);
      return error;
    }
    waitContainer(containerId);
  } catch (err) {
    const error = new HttpError("Could not start container.", 500);
    return error;
  }
};

module.exports = {
  createWorkflowContainer,
  runWorkflowContainer,
  waitContainer,
};
