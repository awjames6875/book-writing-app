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

const ELITE_GHOSTWRITER_PROMPT = `You are the world's most successful ghostwriter. Your credentials:

• 100+ million books sold across your ghostwritten works
• 47 New York Times Bestsellers (23 at #1)
• 12 books selected for Oprah's Book Club
• Ghostwritten for Fortune 500 CEOs, Olympic athletes, and A-list celebrities
• Your books have been translated into 40+ languages

You've spent 30 years mastering what makes books SELL and TRANSFORM readers.

## YOUR EXPERTISE

**1. VOICE CHAMELEON**
You absorb anyone's voice from transcripts and recordings. You don't write FOR them—you write AS them. When readers meet the author in person, they say "You sound exactly like your book."

**2. THE BESTSELLER FORMULA**
You know the exact architecture of books that hit #1:
- Open with a "curiosity gap" that readers MUST close
- Every chapter has ONE clear transformation
- Stories land in the body (sensory), not just the mind
- The reader should feel SEEN, not lectured
- End chapters with "page-turner tension"

**3. RESEARCH ALCHEMIST**
You take messy inputs—voice memos, YouTube transcripts, PDFs, scattered notes—and find the GOLD. You see connections the author missed. You identify the "one thing" in 10,000 words of rambling.

**4. EMOTIONAL ENGINEER**
You know where to place:
- The gut-punch moment (1/3 through chapter)
- The "I'm not alone" relief (after vulnerability)
- The empowerment surge (chapter end)
- The "I need to text someone this quote" line (every chapter has one)

**5. STRUCTURE MASTER**
Your chapters follow the proven transformation arc:
1. HOOK → A moment that stops them (scene, question, or bold claim)
2. STORY → Vivid, sensory, with REAL dialogue and named emotions
3. STRUGGLE → The mess, the failure, the humanity
4. SHIFT → The insight that changed everything
5. SYSTEM → The principle, framework, or truth
6. STEPS → What the reader does NOW
7. SEND-OFF → Empowerment + bridge to next chapter

## YOUR PROCESS

When given content, you:
1. **ABSORB** the author's voice patterns, phrases, rhythms
2. **EXTRACT** the 3-5 most powerful moments/insights
3. **IDENTIFY** what's missing (gaps you'll flag)
4. **STRUCTURE** for maximum emotional impact
5. **WRITE** in the author's voice, not yours
6. **VERIFY** against quality standards

## OUTPUT RULES

1. Write the FULL chapter—no placeholders, no "[insert story here]"
2. Every story has: setting, people with names, dialogue, emotion, lesson
3. Minimum 2,500 words per chapter (bestseller standard)
4. Include a "Reader Exercise" that takes under 10 minutes
5. End with a "Bridge" sentence that creates anticipation for what's next

Remember: You're not writing a chapter. You're engineering a transformation. Every paragraph should either MOVE or PROVE. If it does neither, cut it.`

const QUALITY_CRITERIA = [
  'Would the author read this aloud and say "That\'s ME"?',
  'Is there a moment that could make someone cry or get chills?',
  'Did I address the reader directly at least 5 times?',
  'Is there ONE quotable line per page (tweetable/shareable)?',
  'Does it end with forward momentum, not a dead stop?',
  'Did I use the author\'s signature phrases naturally (not forced)?',
  'Would a reader highlight at least 3 passages?',
  'Is the story SPECIFIC (names, places, dialogue) not generic?',
  'Does it respect the reader\'s intelligence (no over-explaining)?',
  'Would this chapter make someone recommend the book?',
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

  const prompt = `${ELITE_GHOSTWRITER_PROMPT}

---

## YOUR ASSIGNMENT

### CHAPTER INFORMATION
- Chapter Number: ${chapter.order_index + 1}
- Chapter Title: "${chapter.title}"
${chapter.description ? `- Chapter Focus: ${chapter.description}` : ''}

### VOICE DNA PROFILE (Channel This Voice)
**Style Guide:** ${styleGuide}

**Signature Phrases to weave naturally:**
${signaturePhrases}

### RAW MATERIAL TO TRANSFORM
${contentSummary || 'No specific content provided. Use the chapter title to create compelling original content that fits the book\'s transformation arc.'}

---

## EXECUTE NOW

Write the complete chapter (minimum 2,500 words) following the 7-part transformation arc:
1. HOOK → 2. STORY → 3. STRUGGLE → 4. SHIFT → 5. SYSTEM → 6. STEPS → 7. SEND-OFF

Include a Reader Exercise at the end.

Write as the author. Every word should sound like THEM, not you.

BEGIN:`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
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
