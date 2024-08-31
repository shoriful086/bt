-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_email_fkey";

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_phoneNumber_fkey" FOREIGN KEY ("phoneNumber") REFERENCES "users"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
