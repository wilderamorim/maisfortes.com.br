"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createInvite(goalId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  // Reuse existing pending invite (no user_id = not yet accepted)
  const { data: existing } = await supabase
    .from("supporters")
    .select("invite_code")
    .eq("goal_id", goalId)
    .eq("status", "pending")
    .is("user_id", null)
    .limit(1)
    .single();

  if (existing) return existing.invite_code;

  // Check active supporter limit (RN-06: max 5 per goal)
  const { count } = await supabase
    .from("supporters")
    .select("*", { count: "exact", head: true })
    .eq("goal_id", goalId)
    .eq("status", "active");

  if ((count ?? 0) >= 5) {
    throw new Error("Máximo de 5 apoiadores por meta");
  }

  const { data, error } = await supabase
    .from("supporters")
    .insert({ goal_id: goalId })
    .select("invite_code")
    .single();

  if (error) throw new Error(error.message);
  return data.invite_code;
}

export async function acceptInvite(inviteCode: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  // Find the invite
  const { data: supporter } = await supabase
    .from("supporters")
    .select("id, goal_id, status, user_id, invite_code")
    .eq("invite_code", inviteCode)
    .single();

  if (!supporter) throw new Error("Convite não encontrado. Verifique o link.");
  if (supporter.status === "active") {
    if (supporter.user_id === user.id) {
      throw new Error("Você já aceitou este convite.");
    }
    throw new Error("Este convite já foi aceito por outra pessoa.");
  }
  if (supporter.status === "removed") throw new Error("Este convite foi cancelado.");
  if (supporter.status !== "pending") throw new Error("Convite não disponível.");

  // Check if this is user's own goal (query own goals — RLS allows this)
  const { data: ownGoal } = await supabase
    .from("goals")
    .select("id")
    .eq("id", supporter.goal_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (ownGoal) {
    throw new Error("Você não pode ser apoiador da própria meta");
  }

  // Accept
  const { error } = await supabase
    .from("supporters")
    .update({
      user_id: user.id,
      status: "active",
      accepted_at: new Date().toISOString(),
    })
    .eq("id", supporter.id);

  if (error) throw new Error(error.message);

  // Note: supporter achievements (not-alone, strong-network) are checked
  // when the goal owner loads their home page via checkAchievements in checkins.ts

  revalidatePath("/network");
  return supporter;
}

// Achievement check is deferred — runs when the goal owner loads their home page
// This avoids RLS issues since the accepting user can't read the goal owner's data

export async function removeSupporter(supporterId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("supporters")
    .update({ status: "removed" })
    .eq("id", supporterId);

  if (error) throw new Error(error.message);
  revalidatePath("/network");
}

export async function getSupportersForGoal(goalId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("supporters")
    .select("*, users(name, avatar_url)")
    .eq("goal_id", goalId)
    .eq("status", "active")
    .not("user_id", "is", null)
    .order("invited_at");

  return data ?? [];
}

export async function getGoalsISupport() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("supporters")
    .select("*, goals(*, users(name, avatar_url)), users!supporters_user_id_fkey(name)")
    .eq("user_id", user.id)
    .eq("status", "active");

  return data ?? [];
}

export async function getSupportedGoalDetail(supporterId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Get supporter record (must be the supporter)
  const { data: supporter } = await supabase
    .from("supporters")
    .select("*, goals(id, title, current_streak, best_streak, status, user_id, users(name, avatar_url))")
    .eq("id", supporterId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (!supporter) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const goal = supporter.goals as any;

  // Get checkins based on permissions
  let checkins: { date: string; score: number; mood: string; note: string | null }[] = [];
  if (supporter.can_see_score) {
    const { data } = await supabase
      .from("checkins")
      .select("date, score, mood, note")
      .eq("goal_id", goal.id)
      .order("date", { ascending: false })
      .limit(400);

    checkins = (data ?? []).map((c) => ({
      date: c.date,
      score: c.score,
      mood: c.mood,
      note: supporter.can_see_notes ? c.note : null,
    }));
  }

  return {
    supporter_id: supporter.id,
    can_see_score: supporter.can_see_score,
    can_see_notes: supporter.can_see_notes,
    goal: {
      id: goal.id,
      title: goal.title,
      current_streak: goal.current_streak,
      best_streak: goal.best_streak,
    },
    owner: {
      name: goal.users?.name ?? "",
      avatar_url: goal.users?.avatar_url ?? null,
    },
    checkins,
  };
}

export async function updateSupporterPrivacy(supporterId: string, canSeeScore: boolean, canSeeNotes: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("supporters")
    .update({ can_see_score: canSeeScore, can_see_notes: canSeeNotes })
    .eq("id", supporterId);

  if (error) throw new Error(error.message);
  revalidatePath("/network");
}
