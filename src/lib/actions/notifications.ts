"use server";

import { createClient } from "@/lib/supabase/server";

export async function savePushSubscription(subscription: Record<string, unknown>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  await supabase
    .from("users")
    .update({ push_subscription: subscription })
    .eq("id", user.id);
}

export async function getWeeklySummary(goalId: string) {
  const supabase = await createClient();

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const startDate = oneWeekAgo.toISOString().split("T")[0];

  const { data: checkins } = await supabase
    .from("checkins")
    .select("score, date, mood")
    .eq("goal_id", goalId)
    .gte("date", startDate)
    .order("date");

  if (!checkins || checkins.length === 0) {
    return null;
  }

  const totalCheckins = checkins.length;
  const avgScore = checkins.reduce((sum, c) => sum + c.score, 0) / totalCheckins;
  const moodCounts: Record<string, number> = {};
  for (const c of checkins) {
    moodCounts[c.mood] = (moodCounts[c.mood] || 0) + 1;
  }
  const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "neutral";

  const { data: goal } = await supabase
    .from("goals")
    .select("current_streak, title")
    .eq("id", goalId)
    .single();

  return {
    goalTitle: goal?.title ?? "",
    totalCheckins,
    possibleCheckins: 7,
    avgScore: Math.round(avgScore * 10) / 10,
    currentStreak: goal?.current_streak ?? 0,
    dominantMood,
    checkins,
  };
}

export async function getAllWeeklySummaries() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: goals } = await supabase
    .from("goals")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "active");

  if (!goals) return [];

  const summaries = await Promise.all(
    goals.map((g) => getWeeklySummary(g.id))
  );

  return summaries.filter(Boolean);
}
