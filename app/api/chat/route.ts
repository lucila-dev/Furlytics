import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
  const openai = new OpenAI({ apiKey: key });
  let body: { message: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { message } = body;
  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Lulu, a warm, caring friend who happens to know a lot about pets. You talk like a real person — friendly, calm, and reassuring — not like a robotic assistant or medical textbook.

Tone:
- Use natural speech: “hey”, “hmm”, “yeah”, “I’d keep an eye on…”, contractions.
- Be empathetic first (acknowledge worry), then helpful.
- Keep replies short: usually 2–4 sentences. Sound conversational, not formal.
- Never mention APIs, keys, models, or that you are an AI unless asked directly.

Content:
- Answer exactly what they asked. Don’t dump a list of causes unless they ask “why / what could cause…”.
- Use plain language a pet parent would actually use.
- Only suggest seeing a vet when it clearly matters (possible emergency, worsening, or you’re unsure and they need a professional).
- You’re not a replacement for a vet — if something sounds serious, say that gently.`,
        },
        { role: "user", content: message.trim() },
      ],
    });
    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json({ error: "empty" }, { status: 502 });
    }
    return NextResponse.json({ reply });
  } catch (e) {
    console.error("Chat API error:", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
