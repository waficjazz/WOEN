import { Manager } from "socket.io-client";
const manager = new Manager("http://127.0.0.1:5001");

export const socket = manager.socket("/");

socket.on("connect", () => {
  console.log(socket.id);
  socket.emit("addUser", 1);
});
