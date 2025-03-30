/*
  Warnings:

  - You are about to drop the `Bid` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_lotId_fkey";

-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_userId_fkey";

-- AlterTable
ALTER TABLE "Lot" ADD COLUMN     "winnerId" INTEGER;

-- DropTable
DROP TABLE "Bid";

-- AddForeignKey
ALTER TABLE "Lot" ADD CONSTRAINT "Lot_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
