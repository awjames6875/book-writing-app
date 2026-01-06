import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const VOICE_ASPECTS = [
  'signature_phrases',
  'speech_rhythms',
  'teaching_patterns',
  'story_structures',
  'memorable_quotes'
]

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id: projectId } = await params

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('voice_confidence')
    .select('*')
    .eq('project_id', projectId)
    .order('aspect')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Check if voice is "ready" (all aspects above 80%)
  const isReady = data?.length === VOICE_ASPECTS.length &&
    data.every(d => d.current_score >= 80)

  const averageScore = data?.length
    ? Math.round(data.reduce((sum, d) => sum + d.current_score, 0) / data.length)
    : 0

  return NextResponse.json({
    aspects: data ?? [],
    isReady,
    averageScore,
    transcriptsAnalyzed: data?.[0]?.transcripts_analyzed ?? 0
  })
}
