-- CreateTable
CREATE TABLE "complete_tasks" (
    "id" TEXT NOT NULL,
    "userNumber" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "earned" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "complete_tasks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "complete_tasks" ADD CONSTRAINT "complete_tasks_userNumber_fkey" FOREIGN KEY ("userNumber") REFERENCES "appUsers"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complete_tasks" ADD CONSTRAINT "complete_tasks_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
