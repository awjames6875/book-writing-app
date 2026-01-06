'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface VoiceConfidenceAspect {
  id: string
  aspect: string
  current_score: number
  target_score: number
  transcripts_analyzed: number
  last_updated: string | null
}

interface VoiceConfidenceDashboardProps {
  projectId: string
}

const ASPECT_LABELS: Record<string, string> = {
  signature_phrases: 'Signature Phrases',
  speech_rhythms: 'Speech Rhythms',
  teaching_patterns: 'Teaching Patterns',
  story_structures: 'Story Structures',
  memorable_quotes: 'Memorable Quotes'
}

export function VoiceConfidenceDashboard({ projectId }: VoiceConfidenceDashboardProps) {
  const [aspects, setAspects] = useState<VoiceConfidenceAspect[]>([])
  const [loading, setLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [averageScore, setAverageScore] = useState(0)
  const [transcriptsAnalyzed, setTranscriptsAnalyzed] = useState(0)

  const fetchConfidence = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/voice-confidence`)
      const data = await response.json()
      setAspects(data.aspects ?? [])
      setIsReady(data.isReady ?? false)
      setAverageScore(data.averageScore ?? 0)
      setTranscriptsAnalyzed(data.transcriptsAnalyzed ?? 0)
    } catch (error) {
      console.error('Failed to fetch voice confidence:', error)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    fetchConfidence()
  }, [fetchConfidence])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading confidence scores...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Voice Confidence
              {isReady && (
                <Badge variant="default" className="bg-green-500">Ready</Badge>
              )}
            </CardTitle>
            <CardDescription>
              {transcriptsAnalyzed} transcript{transcriptsAnalyzed !== 1 ? 's' : ''} analyzed
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{averageScore}%</div>
            <div className="text-xs text-muted-foreground">overall</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {aspects.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No confidence data yet. Analyze transcripts to build voice confidence scores.
          </p>
        ) : (
          aspects.map(aspect => (
            <div key={aspect.id} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{ASPECT_LABELS[aspect.aspect] ?? aspect.aspect}</span>
                <span className="text-muted-foreground">
                  {aspect.current_score}% / {aspect.target_score}%
                </span>
              </div>
              <Progress
                value={aspect.current_score}
                className={aspect.current_score >= 80 ? '[&>div]:bg-green-500' : ''}
              />
            </div>
          ))
        )}

        {!isReady && aspects.length > 0 && (
          <p className="text-xs text-muted-foreground mt-4">
            Tip: Analyze more transcripts to increase confidence. Voice DNA is ready when all aspects reach 80%.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
