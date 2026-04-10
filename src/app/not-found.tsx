import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-7xl font-bold font-mono" style={{ color: "var(--border)" }}>4</span>
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(45,106,79,0.1)", border: "1px solid rgba(45,106,79,0.2)" }}
          >
            <span className="" style={{ color: "var(--forest)" }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
          </div>
          <span className="text-7xl font-bold font-mono" style={{ color: "var(--border)" }}>4</span>
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
          Página não encontrada
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          Nem todo caminho é reto. O importante é voltar.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all active:scale-95"
          style={{ background: "var(--forest)" }}
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
