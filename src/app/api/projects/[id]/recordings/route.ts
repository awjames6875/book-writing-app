import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/projects/[id]/recordings - List recordings for a project
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
    .from('recordings')
    .select('*, transcripts(*)')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ recordings: data })
}

// POST /api/projects/[id]/recordings - Create recording record
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id: projectId } = await params

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, audio_url, duration_seconds, question_id } = body

  if (!audio_url) {
    return NextResponse.json({ error: 'audio_url is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('recordings')
    .insert({
      project_id: projectId,
      title: title || `Recording ${new Date().toLocaleDateString()}`,
      audio_url,
      duration_seconds: duration_seconds || null,
      status: 'uploading',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // If question_id provided, link it via question_recordings
  if (question_id) {
    await supabase.from('question_recordings').insert({
      recording_id: data.id,
      question_id,
    })
  }

  return NextResponse.json({ recording: data }, { status: 201 })
}
