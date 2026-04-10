// Supabase Edge Function: Weekly Report Email + Push
// Deploy: supabase functions deploy weekly-report
// Schedule: cron every Sunday at 10:00 BRT (13:00 UTC)
//
// This is a TEMPLATE — deploy to Supabase Edge Functions when ready.
// Requires: RESEND_API_KEY or SUPABASE_SMTP configured

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async () => {
  // Get all active users
  const { data: users } = await supabase
    .from("users")
    .select("id, email, name, push_subscription");

  if (!users) return new Response("No users", { status: 200 });

  for (const user of users) {
    // Get goals with checkins from last 7 days
    const { data: goals } = await supabase
      .from("goals")
      .select("id, title, current_streak, best_streak")
      .eq("user_id", user.id)
      .eq("status", "active");

    if (!goals || goals.length === 0) continue;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    let totalCheckins = 0;
    let totalScore = 0;
    let bestStreak = 0;

    for (const goal of goals) {
      const { data: checkins } = await supabase
        .from("checkins")
        .select("score")
        .eq("goal_id", goal.id)
        .gte("date", oneWeekAgo.toISOString().split("T")[0]);

      const count = checkins?.length ?? 0;
      totalCheckins += count;
      totalScore += checkins?.reduce((s, c) => s + c.score, 0) ?? 0;
      if (goal.current_streak > bestStreak) bestStreak = goal.current_streak;
    }

    if (totalCheckins === 0) continue;

    const avgScore = Math.round((totalScore / totalCheckins) * 10) / 10;

    // Create in-app notification
    await supabase.from("notifications").insert({
      user_id: user.id,
      type: "weekly_summary",
      title: "Resumo da semana",
      body: `${totalCheckins} check-ins, score médio ${avgScore}, streak ${bestStreak} dias.`,
      link: "/history",
    });

    // Send push notification if subscribed
    if (user.push_subscription) {
      try {
        // TODO: implement web-push with VAPID keys
        // await sendPushNotification(user.push_subscription, { ... });
      } catch { /* silent */ }
    }

    // Send email (using Resend or Supabase SMTP)
    // TODO: Configure email provider
    // await sendEmail({
    //   to: user.email,
    //   subject: `+Fortes — Seu resumo semanal`,
    //   html: weeklyReportEmailTemplate(user.name, totalCheckins, avgScore, bestStreak, goals),
    // });
  }

  return new Response("Weekly reports sent", { status: 200 });
});
