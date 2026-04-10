import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendPush } from "@/lib/web-push";
import { sendEmail } from "@/lib/email";
import { inactivityAlertEmail } from "@/lib/email-templates";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find goals with no check-in in the last 48h
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const cutoffDate = twoDaysAgo.toISOString().split("T")[0];

  const { data: inactiveGoals } = await supabase
    .from("goals")
    .select("id, user_id, title, last_checkin_date, users(name)")
    .eq("status", "active")
    .or(`last_checkin_date.lte.${cutoffDate},last_checkin_date.is.null`);

  if (!inactiveGoals || inactiveGoals.length === 0) {
    return NextResponse.json({ alerted: 0 });
  }

  let alerted = 0;

  for (const goal of inactiveGoals) {
    // Get active supporters for this goal
    const { data: supporters } = await supabase
      .from("supporters")
      .select("user_id, users(name, email, push_subscription)")
      .eq("goal_id", goal.id)
      .eq("status", "active")
      .not("user_id", "is", null);

    if (!supporters || supporters.length === 0) continue;

    const goalUser = goal.users as unknown as { name: string } | null;
    const protagonistName = goalUser?.name || "Alguém";
    const days = goal.last_checkin_date
      ? Math.floor((Date.now() - new Date(goal.last_checkin_date).getTime()) / 86400000)
      : null;

    const body = days
      ? `${protagonistName} não faz check-in há ${days} dias. Que tal mandar uma força?`
      : `${protagonistName} ainda não fez nenhum check-in. Que tal mandar uma força?`;

    for (const supporter of supporters) {
      const supporterUser = supporter.users as unknown as { name: string; email: string; push_subscription: unknown } | null;
      const supporterName = supporterUser?.name || "Apoiador";

      // Push
      if (supporterUser?.push_subscription) {
        const result = await sendPush(
          supporterUser.push_subscription as Parameters<typeof sendPush>[0],
          { title: "+Fortes", body, url: "/network" }
        );
        if (result.expired) {
          await supabase
            .from("users")
            .update({ push_subscription: null })
            .eq("id", supporter.user_id);
        }
      }

      // Email
      if (supporterUser?.email) {
        await sendEmail({
          to: supporterUser.email,
          subject: `${protagonistName} precisa de apoio 💙`,
          html: inactivityAlertEmail(supporterName, protagonistName, days),
        });
      }

      // In-app notification
      await supabase.from("notifications").insert({
        user_id: supporter.user_id,
        type: "inactivity_alert",
        title: "Alerta de inatividade",
        body,
        icon: "alert-circle",
        link: "/network",
      });

      alerted++;
    }
  }

  return NextResponse.json({ alerted, goalsChecked: inactiveGoals.length });
}
