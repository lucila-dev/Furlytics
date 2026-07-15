import { notFound } from "next/navigation";
import Link from "next/link";
import { mockIncidents } from "@/lib/mockData";
import { UrgencyBadge } from "@/components/UrgencyBadge";

export default async function InsightPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: incidentId } = await params;
  const incident = mockIncidents.find((i) => i.id === incidentId);
  if (!incident) notFound();
  const insight = incident.aiInsight;
  if (!insight) {
    return (
      <div>
        <p className="text-[var(--muted)]">No summary for this incident yet.</p>
        <Link href={`/pets/${incident.petId}/incidents`} className="mt-4 inline-block text-[var(--accent)] hover:text-[var(--accent-hover)]">
          ← Back to incidents
        </Link>
      </div>
    );
  }

  const potentialCauses = insight.potentialCauses ?? [];
  const vetQuestions = insight.vetQuestions ?? [];

  return (
    <div className="max-w-2xl">
      <Link href={`/pets/${incident.petId}/incidents`} className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)]">
        ← Back to incidents
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">Vet summary</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">{incident.title} · {incident.pet?.name}</p>

      <div className="mt-6 space-y-6">
        <div className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-[var(--muted)]">Summary</h2>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-medium text-[var(--foreground)]">{insight.behaviourCategory}</span>
            <UrgencyBadge level={insight.urgencyLevel} />
          </div>
        </div>

        {potentialCauses.length > 0 && (
          <div className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm">
            <h2 className="text-sm font-medium text-[var(--muted)]">Potential causes</h2>
            <ul className="mt-2 list-inside list-disc text-[var(--foreground)]">
              {potentialCauses.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-[var(--muted)]">Monitoring advice</h2>
          <p className="mt-2 text-[var(--foreground)]">{insight.monitoringAdvice}</p>
        </div>

        {vetQuestions.length > 0 && (
          <div className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm">
            <h2 className="text-sm font-medium text-[var(--muted)]">Questions for vet</h2>
            <ul className="mt-2 list-inside list-disc text-[var(--foreground)]">
              {vetQuestions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
