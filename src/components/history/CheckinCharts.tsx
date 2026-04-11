"use client";

import { CheckinHeatmap } from "./CheckinHeatmap";
import { WeeklyScoreChart } from "./WeeklyScoreChart";
import { MoodDistribution } from "./MoodDistribution";

interface CheckinData {
  date: string;
  score: number;
  mood: string;
  note?: string | null;
}

export function CheckinCharts({ checkins }: { checkins: CheckinData[] }) {
  if (checkins.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Heatmap */}
      <div
        className="rounded-xl p-4"
        style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
      >
        <CheckinHeatmap checkins={checkins} />
      </div>

      {/* Score + Mood */}
      <div
        className="rounded-xl p-4 space-y-5"
        style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
      >
        <WeeklyScoreChart checkins={checkins} />
        <MoodDistribution checkins={checkins} />
      </div>
    </div>
  );
}
