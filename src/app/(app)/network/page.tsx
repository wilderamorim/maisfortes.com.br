import { createClient } from "@/lib/supabase/server";
import { getActiveGoals } from "@/lib/actions/goals";
import { getSupportersForGoal, getGoalsISupport } from "@/lib/actions/supporters";
import { getFriendsWithStreaks } from "@/lib/actions/friendships";
import { Users, Flame, Link2, UserPlus, Share2 } from "lucide-react";
import Link from "next/link";
import { InviteButton } from "./invite-button";
import { AddFriendButton } from "./add-friend-button";

export const metadata = { title: "Rede" };

export default async function NetworkPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="px-4 pt-6"><p style={{ color: "var(--mf-text-muted)" }}>Carregando...</p></div>;
  }

  const goals = await getActiveGoals();
  const goalsISupport = await getGoalsISupport();
  const friends = await getFriendsWithStreaks();

  // Get supporters for each goal
  const goalSupporters = await Promise.all(
    goals.map(async (g) => ({
      goal: g,
      supporters: await getSupportersForGoal(g.id),
    }))
  );

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto space-y-8">
      <h1 className="text-xl font-bold" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
        Rede de Apoio
      </h1>

      {/* Streak de Amigos */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm" style={{ color: "var(--mf-text)" }}>Streak de Amigos</h2>
          <AddFriendButton />
        </div>

        {friends.length > 0 ? (
          <div className="space-y-2">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs"
                  style={{ background: "rgba(45,106,79,0.1)", color: "var(--forest)" }}
                >
                  {friend.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <span className="flex-1 text-sm font-medium" style={{ color: "var(--mf-text)" }}>
                  {friend.name}
                </span>
                <div className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" style={{ color: friend.best_streak > 0 ? "var(--forest)" : "var(--mf-text-muted)" }} />
                  <span className="font-mono text-xs" style={{ color: friend.best_streak > 0 ? "var(--forest)" : "var(--mf-text-muted)" }}>
                    {friend.best_streak}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl p-6 text-center" style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}>
            <p className="text-sm" style={{ color: "var(--mf-text-muted)" }}>
              Convide amigos e acompanhem os streaks um do outro.
            </p>
          </div>
        )}
      </section>

      {/* Meus apoiadores (por meta) */}
      <section>
        <h2 className="font-semibold text-sm mb-3" style={{ color: "var(--mf-text)" }}>Meus Apoiadores</h2>

        {goals.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--mf-text-muted)" }}>Crie uma meta primeiro.</p>
        ) : (
          <div className="space-y-4">
            {goalSupporters.map(({ goal, supporters }) => (
              <div key={goal.id} className="rounded-xl p-4" style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium" style={{ color: "var(--mf-text)" }}>{goal.title}</h3>
                  <InviteButton goalId={goal.id} />
                </div>

                {supporters.length > 0 ? (
                  <div className="space-y-2">
                    {supporters.map((s) => (
                      <div key={s.id} className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                          style={{ background: "rgba(244,132,95,0.1)", color: "var(--coral)" }}
                        >
                          {(s.users as Record<string, unknown>)?.name ? ((s.users as Record<string, unknown>).name as string)[0]?.toUpperCase() : "?"}
                        </div>
                        <span className="text-xs flex-1" style={{ color: "var(--mf-text)" }}>
                          {(s.users as Record<string, unknown>)?.name as string ?? "Pendente"}
                        </span>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-mono"
                          style={{
                            background: s.status === "active" ? "rgba(45,106,79,0.1)" : "rgba(255,183,3,0.1)",
                            color: s.status === "active" ? "var(--forest)" : "var(--amber)",
                          }}
                        >
                          {s.status === "active" ? "ativo" : "pendente"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs" style={{ color: "var(--mf-text-muted)" }}>
                    Sem apoiador por enquanto — e tudo bem. Convide quando quiser.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Metas que apoio */}
      {goalsISupport.length > 0 && (
        <section>
          <h2 className="font-semibold text-sm mb-3" style={{ color: "var(--mf-text)" }}>Metas que Apoio</h2>
          <div className="space-y-2">
            {goalsISupport.map((s) => {
              const goal = s.goals as Record<string, unknown>;
              const owner = goal?.users as Record<string, unknown>;
              return (
                <div
                  key={s.id}
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs"
                    style={{ background: "rgba(244,132,95,0.1)", color: "var(--coral)" }}
                  >
                    {(owner?.name as string)?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: "var(--mf-text)" }}>{owner?.name as string}</p>
                    <p className="text-[10px]" style={{ color: "var(--mf-text-muted)" }}>{goal?.title as string}</p>
                  </div>
                  <Flame className="w-4 h-4" style={{ color: "var(--forest)" }} />
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
