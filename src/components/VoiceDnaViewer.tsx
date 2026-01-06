'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface VoiceDnaPattern {
  id: string
  category: 'phrase' | 'rhythm' | 'teaching' | 'story' | 'quote'
  pattern: string
  context: string | null
  frequency: number
  confidence_score: number
  created_at: string | null
}

interface VoiceDnaViewerProps {
  projectId: string
}

const CATEGORY_LABELS: Record<string, string> = {
  phrase: 'Signature Phrases',
  rhythm: 'Speech Rhythms',
  teaching: 'Teaching Patterns',
  story: 'Story Structures',
  quote: 'Memorable Quotes'
}

const CATEGORY_COLORS: Record<string, string> = {
  phrase: 'bg-blue-100 text-blue-800',
  rhythm: 'bg-purple-100 text-purple-800',
  teaching: 'bg-green-100 text-green-800',
  story: 'bg-orange-100 text-orange-800',
  quote: 'bg-pink-100 text-pink-800'
}

export function VoiceDnaViewer({ projectId }: VoiceDnaViewerProps) {
  const [patterns, setPatterns] = useState<VoiceDnaPattern[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string | null>(null)

  const fetchPatterns = useCallback(async () => {
    setLoading(true)
    try {
      const url = filter
        ? `/api/projects/${projectId}/voice-dna?category=${filter}`
        : `/api/projects/${projectId}/voice-dna`

      const response = await fetch(url)
      const data = await response.json()
      setPatterns(data.patterns ?? [])
    } catch (error) {
      console.error('Failed to fetch voice DNA patterns:', error)
    } finally {
      setLoading(false)
    }
  }, [projectId, filter])

  useEffect(() => {
    fetchPatterns()
  }, [fetchPatterns])

  // Group patterns by category
  const groupedPatterns = patterns.reduce((acc, pattern) => {
    const cat = pattern.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(pattern)
    return acc
  }, {} as Record<string, VoiceDnaPattern[]>)

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading voice patterns...</div>
        </CardContent>
      </Card>
    )
  }

  if (patterns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Voice DNA</CardTitle>
          <CardDescription>No voice patterns detected yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Record and transcribe interviews to start building your voice DNA profile.
            The system will automatically extract your unique speech patterns, signature phrases, and storytelling style.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={filter === null ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setFilter(null)}
        >
          All ({patterns.length})
        </Badge>
        {Object.keys(CATEGORY_LABELS).map(cat => {
          const count = groupedPatterns[cat]?.length ?? 0
          if (count === 0) return null
          return (
            <Badge
              key={cat}
              variant={filter === cat ? 'default' : 'outline'}
              className={`cursor-pointer ${filter !== cat ? CATEGORY_COLORS[cat] : ''}`}
              onClick={() => setFilter(filter === cat ? null : cat)}
            >
              {CATEGORY_LABELS[cat]} ({count})
            </Badge>
          )
        })}
      </div>

      {/* Pattern cards */}
      <div className="grid gap-3">
        {(filter ? groupedPatterns[filter] ?? [] : patterns).map(pattern => (
          <Card key={pattern.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={CATEGORY_COLORS[pattern.category]} variant="secondary">
                      {CATEGORY_LABELS[pattern.category]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(pattern.confidence_score * 100)}% confidence
                    </span>
                  </div>
                  <p className="font-medium">{pattern.pattern}</p>
                  {pattern.context && (
                    <p className="text-sm text-muted-foreground mt-1">{pattern.context}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-bold text-primary">{pattern.frequency}</div>
                  <div className="text-xs text-muted-foreground">frequency</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
