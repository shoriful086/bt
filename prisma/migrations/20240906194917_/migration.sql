/*
  Warnings:

  - You are about to drop the `banners` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "banners";

-- CreateTable
CREATE TABLE "banner" (
    "id" TEXT NOT NULL,
    "bannerImage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_notices" (
    "id" TEXT NOT NULL,
    "depositFirstPageNotice" TEXT NOT NULL,
    "depositSecondPageNotice" TEXT NOT NULL,
    "withdrawPageNotice" TEXT NOT NULL,

    CONSTRAINT "payment_notices_pkey" PRIMARY KEY ("id")
);
