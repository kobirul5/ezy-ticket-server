-- DropForeignKey
ALTER TABLE "BusSchedule" DROP CONSTRAINT "BusSchedule_busServiceId_fkey";

-- AddForeignKey
ALTER TABLE "BusSchedule" ADD CONSTRAINT "BusSchedule_busServiceId_fkey" FOREIGN KEY ("busServiceId") REFERENCES "BusService"("id") ON DELETE CASCADE ON UPDATE CASCADE;
