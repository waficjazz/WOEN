-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('success', 'failed', 'paused', 'skiped', 'running', 'pending');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "container" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "commands" TEXT[],
    "envs" TEXT[],
    "workingDir" TEXT[],
    "user" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,
    "projectId" INTEGER,

    CONSTRAINT "container_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_template" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "initJob" TEXT NOT NULL DEFAULT 'init',
    "placements" JSONB,
    "userId" INTEGER,
    "projectId" INTEGER,

    CONSTRAINT "workflow_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflowTemplateParam" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "workflowTemplateId" INTEGER NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "default" TEXT NOT NULL,

    CONSTRAINT "workflowTemplateParam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflowParam" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "workflowId" INTEGER NOT NULL,

    CONSTRAINT "workflowParam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_template" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "containerId" INTEGER,
    "successors" TEXT[],
    "dependencies" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workflowTemplateId" INTEGER,
    "condition" TEXT,

    CONSTRAINT "job_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outputParams" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "jobTemplateId" INTEGER,

    CONSTRAINT "outputParams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inputParams" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "jobTemplateId" INTEGER,
    "outputParamsId" INTEGER NOT NULL,

    CONSTRAINT "inputParams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outputParamsValue" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "outputParamsId" INTEGER NOT NULL,
    "jobId" INTEGER,
    "workflowId" INTEGER NOT NULL,

    CONSTRAINT "outputParamsValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "totalJobs" INTEGER NOT NULL DEFAULT 0,
    "completedJobs" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "status" "STATUS" NOT NULL DEFAULT 'pending',
    "placements" JSONB,
    "workflowTemplateId" INTEGER,
    "jidsMap" JSONB,
    "userId" INTEGER,
    "projectId" INTEGER,

    CONSTRAINT "workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" "STATUS" NOT NULL DEFAULT 'pending',
    "successors" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dependencies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "workflowId" INTEGER NOT NULL,
    "jobTemplateId" INTEGER,
    "containerId" INTEGER,
    "exitCode" INTEGER,
    "containerInstance" TEXT,

    CONSTRAINT "job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_project_users" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_group_users" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_groupToproject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "container_name_key" ON "container"("name");

-- CreateIndex
CREATE UNIQUE INDEX "workflow_template_name_key" ON "workflow_template"("name");

-- CreateIndex
CREATE UNIQUE INDEX "job_template_name_key" ON "job_template"("name");

-- CreateIndex
CREATE UNIQUE INDEX "workflow_name_key" ON "workflow"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_project_users_AB_unique" ON "_project_users"("A", "B");

-- CreateIndex
CREATE INDEX "_project_users_B_index" ON "_project_users"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_group_users_AB_unique" ON "_group_users"("A", "B");

-- CreateIndex
CREATE INDEX "_group_users_B_index" ON "_group_users"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_groupToproject_AB_unique" ON "_groupToproject"("A", "B");

-- CreateIndex
CREATE INDEX "_groupToproject_B_index" ON "_groupToproject"("B");

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group" ADD CONSTRAINT "group_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "container" ADD CONSTRAINT "container_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "container" ADD CONSTRAINT "container_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_template" ADD CONSTRAINT "workflow_template_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_template" ADD CONSTRAINT "workflow_template_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflowTemplateParam" ADD CONSTRAINT "workflowTemplateParam_workflowTemplateId_fkey" FOREIGN KEY ("workflowTemplateId") REFERENCES "workflow_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflowParam" ADD CONSTRAINT "workflowParam_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_template" ADD CONSTRAINT "job_template_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "container"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_template" ADD CONSTRAINT "job_template_workflowTemplateId_fkey" FOREIGN KEY ("workflowTemplateId") REFERENCES "workflow_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outputParams" ADD CONSTRAINT "outputParams_jobTemplateId_fkey" FOREIGN KEY ("jobTemplateId") REFERENCES "job_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inputParams" ADD CONSTRAINT "inputParams_jobTemplateId_fkey" FOREIGN KEY ("jobTemplateId") REFERENCES "job_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inputParams" ADD CONSTRAINT "inputParams_outputParamsId_fkey" FOREIGN KEY ("outputParamsId") REFERENCES "outputParams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outputParamsValue" ADD CONSTRAINT "outputParamsValue_outputParamsId_fkey" FOREIGN KEY ("outputParamsId") REFERENCES "outputParams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outputParamsValue" ADD CONSTRAINT "outputParamsValue_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow" ADD CONSTRAINT "workflow_workflowTemplateId_fkey" FOREIGN KEY ("workflowTemplateId") REFERENCES "workflow_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow" ADD CONSTRAINT "workflow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow" ADD CONSTRAINT "workflow_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_jobTemplateId_fkey" FOREIGN KEY ("jobTemplateId") REFERENCES "job_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "container"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_project_users" ADD CONSTRAINT "_project_users_A_fkey" FOREIGN KEY ("A") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_project_users" ADD CONSTRAINT "_project_users_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_group_users" ADD CONSTRAINT "_group_users_A_fkey" FOREIGN KEY ("A") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_group_users" ADD CONSTRAINT "_group_users_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_groupToproject" ADD CONSTRAINT "_groupToproject_A_fkey" FOREIGN KEY ("A") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_groupToproject" ADD CONSTRAINT "_groupToproject_B_fkey" FOREIGN KEY ("B") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
