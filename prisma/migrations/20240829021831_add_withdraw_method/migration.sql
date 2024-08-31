-- CreateTable
CREATE TABLE "withdraw_methods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "minPayment" TEXT NOT NULL,
    "maxPayment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "withdraw_methods_pkey" PRIMARY KEY ("id")
);
