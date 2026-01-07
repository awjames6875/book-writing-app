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
    return NextResponse.json({
      manuscript: '',
      stats: { totalWordCount: 0, chapterCount: 0, chaptersWithDrafts: 0 },
    })
  }

  // Get latest draft for each chapter and assemble manuscript
  const manuscriptParts: string[] = [`# ${project.title}\n`]
  let totalWordCount = 0
  let chaptersWithDrafts = 0

  for (const chapter of chapters) {
    const { data: draft } = await supabase
      .from('chapter_drafts')
      .select('content, word_count')
      .eq('chapter_id', chapter.id)
      .order('version', { ascending: false })
      .limit(1)
      .single()

    manuscriptParts.push(`\n## Chapter ${chapter.order_index + 1}: ${chapter.title}\n`)

    if (draft) {
      manuscriptParts.push(draft.content)
      totalWordCount += draft.word_count || 0
      chaptersWithDrafts++
    } else {
      manuscriptParts.push('[No draft yet]')
    }
  }

  return NextResponse.json({
    manuscript: manuscriptParts.join('\n'),
    stats: {
      totalWordCount,
      chapterCount: chapters.length,
      chaptersWithDrafts,
    },
  })
}
