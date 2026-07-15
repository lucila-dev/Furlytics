export type IncidentCategory = "symptom" | "behaviour" | "accident";

export type IncidentReport = {
  summary: string;
  potentialCauses: string[];
  vetNeed: "urgent" | "soon" | "monitor" | "optional";
  vetNeedReason: string;
  possibleConditions: string[];
  monitoringAdvice: string;
  whenToSeekVet: string;
};

export type StoredIncident = {
  id: string;
  petId: string;
  category: IncidentCategory;
  title: string;
  description: string | null;
  timestamp: string;
  symptoms: {
    appetiteLoss: boolean;
    vomiting: boolean;
    lethargy: boolean;
    aggression: boolean;
    anxiety: boolean;
    diarrhea: boolean;
    coughing: boolean;
    limping: boolean;
    itching: boolean;
    excessiveThirst: boolean;
    lossOfBalance: boolean;
    difficultyBreathing: boolean;
    other: boolean;
  };
  otherSymptoms?: string[];
  report?: IncidentReport | null;
};

const defaultSymptoms = (): StoredIncident["symptoms"] => ({
  appetiteLoss: false,
  vomiting: false,
  lethargy: false,
  aggression: false,
  anxiety: false,
  diarrhea: false,
  coughing: false,
  limping: false,
  itching: false,
  excessiveThirst: false,
  lossOfBalance: false,
  difficultyBreathing: false,
  other: false,
});

function mapIncident(raw: Record<string, unknown>): StoredIncident {
  const fromJson = (raw.symptoms as Partial<StoredIncident["symptoms"]> | null) ?? {};
  return {
    id: String(raw.id),
    petId: String(raw.petId),
    category: raw.category as IncidentCategory,
    title: String(raw.title),
    description: (raw.description as string | null) ?? null,
    timestamp:
      typeof raw.timestamp === "string"
        ? raw.timestamp
        : new Date(raw.timestamp as string).toISOString(),
    symptoms: {
      ...defaultSymptoms(),
      appetiteLoss: Boolean(fromJson.appetiteLoss ?? raw.appetiteLoss),
      vomiting: Boolean(fromJson.vomiting ?? raw.vomiting),
      lethargy: Boolean(fromJson.lethargy ?? raw.lethargy),
      aggression: Boolean(fromJson.aggression ?? raw.aggression),
      anxiety: Boolean(fromJson.anxiety ?? raw.anxiety),
      diarrhea: Boolean(fromJson.diarrhea),
      coughing: Boolean(fromJson.coughing),
      limping: Boolean(fromJson.limping),
      itching: Boolean(fromJson.itching),
      excessiveThirst: Boolean(fromJson.excessiveThirst),
      lossOfBalance: Boolean(fromJson.lossOfBalance),
      difficultyBreathing: Boolean(fromJson.difficultyBreathing),
      other: Boolean(fromJson.other),
    },
    otherSymptoms: Array.isArray(raw.otherSymptoms) ? (raw.otherSymptoms as string[]) : [],
    report: (raw.report as IncidentReport | null) ?? null,
  };
}

export async function fetchIncidents(petId?: string): Promise<StoredIncident[]> {
  const url = petId ? `/api/incidents?petId=${encodeURIComponent(petId)}` : "/api/incidents";
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data.map(mapIncident) : [];
}

export async function fetchIncidentById(id: string): Promise<StoredIncident | null> {
  const res = await fetch(`/api/incidents/${id}`);
  if (!res.ok) return null;
  return mapIncident(await res.json());
}

export async function createIncident(
  incident: Omit<StoredIncident, "id"> & {
    symptoms?: Partial<StoredIncident["symptoms"]>;
    otherSymptoms?: string[];
  }
): Promise<StoredIncident | null> {
  const symptoms = { ...defaultSymptoms(), ...(incident.symptoms ?? {}) };
  const res = await fetch("/api/incidents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      petId: incident.petId,
      category: incident.category,
      title: incident.title,
      description: incident.description,
      symptoms,
      otherSymptoms: incident.otherSymptoms ?? [],
      timestamp: incident.timestamp,
    }),
  });
  if (!res.ok) return null;
  return mapIncident(await res.json());
}

export async function saveIncidentReport(id: string, report: IncidentReport): Promise<boolean> {
  const res = await fetch("/api/incidents", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, report }),
  });
  return res.ok;
}

export function getPatternsFromIncidents(
  incidents: StoredIncident[]
): { symptom: string; count: number; label: string }[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 14);
  const recent = incidents.filter((i) => new Date(i.timestamp) >= cutoff);
  const symptomLabels: Record<string, string> = {
    vomiting: "Vomiting",
    lethargy: "Lethargy",
    appetiteLoss: "Appetite loss",
    aggression: "Aggression",
    anxiety: "Anxiety",
    diarrhea: "Diarrhea",
    coughing: "Coughing",
    limping: "Limping",
    itching: "Itching",
    excessiveThirst: "Excessive thirst",
    lossOfBalance: "Loss of balance",
    difficultyBreathing: "Difficulty breathing",
    other: "Other",
  };
  const counts: Record<string, number> = {};
  for (const inc of recent) {
    for (const [key, val] of Object.entries(inc.symptoms)) {
      if (val) counts[key] = (counts[key] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .filter(([, n]) => n >= 1)
    .map(([symptom, count]) => ({
      symptom,
      count,
      label: symptomLabels[symptom] ?? symptom,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getHeatmapFromIncidents(
  incidents: StoredIncident[]
): { weekStart: string; symptoms: Record<string, number> }[] {
  const now = new Date();
  const weeks: { weekStart: string; symptoms: Record<string, number> }[] = [];
  const symptomKeys = [
    "vomiting",
    "lethargy",
    "appetiteLoss",
    "aggression",
    "anxiety",
    "diarrhea",
    "coughing",
    "limping",
    "itching",
    "excessiveThirst",
    "lossOfBalance",
    "difficultyBreathing",
    "other",
  ] as const;

  for (let w = 0; w < 6; w++) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 7 * (w + 1));
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const inWeek = incidents.filter(
      (i) => new Date(i.timestamp) >= weekStart && new Date(i.timestamp) < weekEnd
    );
    const symptoms: Record<string, number> = {};
    for (const key of symptomKeys) {
      symptoms[key] = inWeek.filter((i) => i.symptoms[key]).length;
    }
    weeks.push({
      weekStart: weekStart.toISOString().slice(0, 10),
      symptoms,
    });
  }
  return weeks.reverse();
}
