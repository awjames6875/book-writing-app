import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak,
  Packer,
} from 'docx'

interface Chapter {
  title: string
  content: string
}

interface ManuscriptData {
  title: string
  author?: string
  chapters: Chapter[]
}

function parseMarkdownToParagraphs(markdown: string): Paragraph[] {
  const paragraphs: Paragraph[] = []
  const lines = markdown.split("\n")

  for (const line of lines) {
    const trimmedLine = line.trim()
    if (trimmedLine === "") continue

    if (trimmedLine.startsWith("### ")) {
      paragraphs.push(
        new Paragraph({
          text: trimmedLine.slice(4),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 240, after: 120 },
        })
      )
    } else if (trimmedLine.startsWith("## ")) {
      paragraphs.push(
        new Paragraph({
          text: trimmedLine.slice(3),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 360, after: 120 },
        })
      )
    } else if (trimmedLine.startsWith("# ")) {
      paragraphs.push(
        new Paragraph({
          text: trimmedLine.slice(2),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 480, after: 240 },
        })
      )
    } else {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: trimmedLine })],
          spacing: { after: 200 },
        })
      )
    }
  }

  return paragraphs
}

function createTitlePage(title: string, author?: string): Paragraph[] {
  const paragraphs: Paragraph[] = []

  paragraphs.push(new Paragraph({ text: "", spacing: { before: 4000 } }))

  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: title, bold: true, size: 72 })],
      alignment: AlignmentType.CENTER,
    })
  )

  if (author) {
    paragraphs.push(new Paragraph({ text: "" }))
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: `by ${author}`, italics: true, size: 36 })],
        alignment: AlignmentType.CENTER,
      })
    )
  }

  paragraphs.push(new Paragraph({ children: [new PageBreak()] }))

  return paragraphs
}

function createChapterSection(chapter: Chapter, index: number): Paragraph[] {
  const paragraphs: Paragraph[] = []

  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: `Chapter ${index + 1}`, size: 28 })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 480 },
    })
  )

  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: chapter.title, bold: true, size: 36 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 480 },
    })
  )

  paragraphs.push(...parseMarkdownToParagraphs(chapter.content))

  paragraphs.push(new Paragraph({ children: [new PageBreak()] }))

  return paragraphs
}

export async function generateDocx(data: ManuscriptData): Promise<Buffer> {
  const sections: Paragraph[] = []

  sections.push(...createTitlePage(data.title, data.author))

  data.chapters.forEach((chapter, index) => {
    sections.push(...createChapterSection(chapter, index))
  })

  const doc = new Document({
    sections: [{ properties: {}, children: sections }],
  })

  const buffer = await Packer.toBuffer(doc)
  return Buffer.from(buffer)
}

export async function generateDocxFromMarkdown(
  title: string,
  markdown: string,
  author?: string
): Promise<Buffer> {
  const chapters: Chapter[] = []
  const chapterRegex = /^#\s+(.+)$/gm
  const matches = [...markdown.matchAll(chapterRegex)]

  if (matches.length === 0) {
    chapters.push({ title: "Content", content: markdown })
  } else {
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i]
      const nextMatch = matches[i + 1]
      const startIndex = match.index! + match[0].length
      const endIndex = nextMatch ? nextMatch.index! : markdown.length
      chapters.push({
        title: match[1],
        content: markdown.slice(startIndex, endIndex).trim(),
      })
    }
  }

  return generateDocx({ title, author, chapters })
}
