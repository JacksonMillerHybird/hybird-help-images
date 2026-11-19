const { C, T, box, card, arrow, line, ok, no, num, lock, led, svg } = require('./lib');
const D = {};
const W = 1600;

// 1. Panel lifecycle ---------------------------------------------------------
D['panel-lifecycle'] = () => {
  const xs = [60, 435, 810, 1185], w = 335, y = 150, h = 230;
  const st = [
    ['Planning', ['Layout and labels', 'prepared']],
    ['Assembling', ['Breakers scanned and', 'addressed in the app']],
    ['Deploying', ['Installed on site', 'and connected']],
    ['Operating', ['Every device reporting', 'Handed to the customer']],
  ];
  let s = '';
  st.forEach(([t, b], i) => {
    const op = i === 3;
    s += box(xs[i], y, w, h, { fill: op ? C.olive : C.paper, stroke: op ? C.olive : C.line });
    s += num(xs[i] + 48, y + 52, i + 1, { fill: op ? '#fff' : C.olive });
    if (op) s += T(xs[i] + 48, y + 61, '4', { size: 26, weight: 700, fill: C.olive, anchor: 'middle' });
    s += T(xs[i] + 88, y + 63, t, { size: 32, weight: 700, fill: op ? '#fff' : C.olive });
    s += T(xs[i] + 30, y + 135, b, { size: 25, fill: op ? '#fff' : C.ink });
    if (i < 3) s += arrow([[xs[i] + w + 4, y + h / 2], [xs[i + 1] - 6, y + h / 2]], { color: i === 2 ? 'orange' : 'olive', sw: 5 });
  });
  if (true) s += lock(xs[3] + w - 46, y + 50, 1, '#fff');
  s += T(1165, 108, 'Move to Operating', { size: 26, weight: 700, fill: C.orange, anchor: 'middle' });
  s += arrow([[1165, 120], [1165, 252]], { color: 'orange', sw: 3, dash: '5 6' });
  // back arrow
  s += line([[xs[2] + w / 2, y + h + 4], [xs[2] + w / 2, 460]], { color: 'olive', sw: 4 });
  s += line([[xs[1] + w / 2, y + h + 4], [xs[1] + w / 2, 460]], { color: 'olive', sw: 4 });
  s += arrow([[xs[2] + w / 2, 460], [xs[0] + w / 2, 460], [xs[0] + w / 2, y + h + 8]], { color: 'olive', sw: 4 });
  s += T(xs[1] + w / 2 + 20, 510, 'Move Back to Planning', { size: 28, weight: 700, fill: C.olive, anchor: 'middle' });
  s += T(xs[1] + w / 2 + 20, 548, 'Possible at any stage before Operating', { size: 25, fill: C.muted, anchor: 'middle' });
  // lock note
  s += card(xs[3], 430, w, 200, { fill: C.orangeTint, stroke: C.orange, title: ['Permanently locked'], body: ['to its account and site.', 'Only Hybird admins', 'can change it.'], tc: C.orange, ts: 28 });
  s += line([[xs[3] + w / 2, y + h], [xs[3] + w / 2, 430]], { color: 'orange', sw: 3, dash: '6 6' });
  return svg(W, 680, s);
};

// 2. Breaker LED states ------------------------------------------------------
D['breaker-led-states'] = () => {
  const RED = '#d9413a', BLUE = '#2f6fd6', PURPLE = '#8d4fc8';
  const cx = [440, 1010], cw = 530, ry = [190, 520], rh = 300;
  let s = '';
  // column headers
  [['Handles UP', 'Breaker ON · Live'], ['Handles DOWN', 'Breaker OFF · Isolated']].forEach(([a, b], i) => {
    s += T(cx[i] + cw / 2, 92, a, { size: 30, weight: 700, fill: C.olive, anchor: 'middle' });
    s += T(cx[i] + cw / 2, 134, b, { size: 25, fill: C.muted, anchor: 'middle' });
  });
  [['Green dip switch UP', 'Work mode'], ['Green dip switch DOWN', 'Setup mode']].forEach(([a, b], i) => {
    s += card(60, ry[i], 350, rh, { fill: i ? C.orangeTint : C.oliveTint, stroke: i ? C.orange : C.olive, title: [b], body: a.split(/(?<=switch) /), tc: i ? C.orange : C.olive, ts: 32 });
  });
  const cells = [
    [[RED], 'blinking red', 'Addressed & Live', 'Normal operation'],
    [[BLUE], 'blinking blue', 'Addressed & Isolated', ''],
    [[BLUE, PURPLE], 'blinking blue / purple', 'Addressing & Live', 'Waiting for an address'],
    [[PURPLE, RED], 'blinking purple / red', 'Addressing & Isolated', 'Waiting for an address'],
  ];
  cells.forEach(([cols, pat, name, note], k) => {
    const r = Math.floor(k / 2), c = k % 2, x = cx[c], y = ry[r];
    s += box(x, y, cw, rh, { fill: '#fff', stroke: r ? C.orange : C.line });
    const mid = x + cw / 2;
    if (cols.length === 1) s += led(mid, y + 80, cols[0], 30);
    else { s += led(mid - 52, y + 80, cols[0], 30) + led(mid + 52, y + 80, cols[1], 30); }
    s += T(mid, y + 164, pat, { size: 26, fill: C.muted, anchor: 'middle' });
    s += T(mid, y + 216, name, { size: 32, weight: 700, anchor: 'middle' });
    if (note) s += T(mid, y + 256, note, { size: 25, fill: r ? C.orange : C.green, anchor: 'middle', weight: 600 });
  });
  s += T(60, 885, 'The LED always blinks, never solid. Purple in the pattern means Setup mode.', { size: 26, fill: C.ink });
  s += T(60, 925, 'Breakers arrive in Setup mode (green dip switch down).', { size: 26, fill: C.muted });
  return svg(W, 970, s);
};

// 3. RCBO face labelled ------------------------------------------------------
D['rcbo-face-labelled'] = () => {
  const ox = 770, oy = 150, k = 1.18; // main photo 660x625
  const P = (x, y) => [ox + x * k, oy + y * k];
  const ix = 40, iy = 190, iw = 650, ih = 275; // magnified inset of the control strip
  let s = `<clipPath id="ph"><rect x="${ox}" y="${oy}" width="${660 * k}" height="${625 * k}" rx="22"/></clipPath><clipPath id="pi"><rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" rx="18"/></clipPath>`;
  s += `<image href="tech/rcbo-face-photo.jpg" x="${ox}" y="${oy}" width="${660 * k}" height="${625 * k}" clip-path="url(#ph)"/>`;
  s += `<image href="tech/rcbo-face-inset.jpg" x="${ix}" y="${iy}" width="${iw}" height="${ih}" clip-path="url(#pi)"/>`;
  s += box(ix, iy, iw, ih, { fill: 'none', stroke: C.orange, sw: 3 });
  const [rx1, ry1] = P(30, 115), [rx2, ry2] = P(160, 170);
  s += `<rect x="${rx1}" y="${ry1}" width="${rx2 - rx1}" height="${ry2 - ry1}" rx="8" fill="none" stroke="${C.orange}" stroke-width="3"/>`;
  s += line([[ix + iw, iy], [rx1, ry1]], { color: 'orange', sw: 2, dash: '6 6' }) + line([[ix + iw, iy + ih], [rx1, ry2]], { color: 'orange', sw: 2, dash: '6 6' });
  const dot = (p) => `<circle cx="${p[0]}" cy="${p[1]}" r="11" fill="${C.orange}" stroke="#fff" stroke-width="4"/>`;
  const lab = (x, y, w, t, b, p, from) => card(x, y, w, 104, { title: t, body: b, align: 'left', ts: 27, bs: 23, fill: '#fff', pad: 22 }) + line([from, p], { color: 'orange', sw: 3 }) + dot(p);
  // inset labels
  s += lab(340, 40, 400, 'Yellow safety lock', 'Pull out before working on it', [ix + 515, iy + 105], [ix + 515, 144]);
  s += lab(40, 510, 320, 'Status LED', 'Always blinks', [ix + 115, iy + 140], [ix + 115, 510]);
  s += lab(380, 510, 360, 'Green dip switch', 'Up Work, down Setup', [ix + 380, iy + 150], [ix + 380, 510]);
  // main photo labels
  s += lab(770, 20, 340, 'QR code', 'Scan it in the app', P(95, 55), [882, 124]);
  s += lab(1190, 20, 350, 'Handle set', 'Up on, down off', P(330, 62), [1250, 124]);
  s += lab(40, 740, 560, 'RS485 terminal', 'Green plug for the daisy chain', P(72, 545), [600, 792]);
  return svg(W, 920, s);
};

// 4. RS485 daisy chain vs star vs T-tap --------------------------------------
function brk(x, y, label, o = {}) {
  return box(x, y, o.w || 90, o.h || 64, { r: 10, fill: o.fill || '#fff', stroke: o.stroke || C.ink, sw: 2.5 }) +
    T(x + (o.w || 90) / 2, y + (o.h || 64) / 2 + 9, label, { size: 24, weight: 600, anchor: 'middle', fill: o.tc || C.ink });
}
function ctrl(x, y, w = 200, h = 70, label = 'Controller') {
  return box(x, y, w, h, { r: 12, fill: C.olive, stroke: C.olive }) + T(x + w / 2, y + h / 2 + 9, label, { size: 25, weight: 700, fill: '#fff', anchor: 'middle' });
}
D['rs485-daisy-chain'] = () => {
  const px = [60, 565, 1070], pw = 470;
  let s = '';
  const heads = [['Daisy chain', true, ['One pair, device to device']], ['Star', false, ['Separate run to', 'each breaker']], ['T-tap', false, ['Branches off', 'the main bus']]];
  heads.forEach(([t, good, cap], i) => {
    const x = px[i];
    s += box(x, 50, pw, 600, { fill: good ? C.greenTint : C.paper, stroke: good ? C.green : C.line });
    s += (good ? ok : no)(x + 60, 112, 26) + T(x + 102, 123, t, { size: 32, weight: 700 });
    s += T(x + pw / 2, 560, cap, { size: 26, anchor: 'middle', fill: good ? C.green : C.muted, weight: 600 });
  });
  const bx = (x, j) => x + 35 + j * 105, by = 410;
  // daisy
  { const x = px[0]; s += ctrl(x + 135, 190);
    s += line([[x + 235, 260], [x + 235, 330], [bx(x, 0) + 38, 330], [bx(x, 0) + 38, by]], { color: 'olive', sw: 5 });
    for (let j = 0; j < 3; j++) s += line([[bx(x, j) + 76, by + 32], [bx(x, j + 1), by + 32]], { color: 'olive', sw: 5 });
    for (let j = 0; j < 4; j++) s += brk(bx(x, j), by, String(j + 1), { w: 76 }); }
  // star
  { const x = px[1]; s += ctrl(x + 135, 190);
    for (let j = 0; j < 4; j++) s += line([[x + 175 + j * 40, 260], [bx(x, j) + 38, by]], { color: 'red', sw: 4 });
    for (let j = 0; j < 4; j++) s += brk(bx(x, j), by, String(j + 1), { w: 76 }); }
  // T-tap
  { const x = px[2]; s += ctrl(x + 135, 190);
    s += line([[x + 235, 260], [x + 235, 330]], { color: 'red', sw: 4 });
    s += line([[bx(x, 0) + 38, 330], [bx(x, 3) + 38, 330]], { color: 'red', sw: 4 });
    for (let j = 0; j < 4; j++) s += line([[bx(x, j) + 38, 330], [bx(x, j) + 38, by]], { color: 'red', sw: 4 });
    for (let j = 0; j < 4; j++) s += `<circle cx="${bx(x, j) + 38}" cy="330" r="7" fill="${C.red}"/>`;
    for (let j = 0; j < 4; j++) s += brk(bx(x, j), by, String(j + 1), { w: 76 }); }
  s += T(60, 712, 'Use a repeater on buses with more than 70 breakers.', { size: 26, fill: C.muted });
  return svg(W, 750, s);
};

// 5. RS485 chain break -------------------------------------------------------
D['rs485-chain-break'] = () => {
  let s = '';
  const live = { fill: C.greenTint, stroke: C.green }, dead = { fill: C.grey, stroke: '#b9b5aa', tc: C.muted };
  // Row A
  s += T(60, 90, 'One panel', { size: 30, weight: 700, fill: C.olive });
  s += ctrl(60, 150, 210, 100);
  const xa = [350, 540, 730, 920, 1110, 1300], bw = 150, bh = 100, ya = 150;
  s += line([[270, ya + 50], [xa[0], ya + 50]], { color: 'olive', sw: 5 });
  for (let j = 0; j < 5; j++) {
    if (j === 2) { s += line([[xa[j] + bw, ya + 50], [xa[j] + bw + 12, ya + 50]], { color: 'olive', sw: 5 }) + line([[xa[j + 1] - 12, ya + 50], [xa[j + 1], ya + 50]], { color: 'muted', sw: 5 }); continue; }
    s += line([[xa[j] + bw, ya + 50], [xa[j + 1], ya + 50]], { color: j < 2 ? 'olive' : 'muted', sw: 5 });
  }
  xa.forEach((x, j) => { s += brk(x, ya, j < 3 ? 'Reporting' : 'Silent', { w: bw, h: bh, ...(j < 3 ? live : dead) }); });
  s += no(xa[2] + bw + 20, ya + 50, 20);
  s += T(xa[0] + 240, 300, '✓ Upstream keeps reporting', { size: 25, fill: C.green, anchor: 'middle', weight: 600 });
  s += T(xa[4] + 75, 300, 'Everything downstream goes quiet', { size: 25, fill: C.muted, anchor: 'middle', weight: 600 });
  s += card(60, 340, 1480, 90, { fill: C.orangeTint, stroke: C.orange, body: 'Look between the last reporting device and the first silent one.', bs: 27, bc: C.ink });
  // Row B
  s += T(60, 520, 'Two panels on one controller', { size: 30, weight: 700, fill: C.olive });
  s += box(40, 560, 760, 220, { fill: C.paper, dash: '10 8', stroke: '#c9c3b4' }) + T(60, 600, 'Panel 1', { size: 25, fill: C.muted, weight: 600 });
  s += box(860, 560, 700, 220, { fill: C.paper, dash: '10 8', stroke: '#c9c3b4' }) + T(880, 600, 'Panel 2', { size: 25, fill: C.muted, weight: 600 });
  const yb = 630;
  s += ctrl(70, yb, 200, 100);
  const xb = [330, 560, 920, 1130, 1340];
  s += line([[270, yb + 50], [xb[0], yb + 50]], { color: 'olive', sw: 5 });
  s += line([[xb[0] + bw, yb + 50], [xb[1], yb + 50]], { color: 'olive', sw: 5 });
  s += line([[xb[1] + bw, yb + 50], [818, yb + 50]], { color: 'olive', sw: 5 });
  s += line([[842, yb + 50], [xb[2], yb + 50]], { color: 'muted', sw: 5 });
  s += line([[xb[2] + bw, yb + 50], [xb[3], yb + 50]], { color: 'muted', sw: 5 }) + line([[xb[3] + bw, yb + 50], [xb[4], yb + 50]], { color: 'muted', sw: 5 });
  xb.forEach((x, j) => { s += brk(x, yb, j < 2 ? 'Reporting' : 'Silent', { w: bw, h: bh, ...(j < 2 ? live : dead) }); });
  s += no(830, yb + 50, 20);
  s += T(830, 830, 'Check the panel-to-panel run first', { size: 26, fill: C.orange, anchor: 'middle', weight: 700 });
  return svg(W, 880, s);
};

// 6. RS485 polarity -----------------------------------------------------------
D['rs485-polarity'] = () => {
  let s = '';
  const rows = [
    ['A to A, B to B', 'Every device reports', true, 'none'],
    ['A and B swapped at the controller', 'No device reports', false, 'ctrl'],
    ['A and B swapped at one breaker', 'Only that breaker drops off', false, 'b1'],
  ];
  const dev = [[520, 210, 'Controller'], [930, 190, 'Breaker 1'], [1320, 190, 'Breaker 2']];
  rows.forEach(([t, r, good, sw], i) => {
    const y = 60 + i * 255, h = 210;
    s += box(40, y, 1520, h + 10, { fill: good ? C.greenTint : C.paper, stroke: good ? C.green : C.line });
    s += (good ? ok : no)(90, y + 52, 24);
    s += T(132, y + 62, t.length > 22 ? [t.replace(/ (at .*)$/, ''), t.match(/at .*$/)[0]] : t, { size: 28, weight: 700 });
    s += T(132, y + 170, r, { size: 25, fill: good ? C.green : C.red, weight: 600 });
    const ya = y + 70, yb = y + 140;
    const reports = (k) => sw === 'none' || (sw === 'b1' && k !== 1);
    dev.forEach(([x, w, name], k) => {
      const isC = k === 0, st = isC ? null : reports(k);
      s += box(x, y + 25, w, h - 40, { r: 14, fill: isC ? C.olive : st ? '#fff' : C.grey, stroke: isC ? C.olive : st ? C.green : '#b9b5aa', sw: 2.5 });
      s += T(x + w / 2, y + 80 + 20, name, { size: 25, weight: 700, anchor: 'middle', fill: isC ? '#fff' : st ? C.ink : C.muted });
      if (!isC) s += (st ? ok : no)(x + w / 2, y + 140, 18);
      // terminals
      [['A', ya], ['B', yb]].forEach(([lab, ty]) => {
        [x, x + w].forEach((tx) => {
          if (isC && tx === x) return; if (k === 2 && tx === x + w) return;
          s += `<rect x="${tx - 20}" y="${ty - 20}" width="40" height="40" rx="8" fill="#fff" stroke="${C.ink}" stroke-width="2"/>` + T(tx, ty + 9, lab, { size: 24, weight: 700, anchor: 'middle' });
        });
      });
    });
    // wires
    const seg = (x1, x2, cross) => {
      const c = cross ? 'orange' : 'ink';
      return line([[x1 + 20, ya], [x2 - 20, cross ? yb : ya]], { color: c, sw: 5 }) + line([[x1 + 20, yb], [x2 - 20, cross ? ya : yb]], { color: c, sw: 5, dash: cross ? null : '12 8' });
    };
    s += seg(730, 930, sw === 'ctrl' || sw === 'b1');
    s += seg(1120, 1320, sw === 'b1');
  });
  s += T(40, 850, 'Swapped at the controller? Fix it there, not at every breaker.', { size: 26, fill: C.muted });
  return svg(W, 890, s);
};

module.exports = D;
