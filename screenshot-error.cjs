const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('http://localhost:4200/home', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'C:/Users/xcastillo/AppData/Local/Temp/error-state.png' });
  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
