/**
 * Simple text chunker for creating source chunks for embedding
 * Splits text into ~500 token chunks with overlap for context continuity
 */

const CHUNK_SIZE = 500 // Target tokens per chunk (roughly 4 chars per token)
const CHUNK_OVERLAP = 50 // Overlap tokens between chunks
const CHARS_PER_TOKEN = 4 // Approximate characters per token

interface TextChunk {
  content: string
  chunkIndex: number
}

/**
 * Splits text into overlapping chunks suitable for embedding
 * Uses sentence boundaries when possible to avoid cutting mid-sentence
 */
export function chunkText(text: string): TextChunk[] {
  if (!text || text.trim().length === 0) {
    return []
  }

  const targetChars = CHUNK_SIZE * CHARS_PER_TOKEN
  const overlapChars = CHUNK_OVERLAP * CHARS_PER_TOKEN

  // Split by sentences (basic sentence detection)
  const sentences = text.split(/(?<=[.!?])\s+/)

  const chunks: TextChunk[] = []
  let currentChunk = ''
  let chunkIndex = 0

  for (const sentence of sentences) {
    // If adding this sentence would exceed target, start new chunk
    if (currentChunk.length + sentence.length > targetChars && currentChunk.length > 0) {
      chunks.push({
        content: currentChunk.trim(),
        chunkIndex: chunkIndex++
      })

      // Start new chunk with overlap from end of previous
      const overlapStart = Math.max(0, currentChunk.length - overlapChars)
      currentChunk = currentChunk.slice(overlapStart) + ' ' + sentence
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence
    }
  }

  // Add final chunk if there's remaining content
  if (currentChunk.trim().length > 0) {
    chunks.push({
      content: currentChunk.trim(),
      chunkIndex: chunkIndex
    })
  }

  return chunks
}
