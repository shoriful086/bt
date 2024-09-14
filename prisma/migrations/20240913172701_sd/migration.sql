/*
  Warnings:

  - Made the column `count` on table `private_number` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "private_number" ALTER COLUMN "count" SET NOT NULL;
