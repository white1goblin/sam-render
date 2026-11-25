// Story engine for "Sam — Day 0 to Day 100" (3D). Pure functions of the frame. Shots are declared in story_shots.js.
import { M as E_, idle, blinkAt, q, clamp, lerp, lerp3, ramp, spline } from './motion.js';
import { SENT, SEGS } from './timing.js';
export { SENT, SEGS, E_, q, clamp, lerp, lerp3, ramp };
export const FPS = 30, TOTAL = 18273; // voice.wav 609.091 s
export const smooth = E_.smooth, eo = E_.easeOut, ei = E_.easeIn, bk = E_.back;
export const pulse = (f, f0, len = 14) => { const t = (f - f0) / len; return t < 0 || t > 1 ? 0 : Math.sin(Math.PI * t); };
export const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
export const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

// ---------- lights ----------
const BASE = { az: 40, el: 38, sky: '#a8c8f0', ground: '#5a6a3a', hemi: 1.15, sun: '#fff0d8', sunI: 2.2, fog: '#c8d8e8', fogNear: 80, fogFar: 520, night: 0, skyTop: '#3f7fd6', skyHor: '#e8f0f8', skyTint: '#ffffff', sat: 1.08, gain: '#fffaf2',
  rimCol: '#ffd090', rimI: 1.0, coreI: 0.5, vig: 0.24, shadowExt: 18, envI: 0.35, expo: 1.0, cardTint: '#fff8ee', hazeH: 0.07, hemiK: 0.42 };
const INT = { ...BASE, fog: '#000000', fogNear: 300, fogFar: 2000, shadowExt: 6, hemiK: 0.42 };
export const LIGHTS = {
  day: BASE,
  golden: { ...BASE, az: 250, el: 14, sun: '#ffc890', sunI: 2.1, sky: '#f8d0a8', ground: '#6a5a3a', fog: '#f0d0b0', skyTint: '#ffd8b0', gain: '#fff0dc', rimCol: '#ffb060', rimI: 1.3, cardTint: '#fff0dc', sat: 1.12 },
  memory: { ...BASE, az: 255, el: 9, sun: '#ffb070', sunI: 1.9, sky: '#f8c098', ground: '#6a4a3a', fog: '#e8b898', skyTint: '#ffc0a0', gain: '#ffe8cc', lift: '#100804', rimCol: '#ffa050', rimI: 1.4, cardTint: '#ffeacc', sat: 0.92, vig: 0.42 },
  night: { ...BASE, az: 200, el: 42, sun: '#8aa8e8', sunI: 0.55, sky: '#30406a', ground: '#141820', hemi: 0.95, fog: '#18223a', fogNear: 40, fogFar: 300, night: 1, stars: 1, moon: 1, moonAz: 210, moonEl: 32, gain: '#d8e0ff', rimCol: '#8ab0ff', rimI: 1.2, cardTint: '#c4cce8', sat: 0.95, vig: 0.36, glow: 1 },
  dawn: { ...BASE, az: 75, el: 7, sun: '#ffb080', sunI: 1.6, sky: '#f0b8a8', ground: '#4a4048', fog: '#e8b8a8', night: 0.15, skyTint: '#ffb8a0', gain: '#ffe8dc', rimCol: '#ff9a70', rimI: 1.4, cardTint: '#ffe4d8', vig: 0.3 },
  kitN: { ...INT, az: 120, el: 72, sun: '#ffd8a0', sunI: 0.45, sky: '#ffe0b8', ground: '#5a4030', hemi: 0.95, gain: '#ffeedd', rimCol: '#ffb060', rimI: 1.2, cardTint: '#ffecd8', vig: 0.36, glow: 1 },
  kitD: { ...INT, az: 200, el: 52, sun: '#fff4e0', sunI: 1.5, sky: '#f4ecdc', ground: '#a88a68', hemi: 1.8, gain: '#fffaf2', rimCol: '#ffe0a8', cardTint: '#fffaf2' },
  garN: { ...INT, az: 100, el: 76, sun: '#ffd8a0', sunI: 0.4, sky: '#e8c8a0', ground: '#4a3a2a', hemi: 0.9, gain: '#ffe8d0', rimCol: '#ffb060', rimI: 1.3, cardTint: '#ffe6cc', vig: 0.4, glow: 1 },
  garD: { ...INT, az: 160, el: 55, sun: '#fff4e0', sunI: 1.5, sky: '#f0ece0', ground: '#8a8478', hemi: 1.7, gain: '#fffaf2', cardTint: '#fffaf2' },
  hosp: { ...INT, az: 120, el: 70, sun: '#eef4ff', sunI: 1.1, sky: '#e8f0f8', ground: '#8a9aa0', hemi: 1.7, gain: '#f4f8ff', rimCol: '#c8dcff', cardTint: '#f4f8ff', vig: 0.3 },
  ware: { ...INT, az: 90, el: 82, sun: '#f0f6ff', sunI: 1.2, sky: '#dfe8f4', ground: '#7a7a7a', hemi: 1.6, gain: '#f0f4ff', rimCol: '#c0d8ff', cardTint: '#f0f4ff', vig: 0.32 },
  shopD: { ...INT, az: 150, el: 58, sun: '#fff6e8', sunI: 1.6, sky: '#f4f0e8', ground: '#8a8478', hemi: 1.9, gain: '#fffaf2', cardTint: '#fffaf2' },
  shopN: { ...INT, az: 150, el: 72, sun: '#ffe0b0', sunI: 0.5, sky: '#d8c0a0', ground: '#3a3028', hemi: 1.0, gain: '#ffe8d0', rimCol: '#ffb060', rimI: 1.3, cardTint: '#ffe6cc', vig: 0.4, glow: 1 },
  diner: { ...INT, az: 130, el: 64, sun: '#fff0d8', sunI: 1.5, sky: '#fff0e0', ground: '#8a5a4a', hemi: 1.9, gain: '#fff6ea', rimCol: '#ffd090', cardTint: '#fff6ea' },
  office: { ...INT, az: 140, el: 60, sun: '#f4f6ff', sunI: 1.4, sky: '#eef0f4', ground: '#7a6a5a', hemi: 1.8, gain: '#f8f8ff', cardTint: '#f8f8ff' },
};
const hex = (s) => { const n = parseInt(s.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const mixL = (A, B, t) => { const o = { ...A }; for (const k in B) { const a = A[k], b = B[k]; if (typeof a === 'number' && typeof b === 'number') o[k] = a + (b - a) * t; else if (typeof a === 'string' && typeof b === 'string' && a[0] === '#' && b[0] === '#') { const x = hex(a), y = hex(b); o[k] = '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join(''); } else o[k] = t < 0.5 ? (a ?? b) : b; } return o; };

// ---------- shot registry ----------
export const SH = [];
// start frame of a sentence (or of a word inside it), leading the voice by `lead` frames
export const sf = (s, w = 0) => (SENT[s][2][w] ?? SENT[s][0]);
export const shot = (s0, o) => { SH.push({ s0, ...o }); };
export const SHOTS = [];
export const finalize = () => {
  SH.forEach((o) => { o.a = Array.isArray(o.s0) ? sf(o.s0[0], o.s0[1]) - (o.lead ?? 5) : (o.s0 === 0 ? 0 : sf(o.s0) - (o.lead ?? 6)); });
  SH[0].a = 0; SH.sort((x, y) => x.a - y.a);
  SH.forEach((o, i) => { o.b = i < SH.length - 1 ? SH[i + 1].a - 1 : TOTAL - 1; o.id = 's' + i; o.n = o.b - o.a + 1; o.light = o.light || 'day'; SHOTS.push(o); });
};
let _last = 0;
export const shotAt = (f) => { if (SHOTS[_last] && f >= SHOTS[_last].a && f <= SHOTS[_last].b) return SHOTS[_last]; let lo = 0, hi = SHOTS.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (SHOTS[m].a <= f) lo = m; else hi = m - 1; } _last = lo; return SHOTS[lo]; };
const ctx = (S, f) => { const lf = f - S.a; return { f, S, lf, n: S.n, t: clamp(lf / Math.max(1, S.n - 1)), r: (a, b) => clamp((lf - a) / Math.max(1, b - a)), w: (s, i = 0) => sf(s, i) - S.a, ws: (s, i = 0) => sf(s, i) }; };
export const lightFor = (S, f) => { let L = LIGHTS[S.light]; if (S.light2) { const k = ctx(S, f); const t = S.lt ? S.lt(k) : smooth(k.t); L = mixL(L, LIGHTS[S.light2], t); } return { ...L, ...(S.lmod || {}) }; };

// ---------- camera ----------
// autoFrame: user dislikes over-tight close-ups. If a character's head is inside the view cone and closer than ~2.4 m (scaled),
// slide the camera back along the view axis (and open the fov to >= 34) with smooth weights so the move stays continuous.
const _stubC = () => {};
const actorPts = (S, k) => { const P = []; if (!S.act) return P; try { S.act(k, (key, pos, o = {}, ex = {}) => { const s = (ex.s ?? SCALE[key] ?? 1) * (ex.k ?? 1); P.push([pos[0], pos[1] + 1.45 * s, pos[2], s]); }, _stubC, null); } catch (e) {} return P; };
const ROOMB = { kit: [97.2, 102.8, -2.3, 2.35], gar: [197.2, 202.8, -3.3, 3.3], hosp: [497.7, 502.3, -2.3, 2.3], main: [312.3, 325.7, -7.7, -0.35] };
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const autoFrame = (S, k, c) => { if (S.noFix) return c; const P = actorPts(S, k); if (!P.length) return c;
  const L = [c.look[0] - c.pos[0], c.look[1] - c.pos[1], c.look[2] - c.pos[2]], ll = Math.hypot(...L) || 1, u = L.map((x) => x / ll);
  let push = 0, wf = 0; let fd = 1e9; if (S.focus) { const F = typeof S.focus === 'function' ? S.focus(k) : S.focus; if (F) fd = Math.hypot(F[0] - c.pos[0], F[1] - c.pos[1], F[2] - c.pos[2]); }
  for (const p of P) { const v = [p[0] - c.pos[0], p[1] - c.pos[1], p[2] - c.pos[2]], d = Math.hypot(...v) || 1; const cs = (v[0] * u[0] + v[1] * u[1] + v[2] * u[2]) / d; if (fd < 0.6 * d) continue;
    const w = sstep(0.77, 0.9, cs), dmin = (S.dmin ?? 2.4) * Math.max(0.7, p[3]); const need = w * Math.max(0, dmin - d * cs); if (need > push) push = need; wf = Math.max(wf, w * clamp((dmin - d * cs) / 0.4)); }
  if (push <= 0) return c; push = Math.min(push, S.pushMax ?? 1.6);
  const B = ROOMB[S.set]; const inB = (q_) => B && q_[0] > B[0] && q_[0] < B[1] && q_[2] > B[2] && q_[2] < B[3];
  const want = push;
  if (B && inB(c.pos)) { let lo = 0, hi = push; const at_ = (t) => [c.pos[0] - u[0] * t, 0, c.pos[2] - u[2] * t]; if (!inB(at_(push))) { for (let i = 0; i < 14; i++) { const m_ = (lo + hi) / 2; if (inB(at_(m_))) lo = m_; else hi = m_; } push = lo; } }
  const fx_ = Math.min(52, lerp(c.fov, Math.max(c.fov, 34), wf) * (1 + 0.4 * (want - push)));
  return { ...c, fov: fx_, pos: [c.pos[0] - u[0] * push, c.pos[1] - u[1] * push, c.pos[2] - u[2] * push] }; };
const KICK = [], FLASH = [];
export const camAt = (f) => {
  const S = shotAt(f), k = ctx(S, f), K = S.cam; let c;
  if (typeof K === 'function') c = K(k);
  else { const n = K.length - 1; const T = S.ease === 'out' ? eo(k.t) : S.ease === 'lin' ? k.t : 0.82 * smooth(k.t) + 0.18 * k.t; const kk = S.ck || K.map((_, i) => i / n);
    let i = 0; while (i < n - 1 && T > kk[i + 1]) i++; const u = clamp((T - kk[i]) / (kk[i + 1] - kk[i])), A = K[i], B = K[i + 1];
    const pos = n >= 2 ? spline(K.map((x) => x[0]), T) : lerp3(A[0], B[0], u); c = { pos, look: n >= 2 ? spline(K.map((x) => x[1]), T) : lerp3(A[1], B[1], u), fov: lerp(A[2] ?? 40, B[2] ?? 40, u), roll: lerp(A[3] || 0, B[3] || 0, u) }; }
  c = { ...c, pos: [...c.pos], look: [...c.look] }; c.roll = c.roll || 0;
  c = autoFrame(S, k, c);
  const hh = S.hand ?? 1; c.pos[0] += 0.006 * hh * Math.sin(f * 0.043); c.pos[1] += 0.005 * hh * Math.sin(f * 0.057 + 1); c.roll += 0.25 * hh * Math.sin(f * 0.031);
  const sc = dist(c.look, c.pos) * 0.012;
  for (const kf of (S.kicks || [])) { const d = k.lf - kf[0]; if (d >= 0 && d < 8) { const s = (d % 2 ? -1 : 1) * (kf[1] ?? 0.4) * (1 - d / 8); c.look[1] += s * 3 * sc; c.look[0] += s * 2 * sc; c.roll += s * 5; } }
  c.flash = 0; c.flashCol = '#ffffff';
  if (S.flash && k.lf < 7) { c.flash = (1 - k.lf / 7) * (S.flash === true ? 0.9 : S.flash); c.flashCol = S.flashCol || '#ffffff'; }
  const nx = SHOTS[SHOTS.indexOf(S) + 1]; if (nx && nx.flash && S.b - f < 3) { c.flash = (1 - (S.b - f) / 3) * 0.75; c.flashCol = nx.flashCol || '#ffffff'; }
  c.shadowAt = S.shadowAt || c.look; return c;
};

// ---------- actors ----------
const SPK = (key) => key.startsWith('sam') ? 'SAM' : key.startsWith('mia') ? 'MIA' : key.startsWith('linda') ? 'MOM' : key.startsWith('ray') ? 'RAY' : key === 'hollis' ? 'HOLLIS' : '';
const speakingAt = (who, f) => { for (const s of SEGS) { if (s[0] > f + 2) break; if (s[2] === who && f >= s[0] - 1 && f <= s[1] + 1) return true; } return false; };
export const SCALE = { sam1: 0.5, sam5: 0.66, sam9: 0.8, sam12: 0.9, sam15: 0.97, mia3: 0.6, mia12: 0.9, kidA: 0.95, kidB: 0.95, dee: 0.97, linda: 0.97, lindaOff: 0.97, lindaHome: 0.97, mia: 0.97, mia18: 0.97, hollis: 0.96, nurse: 0.96, neighbor: 0.95 };
export const actorsAt = (f, T) => {
  const S = shotAt(f), out = []; if (!S.act) return out; const tint = (LIGHTS[S.light] || {}).cardTint || '#ffffff';
  const A = (key, pos, o = {}, ex = {}) => { const seed = ex.seed ?? (key.length * 7 + key.charCodeAt(0)) % 23 + 1, I = idle(f, seed);
    let expr = o.expr || 'neutral'; const who = SPK(key); if (o.talk !== false && who && speakingAt(who, f) && ((f + seed) >> 2) % 2 === 0) expr = expr + '_t';
    const op = { blink: o.closed ? 1 : blinkAt(f, seed), seed: 3, ...o, expr, headTilt: Math.round(((o.headTilt || 0) + I.headTilt) * 2) / 2 };
    for (const kk of ['wv', 'step', 'lift', 'look', 'tears', 'bob', 'jarFill', 'signT', 'cordX', 'cordY', 'propDX', 'propDY']) if (typeof op[kk] === 'number') op[kk] = q(op[kk], 2);
    delete op.talk; delete op.closed;
    const s = (ex.s ?? SCALE[key] ?? 1) * (ex.k ?? 1);
    out.push({ key: key + JSON.stringify(op), draw: (p) => T.samFront(p, key, op), x: pos[0], y: pos[1] + I.bob * 0.4 * s + (ex.dy || 0), z: pos[2], s, tint, ...ex }); };
  const C = (key, draw, pos, s = 0.5, ex = {}) => out.push({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, tint, blob: false, ...ex });
  S.act(ctx(S, f), A, C, T); return out;
};
// walking helper: position along p0→p1 between local frames a..b, with step phase
export const walkP = (k, p0, p1, a, b, stride = 0.62) => { const u = clamp((k.lf - a) / Math.max(1, b - a)); const pos = lerp3(p0, p1, u); const L = dist(p0, p1) * u; const moving = k.lf > a && k.lf < b; return { pos, step: moving ? q((L / (2 * stride)) % 1, 2) : 0 }; };

// ---------- fx (2D effect cards in 3D) ----------
export const fxAt = (f, T) => { const S = shotAt(f), out = []; if (!S.fx) return out; const k = ctx(S, f);
  const FX = (key, draw, P_, s, ex = {}) => out.push({ key, draw, x: P_[0], y: P_[1] - 1.069 * s, z: P_[2], s, blob: false, shadow: false, order: 5, ...ex });
  const pop = (k0, fn, P_, s, f0, len, ex = {}) => { if (k.lf >= f0 && k.lf < f0 + len) { const t = q((k.lf - f0) / len, 2); FX(k0 + t, (p) => fn(p, t), P_, s, ex); } };
  S.fx(k, FX, pop, T); return out; };

// ---------- world state ----------
const SETL = { house: 'house', kit: 'kit', gar: 'gar', main: 'main', hosp: 'hosp', ware: 'ware' };
const wipeAt = (f) => { for (const S of SHOTS) { if (!S.wipe) continue; const t = (f - (S.a - 0.5)) / 14 + 0.5; if (t >= 0 && t <= 1) return { kind: S.wipe, x: (S.wdir || 1) * lerp(0.9, -0.9, t), y: 0.04 * Math.sin(t * 3), d: S.wd ?? 0.7, spin: (S.wspin || 0.4) * (t - 0.5) }; if (S.a > f + 10) break; } return null; };
export const worldAt = (f) => {
  const S = shotAt(f), k = ctx(S, f), L = lightFor(S, f);
  let W = { set: S.set, night: (L.glow || 0) > 0.5 || (L.night || 0) > 0.5, mowers: {} };
  if (S.set === 'kit' && W.night) W.extra = { i: 2.2, pos: [100, 1.72, 0.1], col: '#ffd8a0', dist: 7 };
  if (S.set === 'gar' && W.night) W.extra = { i: 2.6, pos: [200, 2.1, -1.8], col: '#ffd8a0', dist: 8 };
  if (S.set === 'house' && W.night) { W.extra = { i: 1.6, pos: [-3.35, 2.2, 0.4], col: '#ffd890', dist: 9 }; W.extra2 = { i: 1.2, pos: [4.3, 2.4, -1.6], col: '#ffe0a0', dist: 8 }; }
  if (S.set === 'main' && W.night) W.extra = { i: 2.0, pos: [319, 3.2, -4.5], col: '#ffe0b0', dist: 12 };
  if (S.w) W = { ...W, ...S.w(k) };
  W.wipe = wipeAt(f); return W;
};
// ---------- lens ----------
export const dofAt = (f) => { const S = shotAt(f), C = camAt(f); const k = ctx(S, f); let foc = S.focus ? (typeof S.focus === 'function' ? S.focus(k) : S.focus) : C.look; const d = dist(C.pos, foc);
  const cinf = S.cinf ?? (d < 1.2 ? 9 : d < 2.5 ? 7 : d < 5 ? 4 : d < 9 ? 2 : 0); return { focus: d, cinf }; };

// ---------- screen overlays: chapter titles, day/age tags, camcorder viewfinder, phone REC frame ----------
const font = (g, sz, w = 900, fam = 'Montserrat, Arial Black, Arial') => { g.font = `${w} ${sz}px ${fam}`; };
export const overlayAt = (f) => { const S = shotAt(f), k = ctx(S, f); const items = [];
  if (S.title) { const len = S.titleLen ?? Math.min(S.n, 110), lf = k.lf - (S.titleAt ?? 2); if (lf >= 0 && lf < len) items.push(['T', S.title, S.sub || '', q(lf / len, 2)]); }
  if (S.tag) { const len = S.tagLen ?? 66, lf = k.lf - (S.tagAt ?? 0); if (lf >= 0 && lf < len) items.push(['G', S.tag, q(lf / len, 2)]); }
  if (S.vf) items.push(['V', S.vf, Math.floor(f / 15) % 2, S.vfText || 'MAR 14  10:58 PM']);
  if (S.ov) { const o = S.ov(k); if (o) items.push(['O', JSON.stringify(o)]); }
  if (!items.length) return null; const key = JSON.stringify(items);
  return { key, draw: (g, W, H) => { for (const it of items) {
    if (it[0] === 'T') { const [, title, sub, t] = it; const a = Math.min(1, t / 0.12, (1 - t) / 0.12); const s = bk(Math.min(1, t / 0.12), 1.8); g.save(); g.globalAlpha = Math.max(0, a); g.translate(150, H - 260); g.scale(s, s); g.rotate(-0.03);
      font(g, 150); g.lineJoin = 'round'; g.lineWidth = 22; g.strokeStyle = '#141018'; g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.strokeText(title, 0, 0); g.fillStyle = '#f2c23a'; g.fillText(title, 0, 0);
      g.fillStyle = '#ffffff60'; g.save(); g.beginPath(); g.rect(0, -110, 900, 34); g.clip(); g.fillText(title, 0, 0); g.restore();
      if (sub) { font(g, 44, 800); g.lineWidth = 10; g.strokeText(sub, 8, 70); g.fillStyle = '#ffffff'; g.fillText(sub, 8, 70); }
      g.fillStyle = '#c8322e'; g.fillRect(4, 18, Math.min(1, t / 0.2) * (g.measureText(title).width * 2.6 + 40), 12); g.restore(); }
    if (it[0] === 'G') { const [, tag, t] = it; const a = Math.min(1, t / 0.12, (1 - t) / 0.15); const x = 70 - (1 - Math.min(1, t / 0.12)) * 80; g.save(); g.globalAlpha = Math.max(0, a); font(g, 48); const w = g.measureText(tag).width;
      g.fillStyle = '#141018e0'; g.beginPath(); g.roundRect(x - 22, 58, w + 44, 74, 12); g.fill(); g.fillStyle = '#f2c23a'; g.fillRect(x - 22, 58, 10, 74); g.fillStyle = '#ffffff'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(tag, x, 97); g.restore(); }
    if (it[0] === 'V') { const [, kind, blink, txt] = it; g.save(); g.strokeStyle = '#ffffffe0'; g.lineWidth = 6; const m = 70, L = 90; for (const [x, y, sx, sy] of [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]]) { g.beginPath(); g.moveTo(x, y + sy * L); g.lineTo(x, y); g.lineTo(x + sx * L, y); g.stroke(); }
      if (blink) { g.fillStyle = '#ff3a2a'; g.beginPath(); g.arc(m + 50, m + 48, 16, 0, 6.28); g.fill(); } font(g, 40, 800, 'Courier New, monospace'); g.fillStyle = '#ffffff'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('REC', m + 80, m + 50); g.textAlign = 'right'; g.fillText(kind === 'phone' ? '\u25CF 00:' + String(10 + (Math.floor(f / 30) % 50)).padStart(2, '0') : 'SP  \u25AE\u25AE\u25AE', W - m - 20, m + 50);
      g.textAlign = 'left'; g.fillText(txt, m + 20, H - m - 40); g.strokeStyle = '#ffffff80'; g.lineWidth = 3; g.beginPath(); g.moveTo(W / 2 - 30, H / 2); g.lineTo(W / 2 + 30, H / 2); g.moveTo(W / 2, H / 2 - 30); g.lineTo(W / 2, H / 2 + 30); g.stroke();
      if (kind === 'cam') { g.globalAlpha = 0.12; g.fillStyle = '#000'; for (let y = 0; y < H; y += 4) g.fillRect(0, y, W, 1); } g.restore(); }
    if (it[0] === 'O') { const o = JSON.parse(it[1]); g.save();
      if (o.rewind) { g.fillStyle = '#ffffff'; g.globalAlpha = 0.9; font(g, 120); g.textAlign = 'right'; g.textBaseline = 'top'; g.fillText('\u25C0\u25C0', W - 90, 70); g.globalAlpha = 0.18; for (let y = (f * 37) % 90; y < H; y += 90) g.fillRect(0, y, W, 6); }
      if (o.count) { font(g, 64); g.textAlign = 'right'; g.textBaseline = 'top'; g.lineWidth = 12; g.strokeStyle = '#141018'; g.lineJoin = 'round'; g.strokeText(o.count, W - 80, 80); g.fillStyle = o.col || '#f2c23a'; g.fillText(o.count, W - 80, 80); }
      g.restore(); } } } };
};
