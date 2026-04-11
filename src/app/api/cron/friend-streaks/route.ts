import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Yesterday (we evaluate if both checked in yesterday)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const { data: streaks } = await supabase
    .from("friend_streaks")
    .select("*")
    .eq("status", "active");

  if (!streaks || streaks.length === 0) {
    return NextResponse.json({ evaluated: 0 });
  }

  let completed = 0;
  let broken = 0;
  let incremented = 0;

  for (const s of streaks) {
    // Check if user did check-in yesterday
    const { count: userCount } = await supabase
      .from("checkins")
      .select("*", { count: "exact", head: true })
      .eq("goal_id", s.user_goal_id)
      .eq("date", yesterdayStr);

    // Check if friend did check-in yesterday
    const { count: friendCount } = s.friend_goal_id
      ? await supabase
          .from("checkins")
          .select("*", { count: "exact", head: true })
          .eq("goal_id", s.friend_goal_id)
          .eq("date", yesterdayStr)
      : { count: 0 };

    const userDid = (userCount ?? 0) > 0;
    const friendDid = (friendCount ?? 0) > 0;

    if (userDid && friendDid) {
      // Both did it — increment streak
      const newStreak = s.current_streak + 1;
      const newBest = Math.max(s.best_streak, newStreak);

      if (newStreak >= s.target_days) {
        // Completed!
        await supabase
          .from("friend_streaks")
          .update({
            current_streak: newStreak,
            best_streak: newBest,
            last_both_date: yesterdayStr,
            status: "completed",
          })
          .eq("id", s.id);

        // Get names for notifications
        const { data: inviter } = await supabase.from("users").select("name").eq("id", s.user_id).single();
        const { data: acceptor } = await supabase.from("users").select("name").eq("id", s.friend_id).single();

        // Notify both
        await supabase.from("notifications").insert([
          {
            user_id: s.user_id,
            type: "friend_streak_broken",
            title: "🏆 Ofensiva completa!",
            body: `Você e ${acceptor?.name || "seu amigo"} completaram ${s.target_days} dias juntos!`,
            icon: "trophy",
            link: "/network",
          },
          {
            user_id: s.friend_id,
            type: "friend_streak_broken",
            title: "🏆 Ofensiva completa!",
            body: `Você e ${inviter?.name || "seu amigo"} completaram ${s.target_days} dias juntos!`,
            icon: "trophy",
            link: "/network",
          },
        ]);

        // Check achievements for both
        await checkFriendStreakAchievements(supabase, s.user_id, s.target_days);
        await checkFriendStreakAchievements(supabase, s.friend_id, s.target_days);

        completed++;
      } else {
        await supabase
          .from("friend_streaks")
          .update({
            current_streak: newStreak,
            best_streak: newBest,
            last_both_date: yesterdayStr,
          })
          .eq("id", s.id);

        incremented++;
      }
    } else {
      // Someone missed — break the streak
      const { data: inviter } = await supabase.from("users").select("name").eq("id", s.user_id).single();
      const { data: acceptor } = await supabase.from("users").select("name").eq("id", s.friend_id).single();

      await supabase
        .from("friend_streaks")
        .update({ current_streak: 0, status: "broken" })
        .eq("id", s.id);

      if (s.current_streak > 0) {
        await supabase.from("notifications").insert([
          {
            user_id: s.user_id,
            type: "friend_streak_broken",
            title: "Ofensiva quebrada",
            body: `A ofensiva de ${s.current_streak} dia${s.current_streak > 1 ? "s" : ""} com ${acceptor?.name || "seu amigo"} foi quebrada.`,
            icon: "flame-kindling",
            link: "/network",
          },
          {
            user_id: s.friend_id,
            type: "friend_streak_broken",
            title: "Ofensiva quebrada",
            body: `A ofensiva de ${s.current_streak} dia${s.current_streak > 1 ? "s" : ""} com ${inviter?.name || "seu amigo"} foi quebrada.`,
            icon: "flame-kindling",
            link: "/network",
          },
        ]);
      }

      broken++;
    }
  }

  return NextResponse.json({
    evaluated: streaks.length,
    incremented,
    completed,
    broken,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function checkFriendStreakAchievements(supabase: any, userId: string, targetDays: number) {
  const { data: existing } = await supabase
    .from("user_achievements")
    .select("achievement_id")
    .eq("user_id", userId);

  const unlocked = new Set(existing?.map((a: { achievement_id: string }) => a.achievement_id) ?? []);
  const toUnlock: string[] = [];

  // Count completed friend streaks
  const { count: completedCount } = await supabase
    .from("friend_streaks")
    .select("*", { count: "exact", head: true })
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
    .eq("status", "completed");

  const total = (completedCount as number | null) ?? 0;

  if (total >= 1 && !unlocked.has("first-friend-streak")) {
    toUnlock.push("first-friend-streak");
  }
  if (total >= 3 && !unlocked.has("friend-streak-3")) {
    toUnlock.push("friend-streak-3");
  }
  if (targetDays >= 60 && !unlocked.has("friend-streak-keeper")) {
    toUnlock.push("friend-streak-keeper");
  }
  if (targetDays >= 90 && !unlocked.has("friend-streak-legend")) {
    toUnlock.push("friend-streak-legend");
  }

  if (toUnlock.length > 0) {
    await supabase.from("user_achievements").insert(
      toUnlock.map((id) => ({
        user_id: userId,
        achievement_id: id,
        goal_id: null,
      }))
    );
  }
}
