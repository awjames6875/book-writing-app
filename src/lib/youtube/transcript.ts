import { YoutubeTranscript } from 'youtube-transcript'

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^?\s]+)/,
    /(?:youtube\.com\/embed\/)([^?\s]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}

export async function fetchYoutubeTranscript(url: string): Promise<string> {
  const videoId = extractVideoId(url)
  if (!videoId) {
    throw new Error('Invalid YouTube URL')
  }

  const transcript = await YoutubeTranscript.fetchTranscript(videoId)
  const text = transcript.map((item) => item.text).join(' ')

  return text
}
