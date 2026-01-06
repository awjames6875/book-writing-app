import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { GapAnalysisCard } from '@/components/GapAnalysisCard'

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

interface GapAnalysisResponse {
  gaps: ChapterGap[]
  summary: {
    totalChapters: number
    chaptersWithGaps: number
    averageWordProgress: number
    averageQuestionProgress: number
  }
}

export default async function GapsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, title')
    .eq('id', id)
    .single()

  if (projectError) {
    notFound()
  }

  // Fetch gap analysis data from API
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const response = await fetch(`${baseUrl}/api/projects/${id}/gap-analysis`, {
    cache: 'no-store',
    headers: {
      cookie: '', // Server-side fetch needs auth handled differently
    },
  })

  // If the fetch fails, calculate directly
  let gapData: GapAnalysisResponse | null = null

  if (!response.ok) {
    // Fallback: calculate gap analysis directly
    const { data: chapters } = await supabase
      .from('chapters')
      .select('id, title, order_index, current_word_count, target_word_count')
      .eq('project_id', id)
      .order('order_index', { ascending: true })

    const { data: questions } = await supabase
      .from('questions')
      .select('id, chapter_id, status')
      .eq('project_id', id)

    const { data: contentBlocks } = await supabase
      .from('content_blocks')
      .select('id, chapter_id, content_type')
      .eq('project_id', id)

    const CONTENT_TYPES = ['story', 'insight', 'quote', 'framework', 'exercise'] as const

    const gaps: ChapterGap[] = (chapters ?? []).map((chapter) => {
      const currentWords = chapter.current_word_count ?? 0
      const targetWords = chapter.target_word_count ?? 5000
      const wordPercentage = targetWords > 0 ? Math.min(100, Math.round((currentWords / targetWords) * 100)) : 0

      const chapterQuestions = questions?.filter(q => q.chapter_id === chapter.id) ?? []
      const completeQuestions = chapterQuestions.filter(q => q.status === 'complete').length
      const questionPercentage = chapterQuestions.length > 0
        ? Math.round((completeQuestions / chapterQuestions.length) * 100)
        : 0

      const chapterBlocks = contentBlocks?.filter(b => b.chapter_id === chapter.id) ?? []
      const contentTypeCounts: Record<string, number> = {}
      for (const block of chapterBlocks) {
        const type = block.content_type ?? 'other'
        contentTypeCounts[type] = (contentTypeCounts[type] ?? 0) + 1
      }

      const presentTypes = CONTENT_TYPES.filter(type => (contentTypeCounts[type] ?? 0) > 0)
      const missingTypes = CONTENT_TYPES.filter(type => (contentTypeCounts[type] ?? 0) === 0)

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
        wordProgress: { current: currentWords, target: targetWords, percentage: wordPercentage },
        questions: { total: chapterQuestions.length, complete: completeQuestions, percentage: questionPercentage },
        contentTypes: { present: presentTypes, missing: missingTypes, counts: contentTypeCounts },
        recommendations
      }
    })

    const totalWordProgress = gaps.reduce((sum, g) => sum + g.wordProgress.percentage, 0)
    const totalQuestionProgress = gaps.reduce((sum, g) => sum + g.questions.percentage, 0)
    const chaptersWithGaps = gaps.filter(g =>
      g.wordProgress.percentage < 100 ||
      g.questions.percentage < 100 ||
      g.contentTypes.missing.length > 0
    ).length

    gapData = {
      gaps,
      summary: {
        totalChapters: chapters?.length ?? 0,
        chaptersWithGaps,
        averageWordProgress: gaps.length > 0 ? Math.round(totalWordProgress / gaps.length) : 0,
        averageQuestionProgress: gaps.length > 0 ? Math.round(totalQuestionProgress / gaps.length) : 0
      }
    }
  } else {
    gapData = await response.json()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <Link
            href="/projects"
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Projects
          </Link>
          <span className="text-zinc-300">/</span>
          <Link
            href={`/projects/${id}`}
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            {project.title}
          </Link>
          <span className="text-zinc-300">/</span>
        </div>
        <h1 className="mt-1 text-3xl font-bold">Gap Analysis</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Identify missing content and track chapter progress.
        </p>
      </div>

      {/* Summary Stats */}
      {gapData && gapData.summary.totalChapters > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{gapData.summary.totalChapters}</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Total Chapters</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{gapData.summary.chaptersWithGaps}</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Chapters with Gaps</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{gapData.summary.averageWordProgress}%</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Avg Word Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{gapData.summary.averageQuestionProgress}%</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Avg Question Progress</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gap Analysis Cards */}
      {gapData && gapData.gaps.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {gapData.gaps.map((gap) => (
            <GapAnalysisCard key={gap.chapterId} gap={gap} />
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium">No chapters yet</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Create chapters in your project to see gap analysis
            </p>
            <Link
              href={`/projects/${id}`}
              className="mt-4 text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Go to Project
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
