-- CreateEnum
CREATE TYPE "PageStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "pages" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "url" TEXT NOT NULL,
    "status" "PageStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "itemId" TEXT NOT NULL,
    "itemPageUrl" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "productTitle" TEXT NOT NULL,
    "labelName" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "cheapestItemPrice" TEXT NOT NULL,
    "cheapestItemStatus" TEXT NOT NULL,
    "crawledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "items_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "pagesToItems" (
    "pageId" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "pagesToItems_pkey" PRIMARY KEY ("pageId","itemId")
);

-- CreateIndex
CREATE UNIQUE INDEX "pages_url_key" ON "pages"("url");

-- AddForeignKey
ALTER TABLE "pagesToItems" ADD CONSTRAINT "pagesToItems_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagesToItems" ADD CONSTRAINT "pagesToItems_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("itemId") ON DELETE RESTRICT ON UPDATE CASCADE;
