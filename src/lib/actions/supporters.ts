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
  const { data: supporter, error: findError } = await supabase
    .from("supporters")
    .select("*, goals!inner(user_id, title)")
    .eq("invite_code", inviteCode)
    .eq("status", "pending")
    .single();

  if (findError || !supporter) throw new Error("Convite não encontrado ou já utilizado");

  // Can't support your own goal
  if ((supporter as Record<string, unknown>).goals && ((supporter as Record<string, unknown>).goals as Record<string, unknown>).user_id === user.id) {
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

  // Check achievements for goal owner
  await checkSupporterAchievements((supporter as Record<string, unknown>).goals as Record<string, unknown>);

  revalidatePath("/network");
  return supporter;
}

async function checkSupporterAchievements(goal: Record<string, unknown>) {
  const supabase = await createClient();
  const userId = goal.user_id as string;

  const { count } = await supabase
    .from("supporters")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")
    .in("goal_id", (
      await supabase.from("goals").select("id").eq("user_id", userId)
    ).data?.map((g) => g.id) ?? []);

  const total = (count as number | null) ?? 0;

  // Not alone achievement
  if (total >= 1) {
    await supabase.from("user_achievements").upsert(
      { user_id: userId, achievement_id: "not-alone", goal_id: null },
      { onConflict: "user_id,achievement_id,goal_id" }
    );
  }

  // Strong network
  if (total >= 3) {
    await supabase.from("user_achievements").upsert(
      { user_id: userId, achievement_id: "strong-network", goal_id: null },
      { onConflict: "user_id,achievement_id,goal_id" }
    );
  }
}

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

export async function updateSupporterPrivacy(supporterId: string, canSeeScore: boolean, canSeeNotes: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("supporters")
    .update({ can_see_score: canSeeScore, can_see_notes: canSeeNotes })
    .eq("id", supporterId);

  if (error) throw new Error(error.message);
  revalidatePath("/network");
}
