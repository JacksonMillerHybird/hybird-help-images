const { C, T, box, card, arrow, line, ok, no, num, lock, led, svg } = require('./lib');
const D = {};
const W = 1600;

function dev(x, y, w, h, title, sub, o = {}) {
  return card(x, y, w, h, { title, body: sub || null, ts: o.ts || 25, bs: o.bs || 22, fill: o.fill || '#fff', stroke: o.stroke || C.ink, sw: 2.5, r: 12, tc: o.tc, bc: o.bc || C.muted, dash: o.dash });
}
const dot = (x, y, col = C.ink) => `<circle cx="${x}" cy="${y}" r="7" fill="${col}"/>`;

// 14. Remote addressing lanes ------------------------------------------------
D['remote-addressing-lanes'] = () => {
  let s = '';
  const L = { site: [60, 720], sup: [840, 700], both: [60, 1480] };
  s += box(40, 40, 760, 1670, { fill: C.oliveTint, stroke: C.oliveTint, r: 24 });
  s += box(820, 40, 740, 1670, { fill: C.orangeTint, stroke: C.orangeTint, r: 24 });
  s += T(420, 100, 'On site', { size: 32, weight: 700, fill: C.olive, anchor: 'middle' });
  s += T(1190, 100, 'Hybird support', { size: 32, weight: 700, fill: C.orange, anchor: 'middle' });
  const steps = [
    ['sup', 'Prepares the new device', 'on the panel in advance'],
    ['both', 'Agree a time · you stay on the phone together', ''],
    ['site', 'Call Hybird support', 'before flipping anything'],
    ['site', 'Check no other breaker', 'LED shows purple'],
    ['site', 'Flip the green dip switch', 'DOWN to Setup · purple appears'],
    ['sup', 'Sends the address command', 'via the controller'],
    ['site', 'Confirm all the LEDs flashed', ''],
    ['sup', 'Confirms the address', 'on the phone'],
    ['site', 'Flip the dip switch UP to Work', 'LED settles to one colour'],
    ['both', 'Check together: the breaker reports measurements', ''],
  ];
  const y0 = 140, step = 158, h = 118;
  let prev = null;
  steps.forEach(([lane, t, b], i) => {
    const [x, w] = L[lane], y = y0 + i * step;
    const fill = lane === 'both' ? C.olive : '#fff', tc = lane === 'both' ? '#fff' : C.ink;
    s += box(x, y, w, h, { fill, stroke: lane === 'sup' ? C.orange : lane === 'both' ? C.olive : C.olive, sw: 2.5 });
    s += num(x + 50, y + h / 2, i + 1, { fill: lane === 'both' ? '#fff' : lane === 'sup' ? C.orange : C.olive });
    if (lane === 'both') s += T(x + 50, y + h / 2 + 9, String(i + 1), { size: 26, weight: 700, fill: C.olive, anchor: 'middle' });
    const lines = b ? [t, b] : [t];
    s += T(x + 96, y + (b ? 50 : 70), lines, { size: 26, weight: 600, fill: tc, lh: 38 });
    const cx = lane === 'both' ? 800 : x + w / 2;
    if (prev) s += arrow([[prev[0], prev[1]], [prev[0], prev[1] + 10], [cx, y - 30], [cx, y - 4]].filter((p, k, a) => !(k === 1 && a[0][0] === cx)), { color: 'muted', sw: 3 });
    prev = [cx, y + h + 2];
  });
  s += T(800, 1762, 'Panel stays energised. Only one breaker in Setup mode at a time.', { size: 25, fill: C.ink, anchor: 'middle', weight: 600 });
  return svg(W, 1800, s);
};

// 15. Wiring single phase ----------------------------------------------------
D['wiring-single-phase'] = () => {
  let s = '';
  s += box(60, 60, 1480, 64, { fill: C.ink, stroke: C.ink, r: 12 }) + T(90, 102, 'Supply 230 V AC  ·  L and N', { size: 26, weight: 700, fill: '#fff' });
  const y = 260, h = 200;
  s += dev(60, y, 150, h, 'PSU', ['24 V DC', 'out']);
  s += dev(230, y, 150, h, 'UPS', 'Optional', { dash: '10 7' });
  s += dev(400, y, 230, h, ['Edge', 'Controller'], '', { fill: C.olive, stroke: C.olive, tc: '#fff' });
  const xs = [740, 950, 1160, 1370], bw = 170;
  xs.forEach((x) => { s += dev(x, y, bw, h, '2P RCBO', 'L N'); });
  // supply drops
  [[135], ...xs.map((x) => [x + bw / 2])].forEach(([x]) => { s += line([[x, 124], [x, y]], { color: 'ink', sw: 4 }) + dot(x, 124); });
  // circuits out
  xs.forEach((x) => { s += arrow([[x + bw / 2, y + h], [x + bw / 2, 620]], { color: 'ink', sw: 4 }); });
  s += T(1455, 660, 'To circuits (L, N)', { size: 24, fill: C.muted, anchor: 'end' });
  // IDC / DC chain
  s += line([[210, y + 150], [230, y + 150]], { color: 'orange', sw: 6 }) + line([[380, y + 150], [400, y + 150]], { color: 'orange', sw: 6 });
  s += T(60, y + h + 50, ['IDC cable, 24 V DC', 'PSU → UPS → controller'], { size: 24, fill: C.orange, weight: 600 });
  // RS485 chain arcs under the boxes, beside the circuit outputs
  const arc = (x1, x2) => line([[x1, y + h], [x1, y + h + 40], [x2, y + h + 40], [x2, y + h]], { color: 'olive', sw: 5 });
  s += arc(600, xs[0] + 30);
  for (let j = 0; j < 3; j++) s += arc(xs[j] + bw - 30, xs[j + 1] + 30);
  s += T(60, 625, 'RS485 daisy chain', { size: 25, weight: 700, fill: C.olive });
  s += line([[60, 645], [300, 645]], { color: 'olive', sw: 5 });
  return svg(W, 700, s);
};

// 16. Wiring three phase -----------------------------------------------------
D['wiring-three-phase'] = () => {
  let s = '';
  const bus = [['L1', 80], ['L2', 120], ['L3', 160], ['N', 200]];
  bus.forEach(([n, y]) => { s += line([[130, y], [1540, y]], { color: n === 'N' ? 'muted' : 'ink', sw: 4 }) + T(60, y + 9, n, { size: 25, weight: 700 }); });
  const top = 300;
  const tap = (x, ys) => ys.map((yy) => line([[x, yy], [x, top]], { color: 'ink', sw: 3 }) + dot(x, yy)).join('');
  // Group A
  s += T(510, 500, 'RCBOs', { size: 26, weight: 700, fill: C.olive, anchor: 'middle' });
  s += tap(170, [80]) + tap(200, [120]) + tap(230, [160]) + tap(260, [200]);
  s += dev(140, top, 150, 150, '4P RCBO', 'L1 L2 L3 N');
  [[350, 80, 'L1'], [540, 120, 'L2'], [730, 160, 'L3']].forEach(([x, yy, ph]) => {
    s += tap(x + 50, [yy]) + tap(x + 100, [200]);
    s += dev(x, top, 150, 150, '2P RCBO', `${ph} + N`);
  });
  // Group B
  s += T(1250, 685, 'RCD upstream of MCBs', { size: 26, weight: 700, fill: C.olive, anchor: 'middle' });
  s += tap(1080, [80]) + tap(1140, [120]) + tap(1200, [160]) + tap(1260, [200]);
  s += dev(1040, top, 260, 120, 'Hybird RCD', 'Leakage, for the group', { fill: C.orangeTint, stroke: C.orange });
  s += line([[1170, top + 120], [1170, 470]], { color: 'ink', sw: 4 }) + line([[1060, 470], [1460, 470]], { color: 'ink', sw: 4 });
  [1000, 1180, 1360].forEach((x) => { s += arrow([[x + 70, 470], [x + 70, 516]], { color: 'ink', sw: 3 }) + dev(x, 520, 140, 110, 'MCB', 'Overcurrent'); });
  s += line([[1000 + 70, 470], [1060, 470]], { color: 'ink', sw: 4 });
  // notes
  s += card(60, 740, 720, 120, { title: 'Spread single-phase circuits', body: 'over L1, L2 and L3 for balance', ts: 26, bs: 24 });
  s += card(820, 740, 720, 120, { title: 'Type B RCD', body: 'for VFDs, EV chargers and PV inverters', ts: 26, bs: 24, fill: C.orangeTint, stroke: C.orange });
  s += T(60, 920, 'Every breaker joins the same RS485 daisy chain, whatever its pole count.', { size: 25, fill: C.muted });
  return svg(W, 960, s);
};

// 17. DIN rail layout --------------------------------------------------------
D['din-rail-layout'] = () => {
  let s = '';
  s += arrow([[340, 70], [1100, 70]], { color: 'muted', sw: 3 });
  s += T(340, 55, 'Left', { size: 24, fill: C.muted }) + T(1100, 55, 'Right', { size: 24, fill: C.muted, anchor: 'end' });
  const rows = [['PSU only', [['PSU', '35 mm', 140], ['Edge Controller', '', 250]]], ['PSU + UPS', [['PSU', '35 mm', 140], ['UPS', '', 140], ['Edge Controller', '', 250]]]];
  rows.forEach(([lab, parts], r) => {
    const y = 130 + r * 260, h = 190;
    s += T(60, y + h / 2 + 10, lab, { size: 30, weight: 700, fill: C.olive });
    s += `<rect x="320" y="${y + h / 2 - 22}" width="1220" height="44" rx="6" fill="#d9d4c7"/>`;
    let x = 340;
    parts.forEach(([t, sub, w]) => {
      const isC = t === 'Edge Controller';
      s += dev(x, y, w, h, isC ? ['Edge', 'Controller'] : t, sub, { fill: isC ? C.olive : '#fff', stroke: isC ? C.olive : C.ink, tc: isC ? '#fff' : C.ink, ts: 27, bs: 24 });
      x += w + 16;
    });
    s += dev(x + 30, y, 400, h, 'Breakers', '', { dash: '10 8', stroke: '#b9b5aa', tc: C.muted });
  });
  s += card(60, 680, 720, 120, { title: 'Controller is always the rightmost', body: 'of the PSU, UPS and controller', ts: 26, bs: 24, fill: C.oliveTint, stroke: C.olive, tc: C.olive });
  s += card(820, 680, 720, 120, { title: 'UPS always sits in the middle', body: 'between the PSU and the controller', ts: 26, bs: 24, fill: C.oliveTint, stroke: C.olive, tc: C.olive });
  s += T(60, 850, 'Not to scale.', { size: 23, fill: C.muted });
  return svg(W, 880, s);
};

// 18. Protection layouts -----------------------------------------------------
D['protection-layouts'] = () => {
  let s = '';
  const px = [60, 565, 1070], pw = 470;
  const heads = [['RCBOs throughout', ['Each circuit has its', 'own leakage protection', 'A fault trips one circuit']],
    ['RCD over MCBs', ['One RCD protects', 'a group of MCBs', 'Leakage trips the group']],
    ['Mixed', ['RCBOs where circuits', 'need their own', 'protection, groups elsewhere']]];
  heads.forEach(([t, cap], i) => {
    const x = px[i];
    s += box(x, 40, pw, 720, { fill: C.paper });
    s += T(x + pw / 2, 100, t, { size: 30, weight: 700, fill: C.olive, anchor: 'middle' });
    s += line([[x + 30, 150], [x + pw - 30, 150]], { color: 'ink', sw: 5 });
    s += T(x + pw / 2, 600, cap, { size: 24, anchor: 'middle', fill: C.ink, lh: 34 });
  });
  const rcbo = (x) => line([[x + 40, 150], [x + 40, 200]], { color: 'ink', sw: 3 }) + dot(x + 40, 150) + dev(x, 200, 80, 150, 'RCBO', '', { ts: 22 });
  const mcb = (x, yTop) => line([[x + 40, yTop], [x + 40, 380]], { color: 'ink', sw: 3 }) + dev(x, 380, 80, 130, 'MCB', '', { ts: 22 });
  // A
  for (let j = 0; j < 4; j++) s += rcbo(px[0] + 45 + j * 100);
  // B
  { const x = px[1]; s += line([[x + pw / 2, 150], [x + pw / 2, 200]], { color: 'ink', sw: 3 }) + dot(x + pw / 2, 150);
    s += dev(x + 95, 200, 280, 110, 'RCD', 'Leakage', { fill: C.orangeTint, stroke: C.orange });
    s += line([[x + pw / 2, 310], [x + pw / 2, 345]], { color: 'ink', sw: 3 }) + line([[x + 85, 345], [x + 385, 345]], { color: 'ink', sw: 3 });
    for (let j = 0; j < 4; j++) s += mcb(x + 45 + j * 100, 345); }
  // C
  { const x = px[2]; s += rcbo(x + 35) + rcbo(x + 135);
    s += line([[x + 340, 150], [x + 340, 200]], { color: 'ink', sw: 3 }) + dot(x + 340, 150);
    s += dev(x + 240, 200, 200, 110, 'RCD', 'Leakage', { fill: C.orangeTint, stroke: C.orange });
    s += line([[x + 340, 310], [x + 340, 345]], { color: 'ink', sw: 3 }) + line([[x + 290, 345], [x + 390, 345]], { color: 'ink', sw: 3 });
    s += mcb(x + 250, 345) + mcb(x + 350, 345); }
  return svg(W, 800, s);
};

// 19. Hybird vs traditional --------------------------------------------------
D['hybird-vs-traditional'] = () => {
  let s = '';
  const rows = [
    ['Overcurrent and leakage protection', 1, 1],
    ['Fits a standard 35 mm DIN rail', 1, 1],
    ['Protects without a network connection', 1, 1],
    ['Voltage, current and power per circuit', 0, 1],
    ['Energy use (kWh) per circuit', 0, 1],
    ['Continuous leakage reading (mA)', 0, 1],
    ['Breaker temperature', 0, 1],
    ['Remote on/off switching *', 0, 1],
    ['Alarms by SMS and email', 0, 1],
    ['History and reports in Hybird OS', 0, 1],
  ];
  const x0 = 60, c1 = 1060, c2 = 1300, x1 = 1540, top = 50, hh = 90, rh = 76;
  s += `<clipPath id="tb"><rect x="${x0}" y="${top}" width="${x1 - x0}" height="${hh + rows.length * rh}" rx="18"/></clipPath>`;
  s += box(x0, top, x1 - x0, hh + rows.length * rh, { fill: '#fff' });
  s += T(c1 + (c2 - c1) / 2, top + 58, 'Traditional', { size: 27, weight: 700, fill: C.muted, anchor: 'middle' });
  s += `<rect x="${c2}" y="${top}" width="${x1 - c2}" height="${hh + rows.length * rh}" fill="${C.oliveTint}" clip-path="url(#tb)"/>`;
  s += T(c2 + (x1 - c2) / 2, top + 58, 'Hybird', { size: 29, weight: 700, fill: C.olive, anchor: 'middle' });
  rows.forEach(([t, a, b], i) => {
    const y = top + hh + i * rh;
    s += line([[x0, y], [x1, y]], { color: 'muted', sw: 1 }).replace(/stroke="[^"]+"/, `stroke="${C.line}"`);
    s += T(x0 + 30, y + rh / 2 + 9, t, { size: 26 });
    s += (a ? ok : no)(c1 + (c2 - c1) / 2, y + rh / 2, 20) + (b ? ok : no)(c2 + (x1 - c2) / 2, y + rh / 2, 20);
  });
  s += box(x0, top, x1 - x0, hh + rows.length * rh, { fill: 'none' });
  const yb = top + hh + rows.length * rh + 50;
  s += T(x0, yb, '* Depends on the user’s role and the site’s agreement.', { size: 24, fill: C.muted });
  return svg(W, yb + 40, s);
};

// 20. Multi-controller site --------------------------------------------------
D['multi-controller-site'] = () => {
  let s = '';
  s += card(340, 40, 920, 120, { title: 'Hybird OS', body: 'One site view across both controllers', ts: 32, bs: 24, fill: '#fff', stroke: C.olive, sw: 3, tc: C.olive });
  s += box(40, 280, 1520, 560, { fill: C.paper, stroke: '#c9c3b4', dash: '12 9' }) + T(70, 326, 'Site', { size: 28, weight: 700, fill: C.muted });
  [[100, 'Panel A', 440], [820, 'Panel B', 1160]].forEach(([x, name, cx]) => {
    s += box(x, 350, 680, 430, { fill: '#fff' }) + T(x + 30, 395, name, { size: 27, weight: 700, fill: C.olive });
    s += card(cx - 150, 420, 300, 100, { title: 'Controller', fill: C.olive, stroke: C.olive, tc: '#fff', ts: 27 });
    s += arrow([[cx, 418], [cx, 166]], { color: 'olive', sw: 5 });
    const bx = [x + 55, x + 205, x + 355, x + 505];
    s += line([[cx, 520], [cx, 570], [bx[0] + 60, 570], [bx[0] + 60, 610]], { color: 'olive', sw: 4 });
    bx.forEach((b, j) => { s += dev(b, 610, 120, 110, 'Breaker', '', { ts: 22 }); if (j < 3) s += line([[b + 120, 665], [bx[j + 1], 665]], { color: 'olive', sw: 4 }); });
    s += T(x + 340, 755, 'Own RS485 bus', { size: 23, fill: C.olive, anchor: 'middle', weight: 600 });
  });
  s += T(440 + 18, 230, ['Own internet', 'connection'], { size: 23, fill: C.olive, weight: 600, lh: 28 });
  s += T(1160 + 18, 230, ['Own internet', 'connection'], { size: 23, fill: C.olive, weight: 600, lh: 28 });
  s += T(800, 900, 'Controllers do not talk to each other.', { size: 26, fill: C.ink, anchor: 'middle', weight: 600 });
  return svg(W, 950, s);
};

// 21. Earthing and bonding (RS485 signal ground) -----------------------------
D['earthing-bonding'] = () => {
  let s = '';
  s += card(60, 160, 300, 200, { title: ['Edge', 'Controller'], fill: C.olive, stroke: C.olive, tc: '#fff', ts: 30 });
  // GND terminal
  s += `<rect x="330" y="300" width="60" height="44" rx="8" fill="#fff" stroke="${C.ink}" stroke-width="2"/>` + T(360, 330, 'GND', { size: 20, weight: 700, anchor: 'middle' });
  const bx = [760, 1010, 1260];
  // screened cable envelope
  s += `<rect x="360" y="208" width="${bx[2] + 240 - 360}" height="64" rx="32" fill="none" stroke="${C.muted}" stroke-width="3" stroke-dasharray="10 7"/>`;
  s += line([[360, 228], [bx[2] + 240, 228]], { color: 'ink', sw: 4 }) + line([[360, 252], [bx[2] + 240, 252]], { color: 'ink', sw: 4, dash: '12 8' });
  bx.forEach((x) => { s += dev(x, 300, 200, 110, 'Breaker', ''); s += line([[x + 100, 272], [x + 100, 300]], { color: 'ink', sw: 3 }); });
  s += T(560, 195, 'RS485 pair · screen (dashed)', { size: 23, fill: C.muted });
  // ground connection at controller
  s += line([[390, 322], [430, 322], [430, 272]], { color: 'green', sw: 4 }) + dot(430, 272, C.green);
  s += ok(470, 470, 26) + T(510, 465, 'Connect signal ground and screen', { size: 27, weight: 700, fill: C.green });
  s += T(510, 503, 'at the controller GND only', { size: 25, fill: C.ink });
  s += line([[430, 330], [430, 440]], { color: 'green', sw: 2, dash: '4 6' });
  // not at far end
  s += no(1500, 470, 26) + T(1455, 465, 'Not at the breaker end', { size: 27, weight: 700, fill: C.red, anchor: 'end' });
  s += T(1455, 503, 'A second connection makes a ground loop', { size: 25, fill: C.ink, anchor: 'end' });
  s += line([[1500, 272], [1500, 440]], { color: 'red', sw: 2, dash: '4 6' });
  s += T(60, 90, 'One ground reference, at the controller end', { size: 30, weight: 700, fill: C.olive });
  return svg(W, 580, s);
};

module.exports = D;
