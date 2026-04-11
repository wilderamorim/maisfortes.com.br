import type { Mood } from "@/lib/types";

const MOODS: { key: Mood; emoji: string; label: string; color: string }[] = [
  { key: "great", emoji: "😊", label: "Ótimo", color: "#2D6A4F" },
  { key: "good", emoji: "🙂", label: "Bom", color: "#40916C" },
  { key: "neutral", emoji: "😐", label: "Normal", color: "#FFB703" },
  { key: "bad", emoji: "😕", label: "Complicado", color: "#F4845F" },
  { key: "terrible", emoji: "😔", label: "Difícil", color: "#E53E3B" },
];

interface Props {
  checkins: { mood: string }[];
}

export function MoodDistribution({ checkins }: Props) {
  const total = checkins.length;
  if (total === 0) return null;

  const counts = new Map<string, number>();
  for (const c of checkins) {
    counts.set(c.mood, (counts.get(c.mood) ?? 0) + 1);
  }

  return (
    <div>
      <h3 className="text-xs font-semibold mb-3" style={{ color: "var(--mf-text-muted)" }}>
        Distribuição de humor
      </h3>
      <div className="space-y-2">
        {MOODS.map((m) => {
          const count = counts.get(m.key) ?? 0;
          const pct = Math.round((count / total) * 100);
          if (count === 0) return null;
          return (
            <div key={m.key} className="flex items-center gap-2">
              <span className="text-sm w-5 text-center">{m.emoji}</span>
              <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: "var(--mf-bg)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${Math.max(pct, 4)}%`, background: m.color, opacity: 0.7 }}
                />
              </div>
              <span className="text-[10px] font-mono w-8 text-right" style={{ color: "var(--mf-text-muted)" }}>
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
