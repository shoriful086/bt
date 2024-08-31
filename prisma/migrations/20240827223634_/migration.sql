/*
  Warnings:

  - You are about to drop the `Deposit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DepositBonus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentMethod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Refer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SignUpBonus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Deposit" DROP CONSTRAINT "Deposit_phoneNumber_fkey";

-- DropForeignKey
ALTER TABLE "Refer" DROP CONSTRAINT "Refer_referUsedUserNumber_fkey";

-- DropTable
DROP TABLE "Deposit";

-- DropTable
DROP TABLE "DepositBonus";

-- DropTable
DROP TABLE "PaymentMethod";

-- DropTable
DROP TABLE "Refer";

-- DropTable
DROP TABLE "SignUpBonus";

-- CreateTable
CREATE TABLE "refers" (
    "id" TEXT NOT NULL,
    "referUsedUserNumber" TEXT NOT NULL,
    "referCode" TEXT NOT NULL DEFAULT '1234',
    "status" "ReferStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "signup_bonuses" (
    "id" TEXT NOT NULL,
    "bonusAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "signup_bonuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deposit_bonuses" (
    "id" TEXT NOT NULL,
    "bonusAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "deposit_bonuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "minPayment" TEXT NOT NULL,
    "maxPayment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deposits" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "paymentNumber" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "trxId" TEXT NOT NULL,
    "depositStatus" "DepositStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deposits_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "refers" ADD CONSTRAINT "refers_referUsedUserNumber_fkey" FOREIGN KEY ("referUsedUserNumber") REFERENCES "appUsers"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_phoneNumber_fkey" FOREIGN KEY ("phoneNumber") REFERENCES "appUsers"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
