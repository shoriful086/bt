-- CreateTable
CREATE TABLE "refer_bonus" (
    "id" TEXT NOT NULL,
    "inviteFriendLength" TEXT NOT NULL,
    "bonusAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refer_bonus_pkey" PRIMARY KEY ("id")
);
