-- CreateEnum
CREATE TYPE "WithdrawStatus" AS ENUM ('PENDING', 'APPROVED');

-- CreateTable
CREATE TABLE "withdraws" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "paymentReceivedNumber" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "depositStatus" "WithdrawStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "withdraws_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "withdraws" ADD CONSTRAINT "withdraws_phoneNumber_fkey" FOREIGN KEY ("phoneNumber") REFERENCES "appUsers"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
