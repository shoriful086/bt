/*
  Warnings:

  - You are about to drop the `order_packages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "order_packages" DROP CONSTRAINT "order_packages_pakcageId_fkey";

-- DropForeignKey
ALTER TABLE "order_packages" DROP CONSTRAINT "order_packages_userNumber_fkey";

-- DropTable
DROP TABLE "order_packages";

-- CreateTable
CREATE TABLE "buy_packages" (
    "userNumber" TEXT NOT NULL,
    "pakcageId" TEXT NOT NULL,
    "dailyAds" TEXT NOT NULL,
    "validity" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buy_packages_pkey" PRIMARY KEY ("userNumber","pakcageId")
);

-- AddForeignKey
ALTER TABLE "buy_packages" ADD CONSTRAINT "buy_packages_userNumber_fkey" FOREIGN KEY ("userNumber") REFERENCES "appUsers"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buy_packages" ADD CONSTRAINT "buy_packages_pakcageId_fkey" FOREIGN KEY ("pakcageId") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
