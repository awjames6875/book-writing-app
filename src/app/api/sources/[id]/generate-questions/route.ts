import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateQuestionsFromSource } from '@/lib/ai/question-generator'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch the source with project info
    const { data: source, error: sourceError } = await supabase
      .from('sources')
      .select(
        `
        id,
        project_id,
        title,
        source_type,
        raw_content,
        summary,
        projects (
          id,
          title,
          description,
          user_id
        )
      `
      )
      .eq('id', params.id)
      .single() as {
        data: {
          id: string
          project_id: string
          title: string
          source_type: string
          raw_content: string | null
          summary: string | null
          projects: {
            id: string
            title: string
            description: string | null
            user_id: string
          }
        } | null
        error: any
      }

    if (sourceError || !source) {
      return NextResponse.json({ error: 'Source not found' }, { status: 404 })
    }

    // Verify user owns this project
    if (source.projects.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if source has content to generate questions from
    if (!source.raw_content) {
      return NextResponse.json(
        { error: 'Source has no content to generate questions from' },
        { status: 400 }
      )
    }

    // Fetch chapters for the project
    const { data: chapters } = await supabase
      .from('chapters')
      .select('id, title, description, order_index')
      .eq('project_id', source.project_id)
      .order('order_index', { ascending: true })

    // Generate questions using Claude
    const generatedQuestions = await generateQuestionsFromSource({
      sourceContent: source.raw_content,
      sourceTitle: source.title,
      sourceType: source.source_type,
      projectId: source.project_id,
      chapters: chapters || [],
    })

    // Save questions to database
    const questionsToInsert = generatedQuestions.map((q) => ({
      project_id: source.project_id,
      source_id: source.id,
      chapter_id: q.chapter_id || null,
      text: q.text,
      status: 'unanswered' as const,
    }))

    const { data: insertedQuestions, error: insertError } = await supabase
      .from('questions')
      .insert(questionsToInsert)
      .select()

    if (insertError) {
      console.error('Error inserting questions:', insertError)
      return NextResponse.json({ error: 'Failed to save questions' }, { status: 500 })
    }

    // Return the generated questions with reasoning
    return NextResponse.json({
      success: true,
      count: insertedQuestions.length,
      questions: insertedQuestions,
      reasoning: generatedQuestions.map((q, index) => ({
        question_id: insertedQuestions[index]?.id,
        text: q.text,
        chapter_reasoning: q.chapter_reasoning,
      })),
    })
  } catch (error) {
    console.error('Error generating questions:', error)
    return NextResponse.json(
      { error: 'An error occurred while generating questions' },
      { status: 500 }
    )
  }
}
