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
  const projectId = req.params.projectId;
  const userId = req.userId;

  // Perform the authorization check by querying the database
  try {
    const up = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        projects: {
          where: {
            id: parseInt(projectId),
          },
          select: {
            id: true,
          },
        },
      },
    });
    console.log(up);
  } catch (err) {
    console.log(err);
  }

  if (true) {
    req.projectId = parseInt(projectId);
    // req.hasAccess = true;
    next();
  } else {
    res.status(403).send("You do not have access to this project.");
  }
};

exports.auth = auth;
