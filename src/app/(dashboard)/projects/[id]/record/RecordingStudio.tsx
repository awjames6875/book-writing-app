'use client'

import { useState, useCallback } from 'react'
import { AudioRecorder } from '@/components/AudioRecorder'
import { RecordingsList } from '@/components/RecordingsList'
import { QuestionSelector } from '@/components/QuestionSelector'

interface RecordingStudioProps {
  projectId: string
}

export function RecordingStudio({ projectId }: RecordingStudioProps) {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRecordingComplete = useCallback(() => {
    setSelectedQuestionId(null)
    setRefreshKey((k) => k + 1)
  }, [])

  return (
    <div className="space-y-8">
      {/* Question selector (optional) */}
      <QuestionSelector
        projectId={projectId}
        selectedId={selectedQuestionId}
        onSelect={setSelectedQuestionId}
      />

      {/* Audio recorder with waveform */}
      <AudioRecorder
        projectId={projectId}
        questionId={selectedQuestionId ?? undefined}
        onRecordingComplete={handleRecordingComplete}
      />

      {/* Past recordings */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Past Recordings</h2>
        <RecordingsList projectId={projectId} refreshKey={refreshKey} />
      </div>
    </div>
  )
}
