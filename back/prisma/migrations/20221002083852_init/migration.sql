/*
  Warnings:

  - You are about to drop the column `exitCode` on the `container` table. All the data in the column will be lost.
  - You are about to drop the column `logFile` on the `container` table. All the data in the column will be lost.
  - You are about to drop the column `logs` on the `container` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `container` table. All the data in the column will be lost.
  - Added the required column `shell` to the `container` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "container" DROP COLUMN "exitCode",
DROP COLUMN "logFile",
DROP COLUMN "logs",
DROP COLUMN "status",
ADD COLUMN     "commands" TEXT[],
ADD COLUMN     "shell" TEXT NOT NULL;
