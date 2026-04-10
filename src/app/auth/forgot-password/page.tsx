"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthLayout } from "@/components/layout/AuthLayout";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <AuthLayout>
      <div className="hidden lg:flex items-center gap-2 mb-10">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--forest)" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
        <span className="font-bold text-sm" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>Fortes</span>
      </div>

      <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-xs font-medium mb-6 transition-colors" style={{ color: "var(--text-muted)" }}>
        <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao login
      </Link>

      {sent ? (
        <div className="space-y-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto lg:mx-0" style={{ background: "rgba(45,106,79,0.1)" }}>
            <Mail className="w-7 h-7" style={{ color: "var(--forest)" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
              Email enviado
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Enviamos um link de recuperação para <strong style={{ color: "var(--text)" }}>{email}</strong>. Verifique sua caixa de entrada e pasta de spam.
            </p>
          </div>
          <div className="rounded-xl p-4" style={{ background: "rgba(45,106,79,0.05)", border: "1px solid rgba(45,106,79,0.1)" }}>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              O link expira em 1 hora. Caso não receba, tente novamente.
            </p>
          </div>
          <button
            onClick={() => { setSent(false); setEmail(""); }}
            className="w-full py-3 rounded-xl font-medium text-sm transition-all"
            style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
          >
            Enviar novamente
          </button>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
            Recuperar senha
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
            Digite seu email e enviaremos um link para criar uma nova senha.
          </p>

          {error && (
            <div className="rounded-xl px-4 py-3 text-sm mb-4" style={{ background: "rgba(229,56,59,0.08)", color: "var(--danger)" }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoComplete="email"
                autoFocus
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50"
              style={{ background: "var(--forest)", boxShadow: "var(--shadow-glow)" }}
            >
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}
