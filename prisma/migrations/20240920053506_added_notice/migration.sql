-- CreateTable
CREATE TABLE "notice" (
    "id" TEXT NOT NULL,
    "notice" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notice_pkey" PRIMARY KEY ("id")
);
