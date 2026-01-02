-- AlterTable
ALTER TABLE "users" ADD COLUMN     "hasAppliedPakar" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reputation" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "pakar_applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "yearsOfExperience" INTEGER,
    "qualifications" TEXT,
    "portfolioUrl" TEXT,
    "references" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "adminNotes" TEXT,
    "rejectionReason" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "canReapplyAfter" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pakar_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "discussionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pakar_applications_userId_idx" ON "pakar_applications"("userId");

-- CreateIndex
CREATE INDEX "pakar_applications_status_idx" ON "pakar_applications"("status");

-- CreateIndex
CREATE INDEX "pakar_applications_createdAt_idx" ON "pakar_applications"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_userId_discussionId_key" ON "bookmarks"("userId", "discussionId");

-- AddForeignKey
ALTER TABLE "pakar_applications" ADD CONSTRAINT "pakar_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "discussions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
