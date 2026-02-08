/*
  Warnings:

  - Added the required column `time` to the `BusSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BusSchedule" ADD COLUMN     "time" TEXT NOT NULL;
