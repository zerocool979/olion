/*
  Warnings:

  - Added the required column `discipline` to the `Discussion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mode` to the `Discussion` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DiscussionMode" AS ENUM ('INFORMATIF', 'KLARIFIKATIF', 'EKSPLORATIF', 'EVALUATIF', 'ARGUMENTATIF', 'PRAKTIS');

-- CreateEnum
CREATE TYPE "DisciplineLevel" AS ENUM ('BEBAS', 'RASIONAL', 'AKADEMIK', 'PROFESIONAL');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "parentId" TEXT;

-- AlterTable
ALTER TABLE "Discussion" ADD COLUMN     "discipline" "DisciplineLevel" NOT NULL,
ADD COLUMN     "mode" "DiscussionMode" NOT NULL;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
