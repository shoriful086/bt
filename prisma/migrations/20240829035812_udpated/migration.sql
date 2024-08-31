/*
  Warnings:

  - You are about to drop the column `depositStatus` on the `withdraws` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "withdraws" DROP COLUMN "depositStatus",
ADD COLUMN     "withdrawStatus" "WithdrawStatus" NOT NULL DEFAULT 'PENDING';
