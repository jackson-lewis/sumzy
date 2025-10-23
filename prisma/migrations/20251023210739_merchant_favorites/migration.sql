-- CreateTable
CREATE TABLE "_FavoriteMerchants" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FavoriteMerchants_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FavoriteMerchants_B_index" ON "_FavoriteMerchants"("B");

-- AddForeignKey
ALTER TABLE "_FavoriteMerchants" ADD CONSTRAINT "_FavoriteMerchants_A_fkey" FOREIGN KEY ("A") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteMerchants" ADD CONSTRAINT "_FavoriteMerchants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
