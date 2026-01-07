interface Chapter {
  title: string
  order_index: number
  target_word_count: number | null
  current_word_count: number | null
}

interface BetaGuideData {
  projectTitle: string
  projectDescription?: string
  author?: string
  chapters: Chapter[]
  totalWordCount: number
  targetWordCount: number
}

export function generateBetaReaderGuide(data: BetaGuideData): string {
  const lines: string[] = []

  lines.push(`# Beta Reader Guide: ${data.projectTitle}`)
  lines.push("")

  if (data.author) {
    lines.push(`**Author:** ${data.author}`)
    lines.push("")
  }

  if (data.projectDescription) {
    lines.push("## About This Book")
    lines.push("")
    lines.push(data.projectDescription)
    lines.push("")
  }

  lines.push("## Manuscript Overview")
  lines.push("")
  lines.push(`- **Total Word Count:** ${data.totalWordCount.toLocaleString()} words`)
  lines.push(`- **Target Word Count:** ${data.targetWordCount.toLocaleString()} words`)
  lines.push(`- **Chapter Count:** ${data.chapters.length}`)
  lines.push(`- **Completion:** ${Math.round((data.totalWordCount / data.targetWordCount) * 100)}%`)
  lines.push("")

  lines.push("## Chapter Breakdown")
  lines.push("")
  lines.push("| # | Chapter Title | Word Count |")
  lines.push("|---|---------------|------------|")

  data.chapters.forEach((chapter) => {
    const wordCount = chapter.current_word_count ?? 0
    lines.push(`| ${chapter.order_index + 1} | ${chapter.title} | ${wordCount.toLocaleString()} |`)
  })

  lines.push("")

  lines.push("## Feedback Guidelines")
  lines.push("")
  lines.push("As you read, please consider the following questions:")
  lines.push("")
  lines.push("### Overall Impressions")
  lines.push("- What was your overall reaction to the story?")
  lines.push("- Did the opening hook you? If not, where did you become engaged?")
  lines.push("- Were there any parts where you lost interest or wanted to skim?")
  lines.push("")
  lines.push("### Characters")
  lines.push("- Did the characters feel real and believable?")
  lines.push("- Were character motivations clear?")
  lines.push("- Did you care about what happened to the characters?")
  lines.push("")
  lines.push("### Plot & Pacing")
  lines.push("- Did the story flow well?")
  lines.push("- Were there any confusing parts?")
  lines.push("- Did any sections feel too slow or too rushed?")
  lines.push("")
  lines.push("### Voice & Style")
  lines.push("- Did the authors voice feel consistent throughout?")
  lines.push("- Were there any awkward phrases or sentences?")
  lines.push("- Did the dialogue sound natural?")
  lines.push("")
  lines.push("### Technical")
  lines.push("- Did you notice any typos, grammar issues, or inconsistencies?")
  lines.push("- Were there any formatting problems?")
  lines.push("")

  lines.push("## How to Provide Feedback")
  lines.push("")
  lines.push("1. **In-line comments**: Mark specific passages with your thoughts")
  lines.push("2. **Chapter notes**: Brief notes at the end of each chapter")
  lines.push("3. **Overall summary**: A final summary of your impressions")
  lines.push("")
  lines.push("Thank you for being a beta reader\!")
  lines.push("")

  return lines.join("\n")
}
