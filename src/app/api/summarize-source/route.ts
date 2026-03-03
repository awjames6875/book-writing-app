import { NextResponse } from "next/server";
import { ANTHROPIC_MODEL, getAnthropicClient, readTextFromAnthropicMessage } from "@/lib/ai";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const text = typeof body.text === "string" ? body.text.trim() : "";
  const sourceName = typeof body.sourceName === "string" ? body.sourceName.trim() : "Source";

  if (!text) {
    return NextResponse.json({ error: "text is required." }, { status: 400 });
  }

  try {
    const anthropic = getAnthropicClient();
    const result = await anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 1500,
      temperature: 0.2,
      system: "You summarize source material for authors. Return concise, practical output.",
      messages: [
        {
          role: "user",
          content: `Summarize this source for a nonfiction author.\n\nReturn markdown with these sections:\n1) TL;DR (2-4 bullets)\n2) Key Ideas (5-10 bullets)\n3) Notable Quotes (up to 5)\n4) How this can be used in a book (3-6 bullets)\n\nSource name: ${sourceName}\n\nContent:\n${text.slice(0, 50000)}`,
        },
      ],
    });

    return NextResponse.json({ summary: readTextFromAnthropicMessage(result.content) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Source summarization failed." },
      { status: 500 }
    );
  }
}
