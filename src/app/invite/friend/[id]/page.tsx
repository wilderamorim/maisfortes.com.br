"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { acceptFriendStreak, getFriendStreakInvite } from "@/lib/actions/friend-streaks";
import { Eye, EyeOff, Flame } from "lucide-react";
import Link from "next/link";

interface GoalOption {
  id: string;
  title: string;
}

export default function FriendInvitePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviterName, setInviterName] = useState("");
  const [targetDays, setTargetDays] = useState(30);
  const [goals, setGoals] = useState<GoalOption[]>([]);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [goalVisible, setGoalVisible] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = `/auth/login?next=/invite/friend/${id}`;
      return;
    }

    // Get invite info via server action
    const invite = await getFriendStreakInvite(id);

    if (!invite) {
      setError("Convite não encontrado ou já aceito.");
      setLoading(false);
      return;
    }

    if ("error" in invite && invite.error === "self") {
      setError("Você não pode aceitar seu próprio convite.");
      setLoading(false);
      return;
    }

    if ("inviterName" in invite) {
      setInviterName(invite.inviterName);
      setTargetDays(invite.targetDays);
    }

    // Get user's active goals
    const { data: userGoals } = await supabase
      .from("goals")
      .select("id, title")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("order");

    const g = userGoals ?? [];
    setGoals(g);
    if (g.length === 1) setSelectedGoal(g[0].id);

    setLoading(false);
  }

  async function handleAccept() {
    if (!selectedGoal) return;
    setSubmitting(true);
    setError(null);

    try {
      await acceptFriendStreak({
        friendStreakId: id,
        goalId: selectedGoal,
        goalVisible,
      });
      router.push("/network");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao aceitar");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "var(--mf-bg)" }}>
        <p style={{ color: "var(--mf-text-muted)" }}>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4" style={{ background: "var(--mf-bg)" }}>
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4"
            style={{ background: "var(--forest)", boxShadow: "var(--mf-shadow-glow)" }}
          >
            <Flame className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
            Ofensiva de amigos
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--mf-text-muted)" }}>
            {inviterName} quer manter uma ofensiva de <strong>{targetDays} dias</strong> com você!
          </p>
        </div>

        {error && (
          <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(229,56,59,0.08)", color: "var(--danger)" }}>
            {error}
          </div>
        )}

        {!error && goals.length === 0 && (
          <div className="rounded-xl px-4 py-3 text-sm text-center" style={{ background: "rgba(255,183,3,0.1)", color: "var(--amber)" }}>
            Você precisa criar uma meta primeiro para aceitar a ofensiva.
          </div>
        )}

        {/* Goal selection */}
        {!error && goals.length > 0 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: "var(--mf-text-muted)" }}>
                {goals.length === 1 ? "Sua meta" : "Escolha sua meta para a ofensiva"}
              </label>
              <div className="space-y-1.5">
                {goals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGoal(g.id)}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all"
                    style={{
                      background: selectedGoal === g.id ? "rgba(45,106,79,0.12)" : "var(--mf-surface)",
                      border: selectedGoal === g.id ? "2px solid var(--forest)" : "2px solid var(--mf-border-subtle)",
                      color: "var(--mf-text)",
                    }}
                  >
                    {g.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Visibility toggle */}
            <button
              onClick={() => setGoalVisible(!goalVisible)}
              className="flex items-center gap-2 text-xs"
              style={{ color: "var(--mf-text-muted)" }}
            >
              {goalVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              {goalVisible ? "Meta visível para o amigo" : "Meta privada (amigo não verá o nome)"}
            </button>

            <button
              onClick={handleAccept}
              disabled={!selectedGoal || submitting}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50"
              style={{ background: "var(--forest)" }}
            >
              {submitting ? "Aceitando..." : "Aceitar ofensiva"}
            </button>
          </div>
        )}

        <Link href="/" className="block w-full py-3 rounded-xl font-medium text-sm text-center" style={{ color: "var(--mf-text-muted)" }}>
          Agora não
        </Link>
      </div>
    </div>
  );
}
