import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
    return new NextResponse('No chapters found', { status: 404 })
  }

  // Build markdown content
  const markdownParts: string[] = [`# ${project.title}\n`]

  for (const chapter of chapters) {
    const { data: draft } = await supabase
      .from('chapter_drafts')
      .select('content')
      .eq('chapter_id', chapter.id)
      .order('version', { ascending: false })
      .limit(1)
      .single()

    markdownParts.push(`\n## Chapter ${chapter.order_index + 1}: ${chapter.title}\n`)
    markdownParts.push(draft?.content || '[No draft yet]')
  }

  const markdown = markdownParts.join('\n')
  const filename = `${project.title.replace(/[^a-z0-9]/gi, '_')}_manuscript.md`

  return new NextResponse(markdown, {
    headers: {
      'Content-Type': 'text/markdown',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
