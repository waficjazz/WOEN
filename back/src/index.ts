import express from "express";
import bodyParser from "body-parser";
import { createClient } from "redis";
import { getTokenId } from "./utils/decode-token";
const { Server } = require("socket.io");
const http = require("http");
const HttpError = require("./utils/http-error");
const userRoutes = require("./routes/user-routes");
const workflowRoutes = require("./routes/workflow-routes");
const containerRoutes = require("./routes/container-routes");
const app = express();
const server = http.createServer(app);

export const redisc = createClient();
export const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5173",
  },
});
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET , POST , PATCH , DELETE");
  next();
});

app.use("/api/v1/containers", containerRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/workflow", workflowRoutes);

app.use((req: any, res: any, next: any) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error: any, req: any, res: any, next: any) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error?.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

server.listen(process.env.PORT || 5001, () => {
  console.log("Server started on port 5000");
});

let interval: any;

io.on("connection", (socket: any) => {
  socket.on("addUser", (data: any) => {
    (async () => {
      if (!redisc.isOpen) await redisc.connect();
      let uid = await getTokenId(data);
      console.log(uid);
      await redisc.set(uid, socket.id);
      await redisc.disconnect();
    })();
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

redisc.on("error", (err) => console.log("Redis Client Error", err));
