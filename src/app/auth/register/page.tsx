"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { FormField } from "@/components/ui/FormField";
import { registerSchema } from "@/lib/validations";
import type { ZodIssue } from "zod";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const parsed = registerSchema.safeParse({ name, email, password });
      if (!parsed.success) {
        const errs: Record<string, string> = {};
        parsed.error.issues.forEach((issue: ZodIssue) => {
          const field = issue.path[0] as string;
          if (!errs[field]) errs[field] = issue.message;
        });
        setFieldErrors(errs);
        setLoading(false);
        return;
      }

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

      // Supabase returns no error but no session when email already exists
      if (data?.user?.identities?.length === 0) {
        setError("Este email já está cadastrado. Tente fazer login.");
        setLoading(false);
        return;
      }

      if (data?.session) { window.location.href = "/onboarding"; return; }
      setEmailSent(true);
    } catch (err) {
      console.error("[Register]", err);
      setError("Erro ao criar conta. Tente novamente.");
    }
    setLoading(false);
  }

  return (
    <AuthLayout>
      <Link href="/" className="hidden lg:flex items-center gap-2 mb-10 group">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: "var(--forest)" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
        <span className="font-bold text-sm" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>Fortes</span>
      </Link>

      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
        {emailSent ? "Verifique seu email" : "Criar conta"}
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--mf-text-muted)" }}>
        {emailSent ? `Enviamos um link de confirmação para ${email}` : "Sua jornada começa aqui"}
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
          <button
            onClick={() => {
              const supabase = createClient();
              supabase.auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: `${window.location.origin}/auth/callback?next=/onboarding` },
              });
            }}
            type="button"
            className="w-full py-3 rounded-xl font-medium text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 mb-6"
            style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border)", color: "var(--mf-text)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "var(--mf-border)" }} />
            <span className="text-xs" style={{ color: "var(--mf-text-muted)" }}>ou com email</span>
            <div className="flex-1 h-px" style={{ background: "var(--mf-border)" }} />
          </div>

          {error && <div className="rounded-xl px-4 py-3 text-sm mb-4" style={{ background: "rgba(229,56,59,0.08)", color: "var(--danger)" }}>{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Nome" error={fieldErrors.name}>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" autoComplete="name" className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2" style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border)", color: "var(--mf-text)" }} />
            </FormField>
            <FormField label="E-mail" error={fieldErrors.email}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" autoComplete="email" className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2" style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border)", color: "var(--mf-text)" }} />
            </FormField>
            <FormField label="Senha" error={fieldErrors.password}>
              <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" autoComplete="new-password" />
            </FormField>
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
