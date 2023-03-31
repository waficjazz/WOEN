const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from "express";
import { RequestWithUserId } from "../types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const auth = (req: RequestWithUserId, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const Token = header && header.split(" ")[1];
  if (Token === undefined) {
    return res.status(401).json({ message: "Not authorized" });
  }

  //// use util function instsead
  if (Token !== undefined) {
    jwt.verify(
      Token,
      "JazzPriavteKey",
      (
        err: any,
        decodedToken: {
          userId: any;
        }
      ) => {
        if (err) {
          return next(new Error("You are not authorized to perform this action"));
        }
        req.userId = decodedToken.userId;
        next();
      }
    );
  }
};

const projectAuth = async (req: RequestWithUserId, res: Response, next: NextFunction) => {
  const projectId = req.params.pid || req.body.projectId;
  const userId = req.userId;
  let pid;
  try {
    pid = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        project: {
          where: {
            id: parseInt(projectId || "0"),
          },
          select: {
            id: true,
          },
        },
      },
    });
  } catch (err) {
    console.log(err);
  }
  if (pid && pid.project.length > 0) {
    req.projectId = pid.project[0].id;
    next();
  } else {
    res.status(403).send("You do not have access to this project.");
  }
};

exports.auth = auth;
exports.projectAuth = projectAuth;
