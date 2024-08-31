/*
  Warnings:

  - You are about to drop the column `refererNumber` on the `Refer` table. All the data in the column will be lost.
  - Added the required column `referUsedUserNumber` to the `Refer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Refer" DROP CONSTRAINT "Refer_refererNumber_fkey";

-- AlterTable
ALTER TABLE "Refer" DROP COLUMN "refererNumber",
ADD COLUMN     "referUsedUserNumber" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Refer" ADD CONSTRAINT "Refer_referUsedUserNumber_fkey" FOREIGN KEY ("referUsedUserNumber") REFERENCES "appUsers"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
