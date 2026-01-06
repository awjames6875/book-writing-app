import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChatInterface } from '@/components/ChatInterface'

export default async function ChatPage({
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

  // Get source count to show in description
  const { count: sourceCount } = await supabase
    .from('sources')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', id)
    .eq('status', 'ready')

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 text-sm">
        <Link
          href="/projects"
          className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          Projects
        </Link>
        <span className="text-zinc-300">/</span>
        <Link
          href={`/projects/${id}`}
          className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          {project.title}
        </Link>
        <span className="text-zinc-300">/</span>
        <span>Chat</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Chat with Sources</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Ask questions about your uploaded content. The AI will search through your{' '}
          {sourceCount ?? 0} source{sourceCount !== 1 ? 's' : ''} and provide answers
          with citations.
        </p>
      </div>

      {/* Chat Interface */}
      <ChatInterface projectId={id} />
    </div>
  )
}
