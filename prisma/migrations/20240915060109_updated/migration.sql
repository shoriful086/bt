-- CreateTable
CREATE TABLE "refer_bonus_claimed" (
    "id" TEXT NOT NULL,
    "userNumber" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "referCount" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refer_bonus_claimed_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "refer_bonus_claimed" ADD CONSTRAINT "refer_bonus_claimed_userNumber_fkey" FOREIGN KEY ("userNumber") REFERENCES "appUsers"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
