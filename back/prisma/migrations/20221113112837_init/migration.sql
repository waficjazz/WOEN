-- AlterTable
ALTER TABLE "job" ADD COLUMN     "jobTemplateId" INTEGER;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_jobTemplateId_fkey" FOREIGN KEY ("jobTemplateId") REFERENCES "job_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
