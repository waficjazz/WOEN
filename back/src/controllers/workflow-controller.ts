import { PrismaClient } from "@prisma/client";
const HttpError = require("../utils/http-error");

const prisma = new PrismaClient();

const createWorkflow = async (req: any, res: any, next: any) => {
  const { name } = req.body;
  const workflow = await prisma.workflow.create({
    data: {
      name,
    },
  });
  res.status(201).json({ workflow });
};

module.exports = {
  createWorkflow,
};
