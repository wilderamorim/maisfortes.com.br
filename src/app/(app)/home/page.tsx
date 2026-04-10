import { getActiveGoals } from "@/lib/actions/goals";
import { getTodayCheckins } from "@/lib/actions/checkins";
import { createClient } from "@/lib/supabase/server";
import { Flame, Plus, ChevronRight } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Home" };

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="px-4 pt-6 max-w-lg mx-auto">
        <div className="rounded-xl p-8 text-center" style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}>
          <p style={{ color: "var(--mf-text-muted)" }}>Carregando...</p>
        </div>
      </div>
    );
  }

  let goals: Awaited<ReturnType<typeof getActiveGoals>> = [];
  let checkedGoalIds = new Set<string>();

  try {
    goals = await getActiveGoals();
    const todayCheckins = await getTodayCheckins();
    checkedGoalIds = new Set(todayCheckins.map((c: { goal_id: string }) => c.goal_id));
  } catch {
    // Graceful fallback — show empty state
  }

  const { data: profile } = await supabase.from("users").select("name").eq("id", user.id).single();
  const name = profile?.name || user.email?.split("@")[0] || "Você";

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm" style={{ color: "var(--mf-text-muted)" }}>Oi, {name}</p>
          <h1 className="text-xl font-bold" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
            Como vai hoje?
          </h1>
        </div>
        <Link
          href="/profile"
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
          style={{ background: "rgba(45,106,79,0.1)", color: "var(--forest)", fontFamily: "var(--font-display)" }}
        >
          {name[0]?.toUpperCase()}
        </Link>
      </div>

      {/* Goals list */}
      {goals.length > 0 ? (
        <div className="space-y-3">
          {goals.map((goal) => {
            const checked = checkedGoalIds.has(goal.id);
            return (
              <Link
                key={goal.id}
                href={checked ? `/history?goal=${goal.id}` : `/checkin?goal=${goal.id}`}
                className="block rounded-xl p-4 transition-all active:scale-[0.98]"
                style={{
                  background: "var(--mf-surface)",
                  border: `1px solid ${checked ? "var(--forest)" : "var(--mf-border-subtle)"}`,
                  boxShadow: checked ? "var(--mf-shadow-glow)" : "none",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm" style={{ color: "var(--mf-text)" }}>{goal.title}</h3>
                      {checked && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono" style={{ background: "rgba(45,106,79,0.1)", color: "var(--forest)" }}>
                          feito
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs" style={{ color: "var(--mf-text-muted)" }}>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5" style={{ color: goal.current_streak > 0 ? "var(--forest)" : "var(--mf-text-muted)" }} />
                        <span className="font-mono" style={{ color: goal.current_streak > 0 ? "var(--forest)" : "var(--mf-text-muted)" }}>
                          {goal.current_streak} {goal.current_streak === 1 ? "dia" : "dias"}
                        </span>
                      </span>
                      {goal.status === "paused" && <span className="text-amber">pausada</span>}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4" style={{ color: "var(--mf-text-muted)" }} />
                </div>
              </Link>
            );
          })}

          {/* Add goal button */}
          <Link
            href="/goals"
            className="flex items-center justify-center gap-2 rounded-xl p-3 text-sm font-medium transition-all active:scale-[0.98]"
            style={{ border: "1px dashed var(--mf-border)", color: "var(--mf-text-muted)" }}
          >
            <Plus className="w-4 h-4" />
            Nova meta
          </Link>
        </div>
      ) : (
        /* Empty state */
        <div className="rounded-xl p-8 text-center" style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}>
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(45,106,79,0.1)" }}>
            <Flame className="w-7 h-7" style={{ color: "var(--forest)" }} />
          </div>
          <h2 className="text-lg font-bold mb-2" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
            Comece sua jornada
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--mf-text-muted)" }}>
            Crie sua primeira meta e faça o primeiro check-in.
          </p>
          <Link
            href="/goals"
            className="inline-block px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all active:scale-95"
            style={{ background: "var(--forest)", boxShadow: "var(--mf-shadow-glow)" }}
          >
            Criar meta
          </Link>
        </div>
      )}
    </div>
  );
}
