// Renders the animated 9:16 promo: frames via Playwright, encoded with ffmpeg.
// Usage: node render-video.js <framesDir>
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const FPS = 30, DUR = 15;
(async () => {
  const dir = process.argv[2] || path.join(__dirname, 'frames');
  fs.mkdirSync(dir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.join(__dirname, 'poster.html') + '#story', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.addScriptTag({ path: path.join(__dirname, 'anim.js') });
  for (let i = 0; i < FPS * DUR; i++) {
    await page.evaluate(t => window.setT(t), i / FPS);
    await page.screenshot({ path: path.join(dir, `f${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 92 });
  }
  await browser.close();
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(dir, 'f%04d.jpg'),
    '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'medium', '-r', String(FPS),
    '-c:a', 'aac', '-shortest', '-movflags', '+faststart', path.join(__dirname, 'katre-y-chocolate-reel.mp4')]);
})();
