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
