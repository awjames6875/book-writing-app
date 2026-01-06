import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const PREP_GENERATION_PROMPT = `You are an expert interview coach helping authors prepare for recording sessions about their book.

Given a question that the author needs to answer for their book, generate interview preparation materials.

Return your response as JSON in this exact format:
{
  "prep_guide": "A 2-3 sentence guide explaining how to approach this question, what angle to take, and what makes a compelling answer",
  "memory_prompts": ["prompt 1", "prompt 2", "prompt 3"],
  "starter_phrase": "A natural opening phrase to start the answer"
}

Rules for memory_prompts:
- Generate 3-5 prompts that help trigger specific memories or stories
- Each prompt should be a question or statement that helps recall relevant experiences
- Make them specific and evocative, not generic

Rules for starter_phrase:
- Should be conversational and natural
- Help the author begin speaking without overthinking
- Under 15 words

Only return valid JSON, no additional text.`

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { questionId, questionText, context } = body

  if (!questionText) {
    return NextResponse.json({ error: 'questionText is required' }, { status: 400 })
  }

  try {
    const contextInfo = context ? `\n\nAdditional context: ${context}` : ''

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `${PREP_GENERATION_PROMPT}\n\n---\n\nQUESTION: ${questionText}${contextInfo}`
        }
      ]
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    const result = JSON.parse(content.text)

    // Validate the response structure
    if (!result.prep_guide || !result.memory_prompts || !result.starter_phrase) {
      throw new Error('Invalid response structure from AI')
    }

    // If questionId provided, update the question in database
    if (questionId) {
      const { error: updateError } = await supabase
        .from('questions')
        .update({
          prep_guide: result.prep_guide,
          memory_prompts: result.memory_prompts,
          starter_phrase: result.starter_phrase
        })
        .eq('id', questionId)

      if (updateError) {
        console.error('Failed to update question:', updateError)
      }
    }

    return NextResponse.json({
      prep_guide: result.prep_guide,
      memory_prompts: result.memory_prompts,
      starter_phrase: result.starter_phrase
    })
  } catch (error) {
    console.error('Failed to generate prep:', error)
    return NextResponse.json(
      { error: 'Failed to generate interview prep' },
      { status: 500 }
    )
  }
}
