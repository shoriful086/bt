/*
  Warnings:

  - You are about to drop the column `depositBonus` on the `refer_commissions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "refer_commissions" DROP COLUMN "depositBonus",
ADD COLUMN     "commissionBonus" DOUBLE PRECISION NOT NULL DEFAULT 0;
