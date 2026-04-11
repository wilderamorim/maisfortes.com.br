import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendPush } from "@/lib/web-push";
import { sendEmail } from "@/lib/email";
import { weeklyReportEmail } from "@/lib/email-templates";

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

  // Last 7 days
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split("T")[0];

  const { data: users } = await supabase
    .from("users")
    .select("id, email, name, push_subscription");

  if (!users || users.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  let emailSent = 0;
  let pushSent = 0;

  for (const user of users) {
    // Get active goals
    const { data: goals } = await supabase
      .from("goals")
      .select("id, current_streak, best_streak")
      .eq("user_id", user.id)
      .eq("status", "active");

    if (!goals || goals.length === 0) continue;

    const goalIds = goals.map((g) => g.id);

    // Count check-ins this week
    const { count: weekCheckins } = await supabase
      .from("checkins")
      .select("*", { count: "exact", head: true })
      .in("goal_id", goalIds)
      .gte("date", weekAgoStr);

    const totalCheckins = (weekCheckins as number | null) ?? 0;

    // Average score this week
    const { data: scores } = await supabase
      .from("checkins")
      .select("score")
      .in("goal_id", goalIds)
      .gte("date", weekAgoStr);

    const avgScore = scores && scores.length > 0
      ? Math.round((scores.reduce((sum, s) => sum + s.score, 0) / scores.length) * 10) / 10
      : 0;

    // Best streak across goals
    const bestStreak = Math.max(...goals.map((g) => g.best_streak), 0);

    const name = user.name || user.email?.split("@")[0] || "Você";

    // Send email
    if (user.email) {
      const emoji = avgScore >= 4 ? "🔥" : avgScore >= 3 ? "💪" : "🌱";
      const result = await sendEmail({
        to: user.email,
        subject: `Seu resumo da semana ${emoji}`,
        html: weeklyReportEmail(name, totalCheckins, avgScore, bestStreak, goals.length),
      });
      if (result.success) emailSent++;
    }

    // Send push
    if (user.push_subscription) {
      const result = await sendPush(user.push_subscription, {
        title: "+Fortes — Resumo semanal",
        body: `${totalCheckins} check-ins, score médio ${avgScore}. Veja seu resumo!`,
        url: "/home",
      });
      if (result.success) pushSent++;
    }

    // In-app notification
    await supabase.from("notifications").insert({
      user_id: user.id,
      type: "weekly_summary",
      title: "Resumo da semana",
      body: `${totalCheckins} check-ins, score médio ${avgScore}, melhor streak ${bestStreak} dias`,
      icon: "bar-chart-3",
      link: "/home",
    });
  }

  return NextResponse.json({ emailSent, pushSent, total: users.length });
}
