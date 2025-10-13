-- CreateEnum
CREATE TYPE "FrequencyType" AS ENUM ('DATE_OF_MONTH');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "subscriptionId" INTEGER;

-- DropEnum
DROP TYPE "Frequency";

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "description" TEXT,
    "categoryId" INTEGER,
    "defaultCategoryId" INTEGER,
    "categoryType" "CategoryType" NOT NULL,
    "frequency" "FrequencyType" NOT NULL,
    "originTransactionId" INTEGER NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_originTransactionId_key" ON "Subscription"("originTransactionId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_originTransactionId_fkey" FOREIGN KEY ("originTransactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
