import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Tables } from '@/types/database'

type Chapter = Tables<'chapters'>

const statusLabels: Record<string, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  ready_to_write: 'Ready to Write',
  drafted: 'Drafted',
  complete: 'Complete',
}

export function ChapterCard({
  chapter,
  projectId,
}: {
  chapter: Chapter
  projectId: string
}) {
  const status = chapter.status || 'not_started'
  const currentWords = chapter.current_word_count || 0
  const targetWords = chapter.target_word_count || 5000
  const progress = Math.min(100, Math.round((currentWords / targetWords) * 100))

  return (
    <Link href={`/projects/${projectId}/chapters/${chapter.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="line-clamp-1 text-base">
                Chapter {chapter.order_index + 1}: {chapter.title}
              </CardTitle>
              {chapter.description && (
                <CardDescription className="line-clamp-2">
                  {chapter.description}
                </CardDescription>
              )}
            </div>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800">
              {statusLabels[status]}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
              <span>{currentWords.toLocaleString()} words</span>
              <span>{targetWords.toLocaleString()} target</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-full bg-zinc-900 transition-all dark:bg-zinc-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
