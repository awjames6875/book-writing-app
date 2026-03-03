import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 500 });
  }

  const formData = await request.formData();
  const audio = formData.get("audio");
  const language = String(formData.get("language") || "").trim() || undefined;
  const prompt = String(formData.get("prompt") || "").trim() || undefined;

  if (!(audio instanceof File)) {
    return NextResponse.json({ error: "audio file is required (form-data key: audio)." }, { status: 400 });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const transcription = await client.audio.transcriptions.create({
      model: "whisper-1",
      file: audio,
      language,
      prompt,
      response_format: "verbose_json",
    });

    return NextResponse.json({
      transcript: transcription.text,
      language: transcription.language,
      duration: transcription.duration,
      segments: transcription.segments || [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Transcription failed." },
      { status: 500 }
    );
  }
}
