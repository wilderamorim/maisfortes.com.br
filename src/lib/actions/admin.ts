"use server";

import { createClient } from "@/lib/supabase/server";
import { sendPush } from "@/lib/web-push";
import { sendEmail } from "@/lib/email";
import { dailyReminderEmail } from "@/lib/email-templates";

const ADMIN_EMAILS = ["wilderamorim@msn.com"];

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { data: profile } = await supabase
    .from("users")
    .select("email")
    .eq("id", user.id)
    .single();

  if (!profile || !ADMIN_EMAILS.includes(profile.email)) {
    throw new Error("Acesso negado");
  }

  return { user, profile, supabase };
}

export async function testPushNotification() {
  const { user, supabase } = await requireAdmin();

  const { data: profile } = await supabase
    .from("users")
    .select("push_subscription")
    .eq("id", user.id)
    .single();

  if (!profile?.push_subscription) {
    return { success: false, error: "Push não ativado. Ative nas configurações do navegador." };
  }

  const result = await sendPush(profile.push_subscription, {
    title: "+Fortes — Teste",
    body: "Push notification funcionando! 🎉",
    url: "/admin",
  });

  return result;
}

export async function testEmailNotification() {
  const { profile } = await requireAdmin();

  const result = await sendEmail({
    to: profile.email,
    subject: "+Fortes — Teste de email",
    html: dailyReminderEmail(profile.email.split("@")[0]),
  });

  return result;
}

export async function triggerCron(cronName: string) {
  await requireAdmin();

  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return { success: false, error: "CRON_SECRET não configurado" };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/cron/${cronName}`, {
      headers: { authorization: `Bearer ${cronSecret}` },
    });
    const data = await res.json();
    return { success: res.ok, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro ao executar cron" };
  }
}

export async function getAdminStats() {
  const { supabase } = await requireAdmin();

  const [users, goals, checkins, supporters, friendStreaks, notifications] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("goals").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("checkins").select("*", { count: "exact", head: true }),
    supabase.from("supporters").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("friend_streaks").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("notifications").select("*", { count: "exact", head: true }),
  ]);

  return {
    users: (users.count as number | null) ?? 0,
    activeGoals: (goals.count as number | null) ?? 0,
    totalCheckins: (checkins.count as number | null) ?? 0,
    activeSupporters: (supporters.count as number | null) ?? 0,
    activeFriendStreaks: (friendStreaks.count as number | null) ?? 0,
    totalNotifications: (notifications.count as number | null) ?? 0,
  };
}

export async function isAdmin() {
  try {
    await requireAdmin();
    return true;
  } catch {
    return false;
  }
}
