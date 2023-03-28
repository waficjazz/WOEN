import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const HttpError = require("../utils/http-error");
import bcrypt from "bcrypt";
import { RequestWithUserId } from "../types";
import { db } from "../db/db";
import { NewUser, User, user as userTable, project, NewProject, Project, NewGroup, Group, group } from "../db/schema";
import { eq } from "drizzle-orm/expressions";

const prisma = new PrismaClient();

// const createGroup = async (name : string )

const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, username, email, password } = req.body;
  let insertedUsers: User[];
  let insertedUser: User;
  let existingUser: User[];
  try {
    existingUser = await db.select().from(userTable).where(eq(userTable.username, username));
  } catch (err) {
    console.log(err);
    const error = new HttpError("Signing up failed, please try again later.", 500);
    return next(error);
  }
  if (existingUser.length > 0) {
    const error = new HttpError("User exists already, please login instead.", 422);
    return next(error);
  }
  try {
    existingUser = await db.select().from(userTable).where(eq(userTable.email, email));
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again later.", 500);
    return next(error);
  }
  if (existingUser.length > 0) {
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
    const newUser: NewUser = {
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };
    insertedUsers = await db.insert(userTable).values(newUser).returning();
    insertedUser = insertedUsers[0]!;
  } catch (err) {
    console.log(err);
    const error = new HttpError("Signing up failed, please try again later.", 500);
    return next(error);
  }
  let token;
  try {
    token = jwt.sign({ userId: insertedUser.id, email: insertedUser.email }, "JazzPriavteKey", { expiresIn: "9999 years" });
  } catch (err) {
    const error = new HttpError("Invalid credentials, could not log you in.", 401);
    return next(error);
  }

  res.status(201).json({
    token: token,
    user: {
      firstName: insertedUser.firstName,
      lastName: insertedUser.lastName,
      username: insertedUser.username,
      email: insertedUser.email,
      createdAt: insertedUser.createdAt,
    },
  });
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { user, password } = req.body;
  let existingUsers: User[];
  try {
    let found;
    existingUsers = await db.select().from(userTable).where(eq(userTable.username, user));
    if (existingUsers.length == 0) {
      existingUsers = await db.select().from(userTable).where(eq(userTable.email, user));
      if (existingUsers.length == 0) {
        const error = new HttpError("Could not find this user.", 404);
        return next(error);
      }
    }
    let isValidPassword = false;
    const existingUser = existingUsers[0]!;
    try {
      isValidPassword = await bcrypt.compare(password, existingUser.password);
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
      token = jwt.sign({ userId: existingUser.id, email: existingUser.email }, "JazzPriavteKey", { expiresIn: "9999 years" });
    } catch (err) {
      const error = new HttpError("Invalid credentials, could not log you in.", 401);
      return next(error);
    }
    res.status(201).json({
      token: token,
      user: {
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        username: existingUser.username,
        email: existingUser.email,
        createdAt: existingUser.createdAt,
      },
    });
  } catch (err) {
    const error = new HttpError("Logging in failed, please try again later.", 500);
    return next(error);
  }
};

const createProject = async (req: RequestWithUserId, res: Response, next: NextFunction) => {
  const { name } = req.body;
  let createdProjects: Project[];
  const newProject: NewProject = {
    name,
    userId: req.userId,
  };
  try {
    createdProjects = await db.insert(project).values(newProject).returning();
  } catch (err) {
    const error = new HttpError("Failed to create project", 500);
    return next(error);
  }
  res.status(201).json(createdProjects[0]!);
};

const listProjects = async (req: RequestWithUserId, res: Response, next: NextFunction) => {
  let userId = req.userId;
  let projects: Project[] = [];
  try {
    projects = await db.select().from(project).where(eq(project.userId, userId));
    if (projects.length === 0) {
      const error = new HttpError("No projects found", 404);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError("Failed find projects", 500);
    return next(error);
  }
  res.status(200).json(projects);
};

const createGroup = async (req: RequestWithUserId, res: Response, next: NextFunction) => {
  let userId = req.userId;
  let { name, description } = req.body;
  let createdGroups: Group[];
  const newGroup: NewGroup = {
    name,
    description,
    userId,
  };
  try {
    createdGroups = await db.insert(group).values(newGroup).returning();
  } catch (err) {
    const error = new HttpError("Failed creating group", 500);
    return next(error);
  }
  res.status(201).json(createdGroups[0]!);
};

const listGroups = async (req: RequestWithUserId, res: Response, next: NextFunction) => {
  let userId = req.userId;
  let groups;
  try {
    groups = await db.select().from(group).where(eq(group.userId, userId));
    if (groups.length === 0) {
      const error = new HttpError("No groups found", 404);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError("Failed getting group", 500);
    return next(error);
  }
  res.status(200).json(groups);
};

module.exports = {
  signup,
  login,
  createProject,
  listProjects,
  createGroup,
  listGroups,
};
