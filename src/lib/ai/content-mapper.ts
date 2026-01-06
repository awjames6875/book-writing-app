import Anthropic from '@anthropic-ai/sdk'

interface Chapter {
  id: string
  title: string
  description: string | null
  order_index: number
}

interface ContentBlock {
  id: string
  raw_text: string
}

interface MappingSuggestion {
  blockId: string
  chapterId: string | null
  confidence: number
  reasoning: string
}

/**
 * Map a single content block to the best-fit chapter using AI
 */
export async function mapContentBlock(
  block: ContentBlock,
  chapters: Chapter[]
): Promise<MappingSuggestion> {
  if (chapters.length === 0) {
    return {
      blockId: block.id,
      chapterId: null,
      confidence: 0,
      reasoning: 'No chapters available for mapping'
    }
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const chapterList = chapters.map((ch) =>
    `- Chapter ${ch.order_index + 1}: "${ch.title}" (ID: ${ch.id})${ch.description ? ` - ${ch.description}` : ''}`
  ).join('\n')

  const truncatedText = block.raw_text.slice(0, 2000)

  const prompt = `You are analyzing content for a book writing project. Given a content block and a list of chapters, determine which chapter this content best fits into.

CHAPTERS:
${chapterList}

CONTENT BLOCK:
${truncatedText}

Respond in JSON format only:
{
  "chapterId": "the-chapter-id-or-null-if-no-good-fit",
  "confidence": 0-100,
  "reasoning": "brief explanation of why this content fits this chapter"
}

If the content doesn't clearly fit any chapter, set chapterId to null and explain why.`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }]
    })

    const textContent = response.content[0]
    if (textContent.type !== 'text') {
      throw new Error('Unexpected response format')
    }

    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const result = JSON.parse(jsonMatch[0])

    // Validate that chapterId exists in our chapter list (or is null)
    const validChapterId = result.chapterId === null ||
      chapters.some(ch => ch.id === result.chapterId)

    return {
      blockId: block.id,
      chapterId: validChapterId ? result.chapterId : null,
      confidence: Math.min(100, Math.max(0, result.confidence ?? 0)),
      reasoning: result.reasoning ?? 'No reasoning provided'
    }
  } catch (error) {
    console.error('Error mapping content block:', error)
    return {
      blockId: block.id,
      chapterId: null,
      confidence: 0,
      reasoning: 'Error during AI analysis'
    }
  }
}

/**
 * Map multiple content blocks to chapters in batch
 */
export async function mapContentBlocksBatch(
  blocks: ContentBlock[],
  chapters: Chapter[]
): Promise<MappingSuggestion[]> {
  const results: MappingSuggestion[] = []

  // Process blocks sequentially to avoid rate limits
  for (const block of blocks) {
    const suggestion = await mapContentBlock(block, chapters)
    results.push(suggestion)
  }

  return results
}
