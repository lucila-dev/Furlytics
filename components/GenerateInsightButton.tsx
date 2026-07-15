"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function GenerateInsightButton({ incidentId }: { incidentId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    const res = await fetch("/api/generate-insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ incidentId }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Failed to generate insight");
      return;
    }
    router.push(`/incidents/${incidentId}/insight`);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="text-sm font-medium text-amber-600 hover:text-amber-700 disabled:opacity-50"
    >
      {loading ? "Generating…" : "Generate Insight"}
    </button>
  );
}
