/*
  Warnings:

  - You are about to drop the column `oneSignalUserId` on the `appUsers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "appUsers" DROP COLUMN "oneSignalUserId",
ADD COLUMN     "deviceToken" TEXT;
