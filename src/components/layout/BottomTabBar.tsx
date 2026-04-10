"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, CalendarDays, Plus, Users, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/home", icon: Home, label: "Home", isMain: false },
  { href: "/history", icon: CalendarDays, label: "Histórico", isMain: false },
  { href: "/checkin", icon: Plus, label: "Check-in", isMain: true },
  { href: "/network", icon: Users, label: "Rede", isMain: false },
  { href: "/profile", icon: UserCircle, label: "Perfil", isMain: false },
] as const;

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "var(--mf-bg)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto h-16">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          const Icon = tab.icon;

          if (tab.isMain) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex items-center justify-center -mt-4"
              >
                <div className="w-14 h-14 rounded-full bg-forest flex items-center justify-center shadow-glow transition-transform active:scale-95">
                  <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 transition-colors",
                isActive ? "text-forest" : "text-text-muted"
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
