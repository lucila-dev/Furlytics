import { prisma } from "./prisma";
import type { UrgencyLevel } from "@prisma/client";

const URGENCY_SCORE: Record<UrgencyLevel, number> = {
  monitor: 1,
  vet_soon: 2,
  urgent: 3,
};

const SYMPTOM_ALERTS: Record<string, { patternType: string; description: string }> = {
  vomiting: { patternType: "repeated_gastro_issue", description: "Vomiting reported 3+ times in the last 7 days" },
  lethargy: { patternType: "repeated_lethargy", description: "Lethargy reported 3+ times in the last 7 days" },
  appetiteLoss: { patternType: "repeated_appetite_issue", description: "Appetite loss reported 3+ times in the last 7 days" },
  aggression: { patternType: "repeated_aggression", description: "Aggression reported 3+ times in the last 7 days" },
  anxiety: { patternType: "repeated_anxiety", description: "Anxiety reported 3+ times in the last 7 days" },
};

const SEVEN_DAYS_AGO = () => {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d;
};

export type TimeOfDayBucket = "morning" | "afternoon" | "night";

export type TimeOfDaySummary = {
  bucket: TimeOfDayBucket;
  count: number;
  label: string;
};

export type HeatmapWeek = {
  weekStart: string;
  symptoms: { vomiting: number; lethargy: number; appetiteLoss: number; aggression: number; anxiety: number };
};

export type PatternEngineResult = {
  alerts: Array<{ id: string; petId: string; patternType: string; severityScore: number | null; description: string; triggeredAt: Date }>;
  timeOfDaySummary: TimeOfDaySummary | null;
  heatmapByWeek: HeatmapWeek[];
};

function getBucket(hour: number): TimeOfDayBucket {
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  return "night";
}

function bucketLabel(b: TimeOfDayBucket): string {
  if (b === "morning") return "Morning (6am–12pm)";
  if (b === "afternoon") return "Afternoon (12pm–6pm)";
  return "Night (6pm–6am)";
}

export async function runPatternEngine(petId: string): Promise<PatternEngineResult> {
  const sevenDaysAgo = SEVEN_DAYS_AGO();
  const incidents = await prisma.incident.findMany({
    where: { petId },
    orderBy: { timestamp: "desc" },
    include: { aiInsight: true },
  });

  const recentIncidents = incidents.filter((i) => i.timestamp >= sevenDaysAgo);

  for (const [field, { patternType, description }] of Object.entries(SYMPTOM_ALERTS)) {
    const count = recentIncidents.filter((i) => (i as unknown as Record<string, boolean>)[field] === true).length;
    if (count >= 3) {
      const existing = await prisma.patternAlert.findFirst({
        where: { petId, patternType },
      });
      if (existing) {
        await prisma.patternAlert.update({
          where: { id: existing.id },
          data: { description, triggeredAt: new Date() },
        });
      } else {
        await prisma.patternAlert.create({
          data: { petId, patternType, description },
        });
      }
    }
  }

  const withInsights = incidents.filter((i) => i.aiInsight);
  const severities = withInsights.map((i) => URGENCY_SCORE[i.aiInsight!.urgencyLevel]);
  if (severities.length >= 3) {
    const currentAvg = severities.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
    const previousAvg = severities.slice(3, 6).reduce((a, b) => a + b, 0) / Math.min(3, severities.length - 3) || 0;
    if (previousAvg > 0 && currentAvg > previousAvg) {
      const existing = await prisma.patternAlert.findFirst({
        where: { petId, patternType: "escalation" },
      });
      const description = "Average urgency of recent incidents is increasing; consider vet check.";
      if (existing) {
        await prisma.patternAlert.update({
          where: { id: existing.id },
          data: { description, triggeredAt: new Date(), severityScore: currentAvg },
        });
      } else {
        await prisma.patternAlert.create({
          data: { petId, patternType: "escalation", description, severityScore: currentAvg },
        });
      }
    }
  }

  const bucketCounts: Record<TimeOfDayBucket, number> = { morning: 0, afternoon: 0, night: 0 };
  for (const i of incidents) {
    const hour = new Date(i.timestamp).getHours();
    bucketCounts[getBucket(hour)]++;
  }
  const entries = (Object.entries(bucketCounts) as [TimeOfDayBucket, number][]).sort((a, b) => b[1] - a[1]);
  const timeOfDaySummary: TimeOfDaySummary | null =
    entries[0][1] > 0
      ? { bucket: entries[0][0], count: entries[0][1], label: bucketLabel(entries[0][0]) }
      : null;

  const weeks: HeatmapWeek[] = [];
  const now = new Date();
  for (let w = 0; w < 6; w++) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 7 * (w + 1));
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const inWeek = incidents.filter(
      (i) => i.timestamp >= weekStart && i.timestamp < weekEnd
    );
    weeks.push({
      weekStart: weekStart.toISOString().slice(0, 10),
      symptoms: {
        vomiting: inWeek.filter((i) => i.vomiting).length,
        lethargy: inWeek.filter((i) => i.lethargy).length,
        appetiteLoss: inWeek.filter((i) => i.appetiteLoss).length,
        aggression: inWeek.filter((i) => i.aggression).length,
        anxiety: inWeek.filter((i) => i.anxiety).length,
      },
    });
  }
  weeks.reverse();

  const alerts = await prisma.patternAlert.findMany({
    where: { petId },
    orderBy: { triggeredAt: "desc" },
  });

  return {
    alerts: alerts.map((a) => ({ ...a, triggeredAt: a.triggeredAt })),
    timeOfDaySummary,
    heatmapByWeek: weeks,
  };
}
