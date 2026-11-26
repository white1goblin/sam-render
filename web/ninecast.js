
// ---------------- "The $9.99 Trap" cast (original fictional designs, no logos) — appended last in toon.js ----------------
// shopper (coral sweater, chestnut shoulder-length hair), manager (burgundy waistcoat, slick hair, pencil moustache, MANAGER badge),
// resA (silver bun, round glasses, sage cardigan), resB (ginger beard, round glasses, tan corduroy jacket + navy tie).
Object.assign(OUTFITS, {
  shopper: base({ tunic: "#ef7458", sleeve: "#e66c50", pants: "#3b4f86", jeans: 1, shoe: "#f4f1ea", sneaker: 1, skin: "#f3c6a2", hair: "#5a2e1c", longHair: "#5a2e1c", lashes: true, uniform: "sweater", legK: 0.97 }),
  manager: base({ tunic: "#7c2638", sleeve: "#b9cfe8", pants: "#2c2a34", shoe: "#1c1618", skin: "#d9a179", hair: "#1c1618", moustache: "#1c1618", uniform: "waistcoat", tie: "#e2b23a", tag: "MANAGER" }),
  resA: base({ tunic: "#6f8f7c", sleeve: "#678775", pants: "#4a4854", shoe: "#3a2a22", skin: "#9a6440", hair: "#c9c7cc", bun: "#c9c7cc", glasses: true, lashes: true, uniform: "cardigan", vestCol: "#f4f0e6" }),
  resB: base({ tunic: "#b07c46", sleeve: "#a8743f", pants: "#4a4a58", shoe: "#2a2220", skin: "#f2c6a2", hair: "#c4642c", beard: "#c4642c", beardK: 0.6, glasses: true, uniform: "cord", tie: "#2a3f78" }),
});
SAM_TORSO.waistcoat = (p, O, tcx, T, chin, torsoBot, HH, u) => { // white shirt + burgundy waistcoat + gold tie + badge
  p.poly([[tcx - 1.6 * T.a, chin - 0.3 * HH], [tcx + 1.6 * T.a, chin - 0.3 * HH], [tcx + 1.6 * T.a, torsoBot + 0.2 * HH], [tcx - 1.6 * T.a, torsoBot + 0.2 * HH]], "#cfe0f2", 0);
  for (const sd of [-1, 1]) p.poly([[tcx + sd * 0.12 * T.a, chin + 0.04 * HH], [tcx + sd * 1.5 * T.a, chin - 0.1 * HH], [tcx + sd * 1.5 * T.a, torsoBot + 0.1 * HH], [tcx + sd * 0.16 * T.a, torsoBot + 0.1 * HH], [tcx + sd * 0.06 * T.a, chin + 0.62 * HH]], O.tunic, 1.6 * u);
  for (const sd of [-1, 1]) p.poly([[tcx, chin + 0.03 * HH], [tcx + sd * 0.44 * T.a, chin - 0.08 * HH], [tcx + sd * 0.36 * T.a, chin + 0.1 * HH]], "#ffffff", 1.3 * u);
  p.poly([[tcx - 0.07 * T.a, chin + 0.04 * HH], [tcx + 0.07 * T.a, chin + 0.04 * HH], [tcx + 0.09 * T.a, chin + 0.48 * HH], [tcx, chin + 0.56 * HH], [tcx - 0.09 * T.a, chin + 0.48 * HH]], O.tie, 1.1 * u);
  for (let k = 0; k < 3; k++) p.dot(tcx + 0.12 * T.a, chin + (0.66 + k * 0.12) * HH, 2.4 * u, "#e2b23a");
  if (O.tag) tagText(p, tcx - 0.66 * T.a, chin + 0.36 * HH, 0.66 * T.a, 0.1 * HH, O.tag, u, "#f2d36a", "#3a1a20");
  p.stroke([[tcx + 0.5 * T.a, chin + 0.5 * HH], [tcx + 0.86 * T.a, chin + 0.5 * HH]], 1.4 * u, mul(O.tunic, [0.7, 0.7, 0.7])); };
SAM_TORSO.cord = (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u); // corduroy jacket over light-blue shirt + tie
  const g = p.g; g.save(); g.globalAlpha = 0.22; for (let i = -12; i <= 12; i++) p.stroke([[tcx + i * 0.12 * T.a, chin - 0.2 * HH], [tcx + i * 0.12 * T.a, torsoBot + 0.1 * HH]], 1.2 * u, "#5a3a1a"); g.restore();
  p.poly([[tcx - 0.42 * T.a, chin - 0.08 * HH], [tcx + 0.42 * T.a, chin - 0.08 * HH], [tcx + 0.14 * T.a, chin + 0.7 * HH], [tcx - 0.14 * T.a, chin + 0.7 * HH]], "#cfe0f2", 1.4 * u);
  p.poly([[tcx - 0.07 * T.a, chin + 0.02 * HH], [tcx + 0.07 * T.a, chin + 0.02 * HH], [tcx + 0.08 * T.a, chin + 0.56 * HH], [tcx, chin + 0.64 * HH], [tcx - 0.08 * T.a, chin + 0.56 * HH]], O.tie, 1.1 * u);
  for (const sd of [-1, 1]) p.poly([[tcx + sd * 0.42 * T.a, chin - 0.08 * HH], [tcx + sd * 0.66 * T.a, chin + 0.2 * HH], [tcx + sd * 0.16 * T.a, chin + 0.72 * HH]], mul(O.tunic, [0.85, 0.85, 0.85]), 1.4 * u);
  for (const sd of [-1, 1]) { const x = tcx + sd * 0.62 * T.a, y = chin + 0.78 * HH; p.poly(rrect(x - 0.2 * T.a, y, x + 0.2 * T.a, y + 0.14 * HH, 2 * u), O.tunic, 1.2 * u); }
  p.dot(tcx + 0.2 * T.a, chin + 0.84 * HH, 2.6 * u, "#3a2a1a"); };
Object.assign(PROPS, {
  // two paper shopping bags hugged to the chest (no logos: plain colours + a stripe)
  bags: (p, x, y, u, o) => { for (const [dx, dy, col, a] of [[-16, 4, "#f2c23a", -0.12], [14, 0, "#e86a8a", 0.1]]) { const g = p.g; g.save(); g.translate(x + dx * u, y + dy * u); g.rotate(a);
      p.poly(rrect(-20 * u, -22 * u, 20 * u, 26 * u, 2 * u), col, 2.4 * u); p.band([[-20 * u, -12 * u], [20 * u, -12 * u]], "#ffffff", 3 * u, 0);
      p.stroke(ellPts(0, -22 * u, 10 * u, 11 * u, 180, 360, 0, 10), 2.4 * u, "#3a2a2a"); if (o.tissue !== false) p.poly([[-12 * u, -22 * u], [-4 * u, -34 * u], [2 * u, -24 * u], [10 * u, -36 * u], [14 * u, -22 * u]], "#ffffff", 1.6 * u); g.restore(); } },
  tagHand: (p, x, y, u, o) => { const g = p.g; g.save(); g.translate(x, y - 8 * u); g.rotate(-0.15); p.stroke([[0, 6 * u], [0, -6 * u]], 1.2 * u, "#c8c4b8");
    p.poly([[-14 * u, -6 * u], [14 * u, -6 * u], [14 * u, 26 * u], [-14 * u, 26 * u]], "#fbf6e6", 1.8 * u); p.ell(0, -1 * u, 2 * u, 2 * u, "#8a8478", 0.8 * u);
    g.fillStyle = "#c8322e"; g.textAlign = "center"; g.font = `900 ${8.5 * u}px Arial Black, Arial`; g.fillText(o.tagTxt || "$.99", 0, 15 * u); g.restore(); },
  catalog: (p, x, y, u, o) => { const g = p.g; g.save(); g.translate(x, y); g.rotate(o.catA ?? -0.1); p.poly(rrect(-18 * u, -26 * u, 18 * u, 22 * u, 1.5 * u), "#fbf8f0", 2 * u);
    p.poly(rrect(-15 * u, -23 * u, 15 * u, -13 * u, 1 * u), "#2a9a92", 0); p.ell(0, 2 * u, 7 * u, 12 * u, "#2a9a92", 1.2 * u);
    g.fillStyle = "#1a1a22"; g.textAlign = "center"; g.font = `900 ${8 * u}px Arial Black, Arial`; g.fillText(o.catL || "B", 11 * u, 19 * u); g.restore(); },
  envelope2: (p, x, y, u, o) => PROPS.envelope(p, x, y, u, o),
});
