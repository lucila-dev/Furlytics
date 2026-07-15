"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchPets } from "@/lib/petStorage";
import { createIncident, type IncidentCategory } from "@/lib/incidentStorage";

type Pet = { id: string; name: string };

type StoredIncidentSymptoms = {
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

const SYMPTOM_OPTIONS: { key: keyof StoredIncidentSymptoms; label: string }[] = [
  { key: "appetiteLoss", label: "Appetite loss" },
  { key: "vomiting", label: "Vomiting" },
  { key: "lethargy", label: "Lethargy" },
  { key: "aggression", label: "Aggression" },
  { key: "anxiety", label: "Anxiety" },
  { key: "diarrhea", label: "Diarrhea" },
  { key: "coughing", label: "Coughing" },
  { key: "limping", label: "Limping" },
  { key: "itching", label: "Itching" },
  { key: "excessiveThirst", label: "Excessive thirst" },
  { key: "lossOfBalance", label: "Loss of balance" },
  { key: "difficultyBreathing", label: "Difficulty breathing" },
  { key: "other", label: "Other" },
];

const defaultSymptoms = (): StoredIncidentSymptoms => ({
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

export default function LogIncidentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPetId = searchParams.get("petId");
  const [petId, setPetId] = useState(preselectedPetId ?? "");
  const [pets, setPets] = useState<Pet[]>([]);
  const [category, setCategory] = useState<IncidentCategory>("symptom");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [symptoms, setSymptoms] = useState<StoredIncidentSymptoms>(() => defaultSymptoms());
  const [otherSymptoms, setOtherSymptoms] = useState<string[]>([""]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPets().then((list) => {
      setPets(list.map((p) => ({ id: p.id, name: p.name })));
    });
    if (preselectedPetId) setPetId((id) => id || preselectedPetId);
  }, [preselectedPetId]);

  function setSymptom(key: keyof StoredIncidentSymptoms, value: boolean) {
    setSymptoms((s) => ({ ...s, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    const customOther = symptoms.other ? otherSymptoms.filter((s) => s.trim()) : [];
    const newIncident = await createIncident({
      petId,
      category,
      title,
      description: description || null,
      timestamp: new Date().toISOString(),
      symptoms,
      otherSymptoms: customOther.length ? customOther : undefined,
    });
    setLoading(false);
    if (!newIncident) {
      setMessage("Could not save incident. Please try again.");
      return;
    }
    router.push(`/incidents/${newIncident.id}/report`);
    router.refresh();
  }

  function addOtherSymptom() {
    setOtherSymptoms((prev) => [...prev, ""]);
  }

  function setOtherSymptomAt(i: number, value: string) {
    setOtherSymptoms((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  }

  function removeOtherSymptomAt(i: number) {
    setOtherSymptoms((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-[var(--foreground)]">Log Incident</h1>
      <p className="mt-1 text-[var(--muted)]">Record a symptom, behaviour or accident for your pet.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {message && (
          <p className="rounded-xl bg-[var(--accent)]/20 px-3 py-2 text-sm text-[var(--foreground)]">{message}</p>
        )}
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">Pet</label>
          {pets.length === 0 ? (
            <p className="mt-1 text-sm text-[var(--muted)]">
              <Link href="/pets/new" className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]">Add a pet</Link> first to log an incident.
            </p>
          ) : (
            <select
              value={petId}
              onChange={(e) => setPetId(e.target.value)}
              required
              className="mt-1 block w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-[var(--foreground)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            >
              <option value="">Select pet</option>
              {pets.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as IncidentCategory)}
            className="mt-1 block w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-[var(--foreground)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          >
            <option value="symptom">Symptom</option>
            <option value="behaviour">Behaviour</option>
            <option value="accident">Accident</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Vomiting after breakfast"
            className="mt-1 block w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-[var(--foreground)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-[var(--foreground)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          />
        </div>
        <div>
          <span className="block text-sm font-medium text-[var(--foreground)]">Symptoms / signs (optional)</span>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
            {SYMPTOM_OPTIONS.map(({ key, label }) => (
              <label key={key} className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={symptoms[key]}
                  onChange={(e) => setSymptom(key, e.target.checked)}
                  className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span className="text-sm text-[var(--foreground)]">{label}</span>
              </label>
            ))}
          </div>
          {symptoms.other && (
            <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
              <p className="text-sm font-medium text-[var(--foreground)]">Other symptoms (type as many as you want)</p>
              <div className="mt-2 space-y-2">
                {otherSymptoms.map((val, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => setOtherSymptomAt(i, e.target.value)}
                      placeholder="e.g. Hair loss, drooling"
                      className="flex-1 rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
                    />
                    {otherSymptoms.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeOtherSymptomAt(i)}
                        className="rounded-lg border border-[var(--border)] px-2 text-sm text-[var(--muted)] hover:bg-[var(--background)]"
                        aria-label="Remove"
                      >
                        −
                      </button>
                    ) : null}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOtherSymptom}
                  className="rounded-lg border-2 border-dashed border-[var(--accent)]/50 px-3 py-1.5 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent)]/10"
                >
                  + Add another
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || pets.length === 0}
            className="rounded-xl bg-[var(--accent)] px-4 py-2 font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
          >
            {loading ? "Saving…" : "Log Incident"}
          </button>
          <Link
            href="/dashboard"
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 font-medium text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
