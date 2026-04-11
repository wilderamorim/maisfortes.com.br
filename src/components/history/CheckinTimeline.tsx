import { SCORE_OPTIONS } from "@/lib/types";

interface CheckinData {
  date: string;
  score: number;
  mood: string;
  note?: string | null;
  id?: string;
}

export function CheckinTimeline({
  checkins,
  showNotes = true,
  limit = 14,
}: {
  checkins: CheckinData[];
  showNotes?: boolean;
  limit?: number;
}) {
  const items = checkins.slice(0, limit);

  if (items.length === 0) {
    return (
      <div className="rounded-xl p-6 text-center" style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}>
        <p className="text-xs" style={{ color: "var(--mf-text-muted)" }}>
          Nenhum check-in ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((checkin, i) => {
        const scoreOpt = SCORE_OPTIONS.find((o) => o.value === checkin.score);
        const date = new Date(checkin.date + "T12:00:00");
        return (
          <div
            key={checkin.id ?? `${checkin.date}-${i}`}
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
          >
            <span className="text-lg">{scoreOpt?.emoji}</span>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: "var(--mf-text)" }}>
                {scoreOpt?.label}
              </p>
              {showNotes && checkin.note && (
                <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--mf-text-muted)" }}>
                  {checkin.note}
                </p>
              )}
            </div>
            <span className="text-[10px] font-mono" style={{ color: "var(--mf-text-muted)" }}>
              {date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
            </span>
          </div>
        );
      })}
    </div>
  );
}
