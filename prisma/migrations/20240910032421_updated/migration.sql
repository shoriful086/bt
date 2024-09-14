/*
  Warnings:

  - You are about to drop the column `date` on the `appUsers` table. All the data in the column will be lost.
  - You are about to drop the column `todayEarn` on the `appUsers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "appUsers" DROP COLUMN "date",
DROP COLUMN "todayEarn";

-- CreateTable
CREATE TABLE "UserDashboardMetaData" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDashboardMetaData_pkey" PRIMARY KEY ("id")
);
