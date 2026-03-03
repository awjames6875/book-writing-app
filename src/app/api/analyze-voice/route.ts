import { NextResponse } from "next/server";
import { ANTHROPIC_MODEL, getAnthropicClient, parseJsonFromModel, readTextFromAnthropicMessage } from "@/lib/ai";
import { VOICE_ANALYSIS_SYSTEM_PROMPT } from "@/lib/story-prompts";

interface VoiceAnalysis {
  vocabularyLevel: string;
  avgSentenceLength: string;
  tone: string;
  colloquialisms: string[];
  rhythm: string;
  metaphorUse: string;
  summary: string;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const transcript = typeof body.transcript === "string" ? body.transcript.trim() : "";

  if (!transcript) {
    return NextResponse.json({ error: "transcript is required." }, { status: 400 });
  }

  try {
    const anthropic = getAnthropicClient();
    const result = await anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 1200,
      temperature: 0.2,
      system: VOICE_ANALYSIS_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Analyze this transcript and return JSON with exactly these keys:\n\n{\n  "vocabularyLevel": "string",\n  "avgSentenceLength": "string",\n  "tone": "string",\n  "colloquialisms": ["string"],\n  "rhythm": "string",\n  "metaphorUse": "string",\n  "summary": "string"\n}\n\nTranscript:\n${transcript.slice(0, 25000)}`,
        },
      ],
    });

    const raw = readTextFromAnthropicMessage(result.content);
    const parsed = parseJsonFromModel<Partial<VoiceAnalysis>>(raw);

    return NextResponse.json({
      analysis: {
        vocabularyLevel: parsed.vocabularyLevel || "",
        avgSentenceLength: parsed.avgSentenceLength || "",
        tone: parsed.tone || "",
        colloquialisms: Array.isArray(parsed.colloquialisms) ? parsed.colloquialisms.slice(0, 20) : [],
        rhythm: parsed.rhythm || "",
        metaphorUse: parsed.metaphorUse || "",
        summary: parsed.summary || "",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Voice analysis failed." },
      { status: 500 }
    );
  }
}
