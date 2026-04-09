"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
    try {
      await acceptInvite(code);
      router.push("/network");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao aceitar convite");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm text-center space-y-6">
        <div
          className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
          style={{ background: "var(--forest)", boxShadow: "var(--shadow-glow)" }}
        >
          <span className="text-white text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>+</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
            Você foi convidado
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
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
            style={{ background: "var(--forest)", boxShadow: "var(--shadow-glow)" }}
          >
            {loading ? "Aceitando..." : "Aceitar e acompanhar"}
          </button>
          <Link
            href="/"
            className="block w-full py-3 rounded-xl font-medium text-sm transition-all text-center"
            style={{ color: "var(--text-muted)" }}
          >
            Agora não
          </Link>
        </div>
      </div>
    </div>
  );
}
