/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `jobTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workflowTemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "jobTemplate" DROP CONSTRAINT "jobTemplate_containerId_fkey";

-- DropForeignKey
ALTER TABLE "jobTemplate" DROP CONSTRAINT "jobTemplate_workflowTemplateId_fkey";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "jobTemplate";

-- DropTable
DROP TABLE "workflowTemplate";

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_template" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "initJob" TEXT NOT NULL DEFAULT 'init',
    "placements" JSONB,

    CONSTRAINT "workflow_template_pkey" PRIMARY KEY ("id")
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

    CONSTRAINT "job_template_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "workflow_template_name_key" ON "workflow_template"("name");

-- CreateIndex
CREATE UNIQUE INDEX "job_template_name_key" ON "job_template"("name");

-- AddForeignKey
ALTER TABLE "job_template" ADD CONSTRAINT "job_template_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "container"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_template" ADD CONSTRAINT "job_template_workflowTemplateId_fkey" FOREIGN KEY ("workflowTemplateId") REFERENCES "workflow_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
