/*
  Warnings:

  - You are about to drop the column `referUsedUserNumber` on the `Refer` table. All the data in the column will be lost.
  - Added the required column `refererNumber` to the `Refer` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `balance` on the `appUsers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `depositBalance` on the `appUsers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Refer" DROP CONSTRAINT "Refer_referUsedUserNumber_fkey";

-- AlterTable
ALTER TABLE "Refer" DROP COLUMN "referUsedUserNumber",
ADD COLUMN     "refererNumber" TEXT NOT NULL,
ALTER COLUMN "referCode" SET DEFAULT '1234';

-- AlterTable
ALTER TABLE "appUsers" DROP COLUMN "balance",
ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL,
DROP COLUMN "depositBalance",
ADD COLUMN     "depositBalance" DOUBLE PRECISION NOT NULL;

-- AddForeignKey
ALTER TABLE "Refer" ADD CONSTRAINT "Refer_refererNumber_fkey" FOREIGN KEY ("refererNumber") REFERENCES "appUsers"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
