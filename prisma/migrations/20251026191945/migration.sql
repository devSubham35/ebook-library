/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BOOK_CATEGORY" AS ENUM ('romantic', 'scifi', 'adventure', 'novel');

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "category" "BOOK_CATEGORY" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Book_name_key" ON "Book"("name");
