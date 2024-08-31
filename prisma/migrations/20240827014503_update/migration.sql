/*
  Warnings:

  - You are about to drop the column `maxPayemnt` on the `PaymentMethod` table. All the data in the column will be lost.
  - Added the required column `maxPayment` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentMethod" DROP COLUMN "maxPayemnt",
ADD COLUMN     "maxPayment" TEXT NOT NULL;
