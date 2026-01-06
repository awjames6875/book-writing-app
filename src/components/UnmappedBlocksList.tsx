'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContentBlockCard } from '@/components/ContentBlockCard'

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
}

interface UnmappedBlocksListProps {
  projectId: string
  initialBlocks: ContentBlock[]
  chapters: Chapter[]
}

export function UnmappedBlocksList({
  projectId,
  initialBlocks,
  chapters,
}: UnmappedBlocksListProps) {
  const [blocks, setBlocks] = useState(initialBlocks)
  const [isAutoMapping, setIsAutoMapping] = useState(false)
  const [autoMapResult, setAutoMapResult] = useState<string | null>(null)

  const handleChapterChange = async (blockId: string, chapterId: string | null) => {
    const response = await fetch(`/api/content-blocks/${blockId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapter_id: chapterId }),
    })

    if (!response.ok) {
      throw new Error('Failed to update block')
    }

    // Remove from unmapped list if assigned to a chapter
    if (chapterId) {
      setBlocks(blocks.filter((b) => b.id !== blockId))
    }
  }

  const handleAutoMap = async () => {
    setIsAutoMapping(true)
    setAutoMapResult(null)

    try {
      const response = await fetch(`/api/projects/${projectId}/auto-map`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Auto-mapping failed')
      }

      const result = await response.json()
      setAutoMapResult(result.message)

      // Refresh the unmapped blocks list
      const unmappedResponse = await fetch(`/api/projects/${projectId}/unmapped-blocks`)
      if (unmappedResponse.ok) {
        const { blocks: newBlocks } = await unmappedResponse.json()
        setBlocks(newBlocks)
      }
    } catch (error) {
      console.error('Auto-map error:', error)
      setAutoMapResult('Auto-mapping failed. Please try again.')
    } finally {
      setIsAutoMapping(false)
    }
  }

  if (blocks.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <h3 className="text-lg font-medium">All content is mapped</h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            All your content blocks have been assigned to chapters
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Unmapped Content ({blocks.length})
            </CardTitle>
            <Button onClick={handleAutoMap} disabled={isAutoMapping || chapters.length === 0}>
              {isAutoMapping ? 'Mapping...' : 'Auto-Map All'}
            </Button>
          </div>
          {autoMapResult && (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {autoMapResult}
            </p>
          )}
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {blocks.map((block) => (
          <ContentBlockCard
            key={block.id}
            block={block}
            chapters={chapters}
            onChapterChange={handleChapterChange}
          />
        ))}
      </div>
    </div>
  )
}
