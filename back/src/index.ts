import express from "express";
import bodyParser from "body-parser";
import { createClient } from "redis";
const HttpError = require("./utils/http-error");
const userRoutes = require("./routes/user-routes");
const workflowRoutes = require("./routes/workflow-routes");
const containerRoutes = require("./routes/container-routes");
const wc = require("./services/container-services");
const ww = require("./services/wokflow-services");
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET , POST , PATCH , DELETE");
  next();
});

app.use("/api/v1/containers", containerRoutes);
app.use("/api/v1/users", userRoutes);
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

// ww.createWorklow();
// ww.createJobsFromTemplate();
// ww.runJob(1, 1, 0);
ww.setworkflowPlacemet(1, 1);

app.listen(process.env.PORT || 5001, () => {
  console.log("Server started on port 5000");
});

export const redisc = createClient();

redisc.on("error", (err) => console.log("Redis Client Error", err));
