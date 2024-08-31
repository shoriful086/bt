/*
  Warnings:

  - You are about to drop the column `dailyAds` on the `buy_packages` table. All the data in the column will be lost.
  - You are about to drop the column `validity` on the `buy_packages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "buy_packages" DROP COLUMN "dailyAds",
DROP COLUMN "validity";
