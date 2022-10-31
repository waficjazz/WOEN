/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `workflow` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "job_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "workflow_name_key" ON "workflow"("name");
