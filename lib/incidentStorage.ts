const INCIDENTS_KEY = "furlytics-incidents";

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

export function getIncidents(): StoredIncident[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(INCIDENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredIncident[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setIncidents(incidents: StoredIncident[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
  } catch {
    // ignore
  }
}

export function addIncident(
  incident: Omit<StoredIncident, "id"> & { symptoms?: Partial<StoredIncident["symptoms"]>; otherSymptoms?: string[] }
): StoredIncident {
  const id = "inc-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9);
  const symptoms = { ...defaultSymptoms(), ...(incident.symptoms ?? {}) };
  const newIncident: StoredIncident = {
    ...incident,
    id,
    symptoms,
    otherSymptoms: incident.otherSymptoms ?? [],
  };
  const incidents = getIncidents();
  incidents.unshift(newIncident);
  setIncidents(incidents);
  return newIncident;
}

export function getIncidentsByPetId(petId: string): StoredIncident[] {
  return getIncidents()
    .filter((i) => i.petId === petId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function getIncidentById(id: string): StoredIncident | null {
  return getIncidents().find((i) => i.id === id) ?? null;
}

export function updateIncidentReport(id: string, report: IncidentReport): void {
  const incidents = getIncidents();
  const i = incidents.findIndex((inc) => inc.id === id);
  if (i === -1) return;
  incidents[i] = { ...incidents[i], report };
  setIncidents(incidents);
}

/** Incidents that have an AI report */
export function getIncidentsWithReports(): StoredIncident[] {
  return getIncidents()
    .filter((i) => i.report)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/** Simple pattern: symptom counts in last 14 days */
export function getPatternsFromIncidents(): { symptom: string; count: number; label: string }[] {
  const incidents = getIncidents();
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

/** Last 6 weeks, symptoms per week for heatmap */
export function getHeatmapFromIncidents(): { weekStart: string; symptoms: Record<string, number> }[] {
  const incidents = getIncidents();
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
