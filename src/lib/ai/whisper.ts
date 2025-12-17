import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function transcribeAudio(audioFile: File | Blob): Promise<string> {
  // Convert Blob to File if needed (Whisper API requires File)
  const file = audioFile instanceof File
    ? audioFile
    : new File([audioFile], 'recording.webm', { type: audioFile.type })

  const response = await openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    response_format: 'text',
  })

  return response
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}
