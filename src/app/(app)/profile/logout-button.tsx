"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full text-left"
      style={{ color: "var(--danger)" }}
    >
      <LogOut className="w-5 h-5" />
      <span className="text-sm font-medium">Sair</span>
    </button>
  );
}
