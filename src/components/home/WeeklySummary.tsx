import { createClient } from "@/lib/supabase/server";
import { BarChart3 } from "lucide-react";

export async function WeeklySummary() {
  // Show only on Sunday (0) and Monday (1)
  const today = new Date();
  const day = today.getDay();
  if (day !== 0 && day !== 1) return null;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: goals } = await supabase
    .from("goals")
    .select("id, best_streak")
    .eq("user_id", user.id)
    .eq("status", "active");

  if (!goals || goals.length === 0) return null;

  const goalIds = goals.map((g) => g.id);

  // Last 7 days
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split("T")[0];

  const { data: checkins } = await supabase
    .from("checkins")
    .select("score")
    .in("goal_id", goalIds)
    .gte("date", weekAgoStr);

  const totalCheckins = checkins?.length ?? 0;
  const avgScore = checkins && checkins.length > 0
    ? Math.round((checkins.reduce((sum, c) => sum + c.score, 0) / checkins.length) * 10) / 10
    : 0;
  const bestStreak = Math.max(...goals.map((g) => g.best_streak), 0);

  const emoji = avgScore >= 4 ? "🔥" : avgScore >= 3 ? "💪" : "🌱";

  return (
    <div
      className="rounded-xl p-4 mb-4"
      style={{ background: "rgba(45,106,79,0.06)", border: "1px solid rgba(45,106,79,0.15)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-4 h-4" style={{ color: "var(--forest)" }} />
        <span className="text-xs font-semibold" style={{ color: "var(--forest)" }}>
          Resumo da semana {emoji}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Check-ins", value: String(totalCheckins) },
          { label: "Score médio", value: String(avgScore) },
          { label: "Melhor streak", value: `${bestStreak}d` },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-lg font-bold font-mono" style={{ color: "var(--forest)" }}>{stat.value}</p>
            <p className="text-[10px]" style={{ color: "var(--mf-text-muted)" }}>{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
