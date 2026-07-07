// reference/scripts/capture-lukebaffait.mjs
//
// Repeatable scroll-capture of a live scroll-animated site (default: https://lukebaffait.fr)
// into still frames for design reference. Uses wheel events so smooth-scroll libraries
// (Lenis / Locomotive) advance correctly — plain window.scrollTo does NOT drive them.
//
// One-time setup:
//   npm i -D playwright
//   npx playwright install chromium
//
// Run:
//   node reference/scripts/capture-lukebaffait.mjs
//   node reference/scripts/capture-lukebaffait.mjs https://example.com 48   (custom url + step count)
//
// Output: reference/lukebaffait-live/<viewport>/step_NN.png  +  index.json (step → scrollY map)

import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const URL = process.argv[2] ?? "https://lukebaffait.fr";
const STEPS = Number(process.argv[3] ?? 40); // scroll stops (frames per viewport ≈ STEPS + 1)
const SETTLE_MS = 750; // pause after each scroll so reveals fire
const INTRO_WAIT_MS = 2000; // pause after load for preloader / fonts / hero
const HEADLESS = true; // set false to watch it run

const OUT_ROOT = resolve(__dirname, "../lukebaffait-live");

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  { name: "mobile", width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
];

const pad = (n) => String(n).padStart(2, "0");

async function captureViewport(browser, vp) {
  const outDir = resolve(OUT_ROOT, vp.name);
  await mkdir(outDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.deviceScaleFactor,
    isMobile: vp.isMobile,
    hasTouch: vp.hasTouch,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();

  console.log(`\n[${vp.name}] → ${URL}`);
  await page.goto(URL, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(INTRO_WAIT_MS);

  // Park the cursor mid-viewport so wheel events are delivered to the page.
  await page.mouse.move(vp.width / 2, vp.height / 2);

  const docHeight = await page.evaluate(() => document.body.scrollHeight);
  const maxScroll = Math.max(0, docHeight - vp.height);
  const perStep = Math.ceil(maxScroll / STEPS) + 40; // slight overshoot to reach the very bottom

  const frames = [];
  for (let i = 0; i <= STEPS; i++) {
    const scrollY = await page.evaluate(() =>
      Math.round(window.scrollY || window.pageYOffset || 0),
    );
    const file = `step_${pad(i)}.png`;
    await page.screenshot({ path: resolve(outDir, file) }); // viewport shot at this depth
    frames.push({ step: i, scrollY, file });
    console.log(`[${vp.name}] ${file}  y=${scrollY}`);

    if (i < STEPS) {
      await page.mouse.wheel(0, perStep);
      await page.waitForTimeout(SETTLE_MS);
    }
  }

  await context.close();
  return { viewport: vp.name, url: URL, docHeight, steps: STEPS, frames };
}

async function main() {
  const browser = await chromium.launch({ headless: HEADLESS });
  const results = [];
  try {
    for (const vp of VIEWPORTS) {
      results.push(await captureViewport(browser, vp));
    }
  } finally {
    await browser.close();
  }

  await mkdir(OUT_ROOT, { recursive: true });
  await writeFile(
    resolve(OUT_ROOT, "index.json"),
    JSON.stringify({ capturedAt: new Date().toISOString(), url: URL, results }, null, 2),
  );
  console.log(`\n✓ Done — frames in ${OUT_ROOT}/{desktop,mobile}/ ; scroll map in index.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});