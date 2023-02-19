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
    token = jwt.sign({ userId: user.id, email: user.email }, "JazzPriavteKey", { expiresIn: "9999 years" });
  } catch (err) {
    const error = new HttpError("Invalid credentials, could not log you in.", 401);
    return next(error);
  }

  res.status(201).json({
    token: token,
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
};

const login = async (req: any, res: any, next: any) => {
  const { user, password } = req.body;
  try {
    let found;
    found = await prisma.user.findUnique({
      where: {
        username: user,
      },
    });
    if (!found) {
      found = await prisma.user.findUnique({
        where: {
          email: user,
        },
      });
      if (!found) {
        const error = new HttpError("Could not find this user.", 404);
        return next(error);
      }
    }
    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(password, found.password);
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
      user: {
        firstName: found.firstName,
        lastName: found.lastName,
        username: found.username,
        email: found.email,
        createdAt: found.createdAt,
      },
    });
  } catch (err) {
    const error = new HttpError("Logging in failed, please try again later.", 500);
    return next(error);
  }
};

module.exports = {
  signup,
  login,
};
