import { createClient } from "@/lib/supabase/server";
import { ACHIEVEMENT_SEEDS } from "@/lib/types";
import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Conquistas" };

const rarityColors: Record<string, { bg: string; text: string; border: string }> = {
  bronze: { bg: "rgba(205,127,50,0.1)", text: "#CD7F32", border: "rgba(205,127,50,0.3)" },
  silver: { bg: "rgba(192,192,192,0.1)", text: "#A0A0A0", border: "rgba(192,192,192,0.3)" },
  gold: { bg: "rgba(255,183,3,0.1)", text: "#FFB703", border: "rgba(255,183,3,0.3)" },
  platinum: { bg: "rgba(45,106,79,0.1)", text: "#2D6A4F", border: "rgba(45,106,79,0.3)" },
  diamond: { bg: "rgba(144,224,239,0.1)", text: "#90E0EF", border: "rgba(144,224,239,0.3)" },
};

const rarityLabels: Record<string, string> = {
  bronze: "Bronze",
  silver: "Prata",
  gold: "Ouro",
  platinum: "Platina",
  diamond: "Diamante",
};

export default async function AchievementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let unlockedIds = new Set<string>();

  if (user) {
    const { data } = await supabase
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", user.id);

    unlockedIds = new Set(data?.map((a) => a.achievement_id) ?? []);
  }

  const grouped = {
    bronze: ACHIEVEMENT_SEEDS.filter((a) => a.rarity === "bronze"),
    silver: ACHIEVEMENT_SEEDS.filter((a) => a.rarity === "silver"),
    gold: ACHIEVEMENT_SEEDS.filter((a) => a.rarity === "gold"),
    platinum: ACHIEVEMENT_SEEDS.filter((a) => a.rarity === "platinum"),
    diamond: ACHIEVEMENT_SEEDS.filter((a) => a.rarity === "diamond"),
  };

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/profile" className="p-2 -ml-2 rounded-lg" style={{ color: "var(--text-muted)" }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
          Conquistas
        </h1>
        <span className="font-mono text-xs ml-auto" style={{ color: "var(--forest)" }}>
          {unlockedIds.size}/{ACHIEVEMENT_SEEDS.length}
        </span>
      </div>

      <div className="space-y-8">
        {Object.entries(grouped).map(([rarity, achievements]) => {
          const colors = rarityColors[rarity];
          return (
            <section key={rarity}>
              <h2
                className="text-xs font-mono uppercase tracking-widest mb-3"
                style={{ color: colors.text }}
              >
                {rarityLabels[rarity]}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((ach) => {
                  const unlocked = unlockedIds.has(ach.id);
                  return (
                    <div
                      key={ach.id}
                      className="rounded-xl p-4 text-center transition-all"
                      style={{
                        background: unlocked ? colors.bg : "var(--surface)",
                        border: `1px solid ${unlocked ? colors.border : "var(--border-subtle)"}`,
                        opacity: unlocked ? 1 : 0.5,
                      }}
                    >
                      <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ background: unlocked ? colors.bg : "var(--bg-secondary)" }}>
                        {unlocked ? (
                          <span className="text-2xl" style={{ color: colors.text }}>
                            {rarity === "diamond" ? "💎" : rarity === "platinum" ? "👑" : rarity === "gold" ? "🏆" : rarity === "silver" ? "🥈" : "🥉"}
                          </span>
                        ) : (
                          <Lock className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
                        )}
                      </div>
                      <h3 className="font-semibold text-xs" style={{ color: unlocked ? "var(--text)" : "var(--text-muted)" }}>
                        {ach.name}
                      </h3>
                      <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {ach.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
