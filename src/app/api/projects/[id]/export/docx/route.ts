import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateDocx } from '@/lib/exporters/docx-exporter'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, title, user_id')
    .eq('id', projectId)
    .single()

  if (projectError || !project || project.user_id !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get chapters
  const { data: chapters } = await supabase
    .from('chapters')
    .select('id, title, order_index')
    .eq('project_id', projectId)
    .order('order_index', { ascending: true })

  if (!chapters || chapters.length === 0) {
    return NextResponse.json({ error: 'No chapters found' }, { status: 404 })
  }

  // Get latest draft for each chapter
  const chapterData = []

  for (const chapter of chapters) {
    const { data: draft } = await supabase
      .from('chapter_drafts')
      .select('content')
      .eq('chapter_id', chapter.id)
      .order('version', { ascending: false })
      .limit(1)
      .single()

    chapterData.push({
      title: chapter.title,
      content: draft?.content || '[No draft yet]',
    })
  }

  // Generate DOCX
  const buffer = await generateDocx({
    title: project.title,
    chapters: chapterData,
  })

  const filename = `${project.title.replace(/[^a-z0-9]/gi, '_')}_manuscript.docx`

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
