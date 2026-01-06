import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export interface ReviewAnalysis {
  pain_points: string[]
  missing_topics: string[]
  reader_expectations: string[]
}

export interface CompetitorAnalysis {
  pain_points: string[]
  missing_topics: string[]
  reader_expectations: string[]
  differentiation_recommendations: string[]
  analysis_summary: string
}

/**
 * Analyze a single review to extract pain points
 */
export async function analyzeReview(reviewText: string): Promise<ReviewAnalysis> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: `Analyze this book review and extract insights. Return a JSON object with these fields:
- pain_points: Array of specific complaints or issues the reviewer mentions
- missing_topics: Array of topics/content the reviewer wished the book covered
- reader_expectations: Array of what the reader expected but didn't get

Be specific and quote directly when possible. Return ONLY valid JSON, no explanation.

Review:
${reviewText}`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  try {
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text]
    const jsonStr = jsonMatch[1]?.trim() || text.trim()
    return JSON.parse(jsonStr) as ReviewAnalysis
  } catch {
    // Return empty arrays if parsing fails
    return {
      pain_points: [],
      missing_topics: [],
      reader_expectations: [],
    }
  }
}

/**
 * Analyze all reviews for a competitor book and generate recommendations
 */
export async function analyzeCompetitorReviews(
  bookTitle: string,
  bookAuthor: string | null,
  reviews: Array<{ review_text: string; rating: number | null; pain_points: string[] | null }>
): Promise<CompetitorAnalysis> {
  // Aggregate all pain points from individual reviews
  const allPainPoints = reviews
    .flatMap((r) => r.pain_points || [])
    .filter((p) => p.length > 0)

  // Format reviews for analysis
  const reviewsSummary = reviews
    .map((r, i) => `Review ${i + 1} (${r.rating || '?'} stars):\n${r.review_text}`)
    .join('\n\n---\n\n')

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `You are analyzing 3-star reviews of "${bookTitle}"${bookAuthor ? ` by ${bookAuthor}` : ''} to identify market gaps for a new book in this space.

Here are the reviews:
${reviewsSummary}

${allPainPoints.length > 0 ? `Previously identified pain points:\n${allPainPoints.join('\n')}` : ''}

Analyze these reviews and return a JSON object with:
- pain_points: Array of the most common/significant complaints (consolidate similar ones)
- missing_topics: Array of topics readers wanted but the book didn't cover
- reader_expectations: Array of expectations that weren't met
- differentiation_recommendations: Array of specific ways a new book could address these gaps
- analysis_summary: A 2-3 sentence summary of the main market opportunity

Focus on actionable insights for an author writing a competing book. Return ONLY valid JSON.`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  try {
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text]
    const jsonStr = jsonMatch[1]?.trim() || text.trim()
    return JSON.parse(jsonStr) as CompetitorAnalysis
  } catch {
    // Return default structure if parsing fails
    return {
      pain_points: allPainPoints,
      missing_topics: [],
      reader_expectations: [],
      differentiation_recommendations: [],
      analysis_summary: 'Analysis could not be completed. Please try again.',
    }
  }
}
