"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthLayout } from "@/components/layout/AuthLayout";
import Link from "next/link";
import { Check, AlertTriangle } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if we have a valid session from the reset link
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  // Loading state
  if (hasSession === null) {
    return (
      <AuthLayout>
        <div className="text-center py-12">
          <p style={{ color: "var(--text-muted)" }}>Verificando link...</p>
        </div>
      </AuthLayout>
    );
  }

  // Invalid/expired link
  if (!hasSession) {
    return (
      <AuthLayout>
        <div className="hidden lg:flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: "var(--forest)" }}>+</div>
          <span className="font-bold text-sm" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>Fortes</span>
        </div>

        <div className="space-y-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto lg:mx-0" style={{ background: "rgba(229,56,59,0.1)" }}>
            <AlertTriangle className="w-7 h-7" style={{ color: "var(--danger)" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
              Link expirado
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Este link de recuperação expirou ou já foi utilizado. Solicite um novo.
            </p>
          </div>
          <Link href="/auth/forgot-password" className="block w-full py-3 rounded-xl text-white font-semibold text-sm text-center transition-all" style={{ background: "var(--forest)" }}>
            Solicitar novo link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  // Success
  if (success) {
    return (
      <AuthLayout>
        <div className="hidden lg:flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: "var(--forest)" }}>+</div>
          <span className="font-bold text-sm" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>Fortes</span>
        </div>

        <div className="space-y-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto lg:mx-0" style={{ background: "rgba(45,106,79,0.1)" }}>
            <Check className="w-7 h-7" style={{ color: "var(--forest)" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
              Senha atualizada
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Sua senha foi alterada com sucesso. Você já pode acessar sua conta.
            </p>
          </div>
          <Link href="/home" className="block w-full py-3 rounded-xl text-white font-semibold text-sm text-center transition-all" style={{ background: "var(--forest)" }}>
            Ir para o app
          </Link>
        </div>
      </AuthLayout>
    );
  }

  // Form
  return (
    <AuthLayout>
      <div className="hidden lg:flex items-center gap-2 mb-10">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: "var(--forest)" }}>+</div>
        <span className="font-bold text-sm" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>Fortes</span>
      </div>

      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
        Nova senha
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        Escolha uma senha segura para sua conta.
      </p>

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm mb-4" style={{ background: "rgba(229,56,59,0.08)", color: "var(--danger)" }}>{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>Nova senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-secondary)" }}>Confirmar senha</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repita a nova senha"
            required
            minLength={6}
            autoComplete="new-password"
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
          {loading ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </AuthLayout>
  );
}
