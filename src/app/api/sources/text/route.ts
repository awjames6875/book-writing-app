import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/sources/text - Create a text source
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { projectId, title, content } = body

    if (!projectId || !title || !content) {
      return NextResponse.json(
        { error: 'Missing projectId, title, or content' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('sources')
      .insert({
        project_id: projectId,
        title,
        source_type: 'text',
        raw_content: content,
        status: 'ready'
      })
      .select('id, project_id, title, source_type, created_at')
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
