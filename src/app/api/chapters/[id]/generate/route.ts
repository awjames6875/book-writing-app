import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateChapterDraft } from '@/lib/ai/ghostwriter'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: chapterId } = await params
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get chapter with project info
  const { data: chapter, error: chapterError } = await supabase
    .from('chapters')
    .select('id, title, order_index, description, project_id')
    .eq('id', chapterId)
    .single()

  if (chapterError || !chapter) {
    return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
  }

  // Verify user owns the project
  const { data: project } = await supabase
    .from('projects')
    .select('id, user_id')
    .eq('id', chapter.project_id)
    .single()

  if (!project || project.user_id !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get content blocks for this chapter
  const { data: contentBlocks } = await supabase
    .from('content_blocks')
    .select('id, content_type, raw_text')
    .eq('chapter_id', chapterId)

  // Get voice profile
  const { data: voiceProfile } = await supabase
    .from('voice_profiles')
    .select('style_guide, signature_phrases')
    .eq('project_id', chapter.project_id)
    .single()

  try {
    // Generate the chapter draft
    const result = await generateChapterDraft(
      {
        id: chapter.id,
        title: chapter.title,
        order_index: chapter.order_index,
        description: chapter.description,
      },
      contentBlocks || [],
      voiceProfile ? {
        style_guide: voiceProfile.style_guide,
        signature_phrases: voiceProfile.signature_phrases as string[] | null,
      } : null
    )

    // Get the next version number
    const { data: existingDrafts } = await supabase
      .from('chapter_drafts')
      .select('version')
      .eq('chapter_id', chapterId)
      .order('version', { ascending: false })
      .limit(1)

    const nextVersion = existingDrafts?.[0]?.version ? existingDrafts[0].version + 1 : 1

    // Save the draft
    const { data: savedDraft, error: saveError } = await supabase
      .from('chapter_drafts')
      .insert({
        chapter_id: chapterId,
        content: result.content,
        version: nextVersion,
        word_count: result.wordCount,
      })
      .select()
      .single()

    if (saveError) {
      return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 })
    }

    return NextResponse.json({
      draft: savedDraft,
      qualityChecks: result.qualityChecks,
      overallScore: result.overallScore,
    })
  } catch (error) {
    console.error('Error generating chapter:', error)
    return NextResponse.json(
      { error: 'Failed to generate chapter' },
      { status: 500 }
    )
  }
}
