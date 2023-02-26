/*
  Warnings:

  - You are about to drop the column `path` on the `inputParams` table. All the data in the column will be lost.
  - Added the required column `outputParamsId` to the `inputParams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workflowId` to the `outputParamsValue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "outputParams" DROP CONSTRAINT "outputParams_jobTemplateId_fkey";

-- AlterTable
ALTER TABLE "inputParams" DROP COLUMN "path",
ADD COLUMN     "outputParamsId" INTEGER NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "outputParamsValue" ADD COLUMN     "workflowId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "outputParams" ADD CONSTRAINT "outputParams_jobTemplateId_fkey" FOREIGN KEY ("jobTemplateId") REFERENCES "job_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inputParams" ADD CONSTRAINT "inputParams_outputParamsId_fkey" FOREIGN KEY ("outputParamsId") REFERENCES "outputParams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
