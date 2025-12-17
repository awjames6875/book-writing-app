import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/projects/[id]/recordings/upload - Upload audio file to storage
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

  // Verify user owns this project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .single()

  if (projectError || !project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  const formData = await request.formData()
  const file = formData.get('audio') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
  }

  // Generate unique filename: {projectId}/{timestamp}.{extension}
  const timestamp = Date.now()
  const extension = file.name.split('.').pop() || 'webm'
  const filename = `${projectId}/${timestamp}.${extension}`

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('recordings')
    .upload(filename, file, {
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({
    audio_url: data.path,
  })
}
