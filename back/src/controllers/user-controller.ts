import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const HttpError = require("../utils/http-error");
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const signup = async (req: any, res: any, next: any) => {
  const { firstName, lastName, username, email, password } = req.body;
  let user;
  let existingUser;
  try {
    existingUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again later.", 500);
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError("User exists already, please login instead.", 422);
    return next(error);
  }
  try {
    existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again later.", 500);
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError("User exists already, please login instead.", 422);
    return next(error);
  }
  let hashedPassword;
  try {
    console.log(password);
    hashedPassword = await bcrypt.hash(password, 12);
    console.log(hashedPassword);
  } catch (err) {
    const error = new HttpError("Could not create user, please try again.", 500);
    return next(error);
  }
  try {
    user = await prisma.user.create({
      data: {
        lastName,
        firstName,
        username: username,
        email: email,
        password: hashedPassword,
      },
    });
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again later.", 500);
    return next(error);
  }
  let token;
  try {
    token = jwt.sign({ userId: user.id, email: user.email }, "JazzPriavteKey", { expiresIn: "15m" });
  } catch (err) {
    const error = new HttpError("Invalid credentials, could not log you in.", 401);
    return next(error);
  }
  res.status(201).json({
    token: token,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt,
  });
};

const login = async (req: any, res: any, next: any) => {
  const { email, username, password } = req.body;
  if (!email && !username) {
    const error = new HttpError("Please enter a valid email or username.", 422);
    return next(error);
  }
  if (email || username) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) {
        const error = new HttpError("Could not find user with this email.", 404);
        return next(error);
      }
      let isValidPassword = false;
      try {
        isValidPassword = await bcrypt.compare(password, user.password);
      } catch (err) {
        const error = new HttpError("Could not log you in, please check your credentials and try again.", 500);
        return next(error);
      }
      if (!isValidPassword) {
        const error = new HttpError("Invalid credentials, could not log you in.", 401);
        return next(error);
      }
      let token;
      try {
        token = jwt.sign({ userId: user.id, email: user.email }, "JazzPriavteKey", { expiresIn: "9999 years" });
      } catch (err) {
        const error = new HttpError("Invalid credentials, could not log you in.", 401);
        return next(error);
      }
      res.status(201).json({
        token: token,
      });
    } catch (err) {
      const error = new HttpError("Logging in failed, please try again later.", 500);
      return next(error);
    }
  }
};

module.exports = {
  signup,
  login,
};
