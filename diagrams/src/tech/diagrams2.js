const { C, T, box, card, arrow, line, ok, no, num, lock, led, svg } = require('./lib');
const D = {};
const W = 1600;

// 7. Modbus address map ------------------------------------------------------
D['modbus-address-map'] = () => {
  let s = '';
  const x0 = 60, x1 = 1540, lo = 10, hi = 247, sc = (x1 - x0) / (hi - lo + 1);
  const X = (a) => x0 + (a - lo) * sc;
  const segs = [
    [10, 100, C.olive, '#fff', 'Breakers and other devices'],
    [101, 119, C.orange, '#fff', 'RCDs'],
    [120, 139, C.ink, '#fff', 'Meters'],
    [140, 247, C.olive, '#fff', 'Breakers and other devices'],
  ];
  const y = 150, h = 130;
  segs.forEach(([a, b, f, tc, lab], i) => {
    const xa = X(a), xb = X(b + 1);
    s += `<rect x="${xa + (i ? 2 : 0)}" y="${y}" width="${xb - xa - (i ? 2 : 0) - (i < 3 ? 2 : 0)}" height="${h}" fill="${f}" rx="${i === 0 || i === 3 ? 0 : 0}"/>`;
    s += T((xa + xb) / 2, y + h / 2 + 10, lab, { size: xb - xa < 200 ? 26 : 28, weight: 700, fill: tc, anchor: 'middle' });
    s += T((xa + xb) / 2, y + h + 46, `${a}–${b}`, { size: 26, weight: 600, anchor: 'middle', fill: C.ink });
  });
  s = `<clipPath id="bar"><rect x="${x0}" y="${y}" width="${x1 - x0}" height="${h}" rx="20"/></clipPath><g clip-path="url(#bar)">${s.match(/<rect[^>]*\/>/g).join('')}</g>` + s.replace(/<rect[^>]*\/>/g, '');
  s += T(x0, 100, 'Modbus addresses 10–247', { size: 30, weight: 700, fill: C.olive });
  s += T(x1, 100, 'Maximum 247', { size: 26, weight: 600, fill: C.muted, anchor: 'end' });
  const notes = [
    ['Breakers and other devices', ['Anywhere in 10–247,', 'outside the RCD and', 'meter ranges']],
    ['RCDs 101–119 · meters 120–139', ['Reserved ranges, enforced', 'by the Hybird API']],
    ['Who assigns them', ['The installer or Hybird,', 'depending on the case', 'and the agreement']],
  ];
  notes.forEach(([t, b], i) => { s += card(60 + i * 505, 390, 470, 220, { title: t, body: b, ts: 27, bs: 25, align: 'left' }); });
  return svg(W, 660, s);
};

// 8. UPS during a power outage -----------------------------------------------
D['ups-power-outage'] = () => {
  let s = '';
  const w = 270, xs = [60, 362, 664, 966, 1268], y = 130, h = 330;
  const st = [
    ['Normal', 'Mains on', C.green, ['Breakers and', 'controller report']],
    ['Mains lost', 'On UPS', C.orange, ['Breakers lose power', 'Controller runs', 'on the UPS']],
    ['Up to ~4 hours', 'On UPS', C.orange, ['Controller online,', 'sends alerts', 'No readings stored']],
    ['UPS empty', 'Offline', C.red, ['Controller goes', 'offline too']],
    ['Mains back', 'Mains on', C.green, ['Breakers and', 'controller resume']],
  ];
  st.forEach(([t, tag, col, b], i) => {
    const x = xs[i];
    s += box(x, y, w, h, { fill: '#fff' });
    s += `<path d="M${x},${y + 18} a18,18 0 0 1 18,-18 h${w - 36} a18,18 0 0 1 18,18 v44 h-${w} z" fill="${col}"/>`;
    s += T(x + w / 2, y + 42, tag, { size: 25, weight: 700, fill: '#fff', anchor: 'middle' });
    s += T(x + w / 2, y + 120, t, { size: 29, weight: 700, anchor: 'middle' });
    s += T(x + w / 2, y + 180, b, { size: 24, anchor: 'middle', fill: C.ink, lh: 34 });
    if (i < 4) s += arrow([[x + w + 3, y + h / 2], [xs[i + 1] - 5, y + h / 2]], { color: 'muted', sw: 4 });
  });
  s += T(60, 90, 'The UPS powers the controller only. Breakers follow mains.', { size: 27, fill: C.ink, weight: 600 });
  s += card(60, 510, 1478, 110, { fill: C.orangeTint, stroke: C.orange, title: 'Readings from the outage are not stored or uploaded later', ts: 27, tc: C.ink });
  return svg(W, 670, s);
};

// 9. Controller connectivity -------------------------------------------------
D['controller-connectivity'] = () => {
  let s = '';
  s += card(60, 220, 290, 170, { fill: C.olive, stroke: C.olive, title: ['Edge', 'Controller'], tc: '#fff', ts: 32 });
  const links = [['Ethernet', 'Preferred · use wherever possible'], ['Wi-Fi', 'Fallback'], ['LTE', 'Built-in, pre-configured SIM']];
  links.forEach(([t, b], i) => {
    const y = 90 + i * 155, pri = i === 0;
    s += box(470, y, 560, 120, { fill: pri ? C.oliveTint : '#fff', stroke: pri ? C.olive : C.line, sw: pri ? 3 : 2 });
    s += num(522, y + 60, i + 1);
    s += T(570, y + 52, t, { size: 30, weight: 700, fill: pri ? C.olive : C.ink });
    s += T(570, y + 90, b, { size: 24, fill: C.muted });
    s += arrow([[352, 305], [410, 305], [410, y + 60], [466, y + 60]], { color: pri ? 'olive' : 'muted', sw: pri ? 5 : 3, head: true });
    s += arrow([[1032, y + 60], [1100, y + 60], [1100, 305], [1176, 305]], { color: pri ? 'olive' : 'muted', sw: pri ? 5 : 3 });
  });
  s += card(1180, 220, 360, 170, { fill: '#fff', stroke: C.olive, sw: 3, title: 'Hybird OS', tc: C.olive, ts: 32 });
  s += T(1360, 440, ['Outbound HTTPS,', 'port 443 only', 'No inbound ports'], { size: 25, anchor: 'middle', fill: C.muted });
  s += T(60, 60, 'Tried in this order', { size: 26, fill: C.muted, weight: 600 });
  s += card(60, 580, 1480, 100, { fill: C.orangeTint, stroke: C.orange, title: 'While offline, readings are not stored. Data from the gap is lost.', ts: 27 });
  return svg(W, 720, s);
};

// 10. System architecture ----------------------------------------------------
D['system-architecture'] = () => {
  let s = '';
  const cy = 330;
  // breakers stack
  for (let i = 0; i < 3; i++) s += box(60 + i * 14, 230 + i * 18, 200, 150, { fill: i === 2 ? '#fff' : C.paper, stroke: C.ink, sw: 2.5 });
  s += T(188, 330, ['Hybird', 'breakers'], { size: 28, weight: 700, anchor: 'middle' });
  s += arrow([[292, cy], [446, cy]], { color: 'olive', sw: 5 });
  s += T(369, cy - 52, ['RS485', 'daisy chain'], { size: 23, anchor: 'middle', fill: C.olive, weight: 600, lh: 28 });
  s += card(450, 250, 240, 160, { fill: C.olive, stroke: C.olive, title: ['Edge', 'Controller'], tc: '#fff', ts: 30 });
  s += arrow([[692, cy], [876, cy]], { color: 'olive', sw: 5 });
  s += T(784, cy - 80, ['Ethernet', 'Wi-Fi', 'LTE'], { size: 23, anchor: 'middle', fill: C.olive, weight: 600, lh: 28 });
  s += card(880, 240, 270, 180, { fill: '#fff', stroke: C.olive, sw: 3, title: 'Hybird OS', tc: C.olive, ts: 32 });
  const outs = ['Web app', 'iOS app', 'API', 'MCP'];
  outs.forEach((o, i) => {
    const y = 90 + i * 125;
    s += card(1290, y, 250, 100, { title: o, ts: 28, fill: '#fff' });
    s += arrow([[1152, cy], [1220, cy], [1220, y + 50], [1286, y + 50]], { color: 'muted', sw: 3 });
  });
  const caps = [[175, ['Measure and switch', 'each circuit']], [570, ['Gateway to', 'the internet']], [1015, ['Stores data, alarms', 'and reports']]];
  caps.forEach(([x, t]) => { s += T(x, 480, t, { size: 24, anchor: 'middle', fill: C.muted }); });
  return svg(W, 600, s);
};

// 11. Breakers not reporting: triage -----------------------------------------
D['breakers-not-reporting-triage'] = () => {
  let s = '';
  s += card(450, 50, 700, 110, { title: 'Is the controller online?', ts: 32, fill: C.oliveTint, stroke: C.olive, tc: C.olive });
  s += arrow([[1152, 105], [1226, 105]], { color: 'orange', sw: 4 });
  s += T(1189, 90, 'No', { size: 25, weight: 700, fill: C.orange, anchor: 'middle' });
  s += card(1230, 40, 320, 130, { title: 'Network issue', body: 'See System offline', ts: 27, bs: 24, fill: C.orangeTint, stroke: C.orange });
  s += arrow([[800, 162], [800, 236]], { color: 'olive', sw: 4 });
  s += T(822, 208, 'Yes', { size: 25, weight: 700, fill: C.olive });
  s += card(450, 240, 700, 110, { title: 'How many breakers are affected?', ts: 32, fill: C.oliveTint, stroke: C.olive, tc: C.olive });
  const xs = [60, 436, 812, 1188], w = 352, y = 560, h = 230;
  const br = [
    ['One', 'Single breaker', ['A/B reversed or a', 'loose RS485 wire', 'on that breaker']],
    ['All of them', 'Controller end', ['A/B reversed at the', 'controller, or plug', 'not seated']],
    ['A physical cluster', 'Daisy-chain break', ['After the last', 'reporting device']],
    [['One unreliable,', 'neighbour missing'], 'Address collision', ['Two devices share', 'an address']],
  ];
  s += line([[800, 352], [800, 410]], { color: 'olive', sw: 4 });
  s += line([[xs[0] + w / 2, 410], [xs[3] + w / 2, 410]], { color: 'olive', sw: 4 });
  br.forEach(([lab, t, b], i) => {
    const cx = xs[i] + w / 2;
    s += arrow([[cx, 410], [cx, y - 4]], { color: 'olive', sw: 4 });
    const L = Array.isArray(lab) ? lab : [lab];
    s += `<rect x="${cx - 165}" y="${L.length > 1 ? 434 : 452}" width="330" height="${L.length > 1 ? 92 : 56}" rx="12" fill="#fff"/>`;
    s += T(cx, L.length > 1 ? 470 : 490, L, { size: 25, weight: 700, anchor: 'middle', fill: C.olive, lh: 32 });
    s += card(xs[i], y, w, h, { title: t, body: b, ts: 28, bs: 24, fill: '#fff' });
    s += line([[cx, y + h], [cx, 840]], { color: 'muted', sw: 3 });
  });
  s += line([[xs[0] + w / 2, 840], [xs[3] + w / 2, 840]], { color: 'muted', sw: 3 });
  s += arrow([[800, 840], [800, 876]], { color: 'muted', sw: 3 });
  s += card(400, 880, 800, 100, { fill: C.olive, stroke: C.olive, title: 'Contact Hybird support with your answers', tc: '#fff', ts: 28 });
  return svg(W, 1030, s);
};

// 12. System offline flowchart -----------------------------------------------
D['system-offline-flowchart'] = () => {
  let s = '';
  const x = 300, w = 1000, h = 150, ys = [50, 270, 490, 710, 930];
  const st = [
    ['Check power', 'PSU has mains? 24 V DC reaches the controller?'],
    ['Check the controller LED', 'Green power LED on?'],
    ['Check the network', 'Ethernet link? Wi-Fi in range? LTE antenna fitted?'],
    ['Restart the controller', 'Hold both arrow buttons together for 5 seconds'],
    ['Contact Hybird support', 'Say what you checked and what you saw'],
  ];
  st.forEach(([t, b], i) => {
    const last = i === 4, y = ys[i];
    s += box(x, y, w, h, { fill: last ? C.olive : '#fff', stroke: last ? C.olive : C.line });
    s += num(x + 70, y + h / 2, last ? '!' : i + 1, { fill: last ? C.orange : C.olive, r: 30, size: 30 });
    s += T(x + 130, y + 64, t, { size: 31, weight: 700, fill: last ? '#fff' : C.ink });
    s += T(x + 130, y + 108, b, { size: 25, fill: last ? '#fff' : C.muted });
    if (i < 4) {
      s += arrow([[x + w / 2, y + h + 2], [x + w / 2, ys[i + 1] - 6]], { color: 'olive', sw: 4 });
      s += T(x + w / 2 + 22, y + h + 45, 'Still offline', { size: 24, fill: C.muted, weight: 600 });
      s += card(x + w + 50, y + 35, 200, 80, { fill: C.greenTint, stroke: C.green, title: 'Back online', ts: 24, tc: C.green });
      s += arrow([[x + w + 2, y + 75], [x + w + 46, y + 75]], { color: 'green', sw: 3 });
    }
  });
  // LED off loop back to power
  s += arrow([[x - 2, ys[1] + 75], [x - 80, ys[1] + 75], [x - 80, ys[0] + 75], [x - 6, ys[0] + 75]], { color: 'orange', sw: 4 });
  s += T(x - 96, ys[0] + 180, ['LED', 'off'], { size: 24, weight: 700, fill: C.orange, anchor: 'end' });
  return svg(W, 1130, s);
};

// 13. Trip: overcurrent vs leakage -------------------------------------------
D['trip-overcurrent-vs-leakage'] = () => {
  let s = '';
  s += card(560, 40, 480, 100, { title: 'A breaker keeps tripping', ts: 30, fill: C.orangeTint, stroke: C.orange });
  s += arrow([[800, 142], [800, 196]], { color: 'olive', sw: 4 });
  s += card(480, 200, 640, 100, { title: 'One breaker or several?', ts: 30, fill: C.oliveTint, stroke: C.olive, tc: C.olive });
  s += arrow([[1122, 250], [1226, 250]], { color: 'muted', sw: 4 });
  s += T(1172, 234, 'Several', { size: 23, weight: 700, fill: C.muted, anchor: 'middle' });
  s += card(1230, 190, 320, 120, { body: ['Check the supply and', 'upstream protection first'], bs: 24, fill: '#fff' });
  s += arrow([[800, 302], [800, 366]], { color: 'olive', sw: 4 });
  s += T(822, 342, 'One', { size: 25, weight: 700, fill: C.olive });
  s += card(450, 370, 700, 100, { title: "Check its readings in Hybird OS", ts: 30, fill: C.oliveTint, stroke: C.olive, tc: C.olive });
  const xs = [60, 570, 1080], w = 460, y = 640, h = 230;
  const br = [
    ['Leakage reading high', 'Leakage trip', ['Disconnect loads one', 'at a time; watch', 'the leakage reading']],
    ['Current near the rating', 'Overcurrent trip', ['Reduce the load, or', 'uprate if the wiring', 'allows it']],
    ['Both look normal', 'Intermittent fault', ['Look for moisture,', 'damaged insulation or', 'faulty equipment']],
  ];
  s += line([[800, 472], [800, 520]], { color: 'olive', sw: 4 });
  s += line([[xs[0] + w / 2, 520], [xs[2] + w / 2, 520]], { color: 'olive', sw: 4 });
  br.forEach(([lab, t, b], i) => {
    const cx = xs[i] + w / 2;
    s += arrow([[cx, 520], [cx, y - 4]], { color: 'olive', sw: 4 });
    s += `<rect x="${cx - 190}" y="548" width="380" height="52" rx="12" fill="#fff"/>`;
    s += T(cx, 584, lab, { size: 25, weight: 700, anchor: 'middle', fill: C.olive });
    s += card(xs[i], y, w, h, { title: t, body: b, ts: 29, bs: 24, fill: '#fff' });
    s += line([[cx, y + h], [cx, 920]], { color: 'muted', sw: 3 });
  });
  s += line([[xs[0] + w / 2, 920], [xs[2] + w / 2, 920]], { color: 'muted', sw: 3 });
  s += arrow([[800, 920], [800, 956]], { color: 'muted', sw: 3 });
  s += card(450, 960, 700, 100, { fill: C.olive, stroke: C.olive, title: 'Still tripping? Contact Hybird support', tc: '#fff', ts: 28 });
  return svg(W, 1110, s);
};

module.exports = D;
