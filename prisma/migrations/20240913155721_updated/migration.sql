-- CreateTable
CREATE TABLE "private_number" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "count" DOUBLE PRECISION DEFAULT 0,
    "copyDurationCount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "private_number_pkey" PRIMARY KEY ("id")
);
