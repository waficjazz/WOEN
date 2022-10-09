import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const HttpError = require("../utils/http-error");

const listImages = async (req: any, res: any, next: any) => {
  const { host, port } = req.body;
  const url = `http://${host}:${port}/images/json`;
  const response = await axios.get(url);
  if (!response || response.status !== 200) {
    const error = new HttpError("Could not get images.", 500);
    return next(error);
  }
  if (response.data.length === 0) {
    const error = new HttpError("No images found.", 404);
    return next(error);
  }
  res.status(200).json({ images: response.data });
};

const listContainers = async (req: any, res: any, next: any) => {
  const { host, port } = req.body;
  const url = `http://localhost:2375/containers/json?all=true`;
  const response = await axios.get(url);
  if (!response || response.status !== 200) {
    const error = new HttpError("Could not get containers.", 500);
    return next(error);
  }
  if (response.data.length === 0) {
    const error = new HttpError("No containers found.", 404);
    return next(error);
  }
  res.status(200).json({ containers: response.data });
};

const createContainer = async (req: any, res: any, next: any) => {
  const { host, port, image, CMD, name, hostName, domainName } = req.body;
  // const url = `http://localhost:2375/images/create?fromImage=${image}`;
  // const response = await axios.post(url);
  // if (!response) {
  //   const error = new HttpError("Could not pull image.", 500);
  //   return next(error);
  // } else {
  const url = `http://localhost:2375/containers/create?name=${name}`;
  const response = await axios.post(url, {
    Hostname: hostName,
    Domainname: domainName,
    Image: image,
    Cmd: CMD,
  });
  if (!response || response.status !== 201) {
    const error = new HttpError("Could not create container.", 500);
    return next(error);
  }
  res.status(201).json({ container: response.data });
  // }
};

const runContainer = async (req: any, res: any, next: any) => {
  const { host, port, containerId } = req.body;
  const url = `http://localhost:2375/containers/${containerId}/start`;
  const response = await axios.post(url);
  if (!response || response.status !== 204) {
    const error = new HttpError("Could not start container.", 500);
    return next(error);
  }
  res.status(204).json({ container: response.data });
};

const removeContainer = async (req: any, res: any, next: any) => {
  const { host, port, containerId } = req.body;
  const url = `http://localhost:2375/containers/${containerId}?force=true`;
  const response = await axios.delete(url);
  if (!response || response.status !== 204) {
    const error = new HttpError("Could not remove container.", 500);
    return next(error);
  }
  res.status(204).json({ container: response.data });
};

const getContainerLogs = async (req: any, res: any, next: any) => {
  const { host, port, containerId } = req.body;
  const url = `http://localhost:2375/containers/${containerId}/logs?stdout=true&stderr=true`;
  const response = await axios.get(url);
  if (!response || response.status !== 200) {
    const error = new HttpError("Could not get container logs.", 500);
    return next(error);
  }
  res.status(200).json({ logs: response.data });
};

const waitContainer = async (req: any, res: any, next: any) => {
  const { host, port, containerId } = req.body;
  const url = `http://localhost:2375/containers/${containerId}/wait`;
  const response = await axios.post(url);
  if (!response || response.status !== 200) {
    const error = new HttpError("Could not wait for container.", 500);
    return next(error);
  }
  res.status(200).json({ container: response.data });
};

const inspectContainer = async (req: any, res: any, next: any) => {
  const { host, port, containerId } = req.body;
  const url = `http://localhost:2375/containers/${containerId}/json`;
  const response = await axios.get(url);
  if (!response || response.status !== 200) {
    const error = new HttpError("Could not inspect container.", 500);
    return next(error);
  }
  res.status(200).json({ container: response.data });
};

const saveContainer = async (req: any, res: any, next: any) => {
  const { host, port, containerId } = req.body;
  const url = `http://localhost:2375/containers/${containerId}/json`;
  const response = await axios.get(url);
  if (!response || response.status !== 200) {
    const error = new HttpError("Could not inspect container.", 500);
    return next(error);
  }
  const container = response.data;
  const name = container.Name;
  const { Cmd, Image } = container.Config;

  const savedContainer = await prisma.container.create({
    data: {
      name: name,
      image: Image,
      commands: Cmd,
    },
  });
  res.status(201).json({ container: savedContainer });
};

module.exports = {
  saveContainer,
  inspectContainer,
  waitContainer,
  getContainerLogs,
  removeContainer,
  listImages,
  createContainer,
  runContainer,
  listContainers,
};
