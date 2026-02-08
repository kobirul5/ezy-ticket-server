/*
  Warnings:

  - You are about to drop the `BusTicket` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "BusTicket";

-- CreateTable
CREATE TABLE "BusSchedule" (
    "id" SERIAL NOT NULL,
    "bookedSeats" TEXT[],
    "date" TEXT NOT NULL,
    "busServiceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusSchedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BusSchedule" ADD CONSTRAINT "BusSchedule_busServiceId_fkey" FOREIGN KEY ("busServiceId") REFERENCES "BusService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
