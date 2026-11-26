// Story engine for "The $9.99 Trap" (vertical 1080x1920, adapted from the Sam 3D engine). Pure functions of the frame. Shots: story_shots.js.
import { M as E_, idle, blinkAt, q, clamp, lerp, lerp3, ramp, spline } from './motion.js';
import { SENT, SEGS } from './timing.js';
export { SENT, SEGS, E_, q, clamp, lerp, lerp3, ramp };
export const FPS = 30, TOTAL = 1184; // voice.wav 39.46 s
export const LOOP = (f, k = 1) => Math.sin(2 * Math.PI * k * f / TOTAL); // ambient motion periodic in TOTAL -> last frame flows into frame 0
export const smooth = E_.smooth, eo = E_.easeOut, ei = E_.easeIn, bk = E_.back;
export const pulse = (f, f0, len = 14) => { const t = (f - f0) / len; return t < 0 || t > 1 ? 0 : Math.sin(Math.PI * t); };
export const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
export const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

// ---------- lights ----------
const BASE = { az: 40, el: 38, sky: '#a8c8f0', ground: '#5a6a3a', hemi: 1.15, sun: '#fff0d8', sunI: 2.2, fog: '#c8d8e8', fogNear: 80, fogFar: 520, night: 0, skyTop: '#3f7fd6', skyHor: '#e8f0f8', skyTint: '#ffffff', sat: 1.08, gain: '#fffaf2',
  rimCol: '#ffd090', rimI: 1.0, coreI: 0.5, vig: 0.24, shadowExt: 18, envI: 0.35, expo: 1.0, cardTint: '#fff8ee', hazeH: 0.07, hemiK: 0.42 };
const INT = { ...BASE, fog: '#000000', fogNear: 300, fogFar: 2000, shadowExt: 6, hemiK: 0.42 };
export const LIGHTS = {
  // boutique: bright, warm-white, soft overhead key (track lights), high fill
  shop: { ...INT, az: 125, el: 66, sun: '#fff3e2', sunI: 1.55, sky: '#fff6ec', ground: '#c8a888', hemi: 2.0, gain: '#fffaf4', rimCol: '#ffe2b8', rimI: 1.0, coreI: 0.5, cardTint: '#fffaf2', sat: 1.1, vig: 0.2, envI: 0.45, shadowExt: 7 },
  // display corner: a touch warmer + more contrast (spot on the mannequins)
  disp: { ...INT, az: 100, el: 58, sun: '#ffe8cc', sunI: 1.75, sky: '#fff0e4', ground: '#b8907a', hemi: 1.75, gain: '#fff6ec', rimCol: '#ffc890', rimI: 1.25, coreI: 0.5, cardTint: '#fff6ee', sat: 1.12, vig: 0.26, envI: 0.45, shadowExt: 7 },
  // 2003 office: slightly faded, warm-paper grade, fluorescent fill
  lab: { ...INT, az: 140, el: 62, sun: '#f6f2e4', sunI: 1.35, sky: '#eeece0', ground: '#8a8270', hemi: 1.85, gain: '#fff2dc', lift: '#0a0806', rimCol: '#ffe0b0', rimI: 1.0, cardTint: '#fff4e4', sat: 0.9, vig: 0.32, envI: 0.3, shadowExt: 6 },
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
  SH.forEach((o) => { o.a = o.at != null ? o.at : Array.isArray(o.s0) ? sf(o.s0[0], o.s0[1]) - (o.lead ?? 5) : (o.s0 === 0 ? 0 : sf(o.s0) - (o.lead ?? 6)); });
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
const ROOMB = { shop: [-5.8, 5.8, -5.8, 3.8], lab: [97.2, 102.8, -2.3, 2.35] };
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
// Rick-style dutch angles on the big emotional beats (degrees)
const RKD = {}; // dutch angles are keyed per shot in story_shots.js (cam roll)
export const camAt = (f) => {
  const S = shotAt(f), k = ctx(S, f), K = S.cam; let c;
  if (typeof K === 'function') c = K(k);
  else { const n = K.length - 1; const T = S.ease === 'out' ? eo(k.t) : S.ease === 'lin' ? k.t : 0.82 * smooth(k.t) + 0.18 * k.t; const kk = S.ck || K.map((_, i) => i / n);
    let i = 0; while (i < n - 1 && T > kk[i + 1]) i++; const u = clamp((T - kk[i]) / (kk[i + 1] - kk[i])), A = K[i], B = K[i + 1];
    const pos = n >= 2 ? spline(K.map((x) => x[0]), T) : lerp3(A[0], B[0], u); c = { pos, look: n >= 2 ? spline(K.map((x) => x[1]), T) : lerp3(A[1], B[1], u), fov: lerp(A[2] ?? 40, B[2] ?? 40, u), roll: lerp(A[3] || 0, B[3] || 0, u) }; }
  c = { ...c, pos: [...c.pos], look: [...c.look] }; c.roll = c.roll || 0;
  c = autoFrame(S, k, c);
  if (globalThis.RICK_FACE !== false && RKD[S.id]) c.roll += RKD[S.id] * smooth(Math.min(1, k.lf / 10));
  const hh = S.hand ?? 1; c.pos[0] += 0.006 * hh * LOOP(f, 8); c.pos[1] += 0.005 * hh * Math.sin(2 * Math.PI * 11 * f / TOTAL + 1); c.roll += 0.25 * hh * LOOP(f, 6);
  const sc = dist(c.look, c.pos) * 0.012;
  for (const kf of (S.kicks || [])) { const d = k.lf - kf[0]; if (d >= 0 && d < 8) { const s = (d % 2 ? -1 : 1) * (kf[1] ?? 0.4) * (1 - d / 8); c.look[1] += s * 3 * sc; c.look[0] += s * 2 * sc; c.roll += s * 5; } }
  c.flash = 0; c.flashCol = '#ffffff';
  if (S.flash && k.lf < 7) { c.flash = (1 - k.lf / 7) * (S.flash === true ? 0.9 : S.flash); c.flashCol = S.flashCol || '#ffffff'; }
  const nx = SHOTS[SHOTS.indexOf(S) + 1]; if (nx && nx.flash && S.b - f < 3) { c.flash = (1 - (S.b - f) / 3) * 0.75; c.flashCol = nx.flashCol || '#ffffff'; }
  c.shadowAt = S.shadowAt || c.look; return c;
};

// ---------- actors ----------
const SPK = () => ''; // narrator only: nobody lip-syncs
const speakingAt = (who, f) => { for (const s of SEGS) { if (s[0] > f + 2) break; if (s[2] === who && f >= s[0] - 1 && f <= s[1] + 1) return true; } return false; };
export const SCALE = { shopper: 0.92, manager: 0.98, resA: 0.9, resB: 0.95 };
// ---- gait: per-shot actor paths -> walk phase that plants feet, lateral direction, arm swing, bob ----
const _paths = new Map();
const shotPaths = (S) => { let R = _paths.get(S); if (R) return R; R = []; const cum = [];
  for (let lf = 0; lf < S.n; lf++) { const k = ctx(S, S.a + lf), row = []; try { S.act(k, (key, pos, o = {}, ex = {}) => { row.push([pos[0], pos[1], pos[2], key, (ex.s ?? SCALE[key] ?? 1) * (ex.k ?? 1)]); }, _stubC, null); } catch (e) {} R.push(row);
    const prev = R[lf - 1], c = row.map((p, i) => { const q_ = prev && prev[i] && prev[i][3] === p[3] ? prev[i] : null; const d = q_ ? Math.hypot(p[0] - q_[0], p[2] - q_[2]) : 0; return (q_ && cum[lf - 1] ? cum[lf - 1][i] : 0) + (d < 0.5 ? d : 0); }); cum.push(c); }
  R = { P: R, C: cum }; if (_paths.size > 6) _paths.clear(); _paths.set(S, R); return R; };
const gaitFor = (S, lf, idx, key, cam) => { const G = shotPaths(S), row = G.P[lf]; if (!row || !row[idx] || row[idx][3] !== key) return null;
  const a = G.P[Math.max(0, lf - 1)][idx], b = G.P[Math.min(S.n - 1, lf + 1)][idx]; if (!a || !b || a[3] !== key || b[3] !== key) return null;
  const n_ = (lf > 0 ? 1 : 0) + (lf < S.n - 1 ? 1 : 0) || 1, vx = (b[0] - a[0]) / n_, vz = (b[2] - a[2]) / n_, sp = Math.hypot(vx, vz) * 30;
  const fx_ = cam.look[0] - cam.pos[0], fz_ = cam.look[2] - cam.pos[2], fl = Math.hypot(fx_, fz_) || 1, rx_ = -fz_ / fl, rz_ = fx_ / fl;
  return { sp, dir: sp > 1e-4 ? (vx * rx_ + vz * rz_) * 30 / sp : 0, cum: G.C[lf][idx], s: row[idx][4] }; };

// ---- Rick-style expression pass: per shot/actor remap of the base expression (only when RICK_FACE is on) ----
const RKX = {};
const rkExpr = (id, key, e) => { if (globalThis.RICK_FACE === false) return e; const m = RKX[id]; if (!m) return e; const a = m[key]; return (a && a[e]) || e; };
export const actorsAt = (f, T) => {
  const S = shotAt(f), out = []; if (!S.act) return out; const tint = (LIGHTS[S.light] || {}).cardTint || '#ffffff'; let _ai = -1; const _cam = camAt(f), _lf = f - S.a;
  const A = (key, pos, o = {}, ex = {}) => { _ai++; if (!o.noWalk && !o.sit && !o.run && !ex.flat) { const g = gaitFor(S, _lf, _ai, key, _cam); const intent = 'step' in o;
      if (g && g.sp > 0.25 && g.sp < 3.5 && (intent || Math.abs(pos[1]) < 0.6)) { const ph = (g.cum / (0.8 * g.s)) % 1, wd = clamp(g.dir * (ex.flip ? -1 : 1), -1, 1);
        o = { ...o, step: Math.max(0.01, ph), walking: 1, wdir: q(wd, 1), strideW: 110, bob: (o.bob || 0) + 0.018 * (0.5 - 0.5 * Math.cos(4 * Math.PI * ph)), tilt: (o.tilt || 0) + wd * 3 + 1.2 * Math.sin(2 * Math.PI * ph) };
        if ((o.L ?? 'hang') === 'hang') o.L = 'walk'; if ((o.R ?? 'hang') === 'hang') o.R = 'walk'; if (o.facing === undefined && Math.abs(wd) > 0.4) o.facing = q(wd * 0.6, 1); }
      else if (intent) o = { ...o, step: 0 }; }
    const seed = ex.seed ?? (key.length * 7 + key.charCodeAt(0)) % 23 + 1, I = idle(f, seed);
    let expr = rkExpr(S.id, key, o.expr || 'neutral'); const who = SPK(key); if (o.talk !== false && who && speakingAt(who, f) && ((f + seed) >> 2) % 2 === 0) expr = expr + '_t';
    const op = { blink: o.closed ? 1 : blinkAt(f, seed), seed: 3, ...o, expr, headTilt: Math.round(((o.headTilt || 0) + I.headTilt) * 2) / 2 };
    for (const kk of ['wv', 'step', 'lift', 'look', 'tears', 'jarFill', 'signT', 'cordX', 'cordY', 'propDX', 'propDY']) if (typeof op[kk] === 'number') op[kk] = q(op[kk], 2);
    if (typeof op.bob === 'number') op.bob = q(op.bob, 3); if (typeof op.tilt === 'number') op.tilt = q(op.tilt, 1); delete op.talk; delete op.closed;
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
const wipeAt = (f) => { for (const S of SHOTS) { if (!S.wipe) continue; const t = (f - (S.a - 0.5)) / (S.wlen || 12) + 0.5; if (t >= 0 && t <= 1) return { kind: S.wipe, x: (S.wdir || 1) * lerp(0.9, -0.9, t), y: 0.04 * Math.sin(t * 3), d: S.wd ?? 0.7, spin: (S.wspin || 0.4) * (t - 0.5) }; if (S.a > f + 20) break; } return null; };
export const worldAt = (f) => {
  const S = shotAt(f), k = ctx(S, f), L = lightFor(S, f);
  let W = { set: S.set };
  if (S.w) W = { ...W, ...S.w(k) };
  W.wipe = wipeAt(f); return W;
};
// ---------- lens ----------
export const dofAt = (f) => { const S = shotAt(f), C = camAt(f); const k = ctx(S, f); let foc = S.focus ? (typeof S.focus === 'function' ? S.focus(k) : S.focus) : C.look; const d = dist(C.pos, foc);
  const cinf = S.cinf ?? (d < 1.2 ? 9 : d < 2.5 ? 7 : d < 5 ? 4 : d < 9 ? 2 : 0); return { focus: d, cinf }; };

// ---------- screen overlays: chapter titles, day/age tags, camcorder viewfinder, phone REC frame ----------
const font = (g, sz, w = 900, fam = 'Montserrat, Arial Black, Arial') => { g.font = `${w} ${sz}px ${fam}`; };
export const overlayAt = (f) => { const S = shotAt(f), k = ctx(S, f); const o = S.ov ? S.ov(k) : null; if (!o) return null; const key = JSON.stringify(o);
  return { key, draw: (g, W, H) => { g.save();
    if (o.fact) { const a = o.fa ?? 1; g.globalAlpha = a; font(g, 36, 800, 'MXB, Montserrat, Arial'); const tw = g.measureText(o.fact).width, x = 54 - (1 - Math.min(1, a * 1.5)) * 40, y = 1418;
      g.fillStyle = '#141018c8'; g.beginPath(); g.roundRect(x - 18, y - 30, tw + 36 + 14, 60, 12); g.fill(); g.fillStyle = '#f2c23a'; g.fillRect(x - 18, y - 30, 8, 60); g.fillStyle = '#ffffff'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(o.fact, x + 4, y + 1); }
    if (o.year) { const a = o.ya ?? 1, s_ = bk(Math.min(1, a), 1.6); g.globalAlpha = Math.min(1, a * 2); g.translate(W / 2, 250); g.scale(s_, s_); g.rotate(-0.04); font(g, 120, 900, 'MB, Montserrat, Arial'); g.textAlign = 'center'; g.textBaseline = 'middle';
      g.lineJoin = 'round'; g.lineWidth = 20; g.strokeStyle = '#141018'; g.strokeText(o.year, 0, 0); g.fillStyle = '#f2c23a'; g.fillText(o.year, 0, 0); }
    g.restore(); } };
};
