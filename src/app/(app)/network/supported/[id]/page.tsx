"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupportedGoalDetail } from "@/lib/actions/supporters";
import { ArrowLeft, Flame, Lock } from "lucide-react";
import { SCORE_OPTIONS } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { WeeklyScoreChart } from "@/components/history/WeeklyScoreChart";
import { MoodDistribution } from "@/components/history/MoodDistribution";
import { CheckinHeatmap } from "@/components/history/CheckinHeatmap";
import Link from "next/link";

type DetailData = Awaited<ReturnType<typeof getSupportedGoalDetail>>;

export default function SupportedGoalPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<DetailData>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const result = await getSupportedGoalDetail(id);
    setData(result);
    setLoading(false);
  }

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

  if (!data) {
    return (
      <div className="px-4 pt-6 max-w-lg mx-auto">
        <Link href="/network" className="p-2 -ml-2 rounded-lg inline-block mb-4" style={{ color: "var(--mf-text-muted)" }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <p className="text-sm" style={{ color: "var(--mf-text-muted)" }}>Meta não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/network" className="p-2 -ml-2 rounded-lg" style={{ color: "var(--mf-text-muted)" }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
          Acompanhamento
        </h1>
      </div>

      {/* Owner card */}
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3 mb-4"
        style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
      >
        <Avatar
          name={data.owner.name}
          avatarUrl={data.owner.avatar_url}
          size={44}
          bgColor="rgba(244,132,95,0.1)"
          textColor="var(--coral)"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: "var(--mf-text)" }}>{data.owner.name}</p>
          <p className="text-xs" style={{ color: "var(--mf-text-muted)" }}>{data.goal.title}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4" style={{ color: data.goal.current_streak > 0 ? "var(--forest)" : "var(--mf-text-muted)" }} />
            <span className="font-mono text-sm font-bold" style={{ color: data.goal.current_streak > 0 ? "var(--forest)" : "var(--mf-text-muted)" }}>
              {data.goal.current_streak}
            </span>
          </div>
          <p className="text-[9px] font-mono" style={{ color: "var(--mf-text-muted)" }}>
            recorde {data.goal.best_streak}
          </p>
        </div>
      </div>

      {/* Content based on permissions */}
      {data.can_see_score ? (
        <div className="space-y-4">
          {/* Heatmap */}
          {data.checkins.length > 0 && (
            <div
              className="rounded-xl p-4"
              style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
            >
              <CheckinHeatmap checkins={data.checkins} />
            </div>
          )}

          {/* Charts */}
          {data.checkins.length > 0 && (
            <div
              className="rounded-xl p-4 space-y-5"
              style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
            >
              <WeeklyScoreChart checkins={data.checkins} />
              <MoodDistribution checkins={data.checkins} />
            </div>
          )}

          {/* Recent checkins */}
          {data.checkins.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold" style={{ color: "var(--mf-text-muted)" }}>
                Últimos check-ins
              </h3>
              {data.checkins.slice(0, 14).map((checkin) => {
                const scoreOpt = SCORE_OPTIONS.find((o) => o.value === checkin.score);
                const date = new Date(checkin.date + "T12:00:00");
                return (
                  <div
                    key={checkin.date}
                    className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
                  >
                    <span className="text-lg">{scoreOpt?.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: "var(--mf-text)" }}>
                        {scoreOpt?.label}
                      </p>
                      {checkin.note && data.can_see_notes && (
                        <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--mf-text-muted)" }}>
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
            <div className="rounded-xl p-6 text-center" style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}>
              <p className="text-xs" style={{ color: "var(--mf-text-muted)" }}>
                Nenhum check-in ainda.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Score hidden by owner */
        <div className="rounded-xl p-8 text-center" style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}>
          <Lock className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--mf-text-muted)" }} />
          <p className="text-sm font-medium mb-1" style={{ color: "var(--mf-text)" }}>
            Detalhes privados
          </p>
          <p className="text-xs" style={{ color: "var(--mf-text-muted)" }}>
            {data.owner.name} escolheu não compartilhar os detalhes dos check-ins.
            Você ainda pode acompanhar o streak e enviar mensagens de apoio.
          </p>
        </div>
      )}
    </div>
  );
}
