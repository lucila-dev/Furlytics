export type HeatmapWeek = { weekStart: string; symptoms: Record<string, number> };

export function DashboardHeatmap({ data }: { data: HeatmapWeek[] }) {
  if (!data || data.length === 0) {
    return <p className="mt-2 text-sm text-[var(--muted)]">No incident data for the last 6 weeks.</p>;
  }
  const symptomKeys = [
    "vomiting",
    "lethargy",
    "appetiteLoss",
    "diarrhea",
    "coughing",
    "aggression",
    "anxiety",
    "itching",
    "limping",
    "other",
  ] as const;
  const labels: Record<string, string> = {
    vomiting: "Vomiting",
    lethargy: "Lethargy",
    appetiteLoss: "Appetite",
    aggression: "Aggression",
    anxiety: "Anxiety",
    diarrhea: "Diarrhea",
    coughing: "Coughing",
    limping: "Limping",
    itching: "Itching",
    excessiveThirst: "Thirst",
    lossOfBalance: "Balance",
    difficultyBreathing: "Breathing",
    other: "Other",
  };

  return (
    <div className="mt-3 overflow-x-auto">
      <div className="min-w-[400px] rounded-xl border-2 border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-[var(--secondary)]/30">
              <th className="pb-2 text-left font-medium text-[var(--muted)]">Week</th>
              {symptomKeys.map((k) => (
                <th key={k} className="pb-2 text-center font-medium text-[var(--muted)]">
                  {labels[k]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.weekStart} className="border-b border-[var(--border)]">
                <td className="py-2 text-[var(--muted)]">{row.weekStart}</td>
                {symptomKeys.map((key) => {
                  const v = row.symptoms[key as string] ?? 0;
                  const intensity = v === 0 ? "bg-[var(--border)]" : v >= 2 ? "bg-[var(--accent)]/30 text-[var(--accent)]" : "bg-[var(--accent-soft)] text-[var(--foreground)]";
                  return (
                    <td key={key} className="py-2 text-center">
                      <span
                        className={`inline-block rounded-lg px-2 py-0.5 font-medium ${intensity}`}
                        style={{ minWidth: "2rem" }}
                      >
                        {v}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
