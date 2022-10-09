/*
  Warnings:

  - You are about to drop the column `successor` on the `job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "job" DROP COLUMN "successor",
ADD COLUMN     "successors" TEXT[];
