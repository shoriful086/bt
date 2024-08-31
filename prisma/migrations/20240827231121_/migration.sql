/*
  Warnings:

  - The `depositBalance` column on the `appUsers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `referIncome` column on the `appUsers` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "appUsers" DROP COLUMN "depositBalance",
ADD COLUMN     "depositBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
DROP COLUMN "referIncome",
ADD COLUMN     "referIncome" DOUBLE PRECISION NOT NULL DEFAULT 0;
