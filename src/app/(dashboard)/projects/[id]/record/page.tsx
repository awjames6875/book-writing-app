import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { RecordingStudio } from './RecordingStudio'

export default async function RecordPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Verify project exists and user has access
  const { data: project, error } = await supabase
    .from('projects')
    .select('id, title')
    .eq('id', id)
    .single()

  if (error !== null) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 text-sm">
        <Link href="/projects" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
          Projects
        </Link>
        <span className="text-zinc-300">/</span>
        <Link href={`/projects/${id}`} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
          {project.title}
        </Link>
        <span className="text-zinc-300">/</span>
        <span>Record</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Recording Studio</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Record your thoughts, stories, and answers. The AI will transcribe and help
          organize your content.
        </p>
      </div>

      {/* Client component handles all the interactive recording logic */}
      <RecordingStudio projectId={id} />
    </div>
  )
}
