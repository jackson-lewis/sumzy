/*
  Warnings:

  - You are about to drop the column `frequency` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `merchant` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "frequency",
DROP COLUMN "merchant";
