import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export type AnalyzePayload = {
  petName?: string;
  category: string;
  title: string;
  description: string | null;
  symptoms: Record<string, boolean>;
  otherSymptoms?: string[];
};

export type IncidentReport = {
  summary: string;
  potentialCauses: string[];
  vetNeed: "urgent" | "soon" | "monitor" | "optional";
  vetNeedReason: string;
  possibleConditions: string[];
  monitoringAdvice: string;
  whenToSeekVet: string;
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function symptomsToText(symptoms: Record<string, boolean>): string {
  const present = Object.entries(symptoms)
    .filter(([, v]) => v)
    .map(([k]) => k.replace(/([A-Z])/g, " $1").trim());
  return present.length ? present.join(", ") : "None specified";
}

export async function POST(request: NextRequest) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not configured" },
      { status: 503 }
    );
  }
  let body: AnalyzePayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { petName, category, title, description, symptoms, otherSymptoms } = body;
  if (!title || !category) {
    return NextResponse.json(
      { error: "title and category required" },
      { status: 400 }
    );
  }

  const symptomsText = symptomsToText(symptoms ?? {});
  const otherText = (otherSymptoms?.filter(Boolean).join(", ")) || "";
  const allSymptoms = otherText ? `${symptomsText}; Other: ${otherText}` : symptomsText;

  const prompt = `You are a helpful assistant for pet owners. Based on the following incident, provide a structured report in JSON only, no markdown or extra text.

Incident:
- Pet: ${petName ?? "Unknown"}
- Category: ${category}
- Title: ${title}
- Description: ${description ?? "None"}
- Signs/symptoms reported: ${allSymptoms}

Respond with exactly this JSON structure (no other text):
{
  "summary": "2-3 sentence plain-language summary of what might be going on.",
  "potentialCauses": ["cause1", "cause2", "..."],
  "vetNeed": "urgent" | "soon" | "monitor" | "optional",
  "vetNeedReason": "One sentence explaining why this level.",
  "possibleConditions": ["condition1", "condition2", "..."],
  "monitoringAdvice": "What to watch and do at home.",
  "whenToSeekVet": "Clear guidance on when to call or visit the vet."
}

Use "urgent" only for possible emergencies; "soon" for within days; "monitor" for watch and see; "optional" when it's likely minor. Be concise and practical.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });
    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 502 }
      );
    }
    const report = JSON.parse(raw) as IncidentReport;
    if (!report.summary || !report.vetNeed) {
      return NextResponse.json(
        { error: "Invalid report shape from AI" },
        { status: 502 }
      );
    }
    return NextResponse.json(report);
  } catch (e) {
    console.error("OpenAI error:", e);
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}
