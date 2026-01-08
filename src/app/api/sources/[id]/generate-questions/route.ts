import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { generateQuestionsFromSource, BookContext, Chapter } from '@/lib/ai/question-generator'

// POST /api/sources/[id]/generate-questions - Generate questions from source
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

  // Get source with project info
  const { data: source, error: sourceError } = await supabase
    .from('sources')
    .select('*, projects!inner(user_id, book_context)')
    .eq('id', id)
    .single()

  if (sourceError || !source) {
    return NextResponse.json({ error: 'Source not found' }, { status: 404 })
  }

  // Verify ownership
  if (source.projects.user_id !== user.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!source.raw_content && !source.summary) {
    return NextResponse.json({ error: 'Source has no content to analyze' }, { status: 400 })
  }

  try {
    // Get chapters for this project
    const { data: chapters } = await supabase
      .from('chapters')
      .select('id, title, order_index, theme, core_principle')
      .eq('project_id', source.project_id)
      .order('order_index', { ascending: true })

    const bookContext = source.projects.book_context as BookContext | null
    const content = source.raw_content || source.summary || ''

    // Generate questions
    const result = await generateQuestionsFromSource(
      content,
      bookContext,
      (chapters || []) as Chapter[]
    )

    if (result.questions.length === 0) {
      return NextResponse.json({ questions: [], message: 'No questions generated' })
    }

    // Get next order_index
    const { data: lastQuestion } = await supabase
      .from('questions')
      .select('order_index')
      .eq('project_id', source.project_id)
      .order('order_index', { ascending: false })
      .limit(1)
      .single()

    let orderIndex = (lastQuestion?.order_index ?? -1) + 1

    // Insert generated questions
    const questionsToInsert = result.questions.map(q => ({
      project_id: source.project_id,
      chapter_id: q.chapter_id || null,
      text: q.text,
      order_index: orderIndex++,
      status: 'unanswered'
    }))

    const { data: insertedQuestions, error: insertError } = await supabase
      .from('questions')
      .insert(questionsToInsert)
      .select()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ questions: insertedQuestions })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Question generation failed' },
      { status: 500 }
    )
  }
}
