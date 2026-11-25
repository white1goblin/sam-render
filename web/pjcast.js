
// ---------------- "The Fighter Jet Bought With Soda Points" cast (our own designs) — appended last in toon.js ----------------
// The student (a real, living person) is drawn ONLY from behind via founderBack({who:'L'}). The judge (living) is a far, backlit
// silhouette (tinted card, no features) or just a sleeve + hand. The ad's teen pilot wears a helmet with the visor down.
FACE.gasp = { eye: ["shock", "shock"], brow: [-6, -6], mouth: "O" };
FACE.lol = { eye: ["happy", "happy"], brow: [-4, -4], mouth: "laugh" };
FACE.gulp2 = { eye: ["shock", "shock"], brow: [5, 5], mouth: "o" };
FACE.smirk = { eye: ["lid", "lid"], brow: [-3, 4], mouth: "smileWide" };
FACE.serious = { eye: ["lid", "lid"], brow: [4, 4], mouth: "dash" };

Object.assign(OUTFITS, {
  kidA: { tunic: "#e8603a", sleeve: "#e05a34", pants: "#3a5a9a", boots: "#f2efe6", skin: "#f0c8a6", hair: "#3a2418", cap: "#2d4a8a" },
  kidB: { tunic: "#7a5ab8", sleeve: "#7052ac", dress: "#2f8a8a", pants: "#efe8dc", boots: "#2a2224", skin: "#c99067", bob: "#1e1714", hairUnder: true, lashes: true, uniform: "teen" },
  kidC: { tunic: "#f2c23c", sleeve: "#e8b832", pants: "#2a2a40", boots: "#f2efe6", skin: "#f5c9a0", hair: "#b8742e" },
  kidD: { tunic: "#3f8a5a", sleeve: "#378050", pants: "#4a4a5a", boots: "#c8322e", skin: "#e6b48e", hair: "#1a1410", cap: "#c8322e" },
  exec: { tunic: "#2a2f3a", sleeve: "#262a34", pants: "#22252e", boots: "#141216", skin: "#f3d6bb", uniform: "suit", tie: "#c8322e", hair: "#5a4030", glasses: true, stout: true },
  lawyerA: { tunic: "#3a3f4e", sleeve: "#343846", pants: "#2a2d36", boots: "#141216", skin: "#e6b48e", uniform: "suit", tie: "#2d4a8a", hair: "#2a1e18" },
  lawyerB: { tunic: "#4a3f3a", sleeve: "#433832", dress: "#4a3f3a", pants: "#efe8dc", boots: "#141216", skin: "#f7d3b4", uniform: "suit", tie: "#7a2a3a", bob: "#7a4a2a", hairUnder: true, lashes: true },
  investor: { tunic: "#2a2a34", sleeve: "#24242c", pants: "#22222a", boots: "#141216", skin: "#e0c0a0", uniform: "suit", tie: "#3a3a44", hair: "#2a2a2a" },
  judge: { tunic: "#141218", sleeve: "#141218", pants: "#141218", boots: "#141216", skin: "#b89a80", hair: "#9a9488", stout: true },
});

/** the ad's teen pilot, seen in the cockpit: flight suit shoulders, white helmet, dark visor fully down (no face). opts: wv (wave phase), arm 'wave'|'thumb'|'hang' */
export const pilotCard = (p, opts = {}) => {
  const thick = thickAngle(rad(-120)), cx = 300, hy = 560, a = 100, b = 104, suit = "#5f7a4a";
  const sh = [[cx - 150, 975], [cx - 140, 760], [cx - 70, 700], [cx + 70, 700], [cx + 140, 760], [cx + 150, 975]];
  if (opts.arm === "wave" || opts.arm === "thumb") { const w = opts.arm === "wave" ? 30 * Math.sin(opts.wv || 0) : 0, pts = [[cx + 120, 760], [cx + 220, 640], [cx + 236 + w, 470]];
    p.stroke(curve(pts[0], pts[1], pts[2]), 66, INK); p.stroke(curve(pts[0], pts[1], pts[2]), 48, suit); p.ell(pts[2][0], pts[2][1], 34, 32, "#e8e4da", 8);
    if (opts.arm === "thumb") p.stroke([[pts[2][0], pts[2][1] - 10], [pts[2][0] + 6, pts[2][1] - 52]], 16); }
  p.gradFill(sh, suit, mul(suit, [0.62, 0.62, 0.7]), rad(-120)); p.inkRing(sh, 10, thick);
  p.poly([[cx - 40, 700], [cx + 40, 700], [cx + 24, 780], [cx - 24, 780]], "#3a4a2e", 6); p.poly(rrect(cx + 50, 790, cx + 120, 830, 6), "#f2c23c", 5);
  const hp = blobPts(cx, hy, { a, b, nTop: 2.1, nBot: 2.3, egg: -0.06, asym: 0, rot: 0, noise: 0.004, seed: 3 });
  p.shadedFill(hp, "#f4f4f0", "#b8bcc4", rad(-120), a); p.inkRing(hp, 11, thick);
  const vs = ellPts(cx, hy + 18, a * 0.86, b * 0.62, 0, 360, 0, 36); p.shadedFill(vs, "#2a3448", "#141a26", rad(-120), a * 0.8, 0.6); p.inkRing(vs, 8, thick);
  p.stroke(ellPts(cx - 30, hy - 4, a * 0.4, b * 0.22, 200, 290, 0, 12), 9, "#ffffff70"); p.dot(cx + 40, hy - 18, 8, "#ffffffaa");
  p.band([[cx - a * 0.95, hy - b * 0.45], [cx + a * 0.95, hy - b * 0.45]], "#c8322e", 14, 4); p.stroke([[cx - a * 0.2, hy - b * 0.98], [cx + a * 0.2, hy - b * 0.98]], 7, "#c9ccd0");
};

// ---------------- effects ----------------
const PJB = (t, s = 1.7) => { t = Math.max(0, Math.min(1, t)) - 1; return t * t * ((s + 1) * t + s) + 1; };
/** a banded bundle of cash (flying into the stack) */
export const fxCash = (p, a = 0) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(a); g.translate(-300, -500);
  p.poly(rrect(120, 420, 480, 580, 10), "#9cc28a", 12); p.poly(rrect(140, 440, 460, 560, 8), "#b8d8a4", 5); p.ell(300, 500, 46, 50, "#d8e8c8", 5); g.textAlign = "center"; g.textBaseline = "middle"; g.font = "900 70px Arial Black, Arial"; g.fillStyle = "#3a6a30"; g.fillText("$", 300, 504);
  p.poly(rrect(200, 412, 236, 588, 4), "#f2efe6", 6); g.restore(); };
/** an envelope (mail) */
export const fxEnv = (p, a = 0) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(a); g.translate(-300, -500);
  p.poly(rrect(110, 400, 490, 600, 14), "#f4ead0", 12); p.stroke([[118, 408], [300, 520], [482, 408]], 9, "#b8a47e"); p.poly(rrect(408, 418, 466, 482, 4), "#c8322e", 6); g.restore(); };
/** a "21" number balloon */
export const fxNum = (p, s = "21", t = 1, col = "#e0607a") => { const k = PJB(t, 1.6), g = p.g; g.save(); g.translate(300, 500); g.scale(k, k); g.translate(-300, -500);
  p.stroke([[300, 690], [290, 800], [310, 900], [300, 980]], 6, INK); g.textAlign = "center"; g.textBaseline = "middle"; g.font = "900 380px Arial Black, Arial"; g.lineJoin = "round"; g.lineWidth = 34; g.strokeStyle = INK; g.strokeText(s, 300, 470); g.fillStyle = col; g.fillText(s, 300, 470);
  g.fillStyle = "#ffffff88"; g.font = "900 380px Arial Black, Arial"; g.save(); g.beginPath(); g.rect(0, 280, 600, 70); g.clip(); g.fillText(s, 300, 470); g.restore(); g.restore(); };
/** a little cardboard "points" label (the 15 real labels / points proof) */
export const fxRing2 = (p, t) => { const g = p.g; g.save(); g.globalAlpha = Math.max(0, 1 - t); for (let i = 0; i < 2; i++) { const r = 80 + 260 * t + i * 60; p.ell(300, 500, r, r * 0.9, null, 16 * (1 - t) + 2); } g.restore(); };
/** cha-ching coins popping */
export const fxCoins = (p, t) => { const g = p.g; g.save(); for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.38, r = 60 + 320 * t, x = 300 + Math.cos(a) * r, y = 560 + Math.sin(a) * r + 420 * t * t; g.globalAlpha = Math.max(0, 1 - t * 0.9);
  p.ell(x, y, 40, 40 * Math.abs(Math.cos(t * 9 + i)) + 6, "#f2c23c", 8); } g.restore(); };
