"use client";

import { useState, useEffect } from "react";
import { isAdmin } from "@/lib/actions/admin";
import { Settings, ChevronRight } from "lucide-react";
import Link from "next/link";

export function AdminLink() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    isAdmin().then(setShow);
  }, []);

  if (!show) return null;

  return (
    <Link
      href="/admin"
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
      style={{ color: "var(--mf-text)" }}
    >
      <Settings className="w-5 h-5" style={{ color: "var(--forest)" }} />
      <span className="flex-1 text-sm font-medium">Admin</span>
      <ChevronRight className="w-4 h-4" style={{ color: "var(--mf-text-muted)" }} />
    </Link>
  );
}
