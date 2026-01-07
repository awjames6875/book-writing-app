import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateBetaReaderGuide } from '@/lib/exporters/beta-reader-guide'

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
    .select('id, title, description, target_word_count, user_id')
    .eq('id', projectId)
    .single()

  if (projectError || !project || project.user_id !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get chapters with word counts
  const { data: chapters } = await supabase
    .from('chapters')
    .select('id, title, order_index, target_word_count')
    .eq('project_id', projectId)
    .order('order_index', { ascending: true })

  // Calculate word counts from drafts
  let totalWordCount = 0
  const chaptersWithCounts = []

  for (const chapter of chapters || []) {
    const { data: draft } = await supabase
      .from('chapter_drafts')
      .select('word_count')
      .eq('chapter_id', chapter.id)
      .order('version', { ascending: false })
      .limit(1)
      .single()

    const currentWordCount = draft?.word_count || 0
    totalWordCount += currentWordCount

    chaptersWithCounts.push({
      title: chapter.title,
      order_index: chapter.order_index,
      target_word_count: chapter.target_word_count,
      current_word_count: currentWordCount,
    })
  }

  // Generate the beta reader guide
  const guide = generateBetaReaderGuide({
    projectTitle: project.title,
    projectDescription: project.description || undefined,
    chapters: chaptersWithCounts,
    totalWordCount,
    targetWordCount: project.target_word_count || 50000,
  })

  const filename = `${project.title.replace(/[^a-z0-9]/gi, '_')}_beta_reader_guide.md`

  return new NextResponse(guide, {
    headers: {
      'Content-Type': 'text/markdown',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
