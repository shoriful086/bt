/*
  Warnings:

  - You are about to drop the `Package` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Package";

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "dailyAds" DOUBLE PRECISION NOT NULL,
    "validity" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_packages" (
    "userNumber" TEXT NOT NULL,
    "pakcageId" TEXT NOT NULL,
    "dailyAds" TEXT NOT NULL,
    "validity" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_packages_pkey" PRIMARY KEY ("userNumber","pakcageId")
);

-- AddForeignKey
ALTER TABLE "order_packages" ADD CONSTRAINT "order_packages_userNumber_fkey" FOREIGN KEY ("userNumber") REFERENCES "appUsers"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_packages" ADD CONSTRAINT "order_packages_pakcageId_fkey" FOREIGN KEY ("pakcageId") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
