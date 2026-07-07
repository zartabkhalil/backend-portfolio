/*
  Warnings:

  - You are about to drop the column `converImage` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "converImage",
ADD COLUMN     "coverImage" TEXT,
ALTER COLUMN "bio" DROP NOT NULL,
ALTER COLUMN "avatar" DROP NOT NULL;
