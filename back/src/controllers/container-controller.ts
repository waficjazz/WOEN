import axios from "axios";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const HttpError = require("../utils/http-error");
import { pauseContainer as pause, unpauseContainer as unpause } from "../services/container-services";
const listImages = async (req: any, res: any, next: any) => {
  const { host, port } = req.body;
  const url = `http://${host}:${port}/images/json`;
  try {
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
  } catch (err) {
    const error = new HttpError("Could not get images.", 500);
    return next(error);
  }
};

const listContainers = async (req: any, res: any, next: any) => {
  const { host, port } = req.body;
  const url = `http://localhost:2375/containers/json?all=true`;
  try {
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
  } catch (err) {
    const error = new HttpError("Could not get containers.", 500);
    return next(error);
  }
};

const createContainer = async (req: any, res: any, next: any) => {
  const { host, port, image, CMD, name, hostName, domainName, User, Env } = req.body;
  // const url = `http://localhost:2375/images/create?fromImage=${image}`;
  // const response = await axios.post(url);
  // if (!response) {
  //   const error = new HttpError("Could not pull image.", 500);
  //   return next(error);
  // } else {
  const url = `http://localhost:2375/containers/create?name=${name}`;
  try {
    const response = await axios.post(url, {
      Hostname: hostName,
      Domainname: domainName,
      Image: image,
      Cmd: CMD,
      User,
      Env,
    });
    if (!response || response.status !== 201) {
      const error = new HttpError("Could not create container.", 500);
      return next(error);
    }
    res.status(201).json({ container: response.data });
  } catch (err) {
    const error = new HttpError("Could not create container.", 500);
    return next(error);
  }
  // }
};

const runContainer = async (req: any, res: any, next: any) => {
  const { host, port, containerId } = req.body;
  try {
    const url = `http://localhost:2375/containers/${containerId}/start`;
    const response = await axios.post(url);
    if (!response || response.status !== 204) {
      console.log(response);
      const error = new HttpError("Could not start container.", 500);
      return next(error);
    }
    res.status(204).json({ container: response.data });
  } catch (err) {
    const error = new HttpError("Could not start container.", 500);
    return next(error);
  }
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

  try {
    const url = `http://localhost:2375/containers/${containerId}/logs?stdout=true&stderr=true`;
    const response = await axios.get(url);
    if (!response || response.status !== 200) {
      const error = new HttpError("Could not get container logs.", 500);
      return next(error);
    }
    res.status(200).json({ logs: response.data });
  } catch (err) {
    const error = new HttpError("Could not get container logs.", 500);
    return next(error);
  }
};

const waitContainer = async (req: any, res: any, next: any) => {
  const { host, port, containerId } = req.body;
  try {
    const url = `http://localhost:2375/containers/${containerId}/wait`;
    const response = await axios.post(url);
    if (!response || response.status !== 200) {
      const error = new HttpError("Could not wait for container.", 500);
      return next(error);
    }
    res.status(200).json({ container: response.data });
  } catch (err) {
    const error = new HttpError("Could not wait for container.", 500);
    return next(error);
  }
};

const inspectContainer = async (req: any, res: any, next: any) => {
  const { host, port, containerId } = req.body;
  try {
    const url = `http://localhost:2375/containers/${containerId}/json`;
    const response = await axios.get(url);
    if (!response || response.status !== 200) {
      const error = new HttpError("Could not inspect container.", 500);
      return next(error);
    }
    res.status(200).json({ container: response.data });
  } catch (err) {
    const error = new HttpError("Could not inspect container.", 500);
    return next(error);
  }
};
const pauseContainer = async (req: any, res: any, next: any) => {
  const { host, port, containerId } = req.body;
  try {
    await pause(containerId);
    res.status(200).json({ message: "container paused" });
  } catch (err) {
    const error = new HttpError("Could not pause container.", 500);
    return next(error);
  }
};

const unpauseContainer = async (req: any, res: any, next: any) => {
  const { host, port, containerId } = req.body;
  try {
    await unpause(containerId);
    res.status(200).json({ message: "container unpaused" });
  } catch (err) {
    const error = new HttpError("Could not unpause container.", 500);
    return next(error);
  }
};

const saveContainer = async (req: any, res: any, next: any) => {
  const { host, port, containerId } = req.body;
  try {
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
        userId: req.userId,
        name: name.slice(1),
        image: Image,
        commands: Cmd,
      },
    });
    if (!savedContainer) {
      const error = new HttpError("Could not save container.", 500);
      return next(error);
    }
    res.status(201).json({ container: savedContainer });
  } catch (err) {
    const error = new HttpError("Could not save container.", 500);
    return next(error);
  }
};

const getSavedContainers = async (req: any, res: any, next: any) => {
  try {
    const savedContainers = await prisma.container.findMany({
      where: {
        userId: req.userId,
      },
    });
    if (!savedContainers) {
      const error = new HttpError("Could not get saved containers.", 500);
      return next(error);
    }
    res.status(200).json(savedContainers);
  } catch (err) {
    const error = new HttpError("Could not get saved containers.", 500);
    return next(error);
  }
};

module.exports = {
  getSavedContainers,
  saveContainer,
  inspectContainer,
  waitContainer,
  getContainerLogs,
  removeContainer,
  listImages,
  createContainer,
  runContainer,
  listContainers,
  pauseContainer,
  unpauseContainer,
};
