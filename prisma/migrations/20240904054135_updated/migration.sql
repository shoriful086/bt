-- CreateTable
CREATE TABLE "ads" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "ads_pkey" PRIMARY KEY ("id")
);
