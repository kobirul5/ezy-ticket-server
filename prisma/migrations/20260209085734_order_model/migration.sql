/*
  Warnings:

  - You are about to drop the column `paymentTime` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `Order` table. All the data in the column will be lost.
  - The `currency` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paymentMethod` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `customerName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('SSLCOMMERZ', 'STRIPE');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('BDT', 'USD');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('EVENT', 'BUS');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'SUCCESSED', 'CANCELLED', 'FAILED');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentTime",
DROP COLUMN "productName",
ADD COLUMN     "customerName" TEXT NOT NULL,
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD COLUMN     "productType" "ProductType" NOT NULL DEFAULT 'BUS',
DROP COLUMN "currency",
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'BDT',
DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'SSLCOMMERZ',
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING';
