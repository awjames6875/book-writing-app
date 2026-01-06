import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export interface ContentAnalysisResult {
  summary: string
  keyConcepts: string[]
  extractedQuotes: string[]
}

const CONTENT_ANALYSIS_PROMPT = `You are an expert content analyst helping authors organize research material for their books.

Analyze the following content and extract:

1. **Summary** - A 2-3 sentence summary of the main points
2. **Key Concepts** - 3-5 main topics, themes, or ideas covered
3. **Memorable Quotes** - Any powerful statements, insights, or quotable lines worth preserving

Return your analysis as JSON in this exact format:
{
  "summary": "Brief 2-3 sentence summary of the content",
  "keyConcepts": ["concept1", "concept2", "concept3"],
  "extractedQuotes": ["quote1", "quote2"]
}

Only return valid JSON, no additional text.`

export async function analyzeContent(
  content: string,
  sourceType: string
): Promise<ContentAnalysisResult> {
  if (!content || content.trim().length < 50) {
    return {
      summary: 'Content too short for meaningful analysis',
      keyConcepts: [],
      extractedQuotes: []
    }
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `${CONTENT_ANALYSIS_PROMPT}\n\nSource Type: ${sourceType}\n\n---\n\nCONTENT:\n${content}`
      }
    ]
  })

  const responseContent = response.content[0]
  if (responseContent.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  try {
    const result = JSON.parse(responseContent.text) as ContentAnalysisResult

    return {
      summary: result.summary || 'Analysis complete',
      keyConcepts: (result.keyConcepts ?? []).filter(c => c?.trim()),
      extractedQuotes: (result.extractedQuotes ?? []).filter(q => q?.trim())
    }
  } catch {
    throw new Error('Failed to parse content analysis response')
  }
}
