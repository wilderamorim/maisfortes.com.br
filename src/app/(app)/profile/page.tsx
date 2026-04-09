"use client";

import { useTheme } from "@/components/layout/ThemeProvider";
import { Trophy, Settings, Moon, Sun, LogOut, ChevronRight } from "lucide-react";

export default function ProfilePage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      {/* Avatar + Name */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
          style={{ background: "rgba(45,106,79,0.1)", color: "var(--forest)", fontFamily: "var(--font-display)" }}
        >
          W
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
            Wilder
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Membro desde abril 2026
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: "Check-ins", value: "0" },
          { label: "Melhor streak", value: "0" },
          { label: "Conquistas", value: "0/13" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-3 text-center"
            style={{ background: "var(--surface)", border: "1px solid var(--border-subtle)" }}
          >
            <p className="text-lg font-bold font-mono" style={{ color: "var(--forest)" }}>{stat.value}</p>
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Menu items */}
      <div className="space-y-1">
        {[
          { icon: Trophy, label: "Conquistas", href: "/achievements" },
          { icon: Settings, label: "Configurações", href: "#" },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
            style={{ color: "var(--text)" }}
          >
            <item.icon className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
            <span className="flex-1 text-sm font-medium">{item.label}</span>
            <ChevronRight className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
          </a>
        ))}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full text-left"
          style={{ color: "var(--text)" }}
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
          ) : (
            <Sun className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
          )}
          <span className="flex-1 text-sm font-medium">
            {theme === "light" ? "Modo escuro" : "Modo claro"}
          </span>
          <div
            className="w-10 h-6 rounded-full relative transition-colors"
            style={{ background: theme === "dark" ? "var(--forest)" : "var(--border)" }}
          >
            <div
              className="w-4 h-4 rounded-full bg-white absolute top-1 transition-all"
              style={{ left: theme === "dark" ? "22px" : "4px" }}
            />
          </div>
        </button>

        {/* Logout */}
        <button
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full text-left"
          style={{ color: "var(--danger)" }}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </div>
  );
}
