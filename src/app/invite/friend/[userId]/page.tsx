"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function FriendInvitePage() {
  const { userId } = useParams<{ userId: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAccept() {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = `/auth/login?next=/invite/friend/${userId}`;
        return;
      }

      if (user.id === userId) {
        setError("Você não pode ser amigo de si mesmo.");
        setLoading(false);
        return;
      }

      // Create bidirectional friendship
      await supabase.from("friendships").upsert(
        { user_id: user.id, friend_id: userId, status: "active" },
        { onConflict: "user_id,friend_id" }
      );
      await supabase.from("friendships").upsert(
        { user_id: userId, friend_id: user.id, status: "active" },
        { onConflict: "user_id,friend_id" }
      );

      router.push("/network");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao aceitar");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4" style={{ background: "var(--mf-bg)" }}>
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center" style={{ background: "var(--forest)", boxShadow: "var(--mf-shadow-glow)" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
            Convite de amizade
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--mf-text-muted)" }}>
            Alguém quer acompanhar streaks com você no +Fortes.
          </p>
        </div>

        {error && (
          <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(229,56,59,0.08)", color: "var(--danger)" }}>{error}</div>
        )}

        <div className="space-y-3">
          <button onClick={handleAccept} disabled={loading} className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50" style={{ background: "var(--forest)" }}>
            {loading ? "Adicionando..." : "Aceitar e ver streaks"}
          </button>
          <Link href="/" className="block w-full py-3 rounded-xl font-medium text-sm text-center" style={{ color: "var(--mf-text-muted)" }}>
            Agora não
          </Link>
        </div>
      </div>
    </div>
  );
}
