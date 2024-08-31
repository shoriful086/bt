-- CreateEnum
CREATE TYPE "ReferStatus" AS ENUM ('PENDING', 'SUCCESS');

-- CreateTable
CREATE TABLE "Refer" (
    "id" TEXT NOT NULL,
    "referUsedUserNumber" TEXT NOT NULL,
    "referCode" TEXT NOT NULL,
    "status" "ReferStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Refer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Refer" ADD CONSTRAINT "Refer_referUsedUserNumber_fkey" FOREIGN KEY ("referUsedUserNumber") REFERENCES "appUsers"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
