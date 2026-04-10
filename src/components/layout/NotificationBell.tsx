"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function NotificationBell() {
  const [count, setCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchCount() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { count: c } = await supabase
          .from("notifications")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .is("read_at", null);

        setCount((c as number | null) ?? 0);
      } catch {
        // Table might not exist yet
      }
    }

    fetchCount();
    // Refresh every 30s
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [pathname]);

  return (
    <Link
      href="/notifications"
      className="relative p-2 rounded-xl transition-all active:scale-95"
      style={{ color: count > 0 ? "var(--forest)" : "var(--mf-text-muted)" }}
    >
      <Bell className="w-5 h-5" strokeWidth={count > 0 ? 2.5 : 1.5} />
      {count > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1"
          style={{ background: "var(--danger)" }}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
