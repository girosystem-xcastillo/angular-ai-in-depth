const { chromium } = require('playwright');

const OUT = 'C:/Users/xcastillo/AppData/Local/Temp/';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // ── Desktop (1366×768) ────────────────────────────────────
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('http://localhost:4200/home', { waitUntil: 'networkidle' });
  await page.screenshot({ path: OUT + 'desktop-initial.png' });

  await page.locator('side-nav button[aria-label="Expand sidebar"]').click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: OUT + 'desktop-expanded.png' });

  await page.locator('chat-history button').nth(1).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: OUT + 'desktop-conversation.png' });

  // ── Mobile (390×844) ─────────────────────────────────────
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:4200/home', { waitUntil: 'networkidle' });
  await page.screenshot({ path: OUT + 'mobile-initial.png' });

  // Open sidebar via mobile hamburger
  await page.locator('.mobile-menu-btn').click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: OUT + 'mobile-sidebar-open.png' });

  // Select a conversation
  await page.locator('chat-history button').nth(1).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: OUT + 'mobile-conversation.png' });

  // Open sidebar again via mobile header
  await page.locator('.mobile-menu-btn').click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: OUT + 'mobile-sidebar-in-conversation.png' });

  // Close via backdrop — click in the clear area to the right of the 280px sidebar
  await page.locator('.sidebar-backdrop').click({ position: { x: 340, y: 400 } });
  await page.waitForTimeout(400);
  await page.screenshot({ path: OUT + 'mobile-backdrop-closed.png' });

  await browser.close();
  console.log('Done');
})().catch(e => { console.error(e.message); process.exit(1); });
