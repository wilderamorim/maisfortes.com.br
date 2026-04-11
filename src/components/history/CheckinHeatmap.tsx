"use client";

import { useState } from "react";

interface Props {
  checkins: { date: string; score: number }[];
}

const DAYS = ["", "Seg", "", "Qua", "", "Sex", ""];
const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function getColor(score: number | null): string {
  if (!score) return "var(--mf-border-subtle)";
  if (score >= 5) return "#2D6A4F";
  if (score >= 4) return "#40916C";
  if (score >= 3) return "#74C69D";
  if (score >= 2) return "#F4845F";
  return "#E53E3B";
}

export function CheckinHeatmap({ checkins }: Props) {
  const [tooltip, setTooltip] = useState<{ date: string; score: number; x: number; y: number } | null>(null);

  // Build map of date -> score
  const scoreMap = new Map<string, number>();
  for (const c of checkins) {
    scoreMap.set(c.date, c.score);
  }

  // Generate last 20 weeks (140 days) of cells
  const weeks: { date: string; score: number | null; day: number }[][] = [];
  const today = new Date();

  // Find the start: go back to the nearest Sunday, then back 19 more weeks
  const todayDay = today.getDay(); // 0=Sun
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - todayDay - (19 * 7));

  let currentWeek: { date: string; score: number | null; day: number }[] = [];

  for (let i = 0; i < 20 * 7 + todayDay + 1; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);

    if (d > today) break;

    const dateStr = d.toISOString().split("T")[0];
    const dayOfWeek = d.getDay();

    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentWeek.push({
      date: dateStr,
      score: scoreMap.get(dateStr) ?? null,
      day: dayOfWeek,
    });
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Month labels
  const monthLabels: { label: string; weekIndex: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const firstDay = week[0];
    if (firstDay) {
      const month = new Date(firstDay.date).getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ label: MONTHS[month], weekIndex: wi });
        lastMonth = month;
      }
    }
  });

  return (
    <div>
      <h3 className="text-xs font-semibold mb-3" style={{ color: "var(--mf-text-muted)" }}>
        Calendário de check-ins
      </h3>

      <div className="overflow-x-auto -mx-4 px-4">
        <div className="inline-block">
          {/* Month labels */}
          <div className="flex mb-1" style={{ paddingLeft: 28 }}>
            {monthLabels.map((m, i) => (
              <span
                key={i}
                className="text-[9px] font-mono"
                style={{
                  color: "var(--mf-text-muted)",
                  position: "relative",
                  left: m.weekIndex * 14,
                  width: 0,
                  whiteSpace: "nowrap",
                }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex gap-[2px]">
            {/* Day labels */}
            <div className="flex flex-col gap-[2px] mr-1" style={{ width: 22 }}>
              {DAYS.map((d, i) => (
                <span
                  key={i}
                  className="text-[9px] font-mono flex items-center"
                  style={{ color: "var(--mf-text-muted)", height: 12 }}
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[2px]">
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const cell = week.find((c) => c.day === dayIndex);
                  if (!cell) {
                    return <div key={dayIndex} style={{ width: 12, height: 12 }} />;
                  }
                  return (
                    <div
                      key={dayIndex}
                      className="rounded-sm cursor-default transition-transform hover:scale-125"
                      style={{
                        width: 12,
                        height: 12,
                        background: getColor(cell.score),
                        opacity: cell.score ? 1 : 0.3,
                      }}
                      onMouseEnter={(e) => {
                        if (cell.score) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltip({ date: cell.date, score: cell.score, x: rect.left, y: rect.top });
                        }
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center mt-3">
        <span className="text-[9px] mr-[3px]" style={{ color: "var(--mf-text-muted)" }}>Menos</span>
        <div className="flex" style={{ gap: 2 }}>
          {[null, 1, 2, 3, 4, 5].map((score, i) => (
            <div
              key={i}
              className="rounded-sm"
              style={{
                width: 10,
                height: 10,
                background: getColor(score),
                opacity: score ? 1 : 0.3,
              }}
            />
          ))}
        </div>
        <span className="text-[9px] ml-[3px]" style={{ color: "var(--mf-text-muted)" }}>Mais</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-2.5 py-1.5 rounded-lg text-[10px] font-mono pointer-events-none shadow-lg"
          style={{
            background: "var(--mf-text)",
            color: "var(--mf-bg)",
            left: tooltip.x,
            top: tooltip.y - 32,
          }}
        >
          {new Date(tooltip.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} · Score {tooltip.score}
        </div>
      )}
    </div>
  );
}
