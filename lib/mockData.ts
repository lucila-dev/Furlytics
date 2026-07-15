// Template mock data – replace with API when ready

export type MockPet = {
  id: string;
  name: string;
  breed: string | null;
  age: number | null;
  weight: number | null;
  knownConditions: string | null;
};

export type MockUrgency = "monitor" | "vet_soon" | "urgent";

export type MockIncident = {
  id: string;
  petId: string;
  pet?: { name: string };
  category: "symptom" | "behaviour";
  title: string;
  description: string | null;
  timestamp: string;
  aiInsight?: {
    urgencyLevel: MockUrgency;
    behaviourCategory: string;
    potentialCauses: string[];
    monitoringAdvice: string;
    vetQuestions: string[];
  } | null;
};

export type MockAlert = {
  id: string;
  petId: string;
  pet: { name: string };
  patternType: string;
  description: string;
  triggeredAt: string;
};

export type MockHeatmapWeek = {
  weekStart: string;
  symptoms: { vomiting: number; lethargy: number; appetiteLoss: number; aggression: number; anxiety: number };
};

export const mockPets: MockPet[] = [];

export const mockIncidents: MockIncident[] = [];

export const mockAlerts: MockAlert[] = [];

/** Symptom overview is now driven by user-reported incidents only (see getHeatmapFromIncidents). */
export const mockHeatmap: MockHeatmapWeek[] = [];
