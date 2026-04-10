"use server";

import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/ensure-profile";
import { revalidatePath } from "next/cache";

export async function createGoal(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  await ensureProfile(supabase, user);

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

  const { data: goals } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .in("status", ["active", "paused"])
    .order("order");

  if (!goals) return [];

  // Recalculate streaks from actual checkin data (fixes stale values)
  for (const goal of goals) {
    const { data: checkins } = await supabase
      .from("checkins")
      .select("date")
      .eq("goal_id", goal.id)
      .order("date", { ascending: false })
      .limit(400);

    if (!checkins || checkins.length === 0) {
      if (goal.current_streak !== 0) {
        await supabase.from("goals").update({ current_streak: 0 }).eq("id", goal.id);
        goal.current_streak = 0;
      }
      continue;
    }

    let streak = 1;
    const dates = checkins.map((c) => c.date).sort().reverse();
    for (let i = 1; i < dates.length; i++) {
      const curr = new Date(dates[i - 1] + "T12:00:00");
      const prev = new Date(dates[i] + "T12:00:00");
      if (Math.round((curr.getTime() - prev.getTime()) / 86400000) === 1) {
        streak++;
      } else {
        break;
      }
    }

    if (goal.current_streak !== streak) {
      const best = Math.max(goal.best_streak, streak);
      await supabase.from("goals").update({ current_streak: streak, best_streak: best }).eq("id", goal.id);
      goal.current_streak = streak;
      goal.best_streak = best;
    }
  }

  return goals;
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
