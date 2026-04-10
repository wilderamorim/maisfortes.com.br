const BRAND = {
  forest: "#2D6A4F",
  coral: "#F4845F",
  amber: "#FFB703",
  bg: "#FAFAF8",
  text: "#1A1A1A",
  muted: "#6B7280",
};

function layout(content: string) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:480px;margin:0 auto;padding:32px 20px;">
    <div style="text-align:center;margin-bottom:24px;">
      <span style="font-size:24px;font-weight:800;color:${BRAND.forest};">+Fortes</span>
    </div>
    <div style="background:#fff;border-radius:16px;padding:32px 24px;border:1px solid #E5E7EB;">
      ${content}
    </div>
    <div style="text-align:center;margin-top:24px;">
      <p style="font-size:11px;color:${BRAND.muted};margin:0;">
        Você recebeu este email porque usa o +Fortes.
        <br>maisfortes.com.br
      </p>
    </div>
  </div>
</body>
</html>`;
}

export function dailyReminderEmail(name: string) {
  return layout(`
    <h2 style="font-size:20px;color:${BRAND.text};margin:0 0 8px;">Ei, ${name} 👋</h2>
    <p style="font-size:15px;color:${BRAND.muted};margin:0 0 24px;">Como foi seu dia hoje?</p>
    <p style="font-size:14px;color:${BRAND.muted};margin:0 0 24px;">
      Registrar como você está — mesmo nos dias difíceis — é o que constrói constância.
    </p>
    <div style="text-align:center;">
      <a href="https://maisfortes.com.br/checkin" style="display:inline-block;background:${BRAND.forest};color:#fff;padding:12px 32px;border-radius:12px;text-decoration:none;font-weight:600;font-size:14px;">
        Fazer check-in
      </a>
    </div>
  `);
}

export function inactivityAlertEmail(supporterName: string, protagonistName: string, days: number | null) {
  const daysText = days ? `não faz check-in há ${days} dias` : "ainda não fez nenhum check-in";
  return layout(`
    <h2 style="font-size:20px;color:${BRAND.text};margin:0 0 8px;">Oi, ${supporterName} 💙</h2>
    <p style="font-size:15px;color:${BRAND.muted};margin:0 0 24px;">
      <strong>${protagonistName}</strong> ${daysText}.
    </p>
    <p style="font-size:14px;color:${BRAND.muted};margin:0 0 24px;">
      Às vezes uma mensagem simples faz toda a diferença. Que tal mandar uma força?
    </p>
    <div style="text-align:center;">
      <a href="https://maisfortes.com.br/network" style="display:inline-block;background:${BRAND.coral};color:#fff;padding:12px 32px;border-radius:12px;text-decoration:none;font-weight:600;font-size:14px;">
        Enviar apoio
      </a>
    </div>
  `);
}

export function weeklyReportEmail(
  name: string,
  totalCheckins: number,
  avgScore: number,
  bestStreak: number,
  goalsCount: number
) {
  const emoji = avgScore >= 4 ? "🔥" : avgScore >= 3 ? "💪" : "🌱";
  return layout(`
    <h2 style="font-size:20px;color:${BRAND.text};margin:0 0 8px;">Seu resumo da semana ${emoji}</h2>
    <p style="font-size:14px;color:${BRAND.muted};margin:0 0 20px;">Oi, ${name}. Aqui está como foi sua semana:</p>
    <div style="display:flex;gap:8px;margin-bottom:24px;">
      ${[
        { label: "Check-ins", value: String(totalCheckins) },
        { label: "Score médio", value: String(avgScore) },
        { label: "Melhor streak", value: `${bestStreak}d` },
        { label: "Metas ativas", value: String(goalsCount) },
      ].map((s) => `
        <div style="flex:1;background:${BRAND.bg};border-radius:12px;padding:12px 8px;text-align:center;">
          <div style="font-size:20px;font-weight:800;color:${BRAND.forest};font-variant-numeric:tabular-nums;">${s.value}</div>
          <div style="font-size:10px;color:${BRAND.muted};margin-top:2px;">${s.label}</div>
        </div>
      `).join("")}
    </div>
    <p style="font-size:14px;color:${BRAND.muted};margin:0 0 24px;">
      ${totalCheckins >= 5 ? "Semana consistente! Continue assim." : "Cada check-in conta. A próxima semana é uma nova chance."}
    </p>
    <div style="text-align:center;">
      <a href="https://maisfortes.com.br/history" style="display:inline-block;background:${BRAND.forest};color:#fff;padding:12px 32px;border-radius:12px;text-decoration:none;font-weight:600;font-size:14px;">
        Ver histórico
      </a>
    </div>
  `);
}

export function difficultDayAlertEmail(supporterName: string, protagonistName: string) {
  return layout(`
    <h2 style="font-size:20px;color:${BRAND.text};margin:0 0 8px;">Atenção, ${supporterName} 💙</h2>
    <p style="font-size:15px;color:${BRAND.muted};margin:0 0 24px;">
      <strong>${protagonistName}</strong> está tendo um dia difícil e pediu apoio da rede.
    </p>
    <p style="font-size:14px;color:${BRAND.muted};margin:0 0 24px;">
      Uma mensagem de incentivo pode fazer toda a diferença.
    </p>
    <div style="text-align:center;">
      <a href="https://maisfortes.com.br/network" style="display:inline-block;background:${BRAND.coral};color:#fff;padding:12px 32px;border-radius:12px;text-decoration:none;font-weight:600;font-size:14px;">
        Enviar mensagem
      </a>
    </div>
  `);
}
