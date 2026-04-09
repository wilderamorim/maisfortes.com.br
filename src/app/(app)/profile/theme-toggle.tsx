"use client";

import { useTheme } from "@/components/layout/ThemeProvider";
import { Moon, Sun } from "lucide-react";

export function ThemeToggleRow() {
  const { theme, toggleTheme } = useTheme();

  return (
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
          className="w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-200"
          style={{ left: theme === "dark" ? "22px" : "4px" }}
        />
      </div>
    </button>
  );
}
