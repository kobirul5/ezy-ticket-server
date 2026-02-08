/*
  Warnings:

  - Added the required column `userId` to the `BusService` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BusService" ADD COLUMN     "departureLocation" TEXT[],
ADD COLUMN     "destinationLocation" TEXT[],
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 350,
ADD COLUMN     "totalSeats" INTEGER NOT NULL DEFAULT 52,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "BusService" ADD CONSTRAINT "BusService_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
