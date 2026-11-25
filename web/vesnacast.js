
// ---------------- Vesna cast (our own designs) — appended after roman.js in toon.js ----------------
FACE.smug = { eye: ["lid", "lid"], brow: [-4, 3], mouth: "smirk" };
FACE.proud = { eye: ["happy", "happy"], brow: [-3, -3], mouth: "smileWide" };
FACE.yell = { eye: ["lid", "lid"], brow: [6, -3], mouth: "O" };
FACE.wink = { eye: ["dot", "happy"], brow: [-2, -4], mouth: "smileWide" };
FACE.sigh = { eye: ["dash", "dash"], brow: [-3, 3], mouth: "wave" };
FACE.cheer = { eye: ["happy", "happy"], brow: [-4, -4], mouth: "laugh" };
FACE.dizzy = { eye: ["spiral", "spiral"], brow: [-3, 2], mouth: "wave" };
FACE.jitter = { eye: ["shock", "shock"], brow: [-7, -6], mouth: "teeth" };
FACE.calm = { eye: ["happy", "happy"], brow: [-1, 1], mouth: "smile" };
FACE.sleep = { eye: ["dash", "dash"], brow: [0, 1], mouth: "o" };
FACE.puzzled = { eye: ["dot", "small"], brow: [5, -5], mouth: "wave" };
FACE.frown = { eye: ["lid", "lid"], brow: [5, -3], mouth: "frown" };
FACE.happy = { eye: ["dot", "dot"], brow: [-2, -2], mouth: "smileWide" };
const TURQ = "#1fa6a6", TURQ_D = "#147e80";
Object.assign(OUTFITS, {
  vesna: { tunic: TURQ, sleeve: "#1c9898", dress: TURQ, pants: "#efc6a4", skin: "#f7d3b4", hat: "pillbox", hatCol: TURQ, uniform: "stew", hair: "#3a2418", bob: "#3a2418", hairUnder: true, lashes: true, blush: "#ff8a8a", tag: "VESNA" },
  vesna2: { tunic: TURQ, sleeve: "#1c9898", dress: TURQ, pants: "#efc6a4", skin: "#f3cfae", hat: "pillbox", hatCol: TURQ, uniform: "stew", hair: "#e8c062", bob: "#e8c062", hairUnder: true, lashes: true, blush: "#ff8a8a", tag: "VESNA", glasses: "#7a3a2a" },
  vesnaOld: { tunic: "#2d3f86", sleeve: "#2a3a7c", dress: "#2d3f86", pants: "#e8c2a2", skin: "#f3cdb0", uniform: "blouse", hair: "#7a6a64", bob: "#7a6a64", lashes: true, blush: "#ff8a8a" },
  vesnaTeen: { tunic: "#f2c23c", sleeve: "#e8b630", dress: "#f2c23c", pants: "#f7d3b4", skin: "#f7d3b4", uniform: "teen", hair: "#3a2418", bob: "#3a2418", lashes: true, blush: "#ff8a8a" },
  vesnaExam: { tunic: "#e0607a", sleeve: "#d45670", dress: "#e0607a", pants: "#f7d3b4", skin: "#f7d3b4", uniform: "teen", hair: "#3a2418", bob: "#3a2418", lashes: true, blush: "#ff8a8a" },
  medic: { tunic: "#6b4e36", sleeve: "#5d432e", pants: "#3e3a40", boots: "#2a201c", skin: "#efc29c", hat: "ushanka", hatCol: "#8a7460", uniform: "coat", hair: "#c9c4bb", moustache: "#e6e1d8", stout: true },
  doc: { tunic: "#f4f6f4", sleeve: "#eef0ee", pants: "#3f4a5a", boots: "#221c1c", skin: "#f0c8a6", hat: "mirror", hatCol: "#c9ccd0", uniform: "lab", hair: "#b9b4ac", moustache: "#9a948c", glasses: "#2a2a30" },
  doc2: { tunic: "#f4f6f4", sleeve: "#eef0ee", dress: "#5f7aa0", pants: "#e8c2a2", skin: "#c99067", uniform: "lab", hair: "#1e1714", bob: "#1e1714", lashes: true },
  examDoc: { tunic: "#f4f6f4", sleeve: "#eef0ee", pants: "#5a4a3a", boots: "#221c1c", skin: "#f3d6bb", uniform: "lab", hair: "#5a3b2a", moustache: "#5a3b2a", glasses: "#2a2a30", stout: true },
});
const GOLD = "#e3b23c", GOLD_D = "#a97c1e";

/** hats drawn over the head (called by romanFront when O.hat) */
const aussieHat = (p, O, H, cx, hc, light, thick, ow, u, lift = 0) => {
  const col = O.hatCol || "#333", dark = mul(col, [0.66, 0.66, 0.72]);
  if (O.hat === "pillbox") { // small tilted 1970s stewardess pillbox, perched back on the head
    const x0 = cx + 0.12 * H.a, top = hc - 1.24 * H.b - lift, bot = hc - 0.82 * H.b - lift, w = 0.62 * H.a;
    const body = [[x0 - w, bot], [x0 - w * 0.96, top + 0.05 * H.b], [x0 + w * 0.96, top - 0.03 * H.b], [x0 + w, bot - 0.08 * H.b]];
    const g = p.g; g.save(); if (p.rot === null) { g.translate(x0, bot); g.rotate(rad(7)); g.translate(-x0, -bot); }
    p.shadedFill(body, col, dark, light, w, 0.35); p.inkRing(body, ow * 0.85, thick);
    p.ell(x0, top + 0.01 * H.b, w * 0.97, 0.1 * H.b, mul(col, [1.15, 1.12, 1.1]), ow * 0.6);
    p.band([[x0 - w, bot - 0.08 * H.b], [x0 + w, bot - 0.14 * H.b]], "#f4f1ea", 0.07 * H.b, 1 * u);
    // little gold wings badge
    const by_ = (top + bot) / 2 + 0.02 * H.b; p.poly([[x0 - 14 * u, by_], [x0 - 3 * u, by_ - 4 * u], [x0, by_ + 2 * u], [x0 + 3 * u, by_ - 4 * u], [x0 + 14 * u, by_], [x0, by_ + 6 * u]], GOLD, 1.2 * u);
    g.restore(); return;
  }
  if (O.hat === "ushanka") { // fur trapper hat with ear flaps down
    const top = hc - 1.42 * H.b - lift, by = hc - 0.36 * H.b - lift;
    for (const s of [-1, 1]) { const fl = [[cx + s * 0.78 * H.a, by - 0.1 * H.b], [cx + s * 1.08 * H.a, by], [cx + s * 1.06 * H.a, hc + 0.42 * H.b], [cx + s * 0.86 * H.a, hc + 0.5 * H.b], [cx + s * 0.76 * H.a, hc + 0.1 * H.b]];
      p.shadedFill(fl, col, dark, light, 0.3 * H.a, 0.3); p.clip(fl, () => { for (let k = 0; k < 8; k++) p.stroke([[cx + s * (0.8 + 0.03 * k) * H.a, by + k * 0.1 * H.b], [cx + s * (0.86 + 0.03 * k) * H.a, by + k * 0.1 * H.b + 6 * u]], 1.4 * u, "#00000030"); }); p.inkRing(fl, ow * 0.8, thick); }
    const dome = []; for (let i = 0; i <= 30; i++) { const a = Math.PI + Math.PI * i / 30; dome.push([cx + Math.cos(a) * 1.02 * H.a, by + Math.sin(a) * (by - top)]); }
    p.shadedFill(dome, "#3e3448", "#262030", light, H.a, 0.35); p.inkRing(dome, ow * 0.85, thick);
    const fold = []; for (let i = 0; i <= 24; i++) { const t = i / 24, x = cx + (t * 2 - 1) * 1.08 * H.a; fold.push([x, by - 0.42 * H.b - 0.08 * H.b * Math.sin(t * Math.PI) + 0.03 * H.b * Math.sin(t * 40)]); }
    for (let i = 24; i >= 0; i--) { const t = i / 24, x = cx + (t * 2 - 1) * 1.1 * H.a; fold.push([x, by + 0.06 * H.b + 0.03 * H.b * Math.sin(t * 37)]); }
    p.shadedFill(fold, col, dark, light, H.a, 0.3); p.clip(fold, () => { for (let k = -12; k <= 12; k++) p.stroke([[cx + k * 9 * u, by - 0.45 * H.b], [cx + k * 9 * u + 3 * u, by + 0.05 * H.b]], 1.3 * u, "#00000026"); }); p.inkRing(fold, ow * 0.8, thick);
    return;
  }
  if (O.hat === "mirror") { // doctor's head mirror on a band
    const by = hc - 0.62 * H.b - lift;
    p.band([[cx - 1.0 * H.a, by + 0.08 * H.b], [cx + 1.0 * H.a, by - 0.02 * H.b]], "#3a3a44", 0.1 * H.b, 1 * u);
    const mx = cx + 0.1 * H.a, my = by - 0.05 * H.b; p.ell(mx, my, 0.36 * H.a, 0.33 * H.b, "#c9ccd0", ow * 0.7); p.ell(mx, my, 0.26 * H.a, 0.24 * H.b, "#eef4fa", 1.4 * u); p.ell(mx, my, 0.06 * H.a, 0.06 * H.b, "#3a3a44", 0);
    p.stroke(ellPts(mx - 0.06 * H.a, my - 0.04 * H.b, 0.16 * H.a, 0.14 * H.b, 200, 290, 0, 10), 3 * u, "#ffffffcc");
    return;
  }
  marHat(p, O, H, cx, hc, light, thick, ow, u, lift);
};

const shine = (p, x, y, r, u) => { p.dot(x - r * 0.35, y - r * 0.35, Math.max(0.6 * u, r * 0.38), "#ffffffcc"); };
const stitch = (p, pts, u, col = "#00000055", w = 1.1) => { const g = p.g; g.save(); g.setLineDash([3.2 * u, 2.6 * u]); p.stroke(pts, w * u, col); g.restore(); };
const fabric = (p, tcx, T, top, bot, HH, u) => {
  const g = p.g, img = (typeof window !== "undefined") ? window.FABRIC_IMG : null;
  if (img) { g.save(); g.globalCompositeOperation = "overlay"; g.globalAlpha = 0.45; const pat = g.createPattern(img, "repeat"); const m = new DOMMatrix(); m.scaleSelf(0.16, 0.16); pat.setTransform(m); g.fillStyle = pat; g.fillRect(tcx - 2 * T.a, top - 0.3 * HH, 4 * T.a, bot - top + 0.6 * HH); g.restore(); }
  g.save(); g.globalAlpha = 0.14; for (const sd of [-1, 1]) p.stroke([[tcx + sd * 0.78 * T.a, top + 0.22 * HH], [tcx + sd * 0.6 * T.a, top + 0.5 * HH], [tcx + sd * 0.66 * T.a, bot - 0.1 * HH]], 3.2 * u, "#000000");
  g.globalAlpha = 0.14; p.stroke([[tcx - 0.9 * T.a, top + 0.12 * HH], [tcx - 0.55 * T.a, top + 0.06 * HH]], 3 * u, "#ffffff"); g.restore();
};
const tagText = (p, x, y, w, h, text, u, bg = "#f8f6ef", fg = "#1b2a44") => {
  p.poly(rrect(x - w / 2, y - h / 2, x + w / 2, y + h / 2, 2 * u), bg, 1.4 * u);
  const g = p.g; g.save(); g.textAlign = "center"; g.textBaseline = "middle"; let fs = h * 0.78; g.font = `900 ${fs}px Arial Black, Arial`;
  while (g.measureText(text).width > w * 0.86 && fs > 4) { fs *= 0.92; g.font = `900 ${fs}px Arial Black, Arial`; }
  g.fillStyle = fg; g.fillText(text, x, y + fs * 0.05); g.restore();
};
/** uniform details painted inside the torso */
const aussieTorso = (p, O, tp, tcx, T, chin, torsoBot, HH, u, light) => {
  p.clip(tp, () => {
    if (O.uniform === "stew") {
      fabric(p, tcx, T, chin, torsoBot, HH, u);
      // white scarf / blouse V at the neck
      p.poly([[tcx - 0.42 * T.a, chin - 0.06 * HH], [tcx + 0.42 * T.a, chin - 0.06 * HH], [tcx, chin + 0.3 * HH]], "#f6f4ee", 1.6 * u);
      p.poly([[tcx - 0.16 * T.a, chin + 0.02 * HH], [tcx + 0.2 * T.a, chin + 0.0 * HH], [tcx + 0.04 * T.a, chin + 0.12 * HH]], "#f2b23a", 1.2 * u); // scarf knot (marigold)
      p.stroke([[tcx + 0.04 * T.a, chin + 0.1 * HH], [tcx - 0.08 * T.a, chin + 0.26 * HH]], 4 * u, "#f2b23a");
      for (const sd of [-1, 1]) { p.stroke([[tcx + sd * 0.45 * T.a, chin - 0.06 * HH], [tcx + sd * 0.1 * T.a, chin + 0.36 * HH]], 2 * u, TURQ_D); for (let k = 0; k < 3; k++) { p.dot(tcx + sd * 0.28 * T.a, chin + (0.42 + k * 0.14) * HH, 2.6 * u, GOLD); shine(p, tcx + sd * 0.28 * T.a, chin + (0.42 + k * 0.14) * HH, 2.6 * u, u); } }
      p.band([[tcx - 1.4 * T.a, torsoBot - 0.2 * HH], [tcx + 1.4 * T.a, torsoBot - 0.2 * HH]], TURQ_D, 0.05 * HH, 1 * u);
      if (O.tag) tagText(p, tcx - 0.56 * T.a, chin + 0.3 * HH, 0.6 * T.a, 0.1 * HH, O.tag, u);
      stitch(p, [[tcx - 1.2 * T.a, torsoBot - 0.17 * HH], [tcx + 1.2 * T.a, torsoBot - 0.17 * HH]], u, "#ffffff40");
    } else if (O.uniform === "coat") {
      fabric(p, tcx, T, chin, torsoBot, HH, u);
      p.poly([[tcx - 0.7 * T.a, chin - 0.08 * HH], [tcx + 0.7 * T.a, chin - 0.08 * HH], [tcx + 0.6 * T.a, chin + 0.12 * HH], [tcx, chin + 0.2 * HH], [tcx - 0.6 * T.a, chin + 0.12 * HH]], "#d8ccb8", 1.4 * u); // sheepskin collar
      p.stroke([[tcx + 0.04 * T.a, chin + 0.18 * HH], [tcx + 0.04 * T.a, torsoBot]], 2 * u, "#3e2a1c");
      for (let k = 0; k < 3; k++) { const y = chin + (0.3 + k * 0.17) * HH; p.poly(rrect(tcx - 6 * u, y - 2.5 * u, tcx + 14 * u, y + 2.5 * u, 2 * u), "#e8dcc0", 1 * u); }
      p.band([[tcx - 1.4 * T.a, torsoBot - 0.24 * HH], [tcx + 1.4 * T.a, torsoBot - 0.24 * HH]], "#2e2420", 0.07 * HH, 1.2 * u);
    } else if (O.uniform === "lab") {
      p.poly([[tcx - 0.36 * T.a, chin - 0.06 * HH], [tcx + 0.36 * T.a, chin - 0.06 * HH], [tcx, chin + 0.42 * HH]], O.dress && O.bob ? "#5f7aa0" : "#8fb0d8", 1.4 * u);
      if (!O.bob) p.poly([[tcx - 0.07 * T.a, chin + 0.02 * HH], [tcx + 0.07 * T.a, chin + 0.02 * HH], [tcx + 0.05 * T.a, chin + 0.36 * HH], [tcx, chin + 0.4 * HH], [tcx - 0.05 * T.a, chin + 0.36 * HH]], "#b8322f", 1 * u);
      for (const sd of [-1, 1]) p.stroke([[tcx + sd * 0.42 * T.a, chin - 0.06 * HH], [tcx + sd * 0.12 * T.a, chin + 0.46 * HH], [tcx + sd * 0.1 * T.a, torsoBot]], 2.2 * u, "#c9ccd0");
      p.poly(rrect(tcx - 0.86 * T.a, chin + 0.36 * HH, tcx - 0.42 * T.a, chin + 0.58 * HH, 2 * u), "#f4f6f4", 1.2 * u);
      p.stroke([[tcx - 0.76 * T.a, chin + 0.3 * HH], [tcx - 0.76 * T.a, chin + 0.42 * HH]], 2.4 * u, "#2b4a9a"); p.stroke([[tcx - 0.62 * T.a, chin + 0.32 * HH], [tcx - 0.62 * T.a, chin + 0.42 * HH]], 2.4 * u, "#b8322f");
      // stethoscope
      p.stroke(ellPts(tcx, chin + 0.02 * HH, 0.48 * T.a, 0.3 * HH, 10, 170, 0, 20), 2.6 * u, "#3a3a44");
      p.stroke([[tcx + 0.46 * T.a, chin + 0.08 * HH], [tcx + 0.5 * T.a, chin + 0.5 * HH]], 2.6 * u, "#3a3a44"); p.ell(tcx + 0.5 * T.a, chin + 0.54 * HH, 6 * u, 6 * u, "#c9ccd0", 1.4 * u);
    } else if (O.uniform === "blouse") {
      fabric(p, tcx, T, chin, torsoBot, HH, u);
      p.poly([[tcx - 0.34 * T.a, chin - 0.06 * HH], [tcx + 0.34 * T.a, chin - 0.06 * HH], [tcx, chin + 0.2 * HH]], O.skin, 1.2 * u);
      for (let i = 0; i <= 10; i++) { const a = Math.PI * (0.1 + 0.8 * i / 10); p.dot(tcx + Math.cos(a) * 0.36 * T.a, chin - 0.04 * HH + Math.sin(a) * 0.17 * HH, 2.6 * u, "#fbf6ee"); }
      p.ell(tcx + 0.55 * T.a, chin + 0.34 * HH, 7 * u, 7 * u, GOLD, 1.2 * u); // brooch
    } else if (O.uniform === "teen") {
      fabric(p, tcx, T, chin, torsoBot, HH, u);
      for (const sd of [-1, 1]) p.ell(tcx + sd * 0.22 * T.a, chin + 0.03 * HH, 0.26 * T.a, 0.08 * HH, "#fbf8f0", 1.4 * u);
      for (let k = 0; k < 3; k++) { p.dot(tcx, chin + (0.22 + k * 0.14) * HH, 2.4 * u, "#fbf8f0"); }
      for (let i = 0; i < 8; i++) p.dot(tcx + Math.sin(i * 2.1) * 0.8 * T.a, chin + (0.15 + (i * 0.37) % 1 * 0.7) * HH, 3 * u, "#ffffff70");
    } else marTorso(p, O, tp, tcx, T, chin, torsoBot, HH, u, light);
  });
};
const castAfter = () => {};
const glow = (p, x, y, r, col) => { const g = p.g; g.save(); const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, "rgba(255,200,80,0)"); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); g.restore(); };
const certDraw = (p, x, y, w, h, u, frame = true) => { // framed world-record certificate (diegetic text, reads left-to-right)
  if (frame) p.poly(rrect(x - w / 2 - 8 * u, y - h / 2 - 8 * u, x + w / 2 + 8 * u, y + h / 2 + 8 * u, 3 * u), "#c99a3a", 3 * u);
  p.poly(rrect(x - w / 2, y - h / 2, x + w / 2, y + h / 2, 2 * u), "#fbf4e0", 2 * u);
  const g = p.g; g.save(); g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#7a2a2a";
  g.font = `900 ${h * 0.16}px Georgia, serif`; g.fillText("WORLD RECORD", x, y - h * 0.27);
  g.fillStyle = "#2a2a3a"; g.font = `700 ${h * 0.085}px Georgia, serif`; g.fillText("HIGHEST FALL SURVIVED", x, y - h * 0.06);
  g.font = `900 ${h * 0.17}px Georgia, serif`; g.fillStyle = "#1b2a44"; g.fillText("10,160 m", x, y + h * 0.16);
  g.restore(); p.ell(x + w * 0.3, y + h * 0.34, h * 0.09, h * 0.09, "#d8322e", 1.4 * u); p.ell(x + w * 0.3, y + h * 0.34, h * 0.05, h * 0.05, GOLD, 0);
  p.stroke([[x - w * 0.38, y + h * 0.36], [x - w * 0.05, y + h * 0.36]], 1.4 * u, "#2a2a3a");
};
const cupDraw = (p, x, y, u, steam = 0) => {
  p.poly([[x - 15 * u, y - 18 * u], [x + 15 * u, y - 18 * u], [x + 12 * u, y + 14 * u], [x - 12 * u, y + 14 * u]], "#fbf8f2", 3 * u);
  p.band([[x - 14.5 * u, y - 8 * u], [x + 14.5 * u, y - 8 * u]], TURQ, 4 * u, 0);
  p.ell(x, y - 18 * u, 15 * u, 5 * u, "#5a3420", 2.4 * u); p.arc(x + 16 * u, y - 2 * u, 7 * u, 9 * u, -80, 80, 3 * u);
  if (steam) { const g = p.g; g.save(); g.globalAlpha = 0.7; for (let k = -1; k <= 1; k++) { const pts = []; for (let i = 0; i < 10; i++) pts.push([x + k * 8 * u + 4 * u * Math.sin(i * 0.9 + steam + k), y - 26 * u - i * 5 * u]); p.stroke(pts, 2.4 * u, "#ffffff"); } g.restore(); }
};
/** props drawn before the head */
const aussieProp = (p, prop, arms, u, opts) => {
  const [hx, hy] = arms[1].pts[2], [lx, ly] = arms[0].pts[2];
  if (prop === "bag") { const bx = lx - 10 * u, by = ly + 10 * u; p.stroke([[lx + 40 * u, ly - 180 * u], [bx, by - 20 * u]], 4 * u, "#5a3a22");
    p.poly(rrect(bx - 34 * u, by - 22 * u, bx + 34 * u, by + 30 * u, 6 * u), "#c0302c", 3.5 * u); p.poly(rrect(bx - 34 * u, by - 22 * u, bx + 34 * u, by - 4 * u, 5 * u), "#a02826", 2 * u);
    p.ell(bx, by + 12 * u, 13 * u, 13 * u, "#f6f3ea", 1.6 * u); p.poly([[bx - 3 * u, by + 3 * u], [bx + 3 * u, by + 3 * u], [bx + 3 * u, by + 9 * u], [bx + 9 * u, by + 9 * u], [bx + 9 * u, by + 15 * u], [bx + 3 * u, by + 15 * u], [bx + 3 * u, by + 21 * u], [bx - 3 * u, by + 21 * u], [bx - 3 * u, by + 15 * u], [bx - 9 * u, by + 15 * u], [bx - 9 * u, by + 9 * u], [bx - 3 * u, by + 9 * u]], "#c0302c", 0); }
};
/** props drawn after the head (over the face) */
const castLate = (p, prop, arms, u, opts, cx, hc, H) => {
  const [hx, hy] = arms[1].pts[2], [lx, ly] = arms[0].pts[2];
  if (prop === "clip") { const x = hx - 30 * u, y = hy - 10 * u; p.poly(rrect(x - 34 * u, y - 46 * u, x + 34 * u, y + 46 * u, 3 * u), "#8a5a34", 3 * u); p.poly(rrect(x - 28 * u, y - 36 * u, x + 28 * u, y + 40 * u, 1 * u), "#fbf8f0", 1.4 * u);
    for (let k = 0; k < 6; k++) p.stroke([[x - 20 * u, y - 22 * u + k * 10 * u], [x + (k % 2 ? 8 : 18) * u, y - 22 * u + k * 10 * u]], 1.8 * u, "#7a8aa8"); p.poly(rrect(x - 12 * u, y - 52 * u, x + 12 * u, y - 40 * u, 2 * u), "#c9ccd0", 1.6 * u); p.dot(hx, hy, 6 * u); }
  if (prop === "cup") { cupDraw(p, hx, hy - 16 * u, u, opts.steam ?? 1); p.dot(hx - 10 * u, hy, 5.5 * u); }
  if (prop === "lantern") { const x = hx, y = hy + 52 * u, fl = opts.flicker || 0; glow(p, x, y, 110 * u, "rgba(255,200,90," + (0.5 + 0.1 * fl) + ")");
    p.stroke([[hx, hy], [x, y - 34 * u]], 2.4 * u); p.poly(rrect(x - 16 * u, y - 30 * u, x + 16 * u, y + 26 * u, 4 * u), "#ffd56a", 3 * u); p.ell(x, y, 8 * u, 12 * u, "#fff6c8", 0);
    p.poly(rrect(x - 20 * u, y - 36 * u, x + 20 * u, y - 28 * u, 2 * u), "#3a3a3a", 2 * u); p.poly(rrect(x - 20 * u, y + 24 * u, x + 20 * u, y + 32 * u, 2 * u), "#3a3a3a", 2 * u);
    for (const s of [-1, 1]) p.stroke([[x + s * 16 * u, y - 28 * u], [x + s * 16 * u, y + 24 * u]], 2 * u, "#3a3a3a"); p.dot(hx, hy, 6 * u); }
  if (prop === "stamp") { const x = hx, y = hy; p.ell(x, y - 30 * u, 11 * u, 11 * u, "#7a4a26", 2.6 * u); p.poly(rrect(x - 5 * u, y - 22 * u, x + 5 * u, y - 4 * u, 2 * u), "#7a4a26", 2 * u); p.poly(rrect(x - 20 * u, y - 6 * u, x + 20 * u, y + 6 * u, 2 * u), "#c0302c", 2.4 * u); p.dot(x, y - 12 * u, 6 * u); }
  if (prop === "cert") { const x = (hx + lx) / 2, y = Math.min(hy, ly) - 4 * u, w = 150 * u, h = 106 * u; certDraw(p, x, y, w, h, u); p.dot(x - w / 2 - 4 * u, y + 10 * u, 7 * u, opts.skin || "#f3cdb0"); p.dot(x + w / 2 + 4 * u, y + 10 * u, 7 * u, "#f3cdb0"); }
  if (prop === "blanket") { const HH = 2 * H.b, top = hc + 0.7 * H.b, w = 0.7 * 2 * H.a, bot = 975 - 0.3 * HH;
    const sk = [[cx - w * 0.7, top], [cx + w * 0.7, top], [cx + w * 0.95, bot], [cx - w * 0.95, bot]];
    p.gradFill(sk, "#c0473a", "#8a2e2a", rad(-120)); p.clip(sk, () => { for (let i = -6; i <= 6; i++) { p.stroke([[cx + i * 22 * u, top], [cx + i * 24 * u, bot]], 3 * u, "#f2e2c0aa"); } for (let k = 0; k < 9; k++) p.stroke([[cx - w, top + k * 34 * u], [cx + w, top + k * 34 * u]], 3 * u, "#2e3a5a66"); });
    p.poly(sk, null, 5 * u); p.poly([[cx - w * 0.7, top], [cx + w * 0.1, top + 40 * u], [cx + w * 0.7, top], [cx + w * 0.6, top + 18 * u], [cx, top + 60 * u], [cx - w * 0.6, top + 18 * u]], "#d0584a", 3 * u); }
  if (opts.glasses || null) {}
  marLate(p, prop, arms, u, opts, cx, hc, H);
};
// ---------------- effects ----------------
const M_back = (t, s = 1.7) => { t = Math.max(0, Math.min(1, t)) - 1; return t * t * ((s + 1) * t + s) + 1; };
export const fxSmoke = (p, t, col = "#f4f6fa") => { const g = p.g; g.save(); g.globalAlpha = Math.max(0, 0.85 - t * 0.85);
  for (let i = 0; i < 5; i++) { const a = i * 1.26 + t * 2, r = 80 + t * 120; p.ell(300 + Math.cos(a) * r * 0.6, 500 + Math.sin(a) * r * 0.4, 90 + t * 80, 70 + t * 60, col, 0); } g.restore(); };
export const fxSparkle = (p, t) => { const g = p.g; g.save(); g.globalAlpha = Math.sin(Math.PI * Math.min(1, t)); const s = 0.6 + 0.6 * Math.sin(t * Math.PI);
  const st = []; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, r = (i % 2 ? 50 : 190) * s; st.push([300 + Math.cos(a) * r, 500 + Math.sin(a) * r]); } p.poly(st, "#fff3b0", 10); g.restore(); };
export const fxSpeech = (p, text, t = 1, col = "#ffffff", fg = "#1b2a44") => { const k = M_back(t, 1.6), g = p.g; g.save(); g.translate(300, 600); g.scale(k, k); g.translate(-300, -600);
  p.poly(rrect(60, 380, 540, 620, 60), col, 12); p.poly([[200, 610], [160, 720], [280, 612]], col, 12); p.poly(rrect(66, 386, 534, 614, 56), col, 0);
  g.textAlign = "center"; g.textBaseline = "middle"; let fs = 120; g.font = `900 ${fs}px Arial Black, Arial`; while (g.measureText(text).width > 420) { fs *= 0.92; g.font = `900 ${fs}px Arial Black, Arial`; }
  g.fillStyle = fg; g.fillText(text, 300, 505); g.restore(); };
export const fxPlacard = (p, text, t = 1, fg = "#c8322e", bg = "#f4ead2") => { const k = M_back(t, 1.6), g = p.g; g.save(); g.translate(300, 975); g.scale(k, k); g.translate(-300, -975);
  p.band([[300, 520], [300, 975]], "#7a5434", 26, 8, "round"); p.poly(rrect(70, 300, 530, 560, 26), bg, 14);
  g.textAlign = "center"; g.textBaseline = "middle"; let fs = 170; g.font = `900 ${fs}px Arial Black, Arial`; while (g.measureText(text).width > 400) { fs *= 0.92; g.font = `900 ${fs}px Arial Black, Arial`; }
  g.lineWidth = fs * 0.12; g.strokeStyle = INK; g.lineJoin = "round"; g.strokeText(text, 300, 436); g.fillStyle = fg; g.fillText(text, 300, 436); g.restore(); };
export const fxHeart = (p, beat = 0, glowK = 1) => { const s = 1 + 0.12 * beat, g = p.g; g.save(); g.translate(300, 520); g.scale(s, s); g.translate(-300, -520);
  if (glowK > 0) { const gr = g.createRadialGradient(300, 520, 40, 300, 520, 290); gr.addColorStop(0, "rgba(255,190,200," + 0.7 * glowK + ")"); gr.addColorStop(1, "rgba(255,190,200,0)"); g.fillStyle = gr; g.fillRect(0, 200, 600, 640); }
  const pts = []; for (let i = 0; i <= 80; i++) { const t = i / 80 * Math.PI * 2, x = 16 * Math.pow(Math.sin(t), 3), y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t); pts.push([300 + x * 11, 500 - y * 11]); }
  p.gradFill(pts, "#ff4a63", "#c4203e", rad(-120)); p.inkRing(pts, 12, 0.6); p.ell(230, 420, 30, 20, "#ffffffaa", 0, 0, 360, -30);
  p.ell(255, 520, 10, 13, INK, 0); p.ell(345, 520, 10, 13, INK, 0); p.arc(300, 552, 26, 16, 20, 160, 7); g.restore(); };
export const fxBulb = (p, t) => { const k = M_back(t, 1.8), g = p.g; g.save(); g.translate(300, 520); g.scale(k, k); g.translate(-300, -520);
  const gr = g.createRadialGradient(300, 460, 30, 300, 460, 260); gr.addColorStop(0, "rgba(255,240,150,0.8)"); gr.addColorStop(1, "rgba(255,240,150,0)"); g.fillStyle = gr; g.fillRect(0, 160, 600, 600);
  p.ell(300, 450, 120, 130, "#fff27a", 12); p.poly(rrect(240, 560, 360, 640, 14), "#b9bcc4", 10); for (let k2 = 0; k2 < 3; k2++) p.stroke([[244, 580 + k2 * 20], [356, 580 + k2 * 20]], 5, "#7a7d86");
  p.stroke([[270, 520], [285, 440], [300, 500], [315, 440], [330, 520]], 7, "#c9a020"); for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * 0.4; p.stroke([[300 + Math.cos(a) * 170, 450 + Math.sin(a) * 170], [300 + Math.cos(a) * 220, 450 + Math.sin(a) * 220]], 12, "#fff27a"); } g.restore(); };
export const fxNoChute = (p, t) => { const k = M_back(t, 1.6), g = p.g; g.save(); g.translate(300, 500); g.scale(k, k); g.translate(-300, -500);
  p.ell(300, 500, 230, 230, "#fbf8f0", 14); const can = []; for (let i = 0; i <= 20; i++) { const a = Math.PI + Math.PI * i / 20; can.push([300 + Math.cos(a) * 150, 440 + Math.sin(a) * 110]); }
  for (let i = 0; i < 6; i++) can.push([450 - i * 60 - 30, 440 + 18 * (i % 2)]); p.poly(can, "#f2b23a", 10); for (const x of [-150, -50, 50, 150]) p.stroke([[300 + x, 440], [300, 600]], 5);
  p.ell(300, 610, 22, 22, "#1fa6a6", 6); g.globalAlpha = 1; p.stroke([[150, 350], [450, 650]], 44, INK); p.stroke([[450, 350], [150, 650]], 44, INK); p.stroke([[150, 350], [450, 650]], 28, "#e0302e"); p.stroke([[450, 350], [150, 650]], 28, "#e0302e"); g.restore(); };
export const fxStampMark = (p, t, text = "PASSED") => { const k = 1 + 0.5 * (1 - M_back(t, 2.2)), g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.18); g.scale(k, k); g.translate(-300, -500); g.globalAlpha = Math.min(1, t * 3);
  p.poly(rrect(40, 400, 560, 600, 24), null, 0); g.lineWidth = 18; g.strokeStyle = "#1f8a4a"; g.strokeRect(50, 410, 500, 180);
  g.textAlign = "center"; g.textBaseline = "middle"; let fs = 150; g.font = `900 ${fs}px Arial Black, Arial`; while (g.measureText(text).width > 450) { fs *= 0.92; g.font = `900 ${fs}px Arial Black, Arial`; } g.fillStyle = "#1f8a4a"; g.fillText(text, 300, 505); g.restore(); };
export const fxConfetti = (p, t, seed = 1) => { const g = p.g; g.save(); const cols = ["#f2b23a", "#1fa6a6", "#e0607a", "#ffffff", "#7a9ae0"];
  for (let i = 0; i < 26; i++) { const r1 = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453, r = r1 - Math.floor(r1), r2 = Math.sin(i * 39.3 + seed) * 9631.1, q_ = r2 - Math.floor(r2);
    const x = 40 + r * 520 + 30 * Math.sin(t * 6 + i), y = 60 + ((q_ + t) % 1) * 880, a = t * 9 + i; g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = cols[i % 5]; g.fillRect(-14, -7 * Math.abs(Math.cos(a * 0.7)) - 2, 28, 14 * Math.abs(Math.cos(a * 0.7)) + 4); g.restore(); } g.restore(); };
export const fxNotes = (p, t) => { const g = p.g; g.save(); for (let i = 0; i < 3; i++) { const tt = (t + i / 3) % 1; g.globalAlpha = Math.sin(Math.PI * tt); const x = 200 + i * 90 + 60 * Math.sin(tt * 6 + i), y = 800 - tt * 600; g.save(); g.translate(x, y); g.scale(0.5, 0.5); g.translate(-300, -500); fxNote(p, i % 2 ? "note2" : "note", "#1f2a44"); g.restore(); } g.restore(); };
export const fxSnowPuff = (p, t) => { const g = p.g; g.save(); g.globalAlpha = Math.max(0, 1 - t * 1.05);
  for (let i = 0; i < 9; i++) { const a = Math.PI * (0.05 + 0.9 * i / 8), r = 60 + t * 260; p.ell(300 + Math.cos(a) * r * 1.3, 860 - Math.sin(a) * r * 0.9, 70 + t * 70, 55 + t * 50, i % 2 ? "#ffffff" : "#e6eefc", 0); } g.restore(); };
export const fxZz = (p, t) => { const g = p.g; g.save(); for (let i = 0; i < 3; i++) { const tt = (t + i / 3) % 1; g.globalAlpha = Math.sin(Math.PI * tt); g.textAlign = "center"; g.font = `900 ${90 + 50 * tt}px Arial Black, Arial`; g.lineWidth = 14; g.strokeStyle = INK; g.strokeText("Z", 250 + tt * 160, 700 - tt * 420); g.fillStyle = "#ffffff"; g.fillText("Z", 250 + tt * 160, 700 - tt * 420); } g.restore(); };
export const fxSwirl = (p, t) => { const pts = []; for (let i = 0; i < 46; i++) { const a = i / 46 * Math.PI * 4 + t * 8, r = 20 + i * 4.4; pts.push([300 + Math.cos(a) * r * 1.4, 500 + Math.sin(a) * r * 0.5]); } p.stroke(pts, 16, "#ffffff"); p.stroke(pts, 7, "#f2b23a"); };
/** the Beatle: only a dark suit sleeve and a hand coming in from the right, holding the certificate (no face, no likeness) */
export const fxSleeve = (p, o = {}) => { const g = p.g, u = 1; const y = 520;
  p.poly([[640, y - 70], [330, y - 58], [318, y + 62], [640, y + 78]], "#1c1c24", 12); p.clip([[640, y - 70], [330, y - 58], [318, y + 62], [640, y + 78]], () => { p.stroke([[600, y - 60], [340, y - 40]], 5, "#ffffff18"); });
  p.poly([[338, y - 58], [300, y - 52], [292, y + 52], [330, y + 60]], "#f6f4ee", 8); p.ell(318, y - 2, 5, 5, GOLD, 0);
  if (o.cert) certDraw(p, 150, y - 24, 250, 176, 1.5);
  p.ell(268, y + 6, 46, 40, "#f0c8a6", 10); for (let k = 0; k < 4; k++) p.ell(222 - k * 4, y - 22 + k * 15, 16, 8, "#f0c8a6", 7);
  p.ell(262, y - 34, 22, 10, "#f0c8a6", 7, 0, 360, -30); };
export const fxRecordGlint = (p, t) => fxSparkle(p, t);
