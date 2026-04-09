import { CalendarDays } from "lucide-react";

export const metadata = { title: "Histórico" };

export default function HistoryPage() {
  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-6" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
        Histórico
      </h1>
      <div className="rounded-xl p-8 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border-subtle)" }}>
        <CalendarDays className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Seus check-ins aparecerão aqui.</p>
      </div>
    </div>
  );
}
