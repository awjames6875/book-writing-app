import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { analyzeVoiceDna } from '@/lib/ai/voice-dna-analyzer'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id: transcriptId } = await params

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get transcript with recording and project info
  const { data: transcript, error: transcriptError } = await supabase
    .from('transcripts')
    .select(`
      id,
      raw_text,
      recording_id,
      recordings (
        id,
        project_id
      )
    `)
    .eq('id', transcriptId)
    .single()

  if (transcriptError || !transcript) {
    return NextResponse.json({ error: 'Transcript not found' }, { status: 404 })
  }

  const recording = transcript.recordings as { id: string; project_id: string } | null
  if (!recording) {
    return NextResponse.json({ error: 'Recording not found' }, { status: 404 })
  }

  const projectId = recording.project_id

  try {
    // Analyze the transcript
    const analysis = await analyzeVoiceDna(transcript.raw_text)

    // Save patterns to voice_dna table
    const patternsToInsert = analysis.patterns.map(pattern => ({
      project_id: projectId,
      category: pattern.category,
      pattern: pattern.pattern,
      context: pattern.context,
      source_transcript_id: transcriptId,
      frequency: pattern.frequency,
      confidence_score: pattern.confidenceScore
    }))

    if (patternsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('voice_dna')
        .insert(patternsToInsert)

      if (insertError) {
        console.error('Failed to save voice DNA patterns:', insertError)
        return NextResponse.json({ error: 'Failed to save patterns' }, { status: 500 })
      }
    }

    // Extract quotes and save them separately
    const quotes = analysis.patterns
      .filter(p => p.category === 'quote')
      .map(p => ({
        project_id: projectId,
        quote_text: p.pattern,
        category: 'Voice DNA',
        source_transcript_id: transcriptId,
        social_media_ready: p.confidenceScore > 0.8
      }))

    if (quotes.length > 0) {
      await supabase.from('quotes').insert(quotes)
    }

    return NextResponse.json({
      success: true,
      patternsFound: analysis.patterns.length,
      summary: analysis.summary,
      patterns: analysis.patterns
    })
  } catch (error) {
    console.error('Voice DNA analysis failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    )
  }
}
