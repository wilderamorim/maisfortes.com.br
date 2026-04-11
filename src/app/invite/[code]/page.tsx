"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { acceptInvite } from "@/lib/actions/supporters";
import Link from "next/link";

export default function InvitePage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAccept() {
    setLoading(true);
    setError(null);

    // Check auth on action, not on mount
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = `/auth/login?next=/invite/${code}`;
      return;
    }

    try {
      await acceptInvite(code);
      router.push("/network");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro ao aceitar convite";
      if (msg === "Não autenticado") {
        window.location.href = `/auth/login?next=/invite/${code}`;
        return;
      }
      setError(msg);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4" style={{ background: "var(--mf-bg)" }}>
      <div className="w-full max-w-sm text-center space-y-6">
        <div
          className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
          style={{ background: "var(--forest)", boxShadow: "var(--mf-shadow-glow)" }}
        >
          <span className="text-white"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
        </div>

        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
            Você foi convidado
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--mf-text-muted)" }}>
            Alguém confiou em você para acompanhar sua jornada de mudança.
          </p>
        </div>

        {error && (
          <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(229,56,59,0.1)", color: "var(--danger)" }}>
            {error}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleAccept}
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50"
            style={{ background: "var(--forest)", boxShadow: "var(--mf-shadow-glow)" }}
          >
            {loading ? "Aceitando..." : "Aceitar e acompanhar"}
          </button>
          <Link
            href="/"
            className="block w-full py-3 rounded-xl font-medium text-sm transition-all text-center"
            style={{ color: "var(--mf-text-muted)" }}
          >
            Agora não
          </Link>
        </div>
      </div>
    </div>
  );
}
