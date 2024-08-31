/*
  Warnings:

  - The values [APPROVED] on the enum `WithdrawStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WithdrawStatus_new" AS ENUM ('PENDING', 'PAID');
ALTER TABLE "withdraws" ALTER COLUMN "withdrawStatus" DROP DEFAULT;
ALTER TABLE "withdraws" ALTER COLUMN "withdrawStatus" TYPE "WithdrawStatus_new" USING ("withdrawStatus"::text::"WithdrawStatus_new");
ALTER TYPE "WithdrawStatus" RENAME TO "WithdrawStatus_old";
ALTER TYPE "WithdrawStatus_new" RENAME TO "WithdrawStatus";
DROP TYPE "WithdrawStatus_old";
ALTER TABLE "withdraws" ALTER COLUMN "withdrawStatus" SET DEFAULT 'PENDING';
COMMIT;
