// Writes diagrams/src/<name>.svg and renders diagrams/<name>.png at 1600 px wide.
// Usage: node diagrams/src/tech/render.js [name ...]
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const SRC = path.join(__dirname, '..'), OUT = path.join(__dirname, '..', '..'), IMG = SRC;
const D = Object.assign({}, require('./diagrams1'), require('./diagrams2'), require('./diagrams3'));

(async () => {
  const want = process.argv.slice(2);
  const names = Object.keys(D).filter((n) => !want.length || want.includes(n));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
  for (const n of names) {
    const svg = D[n]();
    fs.writeFileSync(path.join(SRC, n + '.svg'), svg);
    // inline local images for rendering
    const inl = svg.replace(/href="([\w./-]+\.(jpg|png))"/g, (m, f, ext) =>
      `href="data:image/${ext === 'jpg' ? 'jpeg' : 'png'};base64,${fs.readFileSync(path.join(IMG, f)).toString('base64')}"`);
    const h = +svg.match(/height="(\d+)"/)[1];
    await page.setViewportSize({ width: 1600, height: h });
    await page.setContent(`<!doctype html><html><body style="margin:0;background:#fff">${inl}</body></html>`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(OUT, n + '.png'), clip: { x: 0, y: 0, width: 1600, height: h } });
    console.log(n, h, fs.statSync(path.join(OUT, n + '.png')).size);
  }
  await browser.close();
})();
