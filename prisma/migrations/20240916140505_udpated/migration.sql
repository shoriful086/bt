-- CreateTable
CREATE TABLE "WheelMultiply" (
    "id" TEXT NOT NULL,
    "multiply" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WheelMultiply_pkey" PRIMARY KEY ("id")
);
