"use client";

import { getActiveGoals } from "@/lib/actions/goals";
import { getCheckinsByGoal } from "@/lib/actions/checkins";
import { CalendarDays, ChevronDown, Flame } from "lucide-react";
import { SCORE_OPTIONS } from "@/lib/types";
import { WeeklyScoreChart } from "@/components/history/WeeklyScoreChart";
import { MoodDistribution } from "@/components/history/MoodDistribution";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface GoalData {
  id: string;
  title: string;
  current_streak: number;
}

interface CheckinData {
  id: string;
  date: string;
  score: number;
  mood: string;
  note: string | null;
}

export default function HistoryPage() {
  const searchParams = useSearchParams();
  const goalParam = searchParams.get("goal");

  const [goals, setGoals] = useState<GoalData[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(goalParam);
  const [checkins, setCheckins] = useState<CheckinData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, []);

  useEffect(() => {
    if (selectedGoalId) {
      loadCheckins(selectedGoalId);
    }
  }, [selectedGoalId]);

  async function loadGoals() {
    const data = await getActiveGoals();
    setGoals(data);
    if (data.length > 0 && !selectedGoalId) {
      setSelectedGoalId(goalParam || data[0].id);
    }
    setLoading(false);
  }

  async function loadCheckins(goalId: string) {
    const data = await getCheckinsByGoal(goalId, 30);
    setCheckins(data as CheckinData[]);
  }

  const selectedGoal = goals.find((g) => g.id === selectedGoalId);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: "var(--mf-border-subtle)", borderTopColor: "var(--forest)" }}
        />
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <div className="px-4 pt-6 max-w-lg mx-auto">
        <h1 className="text-xl font-bold mb-6" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
          Histórico
        </h1>
        <div className="rounded-xl p-8 text-center" style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}>
          <CalendarDays className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--mf-text-muted)" }} />
          <p className="text-sm" style={{ color: "var(--mf-text-muted)" }}>Faça seu primeiro check-in e ele aparecerá aqui.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      {/* Header with goal selector */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
          Histórico
        </h1>

        {goals.length > 1 && (
          <div className="relative">
            <select
              value={selectedGoalId ?? ""}
              onChange={(e) => setSelectedGoalId(e.target.value)}
              className="appearance-none text-xs font-medium rounded-xl pl-3 pr-7 py-2 outline-none cursor-pointer"
              style={{
                background: "var(--mf-surface)",
                border: "1px solid var(--mf-border-subtle)",
                color: "var(--mf-text)",
              }}
            >
              {goals.map((g) => (
                <option key={g.id} value={g.id}>{g.title}</option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
              style={{ color: "var(--mf-text-muted)" }}
            />
          </div>
        )}
      </div>

      {/* Streak badge */}
      {selectedGoal && (
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-4 h-4" style={{ color: selectedGoal.current_streak > 0 ? "var(--forest)" : "var(--mf-text-muted)" }} />
          <span className="text-xs font-mono" style={{ color: selectedGoal.current_streak > 0 ? "var(--forest)" : "var(--mf-text-muted)" }}>
            {selectedGoal.current_streak} {selectedGoal.current_streak === 1 ? "dia" : "dias"} de streak
          </span>
          {goals.length === 1 && (
            <span className="text-xs" style={{ color: "var(--mf-text-muted)" }}>· {selectedGoal.title}</span>
          )}
        </div>
      )}

      {/* Charts */}
      {checkins.length > 0 ? (
        <div className="space-y-4">
          <div
            className="rounded-xl p-4 space-y-5"
            style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
          >
            <WeeklyScoreChart checkins={checkins} />
            <MoodDistribution checkins={checkins} />
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            {checkins.map((checkin) => {
              const scoreOpt = SCORE_OPTIONS.find((o) => o.value === checkin.score);
              const date = new Date(checkin.date + "T12:00:00");
              return (
                <div
                  key={checkin.id}
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
                >
                  <span className="text-lg">{scoreOpt?.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: "var(--mf-text)" }}>
                      {scoreOpt?.label}
                    </p>
                    {checkin.note && (
                      <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "var(--mf-text-muted)" }}>
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
        </div>
      ) : (
        <div className="rounded-xl p-6 text-center" style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}>
          <p className="text-xs" style={{ color: "var(--mf-text-muted)" }}>
            Nenhum check-in nesta meta ainda.
          </p>
        </div>
      )}
    </div>
  );
}
