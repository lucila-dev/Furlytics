type UrgencyLevel = "monitor" | "vet_soon" | "urgent";

const styles: Record<UrgencyLevel, string> = {
  monitor: "bg-emerald-100 text-emerald-800",
  vet_soon: "bg-amber-100 text-amber-800",
  urgent: "bg-red-100 text-red-800",
};

const labels: Record<UrgencyLevel, string> = {
  monitor: "Monitor",
  vet_soon: "Vet soon",
  urgent: "Urgent",
};

export function UrgencyBadge({ level }: { level: UrgencyLevel }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[level]}`}>
      {labels[level]}
    </span>
  );
}
