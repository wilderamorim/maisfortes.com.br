"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { forgotPasswordSchema } from "@/lib/validations";
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

    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      setLoading(false);
      return;
    }

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
      <Link href="/" className="hidden lg:flex items-center gap-2 mb-10 group">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: "var(--forest)" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
        <span className="font-bold text-sm" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>Fortes</span>
      </Link>

      <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-xs font-medium mb-6 transition-colors" style={{ color: "var(--mf-text-muted)" }}>
        <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao login
      </Link>

      {sent ? (
        <div className="space-y-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto lg:mx-0" style={{ background: "rgba(45,106,79,0.1)" }}>
            <Mail className="w-7 h-7" style={{ color: "var(--forest)" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
              Email enviado
            </h1>
            <p className="text-sm" style={{ color: "var(--mf-text-muted)" }}>
              Enviamos um link de recuperação para <strong style={{ color: "var(--mf-text)" }}>{email}</strong>. Verifique sua caixa de entrada e pasta de spam.
            </p>
          </div>
          <div className="rounded-xl p-4" style={{ background: "rgba(45,106,79,0.05)", border: "1px solid rgba(45,106,79,0.1)" }}>
            <p className="text-xs" style={{ color: "var(--mf-text-muted)" }}>
              O link vale por 1 hora. Se não chegar, olhe no spam ou tente de novo.
            </p>
          </div>
          <button
            onClick={() => { setSent(false); setEmail(""); }}
            className="w-full py-3 rounded-xl font-medium text-sm transition-all"
            style={{ border: "1px solid var(--mf-border)", color: "var(--mf-text-secondary)" }}
          >
            Enviar novamente
          </button>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
            Recuperar senha
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--mf-text-muted)" }}>
            Sem problema. Digite seu email que enviamos um link para criar uma nova.
          </p>

          {error && (
            <div className="rounded-xl px-4 py-3 text-sm mb-4" style={{ background: "rgba(229,56,59,0.08)", color: "var(--danger)" }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--mf-text-secondary)" }}>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoComplete="email"
                autoFocus
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border)", color: "var(--mf-text)" }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50"
              style={{ background: "var(--forest)", boxShadow: "var(--mf-shadow-glow)" }}
            >
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}
