import { io } from "../index";
import { redisc } from "../index";

export const messageOneUser = async (uid: number, event: string, data: any) => {
  //get socket id from uid from redis
  if (!redisc.isOpen) await redisc.connect();
  let socketId = await redisc.get(uid.toString());
  console.log(socketId);
  // await redisc.disconnect();
  if (socketId !== null) {
    io.to(socketId).emit(event, data);
  }
};
