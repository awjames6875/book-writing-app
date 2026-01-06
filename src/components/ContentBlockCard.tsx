'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Chapter {
  id: string
  title: string
  order_index: number
}

interface ContentBlock {
  id: string
  raw_text: string
  polished_text: string | null
  content_type: string | null
  status: string | null
  chapter_id: string | null
  created_at: string | null
  chapters?: {
    id: string
    title: string
    order_index: number
  } | null
}

interface ContentBlockCardProps {
  block: ContentBlock
  chapters: Chapter[]
  onChapterChange: (blockId: string, chapterId: string | null) => Promise<void>
}

const contentTypeLabels: Record<string, string> = {
  story: 'Story',
  insight: 'Insight',
  quote: 'Quote',
  framework: 'Framework',
  exercise: 'Exercise',
  other: 'Other',
}

export function ContentBlockCard({ block, chapters, onChapterChange }: ContentBlockCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState<string | null>(block.chapter_id)

  const handleChapterSelect = async (value: string) => {
    const newChapterId = value === 'none' ? null : value
    setIsUpdating(true)
    setSelectedChapter(newChapterId)
    try {
      await onChapterChange(block.id, newChapterId)
    } catch (error) {
      console.error('Failed to update chapter:', error)
      setSelectedChapter(block.chapter_id)
    } finally {
      setIsUpdating(false)
    }
  }

  const displayText = block.polished_text ?? block.raw_text
  const truncatedText = displayText.length > 300
    ? displayText.slice(0, 300) + '...'
    : displayText

  return (
    <Card className={!selectedChapter ? 'border-amber-200 dark:border-amber-800' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-sm font-medium">
            {block.content_type
              ? contentTypeLabels[block.content_type] ?? block.content_type
              : 'Content Block'}
          </CardTitle>
          <Select
            value={selectedChapter ?? 'none'}
            onValueChange={handleChapterSelect}
            disabled={isUpdating}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Assign to chapter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Unassigned</SelectItem>
              {chapters.map((chapter) => (
                <SelectItem key={chapter.id} value={chapter.id}>
                  Ch {chapter.order_index + 1}: {chapter.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{truncatedText}</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
          {block.status && (
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800">
              {block.status}
            </span>
          )}
          {block.created_at && (
            <span>
              {new Date(block.created_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
