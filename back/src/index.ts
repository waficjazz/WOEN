import express from "express";
import bodyParser from "body-parser";
const HttpError = require("./utils/http-error");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET , POST , PATCH , DELETE");
  next();
});

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

app.listen(process.env.PORT || 5001);
