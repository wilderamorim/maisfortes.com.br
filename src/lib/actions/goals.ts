"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createGoal(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;

  // Get next order
  const { count } = await supabase
    .from("goals")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { error } = await supabase.from("goals").insert({
    user_id: user.id,
    title,
    description: description || null,
    order: (count ?? 0),
  });

  if (error) throw new Error(error.message);
  revalidatePath("/home");
}

export async function updateGoalStatus(goalId: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("goals")
    .update({ status })
    .eq("id", goalId);

  if (error) throw new Error(error.message);
  revalidatePath("/home");
}

export async function getActiveGoals() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .in("status", ["active", "paused"])
    .order("order");

  return data ?? [];
}

export async function getAllGoals() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .order("order");

  return data ?? [];
}
