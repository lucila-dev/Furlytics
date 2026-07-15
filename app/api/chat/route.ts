import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

/**
 * Quick chat uses the same OpenAI API key as incident reports (OPENAI_API_KEY in .env.local).
 * No separate API is needed – this route calls OpenAI Chat Completions with a pet-health context.
 */

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not configured" },
      { status: 503 }
    );
  }
  let body: { message: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { message } = body;
  if (!message || typeof message !== "string") {
    return NextResponse.json(
      { error: "message required" },
      { status: 400 }
    );
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Lulu, a helpful assistant for pet owners. Keep every reply short: 2–4 sentences at most. Answer exactly what the user asked—if they ask for causes, give causes; if they ask whether something is normal or what to do, answer that directly. Do not list possible causes unless the user is clearly asking for them. Use plain language. Mention a vet only when clearly relevant (e.g. possible emergency).",
        },
        { role: "user", content: message.trim() },
      ],
    });
    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json(
        { error: "No reply from service" },
        { status: 502 }
      );
    }
    return NextResponse.json({ reply });
  } catch (e) {
    console.error("Chat API error:", e);
    return NextResponse.json(
      { error: "Chat failed" },
      { status: 500 }
    );
  }
}
