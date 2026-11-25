
// ---------------- "The Dating Site Nobody Wanted" cast (our own designs) — appended after roman.js in toon.js ----------------
// Founders and the zoo guy are drawn ONLY from behind (back of head, hoodie, chair). No faces, no likeness.
FACE.hopeful = { eye: ["dot", "dot"], brow: [-4, -4], mouth: "smileWide" };
FACE.sad = { eye: ["dot", "dot"], brow: [5, 5], mouth: "frown" };
FACE.meh = { eye: ["lid", "lid"], brow: [2, -2], mouth: "dash" };
FACE.sigh2 = { eye: ["dash", "dash"], brow: [4, 4], mouth: "wave" };
FACE.happy2 = { eye: ["happy", "happy"], brow: [-3, -3], mouth: "smileWide" };
FACE.wow = { eye: ["shock", "shock"], brow: [-6, -6], mouth: "O" };
const YT_U = 1, YT_L = rad(-120);
const HOODIES = {
  A: { hood: "#c8463c", hair: "#1c1418", style: "spiky", skin: "#f0c8a6" },
  B: { hood: "#3f63a8", hair: "#5a3a26", style: "short", skin: "#f3d2b4", phones: "#2a2a30" },
  C: { hood: "#3f8a5a", hair: "#241a16", style: "curly", skin: "#d9a57c" },
  L: { hood: "#2f7a6a", hair: "#4a3020", style: "short", skin: "#f0c8a6" },
  Z: { hood: "#f2b23a", hair: "#3a2a1e", style: "cap", cap: "#2f6fa8", skin: "#f0c8a6", tee: true },
};
/** back of a head: ears, hair cap, optional headphones / baseball cap. */
const backHead = (p, O, hx, hy, a, b, thick) => {
  const ow = 10;
  for (const s of [-1, 1]) p.ell(hx + s * a * 0.98, hy + b * 0.12, a * 0.17, b * 0.26, O.skin, ow * 0.8);
  const H = { a, b, nTop: 1.8, nBot: 2.3, egg: -0.1, asym: 0, rot: 0, noise: 0.01, seed: 4 };
  const hp = blobPts(hx, hy, H);
  p.shadedFill(hp, O.skin, mul(O.skin, SH_SKIN), YT_L, a);
  // hair covers all but a crescent of nape
  const hair = blobPts(hx, hy - b * 0.1, { ...H, a: a * 1.03, b: b * 0.98, noise: O.style === "curly" ? 0.05 : 0.012, seed: 9 });
  p.clip(hp.concat([]), () => {});
  p.shadedFill(hair, O.hair, mul(O.hair, [0.55, 0.55, 0.65]), YT_L, a * 1.1, 0.5);
  p.clip(hair, () => { for (let i = -6; i <= 6; i++) p.stroke([[hx + i * a * 0.14, hy - b * 0.9], [hx + i * a * 0.16 + 6, hy + b * 0.6]], 3, mul(O.hair, [1.5, 1.5, 1.5]) + "55"); });
  p.inkRing(hp, ow, thick); p.inkRing(hair, ow * 0.9, thick);
  if (O.style === "spiky") { for (let i = -3; i <= 3; i++) { const x = hx + i * a * 0.26, y = hy - b * 0.92 + Math.abs(i) * 8; p.poly([[x - 22, y + 20], [x + 4 + i * 3, y - 34], [x + 22, y + 20]], O.hair, 7); } }
  if (O.style === "curly") { for (let i = 0; i < 14; i++) { const t = Math.PI * (1.05 + 0.9 * i / 13); p.ell(hx + Math.cos(t) * a * 0.98, hy - b * 0.1 + Math.sin(t) * b * 0.92, 24, 22, O.hair, 7); } }
  if (O.phones) { p.band(ellPts(hx, hy + b * 0.05, a * 1.06, b * 1.04, 192, 348, 0, 24), O.phones, 16, 4, "round"); for (const s of [-1, 1]) p.ell(hx + s * a * 1.02, hy + b * 0.1, a * 0.2, b * 0.3, O.phones, 9); }
  if (O.style === "cap") { const cp = ellPts(hx, hy - b * 0.18, a * 1.06, b * 0.86, 180, 360, 0, 30); cp.push([hx + a * 1.06, hy - b * 0.1], [hx - a * 1.06, hy - b * 0.1]);
    p.shadedFill(cp, O.cap, mul(O.cap, [0.6, 0.6, 0.7]), YT_L, a); p.inkRing(cp, ow, thick); p.poly(rrect(hx - a * 0.3, hy - b * 0.24, hx + a * 0.3, hy - b * 0.06, 10), "#f2efe6", 6); p.dot(hx, hy - b * 1.02, 10, mul(O.cap, [0.7, 0.7, 0.8])); }
};
/** founder seen from behind. opts: who A/B/C/Z, pose type|up|head|hang|point|cheer, seated, ph (typing phase), headTilt, lean, bob, step */
export const founderBack = (p, opts = {}) => {
  const O = HOODIES[opts.who || "A"], seated = opts.seated !== false && opts.who !== "Z", pose = opts.pose || "type", thick = thickAngle(YT_L), ow = 10;
  const bob = (opts.bob || 0) * 300, cx = 300 + (opts.lean || 0) * 20;
  const seatY = seated ? 760 : 700, shY = (seated ? 560 : 505) - bob, hy = shY - 100, a = 96, b = 90;
  const legCol = "#3a4a6a";
  if (opts.empty) { p.stroke([[300, 790], [300, 925]], 22, INK); p.stroke([[300, 790], [300, 925]], 12, "#5a5a64");
    for (const [x1, y1] of [[180, 950], [420, 950], [250, 965], [350, 965], [300, 945]]) { p.stroke([[300, 930], [x1, y1]], 18, INK); p.stroke([[300, 930], [x1, y1]], 9, "#4a4a54"); p.ell(x1, y1 + 10, 13, 11, "#2a2a30", 5); }
    p.poly(rrect(190, 750, 410, 795, 18), "#3a3a44", ow); p.stroke([[300, 760], [300, 700]], 30, INK); p.stroke([[300, 760], [300, 700]], 16, "#4a4a54");
    const cb = rrect(196, 600, 404, 735, 34); p.gradFill(cb, "#4a4a56", "#2a2a32", YT_L); p.inkRing(cb, ow, thick); return; }
  if (seated && !opts.noChair) { // office chair base (drawn first, behind)
    p.stroke([[300, 790], [300, 925]], 22, INK); p.stroke([[300, 790], [300, 925]], 12, "#5a5a64");
    for (const [x1, y1] of [[180, 950], [420, 950], [250, 965], [350, 965], [300, 945]]) { p.stroke([[300, 930], [x1, y1]], 18, INK); p.stroke([[300, 930], [x1, y1]], 9, "#4a4a54"); p.ell(x1, y1 + 10, 13, 11, "#2a2a30", 5); }
    p.poly(rrect(190, 750, 410, 795, 18), "#3a3a44", ow);
  } else {
    const st = opts.step || 0;
    for (const s of [-1, 1]) { const up = st ? Math.max(0, Math.sin(Math.PI * 2 * (st + (s > 0 ? 0.5 : 0)))) * 26 : 0;
      p.stroke([[cx + s * 40, 690], [cx + s * 46, 955 - up]], 60, INK); p.stroke([[cx + s * 40, 690], [cx + s * 46, 955 - up]], 44, O.tee ? "#4a6a9a" : legCol);
      p.ell(cx + s * 48, 958 - up, 36, 20, "#2a2224", 7); p.ell(cx + s * 48, 950 - up, 26, 8, "#f2efe6", 0); }
  }
  // torso (hoodie, back)
  const T = { a: 118, b: (seatY - shY) / 2 + 12, nTop: 2.0, nBot: 2.8, egg: 0.08, asym: 0, rot: 0, noise: 0.008, seed: 21 };
  const tcy = (seatY + shY) / 2 + 6, tp = blobPts(cx, tcy, T);
  const S = (s) => [cx + s * 96, shY + 26];
  const arm = (s) => { const sh = S(s), ph = opts.ph || 0;
    switch (pose) {
      case "type": { const j = 6 * Math.sin(ph * 6.283 + (s > 0 ? 1.7 : 0)); return { pts: [sh, [cx + s * 150, shY + 120 + j], [cx + s * 118, shY + 150 + j]], hand: false }; }
      case "up": case "cheer": { const w = pose === "cheer" ? 14 * Math.sin((opts.ph || 0) * 6.283 + s) : 0; return { pts: [sh, [cx + s * 168, shY - 70 + w], [cx + s * 190, shY - 190 + w]], hand: true }; }
      case "head": return { pts: [sh, [cx + s * 178, shY - 40], [cx + s * 70, hy - 40]], hand: true, late: true };
      case "pull": return s > 0 ? { pts: [sh, [cx + 150, shY + 120], [cx + 128, shY + 236]], hand: true } : { pts: [sh, [cx - 132, shY + 120], [cx - 128, shY + 228]], hand: true };
      case "drop": return s > 0 ? { pts: [sh, [cx + 168, shY - 10], [cx + 96, shY - 120]], hand: true } : { pts: [sh, [cx - 132, shY + 120], [cx - 128, shY + 228]], hand: true };
      case "table": return { pts: [sh, [cx + s * 150, shY + 110], [cx + s * 96, shY + 120]], hand: true };
      case "reach": { const k = Math.max(0, Math.min(1, opts.k ?? 1)); if (s < 0) return { pts: [sh, [cx - 132, shY + 120], [cx - 128, shY + 230]], hand: true };
        const H0 = [[cx + 132, shY + 120], [cx + 128, shY + 230]], H1 = [[cx + 200, shY - 10], [cx + 280, shY - 150 + (opts.dip || 0)]]; const L_ = (a, b) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
        return { pts: [sh, L_(H0[0], H1[0]), L_(H0[1], H1[1])], hand: true }; }
      case "jerk": return s > 0 ? { pts: [sh, [cx + 175, shY - 10], [cx + 150, shY - 110]], hand: true } : { pts: [sh, [cx - 150, shY + 60], [cx - 170, shY - 30]], hand: true };
      case "point": return s > 0 ? { pts: [sh, [cx + 170, shY - 20], [cx + 215, shY - 110]], hand: true } : { pts: [sh, [cx - 150, shY + 120], [cx - 118, shY + 150]], hand: false };
      default: return { pts: [sh, [cx + s * 132, shY + 120], [cx + s * 128, seated ? shY + 200 : shY + 230]], hand: true };
    } };
  const arms = [arm(-1), arm(1)];
  const drawArm = (A) => { const c = curve(A.pts[0], A.pts[1], A.pts[2]); p.stroke(c, 58, INK); p.stroke(c, 42, mul(O.hood, [0.92, 0.92, 0.95]));
    if (A.hand) p.ell(A.pts[2][0], A.pts[2][1], 22, 22, O.skin, 7); else p.ell(A.pts[2][0], A.pts[2][1], 22, 20, mul(O.hood, [0.8, 0.8, 0.85]), 7); };
  for (const A of arms) if (!A.late) drawArm(A);
  p.gradFill(tp, O.hood, mul(O.hood, SH_CLOTH), YT_L);
  p.clip(tp, () => { // hoodie details from behind: centre seam, folded hood, waistband
    p.stroke([[cx, shY + 70], [cx, seatY + 20]], 3, mul(O.hood, [0.7, 0.7, 0.75]));
    p.band([[cx - 140, seatY - 10], [cx + 140, seatY - 10]], mul(O.hood, [0.8, 0.8, 0.85]), 26, 3);
    if (O.tee) { p.stroke([[cx - 80, shY + 30], [cx - 60, seatY]], 4, "#00000022"); }
    for (const s of [-1, 1]) p.stroke([[cx + s * 60, shY + 60], [cx + s * 80, seatY - 30]], 5, "#00000018");
  });
  p.inkRing(tp, ow, thick);
  if (!O.tee) { const hood = ellPts(cx, shY + 22, 92, 52, 0, 360, 0, 36); p.shadedFill(hood, mul(O.hood, [0.86, 0.86, 0.9]), mul(O.hood, [0.6, 0.6, 0.66]), YT_L, 90); p.inkRing(hood, 8, thick);
    p.stroke(ellPts(cx, shY + 14, 60, 28, 20, 160, 0, 16), 4, mul(O.hood, [0.55, 0.55, 0.6])); }
  else p.poly(ellPts(cx, shY + 4, 52, 16, 0, 180, 0, 16), "#e0a230", 6);
  // neck + head
  const ht = opts.headTilt || 0;
  p.rot = ht ? [rad(ht), cx, shY + 10] : null;
  p.poly(rrect(cx - 30, hy + 50, cx + 30, shY + 20, 12), O.skin, 7);
  backHead(p, O, cx, hy, a, b, thick);
  p.rot = null;
  for (const A of arms) if (A.late) drawArm(A);
  if (opts.env) { const [ex, ey] = arms[1].pts[2]; const g = p.g; g.save(); g.translate(ex, ey - 30); g.rotate(-0.25); p.poly(rrect(-62, -40, 62, 40, 6), "#f4ead0", 8); p.stroke([[-58, -36], [0, 6], [58, -36]], 5, "#b8a47e"); p.poly(rrect(30, -32, 54, -6, 2), "#c8322e", 3); g.restore(); p.ell(ex, ey, 22, 22, O.skin, 7); }
  if (seated && !opts.noChair) { // chair back over the lower torso
    p.stroke([[300, 760], [300, 700]], 30, INK); p.stroke([[300, 760], [300, 700]], 16, "#4a4a54");
    const cb = rrect(196, 640, 404, 735, 34); p.gradFill(cb, "#4a4a56", "#2a2a32", YT_L); p.inkRing(cb, ow, thick);
    p.stroke([[214, 662], [386, 662]], 3, "#ffffff22");
  }
};
/** the mascot: a little heart character. opts: expr, L/R arm (hang|wave|cross|up|rose|shrug), d (deflate 0..1), blink, look, wv, flat */
export const heartBuddy = (p, opts = {}) => {
  const d = opts.d || 0, g = p.g, thick = thickAngle(YT_L), wv = opts.wv || 0;
  const k = 12.5, cy = 560 + d * 110, sx = 1 + 0.18 * d, sy = 1 - 0.42 * d;
  const pts = []; for (let i = 0; i <= 90; i++) { const t = i / 90 * Math.PI * 2, x = 16 * Math.pow(Math.sin(t), 3), y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const wob = d > 0 ? 1 + 0.03 * d * Math.sin(t * 7) : 1; pts.push([300 + x * k * sx * wob, cy - (y + 2) * k * sy * wob]); }
  const bot = cy + 15 * k * sy, armY = cy - 1 * k * sy;
  // legs
  for (const s of [-1, 1]) { p.stroke([[300 + s * 46, bot - 40], [300 + s * 58, 960]], 34, INK); p.stroke([[300 + s * 46, bot - 40], [300 + s * 58, 960]], 18, "#c4203e"); p.ell(300 + s * 70, 962, 40, 20, "#3a2430", 7); }
  const armPts = (s, pose) => { const x0 = 300 + s * 175 * sx;
    switch (pose) {
      case "wave": return [[x0, armY], [x0 + s * 70, armY - 90], [x0 + s * (70 + 30 * Math.sin(wv)), armY - 200]];
      case "up": return [[x0, armY], [x0 + s * 80, armY - 100], [x0 + s * 100, armY - 220]];
      case "cross": return [[x0, armY + 30], [x0 - s * 30, armY + 150], [300 - s * 50, armY + 175]];
      case "rose": return [[x0, armY], [x0 + s * 70, armY + 60], [x0 + s * 40, armY - 40]];
      case "shrug": return [[x0, armY], [x0 + s * 90, armY + 20], [x0 + s * 120, armY - 60]];
      default: return [[x0, armY], [x0 + s * 40, armY + 90], [x0 + s * 30, armY + 190]];
    } };
  const L = opts.L || "hang", R = opts.R || "hang", la = armPts(-1, L), ra = armPts(1, R);
  const drawA = (a) => { const c = curve(a[0], a[1], a[2]); p.stroke(c, 32, INK); p.stroke(c, 16, "#c4203e"); p.ell(a[2][0], a[2][1], 24, 24, "#fbf4ee", 7); };
  if (L !== "cross") drawA(la); if (R !== "cross") drawA(ra);
  p.gradFill(pts, "#ff4a63", "#c4203e", YT_L); p.inkRing(pts, 13, thick);
  p.ell(220, cy - 120 * sy, 40, 26, "#ffffffaa", 0, 0, 360, -30);
  if (d > 0.2) { g.save(); g.globalAlpha = Math.min(1, d); for (let i = 0; i < 3; i++) p.stroke([[200 + i * 90, bot - 150 - i * 10], [230 + i * 90, bot - 120 - i * 14]], 5, "#8a1a30"); g.restore(); }
  // face
  const hc = cy - 30 * sy, lid = lidOf(opts.blink || 0);
  faceFront(p, 300, hc, 290, opts.expr || "smile", 0, opts.look || 0, lid, false, "#ff4a63", null, false);
  for (const s of [-1, 1]) { g.save(); g.globalAlpha = 0.45; p.ell(300 + s * 70, hc + 34, 22, 12, "#ffb0c0", 0); g.restore(); }
  if (L === "cross") drawA(la); if (R === "cross") drawA(ra);
  if (R === "rose" || opts.rose) { const [hx, hy] = ra[2], dr = opts.droop || 0; const tip = [hx + 30 + dr * 60, hy - 120 + dr * 70];
    p.stroke(curve([hx, hy + 20], [hx + 20, hy - 60], tip), 14, INK); p.stroke(curve([hx, hy + 20], [hx + 20, hy - 60], tip), 7, "#3f8a3a");
    p.poly([[hx + 8, hy - 40], [hx + 50, hy - 70], [hx + 22, hy - 30]], "#4f9a44", 5);
    p.ell(tip[0], tip[1], 34, 30, "#d8203a", 7); p.ell(tip[0] - 6, tip[1] - 6, 18, 14, "#a8102a", 4); p.ell(tip[0], tip[1], 24 * 0.5, 22 * 0.5, null, 3);
    p.ell(hx, hy, 24, 24, "#fbf4ee", 7); }
};
/** front-view cartoon elephant (body + head + ears; the long trunk is a 3D tube in the world). opts: flap, expr (happy|wow), baby, trunkStub */
export const elephantCard = (p, opts = {}) => {
  const g = p.g, thick = thickAngle(YT_L), fl = opts.flap || 0, col = "#9aa3b2", dk = "#6a7284"; g.save(); g.translate(300, 975); g.scale(0.78, 0.78); g.translate(-300, -975);
  // back legs
  for (const s of [-1, 1]) { p.poly(rrect(300 + s * 150 - 42, 700, 300 + s * 150 + 42, 940, 30), mul(col, [0.82, 0.82, 0.86]), 10); }
  const body = blobPts(300, 700, { a: 210, b: 170, nTop: 2.2, nBot: 2.4, egg: 0.05, asym: 0, rot: 0, noise: 0.01, seed: 3 });
  p.gradFill(body, col, dk, YT_L); p.inkRing(body, 12, thick);
  for (const s of [-1, 1]) { const lg = rrect(300 + s * 70 - 52, 760, 300 + s * 70 + 52, 965, 36); p.gradFill(lg, col, dk, YT_L); p.inkRing(lg, 11, thick);
    for (let k = 0; k < 3; k++) p.ell(300 + s * 70 + (k - 1) * 28, 955, 14, 9, "#eef0f2", 5); }
  // ears
  for (const s of [-1, 1]) { const ep = blobPts(300 + s * 175, 430, { a: 135 + 12 * fl * s, b: 160, nTop: 2.2, nBot: 1.8, egg: 0.2, asym: 0, rot: rad(s * (14 + 10 * fl)), noise: 0.02, seed: 7 + s });
    p.gradFill(ep, mul(col, [1.02, 1.0, 1.0]), dk, YT_L); p.inkRing(ep, 11, thick);
    p.clip(ep, () => p.ell(300 + s * 185, 440, 85, 105, "#e7b8bf", 0)); }
  const head = blobPts(300, 420, { a: 135, b: 140, nTop: 1.9, nBot: 2.2, egg: -0.15, asym: 0, rot: 0, noise: 0.008, seed: 5 });
  p.shadedFill(head, mul(col, [1.06, 1.06, 1.05]), dk, YT_L, 140); p.inkRing(head, 12, thick);
  // eyes
  const ex = (opts.look || 0) * 6;
  for (const s of [-1, 1]) { if (opts.expr === "happy") p.arc(300 + s * 58, 400, 20, 16, 200, 340, 9); else { p.ell(300 + s * 58 + ex, 395, 17, 22, "#1a1620", 0); p.dot(300 + s * 58 + ex - 5, 386, 6, "#ffffff"); }
    p.stroke([[300 + s * 36, 352 - (opts.expr === "wow" ? 12 : 0)], [300 + s * 80, 360 - (opts.expr === "wow" ? 14 : 0)]], 8); }
  for (const s of [-1, 1]) { g.save(); g.globalAlpha = 0.4; p.ell(300 + s * 92, 450, 22, 12, "#ff9aa8", 0); g.restore(); }
  // tusks + trunk root
  for (const s of [-1, 1]) p.poly([[300 + s * 40, 480], [300 + s * 70, 520], [300 + s * 82, 500], [300 + s * 58, 470]], "#fbf6ea", 7);
  if (opts.trunkStub) { const tl = opts.trunkStub; const pts = [[255, 440], [345, 440], [330, 440 + tl], [270, 440 + tl]]; p.gradFill(pts, col, dk, YT_L); p.poly(pts, null, 0);
    p.stroke([[262, 440], [272, 440 + tl]], 10); p.stroke([[338, 440], [328, 440 + tl]], 10); p.ell(300, 440 + tl, 30, 14, "#7a8292", 8);
    for (let k = 1; k < 5; k++) p.arc(300, 440 + tl * k / 5, 32, 8, 20, 160, 4, "#5a6274"); }
  g.restore();
};
/** heart balloon on a string. opts: d (deflate), col */
export const fxBalloon = (p, o = {}) => { const d = o.d || 0, col = o.col || "#ff4a63", k = 12 * (1 - 0.35 * d), cy = 360 + d * 120, thick = thickAngle(YT_L);
  const pts = []; for (let i = 0; i <= 80; i++) { const t = i / 80 * Math.PI * 2, x = 16 * Math.pow(Math.sin(t), 3), y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t); pts.push([300 + x * k * (1 + 0.1 * d), cy - y * k * (1 - 0.2 * d)]); }
  const bt = cy + 17 * k; p.stroke(curve([300, bt], [300 + 30 * Math.sin((o.sw || 0)), (bt + 975) / 2], [300, 975]), 4, "#5a4a50");
  p.gradFill(pts, col, mul(col, [0.7, 0.6, 0.7]), YT_L); p.inkRing(pts, 10, thick); p.poly([[290, bt], [310, bt], [300, bt + 14]], col, 5); p.ell(240, cy - 80, 26, 16, "#ffffffaa", 0, 0, 360, -30); };
export const fxHearts = (p, t, n = 7) => { const g = p.g; g.save(); for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (i - (n - 1) / 2) * 0.42, r = 60 + 330 * M_back(t, 1.2), x = 300 + Math.cos(a) * r, y = 560 + Math.sin(a) * r * 1.1, s = 0.24 + 0.1 * (i % 3);
    g.globalAlpha = Math.max(0, Math.min(1, 1.6 - t * 1.4)); g.save(); g.translate(x, y); g.scale(s, s); g.rotate(0.3 * Math.sin(i * 2 + t * 4)); g.translate(-300, -520); fxHeartPlain(p); g.restore(); } g.restore(); };
const fxHeartPlain = (p, col = "#ff4a63") => { const pts = []; for (let i = 0; i <= 60; i++) { const t = i / 60 * Math.PI * 2, x = 16 * Math.pow(Math.sin(t), 3), y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t); pts.push([300 + x * 11, 500 - y * 11]); }
  p.gradFill(pts, col, mul(col, [0.75, 0.6, 0.7]), YT_L); p.inkRing(pts, 14, 0.6); p.ell(240, 430, 28, 18, "#ffffffaa", 0, 0, 360, -30); };
export const fxHeartOne = (p, col) => fxHeartPlain(p, col);
export const fxTumble = (p, a = 0) => { const g = p.g; g.save(); g.translate(300, 800); g.rotate(a); g.translate(-300, -800);
  for (let i = 0; i < 26; i++) { const r0 = 60 + (i * 37) % 110, t0 = i * 2.39, pts = []; for (let k = 0; k < 9; k++) { const tt = t0 + k * 0.55, rr = r0 + 25 * Math.sin(k * 1.7 + i); pts.push([300 + Math.cos(tt) * rr, 800 + Math.sin(tt) * rr * 0.95]); } p.stroke(pts, 9, INK); p.stroke(pts, 4.5, i % 3 ? "#b08a52" : "#8a6a3a"); }
  g.restore(); };
export const fxCricket = (p, t = 0, chirp = 0) => { const thick = thickAngle(YT_L);
  for (const s of [-1, 1]) { p.stroke([[300 + s * 30, 880], [300 + s * 110, 800], [300 + s * 140, 960]], 12, INK); p.stroke([[300 + s * 30, 880], [300 + s * 110, 800], [300 + s * 140, 960]], 5, "#3f7a2e"); }
  const b = blobPts(300, 880, { a: 120, b: 52, nTop: 2, nBot: 2.4, egg: 0, asym: 0, rot: 0, noise: 0.01, seed: 2 }); p.gradFill(b, "#5aa63c", "#2f6a24", YT_L); p.inkRing(b, 9, thick);
  p.ell(190, 860, 46, 42, "#5aa63c", 9); p.ell(178, 852, 11, 13, "#ffffff", 4); p.dot(175, 853, 6);
  for (const s of [0, 1]) p.stroke(curve([170, 825], [120 - s * 30, 720], [60 + s * 40 + 10 * Math.sin(t * 9), 650]), 5);
  p.poly([[230, 840], [420, 850 - 18 * chirp], [400, 890]], "#7ac454", 7);
  if (chirp > 0) { const g = p.g; g.save(); g.globalAlpha = chirp; for (let k = 0; k < 3; k++) p.arc(330, 760, 40 + k * 34, 40 + k * 34, -130, -50, 8, "#ffffff"); g.restore(); } };
/** the buyer: only a dark suit sleeve + hand, gripping the edge of something (right side of card) */
export const fxGrip = (p) => { const y = 520;
  p.poly([[640, y - 70], [360, y - 58], [350, y + 62], [640, y + 78]], "#1c1c24", 12); p.poly([[366, y - 58], [330, y - 52], [324, y + 52], [358, y + 60]], "#f6f4ee", 8); p.ell(346, y - 2, 5, 5, "#e3b23c", 0);
  p.ell(292, y + 6, 46, 44, "#f0c8a6", 10); for (let k = 0; k < 4; k++) p.ell(250 - k * 3, y - 24 + k * 16, 18, 9, "#f0c8a6", 7); p.ell(286, y - 38, 24, 11, "#f0c8a6", 7, 0, 360, -30); };
export const fxQ = (p, t = 1) => { const k = M_back(t, 1.6), g = p.g; g.save(); g.translate(300, 500); g.scale(k, k); g.translate(-300, -500); g.textAlign = "center"; g.textBaseline = "middle"; g.font = "900 420px Arial Black, Arial"; g.lineWidth = 40; g.strokeStyle = INK; g.lineJoin = "round"; g.strokeText("?", 300, 520); g.fillStyle = "#ffffff"; g.fillText("?", 300, 520); g.restore(); };
export const fxPetal = (p, a = 0) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(a); g.translate(-300, -500); p.poly(ellPts(300, 500, 150, 90, 0, 360, 0, 30), "#d8203a", 16); p.stroke(ellPts(300, 500, 90, 40, 200, 340, 0, 12), 8, "#a8102a"); g.restore(); };
