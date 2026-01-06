'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

interface AddSourceDialogProps {
  projectId: string
}

export function AddSourceDialog({ projectId }: AddSourceDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [sourceType, setSourceType] = useState<'text' | 'pdf'>('text')
  const [file, setFile] = useState<File | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }

    if (sourceType === 'text' && !content.trim()) {
      toast.error('Content is required for text sources')
      return
    }

    if (sourceType === 'pdf' && !file) {
      toast.error('Please select a PDF file')
      return
    }

    setLoading(true)
    try {
      let file_url = null

      // Upload file if PDF
      if (sourceType === 'pdf' && file) {
        const formData = new FormData()
        formData.append('file', file)

        const uploadRes = await fetch(`/api/projects/${projectId}/sources/upload`, {
          method: 'POST',
          body: formData,
        })

        if (!uploadRes.ok) {
          throw new Error('Failed to upload file')
        }

        const uploadData = await uploadRes.json()
        file_url = uploadData.file_url
      }

      // Create source record
      const res = await fetch(`/api/projects/${projectId}/sources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          source_type: sourceType,
          raw_content: sourceType === 'text' ? content.trim() : null,
          file_url,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create source')
      }

      const { source } = await res.json()

      // Trigger processing
      await fetch(`/api/sources/${source.id}/process`, {
        method: 'POST',
      })

      toast.success('Source added and processing started')
      setOpen(false)
      setTitle('')
      setContent('')
      setFile(null)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add source')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Source
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Source Material</DialogTitle>
            <DialogDescription>
              Add content to be analyzed and mapped to your chapters.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Interview notes, Research article"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Source Type</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={sourceType === 'text' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSourceType('text')}
                  disabled={loading}
                >
                  Text
                </Button>
                <Button
                  type="button"
                  variant={sourceType === 'pdf' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSourceType('pdf')}
                  disabled={loading}
                >
                  PDF
                </Button>
              </div>
            </div>

            {sourceType === 'text' && (
              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">
                  Content
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your notes, transcript, or text content here..."
                  className="min-h-[200px]"
                  disabled={loading}
                />
              </div>
            )}

            {sourceType === 'pdf' && (
              <div className="space-y-2">
                <label htmlFor="file" className="text-sm font-medium">
                  PDF File
                </label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  disabled={loading}
                />
                {file && (
                  <p className="text-sm text-zinc-500">
                    Selected: {file.name}
                  </p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Source'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
