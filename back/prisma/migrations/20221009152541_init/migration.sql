/*
  Warnings:

  - The `commands` column on the `container` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "container" DROP COLUMN "commands",
ADD COLUMN     "commands" TEXT[];

-- AlterTable
ALTER TABLE "job" ALTER COLUMN "status" SET DEFAULT 'pending';
