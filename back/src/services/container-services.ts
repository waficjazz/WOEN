import { PrismaClient } from "@prisma/client";
import axios from "axios";
const prisma = new PrismaClient();

const createContainer = async (image: string, CMD: string, name: string, hostName: string, domainName: string) => {
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
    } catch (err) {
      const error = new HttpError("Could not create container.", 500);
      return error;
    }
    // }
  }
};
