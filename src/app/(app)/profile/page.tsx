import { createClient } from "@/lib/supabase/server";
import { ACHIEVEMENT_SEEDS } from "@/lib/types";
import { Trophy, ChevronRight, Download } from "lucide-react";
import Link from "next/link";
import { ThemeToggleRow } from "./theme-toggle";
import { LogoutButton } from "./logout-button";
import { NotificationSettingsRow } from "./notification-settings";
import { AvatarUpload } from "./avatar-upload";

export const metadata = { title: "Perfil" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="px-4 pt-6"><p style={{ color: "var(--mf-text-muted)" }}>Carregando...</p></div>;
  }

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single();
  const name = profile?.name || user.email?.split("@")[0] || "Você";

  // Stats
  const { count: totalCheckins } = await supabase
    .from("checkins")
    .select("*", { count: "exact", head: true })
    .in("goal_id", (
      await supabase.from("goals").select("id").eq("user_id", user.id)
    ).data?.map((g) => g.id) ?? []);

  const { data: bestGoal } = await supabase
    .from("goals")
    .select("best_streak, current_streak")
    .eq("user_id", user.id)
    .order("best_streak", { ascending: false })
    .limit(1)
    .single();

  const { data: currentStreakGoal } = await supabase
    .from("goals")
    .select("current_streak")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("current_streak", { ascending: false })
    .limit(1)
    .single();

  const { count: achievementCount } = await supabase
    .from("user_achievements")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const memberSince = new Date(user.created_at).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto pb-8">
      {/* Avatar + Name */}
      <div className="flex items-center gap-4 mb-8">
        <AvatarUpload name={name} currentUrl={profile?.avatar_url ?? null} />
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
            {name}
          </h1>
          <p className="text-sm" style={{ color: "var(--mf-text-muted)" }}>
            Membro desde {memberSince}
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {[
          { label: "Check-ins", value: String((totalCheckins as number | null) ?? 0) },
          { label: "Streak atual", value: String(currentStreakGoal?.current_streak ?? 0) },
          { label: "Melhor streak", value: String(bestGoal?.best_streak ?? 0) },
          { label: "Conquistas", value: `${(achievementCount as number | null) ?? 0}/${ACHIEVEMENT_SEEDS.length}` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-3 text-center"
            style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
          >
            <p className="text-lg font-bold font-mono" style={{ color: "var(--forest)" }}>{stat.value}</p>
            <p className="text-[10px]" style={{ color: "var(--mf-text-muted)" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Menu items */}
      <div className="space-y-1">
        <Link
          href="/achievements"
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
          style={{ color: "var(--mf-text)" }}
        >
          <Trophy className="w-5 h-5" style={{ color: "var(--mf-text-muted)" }} />
          <span className="flex-1 text-sm font-medium">Conquistas</span>
          <ChevronRight className="w-4 h-4" style={{ color: "var(--mf-text-muted)" }} />
        </Link>

        <NotificationSettingsRow hasPush={!!profile?.push_subscription} />

        {/* Theme toggle */}
        <ThemeToggleRow />

        <div className="h-px my-2" style={{ background: "var(--mf-border)" }} />

        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ color: "var(--mf-text-muted)" }}>
          <Download className="w-5 h-5" />
          <span className="flex-1 text-sm font-medium">Exportar dados</span>
          <span className="text-xs">Em breve</span>
        </div>

        <div className="h-px my-2" style={{ background: "var(--mf-border)" }} />

        <LogoutButton />
      </div>
    </div>
  );
}
