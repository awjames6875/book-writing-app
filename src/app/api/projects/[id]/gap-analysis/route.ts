import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const CONTENT_TYPES = ['story', 'insight', 'quote', 'framework', 'exercise'] as const

interface ChapterGap {
  chapterId: string
  chapterTitle: string
  orderIndex: number
  wordProgress: {
    current: number
    target: number
    percentage: number
  }
  questions: {
    total: number
    complete: number
    percentage: number
  }
  contentTypes: {
    present: string[]
    missing: string[]
    counts: Record<string, number>
  }
  recommendations: string[]
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id: projectId } = await params

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get all chapters for the project
  const { data: chapters, error: chaptersError } = await supabase
    .from('chapters')
    .select('id, title, order_index, current_word_count, target_word_count, status')
    .eq('project_id', projectId)
    .order('order_index', { ascending: true })

  if (chaptersError) {
    return NextResponse.json({ error: chaptersError.message }, { status: 400 })
  }

  if (!chapters || chapters.length === 0) {
    return NextResponse.json({
      gaps: [],
      summary: {
        totalChapters: 0,
        chaptersWithGaps: 0,
        averageWordProgress: 0,
        averageQuestionProgress: 0
      }
    })
  }

  // Get all questions for the project grouped by chapter
  const { data: questions } = await supabase
    .from('questions')
    .select('id, chapter_id, status')
    .eq('project_id', projectId)

  // Get all content blocks for the project grouped by chapter
  const { data: contentBlocks } = await supabase
    .from('content_blocks')
    .select('id, chapter_id, content_type')
    .eq('project_id', projectId)

  // Build gap analysis for each chapter
  const gaps: ChapterGap[] = chapters.map((chapter) => {
    const currentWords = chapter.current_word_count ?? 0
    const targetWords = chapter.target_word_count ?? 5000
    const wordPercentage = targetWords > 0 ? Math.min(100, Math.round((currentWords / targetWords) * 100)) : 0

    // Question stats for this chapter
    const chapterQuestions = questions?.filter(q => q.chapter_id === chapter.id) ?? []
    const completeQuestions = chapterQuestions.filter(q => q.status === 'complete').length
    const questionPercentage = chapterQuestions.length > 0
      ? Math.round((completeQuestions / chapterQuestions.length) * 100)
      : 0

    // Content type counts for this chapter
    const chapterBlocks = contentBlocks?.filter(b => b.chapter_id === chapter.id) ?? []
    const contentTypeCounts: Record<string, number> = {}
    for (const block of chapterBlocks) {
      const type = block.content_type ?? 'other'
      contentTypeCounts[type] = (contentTypeCounts[type] ?? 0) + 1
    }

    const presentTypes = CONTENT_TYPES.filter(type => (contentTypeCounts[type] ?? 0) > 0)
    const missingTypes = CONTENT_TYPES.filter(type => (contentTypeCounts[type] ?? 0) === 0)

    // Generate recommendations
    const recommendations: string[] = []

    if (wordPercentage < 50) {
      recommendations.push('Need more content to reach word count target')
    }

    if (chapterQuestions.length > 0 && questionPercentage < 50) {
      recommendations.push('Answer more interview questions for this chapter')
    }

    if (missingTypes.includes('story')) {
      recommendations.push('Add personal stories or anecdotes')
    }

    if (missingTypes.includes('insight')) {
      recommendations.push('Include key insights or lessons learned')
    }

    if (missingTypes.includes('exercise')) {
      recommendations.push('Consider adding an exercise for readers')
    }

    return {
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      orderIndex: chapter.order_index,
      wordProgress: {
        current: currentWords,
        target: targetWords,
        percentage: wordPercentage
      },
      questions: {
        total: chapterQuestions.length,
        complete: completeQuestions,
        percentage: questionPercentage
      },
      contentTypes: {
        present: presentTypes,
        missing: missingTypes,
        counts: contentTypeCounts
      },
      recommendations
    }
  })

  // Calculate summary stats
  const totalWordProgress = gaps.reduce((sum, g) => sum + g.wordProgress.percentage, 0)
  const totalQuestionProgress = gaps.reduce((sum, g) => sum + g.questions.percentage, 0)
  const chaptersWithGaps = gaps.filter(g =>
    g.wordProgress.percentage < 100 ||
    g.questions.percentage < 100 ||
    g.contentTypes.missing.length > 0
  ).length

  return NextResponse.json({
    gaps,
    summary: {
      totalChapters: chapters.length,
      chaptersWithGaps,
      averageWordProgress: Math.round(totalWordProgress / chapters.length),
      averageQuestionProgress: Math.round(totalQuestionProgress / chapters.length)
    }
  })
}
