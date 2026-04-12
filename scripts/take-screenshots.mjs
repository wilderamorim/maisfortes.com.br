import { chromium } from "playwright";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "docs", "screenshots");
const BASE = "http://localhost:3000";

const VIEWPORT = { width: 412, height: 915 };
const DEVICE_SCALE = 2.625;

async function main() {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  if (!email || !password) {
    console.log("Uso: TEST_EMAIL=x TEST_PASSWORD=y node scripts/take-screenshots.mjs");
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE,
    isMobile: true,
    hasTouch: true,
    locale: "pt-BR",
    colorScheme: "light",
  });

  const page = await context.newPage();

  // Login
  console.log("🔐 Fazendo login...");
  await page.goto(`${BASE}/auth/login`, { waitUntil: "networkidle", timeout: 15000 });

  if (!page.url().includes("/home")) {
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/home", { timeout: 15000 });
  }
  console.log("✅ Login OK!");

  // Remove avatar temporarily via Supabase client in browser
  console.log("🖼️  Removendo avatar temporariamente...");
  const avatarUrl = await page.evaluate(async () => {
    const { createClient } = await import("/src/lib/supabase/client");
    // Can't import directly in browser — use supabase from window
    return null; // Will handle differently
  }).catch(() => null);

  // CSS to hide avatars and Next.js dev indicator
  const HIDE_CSS = `
    img[src*="avatar"], img[src*="supabase"] { display: none !important; }
    [data-nextjs-dialog-overlay], [data-nextjs-toast], nextjs-portal,
    [style*="position: fixed"][style*="bottom"],
    button[data-nextjs], [data-next-mark] { display: none !important; }
  `;
  await page.addStyleTag({ content: HIDE_CSS });

  await page.waitForTimeout(500);

  // Screenshot 1: Home
  console.log("\n📸 Tirando screenshots...\n");
  await page.goto(`${BASE}/home`, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: HIDE_CSS });
  await page.evaluate(() => { document.querySelectorAll('nextjs-portal, [data-nextjs-dialog-overlay]').forEach(el => el.remove()); });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: join(OUT, "01-home.png"), fullPage: false });
  console.log("  ✅ 01-home.png");

  // Screenshot 2: Check-in
  await page.goto(`${BASE}/checkin`, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: HIDE_CSS });
  await page.evaluate(() => { document.querySelectorAll('nextjs-portal, [data-nextjs-dialog-overlay]').forEach(el => el.remove()); });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: join(OUT, "02-checkin.png"), fullPage: false });
  console.log("  ✅ 02-checkin.png");

  // Screenshot 3: History
  await page.goto(`${BASE}/history`, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: HIDE_CSS });
  await page.evaluate(() => { document.querySelectorAll('nextjs-portal, [data-nextjs-dialog-overlay]').forEach(el => el.remove()); });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: join(OUT, "03-history.png"), fullPage: false });
  console.log("  ✅ 03-history.png");

  // Screenshot 4: Network
  await page.goto(`${BASE}/network`, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: HIDE_CSS });
  await page.evaluate(() => { document.querySelectorAll('nextjs-portal, [data-nextjs-dialog-overlay]').forEach(el => el.remove()); });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: join(OUT, "04-network.png"), fullPage: false });
  console.log("  ✅ 04-network.png");

  // Screenshot 5: Achievements
  await page.goto(`${BASE}/achievements`, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: HIDE_CSS });
  await page.evaluate(() => { document.querySelectorAll('nextjs-portal, [data-nextjs-dialog-overlay]').forEach(el => el.remove()); });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: join(OUT, "05-achievements.png"), fullPage: false });
  console.log("  ✅ 05-achievements.png");

  // Screenshot 6: Profile
  await page.goto(`${BASE}/profile`, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: HIDE_CSS });
  await page.evaluate(() => { document.querySelectorAll('nextjs-portal, [data-nextjs-dialog-overlay]').forEach(el => el.remove()); });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: join(OUT, "06-profile.png"), fullPage: false });
  console.log("  ✅ 06-profile.png");

  await browser.close();

  console.log(`\n📁 Screenshots em: docs/screenshots/`);
  console.log(`📐 Resolução: ~1082x2402 (412x915 @${DEVICE_SCALE}x)`);
  console.log("🚫 Fotos de avatar foram ocultadas nas prints.");
  console.log("🎯 Prontas para a Play Store!");
}

main().catch(console.error);
