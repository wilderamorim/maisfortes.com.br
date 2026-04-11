"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Mood } from "@/lib/types";

export async function createCheckin(data: {
  goalId: string;
  score: number;
  mood: Mood;
  note?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const today = new Date().toISOString().split("T")[0];

  // Check if already checked in today for this goal
  const { data: existing } = await supabase
    .from("checkins")
    .select("id")
    .eq("goal_id", data.goalId)
    .eq("date", today)
    .single();

  if (existing) {
    // Update existing check-in
    const { error } = await supabase
      .from("checkins")
      .update({
        score: data.score,
        mood: data.mood,
        note: data.note || null,
      })
      .eq("id", existing.id);

    if (error) throw new Error(error.message);
  } else {
    // Insert new check-in
    const { error } = await supabase.from("checkins").insert({
      goal_id: data.goalId,
      date: today,
      score: data.score,
      mood: data.mood,
      note: data.note || null,
    });

    if (error) throw new Error(error.message);
  }

  // Update streak
  await updateStreak(data.goalId);

  // Check achievements
  await checkAchievements(user.id, data.goalId, data.score);

  revalidatePath("/home");
  revalidatePath("/history");
  revalidatePath("/checkin");
}

async function updateStreak(goalId: string) {
  const supabase = await createClient();

  // Get recent checkins ordered by date desc
  const { data: checkins } = await supabase
    .from("checkins")
    .select("date")
    .eq("goal_id", goalId)
    .order("date", { ascending: false })
    .limit(400);

  if (!checkins || checkins.length === 0) {
    await supabase.from("goals").update({ current_streak: 0, last_checkin_date: null }).eq("id", goalId);
    return;
  }

  // Calculate streak: count consecutive days from most recent check-in
  let streak = 1; // The most recent check-in counts as 1
  const dates = checkins.map((c) => c.date).sort().reverse();

  // Check consecutive days backwards from most recent
  for (let i = 1; i < dates.length; i++) {
    const current = new Date(dates[i - 1] + "T12:00:00");
    const prev = new Date(dates[i] + "T12:00:00");
    const diffDays = Math.round((current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  // Update goal
  const { data: goal } = await supabase
    .from("goals")
    .select("best_streak")
    .eq("id", goalId)
    .single();

  const bestStreak = Math.max(goal?.best_streak ?? 0, streak);

  await supabase
    .from("goals")
    .update({
      current_streak: streak,
      best_streak: bestStreak,
      last_checkin_date: checkins[0].date,
    })
    .eq("id", goalId);
}

async function checkAchievements(userId: string, goalId: string, score: number) {
  const supabase = await createClient();

  // Get current state
  const { data: goal } = await supabase
    .from("goals")
    .select("current_streak")
    .eq("id", goalId)
    .single();

  const { count: checkinCount } = await supabase
    .from("checkins")
    .select("*", { count: "exact", head: true })
    .eq("goal_id", goalId);

  const { data: existingAchievements } = await supabase
    .from("user_achievements")
    .select("achievement_id")
    .eq("user_id", userId);

  const unlocked = new Set(existingAchievements?.map((a) => a.achievement_id) ?? []);
  const toUnlock: { achievement_id: string; goal_id: string | null }[] = [];

  const streak = goal?.current_streak ?? 0;
  const totalCheckins = (checkinCount as number | null) ?? 0;

  // Streak achievements
  const streakAchievements = [
    { id: "week-streak", value: 7 },
    { id: "fortnight-streak", value: 14 },
    { id: "month-streak", value: 30 },
    { id: "quarter-streak", value: 90 },
    { id: "semester-streak", value: 180 },
    { id: "year-streak", value: 365 },
  ];

  for (const sa of streakAchievements) {
    if (streak >= sa.value && !unlocked.has(sa.id)) {
      toUnlock.push({ achievement_id: sa.id, goal_id: goalId });
    }
  }

  // First checkin
  if (totalCheckins >= 1 && !unlocked.has("first-checkin")) {
    toUnlock.push({ achievement_id: "first-checkin", goal_id: goalId });
  }

  // High score consistency
  if (score >= 4 && !unlocked.has("consistency")) {
    const { count: highScoreCount } = await supabase
      .from("checkins")
      .select("*", { count: "exact", head: true })
      .eq("goal_id", goalId)
      .gte("score", 4);

    if ((highScoreCount ?? 0) >= 30) {
      toUnlock.push({ achievement_id: "consistency", goal_id: goalId });
    }
  }

  // Multi-journey
  if (!unlocked.has("multi-journey")) {
    const { count: activeGoals } = await supabase
      .from("goals")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "active");

    if ((activeGoals ?? 0) >= 2) {
      toUnlock.push({ achievement_id: "multi-journey", goal_id: null });
    }
  }

  // Insert new achievements
  if (toUnlock.length > 0) {
    await supabase.from("user_achievements").insert(
      toUnlock.map((a) => ({
        user_id: userId,
        achievement_id: a.achievement_id,
        goal_id: a.goal_id,
      }))
    );
  }
}

export async function getCheckinsByGoal(goalId: string, limit = 30) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("checkins")
    .select("*")
    .eq("goal_id", goalId)
    .order("date", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export async function getGoalsForCheckin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { pending: [], done: [] };

  const today = new Date().toISOString().split("T")[0];

  const { data: goals } = await supabase
    .from("goals")
    .select("id, title, current_streak")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("order");

  if (!goals || goals.length === 0) return { pending: [], done: [] };

  const { data: todayCheckins } = await supabase
    .from("checkins")
    .select("goal_id")
    .in("goal_id", goals.map((g) => g.id))
    .eq("date", today);

  const checkedIds = new Set(todayCheckins?.map((c) => c.goal_id) ?? []);

  return {
    pending: goals.filter((g) => !checkedIds.has(g.id)),
    done: goals.filter((g) => checkedIds.has(g.id)),
  };
}

export async function getTodayCheckins() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("checkins")
    .select("*, goals!inner(user_id, title)")
    .eq("goals.user_id", user.id)
    .eq("date", today);

  return data ?? [];
}
