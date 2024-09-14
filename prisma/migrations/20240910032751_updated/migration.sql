/*
  Warnings:

  - You are about to drop the `UserDashboardMetaData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "UserDashboardMetaData";

-- CreateTable
CREATE TABLE "user_dashboard_meta_data" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_dashboard_meta_data_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_dashboard_meta_data" ADD CONSTRAINT "user_dashboard_meta_data_phoneNumber_fkey" FOREIGN KEY ("phoneNumber") REFERENCES "appUsers"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
