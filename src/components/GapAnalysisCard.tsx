import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

const contentTypeLabels: Record<string, string> = {
  story: 'Stories',
  insight: 'Insights',
  quote: 'Quotes',
  framework: 'Frameworks',
  exercise: 'Exercises',
}

export function GapAnalysisCard({ gap }: { gap: ChapterGap }) {
  const hasGaps = gap.wordProgress.percentage < 100 ||
    gap.questions.percentage < 100 ||
    gap.contentTypes.missing.length > 0

  return (
    <Card className={hasGaps ? 'border-amber-200 dark:border-amber-800' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">
            Chapter {gap.orderIndex + 1}: {gap.chapterTitle}
          </CardTitle>
          {!hasGaps && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900 dark:text-green-200">
              Complete
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Word Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Word Progress</span>
            <span className="font-medium">
              {gap.wordProgress.current.toLocaleString()} / {gap.wordProgress.target.toLocaleString()}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full bg-zinc-900 transition-all dark:bg-zinc-100"
              style={{ width: `${gap.wordProgress.percentage}%` }}
            />
          </div>
        </div>

        {/* Question Progress */}
        {gap.questions.total > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Questions Answered</span>
              <span className="font-medium">
                {gap.questions.complete} / {gap.questions.total}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${gap.questions.percentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Content Types */}
        <div className="space-y-2">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Content Types</span>
          <div className="flex flex-wrap gap-2">
            {gap.contentTypes.present.map((type) => (
              <span
                key={type}
                className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900 dark:text-green-200"
              >
                {contentTypeLabels[type] ?? type} ({gap.contentTypes.counts[type]})
              </span>
            ))}
            {gap.contentTypes.missing.map((type) => (
              <span
                key={type}
                className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
              >
                {contentTypeLabels[type] ?? type} (0)
              </span>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {gap.recommendations.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">Recommendations</span>
            <ul className="space-y-1">
              {gap.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-amber-700 dark:text-amber-400">
                  • {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
