-- AlterTable
ALTER TABLE "workflow" ADD COLUMN     "workflowTemplateId" INTEGER;

-- AddForeignKey
ALTER TABLE "workflow" ADD CONSTRAINT "workflow_workflowTemplateId_fkey" FOREIGN KEY ("workflowTemplateId") REFERENCES "workflow_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
