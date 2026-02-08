/*
  Warnings:

  - You are about to drop the column `travelOffer` on the `BusService` table. All the data in the column will be lost.
  - The `busType` column on the `BusTicket` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BusType" AS ENUM ('AC', 'NON_AC');

-- AlterTable
ALTER TABLE "BusService" DROP COLUMN "travelOffer",
ADD COLUMN     "busType" "BusType" NOT NULL DEFAULT 'NON_AC',
ADD COLUMN     "travelOffDates" TIMESTAMP(3)[];

-- AlterTable
ALTER TABLE "BusTicket" DROP COLUMN "busType",
ADD COLUMN     "busType" "BusType" NOT NULL DEFAULT 'NON_AC';
