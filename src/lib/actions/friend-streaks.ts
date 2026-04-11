"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createNotification } from "./in-app-notifications";

export async function createFriendStreak(data: {
  goalId: string;
  goalVisible: boolean;
  targetDays: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  // Use own id as placeholder for friend_id (updated on accept)
  // RLS allows access since user_id = auth.uid()
  const { data: streak, error } = await supabase
    .from("friend_streaks")
    .insert({
      user_id: user.id,
      user_goal_id: data.goalId,
      user_goal_visible: data.goalVisible,
      target_days: data.targetDays,
      friend_id: user.id,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return streak.id;
}

export async function getFriendStreakInvite(friendStreakId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // The inviter's user_id = friend_id (placeholder), so we query by id only
  // This works because the server action has the service context
  const { data: streak } = await supabase
    .from("friend_streaks")
    .select("id, user_id, target_days, status")
    .eq("id", friendStreakId)
    .single();

  if (!streak || streak.status !== "pending") return null;
  if (streak.user_id === user.id) return { error: "self" };

  // Get inviter name (inviter can see own profile, but we need it from the acceptor's perspective)
  // Since the placeholder friend_id = user_id, the inviter appears in the RLS policy
  const { data: inviter } = await supabase
    .from("users")
    .select("name")
    .eq("id", streak.user_id)
    .single();

  return {
    id: streak.id,
    inviterName: inviter?.name || "Alguém",
    targetDays: streak.target_days,
  };
}

export async function acceptFriendStreak(data: {
  friendStreakId: string;
  goalId: string;
  goalVisible: boolean;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  // Get the streak
  const { data: streak } = await supabase
    .from("friend_streaks")
    .select("*")
    .eq("id", data.friendStreakId)
    .eq("status", "pending")
    .single();

  if (!streak) throw new Error("Convite não encontrado ou já aceito");
  if (streak.user_id === user.id) throw new Error("Você não pode aceitar seu próprio convite");

  // Update friend_streaks with acceptor's data
  const { error } = await supabase
    .from("friend_streaks")
    .update({
      friend_id: user.id,
      friend_goal_id: data.goalId,
      friend_goal_visible: data.goalVisible,
      status: "active",
    })
    .eq("id", data.friendStreakId);

  if (error) throw new Error(error.message);

  // Create bidirectional friendships
  await supabase.from("friendships").upsert(
    { user_id: streak.user_id, friend_id: user.id, status: "active" },
    { onConflict: "user_id,friend_id" }
  );
  await supabase.from("friendships").upsert(
    { user_id: user.id, friend_id: streak.user_id, status: "active" },
    { onConflict: "user_id,friend_id" }
  );

  // Get inviter name for notification
  const { data: inviter } = await supabase
    .from("users")
    .select("name")
    .eq("id", streak.user_id)
    .single();

  const { data: acceptor } = await supabase
    .from("users")
    .select("name")
    .eq("id", user.id)
    .single();

  // Notify inviter
  await createNotification({
    userId: streak.user_id,
    type: "friend_streak_broken", // reusing existing type for friend streak events
    title: "Ofensiva aceita!",
    body: `${acceptor?.name || "Alguém"} aceitou sua ofensiva de ${streak.target_days} dias!`,
    icon: "flame",
    link: "/network",
  });

  revalidatePath("/network");
}

export async function getFriendStreaks() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: streaks } = await supabase
    .from("friend_streaks")
    .select("*")
    .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
    .in("status", ["pending", "active", "completed"])
    .order("created_at", { ascending: false });

  if (!streaks || streaks.length === 0) return [];

  const today = new Date().toISOString().split("T")[0];

  const result = await Promise.all(
    streaks.map(async (s) => {
      const isInviter = s.user_id === user.id;
      const friendId = isInviter ? s.friend_id : s.user_id;
      const myGoalId = isInviter ? s.user_goal_id : s.friend_goal_id;
      const friendGoalId = isInviter ? s.friend_goal_id : s.user_goal_id;
      const myGoalVisible = isInviter ? s.user_goal_visible : s.friend_goal_visible;
      const friendGoalVisible = isInviter ? s.friend_goal_visible : s.user_goal_visible;

      // Get friend info
      const { data: friend } = await supabase
        .from("users")
        .select("id, name, avatar_url")
        .eq("id", friendId)
        .single();

      // Get my goal title
      const { data: myGoal } = myGoalId
        ? await supabase.from("goals").select("title").eq("id", myGoalId).single()
        : { data: null };

      // Get friend goal title
      const { data: friendGoal } = friendGoalId
        ? await supabase.from("goals").select("title").eq("id", friendGoalId).single()
        : { data: null };

      // Check if I did check-in today
      let iCheckedToday = false;
      if (myGoalId) {
        const { count } = await supabase
          .from("checkins")
          .select("*", { count: "exact", head: true })
          .eq("goal_id", myGoalId)
          .eq("date", today);
        iCheckedToday = (count ?? 0) > 0;
      }

      // Check if friend did check-in today
      let friendCheckedToday = false;
      if (friendGoalId) {
        const { count } = await supabase
          .from("checkins")
          .select("*", { count: "exact", head: true })
          .eq("goal_id", friendGoalId)
          .eq("date", today);
        friendCheckedToday = (count ?? 0) > 0;
      }

      return {
        id: s.id,
        friend: {
          id: friend?.id ?? friendId,
          name: friend?.name ?? "",
          avatar_url: friend?.avatar_url ?? null,
        },
        my_goal: {
          title: myGoal?.title ?? "",
          visible: myGoalVisible,
        },
        friend_goal: friendGoalId
          ? { title: friendGoal?.title ?? "", visible: friendGoalVisible }
          : null,
        target_days: s.target_days,
        current_streak: s.current_streak,
        best_streak: s.best_streak,
        i_checked_today: iCheckedToday,
        friend_checked_today: friendCheckedToday,
        status: s.status,
      };
    })
  );

  return result;
}

export async function removeFriendStreak(friendStreakId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  await supabase
    .from("friend_streaks")
    .update({ status: "removed" })
    .eq("id", friendStreakId)
    .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

  revalidatePath("/network");
}

export async function nudgeFriend(friendStreakId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { data: streak } = await supabase
    .from("friend_streaks")
    .select("*")
    .eq("id", friendStreakId)
    .eq("status", "active")
    .single();

  if (!streak) throw new Error("Ofensiva não encontrada");

  const isInviter = streak.user_id === user.id;
  const friendId = isInviter ? streak.friend_id : streak.user_id;

  // Check if already nudged today
  const today = new Date().toISOString().split("T")[0];
  const { count } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", friendId)
    .eq("type", "friend_streak_nudge")
    .gte("created_at", `${today}T00:00:00`);

  if ((count ?? 0) > 0) return; // Already nudged today

  const { data: me } = await supabase
    .from("users")
    .select("name")
    .eq("id", user.id)
    .single();

  await createNotification({
    userId: friendId,
    type: "friend_streak_broken" as "friend_streak_broken", // reusing type
    title: "👋 Cutucada!",
    body: `${me?.name || "Seu amigo"} te cutucou! Faz teu check-in pra manter a ofensiva 💪`,
    icon: "hand-metal",
    link: "/checkin",
  });
}

export async function getFriendStreaksForGoal(goalId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const today = new Date().toISOString().split("T")[0];

  // Get active friend streaks where this goal is involved
  const { data: streaks } = await supabase
    .from("friend_streaks")
    .select("*")
    .eq("status", "active")
    .or(
      `and(user_id.eq.${user.id},user_goal_id.eq.${goalId}),and(friend_id.eq.${user.id},friend_goal_id.eq.${goalId})`
    );

  if (!streaks || streaks.length === 0) return [];

  const result = await Promise.all(
    streaks.map(async (s) => {
      const isInviter = s.user_id === user.id;
      const friendId = isInviter ? s.friend_id : s.user_id;
      const friendGoalId = isInviter ? s.friend_goal_id : s.user_goal_id;

      const { data: friend } = await supabase
        .from("users")
        .select("id, name")
        .eq("id", friendId)
        .single();

      let friendCheckedToday = false;
      if (friendGoalId) {
        const { count } = await supabase
          .from("checkins")
          .select("*", { count: "exact", head: true })
          .eq("goal_id", friendGoalId)
          .eq("date", today);
        friendCheckedToday = (count ?? 0) > 0;
      }

      return {
        id: s.id,
        friend_name: friend?.name ?? "",
        friend_checked_today: friendCheckedToday,
        current_streak: s.current_streak,
        target_days: s.target_days,
      };
    })
  );

  return result;
}
