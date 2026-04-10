"use server";

import { createClient } from "@/lib/supabase/server";

export type NotificationType =
  | "checkin_reminder"
  | "streak_milestone"
  | "achievement_unlocked"
  | "supporter_joined"
  | "supporter_message"
  | "supporter_reaction"
  | "inactivity_alert"
  | "weekly_summary"
  | "friend_streak_broken";

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  icon?: string;
  link?: string;
  read_at: string | null;
  created_at: string;
}

// Note: requires notifications table - see schema below
// CREATE TABLE public.notifications (
//   id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
//   user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
//   type text NOT NULL,
//   title text NOT NULL,
//   body text NOT NULL,
//   icon text,
//   link text,
//   read_at timestamptz,
//   created_at timestamptz NOT NULL DEFAULT now()
// );
// CREATE INDEX idx_notifications_user ON public.notifications(user_id);
// ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Users see own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

export async function getNotifications(limit = 20) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as AppNotification[];
}

export async function getUnreadNotificationCount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .is("read_at", null);

  return (count as number | null) ?? 0;
}

export async function markNotificationsRead(ids: string[]) {
  const supabase = await createClient();
  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .in("id", ids)
    .is("read_at", null);
}

export async function markAllNotificationsRead() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .is("read_at", null);
}

export async function createNotification(data: {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  icon?: string;
  link?: string;
}) {
  const supabase = await createClient();
  await supabase.from("notifications").insert({
    user_id: data.userId,
    type: data.type,
    title: data.title,
    body: data.body,
    icon: data.icon,
    link: data.link,
  });
}
