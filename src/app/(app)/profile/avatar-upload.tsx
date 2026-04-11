"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Camera } from "lucide-react";

export function AvatarUpload({ name, currentUrl }: { name: string; currentUrl: string | null }) {
  const [avatarUrl, setAvatarUrl] = useState(currentUrl);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) return;

    setUploading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setUploading(false); return; }

    const ext = file.name.split(".").pop();
    const path = `avatars/${user.id}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(path);

    const url = `${publicUrl}?t=${Date.now()}`;
    await supabase
      .from("users")
      .update({ avatar_url: url })
      .eq("id", user.id);

    setAvatarUrl(url);
    setUploading(false);
    if (navigator.vibrate) navigator.vibrate(30);
  }

  return (
    <button
      onClick={() => inputRef.current?.click()}
      disabled={uploading}
      className="relative"
    >
      {/* Avatar circle */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold overflow-hidden"
        style={{ background: "rgba(45,106,79,0.1)", color: "var(--forest)", fontFamily: "var(--font-display)" }}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          name[0]?.toUpperCase()
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
            <div
              className="w-5 h-5 rounded-full border-2 animate-spin"
              style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }}
            />
          </div>
        )}
      </div>

      {/* Camera badge — outside overflow-hidden */}
      <div
        className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full flex items-center justify-center"
        style={{ background: "var(--forest)", border: "2px solid var(--mf-bg)" }}
      >
        <Camera className="w-3 h-3 text-white" />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </button>
  );
}
