/*
  Warnings:

  - You are about to drop the column `shell` on the `container` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "container" DROP COLUMN "shell";

-- CreateTable
CREATE TABLE "job" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "dependencies" TEXT[],
    "successor" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "containerId" UUID NOT NULL,

    CONSTRAINT "job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "job_name_key" ON "job"("name");

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "container"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
