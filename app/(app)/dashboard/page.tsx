import { DashboardIncidentSections } from "@/components/DashboardIncidentSections";
import { DashboardPatterns } from "@/components/DashboardPatterns";
import { DashboardPets } from "@/components/DashboardPets";
import { DashboardRecentReports } from "@/components/DashboardRecentReports";

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <div className="rounded-2xl bg-gradient-to-r from-[var(--accent)]/20 via-[var(--secondary)]/15 to-[var(--tertiary)]/20 px-6 py-4">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Your pets, recent reports, and symptom patterns.</p>
      </div>

      <DashboardPets />

      <DashboardRecentReports />

      <DashboardPatterns />

      <DashboardIncidentSections />
    </div>
  );
}
