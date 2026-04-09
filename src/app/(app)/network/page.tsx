import { Users } from "lucide-react";

export const metadata = { title: "Rede" };

export default function NetworkPage() {
  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-6" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
        Rede de Apoio
      </h1>
      <div className="rounded-xl p-8 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border-subtle)" }}>
        <Users className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
        <h2 className="font-bold mb-2" style={{ color: "var(--text)" }}>Ninguém aqui ainda</h2>
        <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>Quando estiver pronto, convide quem te apoia.</p>
        <button
          className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all active:scale-95"
          style={{ background: "var(--forest)" }}
        >
          Convidar apoiador
        </button>
      </div>
    </div>
  );
}
