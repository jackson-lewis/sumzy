/*
  Warnings:

  - Added the required column `slug` to the `CustomTracking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CustomTracking" ADD COLUMN     "description" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL;
