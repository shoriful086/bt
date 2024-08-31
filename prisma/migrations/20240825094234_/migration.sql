/*
  Warnings:

  - You are about to drop the column `userPhoneNumber` on the `appUsers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `appUsers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phoneNumber` to the `appUsers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "appUsers" DROP CONSTRAINT "appUsers_userPhoneNumber_fkey";

-- DropIndex
DROP INDEX "appUsers_userPhoneNumber_key";

-- AlterTable
ALTER TABLE "appUsers" DROP COLUMN "userPhoneNumber",
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "appUsers_phoneNumber_key" ON "appUsers"("phoneNumber");

-- AddForeignKey
ALTER TABLE "appUsers" ADD CONSTRAINT "appUsers_phoneNumber_fkey" FOREIGN KEY ("phoneNumber") REFERENCES "users"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
