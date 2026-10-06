-- CreateEnum
CREATE TYPE "DocumentProcessingStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'READY', 'FAILED');

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "processingError" TEXT,
ADD COLUMN     "processingStatus" "DocumentProcessingStatus" NOT NULL DEFAULT 'UPLOADED';
