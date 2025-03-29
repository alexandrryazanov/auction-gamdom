-- CreateEnum
CREATE TYPE "Status" AS ENUM ('OPEN', 'CLOSED');

-- AlterTable
ALTER TABLE "Lot" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'OPEN';
