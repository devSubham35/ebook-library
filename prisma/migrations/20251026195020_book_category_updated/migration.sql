-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BOOK_CATEGORY" ADD VALUE 'medical';
ALTER TYPE "BOOK_CATEGORY" ADD VALUE 'story';
ALTER TYPE "BOOK_CATEGORY" ADD VALUE 'horror';
ALTER TYPE "BOOK_CATEGORY" ADD VALUE 'emotinal';
ALTER TYPE "BOOK_CATEGORY" ADD VALUE 'comedy';
ALTER TYPE "BOOK_CATEGORY" ADD VALUE 'action';
ALTER TYPE "BOOK_CATEGORY" ADD VALUE 'thriller';
ALTER TYPE "BOOK_CATEGORY" ADD VALUE 'educational';
ALTER TYPE "BOOK_CATEGORY" ADD VALUE 'general';
