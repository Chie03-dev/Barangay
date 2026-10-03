* Captures the README screenshots in docs/screenshots/.
 *
 * Requires `npm run dev` on :3000 and a local Edge/Chrome install; it drives
 * the browser over CDP so Framer Motion springs, number tickers and the
 * async loaders settle before each frame is captured. The session cookie is
 * set directly because every route except /login sits behind the mock guard.
 *
 * puppeteer-core is not a project dependency; install it on demand:
 *   npm install --no-save puppeteer-core
 */
import { mkdirSync } from "node:fs";
import puppeteer from "puppeteer-core";

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const OUT = "d:\\Developers\\Projects\\Barangay\\docs\\screenshots";
const BASE = "http://localhost:3000";
mkdirSync(OUT, { recursive: true });

const shots = [
  ["01-login", "/login", 1440, 900],
  ["02-dashboard", "/dashboard", 1440, 900],
  ["03-officials", "/officials", 1440, 900],
  ["04-services", "/services", 1440, 900],
  ["05-track", "/track", 1440, 900],
  ["06-reports", "/reports", 1440, 900],
  ["07-profile", "/profile", 1440, 900],
  ["08-contact", "/contact", 1440, 900],
  ["09-dashboard-mobile", "/dashboard", 390, 844],
  ["10-login-mobile", "/login", 390, 844],
];

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--force-color-profile=srgb"],
});

const page = await browser.newPage();
await browser.setCookie({
  name: "barangay_session",
  value: "1",
  domain: "localhost",
  path: "/",
});

for (const [name, path, w, h] of shots) {
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 2 });
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle0", timeout: 90000 });
  // Let framer-motion springs, tickers and async loaders settle.
  await new Promise((r) => setTimeout(r, 3500));
  const out = `${OUT}\\${name}.png`;
  await page.screenshot({ path: out });
  console.log(`${name} captured`);
}

await browser.close();