-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('one_time', 'recurring');

-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('DEFAULT', 'USER');

-- CreateTable
CREATE TABLE "DefaultCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DefaultCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "frequency" "Frequency" NOT NULL,
    "description" TEXT,
    "merchant" INTEGER,
    "categoryId" INTEGER NOT NULL,
    "defaultCategoryId" INTEGER NOT NULL,
    "categoryType" "CategoryType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_defaultCategoryId_fkey" FOREIGN KEY ("defaultCategoryId") REFERENCES "DefaultCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
