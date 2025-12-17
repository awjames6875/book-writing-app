'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import WaveSurfer from 'wavesurfer.js'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js'
import { Button } from '@/components/ui/button'
import { Mic, Square, Pause, Play, Upload } from 'lucide-react'
import { toast } from 'sonner'

interface AudioRecorderProps {
  projectId: string
  questionId?: string
  onRecordingComplete?: (recordingId: string) => void
}

export function AudioRecorder({ projectId, questionId, onRecordingComplete }: AudioRecorderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)
  const recordRef = useRef<ReturnType<typeof RecordPlugin.create> | null>(null)

  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Initialize WaveSurfer
  useEffect(() => {
    if (!containerRef.current) return

    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#4f46e5',
      progressColor: '#818cf8',
      height: 100,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
    })

    const record = wavesurfer.registerPlugin(
      RecordPlugin.create({
        scrollingWaveform: true,
        renderRecordedAudio: true,
      })
    ) as ReturnType<typeof RecordPlugin.create>

    record.on('record-end', (blob: Blob) => {
      setAudioBlob(blob)
      setIsRecording(false)
      setIsPaused(false)
    })

    wavesurferRef.current = wavesurfer
    recordRef.current = record

    return () => {
      wavesurfer.destroy()
    }
  }, [])

  // Timer for recording duration
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime((t) => t + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording, isPaused])

  const startRecording = useCallback(async () => {
    if (!recordRef.current) return
    try {
      await recordRef.current.startRecording()
      setIsRecording(true)
      setRecordingTime(0)
      setAudioBlob(null)
    } catch {
      toast.error('Could not access microphone')
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (!recordRef.current) return
    recordRef.current.stopRecording()
  }, [])

  const pauseRecording = useCallback(() => {
    if (!recordRef.current) return
    if (isPaused) {
      recordRef.current.resumeRecording()
    } else {
      recordRef.current.pauseRecording()
    }
    setIsPaused(!isPaused)
  }, [isPaused])

  const uploadRecording = useCallback(async () => {
    if (!audioBlob) return
    setIsUploading(true)

    try {
      // 1. Upload audio file
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const uploadRes = await fetch(`/api/projects/${projectId}/recordings/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) {
        const data = await uploadRes.json()
        throw new Error(data.error || 'Upload failed')
      }

      const { audio_url } = await uploadRes.json()

      // 2. Create recording record
      const createRes = await fetch(`/api/projects/${projectId}/recordings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audio_url,
          duration_seconds: recordingTime,
          question_id: questionId,
        }),
      })

      if (!createRes.ok) {
        const data = await createRes.json()
        throw new Error(data.error || 'Failed to save recording')
      }

      const { recording } = await createRes.json()

      // 3. Trigger transcription
      const transcribeRes = await fetch(`/api/recordings/${recording.id}/transcribe`, {
        method: 'POST',
      })

      if (!transcribeRes.ok) {
        toast.error('Recording saved, but transcription failed')
      } else {
        toast.success('Recording saved and transcription started')
      }

      setAudioBlob(null)
      setRecordingTime(0)
      onRecordingComplete?.(recording.id)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }, [audioBlob, projectId, questionId, recordingTime, onRecordingComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4 rounded-lg border p-6">
      {/* Waveform display */}
      <div
        ref={containerRef}
        className="min-h-[100px] rounded bg-zinc-100 dark:bg-zinc-800"
      />

      {/* Timer */}
      <div className="text-center text-2xl font-mono">{formatTime(recordingTime)}</div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        {!isRecording && !audioBlob && (
          <Button onClick={startRecording} size="lg">
            <Mic className="mr-2 h-5 w-5" />
            Start Recording
          </Button>
        )}

        {isRecording && (
          <>
            <Button onClick={pauseRecording} variant="outline" size="lg">
              {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
            </Button>
            <Button onClick={stopRecording} variant="destructive" size="lg">
              <Square className="mr-2 h-5 w-5" />
              Stop
            </Button>
          </>
        )}

        {audioBlob && !isRecording && (
          <>
            <Button onClick={startRecording} variant="outline" size="lg">
              <Mic className="mr-2 h-5 w-5" />
              Re-record
            </Button>
            <Button onClick={uploadRecording} disabled={isUploading} size="lg">
              <Upload className="mr-2 h-5 w-5" />
              {isUploading ? 'Uploading...' : 'Save & Transcribe'}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
