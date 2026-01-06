import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { analyzeContent } from '@/lib/ai/content-analyzer'

// Dynamic import for pdf-parse
async function extractPdfText(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require('pdf-parse') as (buffer: Buffer) => Promise<{ text: string }>
  const data = await pdfParse(buffer)
  return data.text
}

// POST /api/sources/[id]/process - Trigger content analysis
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get source
  const { data: source, error: fetchError } = await supabase
    .from('sources')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !source) {
    return NextResponse.json({ error: 'Source not found' }, { status: 404 })
  }

  // Update status to processing
  await supabase
    .from('sources')
    .update({ status: 'processing' })
    .eq('id', id)

  try {
    let contentToAnalyze = source.raw_content

    // For file-based sources (PDF), extract text first
    if (source.file_url && !contentToAnalyze) {
      // Download file from storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('sources')
        .download(source.file_url)

      if (downloadError || !fileData) {
        throw new Error('Failed to download source file')
      }

      // Extract text based on source type
      if (source.source_type === 'pdf') {
        const arrayBuffer = await fileData.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        contentToAnalyze = await extractPdfText(buffer)
      } else {
        // For other file types, try to read as text
        contentToAnalyze = await fileData.text()
      }
    }

    if (!contentToAnalyze) {
      throw new Error('No content to analyze')
    }

    // Analyze content with Claude
    const analysis = await analyzeContent(contentToAnalyze, source.source_type)

    // Update source with analysis results
    const { error: updateError } = await supabase
      .from('sources')
      .update({
        summary: analysis.summary,
        key_concepts: analysis.keyConcepts,
        status: 'ready',
      })
      .eq('id', id)

    if (updateError) throw updateError

    return NextResponse.json({
      source: {
        id,
        summary: analysis.summary,
        key_concepts: analysis.keyConcepts,
        extracted_quotes: analysis.extractedQuotes,
      },
    })
  } catch (error) {
    // Update status to failed
    await supabase
      .from('sources')
      .update({ status: 'failed' })
      .eq('id', id)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Processing failed' },
      { status: 500 }
    )
  }
}
