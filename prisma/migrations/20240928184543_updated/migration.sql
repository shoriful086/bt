-- CreateTable
CREATE TABLE "target_refer_bonus_claimed" (
    "id" TEXT NOT NULL,
    "userPhoneNumber" TEXT NOT NULL,
    "referCount" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "target_refer_bonus_claimed_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "target_refer_bonus_claimed" ADD CONSTRAINT "target_refer_bonus_claimed_userPhoneNumber_fkey" FOREIGN KEY ("userPhoneNumber") REFERENCES "appUsers"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
