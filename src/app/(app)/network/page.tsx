import { createClient } from "@/lib/supabase/server";
import { getActiveGoals } from "@/lib/actions/goals";
import { getSupportersForGoal, getGoalsISupport } from "@/lib/actions/supporters";
import { getFriendStreaks } from "@/lib/actions/friend-streaks";
import { Flame } from "lucide-react";
import Link from "next/link";
import { InviteButton } from "./invite-button";
import { AddFriendButton } from "./add-friend-button";
import { NudgeButton } from "./nudge-button";
import { Avatar } from "@/components/ui/Avatar";

export const metadata = { title: "Rede" };

export default async function NetworkPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="px-4 pt-6"><p style={{ color: "var(--mf-text-muted)" }}>Carregando...</p></div>;
  }

  const goals = await getActiveGoals();
  const goalsISupport = await getGoalsISupport();
  const friends = await getFriendStreaks();

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

      {/* Ofensiva de Amigos */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm" style={{ color: "var(--mf-text)" }}>Ofensiva de Amigos</h2>
          <AddFriendButton />
        </div>

        {friends.length > 0 ? (
          <div className="space-y-2">
            {friends.map((fs) => (
              <div
                key={fs.id}
                className="rounded-xl px-4 py-3"
                style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
              >
                {/* Header: avatar + name + streak counter */}
                <div className="flex items-center gap-3 mb-2">
                  <Avatar name={fs.friend.name} avatarUrl={fs.friend.avatar_url} size={36} />
                  <span className="flex-1 text-sm font-medium" style={{ color: "var(--mf-text)" }}>
                    {fs.friend.name}
                  </span>
                  {fs.status === "pending" ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono" style={{ background: "rgba(255,183,3,0.1)", color: "var(--amber)" }}>
                      Pendente
                    </span>
                  ) : fs.status === "completed" ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono" style={{ background: "rgba(45,106,79,0.1)", color: "var(--forest)" }}>
                      🏆 {fs.target_days}/{fs.target_days}
                    </span>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" style={{ color: fs.current_streak > 0 ? "var(--forest)" : "var(--mf-text-muted)" }} />
                      <span className="font-mono text-xs" style={{ color: fs.current_streak > 0 ? "var(--forest)" : "var(--mf-text-muted)" }}>
                        {fs.current_streak}/{fs.target_days}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status details */}
                {fs.status === "pending" ? (
                  <p className="text-[10px] ml-12" style={{ color: "var(--mf-text-muted)" }}>
                    Aguardando {fs.friend.name || "amigo"} escolher uma meta
                  </p>
                ) : fs.status === "completed" ? (
                  <div className="ml-12">
                    <p className="text-[10px] mb-2" style={{ color: "var(--forest)" }}>
                      Ofensiva de {fs.target_days} dias completa!
                    </p>
                  </div>
                ) : (
                  <div className="ml-12 space-y-0.5">
                    {/* My status */}
                    <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--mf-text-muted)" }}>
                      <span>{fs.i_checked_today ? "✅" : "⏳"}</span>
                      <span>Você</span>
                      <span style={{ color: "var(--mf-text-muted)" }}>·</span>
                      <span>{fs.my_goal.title}</span>
                    </div>
                    {/* Friend status */}
                    <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--mf-text-muted)" }}>
                      <span>{fs.friend_checked_today ? "✅" : "⏳"}</span>
                      <span>{fs.friend.name}</span>
                      <span style={{ color: "var(--mf-text-muted)" }}>·</span>
                      <span>{fs.friend_goal?.visible ? fs.friend_goal.title : "Meta privada 🔒"}</span>
                      {fs.i_checked_today && !fs.friend_checked_today && (
                        <NudgeButton friendStreakId={fs.id} friendName={fs.friend.name} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl p-6 text-center" style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}>
            <p className="text-sm" style={{ color: "var(--mf-text-muted)" }}>
              Crie uma ofensiva de amigos e acompanhem o progresso juntos.
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
                        <Avatar
                          name={(s.users as Record<string, unknown>)?.name as string ?? "?"}
                          avatarUrl={(s.users as Record<string, unknown>)?.avatar_url as string | null}
                          size={28}
                          bgColor="rgba(244,132,95,0.1)"
                          textColor="var(--coral)"
                        />
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
                  <Avatar
                    name={(owner?.name as string) ?? "?"}
                    avatarUrl={owner?.avatar_url as string | null}
                    size={36}
                    bgColor="rgba(244,132,95,0.1)"
                    textColor="var(--coral)"
                  />
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
