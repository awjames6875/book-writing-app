import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export interface BookContext {
  bookType: string
  targetAudience: string
  mainMessage: string
  uniqueQualification: string
  toneStyle: string
}

export interface Chapter {
  id: string
  title: string
  order_index: number
  theme?: string | null
  core_principle?: string | null
}

export interface GeneratedQuestion {
  text: string
  chapter_id: string | null
  reasoning: string
}

const QUESTION_GENERATION_PROMPT = `You are an expert book writing coach helping authors develop their manuscript.

Based on the source content provided, generate interview questions that will help the author capture their authentic voice and stories for their book.

Book Context:
- Book Type: {bookType}
- Target Audience: {targetAudience}
- Main Message: {mainMessage}
- Author's Qualification: {uniqueQualification}
- Tone: {toneStyle}

Available Chapters:
{chaptersJson}

Generate 5-10 thoughtful interview questions that:
1. Extract stories, examples, and insights from the source material
2. Help capture the author's authentic voice
3. Map to specific chapters when relevant
4. Dig deeper into key concepts mentioned in the source

Return JSON in this exact format:
{
  "questions": [
    {
      "text": "The interview question text?",
      "chapter_id": "uuid-of-chapter or null if general",
      "reasoning": "Brief explanation of why this question is valuable"
    }
  ]
}

Only return valid JSON, no additional text.`

export async function generateQuestionsFromSource(
  content: string,
  bookContext: BookContext | null,
  chapters: Chapter[]
): Promise<{ questions: GeneratedQuestion[] }> {
  if (!content || content.trim().length < 50) {
    return { questions: [] }
  }

  const chaptersJson = chapters.map(c => ({
    id: c.id,
    title: c.title,
    order: c.order_index,
    theme: c.theme || null
  }))

  const prompt = QUESTION_GENERATION_PROMPT
    .replace('{bookType}', bookContext?.bookType || 'Not specified')
    .replace('{targetAudience}', bookContext?.targetAudience || 'Not specified')
    .replace('{mainMessage}', bookContext?.mainMessage || 'Not specified')
    .replace('{uniqueQualification}', bookContext?.uniqueQualification || 'Not specified')
    .replace('{toneStyle}', bookContext?.toneStyle || 'Not specified')
    .replace('{chaptersJson}', JSON.stringify(chaptersJson, null, 2))

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `${prompt}\n\n---\n\nSOURCE CONTENT:\n${content.slice(0, 10000)}`
      }
    ]
  })

  const responseContent = response.content[0]
  if (responseContent.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  try {
    const result = JSON.parse(responseContent.text) as { questions: GeneratedQuestion[] }
    return {
      questions: (result.questions ?? []).filter(q => q?.text?.trim())
    }
  } catch {
    throw new Error('Failed to parse question generation response')
  }
}
