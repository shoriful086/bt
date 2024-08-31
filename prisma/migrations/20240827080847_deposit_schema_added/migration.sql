-- CreateEnum
CREATE TYPE "DepositStatus" AS ENUM ('PENDING', 'SUCCESS', 'REJECTED');

-- CreateTable
CREATE TABLE "Deposit" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "paymentNumber" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "depositStatus" "DepositStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deposit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_phoneNumber_fkey" FOREIGN KEY ("phoneNumber") REFERENCES "appUsers"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
