/*
  Warnings:

  - A unique constraint covering the columns `[userId,commentId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_discussionId_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "parentId" TEXT;

-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "commentId" TEXT,
ALTER COLUMN "discussionId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_commentId_key" ON "Vote"("userId", "commentId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
