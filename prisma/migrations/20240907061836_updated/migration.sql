-- CreateTable
CREATE TABLE "LuckySpins" (
    "id" TEXT NOT NULL,
    "userNumber" TEXT NOT NULL,
    "spinLabel" TEXT NOT NULL,
    "spinAmount" TEXT NOT NULL,
    "winAmount" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LuckySpins_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LuckySpins" ADD CONSTRAINT "LuckySpins_userNumber_fkey" FOREIGN KEY ("userNumber") REFERENCES "appUsers"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
