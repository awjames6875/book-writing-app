import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { transcribeAudio, countWords } from '@/lib/ai/whisper'

// POST /api/recordings/[id]/transcribe - Trigger transcription
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get recording
  const { data: recording, error: fetchError } = await supabase
    .from('recordings')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !recording) {
    return NextResponse.json({ error: 'Recording not found' }, { status: 404 })
  }

  // Update status to transcribing
  await supabase
    .from('recordings')
    .update({ status: 'transcribing' })
    .eq('id', id)

  try {
    // Download audio from storage
    const { data: audioData, error: downloadError } = await supabase.storage
      .from('recordings')
      .download(recording.audio_url)

    if (downloadError || !audioData) {
      throw new Error('Failed to download audio file')
    }

    // Transcribe with Whisper
    const rawText = await transcribeAudio(audioData)
    const wordCount = countWords(rawText)

    // Save transcript
    const { data: transcript, error: insertError } = await supabase
      .from('transcripts')
      .insert({
        recording_id: id,
        raw_text: rawText,
        word_count: wordCount,
      })
      .select()
      .single()

    if (insertError) throw insertError

    // Update recording status to processed
    await supabase
      .from('recordings')
      .update({ status: 'processed' })
      .eq('id', id)

    return NextResponse.json({ transcript })
  } catch (error) {
    // Update status to failed
    await supabase
      .from('recordings')
      .update({ status: 'failed' })
      .eq('id', id)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Transcription failed' },
      { status: 500 }
    )
  }
}
