import { PageHero } from "@/components/layout/PageHero";
import { Footer } from "@/components/layout/Footer";
import { Heart, Copy, QrCode } from "lucide-react";

export const metadata = {
  title: "Apoie o +Fortes",
  description: "O +Fortes é gratuito para sempre. Apoie o projeto com Pix ou GitHub Sponsors.",
};

const PIX_KEY = "contato@maisfortes.com.br";

export default function ApoiePage() {
  return (
    <div className="min-h-dvh" style={{ background: "var(--mf-bg)" }}>
      <PageHero
        title="Apoie o +Fortes"
        subtitle="Gratuito para sempre. Sua ajuda mantém o projeto vivo."
        icon={<Heart className="w-6 h-6 text-white" />}
      />

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Why */}
        <div className="mb-12">
          <h2 className="text-lg font-bold mb-3" style={{ color: "var(--mf-text)", fontFamily: "var(--font-display)" }}>
            Por que apoiar?
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--mf-text-muted)" }}>
            O +Fortes não tem anúncios, planos pagos ou investidores. É um projeto independente, open-source, feito com o propósito de ajudar pessoas. Os custos de servidor, domínio e infraestrutura são bancados do próprio bolso. Qualquer contribuição — de qualquer valor — ajuda a manter o projeto no ar e em evolução.
          </p>
        </div>

        {/* Pix */}
        <div
          className="rounded-2xl p-8 mb-6"
          style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(45,106,79,0.08)", color: "var(--forest)" }}>
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: "var(--mf-text)" }}>Pix</h3>
              <p className="text-[10px]" style={{ color: "var(--mf-text-muted)" }}>Transferência instantânea, sem taxas</p>
            </div>
          </div>

          <div
            className="rounded-xl p-4 flex items-center justify-between"
            style={{ background: "var(--mf-bg)", border: "1px solid var(--mf-border-subtle)" }}
          >
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--mf-text-muted)" }}>Chave Pix (e-mail)</p>
              <p className="text-sm font-mono font-semibold" style={{ color: "var(--mf-text)" }}>{PIX_KEY}</p>
            </div>
          </div>

          <p className="text-[10px] mt-3" style={{ color: "var(--mf-text-muted)" }}>
            Qualquer valor é bem-vindo. R$5, R$10, R$50 — o que couber no seu coração.
          </p>
        </div>

        {/* GitHub Sponsors */}
        <div
          className="rounded-2xl p-8 mb-12"
          style={{ background: "var(--mf-surface)", border: "1px solid var(--mf-border-subtle)" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(45,106,79,0.08)", color: "var(--forest)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/></svg>
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: "var(--mf-text)" }}>GitHub Sponsors</h3>
              <p className="text-[10px]" style={{ color: "var(--mf-text-muted)" }}>Apoio recorrente via GitHub</p>
            </div>
          </div>
          <a
            href="https://github.com/sponsors/wilderamorim"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:opacity-80 active:scale-[0.98]"
            style={{ background: "rgba(45,106,79,0.08)", color: "var(--forest)" }}
          >
            Apoiar no GitHub
          </a>
        </div>

        {/* Transparency */}
        <div className="text-center">
          <h3 className="text-sm font-bold mb-2" style={{ color: "var(--mf-text)" }}>Transparência total</h3>
          <p className="text-xs leading-relaxed max-w-md mx-auto" style={{ color: "var(--mf-text-muted)" }}>
            Todo o código é aberto. Você pode ver exatamente como o dinheiro é usado: servidor, domínio e infraestrutura. Nenhum centavo vai para anúncios ou marketing pago. O +Fortes cresce por quem usa e recomenda.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
