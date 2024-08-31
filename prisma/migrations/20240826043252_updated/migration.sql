-- DropForeignKey
ALTER TABLE "appUsers" DROP CONSTRAINT "appUsers_email_fkey";

-- AddForeignKey
ALTER TABLE "appUsers" ADD CONSTRAINT "appUsers_phoneNumber_fkey" FOREIGN KEY ("phoneNumber") REFERENCES "users"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
