'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Youtube, Globe, FileAudio, Image, Trash2, Loader2 } from 'lucide-react'
import type { Tables } from '@/types/database'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type Source = Tables<'sources'>

const statusLabels: Record<string, string> = {
  uploading: 'Uploading',
  processing: 'Processing',
  ready: 'Ready',
  failed: 'Failed',
}

const statusColors: Record<string, string> = {
  uploading: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  ready: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  pdf: FileText,
  text: FileText,
  youtube: Youtube,
  article: Globe,
  audio: FileAudio,
  image: Image,
}

export function SourceCard({ source }: { source: Source }) {
  const router = useRouter()
  const status = source.status || 'uploading'
  const Icon = typeIcons[source.source_type] || FileText

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this source?')) return

    try {
      const response = await fetch(`/api/sources/${source.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete source')
      }

      toast.success('Source deleted')
      router.refresh()
    } catch (error) {
      toast.error('Failed to delete source')
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
              <Icon className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <CardTitle className="line-clamp-1 text-base">
                {source.title}
              </CardTitle>
              <CardDescription className="text-xs uppercase">
                {source.source_type}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs ${statusColors[status]}`}>
              {status === 'processing' && (
                <Loader2 className="mr-1 inline h-3 w-3 animate-spin" />
              )}
              {statusLabels[status]}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-500 hover:text-red-500"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {source.summary && status === 'ready' && (
        <CardContent>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {source.summary}
          </p>
          {source.key_concepts && Array.isArray(source.key_concepts) && (
            <div className="mt-2 flex flex-wrap gap-1">
              {(source.key_concepts as string[]).slice(0, 5).map((concept, i) => (
                <span
                  key={i}
                  className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800"
                >
                  {concept}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
