-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Convert embedding column to vector type (1536 dimensions for OpenAI embeddings)
ALTER TABLE source_chunks
ALTER COLUMN embedding TYPE vector(1536)
USING embedding::vector(1536);

-- Create index for faster similarity search
CREATE INDEX IF NOT EXISTS source_chunks_embedding_idx
ON source_chunks
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create RPC function for semantic search
CREATE OR REPLACE FUNCTION match_source_chunks(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5,
  p_project_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  source_id uuid,
  content text,
  chunk_index int,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    sc.id,
    sc.source_id,
    sc.content,
    sc.chunk_index,
    1 - (sc.embedding <=> query_embedding) AS similarity
  FROM source_chunks sc
  JOIN sources s ON sc.source_id = s.id
  WHERE
    sc.embedding IS NOT NULL
    AND (p_project_id IS NULL OR s.project_id = p_project_id)
    AND 1 - (sc.embedding <=> query_embedding) > match_threshold
  ORDER BY sc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
