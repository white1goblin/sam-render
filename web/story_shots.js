// "The $9.99 Trap" — shots. Phrase indices = work/phrases.json / timing.js comments. Frames absolute (30 fps, TOTAL 1184).
import { shot, smooth, eo, ei, bk, clamp, lerp, lerp3, q, pulse, LOOP, TOTAL } from './story_core.js';
import { S_, L_ } from './sets.js';

// ---------- helpers ----------
const sstep = (a, b, x) => smooth(clamp((x - a) / (b - a)));
const pop = (f, f0, len = 7) => (f < f0 ? 0 : bk(clamp((f - f0) / len), 2.0));
/** C1 camera through timed keys [f, pos, look, fov, roll]; zero velocity at the first/last key and at keys flagged with 'stop'. */
const hcam = (K) => (k) => { const f = k.f, V = K.map((x) => [...x[1], ...x[2], x[3] ?? 40, x[4] ?? 0]);
  const n = K.length; if (f <= K[0][0]) return out(V[0]); if (f >= K[n - 1][0]) return out(V[n - 1]);
  let i = 0; while (f > K[i + 1][0]) i++; const t0 = K[i][0], t1 = K[i + 1][0], h = t1 - t0, u = (f - t0) / h;
  const tan = (j) => { if (j === 0 || j === n - 1 || K[j][5] === 'stop') return V[j].map(() => 0); return V[j].map((_, c) => (V[j + 1][c] - V[j - 1][c]) / (K[j + 1][0] - K[j - 1][0])); };
  const m0 = tan(i), m1 = tan(i + 1), h00 = 2 * u ** 3 - 3 * u ** 2 + 1, h10 = u ** 3 - 2 * u ** 2 + u, h01 = -2 * u ** 3 + 3 * u ** 2, h11 = u ** 3 - u ** 2;
  return out(V[i].map((a, c) => h00 * a + h10 * h * m0[c] + h01 * V[i + 1][c] + h11 * h * m1[c])); };
const out = (v) => ({ pos: v.slice(0, 3), look: v.slice(3, 6), fov: v[6], roll: v[7] });

// ---------- landmarks ----------
const TAG = S_.tag, SHP0 = S_.shopper0;
const LIFT0 = -0.25; // reach lift at frame 0 == last frame
const TK = 1.2; // the bait group is scaled 1.2x (n2_shop.js)
const NINE0 = [TAG[0] - 0.038 * TK, TAG[1] + 0.03 * TK, TAG[2] + 0.02];    // the big "9" on the tag
const DRW9 = [-1.19, 0.96, 1.55];                                 // inside the open $9 drawer
const C0 = [[-1.62, 1.5, 3.25], [-1.28, 1.31, 0.4], 40];         // FRAME 0 == LAST FRAME (loop)
const MQ = S_.dspX.map((x) => [x, 0, -4.85]);                      // mannequins
const BRD = S_.dspX.map((x) => [x, 2.52, -4.8]);                   // SOLD boards
const MTAG = S_.dspX.map((x) => [x + 0.06, 1.5, -4.66]);           // dress tags
const RTAG = Array.from({ length: 7 }, (_, i) => [-3.89 + 0.47 * i, 1.28, -2.3]); // rail tags
// the bait: rest + gentle sway (periodic in TOTAL) + the yank on "trap" (f79)
const tagAt = (f) => { let y = 0, rz = 0.03 * LOOP(f, 9) + 0.012 * LOOP(f, 23), rx = 0.02 * LOOP(f, 5); const yk = f - 75;
  if (yk >= 0 && yk < 80) { y = yk < 4 ? 0.22 * eo(yk / 4) : 0.22 * Math.exp(-(yk - 4) / 11) * Math.cos((yk - 4) / 4.4); rz += 0.1 * Math.exp(-yk / 20) * Math.sin(yk / 3.2); }
  return { y, rz, rx }; };

// =============================== 0. HOOK → TAG INSERT → FILING (0-265) ===============================
shot(0, { at: 0, set: 'shop', light: 'shop', note: 'Frame 0: hanging $9.99 tag on a fishing line (hook + bobber) in the foreground, shopper behind reaching. "trap" f79: line yanks the tag up, shopper flinches. Push into the tag (left-to-right arrow, the 9 glows), the 9 flies into the $9 drawer; $10 drawer gets a red X.',
  cam: hcam([[0, ...C0], [92, [-1.6, 1.47, 3.0], [-1.32, 1.3, 0.4], 40], [136, [-1.5, 1.39, 2.32], [-1.5, 1.37, 1.2], 40], [188, [-1.48, 1.38, 2.22], [-1.49, 1.36, 1.2], 40],
    [218, [-1.47, 1.62, 3.1], [-1.07, 1.0, 1.3], 40], [240, [-1.44, 1.61, 3.05], [-1.04, 0.98, 1.3], 40], [265, [-1.4, 1.6, 3.0], [-1.02, 0.96, 1.3], 40]]), noFix: true,
  focus: (k) => k.f < 120 ? TAG : k.f < 196 ? TAG : [-1.1, 1.05, 1.4], cinf: undefined, kicks: [[79, 0.5], [222, 0.22], [248, 0.35]],
  w: (k) => { const f = k.f, t = tagAt(f); return { tag: { ...t, glow: sstep(160, 168, f) * (1 - sstep(198, 204, f)), arrow: 1.25 * clamp((f - 109) / 36), gone: sstep(198, 203, f) },
    cab: { pop: pop(f, 185, 9), d9: sstep(190, 198, f) * (1 - sstep(218, 223, f)), d10: 0.25 * pulse(f, 243, 14), shake: f >= 243 && f < 258 ? 1 : 0, x10: clamp((f - 245) / 7), brain: pulse(f, 221, 10) } }; },
  act: (k, A) => { const f = k.f; let o;
    if (f < 75) o = { expr: 'hopeful', L: 'reach', lift: LIFT0 + 0.1 * smooth(f / 74), facing: -0.5 };
    else if (f < 104) o = { expr: 'shocked', L: 'shield', R: 'up', facing: -0.3 };
    else if (f < 196) o = { expr: f < 158 ? 'skeptic' : 'wow', facing: -0.4 };
    else if (f < 243) o = { expr: 'shocked', L: 'cheek', R: 'cheek', facing: -0.2 };
    else o = { expr: 'skeptic', L: 'hip', R: 'hip', facing: -0.2 };
    if (f < 3) o.blink = 0; if (f < 199) A('shopper', lerp3(SHP0, [0.15, 0, -0.1], clamp((f - 150) / 45)), o, { dy: 0.05 * pulse(f, 75, 12) }); },
  fx: (k, FX, pp, T) => { const f = k.f;
    pp('gl0', T.fxSparkle, [TAG[0] + 0.03, TAG[1] + 0.52, TAG[2] + 0.03], 0.08, 4, 16); pp('gl1', T.fxSparkle, [TAG[0] + 0.02, TAG[1] + 0.7, TAG[2] + 0.03], 0.07, 74, 14);
    pp('g9', T.fxSparkle, [NINE0[0] + 0.12, NINE0[1] - 0.06, NINE0[2] + 0.02], 0.09, 161, 18);
    if (f >= 198 && f < 222) { const u = smooth((f - 198) / 21), lift = 0.1 * Math.sin(Math.PI * u); const p = lerp3(NINE0, DRW9, u); p[1] += lift; p[2] += 0.12 * Math.sin(Math.PI * u);
      const s = lerp(0.21, 0.12, u); FX('nine' + q(u, 2), (pn) => nineCard(pn, 1 - 0.4 * u, (1 - u) * 0.35), p, s, { order: 6 }); }
    pp('thk', T.fxPuff, [DRW9[0], DRW9[1] + 0.08, DRW9[2] + 0.1], 0.1, 221, 10); pp('xx', (p, t) => shockLines(p, t, '#ff5a4a', 10), [-0.95, 0.92, 1.6], 0.22, 246, 12); } });
// comic shock lines around the card centre (no fill disc)
const shockLines = (p, t, col = '#ffd23a', n = 14) => { const g = p.g; g.save(); g.globalAlpha = Math.min(1, (1 - t) * 2.5); g.lineCap = 'round';
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + (i % 2) * 0.12, e = eo(Math.min(1, t * 1.6)), r0 = 150 + 70 * e, r1 = r0 + (i % 2 ? 60 : 110) * (1 - 0.5 * t);
    g.strokeStyle = '#1e1820'; g.lineWidth = 26; g.beginPath(); g.moveTo(300 + Math.cos(a) * r0, 500 + Math.sin(a) * r0); g.lineTo(300 + Math.cos(a) * r1, 500 + Math.sin(a) * r1); g.stroke();
    g.strokeStyle = col; g.lineWidth = 14; g.stroke(); } g.restore(); };
const nineCard = (p, glow = 1, rot = 0) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(rot); g.font = '900 600px MB, Arial Black, Arial'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.shadowColor = '#ffb020'; g.shadowBlur = 80 * glow; g.lineJoin = 'round'; g.lineWidth = 34; g.strokeStyle = '#1e1820'; g.strokeText('9', 0, 20); g.fillStyle = '#ff7a0a'; g.fillText('9', 0, 20); g.shadowBlur = 0;
  g.globalAlpha = 0.45 * glow; g.fillStyle = '#fff3a0'; g.fillText('9', -8, 8); g.restore(); };

// =============================== 1. 2003 OFFICE (266-471) ===============================
const LB = (x, y, z) => [100 + x, y, z];
shot(6, { at: 266, set: 'lab', light: 'lab', flash: 0.95, note: 'Time jump (flash) to 2003: two researchers, name tents MIT / CHICAGO, catalogs A B C (same dress), envelopes to OUTGOING; tilt to the three catalogs, push into catalog B.',
  cam: hcam([[266, LB(0.08, 1.55, 2.38), LB(0, 1.15, -1.5), 46], [380, LB(-0.02, 1.5, 1.95), LB(0, 1.02, -1.5), 47], [418, LB(0, 1.42, 1.6), LB(0, 0.84, -1.2), 54], [445, LB(0, 1.4, 1.38), LB(0, 0.83, -1.2), 54, 0, 'stop'],
    [446, LB(0, 1.04, -0.02), LB(0, 0.9, -0.66), 42, 0, 'stop'], [471, LB(0, 0.99, -0.16), LB(0, 0.88, -0.66), 40]]), noFix: true,
  focus: (k) => k.f < 400 ? LB(0, 1.2, -1.55) : LB(0, 0.88, -0.65),
  w: (k) => { const f = k.f; return { lab: { cats: pop(f, 403, 9), tent: [clamp((f - 347) / 12), clamp((f - 372) / 12)] } }; },
  ov: (k) => { const f = k.f; return f >= 296 && f < 336 ? { year: '2003', ya: clamp((f - 296) / 8) * (1 - sstep(328, 335, f)) + (f >= 328 ? 0 : 0) } : null; },
  act: (k, A) => { const f = k.f; let a, b;
    if (f < 347) a = { expr: 'focus', R: 'hold', prop: 'catalog', catL: 'A', facing: 0.3 }; else if (f < 372) a = { expr: 'proud', R: 'wave', wv: f * 0.55, L: 'hip', facing: 0.2 };
    else if (f < 432) a = { expr: 'smile', R: 'hold', prop: 'catalog', catL: 'A', facing: 0.3 }; else a = { expr: 'happy', R: 'pointDown', facing: 0.4 };
    if (f < 372) b = { expr: 'focus', R: 'hold', prop: 'envelope', facing: -0.3 }; else if (f < 391) b = { expr: 'proud', R: 'thumb', facing: -0.1 };
    else if (f < 428) b = { expr: 'happy', R: 'out', prop: 'envelope', facing: 0.5 }; else b = { expr: 'smile', L: 'hip', R: 'pointDown', facing: -0.4 };
    A('resA', L_.resA, a); A('resB', L_.resB, b, { dy: 0.02 * pulse(f, 373, 10) }); },
  fx: (k, FX, pp, T) => { const f = k.f; pp('mit', T.fxSparkle, LB(-0.53, 0.86, -0.6), 0.12, 82, 18); pp('chi', T.fxSparkle, LB(0.53, 0.86, -0.6), 0.12, 107, 18);
    for (let i = 0; i < 3; i++) { const f0 = 393 + i * 8, u = (f - f0) / 16; if (u >= 0 && u <= 1) FX('env' + i + q(u, 2), (p) => T.fxEnv(p, u * 5 + i), lerp3(LB(0.72, 1.12, -1.35), LB(1.5, 1.75 - i * 0.12, -0.3), eo(u)), 0.16); }
    for (let i = 0; i < 3; i++) { pp('cs' + i, T.fxSparkle, LB(-0.27 + 0.27 * i, 0.98, -0.63), 0.08, 143 + i * 2, 16); pp('cz' + i, T.fxSparkle, LB(-0.24 + 0.27 * i, 0.95, -0.62), 0.07, 171 + i * 3, 14); } } });

// =============================== 2. SAME DRESS / PRICES / SALES COUNTERS (472-775) ===============================
const cntAt = (f) => [16 * smooth(clamp((f - 602) / 29)), f < 720 ? 0 : f < 736 ? 15 * clamp((f - 720) / 16) : 15 + 6 * eo(clamp((f - 736) / 13)), 17 * smooth(clamp((f - 663) / 23))];
const DISPW = (f, extra = {}) => ({ mq: { tags: [pop(f, 497), pop(f, 532), pop(f, 559)], glow39: extra.glow39 || 0 }, cnt: cntAt(f), cntWin: sstep(748, 756, f), dspL: 2.2 });
shot(9, { at: 472, set: 'shop', light: 'disp', wipe: 'page', wd: 0.55, note: 'Catalog page wipe -> the display: 3 mannequins, same teal dress. Tags pop on $34 / $39 / $44; pull back wide; flip counters tick 16 (left), 17 (right), then the $39 one runs past both to 21.',
  cam: hcam([[472, [1.48, 1.7, -1.55], [1.7, 1.6, -4.85], 46], [500, [1.64, 1.7, -1.6], [1.72, 1.6, -4.85], 46], [535, [2.38, 1.7, -1.62], [2.4, 1.6, -4.85], 46], [562, [3.1, 1.7, -1.62], [3.1, 1.6, -4.85], 46],
    [600, [2.42, 1.72, 0.22], [2.4, 1.72, -4.85], 42], [634, [2.25, 1.72, 0.12], [2.3, 1.72, -4.85], 42], [689, [2.56, 1.72, 0.06], [2.5, 1.72, -4.85], 42], [718, [2.44, 1.72, 0.0], [2.4, 1.74, -4.85], 42],
    [750, [2.4, 1.8, -0.72], [2.4, 1.86, -4.85], 42, 3], [775, [2.4, 1.74, -0.25], [2.4, 1.76, -4.85], 42, 1]]), noFix: true,
  focus: (k) => k.f < 590 ? [lerp(1.7, 3.1, clamp((k.f - 500) / 62)), 1.6, -4.8] : [2.4, 2.0, -4.85], cinf: undefined, kicks: [[277, 0.3]],
  w: (k) => DISPW(k.f), ov: (k) => { const f = k.f; return f >= 482 && f < 606 ? { fact: 'Anderson & Simester, 2003', fa: clamp((f - 482) / 8) * (1 - sstep(596, 605, f)) } : null; },
  fx: (k, FX, pp, T) => { [497, 532, 559].forEach((f0, i) => pp('tp' + i, T.fxSparkle, [MTAG[i][0] + 0.08, MTAG[i][1] + 0.12, MTAG[i][2] + 0.05], 0.12, f0 - 472, 16));
    pp('c16', T.fxSparkle, [BRD[0][0] + 0.2, BRD[0][1] + 0.15, -4.7], 0.16, 631 - 472, 14); pp('c17', T.fxSparkle, [BRD[2][0] + 0.2, BRD[2][1] + 0.15, -4.7], 0.16, 686 - 472, 14);
    pp('c21', (p, t) => shockLines(p, t), [BRD[1][0], BRD[1][1] - 0.02, -4.7], 0.5, 748 - 472, 16); pp('cf', (p, t) => T.fxConfetti(p, t, 3), [BRD[1][0], BRD[1][1] - 0.2, -4.6], 0.8, 749 - 472, 26); } });

// =============================== 3. "SOLD MORE" — SHOPPER SHOCKED, THE 9 ON $39 GLOWS (776-885) ===============================
const SHPD = [1.55, 0, -2.9];
shot(19, { at: 776, set: 'shop', light: 'disp', note: 'Whip from the counters to the shopper (low angle, dutch): googly shock on "more" f815; camera glides past her to the $39 tag, its 9 glows on "nine" f865.',
  cam: hcam([[776, [2.4, 1.74, -0.25], [2.4, 1.76, -4.85], 42, 1], [792, [0.3, 1.95, 0.2], [2.3, 1.05, -4.8], 50, -4], [834, [0.36, 1.92, 0.04], [2.3, 1.05, -4.8], 50, -5], [851, [2.45, 1.85, -0.3], [2.45, 1.42, -4.7], 46, -3],
    [872, [2.52, 1.52, -3.86], [2.47, 1.5, -4.68], 40, -2], [885, [2.52, 1.51, -3.95], [2.47, 1.5, -4.68], 40, -1.5]]), noFix: true,
  focus: (k) => k.f < 840 ? [SHPD[0], 1.45, SHPD[2]] : MTAG[1], kicks: [[39, 0.45]],
  w: (k) => DISPW(k.f, { glow39: sstep(858, 865, k.f) }),
  act: (k, A) => { const f = k.f; let o; if (f < 812) o = { expr: 'skeptic', L: 'hip', facing: 0.5 }; else if (f < 846) o = { expr: 'shocked', L: 'up', R: 'up', facing: 0.2 }; else o = { expr: 'sweat', L: 'cheek', R: 'cheek', facing: 0.4 };
    A('shopper', SHPD, o, { dy: 0.06 * pulse(f, 812, 12) }); },
  fx: (k, FX, pp, T) => { pp('sh', (p, t) => shockLines(p, t, '#ffffff', 16), [SHPD[0], 1.48, SHPD[2] - 0.1], 0.62, 812 - 776, 14); pp('n9', T.fxSparkle, [MTAG[1][0] + 0.05, MTAG[1][1] + 0.02, MTAG[1][2] + 0.04], 0.09, 861 - 776, 18); } });

// =============================== 4. MANAGER HANGS .99 TAGS / SHOPPER HUGS BAGS (886-1040) ===============================
const mgrX = (f) => lerp(-4.1, -1.2, smooth(clamp((f - 887) / 64)) * 0.25 + clamp((f - 887) / 64) * 0.75);
const RTF = RTAG.map((p, i) => { if (i === 6) return 957; for (let f = 887; f < 960; f++) if (mgrX(f) - 0.32 >= p[0]) return f; return 957; });
shot(21, { at: 886, set: 'shop', light: 'shop', wipe: 'rack', wd: 0.6, note: 'Hidden cut through hanging clothes -> the face-out rail: the smug manager walks along hanging .99 tags (pop, pop, pop); turns to camera on "Not to save you money"; the shopper bounces in hugging bags, hearts.',
  cam: hcam([[886, [-3.75, 1.55, 0.75], [-3.75, 1.28, -2.4], 44], [930, [-2.25, 1.56, 0.62], [-1.85, 1.28, -2.4], 44], [958, [-0.15, 1.62, 0.6], [-1.62, 1.32, -2.15], 48], [990, [-1.0, 1.52, 0.6], [-1.22, 1.32, -1.85], 42],
    [1016, [-0.85, 1.52, 0.72], [-0.92, 1.3, -1.7], 42], [1040, [-0.72, 1.52, 0.8], [-0.8, 1.28, -1.7], 42]]), noFix: true,
  focus: (k) => k.f < 990 ? [mgrX(k.f), 1.4, -1.85] : [-0.84, 1.35, -1.6],
  w: (k) => ({ rail: RTF.map((f0) => pop(k.f, f0, 6)) }),
  act: (k, A) => { const f = k.f, mx = mgrX(f); let m;
    if (f < 951) m = { expr: 'smug', L: 'reach', lift: 0.0, prop: 'tagHand', propHand: 'L', tagTxt: '$.99', facing: 0.6 };
    else if (f < 960) m = { expr: 'smug', R: 'reach', lift: 0.1, facing: 0.6 };
    else if (f < 1000) m = { expr: 'smug', R: 'thumb', L: 'hip', facing: 0 }; else m = { expr: 'laughR', L: 'hip', R: 'hip', facing: 0.3 };
    A('manager', [mx, 0, -1.85], m);
    if (f >= 992) { const u = clamp((f - 992) / 24); const x = lerp(0.3, -0.56, smooth(u)); A('shopper', [x, 0, lerp(-1.15, -1.35, u)], { expr: 'blushGrin', L: 'belly', R: 'belly', prop: 'bags', propAt: [0, 120], facing: -0.3, step: 0 }, { dy: f > 1016 ? 0.035 * Math.abs(Math.sin((f - 1016) * 0.28)) : 0 }); } },
  fx: (k, FX, pp, T) => { RTF.forEach((f0, i) => pp('rt' + i, T.fxSparkle, [RTAG[i][0] + 0.05, RTAG[i][1] + 0.1, RTAG[i][2] + 0.06], 0.08, f0 - 886, 12));
    pp('h1', (p, t) => T.fxHearts(p, t, 6), [-0.5, 1.75, -1.3], 0.45, 1004 - 886, 30); pp('h2', (p, t) => T.fxHearts(p, t, 5), [-0.45, 1.8, -1.3], 0.42, 1022 - 886, 18); pp('s1', T.fxSparkle, [-0.3, 1.4, -1.25], 0.12, 1012 - 886, 16); } });

// =============================== 5. LOOP: BACK TO THE BAIT (1041-1183 == frame 0) ===============================
shot(24, { at: 1041, set: 'shop', light: 'shop', wipe: 'rack', wd: 0.6, wdir: -1, note: 'Hidden cut through clothes -> the hook table again; the shopper walks back in, settles, and her hand rises toward the $9.99 tag; camera glides into the exact frame-0 framing (seamless loop).',
  cam: hcam([[1041, [-0.3, 1.62, 3.55], [-0.8, 1.3, 0.3], 44], [1105, [-1.3, 1.53, 3.4], [-1.22, 1.29, 0.4], 42], [1183, ...C0]]), noFix: true,
  focus: (k) => k.f < 1110 ? [-0.8, 1.4, 0.4] : TAG, cinf: undefined,
  w: (k) => { const t = tagAt(k.f); return { tag: { ...t, glow: 0.35 * pulse(k.f, 1066, 16) } }; },
  act: (k, A) => { const f = k.f; const u = clamp((f - 1036) / 66); const pos = lerp3([-0.25, 0, 0.25], SHP0, smooth(u)); let o;
    if (f < 1104) o = { expr: 'smile', facing: -0.4 }; else { const r = sstep(1104, 1183, f); o = { expr: f < 1140 ? 'smile' : 'hopeful', L: 'reach', lift: lerp(-1.6, LIFT0, r), facing: -0.5 }; }
    if (f > TOTAL - 4) o.blink = 0; A('shopper', pos, o); },
  fx: (k, FX, pp, T) => { pp('rg', T.fxSparkle, [TAG[0] + 0.03, TAG[1] + 0.52, TAG[2] + 0.03], 0.09, 1109 - 1041, 16); pp('rg2', T.fxSparkle, [TAG[0] + 0.12, TAG[1] - 0.02, TAG[2] + 0.03], 0.1, 1066 - 1041, 16); } });
