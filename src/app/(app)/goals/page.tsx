"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGoal } from "@/lib/actions/goals";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewGoalPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

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
        <Link href="/home" className="p-2 -ml-2 rounded-lg transition-colors" style={{ color: "var(--text-muted)" }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
          Nova meta
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--text)" }}>
            Qual é sua meta?
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Parar de beber, Emagrecer, Largar o celular..."
            required
            maxLength={100}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--text)" }}>
            Descreva em poucas palavras <span style={{ color: "var(--text-muted)" }}>(opcional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Por que essa meta é importante pra você?"
            rows={3}
            maxLength={300}
            className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all focus:ring-2"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-40"
          style={{ background: "var(--forest)", boxShadow: "var(--shadow-glow)" }}
        >
          {loading ? "Criando..." : "Começar jornada"}
        </button>
      </form>
    </div>
  );
}
