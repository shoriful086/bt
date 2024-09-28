-- CreateTable
CREATE TABLE "target_refers" (
    "id" TEXT NOT NULL,
    "targetReferQuantity" TEXT NOT NULL,
    "bonusAmount" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "target_refers_pkey" PRIMARY KEY ("id")
);
