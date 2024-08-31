/*
  Warnings:

  - The `balance` column on the `appUsers` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "appUsers" DROP COLUMN "balance",
ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0;
