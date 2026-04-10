import { getActiveGoals } from "@/lib/actions/goals";
import { getCheckinsByGoal } from "@/lib/actions/checkins";
import { CalendarDays } from "lucide-react";
import { SCORE_OPTIONS } from "@/lib/types";

export const metadata = { title: "Histórico" };

export default async function HistoryPage() {
  const goals = await getActiveGoals();

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-6" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
        Histórico
      </h1>

      {goals.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}>
          <CalendarDays className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--mf-text-muted)" }} />
          <p className="text-sm" style={{ color: "var(--mf-text-muted)" }}>Faça seu primeiro check-in e ele aparecerá aqui.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {goals.map(async (goal) => {
            const checkins = await getCheckinsByGoal(goal.id, 14);

            return (
              <div key={goal.id}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-sm" style={{ color: "var(--mf-text)" }}>{goal.title}</h2>
                  <span className="font-mono text-xs" style={{ color: "var(--forest)" }}>
                    {goal.current_streak} dias
                  </span>
                </div>

                {checkins.length > 0 ? (
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
                ) : (
                  <p className="text-xs" style={{ color: "var(--mf-text-muted)" }}>
                    Nenhum check-in ainda.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
