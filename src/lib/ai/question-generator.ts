import Anthropic from "@anthropic-ai/sdk";

interface Chapter {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
}

interface GeneratedQuestion {
  text: string;
  chapter_id: string | null;
  chapter_reasoning: string;
}

interface GenerateQuestionsParams {
  sourceContent: string;
  sourceTitle: string;
  sourceType: string;
  projectId: string;
  chapters: Chapter[];
}

export async function generateQuestionsFromSource({
  sourceContent,
  sourceTitle,
  sourceType,
  projectId,
  chapters,
}: GenerateQuestionsParams): Promise<GeneratedQuestion[]> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  // Format chapters for the prompt
  const chaptersText = chapters
    .sort((a, b) => a.order_index - b.order_index)
    .map(
      (ch) =>
        `- ${ch.title} (ID: ${ch.id})${ch.description ? ": " + ch.description : ""}`
    )
    .join("\n");

  const prompt = `You are helping an author write a book by analyzing their research materials and generating interview questions that will help them extract their unique stories and insights.

SOURCE MATERIAL:
Title: ${sourceTitle}
Type: ${sourceType}
Content: ${sourceContent.substring(0, 4000)}${sourceContent.length > 4000 ? "..." : ""}

BOOK CHAPTERS:
${chaptersText}

Your task is to:
1. Analyze the source material and identify key concepts, frameworks, and insights
2. Generate 5-10 thoughtful interview questions that would help the author explore how this material relates to their personal experience and book
3. For each question, suggest which chapter it best fits into based on the chapter titles and descriptions
4. Provide brief reasoning for your chapter assignment

Generate questions that:
- Are open-ended and encourage storytelling
- Help the author connect research to personal experience
- Explore "why" and "how" rather than just "what"
- Would naturally lead to rich, detailed answers

Return your response as a JSON array with this exact format:
[
  {
    "text": "The actual question text here?",
    "chapter_id": "uuid-of-suggested-chapter-or-null",
    "chapter_reasoning": "Brief explanation of why this question fits this chapter"
  }
]

If no chapter is a good fit for a question, use null for chapter_id and explain why in the reasoning.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    // Extract JSON from the response
    const jsonMatch = content.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No JSON array found in Claude's response");
    }

    const questions: GeneratedQuestion[] = JSON.parse(jsonMatch[0]);

    // Validate that all chapter_ids are valid
    const validChapterIds = new Set(chapters.map((ch) => ch.id));
    return questions.map((q) => ({
      ...q,
      chapter_id:
        q.chapter_id && validChapterIds.has(q.chapter_id)
          ? q.chapter_id
          : null,
    }));
  } catch (error) {
    console.error("Error generating questions from source:", error);
    throw new Error(
      "Failed to generate questions. Please try again or check your API key."
    );
  }
}
