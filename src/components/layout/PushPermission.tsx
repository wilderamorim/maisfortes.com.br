"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function PushPermission() {
  const [asked, setAsked] = useState(false);

  useEffect(() => {
    if (asked) return;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;
    if (Notification.permission !== "default") return;
    if (sessionStorage.getItem("mf_push_asked")) return;

    // Ask after 10s of app usage
    const timer = setTimeout(async () => {
      setAsked(true);
      sessionStorage.setItem("mf_push_asked", "1");

      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        try {
          const reg = await navigator.serviceWorker.ready;
          const sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
          });

          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from("users").update({
              push_subscription: sub.toJSON(),
            }).eq("id", user.id);
          }
        } catch {
          // Push subscription failed — silent
        }
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [asked]);

  return null;
}
