import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export interface DetectedCharacter {
  name: string
  role?: string
  context: string
}

const CHARACTER_DETECTION_PROMPT = `You are an expert at identifying people and characters mentioned in text content.

Analyze the following content and extract all people/characters mentioned. For each person found:

1. **Name** - The full name or identifier used
2. **Role** - Their relationship or role if mentioned (e.g., "Mentor", "Friend", "Family Member", "Colleague", "Historical Figure")
3. **Context** - A brief snippet (1-2 sentences) showing where/how they appear in the text

Important guidelines:
- Include real people, fictional characters, and anyone mentioned by name
- Do NOT include generic references like "my friend" without a name
- Do NOT include the author/narrator themselves
- Deduplicate: if the same person is mentioned multiple times, include them only once with the most informative context
- If role is unclear, omit it rather than guessing

Return your analysis as JSON in this exact format:
{
  "characters": [
    {
      "name": "John Smith",
      "role": "Mentor",
      "context": "John Smith taught me everything I know about business during my first year."
    },
    {
      "name": "Sarah",
      "context": "I met Sarah at the conference where she presented her research."
    }
  ]
}

Only return valid JSON, no additional text. If no characters are found, return {"characters": []}.`

export async function detectCharacters(content: string): Promise<DetectedCharacter[]> {
  if (!content || content.trim().length < 50) {
    return []
  }

  // Truncate content if too long (Claude has context limits)
  const maxLength = 100000
  const truncatedContent = content.length > maxLength
    ? content.substring(0, maxLength) + '\n\n[Content truncated...]'
    : content

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: `${CHARACTER_DETECTION_PROMPT}\n\n---\n\nCONTENT:\n${truncatedContent}`
      }
    ]
  })

  const responseContent = response.content[0]
  if (responseContent.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  try {
    const result = JSON.parse(responseContent.text) as { characters: DetectedCharacter[] }

    // Validate and clean the results
    const characters = (result.characters ?? [])
      .filter(c => c?.name?.trim())
      .map(c => ({
        name: c.name.trim(),
        role: c.role?.trim() || undefined,
        context: c.context?.trim() || 'No context available'
      }))

    return characters
  } catch {
    throw new Error('Failed to parse character detection response')
  }
}
