
// ---------------- Rick-style hair / beard / moustache / expression upgrade (appended last in toon.js) ----------------
// Gated by globalThis.RICK_FACE === true so the shipped video is unchanged until we switch it on.
const RK = () => globalThis.RICK_FACE !== false;

// closed Catmull-Rom through control points
const crSmooth = (P, closed = true, n = 6) => {
  const out = [], m = P.length, g = (i) => P[closed ? (i + m) % m : Math.max(0, Math.min(m - 1, i))];
  for (let i = 0; i < (closed ? m : m - 1); i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t;
      out.push([0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
                0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]); }
  }
  if (!closed) out.push(P[m - 1]);
  return out;
};

FACE.smug = { eye: ["lid", "lid"], brow: [3, 0], browR: [-4, -7], mouth: "smirkSide" };
FACE.skeptic = { eye: ["slit", "lid"], brow: [4, 2], browR: [-5, -3], mouth: "flat" };
FACE.worried = { eye: ["dot", "dot"], brow: [-6, 1], mouth: "worry" };
FACE.determined = { eye: ["lid", "lid"], brow: [6, 1], mouth: "flat" };
FACE.proud = { eye: ["happy", "happy"], brow: [-3, -2], mouth: "smileWide" };
FACE.sadR = { eye: ["dot", "dot"], brow: [-6, 2], mouth: "frown" };
FACE.awkward = { eye: ["googly", "googly"], brow: [-4, 0], browR: [-1, -1], mouth: "gritGrin" };
FACE.shocked = { eye: ["googly", "googly"], brow: [-8, -6], mouth: "O" };
FACE.laughR = { eye: ["happy", "happy"], brow: [-4, -3], mouth: "laugh" };
FACE.angryR = { eye: ["dot", "dot"], brow: [8, 0], mouth: "gritGrin" };

/** extra mouths (called from mouth() default via build patch) */
const rickMouth = (p, kind, mx, my, u, k = 1) => {
  const mw = 4 * u;
  switch (kind) {
    case "smirkSide": p.stroke(crSmooth([[mx - 7 * u * k, my + 0.5 * u], [mx, my + 1 * u], [mx + 6 * u * k, my - 1.5 * u], [mx + 9 * u * k, my - 5 * u]], false, 6), mw); return true;
    case "flat": p.stroke([[mx - 4.5 * u * k, my], [mx + 4.5 * u * k, my]], mw); return true;
    case "worry": p.stroke(crSmooth([[mx - 7 * u * k, my + 3 * u], [mx - 2 * u * k, my - 1 * u], [mx + 3 * u * k, my + 1 * u], [mx + 7 * u * k, my - 1 * u]], false, 6), 3.4 * u); return true;
    case "gritGrin": {
      const w = 12 * u * k, h = 5 * u, q = crSmooth([[mx - w, my - h * 0.6], [mx, my - h], [mx + w, my - h * 0.6], [mx + w * 0.9, my + h * 0.7], [mx, my + h], [mx - w * 0.9, my + h * 0.7]], true, 5);
      p.poly(q, WHITE, 0); p.clip(q, () => { p.stroke([[mx - w, my], [mx + w, my]], 1.5 * u); for (let j = -2; j <= 2; j++) p.stroke([[mx + j * 4.6 * u * k, my - h], [mx + j * 4.6 * u * k, my + h]], 1.5 * u); });
      p.poly(q, null, 3 * u); return true; }
  }
  return false;
};

/** Rick-style hair: a puffy cap that sits proud of the skull, clumpy fringe, two-tone shading, a highlight and one strand line */
const rickHair = (p, O, H, cx, hc, light, facing, seed, u, ow) => {
  const a = H.a, b = H.b, col = O.hair, style = O.hairStyle || "swoop", f = facing || 0;
  const s = O.part || (f || 1), fc = cx + 7 * u * f; // part side, face centre
  const puff = style === "curly" ? 1.13 : 1.11, top = [];
  for (let th = 196; th <= 344; th += 4) { const r = rad(th), w = style === "curly" ? 1 + 0.05 * Math.abs(Math.sin(r * 9 + seed)) : 1 + 0.012 * Math.sin(r * 5 + seed);
    top.push([cx + puff * a * w * Math.cos(r) + 0.04 * a * s * (1 + Math.sin(r)), hc - 0.05 * b + 1.09 * b * w * Math.sin(r)]); }
  const R0 = top[top.length - 1], L0 = top[0];
  const N = style === "bowl" ? 5 : style === "curly" ? 7 : 3, depth = (style === "bowl" ? 0.1 : 0.19) * a, fr = [];
  const yMid = hc - 0.72 * a, slant = style === "bowl" ? 0 : 0.1 * a;
  const M = 40;
  for (let i = 1; i < M; i++) { const t = i / M, x = R0[0] + (L0[0] - R0[0]) * t;
    const edge = Math.pow(Math.abs(2 * t - 1), 2.2); // 0 middle .. 1 sides
    let y = yMid * (1 - edge) + (R0[1] * (1 - t) + L0[1] * t) * edge + slant * (s > 0 ? (1 - t) - 0.5 : t - 0.5) * -1;
    let v = (t * N) % 1; v = s > 0 ? Math.pow(v, 0.75) : 1 - Math.pow(1 - v, 0.75);
    y += depth * Math.pow(Math.sin(Math.PI * v), 0.7) * (1 - 0.6 * edge);
    fr.push([x, y]); }
  const poly = [...top, ...fr];
  const dark = mul(col, [0.68, 0.66, 0.7]);
  p.shadedFill(poly, col, dark, light, a, 0.35);
  p.clip(poly, () => {
    p.stroke(fr.map(([x, y]) => [x, y - 0.03 * a]), 0.07 * a, mul(col, [0.78, 0.76, 0.8])); // underside shade
    p.stroke(ellPts(cx - 0.18 * a * s, hc - 0.78 * b, 0.38 * a, 0.14 * b, 200, 320, 0, 16), 0.05 * a, mix(col, "#ffffff", 0.32)); // highlight
    if (style === "curly") for (let i = 0; i < 9; i++) p.arc(cx + (i - 4) * 0.22 * a, hc - 0.7 * b + 0.12 * b * Math.sin(i * 1.7), 0.08 * a, 0.06 * b, 200, 340, 1.2 * u, dark);
  });
  if (style !== "curly") p.stroke(crSmooth([[fc + s * 0.22 * a, hc - 1.0 * b], [fc + s * 0.12 * a, hc - 0.8 * b], [fc + s * 0.02 * a, hc - 0.62 * b]], false, 6), 1.5 * u, mul(col, [0.45, 0.42, 0.45]));
  p.poly(poly, null, ow);
};

/** Rick-style beard: full jaw shape with a clumpy lower edge; mouth/moustache are drawn on top afterwards */
const rickBeard = (p, O, H, cx, hc, light, facing, u, ow) => {
  const a = H.a, b = H.b, k = O.beardK || 1, fc = cx + 7 * u * (facing || 0), col = O.beard, pts = [];
  // upper edge: cheek -> under-nose -> cheek
  pts.push([cx - 0.98 * a, hc + 0.05 * b], [cx - 0.7 * a, hc + 0.3 * b], [fc - 0.3 * a, hc + 0.26 * b], [fc, hc + 0.2 * b], [fc + 0.3 * a, hc + 0.26 * b], [cx + 0.7 * a, hc + 0.3 * b], [cx + 0.98 * a, hc + 0.05 * b]);
  // lower clumpy edge right -> left
  const C = 7;
  for (let i = 0; i <= C * 2; i++) { const th = rad(8 + 164 * i / (C * 2)), bump = i % 2 ? 1.0 : 0.9;
    pts.push([cx + 1.03 * a * Math.cos(th) * (i % 2 ? 1 : 0.97), hc + 0.05 * b + (0.85 + 0.3 * k) * b * Math.sin(th) * bump]); }
  const q = crSmooth(pts, true, 4), dark = mul(col, [0.78, 0.78, 0.84]);
  p.shadedFill(q, col, dark, light, 0.8 * a, 0.3);
  p.clip(q, () => { for (let i = -5; i <= 5; i++) p.stroke([[fc + i * 0.15 * a, hc + 0.45 * b], [fc + i * 0.17 * a, hc + (0.5 + 0.5 * k) * b]], 1.3 * u, dark); });
  p.poly(q, null, ow * 0.85);
};

/** Rick-style moustache: two chunky lobes, glossy highlight; curl=true gives a handlebar */
const rickStache = (p, mx, cy, u, col, curl, big) => {
  const K = big ? 1.15 : 1, dark = mul(col, [0.72, 0.7, 0.74]);
  for (const s of [-1, 1]) {
    const P = [[mx, cy + 9 * u], [mx + s * 9 * u * K, cy + 8 * u], [mx + s * 17 * u * K, cy + 11 * u]];
    if (curl) P.push([mx + s * 22 * u * K, cy + 8 * u], [mx + s * 21 * u * K, cy + 4 * u], [mx + s * 24 * u * K, cy + 6 * u], [mx + s * 23 * u * K, cy + 13 * u]);
    else P.push([mx + s * 20 * u * K, cy + 17 * u]);
    P.push([mx + s * 12 * u * K, cy + 18 * u], [mx + s * 4 * u, cy + 16 * u], [mx, cy + 14 * u]);
    const q = crSmooth(P, true, 5);
    p.shadedFill(q, col, dark, rad(-120), 20 * u, 0.3);
    p.stroke([[mx + s * 6 * u * K, cy + 11 * u], [mx + s * 12 * u * K, cy + 11.5 * u]], 1.6 * u, mix(col, "#ffffff", 0.55));
    p.poly(q, null, 2.6 * u);
  }
};

// ---- mood FX (before face: tint/blush; after face: sweat, vein, glowing eyes) ----
FACE.rage = { eye: ["dot", "dot"], brow: [9, -1], mouth: "gritGrin", fx: { rage: 1, glow: 1, vein: 1 } };
FACE.fume = { eye: ["lid", "lid"], brow: [8, 0], mouth: "frown", fx: { rage: 0.6, vein: 1 } };
FACE.blushGrin = { eye: ["happy", "happy"], brow: [-4, -2], mouth: "gritGrin", fx: { blush: 1 } };
FACE.sweat = { eye: ["googly", "googly"], brow: [-6, 2], mouth: "worry", fx: { sweat: 1 } };
FACE.awkward.fx = { sweat: 1, blush: 0.6 };
FACE.worried.fx = { sweat: 1 };
FACE.shocked.fx = { pale: 1 };
const rickFXPre = (p, O, expr, hp, H, cx, hc, facing, u) => {
  const fx = { ...((FACE[expr] || {}).fx || {}), ...{} }, g = p.g;
  if (fx.rage) p.clip(hp, () => { const gr = g.createLinearGradient(0, hc - 1.1 * H.b, 0, hc + 0.5 * H.b);
    gr.addColorStop(0, `rgba(84,22,128,${0.95 * fx.rage})`); gr.addColorStop(0.6, `rgba(150,36,120,${0.55 * fx.rage})`); gr.addColorStop(1, "rgba(200,60,60,0)");
    g.save(); g.globalCompositeOperation = "multiply"; g.fillStyle = gr; g.fillRect(cx - 2 * H.a, hc - 1.4 * H.b, 4 * H.a, 2.6 * H.b); g.restore(); });
  if (fx.pale) p.clip(hp, () => { const gr = g.createLinearGradient(0, hc - 1.1 * H.b, 0, hc + 0.2 * H.b);
    gr.addColorStop(0, "rgba(120,170,220,0.55)"); gr.addColorStop(1, "rgba(120,170,220,0)"); g.save(); g.globalCompositeOperation = "multiply"; g.fillStyle = gr; g.fillRect(cx - 2 * H.a, hc - 1.4 * H.b, 4 * H.a, 2.6 * H.b); g.restore(); });
  if (fx.blush) { g.save(); g.globalAlpha = 0.45 * fx.blush; for (const sd of [-1, 1]) p.ell(cx + 7 * u * facing + sd * 27 * u, hc + 13 * u, 9 * u, 5.5 * u, "#ff6f86", 0); g.restore();
    for (const sd of [-1, 1]) for (let k = 0; k < 3; k++) p.stroke([[cx + 7 * u * facing + sd * (22 + k * 4) * u, hc + 15 * u], [cx + 7 * u * facing + sd * (24 + k * 4) * u, hc + 10 * u]], 1.2 * u, "#e0506a"); }
};
const rickFXPost = (p, O, expr, H, cx, hc, facing, u) => {
  const fx = { ...((FACE[expr] || {}).fx || {}), ...{} }, g = p.g, fc = cx + 7 * u * facing, sd = facing ? -facing : 1;
  if (fx.glow) for (const s of [-1, 1]) { const x = fc + s * 13 * u; g.save(); g.shadowColor = "#ff2a1a"; g.shadowBlur = 22 * u; p.ell(x, hc, 6 * u, 5 * u, "#ff3b24", 0); g.restore(); p.ell(x, hc, 3 * u, 2.6 * u, "#fff2c0", 0); }
  if (fx.vein) { const x = fc + sd * 0.62 * H.a, y = hc - 0.4 * H.b, r = 6 * u, c = "#c0203a";
    for (const [a, b] of [[[x - r, y - 0.3 * r], [x - 0.3 * r, y - 0.3 * r]], [[x - 0.3 * r, y - r], [x - 0.3 * r, y - 0.3 * r]], [[x + r, y + 0.3 * r], [x + 0.3 * r, y + 0.3 * r]], [[x + 0.3 * r, y + r], [x + 0.3 * r, y + 0.3 * r]], [[x + 0.3 * r, y - r], [x + 0.3 * r, y - 0.3 * r]], [[x + r, y - 0.3 * r], [x + 0.3 * r, y - 0.3 * r]], [[x - r, y + 0.3 * r], [x - 0.3 * r, y + 0.3 * r]], [[x - 0.3 * r, y + r], [x - 0.3 * r, y + 0.3 * r]]])
      p.stroke(crSmooth([a, [(a[0] + b[0]) / 2 + 0.15 * r, (a[1] + b[1]) / 2 + 0.15 * r], b], false, 4), 2.4 * u, c); }
  if (fx.sweat) { const x = fc + sd * 0.72 * H.a, y = hc - 0.55 * H.b, q = crSmooth([[x, y - 9 * u], [x + 5 * u, y + 2 * u], [x, y + 7 * u], [x - 5 * u, y + 2 * u]], true, 6);
    p.poly(q, "#8fd0ff", 2.2 * u); p.stroke([[x - 1.5 * u, y], [x - 2.5 * u, y + 3 * u]], 1.6 * u, "#ffffff"); }
};

FACE.strain = { ...FACE.determined, fx: { sweat: 1 } };
// head shadow on the collar: soft dark band under the chin, painted only over what is already drawn (the torso)
const rickCollar = (p, cx, hc, H) => { const g = p.g; g.save(); g.globalCompositeOperation = "source-atop"; const gr = g.createRadialGradient(cx, hc + 0.95 * H.b, 0, cx, hc + 0.95 * H.b, 0.75 * H.a);
  gr.addColorStop(0, "rgba(30,20,40,0.34)"); gr.addColorStop(0.6, "rgba(30,20,40,0.16)"); gr.addColorStop(1, "rgba(30,20,40,0)"); g.fillStyle = gr; g.fillRect(cx - H.a, hc + 0.5 * H.b, 2 * H.a, 1.0 * H.b); g.restore(); };
for (const k of Object.keys(FACE)) if (!k.endsWith('_t') && !FACE[k + '_t']) FACE[k + '_t'] = { ...FACE[k], mouth: FACE[k].mouth === 'o' ? 'smile' : 'o' };
