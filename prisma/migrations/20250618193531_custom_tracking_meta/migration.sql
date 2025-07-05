/*
  Warnings:

  - You are about to drop the column `amount` on the `CustomTracking` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `CustomTracking` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CustomTracking` table. All the data in the column will be lost.
  - Added the required column `name` to the `CustomTracking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CustomTracking" DROP COLUMN "amount",
DROP COLUMN "date",
DROP COLUMN "updatedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CustomTrackingMeta" (
    "id" SERIAL NOT NULL,
    "trackId" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomTrackingMeta_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CustomTrackingMeta" ADD CONSTRAINT "CustomTrackingMeta_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "CustomTracking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
