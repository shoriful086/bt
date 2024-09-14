/*
  Warnings:

  - You are about to drop the `banner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment_notices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "banner";

-- DropTable
DROP TABLE "payment_notices";

-- CreateTable
CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "bannerImage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_notice" (
    "id" TEXT NOT NULL,
    "depositFirstPageNotice" TEXT NOT NULL,
    "depositSecondPageNoticeBkash" TEXT NOT NULL,
    "depositSecondPageNoticeNagad" TEXT NOT NULL,
    "withdrawPageNotice" TEXT NOT NULL,

    CONSTRAINT "payment_notice_pkey" PRIMARY KEY ("id")
);
