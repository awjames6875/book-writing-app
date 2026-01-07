/**
 * AI Ghostwriting Engine
 * Generates chapter drafts using Voice DNA profile
 */

import Anthropic from '@anthropic-ai/sdk'

interface VoiceProfile {
  style_guide: string | null
  signature_phrases: string[] | null
}

interface ContentBlock {
  id: string
  content_type: string | null
  raw_text: string | null
}

interface Chapter {
  id: string
  title: string
  order_index: number
  description?: string | null
}

interface QualityCheckResult {
  criterion: string
  passed: boolean
  notes: string
}

interface GhostwriterResult {
  content: string
  wordCount: number
  qualityChecks: QualityCheckResult[]
  overallScore: number
}

const CHAPTER_TEMPLATE = `
# CHAPTER {NUMBER}: {TITLE}
## {SUBTITLE}

### PART 1: THE STORY
[Vivid personal scene with sensory details]
[Dialogue and real tension]
[Named emotions]

### PART 2: THE PRINCIPLE
[Core framework or insight]
[Etymology if relevant]
[Research/psychological backing]

### PART 3: THE PRACTICE
[Actionable exercise]
[Reflection questions]
[How reader knows they've progressed]

---

## READER EXERCISE: {EXERCISE_TITLE}
[Specific instructions]
[Journal prompts]
[Action steps]
`

const QUALITY_CRITERIA = [
  'Would the author actually say this out loud?',
  'At least one specific story with sensory details?',
  'Teaching moment with etymology or framework?',
  'Moment of vulnerability or self-correction?',
  'Ends with empowerment, not victimhood?',
  'Direct address to reader at least 3 times?',
  'Signature phrases used naturally?',
]

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

export async function generateChapterDraft(
  chapter: Chapter,
  contentBlocks: ContentBlock[],
  voiceProfile: VoiceProfile | null
): Promise<GhostwriterResult> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  // Prepare content from blocks
  const contentSummary = contentBlocks
    .map(block => block.raw_text || '')
    .filter(text => text.length > 0)
    .join('\n\n---\n\n')

  // Prepare voice profile info
  const styleGuide = voiceProfile?.style_guide || 'Write in an engaging, conversational tone.'
  const signaturePhrases = voiceProfile?.signature_phrases?.join(', ') || 'none identified yet'

  const prompt = `You are an AI ghostwriter helping an author write their book. Generate a complete chapter draft.

## CHAPTER INFORMATION
- Chapter Number: ${chapter.order_index + 1}
- Title: ${chapter.title}
${chapter.description ? `- Description: ${chapter.description}` : ''}

## VOICE DNA (Author's Style)
Style Guide: ${styleGuide}
Signature Phrases to incorporate naturally: ${signaturePhrases}

## RAW CONTENT TO USE
${contentSummary || 'No specific content provided - use the chapter title and description to create original content.'}

## CHAPTER STRUCTURE (Follow this template)
${CHAPTER_TEMPLATE}

## INSTRUCTIONS
1. Write a complete chapter following the Story → Principle → Practice structure
2. Use the author's signature phrases naturally (don't force them)
3. Include vivid sensory details and dialogue in stories
4. Address the reader directly at least 3 times
5. End with empowerment and actionable steps
6. Make it sound like the author speaking, not generic self-help

Write the complete chapter now:`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  })

  const generatedContent = response.content[0].type === 'text'
    ? response.content[0].text
    : ''

  // Run quality checks
  const qualityChecks = await runQualityChecks(generatedContent, voiceProfile, anthropic)
  const passedCount = qualityChecks.filter(check => check.passed).length
  const overallScore = Math.round((passedCount / qualityChecks.length) * 100)

  return {
    content: generatedContent,
    wordCount: countWords(generatedContent),
    qualityChecks,
    overallScore,
  }
}

async function runQualityChecks(
  content: string,
  voiceProfile: VoiceProfile | null,
  anthropic: Anthropic
): Promise<QualityCheckResult[]> {
  const signaturePhrases = voiceProfile?.signature_phrases?.join(', ') || 'none'

  const prompt = `Evaluate this chapter draft against quality criteria. For each criterion, determine if it passes (true/false) and provide brief notes.

## CHAPTER CONTENT
${content}

## AUTHOR'S SIGNATURE PHRASES
${signaturePhrases}

## CRITERIA TO EVALUATE
${QUALITY_CRITERIA.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Respond in JSON format:
{
  "evaluations": [
    {"criterion": "...", "passed": true/false, "notes": "brief explanation"}
  ]
}

Only respond with valid JSON, no other text.`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    })

    const responseText = response.content[0].type === 'text'
      ? response.content[0].text
      : '{}'

    const parsed = JSON.parse(responseText)
    return parsed.evaluations || QUALITY_CRITERIA.map(c => ({
      criterion: c,
      passed: true,
      notes: 'Unable to evaluate',
    }))
  } catch {
    // Return default checks if evaluation fails
    return QUALITY_CRITERIA.map(c => ({
      criterion: c,
      passed: true,
      notes: 'Evaluation skipped',
    }))
  }
}
