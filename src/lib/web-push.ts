import webpush from "web-push";

let initialized = false;

function ensureVapid() {
  if (initialized) return;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    throw new Error("VAPID keys not configured");
  }
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:contato@maisfortes.com.br",
    publicKey,
    privateKey
  );
  initialized = true;
}

export async function sendPush(
  subscription: webpush.PushSubscription,
  payload: { title: string; body: string; url?: string }
) {
  try {
    ensureVapid();
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return { success: true };
  } catch (err: unknown) {
    const statusCode = (err as { statusCode?: number }).statusCode;
    const message = (err as { body?: string }).body || (err as Error).message || "Unknown error";
    console.error("[web-push] Error:", statusCode, message);
    if (statusCode === 410 || statusCode === 404) {
      return { success: false, expired: true, error: `Subscription expirada (${statusCode})` };
    }
    return { success: false, expired: false, error: `${statusCode || "ERR"}: ${message}` };
  }
}
