import { NextResponse } from "next/server";
import { ANTHROPIC_MODEL, getAnthropicClient, parseJsonFromModel, readTextFromAnthropicMessage } from "@/lib/ai";
import { GHOSTWRITE_SYSTEM_PROMPT } from "@/lib/story-prompts";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  const chapterTitle = typeof body.chapterTitle === "string" ? body.chapterTitle.trim() : "";
  const chapterNumber = Number(body.chapterNumber || 1);
  const totalChapters = Number(body.totalChapters || 1);
  const previousChapterSummary = String(body.previousChapterSummary || "");
  const nextChapterPreview = String(body.nextChapterPreview || "");
  const voiceProfile = body.voiceProfile || {};
  const signaturePhrases = Array.isArray(body.signaturePhrases) ? body.signaturePhrases.map(String) : [];
  const targetWordCount = Number(body.targetWordCount || 1600);
  const stories = Array.isArray(body.stories) ? body.stories.map(String) : [];
  const insights = Array.isArray(body.insights) ? body.insights.map(String) : [];
  const frameworks = Array.isArray(body.frameworks) ? body.frameworks.map(String) : [];
  const interviewAnswers = Array.isArray(body.interviewAnswers) ? body.interviewAnswers.map(String) : [];
  const additionalInstructions = String(body.additionalInstructions || "");

  if (!chapterTitle) {
    return NextResponse.json({ error: "chapterTitle is required." }, { status: 400 });
  }

  try {
    const anthropic = getAnthropicClient();
    const result = await anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 4000,
      temperature: 0.6,
      system: GHOSTWRITE_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Return JSON only in this exact shape:\n{\n  "title": "string",\n  "content": "string",\n  "wordCount": 0\n}\n\nAUTHOR VOICE PROFILE:\n${JSON.stringify(voiceProfile, null, 2)}\n\nCHAPTER DETAILS:\nTitle: ${chapterTitle}\nPosition in book: Chapter ${chapterNumber} of ${totalChapters}\nPrevious chapter summary: ${previousChapterSummary || "N/A"}\nNext chapter preview: ${nextChapterPreview || "N/A"}\n\nCONTENT TO INCORPORATE:\nStories:\n${stories.join("\n- ")}\n\nInsights:\n${insights.join("\n- ")}\n\nFrameworks:\n${frameworks.join("\n- ")}\n\nInterview answers:\n${interviewAnswers.join("\n\n")}\n\nSignature phrases to weave in naturally:\n${signaturePhrases.join(", ") || "N/A"}\n\nAdditional instructions:\n${additionalInstructions || "None"}\n\nTarget word count: ${Math.max(600, Math.min(4000, targetWordCount))}`,
        },
      ],
    });

    const raw = readTextFromAnthropicMessage(result.content);
    const parsed = parseJsonFromModel<{ title?: string; content?: string; wordCount?: number }>(raw);

    const content = String(parsed.content || "").trim();
    const countedWords = content ? content.split(/\s+/).filter(Boolean).length : 0;

    return NextResponse.json({
      title: parsed.title || chapterTitle,
      content,
      wordCount: Number.isFinite(parsed.wordCount) ? parsed.wordCount : countedWords,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Ghostwrite failed." },
      { status: 500 }
    );
  }
}
