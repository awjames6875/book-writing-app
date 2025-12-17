'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, FileText, Clock, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

interface Recording {
  id: string
  title: string | null
  duration_seconds: number | null
  status: string | null
  created_at: string | null
  transcripts: Array<{
    id: string
    raw_text: string
    word_count: number | null
  }> | null
}

interface RecordingsListProps {
  projectId: string
  refreshKey?: number
}

export function RecordingsList({ projectId, refreshKey }: RecordingsListProps) {
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRecordings = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/recordings`)
      if (!res.ok) throw new Error('Failed to fetch recordings')
      const data = (await res.json()) as { recordings: Recording[] }
      setRecordings(data.recordings ?? [])
    } catch {
      toast.error('Failed to load recordings')
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    fetchRecordings()
  }, [fetchRecordings, refreshKey])

  // Poll for transcription status on recordings that are transcribing
  useEffect(() => {
    const transcribing = recordings.filter((r) => r.status === 'transcribing')
    if (transcribing.length === 0) return

    const interval = setInterval(fetchRecordings, 5000)
    return () => clearInterval(interval)
  }, [recordings, fetchRecordings])

  const deleteRecording = async (id: string) => {
    if (!confirm('Delete this recording?')) return

    try {
      const res = await fetch(`/api/recordings/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setRecordings(recordings.filter((r) => r.id !== id))
      toast.success('Recording deleted')
    } catch {
      toast.error('Failed to delete recording')
    }
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '--:--'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusBadge = (status: string | null) => {
    const styles: Record<string, string> = {
      uploading: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      transcribing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      processed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    }
    return (
      <span className={`rounded-full px-2 py-0.5 text-xs ${styles[status || 'uploading']}`}>
        {status === 'transcribing' && (
          <RefreshCw className="mr-1 inline h-3 w-3 animate-spin" />
        )}
        {status || 'uploading'}
      </span>
    )
  }

  if (loading) {
    return <div className="py-8 text-center text-zinc-500">Loading recordings...</div>
  }

  if (recordings.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center text-zinc-500">
          No recordings yet. Start recording above!
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {recordings.map((recording) => (
        <Card key={recording.id}>
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <CardTitle className="text-base font-medium">
                {recording.title || 'Untitled Recording'}
              </CardTitle>
              {getStatusBadge(recording.status)}
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center text-sm text-zinc-500">
                <Clock className="mr-1 h-4 w-4" />
                {formatDuration(recording.duration_seconds)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteRecording(recording.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {recording.transcripts && recording.transcripts.length > 0 && (
            <CardContent className="pt-0">
              <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-800">
                <div className="mb-2 flex items-center gap-2 text-sm text-zinc-500">
                  <FileText className="h-4 w-4" />
                  {recording.transcripts[0].word_count} words
                </div>
                <p className="line-clamp-3 text-sm">{recording.transcripts[0].raw_text}</p>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
