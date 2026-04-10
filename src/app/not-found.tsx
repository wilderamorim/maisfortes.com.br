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
            <span className="text-3xl font-bold leading-none" style={{ color: "var(--forest)", fontFamily: "var(--font-display)" }}>+</span>
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
