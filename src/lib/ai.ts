import Anthropic from "@anthropic-ai/sdk";

export const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

export function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_OPENCLAW_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }

  return new Anthropic({ apiKey });
}

export function readTextFromAnthropicMessage(content: Anthropic.Messages.Message["content"]): string {
  return content
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();
}

export function parseJsonFromModel<T>(raw: string): T {
  const match = raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  const jsonText = match?.[0] || raw;
  return JSON.parse(jsonText) as T;
}
