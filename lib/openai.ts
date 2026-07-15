import OpenAI from "openai";

function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set");
  return new OpenAI({ apiKey: key });
}

export type InsightPayload = {
  behaviour_category: string;
  urgency_level: "monitor" | "vet_soon" | "urgent";
  potential_causes: string[];
  monitoring_advice: string;
  vet_questions: string[];
};

function buildPrompt(pet: { name: string; breed: string | null; age: number | null; weight: number | null; knownConditions: string | null }, incident: { title: string; description: string | null; category: string; appetiteLoss: boolean; vomiting: boolean; lethargy: boolean; aggression: boolean; anxiety: boolean }): string {
  const symptoms = [
    incident.appetiteLoss && "appetite loss",
    incident.vomiting && "vomiting",
    incident.lethargy && "lethargy",
    incident.aggression && "aggression",
    incident.anxiety && "anxiety",
  ].filter(Boolean);
  return `You are a structured veterinary behaviour assistant. Do not give long essays. Return ONLY valid JSON, no other text.

Pet: ${pet.name}${pet.breed ? `, ${pet.breed}` : ""}${pet.age != null ? `, ${pet.age} years old` : ""}${pet.weight != null ? `, ${pet.weight} kg` : ""}${pet.knownConditions ? `. Known conditions: ${pet.knownConditions}` : ""}

Incident: ${incident.title}. Category: ${incident.category}.${incident.description ? ` Description: ${incident.description}` : ""}${symptoms.length ? ` Symptoms/signs: ${symptoms.join(", ")}.` : ""}

Return exactly this JSON structure (no markdown, no code fence):
{"behaviour_category":"short label","urgency_level":"monitor"|"vet_soon"|"urgent","potential_causes":["cause1","cause2"],"monitoring_advice":"1-2 short sentences","vet_questions":["question1","question2"]}

urgency_level: use "monitor" for mild/watch, "vet_soon" for should see vet in days, "urgent" for emergency.`;
}

export async function generateStructuredInsight(
  pet: { name: string; breed: string | null; age: number | null; weight: number | null; knownConditions: string | null },
  incident: { title: string; description: string | null; category: string; appetiteLoss: boolean; vomiting: boolean; lethargy: boolean; aggression: boolean; anxiety: boolean }
): Promise<InsightPayload> {
  const prompt = buildPrompt(pet, incident);
  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
  });
  const raw = completion.choices[0]?.message?.content?.trim() ?? "";
  const json = raw.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
  const parsed = JSON.parse(json) as InsightPayload;
  if (!parsed.urgency_level || !["monitor", "vet_soon", "urgent"].includes(parsed.urgency_level)) {
    parsed.urgency_level = "monitor";
  }
  if (!Array.isArray(parsed.potential_causes)) parsed.potential_causes = [];
  if (!Array.isArray(parsed.vet_questions)) parsed.vet_questions = [];
  if (typeof parsed.monitoring_advice !== "string") parsed.monitoring_advice = "";
  if (typeof parsed.behaviour_category !== "string") parsed.behaviour_category = "";
  return parsed;
}
