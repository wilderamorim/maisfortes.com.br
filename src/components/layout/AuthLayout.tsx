"use client";

import { type ReactNode } from "react";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex" style={{ background: "var(--mf-bg)" }}>
      {/* Left: Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden items-center justify-center"
        style={{ background: "var(--forest)" }}
      >
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
            style={{ background: "var(--forest-light)" }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl"
            style={{ background: "var(--coral)", animation: "float 8s ease-in-out infinite" }}
          />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-md px-12 text-white">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-8" style={{ border: "1px solid rgba(255,255,255,0.15)" }}>
            <span className=""><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4" style={{ fontFamily: "var(--font-display)" }}>
            +Forte a cada dia.
          </h1>
          <p className="text-lg opacity-80 leading-relaxed mb-8">
            Registre seu progresso diário, mantenha a constância e conte com quem te apoia. Tudo grátis, tudo privado.
          </p>
          <div className="flex items-center gap-6 text-sm opacity-60">
            <div>
              <span className="text-2xl font-bold font-mono block">13</span>
              <span>conquistas</span>
            </div>
            <div className="w-px h-10" style={{ background: "rgba(255,255,255,0.2)" }} />
            <div>
              <span className="text-2xl font-bold font-mono block">R$0</span>
              <span>sempre grátis</span>
            </div>
            <div className="w-px h-10" style={{ background: "rgba(255,255,255,0.2)" }} />
            <div>
              <span className="text-2xl font-bold font-mono block">100%</span>
              <span>privado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
              style={{ background: "var(--forest)", boxShadow: "var(--mf-shadow-glow)" }}
            >
              <span className="text-white"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
