import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Tables } from '@/types/database'

type Project = Tables<'projects'>

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  in_progress: 'In Progress',
  review: 'Review',
  complete: 'Complete',
}

export function ProjectCard({ project }: { project: Project }) {
  const status = project.status || 'draft'

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="line-clamp-1">{project.title}</CardTitle>
            <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800">
              {statusLabels[status]}
            </span>
          </div>
          {project.description && (
            <CardDescription className="line-clamp-2">
              {project.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
            <span>Target: {(project.target_word_count || 50000).toLocaleString()} words</span>
            <span>
              {new Date(project.updated_at || project.created_at || '').toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
