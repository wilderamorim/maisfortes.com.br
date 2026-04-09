"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: Supabase auth
    setLoading(false);
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "var(--forest)", boxShadow: "var(--shadow-glow)" }}
          >
            <span className="text-white text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>+</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
            Criar conta
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Ninguém muda sozinho
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--text)" }}>Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--text)" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--text)" }}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
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
            {loading ? "Criando..." : "Comece sua jornada"}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>
          Já tem conta?{" "}
          <Link href="/auth/login" className="font-semibold" style={{ color: "var(--forest)" }}>
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
