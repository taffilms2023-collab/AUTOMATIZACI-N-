// Renders each poster HTML in this folder to PNG at its own size.
const { chromium } = require('playwright');
const path = require('path');
const list = [
  ['facebook-expediente', 1080, 1350],
  ['tiktok-barra', 1080, 1920],
  ['story-no-molestar', 1080, 1920],
  ['reel-reto', 1080, 1920],
  ['youtube-vhs', 1080, 1920],
];
(async () => {
  const browser = await chromium.launch();
  for (const [name, w, h] of list.filter(([n]) => process.argv.length < 3 || process.argv.includes(n))) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto('file://' + path.join(__dirname, name + '.html'), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(__dirname, name + '.png') });
    await page.close();
  }
  await browser.close();
})();
