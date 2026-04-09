"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function sendMessage(data: {
  goalId: string;
  toUserId: string;
  content: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { error } = await supabase.from("messages").insert({
    goal_id: data.goalId,
    from_user_id: user.id,
    to_user_id: data.toUserId,
    content: data.content.slice(0, 500),
    type: "message",
  });

  if (error) throw new Error(error.message);

  // Check confidant achievement (10 messages sent as supporter)
  const { count } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("from_user_id", user.id)
    .eq("type", "message");

  if (((count as number | null) ?? 0) >= 10) {
    await supabase.from("user_achievements").upsert(
      { user_id: user.id, achievement_id: "confidant", goal_id: null },
      { onConflict: "user_id,achievement_id,goal_id" }
    );
  }

  revalidatePath("/network");
  revalidatePath("/home");
}

export async function sendReaction(data: {
  goalId: string;
  toUserId: string;
  emoji: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { error } = await supabase.from("messages").insert({
    goal_id: data.goalId,
    from_user_id: user.id,
    to_user_id: data.toUserId,
    content: data.emoji,
    type: "reaction",
    reaction_emoji: data.emoji,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/home");
}

export async function getMessagesForUser(limit = 20) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("messages")
    .select("*, from_user:users!messages_from_user_id_fkey(name, avatar_url)")
    .eq("to_user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export async function markMessagesAsRead(messageIds: string[]) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .in("id", messageIds)
    .is("read_at", null);

  if (error) throw new Error(error.message);
}

export async function getUnreadCount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("to_user_id", user.id)
    .is("read_at", null);

  return (count as number | null) ?? 0;
}
