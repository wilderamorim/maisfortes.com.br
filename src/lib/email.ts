import { Resend } from "resend";

let resend: Resend | null = null;

function getResend() {
  if (resend) return resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not configured");
  resend = new Resend(key);
  return resend;
}

const FROM = process.env.RESEND_FROM || "MaisFortes <noreply@maisfortes.com.br>";

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const { data, error } = await getResend().emails.send({
      from: FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
    if (error) return { success: false, error: error.message };
    return { success: true, id: data?.id };
  } catch {
    return { success: false, error: "Failed to send email" };
  }
}
