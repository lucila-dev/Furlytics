import Link from "next/link";

type AlertLike = { id: string; petId: string; pet: { name: string }; description: string };

export function DashboardAlerts({ alerts }: { alerts: AlertLike[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {alerts.map((alert) => (
        <li key={alert.id}>
          <Link
            href={`/pets/${alert.petId}`}
            className="block rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm shadow-sm hover:border-[var(--accent)]/30 hover:shadow transition-all"
          >
            <span className="font-medium text-[var(--foreground)]">{alert.pet.name}</span>
            <span className="text-[var(--muted)]"> · {alert.description}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
