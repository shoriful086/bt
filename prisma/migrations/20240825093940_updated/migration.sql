/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `appUsers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userPhoneNumber]` on the table `appUsers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userPhoneNumber` to the `appUsers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "appUsers" DROP CONSTRAINT "appUsers_phoneNumber_fkey";

-- DropIndex
DROP INDEX "appUsers_phoneNumber_key";

-- AlterTable
ALTER TABLE "appUsers" DROP COLUMN "phoneNumber",
ADD COLUMN     "userPhoneNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "appUsers_userPhoneNumber_key" ON "appUsers"("userPhoneNumber");

-- AddForeignKey
ALTER TABLE "appUsers" ADD CONSTRAINT "appUsers_userPhoneNumber_fkey" FOREIGN KEY ("userPhoneNumber") REFERENCES "users"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
