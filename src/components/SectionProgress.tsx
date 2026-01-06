import { Card, CardContent } from '@/components/ui/card'

interface SectionProgressProps {
  sectionName: string
  completionPercentage: number
  status: 'not_started' | 'in_progress' | 'complete'
  questionCount?: number
}

const statusColors: Record<string, string> = {
  not_started: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  complete: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
}

const statusLabels: Record<string, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  complete: 'Complete',
}

export function SectionProgress({
  sectionName,
  completionPercentage,
  status,
  questionCount
}: SectionProgressProps) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{sectionName}</h3>
          <span className={`rounded-full px-2 py-0.5 text-xs ${statusColors[status]}`}>
            {statusLabels[status]}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">
              {questionCount !== undefined ? `${questionCount} questions` : 'Progress'}
            </span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-2 rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
