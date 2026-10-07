-- Change the embedding column to match nomic-embed-text (768 dimensions).
ALTER TABLE "DocumentChunk"
ALTER COLUMN "embedding" TYPE vector(768);