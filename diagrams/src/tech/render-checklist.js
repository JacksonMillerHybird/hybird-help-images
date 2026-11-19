// Renders commissioning-checklist.html to a one-page A4 PDF and a 1600 px wide PNG.
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const SRC = path.join(__dirname, '..', 'commissioning-checklist.html'), OUT = path.join(__dirname, '..', '..');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 1600 / 794 });
  await p.goto('file://' + SRC);
  await p.evaluate(() => document.fonts.ready);
  const over = await p.evaluate(() => { const g = document.querySelector('.page'); return g.scrollHeight - g.clientHeight; });
  if (over > 0) console.warn('WARNING: content overflows the page by', over, 'px');
  await p.screenshot({ path: path.join(OUT, 'commissioning-checklist.png'), clip: { x: 0, y: 0, width: 794, height: 1123 } });
  await p.pdf({ path: path.join(OUT, 'commissioning-checklist.pdf'), format: 'A4', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 }, pageRanges: '1' });
  console.log('png', fs.statSync(path.join(OUT, 'commissioning-checklist.png')).size, 'pdf', fs.statSync(path.join(OUT, 'commissioning-checklist.pdf')).size);
  await b.close();
})();
