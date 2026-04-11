import { SCORE_OPTIONS } from "@/lib/types";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

interface Props {
  checkins: { date: string; score: number }[];
}

export function WeeklyScoreChart({ checkins }: Props) {
  // Build last 7 days
  const days: { label: string; score: number | null; date: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const checkin = checkins.find((c) => c.date === dateStr);
    days.push({
      label: DAYS[d.getDay()],
      score: checkin?.score ?? null,
      date: dateStr,
    });
  }

  return (
    <div>
      <h3 className="text-xs font-semibold mb-3" style={{ color: "var(--mf-text-muted)" }}>
        Score da semana
      </h3>
      <div className="flex items-end justify-between gap-1" style={{ height: 80 }}>
        {days.map((day) => {
          const height = day.score ? (day.score / 5) * 100 : 0;
          const scoreOpt = day.score ? SCORE_OPTIONS.find((o) => o.value === day.score) : null;
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              {day.score && (
                <span className="text-[9px]">{scoreOpt?.emoji}</span>
              )}
              <div className="w-full rounded-t-md" style={{ height: `${height}%`, minHeight: day.score ? 4 : 0, background: day.score ? "var(--forest)" : "var(--mf-border-subtle)", opacity: day.score ? 0.2 + (day.score / 5) * 0.8 : 0.2 }} />
              <span className="text-[9px] font-mono" style={{ color: "var(--mf-text-muted)" }}>{day.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
