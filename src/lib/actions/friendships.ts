"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addFriend(friendId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");
  if (user.id === friendId) throw new Error("Você não pode ser amigo de si mesmo");

  const { error } = await supabase.from("friendships").insert({
    user_id: user.id,
    friend_id: friendId,
    status: "active",
  });

  if (error) {
    if (error.code === "23505") return; // Already friends
    throw new Error(error.message);
  }

  revalidatePath("/network");
}

export async function getFriendsWithStreaks() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Get friends
  const { data: friendships } = await supabase
    .from("friendships")
    .select("friend_id, users!friendships_friend_id_fkey(id, name, avatar_url)")
    .eq("user_id", user.id)
    .eq("status", "active");

  if (!friendships || friendships.length === 0) return [];

  // Get best active streak for each friend
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const friendIds = friendships.map((f) => (f.users as any)?.id as string).filter(Boolean);

  const { data: goals } = await supabase
    .from("goals")
    .select("user_id, current_streak")
    .in("user_id", friendIds)
    .eq("status", "active")
    .order("current_streak", { ascending: false });

  // Group by user, take best streak
  const streakMap = new Map<string, number>();
  for (const g of goals ?? []) {
    if (!streakMap.has(g.user_id)) {
      streakMap.set(g.user_id, g.current_streak);
    }
  }

  return friendships.map((f) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const friend = f.users as any;
    return {
      id: friend?.id as string,
      name: friend?.name as string,
      avatar_url: friend?.avatar_url as string | null,
      best_streak: streakMap.get(friend?.id as string) ?? 0,
    };
  }).sort((a, b) => b.best_streak - a.best_streak);
}

export async function removeFriend(friendId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  await supabase
    .from("friendships")
    .update({ status: "removed" })
    .or(`and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`);

  revalidatePath("/network");
}
