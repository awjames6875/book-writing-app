import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export type VoiceDnaCategory = 'phrase' | 'rhythm' | 'teaching' | 'story' | 'quote'

export interface VoiceDnaPattern {
  category: VoiceDnaCategory
  pattern: string
  context: string | null
  frequency: number
  confidenceScore: number
}

export interface VoiceDnaAnalysisResult {
  patterns: VoiceDnaPattern[]
  summary: string
}

const VOICE_DNA_PROMPT = `You are an expert voice analyst specializing in identifying unique speech patterns, signature phrases, and communication styles from transcripts.

Analyze the following transcript and extract the author's unique voice DNA patterns. Look for:

1. **Signature Phrases** (category: "phrase") - Repeated phrases, catchphrases, or unique word combinations the author uses
2. **Speech Rhythms** (category: "rhythm") - Patterns in sentence structure, pacing, use of pauses, rhetorical devices
3. **Teaching Patterns** (category: "teaching") - How they explain concepts, use analogies, structure lessons
4. **Story Structures** (category: "story") - How they tell stories, setup/payoff patterns, narrative techniques
5. **Memorable Quotes** (category: "quote") - Powerful one-liners, memorable statements worth preserving

For each pattern found, provide:
- The pattern itself (exact phrase or description)
- Context where it appears
- Estimated frequency (1-10 scale, where 10 means very frequent)
- Confidence score (0.0-1.0, how confident you are this is a genuine pattern)

Return your analysis as JSON in this exact format:
{
  "patterns": [
    {
      "category": "phrase|rhythm|teaching|story|quote",
      "pattern": "the actual pattern or phrase",
      "context": "where/how this pattern is used",
      "frequency": 1-10,
      "confidenceScore": 0.0-1.0
    }
  ],
  "summary": "Brief summary of the author's overall voice characteristics"
}

Only return valid JSON, no additional text.`

export async function analyzeVoiceDna(transcriptText: string): Promise<VoiceDnaAnalysisResult> {
  if (!transcriptText || transcriptText.trim().length < 100) {
    return {
      patterns: [],
      summary: 'Transcript too short for meaningful voice analysis'
    }
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: `${VOICE_DNA_PROMPT}\n\n---\n\nTRANSCRIPT:\n${transcriptText}`
      }
    ]
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  try {
    const result = JSON.parse(content.text) as VoiceDnaAnalysisResult

    // Validate and normalize the patterns
    const validatedPatterns = result.patterns
      .filter(p => p.pattern && p.category)
      .map(p => ({
        category: validateCategory(p.category),
        pattern: p.pattern.trim(),
        context: p.context?.trim() || null,
        frequency: Math.min(10, Math.max(1, Math.round(p.frequency || 1))),
        confidenceScore: Math.min(1, Math.max(0, p.confidenceScore || 0.5))
      }))

    return {
      patterns: validatedPatterns,
      summary: result.summary || 'Voice analysis complete'
    }
  } catch (parseError) {
    console.error('Failed to parse Claude response:', parseError)
    throw new Error('Failed to parse voice DNA analysis response')
  }
}

function validateCategory(category: string): VoiceDnaCategory {
  const validCategories: VoiceDnaCategory[] = ['phrase', 'rhythm', 'teaching', 'story', 'quote']
  const normalized = category.toLowerCase().trim() as VoiceDnaCategory
  return validCategories.includes(normalized) ? normalized : 'phrase'
}
