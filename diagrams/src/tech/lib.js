// Small SVG helpers for the Hybird help-centre diagrams.
const C = {
  bg: '#ffffff', paper: '#fcfbf7', ink: '#2a2922', olive: '#4f5634', orange: '#c2602b',
  green: '#3f7a4a', red: '#cf4a3c', muted: '#6d6a5f', line: '#e3ded2',
  oliveTint: '#eef0e6', orangeTint: '#f8ebe2', greenTint: '#e7f1e8', redTint: '#f9e6e3', grey: '#efede7',
};
const FONT = "Inter, sans-serif";

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const arr = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);

// Text. y is the baseline of the first line.
function T(x, y, lines, o = {}) {
  const size = o.size || 26, lh = o.lh || Math.round(size * 1.32);
  const anchor = o.anchor || 'start', fill = o.fill || C.ink, weight = o.weight || 400;
  return arr(lines).map((l, i) =>
    `<text x="${x}" y="${y + i * lh}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${o.italic ? ' font-style="italic"' : ''}>${esc(l)}</text>`).join('');
}
const blockH = (n, size, lh) => (n ? (n - 1) * (lh || Math.round(size * 1.32)) + size : 0);

function box(x, y, w, h, o = {}) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r ?? 18}" fill="${o.fill || C.paper}" stroke="${o.stroke || C.line}" stroke-width="${o.sw ?? 2}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
}

// Card with optional title and body, centred vertically (and horizontally unless align:'left').
function card(x, y, w, h, o = {}) {
  const title = arr(o.title), body = arr(o.body);
  const ts = o.ts || 30, bs = o.bs || 25, gap = title.length && body.length ? 14 : 0;
  const th = blockH(title.length, ts), bh = blockH(body.length, bs);
  let top = y + (h - (th + gap + bh)) / 2;
  const left = o.align === 'left';
  const tx = left ? x + (o.pad || 28) : x + w / 2, anchor = left ? 'start' : 'middle';
  let s = box(x, y, w, h, o);
  if (title.length) s += T(tx, top + ts * 0.8, title, { size: ts, weight: 700, fill: o.tc || C.ink, anchor });
  if (body.length) s += T(tx, top + th + gap + bs * 0.8, body, { size: bs, fill: o.bc || C.ink, anchor });
  return s;
}

const COLORS = { ink: C.ink, olive: C.olive, orange: C.orange, green: C.green, red: C.red, muted: C.muted };
function defs() {
  return '<defs>' + Object.entries(COLORS).map(([k, v]) =>
    `<marker id="ah-${k}" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0,0 L12,6 L0,12 z" fill="${v}"/></marker>`
  ).join('').replace(/markerWidth="12" markerHeight="12"/g, 'markerWidth="22" markerHeight="22"') + '</defs>';
}
// Polyline arrow through points [[x,y],...]
function arrow(pts, o = {}) {
  const col = o.color || 'muted';
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ',' + p[1]).join(' ');
  return `<path d="${d}" fill="none" stroke="${COLORS[col]}" stroke-width="${o.sw || 4}" stroke-linejoin="round" stroke-linecap="round"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.head === false ? '' : ` marker-end="url(#ah-${col})"`}${o.both ? ` marker-start="url(#ah-${col})"` : ''}/>`;
}
function line(pts, o = {}) { return arrow(pts, { ...o, head: false }); }

function ok(x, y, r = 22) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.green}"/><path d="M${x - r * 0.45},${y + r * 0.02} L${x - r * 0.1},${y + r * 0.38} L${x + r * 0.48},${y - r * 0.36}" fill="none" stroke="#fff" stroke-width="${r * 0.22}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function no(x, y, r = 22) {
  const k = r * 0.38;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.red}"/><path d="M${x - k},${y - k} L${x + k},${y + k} M${x + k},${y - k} L${x - k},${y + k}" stroke="#fff" stroke-width="${r * 0.22}" stroke-linecap="round"/>`;
}
function num(x, y, n, o = {}) {
  const r = o.r || 24;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${o.fill || C.olive}"/>` + T(x, y + r * 0.36, String(n), { size: o.size || 26, weight: 700, fill: '#fff', anchor: 'middle' });
}
function lock(x, y, s = 1, col = C.orange) {
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-11,-2 v-9 a11,11 0 0 1 22,0 v9" fill="none" stroke="${col}" stroke-width="5"/><rect x="-17" y="-3" width="34" height="27" rx="5" fill="${col}"/><circle cx="0" cy="9" r="4" fill="#fff"/></g>`;
}
function led(x, y, color, r = 22) {
  return `<circle cx="${x}" cy="${y}" r="${r + 9}" fill="${color}" opacity="0.18"/><circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
}

function svg(w, h, body, o = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs()}<rect width="${w}" height="${h}" fill="${o.bg || C.bg}"/>${body}</svg>`;
}

module.exports = { C, T, box, card, arrow, line, ok, no, num, lock, led, svg, esc };
