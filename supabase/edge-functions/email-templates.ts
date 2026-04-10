// Email templates for +Fortes
// Used by Edge Functions (weekly-report, inactivity-alert, etc.)

const BRAND_COLOR = "#2D6A4F";
const LOGO = `<div style="width:40px;height:40px;border-radius:12px;background:${BRAND_COLOR};display:flex;align-items:center;justify-content:center;margin:0 auto 16px"><span style="color:white;font-size:24px;font-weight:bold">+</span></div>`;

function baseLayout(content: string) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F8F9FA;font-family:'Segoe UI',Roboto,sans-serif">
  <div style="max-width:480px;margin:0 auto;padding:32px 16px">
    <div style="background:white;border-radius:16px;padding:32px;border:1px solid #E9ECEF">
      ${LOGO}
      ${content}
    </div>
    <div style="text-align:center;margin-top:24px">
      <p style="font-size:11px;color:#6C757D">
        +Fortes — Juntos, somos mais fortes<br>
        <a href="https://maisfortes.com.br" style="color:${BRAND_COLOR}">maisfortes.com.br</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

// Weekly Report Email
export function weeklyReportEmail(name: string, checkins: number, avgScore: number, streak: number, goals: { title: string; current_streak: number }[]) {
  const goalRows = goals.map(g =>
    `<tr><td style="padding:8px 0;font-size:14px;color:#212529">${g.title}</td><td style="padding:8px 0;text-align:right;font-size:14px;color:${BRAND_COLOR};font-weight:600">${g.current_streak} dias</td></tr>`
  ).join("");

  return baseLayout(`
    <h1 style="font-size:20px;color:#212529;text-align:center;margin:0 0 4px">Resumo da semana</h1>
    <p style="font-size:13px;color:#6C757D;text-align:center;margin:0 0 24px">Oi, ${name}! Aqui está como foi sua semana.</p>

    <div style="display:flex;gap:8px;margin-bottom:24px">
      <div style="flex:1;background:#F8F9FA;border-radius:12px;padding:16px;text-align:center">
        <div style="font-size:24px;font-weight:700;color:${BRAND_COLOR}">${checkins}</div>
        <div style="font-size:11px;color:#6C757D">check-ins</div>
      </div>
      <div style="flex:1;background:#F8F9FA;border-radius:12px;padding:16px;text-align:center">
        <div style="font-size:24px;font-weight:700;color:${BRAND_COLOR}">${avgScore}</div>
        <div style="font-size:11px;color:#6C757D">score médio</div>
      </div>
      <div style="flex:1;background:#F8F9FA;border-radius:12px;padding:16px;text-align:center">
        <div style="font-size:24px;font-weight:700;color:${BRAND_COLOR}">${streak}</div>
        <div style="font-size:11px;color:#6C757D">melhor streak</div>
      </div>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
      <tr><td style="padding:8px 0;font-size:12px;color:#6C757D;border-bottom:1px solid #E9ECEF" colspan="2">SUAS METAS</td></tr>
      ${goalRows}
    </table>

    <a href="https://maisfortes.com.br/home" style="display:block;text-align:center;background:${BRAND_COLOR};color:white;padding:12px;border-radius:12px;text-decoration:none;font-size:14px;font-weight:600">
      Continuar jornada
    </a>
  `);
}

// Inactivity Alert Email (sent to protagonist after 48h)
export function inactivityAlertEmail(name: string, goalTitle: string, lastCheckinDays: number) {
  return baseLayout(`
    <h1 style="font-size:20px;color:#212529;text-align:center;margin:0 0 4px">Sentimos sua falta</h1>
    <p style="font-size:13px;color:#6C757D;text-align:center;margin:0 0 24px">Oi, ${name}. Faz ${lastCheckinDays} dias sem check-in.</p>

    <div style="background:#F8F9FA;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
      <p style="font-size:14px;color:#212529;margin:0 0 8px"><strong>${goalTitle}</strong></p>
      <p style="font-size:13px;color:#6C757D;margin:0">Tudo bem. Nem todo dia precisa ser incrível. O importante é voltar.</p>
    </div>

    <a href="https://maisfortes.com.br/home" style="display:block;text-align:center;background:${BRAND_COLOR};color:white;padding:12px;border-radius:12px;text-decoration:none;font-size:14px;font-weight:600">
      Fazer check-in
    </a>
  `);
}

// Supporter Joined Email
export function supporterJoinedEmail(name: string, supporterName: string, goalTitle: string) {
  return baseLayout(`
    <h1 style="font-size:20px;color:#212529;text-align:center;margin:0 0 4px">Novo apoiador!</h1>
    <p style="font-size:13px;color:#6C757D;text-align:center;margin:0 0 24px">${supporterName} agora acompanha sua jornada.</p>

    <div style="background:rgba(45,106,79,0.06);border:1px solid rgba(45,106,79,0.15);border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
      <p style="font-size:14px;color:#212529;margin:0">${supporterName} aceitou seu convite e agora acompanha <strong>${goalTitle}</strong>.</p>
    </div>

    <a href="https://maisfortes.com.br/network" style="display:block;text-align:center;background:${BRAND_COLOR};color:white;padding:12px;border-radius:12px;text-decoration:none;font-size:14px;font-weight:600">
      Ver rede de apoio
    </a>
  `);
}

// Achievement Unlocked Email
export function achievementEmail(name: string, achievementName: string, achievementDesc: string) {
  return baseLayout(`
    <h1 style="font-size:20px;color:#212529;text-align:center;margin:0 0 4px">Conquista desbloqueada! 🏆</h1>
    <p style="font-size:13px;color:#6C757D;text-align:center;margin:0 0 24px">Parabéns, ${name}!</p>

    <div style="background:rgba(255,183,3,0.08);border:1px solid rgba(255,183,3,0.2);border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
      <div style="font-size:32px;margin-bottom:8px">🏆</div>
      <p style="font-size:16px;font-weight:700;color:#212529;margin:0 0 4px">${achievementName}</p>
      <p style="font-size:13px;color:#6C757D;margin:0">${achievementDesc}</p>
    </div>

    <a href="https://maisfortes.com.br/achievements" style="display:block;text-align:center;background:${BRAND_COLOR};color:white;padding:12px;border-radius:12px;text-decoration:none;font-size:14px;font-weight:600">
      Ver conquistas
    </a>
  `);
}

// Welcome Email
export function welcomeEmail(name: string) {
  return baseLayout(`
    <h1 style="font-size:20px;color:#212529;text-align:center;margin:0 0 4px">Bem-vindo ao +Fortes!</h1>
    <p style="font-size:13px;color:#6C757D;text-align:center;margin:0 0 24px">Oi, ${name}! Sua jornada começa agora.</p>

    <div style="background:#F8F9FA;border-radius:12px;padding:20px;margin-bottom:16px">
      <p style="font-size:14px;color:#212529;margin:0 0 12px"><strong>O que fazer agora:</strong></p>
      <p style="font-size:13px;color:#6C757D;margin:0 0 8px">1. Crie sua primeira meta</p>
      <p style="font-size:13px;color:#6C757D;margin:0 0 8px">2. Faça seu primeiro check-in</p>
      <p style="font-size:13px;color:#6C757D;margin:0">3. Convide quem te apoia (quando quiser)</p>
    </div>

    <a href="https://maisfortes.com.br/home" style="display:block;text-align:center;background:${BRAND_COLOR};color:white;padding:12px;border-radius:12px;text-decoration:none;font-size:14px;font-weight:600">
      Comece sua jornada
    </a>
  `);
}
