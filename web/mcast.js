
// ---------------- "The Marathon Won by a Car" cast (our own caricatures of long-deceased 1904 figures) — appended after vesnacast.js in toon.js ----------------
FACE.hopeful = { eye: ["dot", "dot"], brow: [-4, -4], mouth: "smileWide" };
FACE.sad = { eye: ["dot", "dot"], brow: [5, 5], mouth: "frown" };
FACE.meh = { eye: ["lid", "lid"], brow: [2, -2], mouth: "dash" };
FACE.wow = { eye: ["shock", "shock"], brow: [-6, -6], mouth: "O" };
FACE.cramp = { eye: ["squeeze", "squeeze"], brow: [7, 7], mouth: "teeth" };
FACE.pant = { eye: ["lid", "lid"], brow: [5, 4], mouth: "lick" };
FACE.beam = { eye: ["happy", "happy"], brow: [-5, -5], mouth: "laugh" };
FACE.spin = { eye: ["spiral", "spiral"], brow: [-3, 3], mouth: "wave" };
FACE.spinGrin = { eye: ["spiral", "spiral"], brow: [-4, -4], mouth: "smileWide" };
FACE.gulp = { eye: ["shock", "shock"], brow: [-5, -5], mouth: "o" };
FACE.blow = { eye: ["lid", "lid"], brow: [5, -4], mouth: "o" };
FACE.sheep = { eye: ["dot", "dot"], brow: [6, 6], mouth: "teeth" };
FACE.point = { eye: ["lid", "lid"], brow: [6, -4], mouth: "O" };
FACE.yay = { eye: ["happy", "happy"], brow: [-5, -5], mouth: "O" };

const VEST = "#f6f3ea";
Object.assign(OUTFITS, {
  lorz: { tunic: VEST, sleeve: "#f1c9a2", pants: "#f1c9a2", skin: "#f1c9a2", boots: "#4a3026", shorts: "#2d3f7a", hair: "#2e2018", uniform: "vest", num: "31", stripe: "#c8322e" },
  hicks: { tunic: "#cfe0ee", sleeve: "#f2dcc8", pants: "#f2dcc8", skin: "#f2dcc8", boots: "#3a2a22", shorts: "#4a4f5a", hair: "#7a5a3a", uniform: "vest", num: "20", stripe: "#2d5a9a", thin: true, moustache: "#6a4a2e" },
  runA: { tunic: "#c8463c", sleeve: "#e8b48a", pants: "#e8b48a", skin: "#e8b48a", boots: "#3a2a22", shorts: "#2a2a30", hair: "#1e1714", uniform: "vest", num: "7", stripe: "#f2efe6" },
  runB: { tunic: "#3f8a5a", sleeve: "#c99067", pants: "#c99067", skin: "#c99067", boots: "#3a2a22", shorts: "#f2efe6", hair: "#1a1410", uniform: "vest", num: "12", stripe: "#f2c23c", moustache: "#1a1410" },
  runC: { tunic: "#f2c23c", sleeve: "#f5c9a0", pants: "#f5c9a0", skin: "#f5c9a0", boots: "#3a2a22", shorts: "#2d3f7a", hair: "#b8742e", uniform: "vest", num: "5", stripe: "#c8322e" },
  runD: { tunic: "#6a4a8a", sleeve: "#ecd0b6", pants: "#ecd0b6", skin: "#ecd0b6", boots: "#3a2a22", shorts: "#2a2a30", hair: "#5a3b2a", uniform: "vest", num: "18", stripe: "#f2efe6", moustache: "#5a3b2a" },
  trainerA: { tunic: "#3a2c28", sleeve: "#33261f", pants: "#2c2a30", boots: "#1c1612", skin: "#f0c8a6", uniform: "suit", tie: "#c8322e", hat: "bowler", hatCol: "#26201e", moustache: "#3a2418", hair: "#3a2418" },
  trainerB: { tunic: "#4a3f5a", sleeve: "#41374f", pants: "#2c2a30", boots: "#1c1612", skin: "#e6b48e", uniform: "suit", tie: "#2d6a5a", hat: "bowler", hatCol: "#3a2a22", moustache: "#7a5a3a", hair: "#7a5a3a", stout: true },
  alice: { tunic: "#f4efe6", sleeve: "#efe8dc", dress: "#e9e1f2", pants: "#efe8dc", skin: "#f7d6bc", uniform: "dress1904", hat: "bighat", hatCol: "#f0e6d0", hair: "#5a3b2a", bob: "#5a3b2a", hairUnder: true, lashes: true, blush: "#ff8a8a" },
  official: { tunic: "#2a2a34", sleeve: "#24242c", pants: "#2c2a30", boots: "#1c1612", skin: "#f3d6bb", uniform: "official", tie: "#1c1c22", hat: "boater", hatCol: "#e8cf8a", band: "#2a2a34", moustache: "#8a8a8a", stout: true },
  farmer: { tunic: "#c0473a", sleeve: "#b8423a", pants: "#3f5a8a", boots: "#4a3026", skin: "#efc29c", uniform: "overalls", over: "#4a6aa0", hat: "straw", hatCol: "#e8c46a", beard: "#c9a070" },
  driver: { tunic: "#c8a878", sleeve: "#bfa070", pants: "#5a4a3a", boots: "#2a201c", skin: "#f0c8a6", uniform: "duster", hat: "dcap", hatCol: "#6a5a4a", moustache: "#5a3b2a" },
  fanA: { tunic: "#5a7aa8", sleeve: "#50709c", pants: "#3a3a44", boots: "#2a201c", skin: "#f5c9a0", uniform: "suit", tie: "#c8322e", hat: "boater", hatCol: "#ead49a", band: "#c8322e" },
  fanB: { tunic: "#c25a7a", sleeve: "#b45270", dress: "#c25a7a", pants: "#efe8dc", skin: "#f3cfae", uniform: "dress1904", hat: "bighat", hatCol: "#f6e9c8", hair: "#3a2418", bob: "#3a2418", hairUnder: true, lashes: true },
  fanC: { tunic: "#6a8a4a", sleeve: "#607e42", pants: "#3a3a44", boots: "#2a201c", skin: "#c99067", uniform: "suit", tie: "#f2c23c", hat: "bowler", hatCol: "#2a2420", moustache: "#1e1714" },
  fanD: { tunic: "#d9a441", sleeve: "#cc9a3a", dress: "#5f7aa0", pants: "#efe8dc", skin: "#f7d3b4", uniform: "dress1904", hat: "bighat", hatCol: "#c8d8f0", hair: "#b8742e", bob: "#b8742e", hairUnder: true, lashes: true },
  fanE: { tunic: "#7a4a2a", sleeve: "#6e4226", pants: "#3a3a44", boots: "#2a201c", skin: "#ecd0b6", uniform: "suit", tie: "#2b4a9a", hat: "boater", hatCol: "#e2c07a", band: "#2b4a9a", beard: "#9a948c" },
});

/** extra hats (called from aussieHat) */
const marHat = (p, O, H, cx, hc, light, thick, ow, u, lift = 0) => {
  const col = O.hatCol || "#333", dark = mul(col, [0.66, 0.66, 0.72]), top = hc - H.b;
  if (O.hat === "bowler") {
    const by = hc - 0.5 * H.b - lift, dome = []; for (let i = 0; i <= 30; i++) { const a = Math.PI + Math.PI * i / 30; dome.push([cx + Math.cos(a) * 0.86 * H.a, by + Math.sin(a) * 0.92 * H.b]); }
    p.shadedFill(dome, col, dark, light, H.a, 0.4); p.inkRing(dome, ow * 0.85, thick);
    p.stroke(ellPts(cx - 0.3 * H.a, by - 0.55 * H.b, 0.22 * H.a, 0.2 * H.b, 200, 290, 0, 10), 3.5 * u, "#ffffff40");
    p.band([[cx - 0.86 * H.a, by - 0.06 * H.b], [cx + 0.86 * H.a, by - 0.06 * H.b]], mul(col, [1.5, 1.4, 1.4]), 0.1 * H.b, 1.2 * u);
    p.ell(cx, by + 0.02 * H.b, 1.18 * H.a, 0.14 * H.b, col, ow * 0.7); return;
  }
  if (O.hat === "boater" || O.hat === "straw") {
    const wide = O.hat === "straw", by = hc - 0.55 * H.b - lift, bw = (wide ? 1.55 : 1.22) * H.a, ch = (wide ? 0.7 : 0.42) * H.b, cw = 0.8 * H.a;
    const brim = ellPts(cx, by, bw, (wide ? 0.26 : 0.16) * H.b, 0, 360, 0, 40);
    p.shadedFill(brim, col, dark, light, bw, 0.3); p.clip(brim, () => { for (let k = 1; k < 6; k++) p.stroke(ellPts(cx, by, bw * k / 6, (wide ? 0.26 : 0.16) * H.b * k / 6, 0, 360, 0, 30), 1.2 * u, "#00000022"); }); p.inkRing(brim, ow * 0.8, thick);
    const crown = wide ? [[cx - cw, by], [cx - cw * 0.8, by - ch], [cx - cw * 0.2, by - ch * 1.12], [cx + cw * 0.3, by - ch * 1.05], [cx + cw * 0.82, by - ch * 0.95], [cx + cw, by]] : [[cx - cw, by], [cx - cw, by - ch], [cx + cw, by - ch], [cx + cw, by]];
    p.shadedFill(crown, col, dark, light, cw, 0.35); p.clip(crown, () => { for (let k = 0; k < 8; k++) p.stroke([[cx - cw, by - ch * k / 8], [cx + cw, by - ch * k / 8 - 1 * u]], 1.2 * u, "#00000020"); }); p.inkRing(crown, ow * 0.8, thick);
    if (!wide) { p.ell(cx, by - ch, cw, 0.08 * H.b, mul(col, [1.1, 1.08, 1.05]), ow * 0.55); p.band([[cx - cw, by - 0.14 * H.b], [cx + cw, by - 0.14 * H.b]], O.band || "#2a2a34", 0.16 * H.b, 1 * u); }
    else for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2; p.stroke([[cx + Math.cos(a) * bw, by + Math.sin(a) * 0.26 * H.b], [cx + Math.cos(a) * (bw + 6 * u), by + Math.sin(a) * 0.3 * H.b + 3 * u]], 1.6 * u, mul(col, [0.8, 0.75, 0.6])); }
    return;
  }
  if (O.hat === "bighat") { // wide Edwardian picture hat with flowers + a plume
    const by = hc - 0.62 * H.b - lift, bw = 1.85 * H.a, bh = 0.34 * H.b, g = p.g;
    g.save(); g.translate(cx, by); g.rotate(rad(-8)); g.translate(-cx, -by);
    const brim = ellPts(cx + 0.1 * H.a, by, bw, bh, 0, 360, 0, 48); p.shadedFill(brim, col, dark, light, bw, 0.3); p.inkRing(brim, ow * 0.8, thick);
    const cw = 0.78 * H.a, crown = ellPts(cx, by - 0.12 * H.b, cw, 0.5 * H.b, 180, 360, 0, 24); crown.push([cx + cw, by], [cx - cw, by]);
    p.shadedFill(crown, col, dark, light, cw, 0.35); p.inkRing(crown, ow * 0.8, thick);
    p.band([[cx - cw, by - 0.1 * H.b], [cx + cw, by - 0.1 * H.b]], O.band || "#8a6ab8", 0.18 * H.b, 1.2 * u);
    const fl = [["#ff8aa0", -0.55, -0.3], ["#ffffff", -0.2, -0.42], ["#f2c23c", 0.15, -0.32], ["#ff6a7a", 0.5, -0.28], ["#c8a0e8", 0.8, -0.18]];
    for (const [c, dx, dy] of fl) { const x = cx + dx * H.a, y = by + dy * H.b; for (let k = 0; k < 5; k++) { const a = k / 5 * 6.283; p.ell(x + Math.cos(a) * 6 * u, y + Math.sin(a) * 6 * u, 6 * u, 6 * u, c, 1.3 * u); } p.dot(x, y, 3.6 * u, "#f2c23c"); }
    const pl = []; for (let i = 0; i <= 14; i++) { const t = i / 14; pl.push([cx + (0.9 + 0.8 * t) * H.a, by - (0.4 + 0.9 * Math.sin(t * 2.4)) * H.b]); } p.stroke(pl, 9 * u, INK); p.stroke(pl, 6 * u, "#fbf8f0");
    g.restore(); return;
  }
  if (O.hat === "dcap") { // driver's flat cap with goggles pushed up
    const by = hc - 0.5 * H.b - lift, cap = ellPts(cx, by, 0.95 * H.a, 0.62 * H.b, 180, 360, 0, 30); cap.push([cx + 0.95 * H.a, by + 0.04 * H.b], [cx - 0.95 * H.a, by + 0.04 * H.b]);
    p.shadedFill(cap, col, dark, light, H.a, 0.4); p.inkRing(cap, ow * 0.85, thick);
    p.ell(cx + 0.18 * H.a, by + 0.04 * H.b, 0.88 * H.a, 0.12 * H.b, dark, ow * 0.7);
    p.band([[cx - 0.95 * H.a, by - 0.1 * H.b], [cx + 0.95 * H.a, by - 0.1 * H.b]], "#3a2a22", 0.12 * H.b, 0.8 * u);
    for (const s of [-1, 1]) { p.ell(cx + s * 0.34 * H.a, by - 0.12 * H.b, 0.27 * H.a, 0.2 * H.b, "#b98a3a", 2.4 * u); p.ell(cx + s * 0.34 * H.a, by - 0.12 * H.b, 0.18 * H.a, 0.13 * H.b, "#bfe4f2", 1.4 * u); p.dot(cx + s * 0.34 * H.a - 4 * u, by - 0.16 * H.b, 2.4 * u, "#ffffff"); }
    return;
  }
};

const bibNum = (p, x, y, w, h, n, u) => {
  p.poly(rrect(x - w / 2, y - h / 2, x + w / 2, y + h / 2, 2 * u), "#fbf9f2", 1.6 * u);
  const g = p.g; g.save(); g.textAlign = "center"; g.textBaseline = "middle"; g.font = `900 ${h * 0.78}px Arial Black, Arial`; g.fillStyle = "#1b1b24"; g.fillText(n, x, y + h * 0.05); g.restore();
  for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) p.dot(x + dx * (w / 2 - 3 * u), y + dy * (h / 2 - 3 * u), 1.4 * u, "#a8a8b0");
};
/** uniform painters (called from aussieTorso, inside the torso clip) */
const marTorso = (p, O, tp, tcx, T, chin, torsoBot, HH, u, light) => {
  if (O.uniform === "vest") {
    // scoop neck + deep armholes (skin), diagonal sash, number bib
    p.poly(ellPts(tcx, chin - 0.06 * HH, 0.42 * T.a, 0.2 * HH, 0, 180, 0, 20), O.skin, 1.6 * u);
    for (const sd of [-1, 1]) p.poly(ellPts(tcx + sd * 1.02 * T.a, chin + 0.16 * HH, 0.3 * T.a, 0.3 * HH, 0, 360, 0, 20), O.skin, 1.6 * u);
    if (O.stripe) p.band([[tcx - 1.1 * T.a, chin + 0.05 * HH], [tcx + 1.1 * T.a, torsoBot - 0.05 * HH]], O.stripe, 0.12 * HH, 0);
    bibNum(p, tcx + 0.04 * T.a, chin + 0.46 * HH, 0.78 * T.a, 0.28 * HH, O.num || "1", u);
    p.stroke([[tcx - 0.9 * T.a, chin + 0.15 * HH], [tcx - 0.62 * T.a, torsoBot - 0.2 * HH]], 3 * u, "#00000018");
  } else if (O.uniform === "suit" || O.uniform === "official") {
    p.poly([[tcx - 0.42 * T.a, chin - 0.08 * HH], [tcx + 0.42 * T.a, chin - 0.08 * HH], [tcx, chin + 0.5 * HH]], "#f6f4ee", 1.4 * u); // shirt
    p.poly([[tcx - 0.1 * T.a, chin + 0.0 * HH], [tcx + 0.1 * T.a, chin + 0.0 * HH], [tcx + 0.06 * T.a, chin + 0.38 * HH], [tcx, chin + 0.44 * HH], [tcx - 0.06 * T.a, chin + 0.38 * HH]], O.tie || "#c8322e", 1 * u);
    for (const sd of [-1, 1]) p.poly([[tcx + sd * 0.42 * T.a, chin - 0.08 * HH], [tcx + sd * 0.22 * T.a, chin + 0.2 * HH], [tcx + sd * 0.38 * T.a, chin + 0.22 * HH], [tcx + sd * 0.04 * T.a, chin + 0.56 * HH], [tcx + sd * 0.7 * T.a, chin + 0.1 * HH]], mul(O.tunic, [0.8, 0.8, 0.85]), 1.4 * u);
    for (let k = 0; k < 2; k++) p.dot(tcx + 0.1 * T.a, chin + (0.66 + k * 0.16) * HH, 2.6 * u, "#c9a64a");
    p.stroke(ellPts(tcx - 0.35 * T.a, chin + 0.68 * HH, 0.3 * T.a, 0.08 * HH, 10, 170, 0, 12), 1.6 * u, "#e3b23c"); // watch chain
    if (O.uniform === "official") { const rx = tcx - 0.55 * T.a, ry = chin + 0.3 * HH; p.poly([[rx - 5 * u, ry], [rx - 10 * u, ry + 26 * u], [rx - 2 * u, ry + 20 * u], [rx + 4 * u, ry + 28 * u], [rx + 6 * u, ry]], "#2d5a9a", 1.2 * u);
      for (let k = 0; k < 10; k++) { const a = k / 10 * 6.283; p.ell(rx + Math.cos(a) * 7 * u, ry + Math.sin(a) * 7 * u, 4 * u, 4 * u, k % 2 ? "#c8322e" : "#f6f4ee", 0.8 * u); } p.ell(rx, ry, 5 * u, 5 * u, "#f2c23c", 1 * u); }
  } else if (O.uniform === "dress1904") {
    fabric(p, tcx, T, chin, torsoBot, HH, u);
    p.poly(rrect(tcx - 0.2 * T.a, chin - 0.22 * HH, tcx + 0.2 * T.a, chin + 0.06 * HH, 3 * u), "#fbf8f0", 1.4 * u); // high lace collar
    for (let k = 0; k < 4; k++) p.stroke([[tcx - 0.18 * T.a, chin - 0.18 * HH + k * 0.06 * HH], [tcx + 0.18 * T.a, chin - 0.18 * HH + k * 0.06 * HH]], 1 * u, "#d8cfc0");
    for (let i = 0; i < 9; i++) p.dot(tcx + Math.sin(i * 1.7) * 0.5 * T.a, chin + (0.12 + (i * 0.27) % 1 * 0.5) * HH, 2.4 * u, "#ffffff90");
    p.ell(tcx, chin + 0.12 * HH, 5 * u, 5 * u, "#e3b23c", 1.2 * u);
    p.band([[tcx - 1.4 * T.a, torsoBot - 0.24 * HH], [tcx + 1.4 * T.a, torsoBot - 0.24 * HH]], O.band || "#8a6ab8", 0.07 * HH, 1 * u);
  } else if (O.uniform === "overalls") {
    for (let i = -3; i <= 3; i++) p.stroke([[tcx + i * 0.32 * T.a, chin - 0.2 * HH], [tcx + i * 0.32 * T.a, torsoBot]], 2 * u, "#00000026");
    for (let k = 0; k < 6; k++) p.stroke([[tcx - 1.2 * T.a, chin + k * 0.14 * HH], [tcx + 1.2 * T.a, chin + k * 0.14 * HH]], 2 * u, "#ffffff24");
    p.poly(rrect(tcx - 0.62 * T.a, chin + 0.22 * HH, tcx + 0.62 * T.a, torsoBot + 0.1 * HH, 6 * u), O.over, 1.8 * u);
    for (const sd of [-1, 1]) { p.band([[tcx + sd * 0.5 * T.a, chin + 0.25 * HH], [tcx + sd * 0.82 * T.a, chin - 0.1 * HH]], O.over, 0.1 * HH, 1.2 * u); p.dot(tcx + sd * 0.48 * T.a, chin + 0.27 * HH, 3 * u, "#e3b23c"); }
    p.poly(rrect(tcx - 0.28 * T.a, chin + 0.36 * HH, tcx + 0.28 * T.a, chin + 0.56 * HH, 3 * u), mul(O.over, [0.85, 0.85, 0.9]), 1.2 * u);
  } else if (O.uniform === "duster") {
    fabric(p, tcx, T, chin, torsoBot, HH, u);
    p.poly([[tcx - 0.66 * T.a, chin - 0.08 * HH], [tcx + 0.66 * T.a, chin - 0.08 * HH], [tcx + 0.3 * T.a, chin + 0.3 * HH], [tcx, chin + 0.18 * HH], [tcx - 0.3 * T.a, chin + 0.3 * HH]], mul(O.tunic, [0.82, 0.8, 0.78]), 1.4 * u);
    p.stroke([[tcx, chin + 0.18 * HH], [tcx, torsoBot]], 2 * u, "#5a4a3a"); for (let k = 0; k < 3; k++) p.dot(tcx + 8 * u, chin + (0.34 + k * 0.17) * HH, 3 * u, "#3a2a22");
  }
};

/** late overlays: worn wreath / medal, goggles, sweat, hand props (called from castLate) */
const marLate = (p, prop, arms, u, opts, cx, hc, H) => {
  const [hx, hy] = arms[1].pts[2], [lx, ly] = arms[0].pts[2], HH = 2 * H.b;
  if (opts.medal) { const my = hc + H.b + 0.62 * HH, k = opts.medal; p.stroke([[cx - 0.36 * H.a, hc + H.b + 0.02 * HH], [cx, my - 12 * u]], 4.5 * u, "#2d5a9a"); p.stroke([[cx + 0.36 * H.a, hc + H.b + 0.02 * HH], [cx, my - 12 * u]], 4.5 * u, "#c8322e");
    p.ell(cx, my, 15 * u * k, 15 * u * k, "#f2c23c", 2.6 * u); p.ell(cx, my, 9 * u * k, 9 * u * k, "#ffe27a", 1.2 * u); p.dot(cx - 5 * u, my - 6 * u, 2.6 * u, "#ffffff"); }
  if (opts.wreath) wreathOn(p, cx, hc, H, u, opts.wreath);
  if (opts.sweat) { const t = opts.sweat; for (let i = 0; i < 3; i++) { const k = (t + i / 3) % 1, sd = i % 2 ? 1 : -1, x = cx + sd * (H.a * (0.9 + 0.5 * k)), y = hc - 0.6 * H.b + k * 0.9 * H.b - Math.sin(k * Math.PI) * 0.4 * H.b;
      p.poly([[x, y - 9 * u], [x + 5 * u, y + 2 * u], [x, y + 7 * u], [x - 5 * u, y + 2 * u]], "#9fd4ff", 1.6 * u); } }
  if (prop === "megaphone") { const g = p.g; g.save(); g.translate(hx, hy); g.rotate(rad(-20)); p.poly([[-4 * u, -8 * u], [56 * u, -26 * u], [56 * u, 26 * u], [-4 * u, 8 * u]], "#d8322e", 2.4 * u); p.ell(56 * u, 0, 6 * u, 26 * u, "#f2efe6", 2.4 * u); p.band([[22 * u, -15 * u], [22 * u, 15 * u]], "#f2efe6", 6 * u, 1 * u); g.restore(); p.dot(hx, hy, 6 * u); }
  if (prop === "pistol") { p.poly([[hx - 4 * u, hy - 6 * u], [hx + 4 * u, hy - 6 * u], [hx + 6 * u, hy - 40 * u], [hx - 2 * u, hy - 40 * u]], "#3a3a44", 2 * u); p.poly([[hx - 6 * u, hy - 4 * u], [hx + 6 * u, hy - 4 * u], [hx + 4 * u, hy + 10 * u], [hx - 4 * u, hy + 10 * u]], "#7a4a2a", 2 * u); p.dot(hx, hy, 6 * u); }
  if (prop === "bottle" || prop === "poison") { const sm = prop === "poison", g = p.g, s = (sm ? 0.72 : 1) * (opts.propS || 1); g.save(); g.translate(hx, hy); g.rotate(rad(opts.tip ?? 0)); g.scale(s, s);
    p.poly(rrect(-11 * u, -40 * u, 11 * u, 8 * u, 6 * u), sm ? "#3f8a6a" : "#7a3a1a", 2.4 * u); p.poly(rrect(-4 * u, -58 * u, 4 * u, -38 * u, 2 * u), sm ? "#3f8a6a" : "#7a3a1a", 2 * u); p.poly(rrect(-5 * u, -64 * u, 5 * u, -56 * u, 2 * u), "#c8a070", 1.6 * u);
    p.poly(rrect(-9 * u, -30 * u, 9 * u, -6 * u, 2 * u), "#f4ecd6", 1.4 * u); if (sm) skull(p, 0, -18 * u, 7 * u, u); else { p.stroke([[-6 * u, -22 * u], [6 * u, -22 * u]], 1.6 * u, "#7a3a1a"); p.stroke([[-6 * u, -15 * u], [6 * u, -15 * u]], 1.6 * u, "#7a3a1a"); }
    p.stroke([[-6 * u, -36 * u], [-6 * u, 0]], 2.2 * u, "#ffffff55"); g.restore(); p.dot(hx, hy, 6 * u); }
  if (prop === "egg") { const g = p.g, ps = opts.propS || 1; g.save(); g.translate(hx, hy); g.scale(ps, ps); g.translate(-hx, -hy); const c = opts.crack || 0, x = hx, y = hy - 14 * u; if (c < 0.5) { p.ell(x, y, 10 * u, 13 * u, "#fbf6ea", 2.2 * u); p.dot(x - 3 * u, y - 5 * u, 2.4 * u, "#ffffff"); }
    else { p.poly([[x - 11 * u, y - 4 * u], [x - 6 * u, y - 10 * u], [x - 2 * u, y - 4 * u], [x + 3 * u, y - 10 * u], [x + 8 * u, y - 4 * u], [x + 11 * u, y - 2 * u], [x + 9 * u, y + 8 * u], [x - 9 * u, y + 8 * u]], "#fbf6ea", 2 * u); const dy = (c - 0.5) * 2 * 30 * u; p.ell(x, y + 10 * u + dy, 6 * u, 7 * u, "#f2b23a", 1.6 * u); }
    g.restore(); p.dot(hx, hy, 6 * u); }
  if (prop === "eggL") { const g = p.g, ps = opts.propS || 1; g.save(); g.translate(lx, ly); g.scale(ps, ps); g.translate(-lx, -ly); const c = opts.crack || 0, x = lx, y = ly - 14 * u; if (c < 0.5) { p.ell(x, y, 10 * u, 13 * u, "#fbf6ea", 2.2 * u); p.dot(x - 3 * u, y - 5 * u, 2.4 * u, "#ffffff"); }
    else { p.poly([[x - 11 * u, y - 4 * u], [x - 6 * u, y - 10 * u], [x - 2 * u, y - 4 * u], [x + 3 * u, y - 10 * u], [x + 8 * u, y - 4 * u], [x + 11 * u, y - 2 * u], [x + 9 * u, y + 8 * u], [x - 9 * u, y + 8 * u]], "#fbf6ea", 2 * u); const dy = (c - 0.5) * 2 * 30 * u; p.ell(x, y + 10 * u + dy, 6 * u, 7 * u, "#f2b23a", 1.6 * u); }
    g.restore(); p.dot(lx, ly, 6 * u); }
  if (prop === "medalHoldL") { p.stroke([[lx - 8 * u, ly], [lx - 8 * u, ly + 30 * u]], 4 * u, "#c8322e"); p.stroke([[lx + 8 * u, ly], [lx + 8 * u, ly + 30 * u]], 4 * u, "#2d5a9a"); p.ell(lx, ly + 44 * u, 15 * u, 15 * u, "#f2c23c", 2.6 * u); p.ell(lx, ly + 44 * u, 9 * u, 9 * u, "#ffe27a", 1.2 * u); p.dot(lx, ly, 6 * u); }
  if (prop === "wreathHold") { const x = (hx + lx) / 2, y = (hy + ly) / 2 - 4 * u; wreathRing(p, x, y, 0.95 * H.a, 0.42 * H.b, u, 0); p.dot(hx, hy, 6 * u); p.dot(lx, ly, 6 * u); }
  if (prop === "medalHold") { p.stroke([[hx - 8 * u, hy], [hx - 8 * u, hy + 30 * u]], 4 * u, "#c8322e"); p.stroke([[hx + 8 * u, hy], [hx + 8 * u, hy + 30 * u]], 4 * u, "#2d5a9a"); p.ell(hx, hy + 44 * u, 15 * u, 15 * u, "#f2c23c", 2.6 * u); p.ell(hx, hy + 44 * u, 9 * u, 9 * u, "#ffe27a", 1.2 * u); p.dot(hx, hy, 6 * u); }
  if (prop === "watch") { p.ell(hx, hy - 12 * u, 12 * u, 12 * u, "#e3b23c", 2.4 * u); p.ell(hx, hy - 12 * u, 8.5 * u, 8.5 * u, "#fbf8f0", 1 * u); p.stroke([[hx, hy - 12 * u], [hx + 3 * u, hy - 18 * u]], 1.6 * u); p.dot(hx, hy, 6 * u); }
  if (opts.whistle) { const mx = cx + 8 * u * (opts.facing || 0), my = hc + 20 * u; p.poly(rrect(mx - 2 * u, my - 4 * u, mx + 22 * u, my + 5 * u, 3 * u), "#c9ccd0", 1.8 * u); p.ell(mx + 18 * u, my + 4 * u, 6 * u, 6 * u, "#c9ccd0", 1.8 * u); }
};
const skull = (p, x, y, r, u) => { p.ell(x, y - r * 0.2, r, r * 0.9, "#fbf8f0", 1.2 * u); p.poly(rrect(x - r * 0.55, y + r * 0.3, x + r * 0.55, y + r * 0.95, 1 * u), "#fbf8f0", 1.2 * u);
  p.dot(x - r * 0.38, y - r * 0.2, r * 0.26); p.dot(x + r * 0.38, y - r * 0.2, r * 0.26); for (const s of [-1, 1]) { p.stroke([[x - 1.6 * r, y + 1.3 * r * s], [x + 1.6 * r, y - 1.3 * r * s]], 1.2 * u, "#fbf8f0"); } };
const wreathRing = (p, x, y, rx, ry, u, rot = 0) => {
  const pts = ellPts(x, y, rx, ry, 0, 360, rot, 36); p.stroke(pts.concat([pts[0]]), 9 * u, INK); p.stroke(pts.concat([pts[0]]), 5 * u, "#6a8a3a");
  for (let i = 0; i < 22; i++) { const a = i / 22 * 360, ar = rad(a), lx_ = x + Math.cos(ar) * rx, ly_ = y + Math.sin(ar) * ry; const ang = a + 70;
    p.ell(lx_, ly_, 9 * u, 4.2 * u, i % 2 ? "#7aa84a" : "#5a8a36", 1.6 * u, 0, 360, ang); }
  for (let i = 0; i < 4; i++) p.dot(x + Math.cos(rad(200 + i * 40)) * rx, y + Math.sin(rad(200 + i * 40)) * ry, 2.6 * u, "#e3b23c");
};
/** laurel wreath worn on the head; w = 1 (on) or {slip} */
const wreathOn = (p, cx, hc, H, u, w) => { const slip = typeof w === "object" ? w.slip || 0 : 0; wreathRing(p, cx + 0.15 * slip * H.a, hc - (0.72 - 0.55 * slip) * H.b, 1.0 * H.a, 0.3 * H.b, u, -14 * slip); };

// ---------------- effects ----------------
const MB = (t, s = 1.7) => { t = Math.max(0, Math.min(1, t)) - 1; return t * t * ((s + 1) * t + s) + 1; };
/** horn honk burst lines */
export const fxHonk = (p, t) => { const g = p.g; g.save(); g.globalAlpha = Math.sin(Math.PI * Math.min(1, t)); const r0 = 80 + 120 * t;
  for (let i = -2; i <= 2; i++) { const a = i * 0.32; p.stroke([[300 + Math.cos(a) * r0, 500 + Math.sin(a) * r0], [300 + Math.cos(a) * (r0 + 120), 500 + Math.sin(a) * (r0 + 120)]], 22, INK); p.stroke([[300 + Math.cos(a) * r0, 500 + Math.sin(a) * r0], [300 + Math.cos(a) * (r0 + 120), 500 + Math.sin(a) * (r0 + 120)]], 11, "#fff3b0"); } g.restore(); };
/** sweat drops flying off (t loops) */
export const fxDrops = (p, t, n = 5) => { for (let i = 0; i < n; i++) { const k = (t + i / n) % 1, sd = i % 2 ? 1 : -1, x = 300 + sd * (60 + 260 * k), y = 420 - 220 * Math.sin(k * Math.PI) + 200 * k; const g = p.g; g.save(); g.globalAlpha = 1 - k * 0.6;
  p.poly([[x, y - 46], [x + 26, y + 8], [x, y + 36], [x - 26, y + 8]], "#9fd4ff", 9); p.ell(x - 7, y + 4, 6, 9, "#ffffffcc", 0); g.restore(); } };
/** whistle blast lines + rings */
export const fxTweet = (p, t) => { const g = p.g; g.save(); g.globalAlpha = Math.min(1, (1 - t) * 2.2); for (let i = 0; i < 3; i++) { const r = 60 + 110 * i + 140 * t; p.arc(240, 520, r, r * 0.9, -50, 50, 18); } g.restore(); };
/** speech bubble with a little drawing of a car carrying a waving runner */
export const fxCarBubble = (p, t = 1) => { const k = MB(t, 1.6), g = p.g; g.save(); g.translate(300, 620); g.scale(k, k); g.translate(-300, -620);
  p.poly(rrect(40, 330, 560, 640, 70), "#ffffff", 12); p.poly([[180, 630], [120, 760], [270, 632]], "#ffffff", 12); p.poly(rrect(46, 336, 554, 634, 66), "#ffffff", 0);
  // car
  p.poly([[110, 540], [140, 470], [330, 470], [360, 430], [450, 430], [490, 540]], "#c8322e", 9); p.poly([[352, 470], [374, 442], [436, 442], [452, 470]], "#bfe4f2", 6);
  for (const x of [170, 430]) { p.ell(x, 556, 44, 44, "#2a2a30", 9); p.ell(x, 556, 18, 18, "#e3b23c", 5); }
  // waving runner
  p.ell(250, 410, 30, 32, "#f1c9a2", 8); p.poly([[222, 440], [278, 440], [284, 476], [216, 476]], "#f6f3ea", 8); p.stroke([[276, 448], [312, 404], [330, 372]], 12); p.stroke([[276, 448], [312, 404], [330, 372]], 6, "#f1c9a2");
  p.dot(240, 404, 5); p.dot(262, 404, 5); p.arc(251, 418, 12, 8, 20, 160, 5);
  for (let i = 0; i < 3; i++) p.stroke([[100 - i * 18, 480 + i * 22], [50 - i * 18, 480 + i * 22]], 9, "#8a8a96");
  g.restore(); };
/** flying straw boater (thrown hats) */
export const fxBoater = (p, a = 0, col = "#e8cf8a", band = "#c8322e") => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(a); g.translate(-300, -500);
  p.ell(300, 540, 230, 70, col, 12); p.poly([[180, 540], [190, 430], [410, 430], [420, 540]], col, 12); p.ell(300, 430, 110, 30, mul(col, [1.1, 1.08, 1.04]), 9); p.band([[186, 505], [414, 505]], band, 34, 6); g.restore(); };
/** smiling sun for the hallucination */
export const fxSun = (p, t = 0) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(t * 0.8); g.translate(-300, -500);
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, r0 = 200, r1 = 270 + 25 * Math.sin(t * 6 + i); p.poly([[300 + Math.cos(a - 0.12) * r0, 500 + Math.sin(a - 0.12) * r0], [300 + Math.cos(a) * r1, 500 + Math.sin(a) * r1], [300 + Math.cos(a + 0.12) * r0, 500 + Math.sin(a + 0.12) * r0]], i % 2 ? "#ffb03a" : "#ffd84a", 9); } g.restore();
  p.ell(300, 500, 190, 190, "#ffe066", 12); p.ell(240, 480, 16, 28, INK, 0); p.ell(360, 480, 16, 28, INK, 0); p.arc(300, 540, 70, 46, 20, 160, 12); p.ell(200, 560, 26, 14, "#ff9a7a", 0); p.ell(400, 560, 26, 14, "#ff9a7a", 0); };
/** orbiting stars + little birds over a dizzy head (t loops) */
export const fxDizzy = (p, t) => { for (let i = 0; i < 5; i++) { const a = t * Math.PI * 2 + i * Math.PI * 2 / 5, x = 300 + 230 * Math.cos(a), y = 500 + 70 * Math.sin(a), s = 0.8 + 0.25 * Math.sin(a), pts = [];
  if (i % 2) { p.stroke([[x - 30 * s, y], [x - 10 * s, y - 16 * s], [x, y - 4 * s], [x + 10 * s, y - 16 * s], [x + 30 * s, y]], 9 * s); continue; }
  for (let k = 0; k < 10; k++) { const r = k % 2 ? 18 * s : 44 * s, b = rad(k * 36 - 90 + t * 200); pts.push([x + r * Math.cos(b), y + r * Math.sin(b)]); } p.poly(pts, "#ffd84a", 8); } };
/** starter-pistol bang: flash burst + smoke */
export const fxBang = (p, t) => { const g = p.g; if (t < 0.35) { const k = t / 0.35; g.save(); g.globalAlpha = 1 - k; const st = []; for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, r = (i % 2 ? 80 : 230) * (0.6 + 0.6 * k); st.push([300 + Math.cos(a) * r, 500 + Math.sin(a) * r]); } p.poly(st, "#fff3b0", 10); g.restore(); }
  g.save(); g.globalAlpha = Math.max(0, 0.95 - t * 0.9); for (let i = 0; i < 6; i++) { const a = i * 1.05 + t, r = 60 + t * 160; p.ell(300 + Math.cos(a) * r * 0.7, 500 - t * 120 + Math.sin(a) * r * 0.4, 90 + t * 70, 75 + t * 60, "#eeeae4", 0); } g.restore(); };
/** a camera flash pop (press photographers) */
export const fxFlashPop = (p, t) => { const g = p.g; g.save(); g.globalAlpha = Math.max(0, 1 - t); const gr = g.createRadialGradient(300, 500, 0, 300, 500, 280); gr.addColorStop(0, "rgba(255,255,240,1)"); gr.addColorStop(1, "rgba(255,255,240,0)"); g.fillStyle = gr; g.fillRect(0, 200, 600, 600); g.restore(); fxSparkle(p, t); };
/** clank burst for the breakdown */
export const fxClank = (p, t) => { const g = p.g, k = MB(Math.min(1, t * 2), 2); g.save(); g.globalAlpha = Math.min(1, (1 - t) * 2); g.translate(300, 500); g.scale(k, k); g.translate(-300, -500);
  const st = []; for (let i = 0; i < 14; i++) { const a = i * Math.PI / 7 + 0.2, r = i % 2 ? 90 : 220; st.push([300 + Math.cos(a) * r, 500 + Math.sin(a) * r]); } p.poly(st, "#fff3b0", 12); p.poly(st.map(([x, y]) => [300 + (x - 300) * 0.55, 500 + (y - 500) * 0.55]), "#ff8a3a", 0); g.restore(); };
/** little spinning hubcap */
export const fxHubcap = (p, a = 0) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(a); g.translate(-300, -500); p.ell(300, 500, 150, 150, "#e3b23c", 14); p.ell(300, 500, 100, 100, "#f2d27a", 8); p.ell(300, 500, 34, 34, "#a97c1e", 8); p.stroke([[240, 430], [280, 410]], 14, "#ffffffaa"); g.restore(); };
/** music notes for the jogging whistle */
export const fxTune = (p, t) => { const g = p.g; g.save(); for (let i = 0; i < 3; i++) { const tt = (t + i / 3) % 1; g.globalAlpha = Math.sin(Math.PI * tt); const x = 220 + i * 70 + 50 * Math.sin(tt * 6 + i), y = 760 - tt * 520; g.save(); g.translate(x, y); g.scale(0.45, 0.45); g.translate(-300, -500); fxNote(p, i % 2 ? "note2" : "note", "#1f2a44"); g.restore(); } g.restore(); };
/** heat shimmer wavy lines */
export const fxHeat = (p, t) => { const g = p.g; g.save(); g.globalAlpha = 0.85; for (let k = 0; k < 3; k++) { const pts = []; for (let i = 0; i <= 20; i++) pts.push([180 + k * 120 + 22 * Math.sin(i * 0.8 + t * 8 + k), 820 - i * 30]); p.stroke(pts, 14, "#ffffff"); p.stroke(pts, 7, "#ff9a5a"); } g.restore(); };
/** loose laurel wreath (handed over / snatched) */
export const fxWreath = (p, rot = 0) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(rot); g.translate(-300, -500); wreathRing(p, 300, 500, 200, 80, 5, 0); g.restore(); };
/** soft dust cloud: one ink outline around the union of puffs (k 0..1 growth) */
export const fxCloud2 = (p, k, col = "#e6d2a8", seed = 1) => { const g = p.g, n = 7, P_ = [];
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + seed, r = 70 + 120 * k; P_.push([300 + Math.cos(a) * r * 1.15, 560 + Math.sin(a) * r * 0.55 - 30 * k, 95 + 55 * k + 18 * Math.sin(i * 2.3 + seed)]); }
  P_.push([300, 540 - 20 * k, 140 + 90 * k]);
  for (const [x, y, r] of P_) p.ell(x, y, r, r * 0.82, INK, 0); g.save(); g.globalCompositeOperation = "source-atop"; g.restore();
  for (const [x, y, r] of P_) p.ell(x, y, r - 11, r * 0.82 - 11, col, 0);
  for (const [x, y, r] of P_) p.ell(x - r * 0.25, y - r * 0.3, r * 0.45, r * 0.3, "#ffffff44", 0);
  for (const [x, y, r] of P_) p.ell(x + r * 0.2, y + r * 0.35, r * 0.6, r * 0.25, "#00000018", 0); };
