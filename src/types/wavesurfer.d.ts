declare module 'wavesurfer.js/dist/plugins/record.esm.js' {
  import type { GenericPlugin } from 'wavesurfer.js'

  interface RecordPluginOptions {
    scrollingWaveform?: boolean
    renderRecordedAudio?: boolean
    mimeType?: string
  }

  interface RecordPluginInstance extends GenericPlugin {
    startRecording(): Promise<void>
    stopRecording(): void
    pauseRecording(): void
    resumeRecording(): void
    isRecording(): boolean
    isPaused(): boolean
    on(event: 'record-end', callback: (blob: Blob) => void): () => void
    on(event: 'record-start', callback: () => void): () => void
    on(event: 'record-pause', callback: () => void): () => void
    on(event: 'record-resume', callback: () => void): () => void
    destroy(): void
  }

  const RecordPlugin: {
    create(options?: RecordPluginOptions): GenericPlugin & RecordPluginInstance
  }

  export default RecordPlugin
}
