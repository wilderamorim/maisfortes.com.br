import { Flame } from "lucide-react";

export const metadata = { title: "Home" };

export default function HomePage() {
  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Oi, Wilder
          </p>
          <h1
            className="text-xl font-bold"
            style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}
          >
            Como vai hoje?
          </h1>
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
          style={{ background: "rgba(45,106,79,0.1)", color: "var(--forest)" }}
        >
          W
        </div>
      </div>

      {/* Empty state — no goals yet */}
      <div
        className="rounded-xl p-8 text-center"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div
          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ background: "rgba(45,106,79,0.1)" }}
        >
          <Flame className="w-7 h-7" style={{ color: "var(--forest)" }} />
        </div>
        <h2
          className="text-lg font-bold mb-2"
          style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}
        >
          Comece sua jornada
        </h2>
        <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
          Crie sua primeira meta e faça o primeiro check-in.
        </p>
        <a
          href="/goals"
          className="inline-block px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all active:scale-95"
          style={{ background: "var(--forest)", boxShadow: "var(--shadow-glow)" }}
        >
          Criar meta
        </a>
      </div>
    </div>
  );
}
