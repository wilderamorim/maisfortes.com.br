import Link from "next/link";
import { Flame, Users, Shield, Bell, MessageCircle, Trophy, CheckCircle, ArrowRight } from "lucide-react";
import { AppMockup } from "./app-mockup";
import { ScrollReveal } from "./scroll-reveal";

export const metadata = {
  title: "+Fortes — Juntos, somos mais fortes",
  description: "Plataforma gratuita de acompanhamento com rede de apoio. Check-in diário, streak, conquistas — ninguém muda sozinho.",
};

const features = [
  { icon: CheckCircle, title: "Check-in diário", desc: "Registre como foi seu dia em segundos." },
  { icon: Flame, title: "Streak", desc: "Acompanhe sua sequência. Cada dia conta." },
  { icon: Users, title: "Rede de apoio", desc: "Convide quem te apoia. Opcional e privado." },
  { icon: Bell, title: "Alertas", desc: "Sua rede sabe se você precisa de apoio." },
  { icon: Shield, title: "Privacidade total", desc: "Você controla quem vê o quê." },
  { icon: Trophy, title: "Conquistas", desc: "Desbloqueie troféus à medida que evolui." },
];

const steps = [
  { num: "01", title: "Crie sua meta", desc: "Defina o que quer mudar — dieta, vício, hábito." },
  { num: "02", title: "Faça check-in diário", desc: "Score de 1 a 5 + nota opcional. Leva 10 segundos." },
  { num: "03", title: "Convide quem te apoia", desc: "Família, amigos — opcional, quando você quiser." },
  { num: "04", title: "Evolua acompanhado", desc: "Streak, conquistas e sua rede torcendo por você." },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh" style={{ background: "var(--bg)" }}>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ background: "color-mix(in srgb, var(--bg) 85%, transparent)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: "var(--forest)" }}>+</div>
            <span className="font-bold text-sm" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>Fortes</span>
          </div>
          <Link
            href="/auth/register"
            className="px-4 py-2 rounded-lg text-white text-xs font-semibold transition-all active:scale-95"
            style={{ background: "var(--forest)" }}
          >
            Começar
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-60" style={{ background: "radial-gradient(ellipse, rgba(45,106,79,0.08) 0%, transparent 70%)", animation: "float 8s ease-in-out infinite" }} />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[200px] rounded-full opacity-40" style={{ background: "radial-gradient(ellipse, rgba(244,132,95,0.06) 0%, transparent 70%)", animation: "float 10s ease-in-out 2s infinite" }} />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, var(--text-muted) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mb-6" style={{ background: "rgba(45,106,79,0.1)", color: "var(--forest)" }}>
                Gratuito e open-source
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
                Ninguém muda{" "}
                <span style={{ background: "linear-gradient(90deg, var(--forest), var(--forest-light))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  sozinho
                </span>
              </h1>
              <p className="text-lg mb-8 max-w-lg" style={{ color: "var(--text-secondary)" }}>
                +Fortes conecta quem está mudando um comportamento com quem apoia. Check-in diário, streak, conquistas e rede de apoio — tudo grátis.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/auth/register"
                  className="px-8 py-3.5 rounded-xl text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  style={{ background: "var(--forest)", boxShadow: "var(--shadow-glow)" }}
                >
                  Comece sua jornada <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#como-funciona"
                  className="px-8 py-3.5 rounded-xl font-semibold text-sm inline-flex items-center justify-center transition-all"
                  style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                >
                  Como funciona
                </a>
              </div>
            </div>

            {/* Right: App Mockup */}
            <div className="hidden lg:block">
              <AppMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
                Tudo que você precisa
              </h2>
              <p style={{ color: "var(--text-muted)" }}>Simples, privado e gratuito.</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 100}>
                <div
                  className="rounded-xl p-6 transition-all hover:shadow-md"
                  style={{ background: "var(--bg)", border: "1px solid var(--border-subtle)" }}
                >
                  <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center" style={{ background: "rgba(45,106,79,0.1)" }}>
                    <f.icon className="w-5 h-5" style={{ color: "var(--forest)" }} />
                  </div>
                  <h3 className="font-semibold mb-1" style={{ color: "var(--text)" }}>{f.title}</h3>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
                Como funciona
              </h2>
              <p style={{ color: "var(--text-muted)" }}>4 passos. 30 segundos.</p>
            </div>
          </ScrollReveal>
          <div className="space-y-6">
            {steps.map((s, i) => (
              <ScrollReveal key={s.num} delay={i * 150}>
                <div className="flex gap-4 items-start">
                  <span className="font-mono text-2xl font-bold shrink-0 w-12" style={{ color: "var(--forest)" }}>{s.num}</span>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: "var(--text)" }}>{s.title}</h3>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
              Ninguém muda sozinho.
            </h2>
            <p className="text-lg mb-8" style={{ color: "var(--text-muted)" }}>
              Comece sua jornada e convide quem te apoia. É grátis, sempre.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold transition-all active:scale-[0.98]"
              style={{ background: "var(--forest)", boxShadow: "var(--shadow-glow)" }}
            >
              Comece agora — é grátis <ArrowRight className="w-5 h-5" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold" style={{ background: "var(--forest)" }}>+</div>
            <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>+Fortes — Juntos, somos mais fortes</span>
          </div>
          <div className="flex gap-4">
            <a href="https://github.com/wilderamorim/maisfortes.com.br" target="_blank" rel="noopener" className="text-xs" style={{ color: "var(--text-muted)" }}>GitHub</a>
            <a href="https://brand.maisfortes.com.br" target="_blank" rel="noopener" className="text-xs" style={{ color: "var(--text-muted)" }}>Brandbook</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
