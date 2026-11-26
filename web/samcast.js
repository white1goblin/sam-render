
// ---------------- "Sam: Day 0 to Day 100" cast (our own fictional designs) — appended last in toon.js ----------------
// All characters are fictional. No logos. Built on romanFront (patched by build.sh: O.shoe, opts.sit, O.legK/torsoK, SAM_TORSO, samAfter, samLate).
FACE.cry = { eye: ["squeeze", "squeeze"], brow: [-4, -4], mouth: "wave" };
FACE.teary = { eye: ["lid", "lid"], brow: [-5, -5], mouth: "smile" };
FACE.tired = { eye: ["lid", "lid"], brow: [-2, -2], mouth: "dash" };
FACE.focus = { eye: ["slit", "slit"], brow: [4, 4], mouth: "dash" };
FACE.angry = { eye: ["dot", "dot"], brow: [7, 7], mouth: "frown" };
FACE.grimace = { eye: ["squeeze", "squeeze"], brow: [4, 4], mouth: "teeth" };
FACE.soft = { eye: ["happy", "happy"], brow: [-2, -2], mouth: "smile" };

const DENIM = "#34507a", DENIM_D = "#263c5e", SNEAK = "#f2efe6";
const SAMB = "#3d7fd0"; // Sam's blue hoodie
const base = (o) => ({ after: true, shoe: "#3a3036", ...o });
Object.assign(OUTFITS, {
  // Sam at 17-18: blue hoodie (drawstrings, pocket, ribbed hem), dark jeans, worn sneakers, brown short hair
  sam: base({ tunic: SAMB, sleeve: "#3574c2", pants: DENIM, jeans: 1, shoe: SNEAK, sneaker: 1, skin: "#f2c9a4", hair: "#6a4228", uniform: "hoodie" }),
  samSocks: base({ tunic: SAMB, sleeve: "#3574c2", pants: DENIM, jeans: 1, shoe: "#f4f2ee", socks: 1, skin: "#f2c9a4", hair: "#6a4228", uniform: "hoodie" }),
  sam15: base({ tunic: "#4a86c8", sleeve: "#427cbe", pants: DENIM, jeans: 1, shoe: SNEAK, sneaker: 1, skin: "#f2c9a4", hair: "#6a4228", uniform: "hoodie" }),
  sam12: base({ tunic: "#8a96a6", sleeve: "#7e8a9a", pants: DENIM, jeans: 1, shoe: "#e04a3a", sneaker: 1, skin: "#f2c9a4", hair: "#6a4228", uniform: "hoodie", legK: 0.95, torsoK: 0.95 }),
  sam9: base({ tunic: "#e0a43a", sleeve: "#d89a32", pants: "#4a6a9a", jeans: 1, shoe: "#3a7ad8", sneaker: 1, skin: "#f2c9a4", hair: "#6a4228", uniform: "stripe", stripe: "#3a6ab8", legK: 0.86, torsoK: 0.9 }),
  sam5: base({ tunic: "#d8443c", sleeve: "#cc3c34", pants: "#4a6a9a", shoe: "#f2efe6", sneaker: 1, skin: "#f4cdaa", hair: "#6a4228", uniform: "tee", truckTee: 1, legK: 0.72, torsoK: 0.85 }),
  sam1: base({ tunic: "#9ad0e8", sleeve: "#8cc4dc", pants: "#9ad0e8", shoe: "#f4f2ee", skin: "#f6d2b0", hair: "#7a5234", uniform: "onesie", legK: 0.5, torsoK: 0.78, stout: true }),
  // Mia: older sister, long dark hair, mustard sweater, jeans; kid version for flashbacks; gas-station polo at 18
  mia: base({ tunic: "#d9a326", sleeve: "#cf9a22", pants: DENIM, jeans: 1, shoe: "#f2efe6", sneaker: 1, skin: "#eec2a0", hair: "#2a1c18", longHair: "#2a1c18", lashes: true, uniform: "sweater" }),
  mia18: base({ tunic: "#c8402e", sleeve: "#c03a28", pants: "#2e3442", shoe: "#2a2428", skin: "#eec2a0", hair: "#2a1c18", longHair: "#2a1c18", lashes: true, uniform: "polo", tag: "MIA" }),
  mia12: base({ tunic: "#e2b23a", sleeve: "#d8aa34", pants: DENIM, jeans: 1, shoe: "#e05a8a", sneaker: 1, skin: "#eec2a0", hair: "#2a1c18", longHair: "#2a1c18", lashes: true, uniform: "sweater", legK: 0.92, torsoK: 0.95 }),
  mia3: base({ tunic: "#f2c23a", sleeve: "#eab832", dress: "#f2c23a", pants: "#f4e6c8", shoe: "#e05a8a", skin: "#eec2a0", hair: "#2a1c18", pig: "#2a1c18", lashes: true, uniform: "kiddress", legK: 0.6, torsoK: 0.82 }),
  // Linda (Mom): diner uniform — teal dress, white apron, name tag, hair bun; flat shoes (no boots)
  linda: base({ tunic: "#2a9a92", sleeve: "#24908a", dress: "#2a9a92", pants: "#e8c8a8", shoe: "#2a2428", skin: "#f0c8a4", hair: "#7a4a2e", bun: "#7a4a2e", lashes: true, uniform: "waitress", apronW: 1, tag: "LINDA" }),
  lindaOff: base({ tunic: "#2a9a92", sleeve: "#24908a", dress: "#2a9a92", pants: "#e8c8a8", shoe: "#2a2428", skin: "#f0c8a4", hair: "#7a4a2e", bun: "#7a4a2e", lashes: true, uniform: "waitress", tag: "LINDA" }),
  lindaHome: base({ tunic: "#b86a8a", sleeve: "#ae6282", pants: "#4a4a5e", shoe: "#c8b8a8", skin: "#f0c8a4", hair: "#7a4a2e", bun: "#7a4a2e", lashes: true, uniform: "cardigan", vestCol: "#e8dcc8" }),
  // Ray (Dad): red cap, grey beard, green work shirt, jeans, work boots
  ray: base({ tunic: "#4f7a4a", sleeve: "#487242", pants: DENIM, jeans: 1, boots: "#6a4a2e", skin: "#e8b894", cap: "#c0302c", beard: "#b8b4ac", beardK: 0.62, uniform: "work", stout: true }),
  rayYoung: base({ tunic: "#4f7a4a", sleeve: "#487242", pants: DENIM, jeans: 1, boots: "#6a4a2e", skin: "#e8b894", cap: "#c0302c", beard: "#6a4a30", beardK: 0.62, uniform: "work", stout: true }),
  rayVest: base({ tunic: "#4f7a4a", sleeve: "#487242", pants: DENIM, jeans: 1, boots: "#6a4a2e", skin: "#e8b894", cap: "#c0302c", beard: "#8a7a68", beardK: 0.62, uniform: "work", hivis: 1, stout: true }),
  rayShop: base({ tunic: "#4f7a4a", sleeve: "#487242", pants: DENIM, jeans: 1, boots: "#6a4a2e", skin: "#e8b894", cap: "#c0302c", beard: "#b8b4ac", beardK: 0.62, uniform: "work", shopApron: 1, stout: true }),
  // Mr. Hollis: bald, round glasses, white moustache, white shirt + brown vest/cardigan
  hollis: base({ tunic: "#8a5a36", sleeve: "#ece6da", pants: "#5a5048", shoe: "#3a2a22", skin: "#f0caa8", moustache: "#f4f1ea", glasses: true, tufts: "#f4f1ea", uniform: "cardigan", vestCol: "#f2eee4" }),
  // Dee: laid-off mechanic, grey-blue coveralls with name patch
  dee: base({ tunic: "#5a6e86", sleeve: "#54687e", pants: "#5a6e86", shoe: "#2a2428", boots: "#2a2428", skin: "#c99067", hair: "#1e1714", bun: "#1e1714", lashes: true, uniform: "coveralls", tag: "DEE" }),
  kidA: base({ tunic: "#2f9a6a", sleeve: "#2a8e60", pants: "#3a3a4a", shoe: SNEAK, sneaker: 1, skin: "#f5c9a0", hair: "#c07a32", uniform: "hoodie", legK: 0.96 }),
  kidB: base({ tunic: "#8a5ab8", sleeve: "#8052ae", pants: DENIM, jeans: 1, shoe: "#e04a3a", sneaker: 1, skin: "#8a5a3a", hair: "#1a1410", style: "curly", lashes: true, uniform: "tee", legK: 0.96 }),
  inspector: base({ tunic: "#5a5e66", sleeve: "#565a62", pants: "#4a4e56", shoe: "#1a1416", skin: "#e2b08c", hair: "#3a3028", uniform: "suit", tie: "#2a4a8a" }),
  cop: base({ tunic: "#22305a", sleeve: "#1e2a52", pants: "#1e2a4a", shoe: "#141216", skin: "#c99067", cap: "#1c2648", uniform: "police", copCap: 1 }),
  buyer: base({ tunic: "#2a2e38", sleeve: "#262a34", pants: "#2a2e38", shoe: "#141216", skin: "#f0c8a4", hair: "#a8a8ac", uniform: "suit", tie: "#d8a020" }),
  landlord: base({ tunic: "#7a6a5a", sleeve: "#726252", pants: "#4a4440", shoe: "#2a2220", skin: "#e8b894", hair: "#5a5048", uniform: "suit", tie: "#6a2a2a", stout: true }),
  flea: base({ tunic: "#a83a32", sleeve: "#a0342c", pants: "#5a5040", shoe: "#4a3a2a", boots: "#4a3a2a", skin: "#e2a882", cap: "#3a5a3a", beard: "#8a5a3a", beardK: 0.55, uniform: "flannel" }),
  custA: base({ tunic: "#e07a3a", sleeve: "#d87234", pants: "#4a4a5a", shoe: SNEAK, sneaker: 1, skin: "#f0c8a4", hair: "#d8b060", lashes: true, uniform: "tee" }),
  custB: base({ tunic: "#3a8a8a", sleeve: "#348080", pants: DENIM, jeans: 1, shoe: "#4a3a2a", skin: "#a8704a", cap: "#e8e4d8", uniform: "flannel" }),
  custC: base({ tunic: "#7a3a5a", sleeve: "#72344f", pants: "#3a3a4a", shoe: "#2a2428", skin: "#f5c9a0", hair: "#9a9aa0", uniform: "cardigan", vestCol: "#e8dcc8", glasses: true }),
  neighbor: base({ tunic: "#6a7a9a", sleeve: "#627292", pants: "#4a4a4a", shoe: "#2a2428", skin: "#f0c8a4", hair: "#c8c0b0", bun: "#c8c0b0", lashes: true, uniform: "cardigan", vestCol: "#f0ead8" }),
  nurse: base({ tunic: "#6ab0c8", sleeve: "#62a8c0", pants: "#6ab0c8", shoe: "#f2efe6", skin: "#c99067", hair: "#1e1714", bun: "#1e1714", lashes: true, uniform: "scrubs" }),
});

/** torso painters (clipped to the torso blob; called from aussieTorso via the build patch) */
const SAM_TORSO = {
  stripe: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    for (let k = 0; k < 6; k++) p.band([[tcx - 1.5 * T.a, chin + (0.12 + k * 0.17) * HH], [tcx + 1.5 * T.a, chin + (0.12 + k * 0.17) * HH]], O.stripe, 0.06 * HH, 0);
    p.band(ellPts(tcx, chin - 0.03 * HH, 0.5 * T.a, 0.12 * HH, 0, 180, 0, 16), mul(O.tunic, [0.8, 0.8, 0.8]), 0.05 * HH, 1.2 * u); },
  tee: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    p.band(ellPts(tcx, chin - 0.03 * HH, 0.5 * T.a, 0.12 * HH, 0, 180, 0, 16), mul(O.tunic, [0.8, 0.8, 0.8]), 0.05 * HH, 1.2 * u);
    if (O.truckTee) { const x = tcx, y = chin + 0.42 * HH; p.poly(rrect(x - 0.42 * T.a, y - 0.12 * HH, x + 0.2 * T.a, y + 0.06 * HH, 2 * u), "#f2c23a", 1.4 * u); p.poly(rrect(x + 0.2 * T.a, y - 0.06 * HH, x + 0.44 * T.a, y + 0.06 * HH, 2 * u), "#f2c23a", 1.4 * u);
      for (const dx of [-0.26, 0.28]) p.ell(x + dx * T.a, y + 0.08 * HH, 0.09 * T.a, 0.05 * HH, "#2a2a30", 1.2 * u); }
    stitch(p, [[tcx - 1.3 * T.a, torsoBot - 0.12 * HH], [tcx + 1.3 * T.a, torsoBot - 0.12 * HH]], u, "#00000030"); },
  onesie: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    for (let k = 0; k < 5; k++) p.band([[tcx - 1.5 * T.a, chin + (0.1 + k * 0.2) * HH], [tcx + 1.5 * T.a, chin + (0.1 + k * 0.2) * HH]], "#f4f8fa", 0.05 * HH, 0);
    for (let k = 0; k < 3; k++) p.dot(tcx, chin + (0.2 + k * 0.17) * HH, 2.6 * u, "#f2c23a"); },
  kiddress: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    p.poly(ellPts(tcx, chin - 0.02 * HH, 0.46 * T.a, 0.16 * HH, 0, 180, 0, 18), "#fbf8f0", 1.4 * u);
    for (let i = 0; i < 10; i++) p.dot(tcx + Math.sin(i * 2.3) * 0.8 * T.a, chin + (0.2 + (i * 0.37) % 1 * 0.6) * HH, 3 * u, "#ffffffa0"); },
  sweater: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    const d1 = mul(O.tunic, [0.8, 0.78, 0.74]);
    p.band(ellPts(tcx, chin - 0.03 * HH, 0.46 * T.a, 0.12 * HH, 0, 180, 0, 18), d1, 0.07 * HH, 1.3 * u); // ribbed crew neck
    for (const sd of [-1, 0, 1]) { const x = tcx + sd * 0.42 * T.a; for (let k = 0; k < 7; k++) { const y = chin + (0.14 + k * 0.11) * HH; p.stroke([[x - 0.08 * T.a, y], [x, y + 0.05 * HH], [x + 0.08 * T.a, y]], 1.4 * u, d1); } } // cable knit
    p.band([[tcx - 1.5 * T.a, torsoBot - 0.1 * HH], [tcx + 1.5 * T.a, torsoBot - 0.1 * HH]], d1, 0.11 * HH, 1.2 * u);
    for (let i = -10; i <= 10; i++) p.stroke([[tcx + i * 0.14 * T.a, torsoBot - 0.15 * HH], [tcx + i * 0.14 * T.a, torsoBot - 0.05 * HH]], 1 * u, mul(O.tunic, [0.62, 0.6, 0.56])); },
  polo: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    for (const sd of [-1, 1]) p.poly([[tcx, chin + 0.02 * HH], [tcx + sd * 0.5 * T.a, chin - 0.08 * HH], [tcx + sd * 0.42 * T.a, chin + 0.12 * HH]], mul(O.tunic, [0.85, 0.85, 0.85]), 1.4 * u);
    p.stroke([[tcx, chin + 0.02 * HH], [tcx, chin + 0.3 * HH]], 1.6 * u); for (let k = 0; k < 2; k++) p.dot(tcx + 3 * u, chin + (0.1 + k * 0.1) * HH, 2.2 * u, "#f4f1ea");
    if (O.tag) tagText(p, tcx + 0.55 * T.a, chin + 0.3 * HH, 0.55 * T.a, 0.1 * HH, O.tag, u); },
  waitress: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    for (const sd of [-1, 1]) p.poly([[tcx, chin + 0.04 * HH], [tcx + sd * 0.52 * T.a, chin - 0.08 * HH], [tcx + sd * 0.46 * T.a, chin + 0.14 * HH]], "#fbf8f0", 1.4 * u); // white collar
    for (let k = 0; k < 4; k++) p.dot(tcx, chin + (0.14 + k * 0.15) * HH, 2.4 * u, "#fbf8f0");
    if (O.apronW) { const top = chin + 0.36 * HH; p.poly([[tcx - 0.46 * T.a, top], [tcx + 0.46 * T.a, top], [tcx + 0.5 * T.a, torsoBot + 0.1 * HH], [tcx - 0.5 * T.a, torsoBot + 0.1 * HH]], "#fbfaf4", 1.6 * u); // apron bib
      for (const sd of [-1, 1]) p.stroke([[tcx + sd * 0.44 * T.a, top], [tcx + sd * 0.64 * T.a, chin - 0.06 * HH]], 3 * u, "#fbfaf4"); }
    p.band([[tcx - 1.4 * T.a, torsoBot - 0.2 * HH], [tcx + 1.4 * T.a, torsoBot - 0.2 * HH]], O.apronW ? "#fbfaf4" : mul(O.tunic, [0.8, 0.8, 0.8]), 0.06 * HH, 1.2 * u);
    if (O.tag) tagText(p, tcx - 0.62 * T.a, chin + 0.24 * HH, 0.58 * T.a, 0.1 * HH, O.tag, u, "#fbf6e6", "#1a4a46"); },
  work: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    const d = mul(O.tunic, [0.78, 0.78, 0.78]);
    for (const sd of [-1, 1]) p.poly([[tcx, chin + 0.05 * HH], [tcx + sd * 0.55 * T.a, chin - 0.08 * HH], [tcx + sd * 0.5 * T.a, chin + 0.16 * HH]], d, 1.4 * u); // collar
    p.stroke([[tcx + 0.03 * T.a, chin + 0.05 * HH], [tcx + 0.03 * T.a, torsoBot]], 1.6 * u, d);
    for (let k = 0; k < 5; k++) p.dot(tcx + 0.06 * T.a, chin + (0.14 + k * 0.15) * HH, 2.4 * u, "#e8e0c8");
    for (const sd of [-1, 1]) { const x = tcx + sd * 0.48 * T.a, y = chin + 0.28 * HH; p.poly(rrect(x - 0.2 * T.a, y, x + 0.2 * T.a, y + 0.18 * HH, 2 * u), O.tunic, 1.2 * u); p.stroke([[x - 0.2 * T.a, y + 0.05 * HH], [x + 0.2 * T.a, y + 0.05 * HH]], 1.2 * u); }
    stitch(p, [[tcx - 1.2 * T.a, chin + 0.04 * HH], [tcx + 1.2 * T.a, chin + 0.04 * HH]], u, "#ffffff40");
    if (O.hivis) { const y0 = chin - 0.06 * HH; for (const sd of [-1, 1]) p.poly([[tcx + sd * 0.25 * T.a, y0], [tcx + sd * 1.3 * T.a, y0], [tcx + sd * 1.3 * T.a, torsoBot], [tcx + sd * 0.35 * T.a, torsoBot]], "#e8f03a", 1.4 * u);
      for (const sd of [-1, 1]) p.band([[tcx + sd * 0.35 * T.a, chin + 0.62 * HH], [tcx + sd * 1.3 * T.a, chin + 0.62 * HH]], "#e0e4e8", 0.06 * HH, 1 * u); }
    if (O.shopApron) { const top = chin + 0.3 * HH; p.poly([[tcx - 0.55 * T.a, top], [tcx + 0.55 * T.a, top], [tcx + 0.6 * T.a, torsoBot + 0.1 * HH], [tcx - 0.6 * T.a, torsoBot + 0.1 * HH]], "#7a4a2a", 1.6 * u);
      tagText(p, tcx, top + 0.14 * HH, 0.6 * T.a, 0.08 * HH, "DAY ONE", u, "#7a4a2a", "#f2e6c8"); } },
  flannel: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    const d = mul(O.tunic, [0.62, 0.62, 0.62]); const g = p.g; g.save(); g.globalAlpha = 0.5;
    for (let k = -6; k <= 6; k++) { p.stroke([[tcx + k * 0.24 * T.a, chin - 0.2 * HH], [tcx + k * 0.24 * T.a, torsoBot]], 4 * u, d); p.stroke([[tcx - 1.5 * T.a, chin + k * 0.14 * HH + 0.5 * HH], [tcx + 1.5 * T.a, chin + k * 0.14 * HH + 0.5 * HH]], 4 * u, d); }
    g.restore(); for (const sd of [-1, 1]) p.poly([[tcx, chin + 0.05 * HH], [tcx + sd * 0.55 * T.a, chin - 0.08 * HH], [tcx + sd * 0.5 * T.a, chin + 0.16 * HH]], O.tunic, 1.4 * u);
    for (let k = 0; k < 4; k++) p.dot(tcx, chin + (0.15 + k * 0.16) * HH, 2.4 * u, "#e8e0c8"); },
  cardigan: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    p.poly([[tcx - 0.36 * T.a, chin - 0.08 * HH], [tcx + 0.36 * T.a, chin - 0.08 * HH], [tcx + 0.1 * T.a, chin + 0.62 * HH], [tcx - 0.1 * T.a, chin + 0.62 * HH]], O.vestCol || "#f2eee4", 1.4 * u); // shirt V
    for (const sd of [-1, 1]) p.poly([[tcx + sd * 0.1 * T.a, chin - 0.06 * HH], [tcx + sd * 0.3 * T.a, chin - 0.08 * HH], [tcx + sd * 0.18 * T.a, chin + 0.06 * HH]], O.vestCol || "#f2eee4", 1.2 * u);
    for (let k = 0; k < 4; k++) p.dot(tcx + 0.16 * T.a, chin + (0.7 + k * 0.12) * HH, 2.8 * u, "#d8c8a8");
    p.stroke([[tcx + 0.1 * T.a, chin + 0.62 * HH], [tcx + 0.06 * T.a, torsoBot]], 1.6 * u);
    for (const sd of [-1, 1]) { const x = tcx + sd * 0.62 * T.a, y = chin + 0.72 * HH; p.poly(rrect(x - 0.18 * T.a, y, x + 0.18 * T.a, y + 0.16 * HH, 2 * u), O.tunic, 1.2 * u); } },
  coveralls: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    const d = mul(O.tunic, [0.78, 0.78, 0.8]);
    for (const sd of [-1, 1]) p.poly([[tcx, chin + 0.06 * HH], [tcx + sd * 0.56 * T.a, chin - 0.08 * HH], [tcx + sd * 0.52 * T.a, chin + 0.16 * HH]], d, 1.4 * u);
    p.stroke([[tcx, chin + 0.06 * HH], [tcx, torsoBot]], 2.4 * u, "#c9ccd0"); p.dot(tcx, chin + 0.2 * HH, 3 * u, "#c9ccd0");
    tagText(p, tcx + 0.56 * T.a, chin + 0.3 * HH, 0.5 * T.a, 0.1 * HH, O.tag || "", u, "#f2efe6", "#a8322e");
    p.poly(rrect(tcx - 0.8 * T.a, chin + 0.24 * HH, tcx - 0.36 * T.a, chin + 0.44 * HH, 2 * u), O.tunic, 1.2 * u);
    p.band([[tcx - 1.4 * T.a, torsoBot - 0.22 * HH], [tcx + 1.4 * T.a, torsoBot - 0.22 * HH]], d, 0.05 * HH, 1 * u);
    const g = p.g; g.save(); g.globalAlpha = 0.35; for (let i = 0; i < 5; i++) p.ell(tcx + Math.sin(i * 2.1) * 0.7 * T.a, chin + (0.4 + (i * 0.31) % 1 * 0.5) * HH, 8 * u, 4 * u, "#2a2a2a", 0); g.restore(); },
  police: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    for (const sd of [-1, 1]) p.poly([[tcx, chin + 0.05 * HH], [tcx + sd * 0.55 * T.a, chin - 0.08 * HH], [tcx + sd * 0.5 * T.a, chin + 0.16 * HH]], mul(O.tunic, [0.8, 0.8, 0.85]), 1.4 * u);
    p.stroke([[tcx, chin + 0.05 * HH], [tcx, torsoBot]], 1.6 * u, "#141a30"); for (let k = 0; k < 4; k++) p.dot(tcx + 0.05 * T.a, chin + (0.16 + k * 0.15) * HH, 2.4 * u, "#c9ccd0");
    const bx = tcx - 0.55 * T.a, by = chin + 0.3 * HH; p.poly([[bx, by - 10 * u], [bx + 8 * u, by - 4 * u], [bx + 6 * u, by + 8 * u], [bx, by + 12 * u], [bx - 6 * u, by + 8 * u], [bx - 8 * u, by - 4 * u]], "#e8c45a", 1.4 * u); // badge (generic star shield)
    for (const sd of [-1, 1]) { const x = tcx + sd * 0.5 * T.a, y = chin + 0.42 * HH; p.poly(rrect(x - 0.18 * T.a, y, x + 0.18 * T.a, y + 0.14 * HH, 2 * u), O.tunic, 1.2 * u); }
    p.band([[tcx - 1.4 * T.a, torsoBot - 0.2 * HH], [tcx + 1.4 * T.a, torsoBot - 0.2 * HH]], "#141216", 0.08 * HH, 1.2 * u);
    p.poly(rrect(tcx + 0.5 * T.a, torsoBot - 0.26 * HH, tcx + 0.8 * T.a, torsoBot - 0.1 * HH, 2 * u), "#2a2a2e", 1.2 * u); },
  scrubs: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    p.poly([[tcx - 0.36 * T.a, chin - 0.06 * HH], [tcx + 0.36 * T.a, chin - 0.06 * HH], [tcx, chin + 0.3 * HH]], O.skin, 1.4 * u);
    p.poly(rrect(tcx - 0.8 * T.a, chin + 0.32 * HH, tcx - 0.36 * T.a, chin + 0.5 * HH, 2 * u), O.tunic, 1.2 * u); },
};

/** details drawn after the torso (jeans seams, cuffs, sneaker soles + laces, socks, apron skirt) */
const samAfter = (p, O, tcx, T, chin, torsoBot, HH, u) => {
  const opts = p._opts || {}, sole = 975, hipY = torsoBot - 0.12 * HH, cx = 300;
  for (const side of [-1, 1]) {
    const wf = walkFoot(side, opts, u), up = wf.up;
    const hx = cx + side * 16 * u, fx = cx + side * 22 * u + wf.dx, fy = sole - 4 * u - up;
    if (O.jeans && !O.dress) { const mx = (hx + fx) / 2 + side * 2 * u, my = (hipY + fy) / 2; const g = p.g; g.save(); g.setLineDash([2.6 * u, 2 * u]);
      p.stroke(curve([hx + side * 1.5 * u, torsoBot + 0.04 * HH], [mx + side * 1.5 * u, my], [fx + side * 1.5 * u, fy - 0.1 * HH]), 1 * u, "#e8c070"); g.restore();
      p.stroke([[fx - 3.4 * u, fy - 0.07 * HH], [fx + 3.4 * u, fy - 0.07 * HH]], 1.6 * u, mul(O.pants, [1.25, 1.25, 1.25])); // cuff
      if (opts.sit) p.ell(hx + side * 1 * u, torsoBot + 0.08 * HH, 4.6 * u, 3.4 * u, mul(O.pants, [1.15, 1.15, 1.15]), 1.2 * u); }
    if (O.sneaker) { p.stroke([[fx - side * 3 * u, fy + 2.4 * u], [fx + side * 13 * u, fy + 2.9 * u]], 2.2 * u, "#ffffff"); for (let k = 0; k < 3; k++) p.stroke([[fx + side * (1 + k * 3) * u, fy - 2.5 * u], [fx + side * (2.5 + k * 3) * u, fy - 0.5 * u]], 0.9 * u, "#8a8a92"); }
    if (O.socks) { p.stroke([[fx - side * 2 * u, fy - 1 * u], [fx + side * 10 * u, fy - 1 * u]], 1.1 * u, "#c8c8cc"); }
  }
  if (O.apronW && O.dress) { const top = torsoBot - 0.24 * HH; const ap = [[tcx - 0.7 * T.a, top], [tcx + 0.7 * T.a, top], [tcx + 0.76 * T.a, top + 0.62 * HH], [tcx - 0.76 * T.a, top + 0.62 * HH]];
    p.poly(ap, "#fbfaf4", 1.8 * u); p.poly(rrect(tcx - 0.42 * T.a, top + 0.14 * HH, tcx + 0.42 * T.a, top + 0.34 * HH, 2 * u), "#fbfaf4", 1.2 * u);
    p.poly(rrect(tcx + 0.1 * T.a, top + 0.06 * HH, tcx + 0.3 * T.a, top + 0.2 * HH, 1 * u), "#f2e8a8", 1 * u); p.stroke([[tcx - 0.12 * T.a, top + 0.06 * HH], [tcx - 0.1 * T.a, top + 0.22 * HH]], 1.6 * u, "#3a6ad8"); }
};

/** head geometry (mirrors romanFront) for pre-layers */
const samGeo = (O, opts) => { const H = headBlob(opts.seed ?? 3, 118, opts.facing || 0), HH = 2 * H.b, legsL = (opts.sit ? 0.62 : 1.38) * (O.legK || 1), torsoL = (O.stout ? 1.12 : 1.08) * (O.torsoK || 1);
  const torsoBot = 975 - legsL * HH - (opts.bob || 0) * HH, chin = torsoBot - torsoL * HH, hc = chin - H.b; return { H, HH, chin, hc, torsoBot, u: 2 * H.a / 100 }; };
/** back layer: long hair, bun, pigtails behind the head */
const samBack = (p, O, opts) => { const G = samGeo(O, opts), { H, hc, chin, u } = G, cx = 300; const ah = (opts.tilt || 0) + (opts.headTilt || 0); p.rot = ah ? [rad(ah), cx, chin, 0, 0] : null;
  if (O.longHair) { const pts = [[cx - 1.06 * H.a, hc - 0.2 * H.b], [cx - 1.18 * H.a, hc + 0.9 * H.b], [cx - 1.0 * H.a, chin + 0.62 * G.HH], [cx - 0.3 * H.a, chin + 0.5 * G.HH], [cx + 0.3 * H.a, chin + 0.5 * G.HH], [cx + 1.0 * H.a, chin + 0.62 * G.HH], [cx + 1.18 * H.a, hc + 0.9 * H.b], [cx + 1.06 * H.a, hc - 0.2 * H.b]];
    p.poly(pts, O.longHair, 4.2 * u); for (let i = -4; i <= 4; i++) if (Math.abs(i) > 1) p.stroke([[cx + i * 0.25 * H.a, hc + 0.6 * H.b], [cx + i * 0.27 * H.a, chin + 0.5 * G.HH]], 1.2 * u, mul(O.longHair, [1.6, 1.6, 1.6])); }
  if (O.bun) { p.ell(cx + 0.1 * H.a, hc - 1.0 * H.b, 0.42 * H.a, 0.34 * H.b, O.bun, 4.2 * u); p.stroke(ellPts(cx + 0.1 * H.a, hc - 1.0 * H.b, 0.25 * H.a, 0.18 * H.b, 200, 330, 0, 10), 1.4 * u, mul(O.bun, [1.5, 1.5, 1.5])); }
  if (O.pig) for (const sd of [-1, 1]) { p.ell(cx + sd * 1.12 * H.a, hc + 0.1 * H.b, 0.26 * H.a, 0.42 * H.b, O.pig, 4 * u); p.ell(cx + sd * 0.98 * H.a, hc - 0.32 * H.b, 0.1 * H.a, 0.08 * H.b, "#e05a8a", 2 * u); }
  p.rot = null; };

/** props and late details (drawn after the face, in head-rotation space reset) */
const PROPS = {
  camcorder: (p, x, y, u, o) => { p.poly(rrect(x - 26 * u, y - 18 * u, x + 22 * u, y + 12 * u, 4 * u), "#3a3a42", 2.6 * u); p.poly(rrect(x - 12 * u, y - 26 * u, x + 6 * u, y - 18 * u, 2 * u), "#2a2a30", 1.6 * u);
    p.ell(x - 30 * u, y - 3 * u, 9 * u, 12 * u, "#2a2a30", 2.4 * u); p.ell(x - 31 * u, y - 3 * u, 5 * u, 7 * u, "#6a8ab8", 1.2 * u); p.dot(x - 33 * u, y - 6 * u, 1.6 * u, "#ffffff");
    p.dot(x + 14 * u, y - 10 * u, 3 * u, o.rec === false ? "#5a2020" : "#ff3a2a"); p.stroke([[x + 22 * u, y - 4 * u], [x + 30 * u, y + 6 * u]], 2 * u, "#2a2a30"); },
  phoneUp: (p, x, y, u, o) => { p.poly(rrect(x - 12 * u, y - 24 * u, x + 12 * u, y + 20 * u, 4 * u), "#2a2c34", 2.4 * u); p.ell(x - 5 * u, y - 15 * u, 4 * u, 4 * u, "#4a5a7a", 1.2 * u); p.dot(x + 5 * u, y - 16 * u, 2.2 * u, o.rec === false ? "#5a2020" : "#ff3a2a"); },
  phoneShow: (p, x, y, u, o) => { p.poly(rrect(x - 14 * u, y - 26 * u, x + 14 * u, y + 22 * u, 4 * u), "#2a2c34", 2.4 * u); p.poly(rrect(x - 11 * u, y - 22 * u, x + 11 * u, y + 18 * u, 2 * u), "#e8f0fa", 0);
    p.poly(rrect(x - 9 * u, y - 19 * u, x + 9 * u, y - 4 * u, 1 * u), "#6a8a5a", 0); p.dot(x, y - 11 * u, 3 * u, "#ffffff"); const g = p.g; g.save(); g.fillStyle = "#1b2a44"; g.textAlign = "center"; g.font = `900 ${7 * u}px Arial Black, Arial`; g.fillText(o.screen || "", x, y + 6 * u); g.restore(); },
  jar: (p, x, y, u, o) => { const k = o.jarK ?? 1; p.poly(rrect(x - 17 * u * k, y - 30 * u * k, x + 17 * u * k, y + 18 * u * k, 6 * u * k), "#cfe6dacc", 2.4 * u); const fill = o.jarFill ?? 0.1;
    if (fill > 0) p.poly(rrect(x - 14 * u * k, y + (15 - 40 * fill) * u * k, x + 14 * u * k, y + 15 * u * k, 4 * u * k), "#8ab868", 1 * u); for (let i = 0; i < Math.round(fill * 8); i++) p.poly(rrect(x - 12 * u * k + (i % 3) * 7 * u * k, y + (10 - i * 4) * u * k, x - 3 * u * k + (i % 3) * 7 * u * k, y + (13 - i * 4) * u * k, 1 * u), "#a8d090", 0.8 * u);
    p.poly(rrect(x - 15 * u * k, y - 38 * u * k, x + 15 * u * k, y - 29 * u * k, 2 * u), "#d8a83a", 2 * u); p.stroke([[x - 9 * u * k, y - 18 * u * k], [x - 9 * u * k, y + 4 * u * k]], 2 * u, "#ffffff90");
    if (o.lid) { const g = p.g; g.save(); g.fillStyle = "#3a2a1a"; g.textAlign = "center"; g.font = `900 ${5.4 * u * k}px Arial Black, Arial`; g.fillText(o.lid, x, y - 31.5 * u * k); g.restore(); } },
  wrench: (p, x, y, u) => { p.band([[x - 4 * u, y + 26 * u], [x + 4 * u, y - 20 * u]], "#b8c0c8", 4.6 * u, 1.6 * u); p.ell(x + 5 * u, y - 24 * u, 8 * u, 7 * u, "#b8c0c8", 1.8 * u); p.ell(x + 7 * u, y - 29 * u, 4 * u, 3.6 * u, "#3a3a42", 0); },
  knife: (p, x, y, u) => { p.band([[x, y + 8 * u], [x + 2 * u, y - 6 * u]], "#e8d8b8", 3.4 * u, 1.2 * u); p.band([[x + 2 * u, y - 6 * u], [x + 5 * u, y - 30 * u]], "#d8dde2", 3.2 * u, 1.2 * u); },
  envelope: (p, x, y, u, o) => { p.poly(rrect(x - 26 * u, y - 18 * u, x + 26 * u, y + 16 * u, 2 * u), o.old ? "#e8dcc0" : "#f6f2e6", 2.2 * u); p.stroke([[x - 26 * u, y - 18 * u], [x, y], [x + 26 * u, y - 18 * u]], 1.6 * u);
    p.poly(rrect(x - 26 * u, y + 8 * u, x + 26 * u, y + 12 * u, 0), "#2a4a8a", 0); if (o.open) p.poly(rrect(x - 20 * u, y - 34 * u, x + 20 * u, y - 14 * u, 1 * u), "#fbf8f0", 1.4 * u); },
  letter: (p, x, y, u) => { p.poly(rrect(x - 18 * u, y - 26 * u, x + 18 * u, y + 20 * u, 1 * u), "#fbf8f0", 2 * u); for (let k = 0; k < 6; k++) p.stroke([[x - 12 * u, y - 18 * u + k * 6 * u], [x + (k % 2 ? 6 : 12) * u, y - 18 * u + k * 6 * u]], 1.2 * u, "#8a96a8"); },
  paper: (p, x, y, u) => { p.poly(rrect(x - 20 * u, y - 30 * u, x + 20 * u, y + 22 * u, 1 * u), "#fbf8f0", 2 * u); p.poly(rrect(x - 14 * u, y - 24 * u, x + 14 * u, y - 18 * u, 1 * u), "#c8322e", 0); for (let k = 0; k < 6; k++) p.stroke([[x - 14 * u, y - 10 * u + k * 5 * u], [x + (k % 2 ? 8 : 14) * u, y - 10 * u + k * 5 * u]], 1 * u, "#8a96a8"); },
  notebook: (p, x, y, u) => { p.poly(rrect(x - 22 * u, y - 16 * u, x + 22 * u, y + 14 * u, 2 * u), "#fbf8f0", 2 * u); p.stroke([[x, y - 16 * u], [x, y + 14 * u]], 1.6 * u); for (let k = 0; k < 4; k++) for (const sd of [-1, 1]) p.stroke([[x + sd * 4 * u, y - 9 * u + k * 6 * u], [x + sd * 18 * u, y - 9 * u + k * 6 * u]], 1 * u, "#6a7aa8"); p.band([[x + 16 * u, y - 22 * u], [x + 26 * u, y - 6 * u]], "#3a6ad8", 2.2 * u, 0.8 * u); },
  tips: (p, x, y, u) => { for (let k = 0; k < 4; k++) { const a = (k - 1.5) * 0.25; const g = p.g; g.save(); g.translate(x, y); g.rotate(a); p.poly(rrect(-20 * u, -40 * u, 0, 0, 1.5 * u), "#9ac07a", 1.6 * u); p.ell(-10 * u, -20 * u, 4 * u, 6 * u, "#7aa05a", 0.8 * u); g.restore(); } },
  dollar: (p, x, y, u) => { p.poly(rrect(x - 18 * u, y - 9 * u, x + 18 * u, y + 9 * u, 1.5 * u), "#9ac07a", 1.6 * u); p.ell(x, y, 5 * u, 6 * u, "#7aa05a", 0.8 * u); },
  box: (p, x, y, u) => { p.poly(rrect(x - 44 * u, y - 34 * u, x + 44 * u, y + 30 * u, 2 * u), "#c8945a", 2.6 * u); p.stroke([[x - 44 * u, y - 18 * u], [x + 44 * u, y - 18 * u]], 1.6 * u, "#8a6038"); p.poly(rrect(x - 8 * u, y - 34 * u, x + 8 * u, y - 18 * u, 0), "#d8c8a0", 1 * u); },
  sign: (p, x, y, u) => { p.poly([[x - 70 * u, y - 46 * u], [x + 72 * u, y - 42 * u], [x + 68 * u, y + 30 * u], [x - 66 * u, y + 34 * u]], "#c8945a", 2.6 * u); const g = p.g; g.save(); g.fillStyle = "#1a1a22"; g.textAlign = "center"; g.font = `900 ${17 * u}px Arial Black, Arial`; g.fillText("BRING IT", x, y - 12 * u); g.fillStyle = "#c8322e"; g.fillText("BROKEN", x, y + 16 * u); g.restore(); },
  brush: (p, x, y, u) => { p.band([[x, y + 10 * u], [x + 4 * u, y - 16 * u]], "#c8a060", 3 * u, 1 * u); p.poly(rrect(x + 1 * u, y - 26 * u, x + 9 * u, y - 15 * u, 1 * u), "#c8322e", 1.2 * u); },
  truck: (p, x, y, u) => { p.poly(rrect(x - 24 * u, y - 12 * u, x + 8 * u, y + 6 * u, 2 * u), "#e8b02a", 2 * u); p.poly(rrect(x + 8 * u, y - 18 * u, x + 22 * u, y + 6 * u, 2 * u), "#d8443c", 2 * u); p.poly(rrect(x + 12 * u, y - 14 * u, x + 19 * u, y - 7 * u, 1 * u), "#bfe0f0", 1 * u); for (const dx of [-16, 14]) p.ell(x + dx * u, y + 8 * u, 6 * u, 6 * u, "#2a2a30", 1.6 * u); },
  blower: (p, x, y, u) => { p.poly(rrect(x - 22 * u, y - 16 * u, x + 16 * u, y + 18 * u, 6 * u), "#e8742a", 2.4 * u); p.band([[x - 18 * u, y + 10 * u], [x - 64 * u, y + 40 * u]], "#3a3a42", 7 * u, 1.6 * u); p.ell(x - 2 * u, y + 2 * u, 8 * u, 8 * u, "#2a2a30", 1.4 * u); },
  cord: (p, x, y, u, o) => { p.poly(rrect(x - 10 * u, y - 4 * u, x + 10 * u, y + 4 * u, 3 * u), "#2a2a30", 1.6 * u); p.stroke([[x, y + 2 * u], [x - (o.cordX ?? 30) * u, y + (o.cordY ?? 60) * u]], 1.6 * u, "#e8e0c8"); },
  apron: (p, x, y, u) => { p.poly([[x - 22 * u, y - 10 * u], [x + 22 * u, y - 10 * u], [x + 26 * u, y + 46 * u], [x - 26 * u, y + 46 * u]], "#fbfaf4", 2 * u); p.stroke([[x - 20 * u, y - 10 * u], [x - 6 * u, y - 30 * u], [x + 6 * u, y - 30 * u], [x + 20 * u, y - 10 * u]], 2 * u, "#fbfaf4"); },
  marker: (p, x, y, u) => { p.band([[x, y + 8 * u], [x + 3 * u, y - 18 * u]], "#1a1a22", 4 * u, 1.2 * u); p.dot(x + 3.4 * u, y - 20 * u, 2 * u, "#1a1a22"); },
  mug: (p, x, y, u) => { p.poly(rrect(x - 11 * u, y - 14 * u, x + 11 * u, y + 12 * u, 3 * u), "#f2efe6", 2 * u); p.arc(x + 12 * u, y - 1 * u, 6 * u, 7 * u, -80, 80, 2.4 * u); p.ell(x, y - 14 * u, 11 * u, 3 * u, "#5a3420", 1.4 * u); },
  tag: (p, x, y, u) => { p.poly([[x - 12 * u, y - 8 * u], [x + 12 * u, y - 8 * u], [x + 12 * u, y + 8 * u], [x - 12 * u, y + 8 * u], [x - 16 * u, y]], "#fbf6e0", 1.6 * u); const g = p.g; g.save(); g.fillStyle = "#c8322e"; g.textAlign = "center"; g.font = `900 ${6 * u}px Arial Black, Arial`; g.fillText("SAM", x, y + 2 * u); g.restore(); },
};
const samLate = (p, prop, arms, u, opts, cx, hc, H) => {
  if (opts.tears) { const g = p.g; g.save(); g.globalAlpha = 0.85; for (const sd of [-1, 1]) { p.ell(cx + sd * 15 * u, hc + 12 * u + (opts.tears % 1) * 10 * u, 3 * u, 5 * u, "#9fd4ff", 1 * u); p.stroke([[cx + sd * 14 * u, hc + 6 * u], [cx + sd * 15 * u, hc + 16 * u]], 2 * u, "#bfe4ff"); } g.restore(); }
  if (opts.sweat) p.ell(cx + 1.05 * H.a, hc - 0.45 * H.b, 5 * u, 7.5 * u, "#bfe4ff", 1.6 * u);
  const O = p._O || {}; if (O.tufts) for (const sd of [-1, 1]) p.ell(cx + sd * 0.96 * H.a, hc - 0.05 * H.b, 0.16 * H.a, 0.24 * H.b, O.tufts, 2.2 * u);
  if (O.copCap) { p.poly([[cx - 7 * u, hc - 1.02 * H.b], [cx + 7 * u, hc - 1.02 * H.b], [cx + 5 * u, hc - 0.82 * H.b], [cx - 5 * u, hc - 0.82 * H.b]], "#e8c45a", 1.4 * u); }
  if (!prop) return; const fn = PROPS[prop]; if (!fn) return;
  const hand = opts.propHand === "L" ? arms[0].pts[2] : arms[1].pts[2];
  const hug = prop === "box" && opts.L === "belly" && opts.R === "belly" && opts.propAt && opts.propAt[1] === 300;
  const lift = !hug && prop === "box" && opts.propAt && opts.propAt[1] === 300 && (opts.R === "hold" || opts.L === "hold");
  const [x, y] = lift ? [hand[0], hand[1] + 14 * u] : hug ? [(arms[0].pts[2][0] + arms[1].pts[2][0]) / 2, (arms[0].pts[2][1] + arms[1].pts[2][1]) / 2 - 6 * u] : opts.propAt ? [cx + opts.propAt[0] * u, hc + opts.propAt[1] * u] : [hand[0] + (opts.propDX || 0) * u, hand[1] + (opts.propDY || 0) * u];
  fn(p, x, y, u, opts);
};

/** wrapper: back layer + romanFront (patched) */
export const samFront = (p, key, opts = {}) => { const O = typeof key === "string" ? OUTFITS[key] : key; p._opts = opts; p._O = O; samBack(p, O, opts); romanFront(p, O, opts); p._opts = null; p._O = null; };
/** a swaddled newborn (own card, ~0.5 m) */
export const babyCard = (p, o = {}) => { const g = p.g; const cx = 300, cy = 760;
  p.ell(cx, cy + 40, 150, 200, "#f2d8e0", 12); p.stroke([[cx - 120, cy - 20], [cx + 110, cy + 60]], 8, "#e6c2ce"); p.stroke([[cx - 110, cy + 90], [cx + 120, cy + 150]], 8, "#e6c2ce");
  p.ell(cx, cy - 120, 120, 110, "#f6d2b0", 12); p.ell(cx, cy - 190, 125, 70, "#f2d8e0", 12, 180, 360); p.stroke([[cx - 20, cy - 178], [cx + 4, cy - 208], [cx + 26, cy - 182]], 7, "#7a5234");
  const sl = o.sleep ?? 1; if (sl) for (const sd of [-1, 1]) p.arc(cx + sd * 38, cy - 116, 18, 10, 20, 160, 8); else for (const sd of [-1, 1]) p.dot(cx + sd * 38, cy - 116, 12);
  p.ell(cx, cy - 72, o.cry ? 18 : 12, o.cry ? 16 : 6, "#c05a6a", 6); g.save(); g.globalAlpha = 0.35; for (const sd of [-1, 1]) p.ell(cx + sd * 66, cy - 84, 22, 12, "#e8707a", 0); g.restore(); };
/** "SUBSCRIBE" cardboard sign + bell (hand-drawn, no logos), held up by Sam in the ending */
export const subSign = (p, t = 1) => { const g = p.g; g.save(); g.translate(300, 600); const k = M_back(t, 1.6); g.scale(k, k); g.translate(-300, -600);
  p.poly([[60, 470], [545, 455], [552, 730], [52, 742]], "#c8945a", 12); p.poly([[80, 490], [525, 478], [530, 712], [74, 722]], "#d4a46a", 0);
  g.fillStyle = "#c8322e"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "900 66px Arial Black, Arial"; g.fillText("SUBSCRIBE", 300, 562);
  g.fillStyle = "#1a1a22"; g.font = "900 46px Arial Black, Arial"; g.fillText("PART 2 SOON", 300, 650);
  const bx = 470, by = 380; p.poly([[bx - 46, by + 40], [bx - 36, by - 20], [bx, by - 52], [bx + 36, by - 20], [bx + 46, by + 40]], "#f2c23a", 10); p.ell(bx, by + 52, 14, 12, "#f2c23a", 8);
  for (const sd of [-1, 1]) p.arc(bx + sd * 64, by - 10, 18, 30, sd > 0 ? -40 : 140, sd > 0 ? 40 : 220, 8); g.restore(); };

// talking variants: same face, open mouth (toggled while the character's voice line plays)
for (const k of Object.keys(FACE)) if (!k.endsWith('_t')) FACE[k + '_t'] = { ...FACE[k], mouth: FACE[k].mouth === 'o' ? 'smile' : 'o' };
Object.assign(PROPS, {
  keys: (p, x, y, u) => { p.ell(x, y, 7 * u, 7 * u, null, 2 * u); p.band([[x + 4 * u, y + 4 * u], [x + 14 * u, y + 22 * u]], '#d8b040', 3.4 * u, 1 * u); p.band([[x - 3 * u, y + 6 * u], [x - 8 * u, y + 24 * u]], '#c8ccd0', 3.4 * u, 1 * u); },
  toast: (p, x, y, u) => { p.poly(rrect(x - 16 * u, y - 18 * u, x + 16 * u, y + 16 * u, 8 * u), '#e8c890', 2 * u); p.poly(rrect(x - 12 * u, y - 13 * u, x + 12 * u, y + 12 * u, 6 * u), '#f6ead0', 0); },
  flea: (p, x, y, u) => { p.stroke([[x, y - 20 * u], [x, y - 8 * u]], 1 * u, '#8a8a92'); p.poly(rrect(x - 18 * u, y - 8 * u, x + 18 * u, y + 14 * u, 2 * u), '#fbf6e0', 1.6 * u); const g = p.g; g.save(); g.fillStyle = '#c8322e'; g.textAlign = 'center'; g.font = `900 ${12 * u}px Arial Black, Arial`; g.fillText('$40', x, y + 9 * u); g.restore(); },
  subsign: (p, x, y, u, o) => { const g = p.g; g.save(); g.translate(x - 300 * 0.32, y - 600 * 0.32); g.scale(0.32, 0.32); subSign(p, o.signT ?? 1); g.restore(); },
});
/** big repair tag for the stolen-mower insert (own card) */
export const tagCard = (p) => { const g = p.g; p.stroke([[300, 330], [300, 420]], 10, '#1a1a22'); p.poly([[170, 420], [440, 420], [440, 700], [170, 700], [120, 560]], '#fbf6e0', 14); p.ell(165, 560, 18, 18, '#c8c4b8', 8);
  g.save(); g.textAlign = 'center'; g.fillStyle = '#1b2a44'; g.font = '900 58px Arial Black, Arial'; g.fillText('FIXED BY', 300, 520); g.fillStyle = '#c8322e'; g.font = '900 92px Comic Sans MS, Arial Black'; g.fillText('SAM', 300, 620); g.fillStyle = '#2f8a4a'; g.font = '900 54px Arial'; g.fillText('\u2713 DAY 31', 300, 680); g.restore(); };
/** a lit bulb idea */
export const ideaCard = (p, t = 1) => { const g = p.g; g.save(); g.translate(300, 500); const k = M_back(Math.min(1, t * 2), 1.6); g.scale(k, k); g.translate(-300, -500); g.globalAlpha = 0.5; p.ell(300, 470, 210, 210, '#fff3b0', 0); g.globalAlpha = 1;
  p.ell(300, 460, 120, 130, '#ffe36a', 12); p.poly(rrect(250, 570, 350, 650, 10), '#b8bec6', 10); for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; p.stroke([[300 + Math.cos(a) * 160, 460 + Math.sin(a) * 170], [300 + Math.cos(a) * 210, 460 + Math.sin(a) * 220]], 14, '#ffd23a'); } g.restore(); };
/** big hand-painted number / word that auto-fits the card width (pops in with t) */
export const fxBig = (p, s = "$43", t = 1, col = "#f2c23a") => { const k = M_back(Math.min(1, t), 1.7), g = p.g; g.save(); g.translate(300, 500); g.scale(k, k); g.translate(-300, -500);
  g.textAlign = "center"; g.textBaseline = "middle"; let fs = 300; g.font = `900 ${fs}px Arial Black, Arial`; while (g.measureText(s).width > 540 && fs > 40) { fs *= 0.92; g.font = `900 ${fs}px Arial Black, Arial`; }
  g.lineJoin = "round"; g.lineWidth = fs * 0.12; g.strokeStyle = INK; g.strokeText(s, 300, 500); g.fillStyle = col; g.fillText(s, 300, 500); g.save(); g.beginPath(); g.rect(0, 500 - fs * 0.45, 600, fs * 0.2); g.clip(); g.fillStyle = "#ffffff70"; g.fillText(s, 300, 500); g.restore(); g.restore(); };
/** cartoon potato (Mia's review) */
export const potatoCard = (p, t = 1) => { const g = p.g; g.save(); g.translate(300, 500); const k = M_back(Math.min(1, t), 1.7); g.scale(k, k); g.translate(-300, -500); p.ell(300, 500, 200, 140, "#c8945a", 14, 0, 360, -12); for (const [x, y] of [[220, 450], [360, 430], [300, 560], [400, 540]]) p.ell(x, y, 12, 8, "#8a6038", 0); p.dot(250, 490, 12); p.dot(330, 480, 12); p.arc(292, 520, 30, 14, 20, 160, 8); g.restore(); };
