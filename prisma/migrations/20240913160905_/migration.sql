/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `private_number` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "private_number_number_key" ON "private_number"("number");
