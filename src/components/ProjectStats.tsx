import { Card, CardContent } from '@/components/ui/card'

interface ProjectStatsProps {
  chaptersCount: number
  questionsAnswered: number
  questionsTotal: number
  currentWordCount: number
  targetWordCount: number
}

export function ProjectStats({
  chaptersCount,
  questionsAnswered,
  questionsTotal,
  currentWordCount,
  targetWordCount,
}: ProjectStatsProps) {
  const wordProgress = Math.min(100, Math.round((currentWordCount / targetWordCount) * 100))
  const questionProgress = questionsTotal > 0
    ? Math.round((questionsAnswered / questionsTotal) * 100)
    : 0

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{chaptersCount}</div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Chapters</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">
            {questionsAnswered}/{questionsTotal}
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Questions Answered ({questionProgress}%)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{currentWordCount.toLocaleString()}</div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Words Written</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{wordProgress}%</div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Progress ({targetWordCount.toLocaleString()} target)
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
