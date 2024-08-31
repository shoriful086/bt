/*
  Warnings:

  - The `bonusAmount` column on the `SignUpBonus` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `balance` column on the `appUsers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `depositBalance` column on the `appUsers` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "SignUpBonus" DROP COLUMN "bonusAmount",
ADD COLUMN     "bonusAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "appUsers" DROP COLUMN "balance",
ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
DROP COLUMN "depositBalance",
ADD COLUMN     "depositBalance" DOUBLE PRECISION NOT NULL DEFAULT 0;
