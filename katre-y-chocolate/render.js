// Renders poster.html to PNG (feed 1080x1350 and story 1080x1920).
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const file = 'file://' + path.join(__dirname, 'poster.html');
  for (const [name, h, hash] of [['katre-y-chocolate-feed', 1350, ''], ['katre-y-chocolate-story', 1920, '#story']]) {
    const page = await browser.newPage({ viewport: { width: 1080, height: h } });
    await page.goto(file + hash, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(__dirname, name + '.png') });
    await page.close();
  }
  await browser.close();
})();
