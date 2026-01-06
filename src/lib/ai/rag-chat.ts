import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export interface Citation {
  chunkId: string
  sourceId: string
  sourceTitle: string
  snippet: string
}

export interface RagChatResponse {
  answer: string
  citations: Citation[]
}

interface SourceChunk {
  id: string
  content: string
  source_id: string
  sources: {
    id: string
    title: string
  }
}

const RAG_SYSTEM_PROMPT = `You are a helpful AI assistant helping an author with their book research.
You have access to the author's uploaded sources and research materials.

When answering questions:
1. Base your answers ONLY on the provided context from the sources
2. If the context doesn't contain relevant information, say so clearly
3. When you use information from a source, reference it naturally (e.g., "According to your research on...")
4. Be concise but thorough
5. Maintain a helpful, professional tone

If asked about something not in the provided context, acknowledge that you don't have that information in the sources.`

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })
  return response.data[0].embedding
}

export async function findRelevantChunks(
  projectId: string,
  query: string,
  limit: number = 5
): Promise<SourceChunk[]> {
  const supabase = await createClient()

  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query)

  // Query source_chunks by vector similarity
  // Using Supabase's pgvector extension via RPC
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: chunks, error } = await (supabase as any)
    .rpc('match_source_chunks', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: limit,
      filter_project_id: projectId
    })

  if (error) {
    // Fallback: if RPC doesn't exist, do a simple text search
    console.warn('Vector search failed, falling back to text search:', error.message)

    const { data: fallbackChunks } = await supabase
      .from('source_chunks')
      .select(`
        id,
        content,
        source_id,
        sources!inner (
          id,
          title,
          project_id
        )
      `)
      .eq('sources.project_id', projectId)
      .limit(limit)

    if (!fallbackChunks) return []

    return fallbackChunks.map(chunk => ({
      id: chunk.id,
      content: chunk.content,
      source_id: chunk.source_id,
      sources: {
        id: (chunk.sources as { id: string }).id,
        title: (chunk.sources as { title: string }).title
      }
    }))
  }

  return chunks || []
}

export async function generateRagResponse(
  projectId: string,
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<RagChatResponse> {
  // Find relevant chunks from sources
  const relevantChunks = await findRelevantChunks(projectId, userMessage)

  // Build context from chunks
  let context = ''
  const citations: Citation[] = []

  if (relevantChunks.length > 0) {
    context = 'Here is relevant information from the author\'s sources:\n\n'

    relevantChunks.forEach((chunk, index) => {
      context += `[Source ${index + 1}: ${chunk.sources.title}]\n${chunk.content}\n\n`

      citations.push({
        chunkId: chunk.id,
        sourceId: chunk.source_id,
        sourceTitle: chunk.sources.title,
        snippet: chunk.content.slice(0, 200) + (chunk.content.length > 200 ? '...' : '')
      })
    })
  } else {
    context = 'No relevant sources found for this query.'
  }

  // Build messages array with conversation history
  const messages: Anthropic.MessageParam[] = [
    ...conversationHistory.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    })),
    {
      role: 'user',
      content: `${context}\n\n---\n\nUser Question: ${userMessage}`
    }
  ]

  // Generate response with Claude
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system: RAG_SYSTEM_PROMPT,
    messages
  })

  const responseContent = response.content[0]
  if (responseContent.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  return {
    answer: responseContent.text,
    citations: relevantChunks.length > 0 ? citations : []
  }
}
