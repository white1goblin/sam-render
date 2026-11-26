
// =====================================================================================
// RESEARCH OFFICE, 2003 (LAB): 6 x 5 x 2.8 m at x 97..103, z -2.5..2.5. Desk in the middle (top .75), two fictional researchers behind it.
// Three versions of one catalog (A / B / C, same dress on every cover), envelopes, an OUTGOING mail tray, beige CRT, wall calendar "2003".
// Plain-text name tents "MIT" and "CHICAGO" only (no logos, no crests).
// =====================================================================================
const LS = {};
const catCover = (L) => cv(256, 340, (q, w, h) => { q.fillStyle = '#fbf8f0'; q.fillRect(0, 0, w, h); q.fillStyle = '#f2d8dc'; q.fillRect(14, 60, w - 28, h - 112);
  q.font = `900 34px ${FNT}`; q.fillStyle = '#1e1820'; q.textAlign = 'left'; q.textBaseline = 'middle'; q.fillText('CATALOG', 16, 32); q.font = `800 16px ${FNT2}`; q.fillStyle = '#8a6a6a'; q.fillText('SPRING COLLECTION', 18, h - 34);
  // the same teal dress on every version
  const cx = w / 2, cy = 120; q.fillStyle = '#23a39a'; q.strokeStyle = '#1e1820'; q.lineWidth = 4; q.beginPath(); q.moveTo(cx - 22, cy); q.lineTo(cx + 22, cy); q.lineTo(cx + 30, cy + 36); q.lineTo(cx + 22, cy + 70); q.lineTo(cx + 66, cy + 170); q.lineTo(cx - 66, cy + 170); q.lineTo(cx - 22, cy + 70); q.lineTo(cx - 30, cy + 36); q.closePath(); q.fill(); q.stroke();
  q.fillStyle = '#f4ecd8'; q.fillRect(cx - 24, cy + 64, 48, 10); q.fillStyle = '#f4efe8'; q.beginPath(); q.ellipse(cx, cy - 26, 15, 20, 0, 0, 6.28); q.fill(); q.stroke();
  q.fillStyle = '#d8342c'; q.beginPath(); q.arc(w - 40, h - 40, 26, 0, 6.28); q.fill(); q.font = `900 32px ${FNT}`; q.fillStyle = '#ffffff'; q.textAlign = 'center'; q.fillText(L, w - 40, h - 38); });
const envT = cv(256, 180, (q, w, h) => { q.fillStyle = '#ead8b0'; q.fillRect(0, 0, w, h); q.strokeStyle = '#b8a070'; q.lineWidth = 4; q.beginPath(); q.moveTo(0, 0); q.lineTo(w / 2, h * 0.55); q.lineTo(w, 0); q.stroke(); noise(q, w, h, 0.08, 1500);
  q.fillStyle = '#5a5060'; for (let k = 0; k < 3; k++) q.fillRect(w * 0.45, h * (0.66 + k * 0.09), w * (0.4 - k * 0.06), 5); q.fillStyle = '#c8322e'; q.fillRect(w - 46, 12, 32, 36); });
const LM = { wall: texM(plasterT('#e8e2cc'), 3, 2, { roughness: 0.95 }), floor: texM(cv(512, 512, (q, w, h) => { for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { q.fillStyle = (r + c) % 2 ? '#b8b4a4' : '#a8a494'; q.fillRect(c * 64, r * 64, 64, 64); } noise(q, w, h, 0.12, 9000); }), 5, 4, { roughness: 0.6, clearcoat: 0.2 }),
  desk: texM(P.planks(9), 1, 1, { roughness: 0.55, clearcoat: 0.2 }), beige: toon({ color: '#d8d0b8', roughness: 0.5 }), grey: toon({ color: '#8a8e96', roughness: 0.5 }), env: texM(envT, 1, 1, { roughness: 0.9 }),
  cat: ['A', 'B', 'C'].map((L) => texM(catCover(L), 1, 1, { roughness: 0.6 })), page: toon({ color: '#fbf8f0', roughness: 0.8 }), cork: texM(cv(256, 256, (q, w, h) => { q.fillStyle = '#c89a60'; q.fillRect(0, 0, w, h); noise(q, w, h, 0.4, 9000, '#8a6030', '#e8c080'); }), 1, 1, { roughness: 1 }) };
{ const O = LAB, g = grp(world, O[0], 0, O[2]); LS.g = g; const RW = 6, RD = 5, RH = 2.8;
  add(new THREE.PlaneGeometry(RW, RD).rotateX(-Math.PI / 2), LM.floor, 0, 0, 0, g, nocast); add(new THREE.PlaneGeometry(RW, RD).rotateX(Math.PI / 2), toon({ color: '#f2eee2' }), 0, RH, 0, g, nocast);
  for (const [x, z, w, ry] of [[0, -2.5, RW, 0], [-3, 0, RD, Math.PI / 2], [3, 0, RD, -Math.PI / 2], [0, 2.5, RW, Math.PI]]) { const wg = grp(g, x, 0, z, ry); add(new THREE.PlaneGeometry(w, RH), LM.wall, 0, RH / 2, 0, wg, nocast); add(tbox(w, 0.1, 0.02, 0.5), toon({ color: '#6a5a48' }), 0, 0.05, 0.012, wg, nocast); }
  for (const [x, z] of [[-1.2, -0.6], [1.2, -0.6], [-1.2, 1.4], [1.2, 1.4]]) { add(box(1.2, 0.03, 0.6), toon({ color: '#d8dcd8' }), x, RH - 0.016, z, g, nocast); add(new THREE.PlaneGeometry(1.1, 0.5).rotateX(Math.PI / 2), glowM('#f4f8ff'), x, RH - 0.034, z, g, nocast); }
  // back wall: window with blinds (painted campus outside), calendar 2003, cork board, bookshelf
  { const wg = grp(g, 0.9, 1.55, -2.48); add(tbox(1.6, 1.3, 0.06, 0.3), M.trim, 0, 0, 0, wg, nocast); LS.outD = dynTex(512, 420, true); add(new THREE.PlaneGeometry(1.46, 1.16), LS.outD.m, 0, 0, 0.02, wg, nocast).userData.flatNd = true;
    for (let k = 0; k < 11; k++) add(box(1.5, 0.025, 0.012), toon({ color: '#eeeae0' }), 0, 0.5 - k * 0.07, 0.06, wg, nocast); add(cyl(0.004, 0.004, 1.2, 4), M.trim, 0.6, -0.1, 0.07, wg, nocast); }
  { const cg = grp(g, -1.25, 1.6, -2.48); add(new THREE.PlaneGeometry(0.42, 0.6), signM(cv(256, 366, (q, w, h) => { q.fillStyle = '#fbf8f0'; q.fillRect(0, 0, w, h); q.fillStyle = '#4a78b8'; q.fillRect(0, 0, w, 150);
      q.fillStyle = '#ffffff'; q.beginPath(); q.arc(w * 0.72, 60, 30, 0, 6.28); q.fill(); q.font = `900 86px ${FNT}`; q.fillStyle = '#c8322e'; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText('2003', w / 2, 200);
      q.fillStyle = '#5a5060'; for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) q.fillRect(18 + c * 32, 250 + r * 22, 20, 12); })), 0, 0, 0.01, cg, nocast); LS.cal = cg; add(cyl(0.006, 0.006, 0.02, 6).rotateX(Math.PI / 2), M.red, 0, 0.32, 0.01, cg, nocast); }
  { const bg = grp(g, -0.35, 1.65, -2.47); add(tbox(0.7, 0.55, 0.02, 0.3), LM.cork, 0, 0, 0, bg, nocast); for (let i = 0; i < 5; i++) add(new THREE.PlaneGeometry(0.15, 0.2), toon({ color: ['#fbf8f0', '#f8e8a0', '#fbf8f0', '#d8e8f8', '#fbf8f0'][i] }), -0.25 + i * 0.12, (i % 2) * 0.12 - 0.05, 0.015 + i * 0.002, bg, nocast); }
  { const sg = grp(g, -2.4, 0, -2.25); add(tbox(1.1, 2.1, 0.36, 0.5), LM.desk, 0, 1.05, 0, sg); const L = []; const rn = P.rng(77); for (let s = 0; s < 5; s++) { let x = -0.48; while (x < 0.46) { const bw = 0.03 + rn() * 0.04, bh = 0.22 + rn() * 0.1; L.push({ x: x + bw / 2, y: 0.08 + s * 0.4 + bh / 2, z: 0.03, s: [bw, bh, 0.24], col: ['#8a2a2a', '#2a4a7a', '#3a6a4a', '#d8b860', '#5a3a6a', '#e8e0d0', '#2a2a30'][Math.floor(rn() * 7)] }); x += bw + 0.004; } }
    instP(new THREE.BoxGeometry(1, 1, 1), toon({ color: '#ffffff', roughness: 0.7 }), L, sg); for (let s = 0; s < 6; s++) add(tbox(1.04, 0.025, 0.32, 0.3), LM.desk, 0, 0.06 + s * 0.4, 0.02, sg, nocast); }
  // mail cart with a canvas sack (right side)
  { const mg = grp(g, 2.2, 0, -1.6, -0.3); add(tbox(0.8, 0.04, 0.5, 0.3), M.steelD, 0, 0.3, 0, mg); for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { add(cyl(0.012, 0.012, 0.85, 6), M.steelD, sx * 0.38, 0.5, sz * 0.23, mg); add(new THREE.SphereGeometry(0.04, 8, 6), M.rubber, sx * 0.36, 0.04, sz * 0.22, mg); }
    const sk = add(new THREE.SphereGeometry(0.34, 16, 12), texM(fabricT('#c8b890', '#8a7a58'), 2, 2), 0, 0.62, 0, mg); sk.scale.set(1.05, 0.9, 0.7); for (let i = 0; i < 5; i++) add(box(0.23, 0.005, 0.16), LM.env, -0.2 + i * 0.1, 0.95 + (i % 2) * 0.03, 0.02, mg).rotation.set(-0.9 + i * 0.1, i * 0.4, 0.3); }
  // desk + props
  { const D0 = L_.desk, dg = grp(g, D0[0] - O[0], 0, D0[2]); LS.desk = dg; add(tbox(1.9, 0.05, 0.85, 0.5), LM.desk, 0, 0.725, 0, dg); add(tbox(1.86, 0.62, 0.03, 0.5), LM.desk, 0, 0.4, 0.4, dg); for (const s of [-1, 1]) add(tbox(0.04, 0.7, 0.8, 0.5), LM.desk, s * 0.91, 0.35, 0, dg);
    // stacks of catalogs A/B/C (back row) + envelope stack + mail tray
    [-0.6, -0.15, 0.3].forEach((x, i) => { for (let k = 0; k < 6; k++) { const m = add(box(0.21, 0.012, 0.28), [LM.cat[i], LM.cat[i], LM.cat[i], LM.page, LM.page, LM.page], x + (k % 2) * 0.004, 0.757 + k * 0.012, -0.22 + (k % 3) * 0.003, dg); m.material = [LM.page, LM.page, LM.cat[i], LM.page, LM.page, LM.page]; m.rotation.y = (k % 2 - 0.5) * 0.05; } });
    for (let k = 0; k < 8; k++) add(box(0.23, 0.006, 0.16), [LM.page, LM.page, LM.env, LM.page, LM.page, LM.page], 0.74, 0.753 + k * 0.006, -0.26, dg).rotation.y = 0.1 + (k % 3) * 0.04;
    const tr = grp(dg, 0.72, 0.75, 0.0); add(tbox(0.3, 0.012, 0.22, 0.2), M.steelD, 0, 0.006, 0, tr); for (const s of [-1, 1]) { add(box(0.3, 0.06, 0.01), M.steelD, 0, 0.03, s * 0.11, tr); add(box(0.01, 0.06, 0.22), M.steelD, s * 0.15, 0.03, 0, tr); }
    add(new THREE.PlaneGeometry(0.2, 0.04), signM(signTex('OUTGOING', 256, 52, '#f4efe0', '#1e1820', 30, FNT)), 0, 0.03, 0.116, tr, nocast); LS.tray = tr;
    // name tents (plain text only)
    LS.tents = [['MIT', -0.53], ['CHICAGO', 0.53]].map(([s, x]) => { const tg = grp(dg, x, 0.75, 0.33); const tm = signM(signTex(s, 512, 140, '#fbfaf4', '#1e1820', s.length > 4 ? 84 : 110, FNT), { side: THREE.DoubleSide });
      const a = add(new THREE.PlaneGeometry(0.3, 0.09), tm, 0, 0.042, 0.022, tg); a.rotation.x = -0.45; const b = add(new THREE.PlaneGeometry(0.3, 0.09), M.paper, 0, 0.042, -0.018, tg); b.rotation.x = 0.45; return tg; });
    // three hero catalogs (front row, can tilt up + fan) — each a group pivoting at its bottom edge
    LS.cats = [-0.27, 0, 0.27].map((x, i) => { const cg = grp(dg, x, 0.752, 0.37); const m = add(box(0.21, 0.01, 0.28), LM.page, 0, 0.005, -0.14, cg); m.material = [LM.page, LM.page, LM.cat[i], LM.page, LM.page, LM.page]; return cg; });
    // beige CRT + keyboard on a side table (left)
    const st = grp(g, -1.7, 0, -0.9, 0.5); add(tbox(0.8, 0.04, 0.6, 0.3), LM.desk, 0, 0.73, 0, st); for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) add(box(0.04, 0.72, 0.04), M.steelD, sx * 0.36, 0.36, sz * 0.26, st);
    add(tbox(0.4, 0.36, 0.4, 0.3), LM.beige, 0, 0.95, -0.05, st); add(tbox(0.3, 0.26, 0.2, 0.3), LM.beige, 0, 0.92, -0.3, st); add(new THREE.PlaneGeometry(0.31, 0.24), glowM('#a8d0c8'), 0, 0.97, 0.152, st, nocast); add(tbox(0.42, 0.025, 0.15, 0.2), LM.beige, 0, 0.76, 0.2, st);
    add(cyl(0.045, 0.04, 0.1, 12), toon({ color: '#c8322e' }), 0.3, 0.8, 0.1, st); }
  // a potted plant + coat rack for depth
  { const pg_ = grp(g, 2.5, 0, 0.8); add(cyl(0.16, 0.12, 0.34, 14), toon({ color: '#b8643a' }), 0, 0.17, 0, pg_); for (let i = 0; i < 8; i++) { const lf = add(new THREE.SphereGeometry(0.12, 10, 8), SM.plant, Math.cos(i * 2.4) * 0.1, 0.45 + i * 0.09, Math.sin(i * 2.4) * 0.1, pg_); lf.scale.set(1.2, 0.5, 0.6); lf.rotation.set(0.4, i * 2.4, 0.4); } }
}
