/*
  Warnings:

  - You are about to drop the `LuckySpins` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LuckySpins" DROP CONSTRAINT "LuckySpins_userNumber_fkey";

-- DropTable
DROP TABLE "LuckySpins";

-- CreateTable
CREATE TABLE "bets" (
    "id" TEXT NOT NULL,
    "userNumber" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lucky_spins" (
    "id" TEXT NOT NULL,
    "userNumber" TEXT NOT NULL,
    "spinLabel" TEXT NOT NULL,
    "spinAmount" TEXT NOT NULL,
    "winAmount" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lucky_spins_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bets" ADD CONSTRAINT "bets_userNumber_fkey" FOREIGN KEY ("userNumber") REFERENCES "appUsers"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lucky_spins" ADD CONSTRAINT "lucky_spins_userNumber_fkey" FOREIGN KEY ("userNumber") REFERENCES "appUsers"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
