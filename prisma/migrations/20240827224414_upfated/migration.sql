/*
  Warnings:

  - You are about to drop the column `bonusAmount` on the `deposit_bonuses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "deposit_bonuses" DROP COLUMN "bonusAmount",
ADD COLUMN     "depositBonus" DOUBLE PRECISION NOT NULL DEFAULT 0;
