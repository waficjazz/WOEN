-- AlterTable
ALTER TABLE "job" ADD COLUMN     "containerId" INTEGER;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "container"("id") ON DELETE SET NULL ON UPDATE CASCADE;
