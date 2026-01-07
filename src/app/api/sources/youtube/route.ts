import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { extractVideoId, fetchYoutubeTranscript } from '@/lib/youtube/transcript'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { projectId, url } = body

    if (!projectId || !url) {
      return NextResponse.json({ error: 'Missing projectId or url' }, { status: 400 })
    }

    const videoId = extractVideoId(url)
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 })
    }

    const transcript = await fetchYoutubeTranscript(url)

    const { data, error } = await supabase
      .from('sources')
      .insert({
        project_id: projectId,
        title: 'YouTube: ' + videoId,
        source_type: 'youtube',
        file_url: url,
        raw_content: transcript,
      })
      .select('id, project_id, title, source_type, file_url, created_at')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ source: data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
