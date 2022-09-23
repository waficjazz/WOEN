-- CreateTable
CREATE TABLE "container" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "exitCode" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "logs" TEXT NOT NULL,
    "logFile" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "container_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "container_name_key" ON "container"("name");
