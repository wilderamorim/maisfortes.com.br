import { ArrowUpRight, Heart } from "lucide-react";

const COLUMNS = [
  {
    title: "Produto",
    links: [
      { label: "Como funciona", href: "/landing#como-funciona" },
      { label: "Baixar app", href: "/download" },
      { label: "Criar conta", href: "/auth/register" },
      { label: "Apoie o projeto", href: "/apoie" },
      { label: "Brandbook", href: "https://brand.maisfortes.com.br", ext: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Termos de uso", href: "/termos" },
      { label: "Privacidade", href: "/privacidade" },
    ],
  },
  {
    title: "Open-source",
    links: [
      { label: "GitHub", href: "https://github.com/wilderamorim/maisfortes.com.br", ext: true },
      { label: "Licença MIT", href: "https://github.com/wilderamorim/maisfortes.com.br/blob/main/LICENSE", ext: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="py-16 border-t" style={{ borderColor: "var(--mf-border-subtle)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--forest)" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <span className="font-bold text-sm tracking-tight" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>Fortes</span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs" style={{ color: "var(--mf-text-muted)" }}>
              Plataforma gratuita de acompanhamento com rede de apoio para mudança comportamental.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <h4 className="text-xs font-semibold mb-4 uppercase tracking-wider" style={{ color: "var(--mf-text-muted)" }}>{col.title}</h4>
              <div className="space-y-3">
                {col.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    {...("ext" in link && link.ext ? { target: "_blank", rel: "noopener" } : {})}
                    className="text-xs flex items-center gap-1 transition-all hover:opacity-70"
                    style={{ color: "var(--mf-text-secondary)" }}
                  >
                    {link.label}
                    {"ext" in link && link.ext && <ArrowUpRight className="w-3 h-3 opacity-40" />}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Support */}
        <div className="mt-12 pt-8 rounded-2xl p-6 text-center" style={{ background: "rgba(45,106,79,0.04)", border: "1px solid rgba(45,106,79,0.08)" }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-4 h-4" style={{ color: "var(--coral)" }} />
            <span className="text-xs font-semibold" style={{ color: "var(--mf-text)" }}>Apoie o projeto</span>
          </div>
          <p className="text-[11px] leading-relaxed max-w-md mx-auto mb-4" style={{ color: "var(--mf-text-muted)" }}>
            O +Fortes é e sempre será gratuito. Se quiser ajudar a manter o projeto no ar, qualquer valor faz diferença.
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="/apoie"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-4 py-2 rounded-full transition-all hover:opacity-80"
              style={{ background: "rgba(45,106,79,0.1)", color: "var(--forest)" }}
            >
              Pix &middot; Doar
            </a>
            <a
              href="https://github.com/sponsors/wilderamorim"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-medium px-4 py-2 rounded-full transition-all hover:opacity-80"
              style={{ color: "var(--mf-text-muted)" }}
            >
              GitHub Sponsors
              <ArrowUpRight className="w-3 h-3 opacity-40" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 flex items-center justify-between" style={{ borderTop: "1px solid var(--mf-border-subtle)" }}>
          <span className="text-[10px] font-mono" style={{ color: "var(--mf-text-muted)" }}>+Fortes — +Forte a cada dia.</span>
          <span className="text-[10px] font-mono" style={{ color: "var(--mf-text-muted)" }}>&copy; 2026</span>
        </div>
      </div>
    </footer>
  );
}
