"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGoal } from "@/lib/actions/goals";
import { goalSchema } from "@/lib/validations";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewGoalPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = goalSchema.safeParse({ title: title.trim(), description: description.trim() || undefined });
    if (!parsed.success) {
      setError(parsed.error.errors?.[0]?.message ?? "Dados inválidos");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.set("title", title.trim());
      if (description.trim()) formData.set("description", description.trim());
      await createGoal(formData);
      router.push("/home");
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/home" className="p-2 -ml-2 rounded-lg transition-colors" style={{ color: "var(--mf-text-muted)" }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
          Nova meta
        </h1>
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm mb-4" style={{ background: "rgba(229,56,59,0.08)", color: "var(--danger)" }}>{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--mf-text)" }}>
            Qual é sua meta?
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Parar de beber, emagrecer, largar o cigarro..."
            required
            maxLength={100}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
            style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border)", color: "var(--mf-text)" }}
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--mf-text)" }}>
            Descreva em poucas palavras <span style={{ color: "var(--mf-text-muted)" }}>(opcional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="O que te motiva a mudar isso?"
            rows={3}
            maxLength={300}
            className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all focus:ring-2"
            style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border)", color: "var(--mf-text)" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-40"
          style={{ background: "var(--forest)", boxShadow: "var(--mf-shadow-glow)" }}
        >
          {loading ? "Criando..." : "Começar essa jornada"}
        </button>
      </form>
    </div>
  );
}
