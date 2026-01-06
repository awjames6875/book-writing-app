import { createClient } from '@/lib/supabase/server'

const VOICE_ASPECTS = [
  'signature_phrases',
  'speech_rhythms',
  'teaching_patterns',
  'story_structures',
  'memorable_quotes'
] as const

type VoiceAspect = typeof VOICE_ASPECTS[number]

const CATEGORY_TO_ASPECT: Record<string, VoiceAspect> = {
  phrase: 'signature_phrases',
  rhythm: 'speech_rhythms',
  teaching: 'teaching_patterns',
  story: 'story_structures',
  quote: 'memorable_quotes'
}

export async function updateVoiceConfidence(projectId: string): Promise<void> {
  const supabase = await createClient()

  // Get all voice DNA patterns for this project
  const { data: patterns, error: patternsError } = await supabase
    .from('voice_dna')
    .select('category, frequency, confidence_score, source_transcript_id')
    .eq('project_id', projectId)

  if (patternsError) {
    throw new Error(`Failed to fetch patterns: ${patternsError.message}`)
  }

  // Count unique transcripts analyzed
  const uniqueTranscripts = new Set(
    patterns?.map(p => p.source_transcript_id).filter(Boolean) ?? []
  )
  const transcriptsAnalyzed = uniqueTranscripts.size

  // Calculate scores for each aspect
  const aspectScores: Record<VoiceAspect, number> = {
    signature_phrases: 0,
    speech_rhythms: 0,
    teaching_patterns: 0,
    story_structures: 0,
    memorable_quotes: 0
  }

  // Group patterns by aspect and calculate score
  for (const pattern of patterns ?? []) {
    const aspect = CATEGORY_TO_ASPECT[pattern.category]
    if (aspect) {
      // Score based on: frequency weight + confidence + bonus for having multiple patterns
      const patternScore = (pattern.frequency / 10) * 20 + (pattern.confidence_score * 30)
      aspectScores[aspect] += patternScore
    }
  }

  // Normalize scores to 0-100 range
  // More transcripts = higher confidence ceiling
  const maxPossibleScore = Math.min(100, transcriptsAnalyzed * 25 + 25)

  for (const aspect of VOICE_ASPECTS) {
    // Cap at maxPossibleScore, minimum 0
    aspectScores[aspect] = Math.min(maxPossibleScore, Math.max(0, Math.round(aspectScores[aspect])))
  }

  // Upsert confidence scores for each aspect
  for (const aspect of VOICE_ASPECTS) {
    await supabase
      .from('voice_confidence')
      .upsert({
        project_id: projectId,
        aspect,
        current_score: aspectScores[aspect],
        target_score: 95,
        transcripts_analyzed: transcriptsAnalyzed,
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'project_id,aspect'
      })
  }
}

export async function getVoiceConfidence(projectId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('voice_confidence')
    .select('*')
    .eq('project_id', projectId)
    .order('aspect')

  if (error) {
    throw new Error(`Failed to fetch confidence: ${error.message}`)
  }

  // Check if voice is "ready" (all aspects above 80%)
  const isReady = data?.every(d => d.current_score >= 80) ?? false
  const averageScore = data?.length
    ? Math.round(data.reduce((sum, d) => sum + d.current_score, 0) / data.length)
    : 0

  return {
    aspects: data ?? [],
    isReady,
    averageScore,
    transcriptsAnalyzed: data?.[0]?.transcripts_analyzed ?? 0
  }
}
