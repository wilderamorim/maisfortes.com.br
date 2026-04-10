import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendPush } from "@/lib/web-push";
import { sendEmail } from "@/lib/email";
import { dailyReminderEmail } from "@/lib/email-templates";

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

  const now = new Date();

  // Hobby plan: cron runs once/day at 21:00 UTC (18:00 BRT)
  // Send to ALL users who haven't checked in today
  const { data: users } = await supabase
    .from("users")
    .select("id, email, name, push_subscription");

  if (!users || users.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  let pushSent = 0;
  let emailSent = 0;
  let expired = 0;

  for (const user of users) {
    const today = now.toISOString().split("T")[0];
    const { data: goals } = await supabase
      .from("goals")
      .select("id, last_checkin_date")
      .eq("user_id", user.id)
      .eq("status", "active");

    if (!goals || goals.length === 0) continue;

    const hasUnchecked = goals.some((g) => g.last_checkin_date !== today);
    if (!hasUnchecked) continue;

    const name = user.name || user.email?.split("@")[0] || "Você";

    // Push notification
    if (user.push_subscription) {
      const result = await sendPush(user.push_subscription, {
        title: "+Fortes",
        body: "Ei, como foi hoje? 💪",
        url: "/checkin",
      });

      if (result.success) {
        pushSent++;
      } else if (result.expired) {
        expired++;
        await supabase
          .from("users")
          .update({ push_subscription: null })
          .eq("id", user.id);
      }
    }

    // Email
    if (user.email) {
      const result = await sendEmail({
        to: user.email,
        subject: "Ei, como foi hoje? 💪",
        html: dailyReminderEmail(name),
      });
      if (result.success) emailSent++;
    }

    // In-app notification
    await supabase.from("notifications").insert({
      user_id: user.id,
      type: "checkin_reminder",
      title: "Lembrete diário",
      body: "Ei, como foi hoje? Registre seu check-in 💪",
      icon: "bell",
      link: "/checkin",
    });
  }

  return NextResponse.json({ pushSent, emailSent, expired, total: users.length });
}
