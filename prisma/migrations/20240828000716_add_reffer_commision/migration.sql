-- CreateTable
CREATE TABLE "refer_commissions" (
    "id" TEXT NOT NULL,
    "depositBonus" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "refer_commissions_pkey" PRIMARY KEY ("id")
);
