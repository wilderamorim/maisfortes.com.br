"use server";

import { createClient } from "@/lib/supabase/server";
import { sendPush } from "@/lib/web-push";
import { sendEmail } from "@/lib/email";
import {
  dailyReminderEmail,
  inactivityAlertEmail,
  weeklyReportEmail,
  difficultDayAlertEmail,
} from "@/lib/email-templates";

const ADMIN_EMAILS = ["wilderamorim@msn.com"];

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { data: profile } = await supabase
    .from("users")
    .select("email, name")
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
    return { success: false, error: "Push não ativado. Use o botão Re-registrar primeiro." };
  }

  const result = await sendPush(profile.push_subscription, {
    title: "+Fortes — Teste",
    body: "Push notification funcionando! 🎉",
    url: "/admin",
  });

  return result;
}

export async function testEmailTemplate(template: string) {
  const { profile } = await requireAdmin();
  const name = profile.name || profile.email.split("@")[0];

  let subject = "";
  let html = "";

  switch (template) {
    case "daily-reminder":
      subject = "[TESTE] Lembrete diário";
      html = dailyReminderEmail(name);
      break;
    case "inactivity-alert":
      subject = "[TESTE] Alerta de inatividade";
      html = inactivityAlertEmail(name, "João (teste)", 3);
      break;
    case "weekly-report":
      subject = "[TESTE] Resumo semanal 💪";
      html = weeklyReportEmail(name, 5, 3.8, 12, 2);
      break;
    case "difficult-day":
      subject = "[TESTE] Dia difícil";
      html = difficultDayAlertEmail(name, "Maria (teste)");
      break;
    default:
      return { success: false, error: "Template desconhecido" };
  }

  const result = await sendEmail({
    to: profile.email,
    subject,
    html,
  });

  return result;
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
