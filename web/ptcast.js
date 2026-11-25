
// ---------------- "The Popcorn Trap" cast (our own fictional designs) — appended last in toon.js ----------------
FACE.tempt = { eye: ["happy", "happy"], brow: [-3, -3], mouth: "smileWide" };
FACE.think2 = { eye: ["lid", "lid"], brow: [3, -4], mouth: "dash" };
Object.assign(OUTFITS, {
  // the customer: young adult, teal hoodie (matches HOODIES.P back view), jeans
  cust: { tunic: "#2f7f8f", sleeve: "#2a7484", pants: "#3a4a6a", boots: "#f2efe6", skin: "#f0c8a6", hair: "#4a3020", uniform: "teen" },
  // the cinema cashier: dark-red vest over white shirt, bow tie, paper cap
  cash: { tunic: "#a8282c", sleeve: "#f4f1ea", pants: "#22252e", boots: "#141216", skin: "#c99067", hair: "#1a1410", uniform: "suit", tie: "#1c1c22", cap: "#a8282c" },
  stuA: { tunic: "#d9a441", sleeve: "#cc9a3a", pants: "#3a4a6a", boots: "#2a2224", skin: "#f5c9a0", hair: "#b8742e", uniform: "teen" },
  stuB: { tunic: "#7a5ab8", sleeve: "#7052ac", pants: "#3a3a4a", boots: "#2a2224", skin: "#c99067", hair: "#1e1714", lashes: true, uniform: "hoodie" },
  stuC: { tunic: "#3f8a5a", sleeve: "#378050", pants: "#4a4a5a", boots: "#c8322e", skin: "#e6b48e", hair: "#1a1410", uniform: "teen" },
});
HOODIES.P = { hood: "#2f7f8f", hair: "#4a3020", style: "short", skin: "#f0c8a6" };
/** hoodie front (patched into aussieTorso by build.sh): fabric, ribbed hem over the base belt, hood collar, drawstrings, kangaroo pocket */
const hoodiePaint = (p, O, tcx, T, chin, torsoBot, HH, u) => {
  fabric(p, tcx, T, chin, torsoBot, HH, u);
  const d1 = mul(O.tunic, [0.78, 0.78, 0.82]), d2 = mul(O.tunic, [0.62, 0.62, 0.68]);
  p.band([[tcx - 1.5 * T.a, torsoBot - 0.24 * HH], [tcx + 1.5 * T.a, torsoBot - 0.24 * HH]], O.tunic, 0.09 * HH, 0);          // hide the base belt
  p.band([[tcx - 1.5 * T.a, torsoBot - 0.1 * HH], [tcx + 1.5 * T.a, torsoBot - 0.1 * HH]], d1, 0.12 * HH, 1.2 * u);           // ribbed hem
  for (let i = -10; i <= 10; i++) p.stroke([[tcx + i * 0.14 * T.a, torsoBot - 0.155 * HH], [tcx + i * 0.14 * T.a, torsoBot - 0.05 * HH]], 1 * u, d2);
  const pk = [[tcx - 0.62 * T.a, torsoBot - 0.17 * HH], [tcx + 0.62 * T.a, torsoBot - 0.17 * HH], [tcx + 0.46 * T.a, torsoBot - 0.46 * HH], [tcx - 0.46 * T.a, torsoBot - 0.46 * HH]];
  p.poly(pk, mul(O.tunic, [0.92, 0.92, 0.95]), 1.6 * u); p.stroke([[tcx - 0.46 * T.a, torsoBot - 0.43 * HH], [tcx + 0.46 * T.a, torsoBot - 0.43 * HH]], 1 * u, d2);
  p.band(ellPts(tcx, chin - 0.02 * HH, 0.62 * T.a, 0.16 * HH, 0, 180, 0, 20), d1, 0.07 * HH, 1.4 * u);                       // hood collar
  for (const sd of [-1, 1]) { const x = tcx + sd * 0.2 * T.a; p.stroke([[x, chin + 0.08 * HH], [x + sd * 0.03 * T.a, chin + 0.42 * HH]], 2.2 * u, "#f4f1ea"); p.poly(rrect(x + sd * 0.03 * T.a - 2.6 * u, chin + 0.41 * HH, x + sd * 0.03 * T.a + 2.6 * u, chin + 0.47 * HH, 1 * u), "#c9ccd0", 1 * u); }
};
OUTFITS.cust.uniform = "hoodie"; OUTFITS.stuA.uniform = "hoodie"; OUTFITS.stuC.uniform = "hoodie";
/** popcorn burst: kernels flying out from the centre (t 0..1), seeded */
export const fxPop = (p, t, n = 9, seed = 1) => { const g = p.g; g.save(); const r = (i) => { const x = Math.sin((i + 1) * 127.1 * seed + 311.7) * 43758.5453; return x - Math.floor(x); };
  for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (r(i) - 0.5) * 2.6, v = 220 + 260 * r(i + 9), x = 300 + Math.cos(a) * v * t, y = 560 + Math.sin(a) * v * t + 520 * t * t, s = 0.8 + 0.5 * r(i + 3);
    g.globalAlpha = Math.max(0, 1 - Math.max(0, t - 0.65) / 0.35); g.save(); g.translate(x, y); g.rotate(t * 6 * (r(i + 5) - 0.5)); g.scale(s, s);
    for (const [dx, dy, rr_] of [[0, 0, 22], [-16, -10, 16], [15, -12, 17], [4, -22, 14], [-8, 12, 14]]) p.ell(dx, dy, rr_, rr_ * 0.9, "#fff4d6", 5); p.ell(2, 8, 7, 6, "#e8b860", 0); g.restore(); }
  g.restore(); };
/** one popped kernel (thrown/caught) */
export const fxKernel = (p, a = 0) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(a); for (const [dx, dy, rr_] of [[0, 0, 70], [-50, -30, 52], [48, -36, 54], [10, -70, 46], [-26, 38, 46]]) p.ell(dx, dy, rr_, rr_ * 0.9, "#fff4d6", 14); p.ell(6, 26, 22, 18, "#e8b860", 0); g.restore(); };
