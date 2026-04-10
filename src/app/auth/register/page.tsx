"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthLayout } from "@/components/layout/AuthLayout";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding` },
    });

    if (signUpError) {
      setError(signUpError.message === "User already registered" ? "Este email já está cadastrado." : signUpError.message);
      setLoading(false);
      return;
    }

    if (data.session) { window.location.href = "/onboarding"; return; }
    setEmailSent(true);
    setLoading(false);
  }

  return (
    <AuthLayout>
      <div className="hidden lg:flex items-center gap-2 mb-10">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--forest)" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
        <span className="font-bold text-sm" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>Fortes</span>
      </div>

      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
        {emailSent ? "Verifique seu email" : "Criar conta"}
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--mf-text-muted)" }}>
        {emailSent ? `Enviamos um link de confirmação para ${email}` : "Ninguém muda sozinho"}
      </p>

      {emailSent ? (
        <div className="space-y-6">
          <div className="rounded-xl p-5 text-center" style={{ background: "rgba(45,106,79,0.06)", border: "1px solid rgba(45,106,79,0.15)" }}>
            <p className="text-sm" style={{ color: "var(--mf-text-secondary)" }}>Clique no link no seu email para ativar sua conta e começar sua jornada.</p>
            <p className="text-xs mt-3" style={{ color: "var(--mf-text-muted)" }}>Não recebeu? Verifique a pasta de spam.</p>
          </div>
          <Link href="/auth/login" className="block w-full py-3 rounded-xl font-semibold text-sm text-center text-white transition-all" style={{ background: "var(--forest)" }}>Ir para o login</Link>
        </div>
      ) : (
        <>
          {error && <div className="rounded-xl px-4 py-3 text-sm mb-4" style={{ background: "rgba(229,56,59,0.08)", color: "var(--danger)" }}>{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--mf-text-secondary)" }}>Nome</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" required autoComplete="name" className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2" style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border)", color: "var(--mf-text)" }} />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--mf-text-secondary)" }}>E-mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required autoComplete="email" className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2" style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border)", color: "var(--mf-text)" }} />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--mf-text-secondary)" }}>Senha</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required minLength={6} autoComplete="new-password" className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2" style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border)", color: "var(--mf-text)" }} />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50" style={{ background: "var(--forest)", boxShadow: "var(--mf-shadow-glow)" }}>
              {loading ? "Criando conta..." : "Comece sua jornada"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--mf-text-muted)" }}>
            Já tem conta?{" "}<Link href="/auth/login" className="font-semibold" style={{ color: "var(--forest)" }}>Entrar</Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
