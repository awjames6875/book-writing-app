import { NextResponse } from "next/server";
import { ANTHROPIC_MODEL, getAnthropicClient, parseJsonFromModel, readTextFromAnthropicMessage } from "@/lib/ai";
import { QUESTION_GENERATION_SYSTEM_PROMPT } from "@/lib/story-prompts";

interface GeneratedQuestion {
  text: string;
  chapter: string;
  theme: string;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const bookType = typeof body.bookType === "string" ? body.bookType : "nonfiction";
  const bookDescription = typeof body.bookDescription === "string" ? body.bookDescription.trim() : "";
  const chapters: string[] = Array.isArray(body.chapters) ? body.chapters.map(String).slice(0, 30) : [];
  const sourceSummaries: string[] = Array.isArray(body.sourceSummaries)
    ? body.sourceSummaries.map(String).slice(0, 20)
    : [];

  if (!sourceSummaries.length && !bookDescription) {
    return NextResponse.json(
      { error: "Provide sourceSummaries[] or bookDescription to generate questions." },
      { status: 400 }
    );
  }

  try {
    const anthropic = getAnthropicClient();
    const result = await anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 2500,
      temperature: 0.3,
      system: QUESTION_GENERATION_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Return JSON only in this exact shape:\n{\n  "questions": [\n    {"text": "string", "chapter": "string", "theme": "string"}\n  ]\n}\n\nBook type: ${bookType}\nBook description: ${bookDescription || "N/A"}\nChapters: ${chapters.length ? chapters.join(" | ") : "Not provided"}\n\nSource summaries:\n${sourceSummaries.map((s, i) => `${i + 1}. ${s}`).join("\n\n").slice(0, 40000)}\n\nGenerate 12-25 high-signal interview questions.`,
        },
      ],
    });

    const raw = readTextFromAnthropicMessage(result.content);
    const parsed = parseJsonFromModel<{ questions?: GeneratedQuestion[] }>(raw);
    const questions = Array.isArray(parsed.questions)
      ? parsed.questions
          .filter((q) => q?.text)
          .map((q) => ({
            text: String(q.text).trim(),
            chapter: String(q.chapter || "General").trim(),
            theme: String(q.theme || "Core Story").trim(),
          }))
      : [];

    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Question generation failed." },
      { status: 500 }
    );
  }
}
