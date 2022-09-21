import axios from "axios";

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

const createContainer = async (req: any, res: any, next: any) => {
  const { host, port, image, CMD } = req.body;
  const url = `http://${host}:${port}/images/create?fromImage=${image}`;
  const response = await axios.post(url);
  if (!response) {
    const error = new HttpError("Could not pull image.", 500);
    return next(error);
  } else {
    const url = `http://${host}:${port}/containers/create`;
    const response = await axios.post(url, {
      Image: image,
      Cmd: CMD,
    });
    if (!response || response.status !== 201) {
      const error = new HttpError("Could not create container.", 500);
      return next(error);
    }
    res.status(201).json({ container: response.data });
  }
};

const runContainer = async (req: any, res: any, next: any) => {
  const { host, port, containerId } = req.body;
  const url = `http://${host}:${port}/containers/${containerId}/start`;
  const response = await axios.post(url);
  if (!response || response.status !== 204) {
    const error = new HttpError("Could not start container.", 500);
    return next(error);
  }
  res.status(204).json({ container: response.data });
};

module.exports = {
  listImages,
  createContainer,
  runContainer,
};
