"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  fetchIncidentById,
  saveIncidentReport,
  type StoredIncident,
  type IncidentReport,
} from "@/lib/incidentStorage";
import { fetchPetById, type StoredPet } from "@/lib/petStorage";
import { jsPDF } from "jspdf";

const VET_NEED_LABELS: Record<IncidentReport["vetNeed"], string> = {
  urgent: "Seek vet soon (urgent)",
  soon: "Vet visit recommended",
  monitor: "Monitor at home",
  optional: "Optional check-up",
};

export default function IncidentReportPage() {
  const params = useParams();
  const id = params.id as string;
  const [incident, setIncident] = useState<StoredIncident | null>(null);
  const [pet, setPet] = useState<StoredPet | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchIncidentById(id).then(async (inc) => {
      setIncident(inc);
      if (inc) setPet(await fetchPetById(inc.petId));
      setLoaded(true);
    });
  }, [id]);

  async function generateReport() {
    if (!incident || incident.report) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/reports/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petName: pet?.name,
          category: incident.category,
          title: incident.title,
          description: incident.description,
          symptoms: incident.symptoms,
          otherSymptoms: incident.otherSymptoms,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Analysis failed");
      const saved = await saveIncidentReport(incident.id, data as IncidentReport);
      if (!saved) throw new Error("Could not save report");
      setIncident((prev) => (prev ? { ...prev, report: data } : null));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function downloadPdf() {
    if (!incident?.report || !pet) return;
    const doc = new jsPDF();
    const r = incident.report;
    let y = 20;
    const line = (text: string, opts?: { bold?: boolean }) => {
      if (opts?.bold) doc.setFont("helvetica", "bold");
      doc.text(text, 20, y);
      doc.setFont("helvetica", "normal");
      y += 7;
    };
    doc.setFontSize(18);
    line("Furlytics – Incident Report", { bold: true });
    y += 4;
    doc.setFontSize(11);
    line(`Pet: ${pet.name}`);
    line(`Incident: ${incident.title}`);
    line(`Category: ${incident.category}`);
    line(`Date: ${new Date(incident.timestamp).toLocaleString()}`);
    if (incident.description) line(`Notes: ${incident.description}`);
    y += 4;
    line("Symptoms / signs reported:", { bold: true });
    const symptomParts = Object.entries(incident.symptoms)
      .filter(([, v]) => v)
      .map(([k]) => k.replace(/([A-Z])/g, " $1").trim());
    if (incident.otherSymptoms?.length) {
      symptomParts.push(...incident.otherSymptoms.filter(Boolean));
    }
    if (symptomParts.length) {
      symptomParts.forEach((s) => line("• " + s));
    } else {
      line("None specified");
    }
    y += 6;
    line("Summary", { bold: true });
    doc.text(r.summary, 20, y, { maxWidth: 170 });
    y += doc.getTextDimensions(r.summary, { maxWidth: 170 }).h + 6;
    line("Potential causes:");
    r.potentialCauses.forEach((c) => line("• " + c));
    y += 4;
    line("Possible conditions / potential risks:");
    r.possibleConditions.forEach((c) => line("• " + c));
    doc.save(`furlytics-report-${incident.id.slice(0, 8)}.pdf`);
  }

  if (!loaded) return null;
  if (!incident) {
    return (
      <div>
        <p className="text-[var(--muted)]">Incident not found.</p>
        <Link href="/dashboard" className="mt-4 inline-block text-[var(--accent)] hover:text-[var(--accent-hover)]">
          ← Dashboard
        </Link>
      </div>
    );
  }

  const hasReport = !!incident.report;

  return (
    <div className="max-w-2xl">
      <Link
        href={`/pets/${incident.petId}/incidents`}
        className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)]"
      >
        ← Back to incidents
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-[var(--foreground)]">Incident report</h1>
      <p className="mt-1 text-[var(--muted)]">
        {pet?.name} · {incident.title} · {new Date(incident.timestamp).toLocaleString()}
      </p>

      <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-md">
        <h2 className="font-semibold text-[var(--foreground)]">Incident details</h2>
        <p className="mt-1 text-sm text-[var(--muted)] capitalize">{incident.category}</p>
        {incident.description && (
          <p className="mt-2 text-sm text-[var(--foreground)]">{incident.description}</p>
        )}
        {(Object.entries(incident.symptoms).some(([, v]) => v) || (incident.otherSymptoms?.length ?? 0) > 0) && (
          <p className="mt-2 text-xs text-[var(--muted)]">
            Signs: {[
              ...Object.entries(incident.symptoms)
                .filter(([, v]) => v)
                .map(([k]) => k.replace(/([A-Z])/g, " $1").trim()),
              ...(incident.otherSymptoms ?? []).filter(Boolean),
            ].join(", ")}
          </p>
        )}
      </div>

      {!hasReport && (
        <div className="mt-6">
          <button
            type="button"
            onClick={generateReport}
            disabled={loading}
            className="rounded-xl bg-[var(--accent)] px-5 py-2.5 font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
          >
            {loading ? "Generating report…" : "Generate report"}
          </button>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
      )}

      {hasReport && incident.report && (
        <div className="mt-8 space-y-6">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={downloadPdf}
              className="rounded-xl bg-[var(--secondary)] px-4 py-2 font-medium text-white hover:bg-[var(--secondary-hover)] transition-colors"
            >
              Download PDF
            </button>
          </div>

          <div className="rounded-2xl border-2 border-[var(--accent)]/30 bg-gradient-to-br from-[var(--accent)]/10 to-[var(--secondary)]/10 p-5 shadow-md">
            <h2 className="font-semibold text-[var(--foreground)]">Summary</h2>
            <p className="mt-2 text-[var(--foreground)]">{incident.report.summary}</p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-md">
            <h2 className="font-semibold text-[var(--foreground)]">Vet recommendation</h2>
            <p className="mt-1 font-medium text-[var(--accent)]">
              {VET_NEED_LABELS[incident.report.vetNeed]}
            </p>
            <p className="mt-2 text-sm text-[var(--foreground)]">{incident.report.vetNeedReason}</p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-md">
            <h2 className="font-semibold text-[var(--foreground)]">Potential causes</h2>
            <ul className="mt-2 list-inside list-disc text-sm text-[var(--foreground)]">
              {incident.report.potentialCauses.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-md">
            <h2 className="font-semibold text-[var(--foreground)]">Possible conditions</h2>
            <ul className="mt-2 list-inside list-disc text-sm text-[var(--foreground)]">
              {incident.report.possibleConditions.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-md">
            <h2 className="font-semibold text-[var(--foreground)]">Monitoring advice</h2>
            <p className="mt-2 text-sm text-[var(--foreground)]">{incident.report.monitoringAdvice}</p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-md">
            <h2 className="font-semibold text-[var(--foreground)]">When to seek vet</h2>
            <p className="mt-2 text-sm text-[var(--foreground)]">{incident.report.whenToSeekVet}</p>
          </div>
        </div>
      )}
    </div>
  );
}
