/*
  Warnings:

  - The `successors` column on the `job` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `dependencies` column on the `job` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "job" DROP COLUMN "successors",
ADD COLUMN     "successors" INTEGER[],
DROP COLUMN "dependencies",
ADD COLUMN     "dependencies" INTEGER[];
