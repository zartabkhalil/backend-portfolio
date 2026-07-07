/*
  Warnings:

  - You are about to drop the column `AccountStatus` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "AccountStatus",
ADD COLUMN     "accountStatus" "AccountStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "refreshToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_username_key" ON "Profile"("username");
