"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function PasswordInput({
  value,
  onChange,
  placeholder = "••••••••",
  autoComplete = "current-password",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl px-4 py-3 pr-10 text-sm outline-none transition-all focus:ring-2"
        style={{
          background: "var(--mf-surface)",
          border: "1px solid var(--mf-border)",
          color: "var(--mf-text)",
        }}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 transition-opacity hover:opacity-70"
        style={{ color: "var(--mf-text-muted)" }}
        tabIndex={-1}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}
