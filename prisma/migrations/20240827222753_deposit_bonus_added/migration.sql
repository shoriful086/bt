-- CreateTable
CREATE TABLE "DepositBonus" (
    "id" TEXT NOT NULL,
    "bonusAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "DepositBonus_pkey" PRIMARY KEY ("id")
);
