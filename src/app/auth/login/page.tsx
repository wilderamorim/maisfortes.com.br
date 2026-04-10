"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthLayout } from "@/components/layout/AuthLayout";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message === "Invalid login credentials" ? "Email ou senha incorretos." : signInError.message);
      setLoading(false);
      return;
    }

    window.location.href = "/home";
  }

  async function handleGoogleLogin() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/home` },
    });
  }

  return (
    <AuthLayout>
      <div className="hidden lg:flex items-center gap-2 mb-10">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold leading-none" style={{ background: "var(--forest)" }}>+</div>
        <span className="font-bold text-sm" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>Fortes</span>
      </div>

      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
        Acesse sua conta
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>Juntos, somos mais fortes</p>

      <button onClick={handleGoogleLogin} type="button" className="w-full py-3 rounded-xl font-medium text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 mb-6" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}>
        <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        Google
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>ou com email</span>
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm mb-4" style={{ background: "rgba(229,56,59,0.08)", color: "var(--danger)" }}>{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>E-mail</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required autoComplete="email" className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Senha</label>
            <Link href="/auth/forgot-password" className="text-xs font-medium" style={{ color: "var(--forest)" }}>Esqueceu a senha?</Link>
          </div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }} />
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50" style={{ background: "var(--forest)", boxShadow: "var(--shadow-glow)" }}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: "var(--text-muted)" }}>
        Não tem conta?{" "}
        <Link href="/auth/register" className="font-semibold" style={{ color: "var(--forest)" }}>Criar conta</Link>
      </p>
    </AuthLayout>
  );
}
