
// =====================================================================================
// MAIN STREET (MAIN): street along x (z 8..16), north sidewalk z 4.5..8. North side: diner (x -22..-10), property office (x -8..-2),
// parking lot (x -1..10), the old gas-station garage that becomes DAY ONE SMALL ENGINES (x 12..26, front z=0, forecourt to z 8).
// South side (z 19.5+): storage units, storefronts. Far west (x -50..-36): a working gas station (Mia's night shift).
// =====================================================================================
const MS = {};
{ const O = MAIN, g = grp(world, O[0], 0, O[2]); MS.g = g;
  add(new THREE.PlaneGeometry(240, 120).rotateX(-Math.PI / 2), texM(lawnT, 50, 25), 0, -0.01, 0, g, nocast);
  add(new THREE.PlaneGeometry(240, 8).rotateX(-Math.PI / 2), texM(asphaltT, 30, 1, { roughness: 0.9 }), 0, 0.01, 12, g, nocast);
  for (let x = -118; x < 120; x += 6) add(new THREE.PlaneGeometry(2.6, 0.12).rotateX(-Math.PI / 2), M.yellow, x, 0.016, 12, g, nocast);
  for (const z of [8, 16]) add(tbox(240, 0.15, 0.25, 1), M.concrete, 0, 0.075, z + (z === 8 ? -0.12 : 0.12), g, nocast);
  add(new THREE.PlaneGeometry(240, 3.4).rotateX(-Math.PI / 2), texM(concreteT(), 140, 2), 0, 0.02, 6.2, g, nocast); add(new THREE.PlaneGeometry(240, 3.4).rotateX(-Math.PI / 2), texM(concreteT(), 140, 2), 0, 0.02, 17.9, g, nocast);
  add(new THREE.PlaneGeometry(26, 12).rotateX(-Math.PI / 2), texM(concreteT('#b0aca2'), 6, 3), 19, 0.015, 2.5, g, nocast); // gas-station forecourt
  add(new THREE.PlaneGeometry(11, 10.5).rotateX(-Math.PI / 2), texM(asphaltT, 3, 3), 4.5, 0.022, -0.7, g, nocast); for (let i = 0; i < 5; i++) add(new THREE.PlaneGeometry(0.1, 4.5).rotateX(-Math.PI / 2), M.white, 0 + i * 2.6, 0.02, -3.2, g, nocast); // parking lot
  const facade = (x, w, h, mat, ry = 0, z = 4.5, d = 10) => { const b = grp(g, x, 0, z, ry); add(tbox(w, h, d, 2), mat, 0, h / 2, -d / 2, b); add(tbox(w + 0.3, 0.4, d + 0.3, 1), M.trimD, 0, h + 0.2, -d / 2, b); return b; };
  // ---- DINER (interior visible; front glass) ----
  { const dg = grp(g, -16, 0, 4.5); MS.diner = dg; const W = 12, D = 10, Hh = 4.0;
    add(tbox(W, 0.4, D, 1), M.concreteD, 0, -0.18, -D / 2, dg, nocast); add(new THREE.PlaneGeometry(W - 0.2, D - 0.2).rotateX(-Math.PI / 2), M.lino, 0, 0.03, -D / 2, dg, nocast); add(new THREE.PlaneGeometry(W, D).rotateX(Math.PI / 2), texM(plasterT('#f2ece0'), 3, 3), 0, 3.4, -D / 2, dg, nocast);
    for (const [x, z, w, ry, m] of [[0, -D, W, 0, M.tileW], [-W / 2, -D / 2, D, Math.PI / 2, M.tileW], [W / 2, -D / 2, D, -Math.PI / 2, M.tileW]]) { const wl = add(new THREE.PlaneGeometry(w, 3.4), m, x, 1.7, z, dg, nocast); wl.rotation.y = ry; }
    // exterior shell: chrome-trimmed walls, big windows, striped awning, roof sign
    for (const s of [-1, 1]) { add(tbox(0.25, Hh, D, 1), M.sidingE, s * (W / 2 + 0.12), Hh / 2, -D / 2, dg); }
    add(tbox(W + 0.5, Hh - 3.2, 0.25, 1), M.red, 0, 3.2 + (Hh - 3.2) / 2, 0.02, dg); add(tbox(W + 0.5, 0.8, 0.25, 1), M.red, 0, 0.4, 0.02, dg); add(tbox(W + 0.5, 0.06, 0.3, 1), M.chrome, 0, 0.82, 0.04, dg); add(tbox(W + 0.5, 0.06, 0.3, 1), M.chrome, 0, 3.18, 0.04, dg);
    for (const x of [-4.2, -1.4, 3.2]) { add(tbox(0.1, 2.4, 0.14, 0.3), M.chrome, x, 2.0, 0.04, dg); } add(new THREE.PlaneGeometry(W - 0.2, 2.36), M.glass, 0, 2.0, 0.03, dg, nocast).userData.ndSkip = true;
    MS.dinerDoor = grp(dg, 1.4, 0.8, 0.05); add(tbox(1.0, 2.3, 0.05, 0.3), M.chrome, 0.5, 1.15, 0, MS.dinerDoor, nocast);
    { const aw = add(new THREE.PlaneGeometry(W + 0.4, 1.2, 1, 1), texM(cv(256, 64, (q, w, h) => { for (let i = 0; i < 16; i++) { q.fillStyle = i % 2 ? '#f4f0e4' : '#c8322e'; q.fillRect(i * 16, 0, 16, h); } }), 4, 1, { side: THREE.DoubleSide }), 0, 3.0, 0.55, dg, nocast); aw.rotation.x = -1.0; }
    add(new THREE.PlaneGeometry(4.2, 1.0), emisC(cv(1024, 244, (q, w, h) => { q.fillStyle = '#1a1820'; rr(q, 0, 0, w, h, 40); q.fill(); txt(q, 'MAIN ST DINER', w / 2, h / 2 + 6, 120, '#ff6a8a'); q.strokeStyle = '#5ad8ff'; q.lineWidth = 8; rr(q, 12, 12, w - 24, h - 24, 32); q.stroke(); })), 0, Hh + 0.75, 0.0, dg, nocast);
    add(tbox(4.3, 1.1, 0.1, 0.5), M.dark, 0, Hh + 0.75, -0.08, dg, nocast);
    // interior: counter with stools, pie case, coffee machine, booths along the window, menu boards, apron hook by the back door
    const ic = grp(dg, 0, 0, -6.6); add(tbox(7.0, 1.05, 0.6, 0.5), M.vinylR, 0.5, 0.525, 0, ic); add(tbox(7.1, 0.06, 0.75, 0.5), M.counter, 0.5, 1.08, 0.05, ic); add(tbox(7.0, 0.06, 0.06, 0.5), M.chrome, 0.5, 0.95, 0.31, ic);
    const stl = []; for (let i = 0; i < 8; i++) stl.push({ x: -2.6 + i * 0.85, y: 0, z: 0.75 }); for (const s of stl) { add(cyl(0.2, 0.2, 0.1, 18), M.vinylR, s.x, 0.75, s.z, ic); add(cyl(0.04, 0.04, 0.7, 8), M.chrome, s.x, 0.35, s.z, ic); add(cyl(0.2, 0.22, 0.03, 14), M.chrome, s.x, 0.015, s.z, ic); }
    add(tbox(1.2, 0.5, 0.5, 0.3), M.glass, 3.0, 1.35, 0.05, ic, nocast).userData.ndSkip = true; for (let i = 0; i < 3; i++) add(cyl(0.14, 0.14, 0.06, 16), toon({ color: ['#c8642a', '#e8b860', '#8a2a3a'][i] }), 2.6 + i * 0.4, 1.17, 0.05, ic);
    add(tbox(7.0, 0.9, 0.6, 0.5), M.steel, 0.5, 0.45, -1.6, ic); add(tbox(7.0, 0.05, 0.62, 0.5), M.steel, 0.5, 0.92, -1.6, ic); add(tbox(0.6, 0.6, 0.45, 0.3), M.black, -1.8, 1.25, -1.6, ic); add(tbox(0.6, 0.6, 0.45, 0.3), M.black, -1.0, 1.25, -1.6, ic);
    for (let i = 0; i < 3; i++) add(cyl(0.08, 0.07, 0.2, 14), toon({ color: '#5a3a26', transparent: true, opacity: 0.8 }), -2.0 + i * 0.4, 1.0, -1.45, ic);
    add(new THREE.PlaneGeometry(5.5, 1.0), signM(cv(1100, 200, (q, w, h) => { q.fillStyle = '#1a1820'; q.fillRect(0, 0, w, h); const it = [['PANCAKES', '4.50'], ['EGGS & TOAST', '5.25'], ['BURGER', '7.95'], ['PIE', '3.50'], ['COFFEE', '1.25']]; it.forEach(([a, b], i) => { txt(q, a, 30 + (i % 3) * 360, 60 + Math.floor(i / 3) * 80, 28, '#f4f0e4', 'Arial Black', 900, 'left'); txt(q, b, 345 + (i % 3) * 360, 60 + Math.floor(i / 3) * 80, 34, '#f2c23a', 'Arial Black', 900, 'right'); }); })), 0.5, 2.55, -3.38, dg, nocast).position.z = -D + 0.02;
    for (let i = 0; i < 4; i++) { const bx = -5.1 + 0, bz = -1.2 - i * 2.0; const bt = grp(dg, -5.0, 0, -1.4 - i * 2.1); add(tbox(1.1, 0.05, 0.8, 0.3), M.counter, 0.25, 0.76, 0, bt); add(cyl(0.05, 0.05, 0.75, 8), M.chrome, 0.25, 0.375, 0, bt); for (const s of [-1, 1]) { add(tbox(0.5, 0.45, 0.8, 0.3), M.vinylR, 0.25 + s * 0.0, 0.225, s * 0.65, bt).scale.x = 1; add(tbox(0.5, 0.7, 0.14, 0.3), M.vinylR, 0.25, 0.8, s * 0.95, bt); }
      add(cyl(0.03, 0.03, 0.12, 8), M.chrome, 0.4, 0.84, 0.2, bt); add(cyl(0.025, 0.025, 0.08, 8), toon({ color: '#c8322e' }), 0.5, 0.82, 0.25, bt); }
    // back door + apron hooks (Day 100: Linda hangs up her apron)
    add(tbox(1.0, 2.2, 0.05, 0.3), M.steelD, 4.6, 1.1, -D + 0.03, dg, nocast); add(new THREE.PlaneGeometry(0.5, 0.18), signM(signTex('STAFF', 256, 90, '#c8322e', '#ffffff', 56)), 4.6, 2.35, -D + 0.06, dg, nocast);
    add(tbox(0.8, 0.06, 0.04, 0.3), M.oak, 4.8, 1.6, -D + 0.04, dg, nocast).position.x = 4.8 - 0; MS.hooks = []; for (let i = 0; i < 3; i++) { add(cyl(0.012, 0.012, 0.08, 6).rotateX(Math.PI / 2), M.brass, 4.5 + i * 0.3, 1.6, -D + 0.09, dg, nocast); }
    MS.apron = grp(dg, 4.8, 1.6, -D + 0.12); add(new THREE.PlaneGeometry(0.42, 0.62), signM(cv(210, 310, (q, w, h) => { q.fillStyle = '#fbfaf4'; q.beginPath(); q.moveTo(30, 0); q.lineTo(w - 30, 0); q.lineTo(w, h); q.lineTo(0, h); q.fill(); q.strokeStyle = '#d8d4c8'; q.lineWidth = 4; q.strokeRect(50, 140, 110, 70); q.fillStyle = '#f2e8a8'; q.fillRect(120, 120, 40, 50); q.strokeStyle = '#3a6ad8'; q.beginPath(); q.moveTo(70, 120); q.lineTo(72, 180); q.stroke(); txt(q, 'LINDA', 105, 60, 24, '#1a4a46'); }), { transparent: true, alphaTest: 0.5, side: THREE.DoubleSide }), 0, -0.32, 0, MS.apron, nocast);
    for (let i = 0; i < 2; i++) add(new THREE.PlaneGeometry(0.4, 0.6), signM(cv(200, 300, (q, w, h) => { q.fillStyle = i ? '#2a9a92' : '#e8dcc8'; q.fillRect(0, 0, w, h); })), 4.2 + i * 0.75, 1.28, -D + 0.08, dg, nocast);
    for (let x = -4; x <= 4; x += 2.6) { add(cyl(0.25, 0.35, 0.25, 16, 1, true), toon({ color: '#c8322e', side: THREE.DoubleSide }), x, 3.15, -3.5, dg, nocast); add(new THREE.SphereGeometry(0.08, 10, 8), glowM('#fff0c8'), x, 3.05, -3.5, dg, nocast); }
  }
  // ---- PROPERTY OFFICE (brick, interior: desk, cabinet, chairs) ----
  { const og = grp(g, -5, 0, 4.5); MS.office = og; const W = 6, D = 8;
    for (const s of [-1, 1]) add(tbox(0.25, 3.6, D, 1), M.brick, s * (W / 2 - 0.12), 1.8, -D / 2, og); add(tbox(W, 3.6, 0.25, 1), M.brick, 0, 1.8, -D + 0.12, og); add(tbox(W, 0.9, 0.25, 1), M.brick, 0, 3.15, 0, og); add(tbox(W, 0.6, 0.25, 1), M.brick, 0, 0.3, 0, og); add(tbox(W + 0.3, 0.3, D + 0.3, 1), M.trimD, 0, 3.75, -D / 2, og);
    add(new THREE.PlaneGeometry(W - 0.5, D - 0.5).rotateX(-Math.PI / 2), texM(cv(128, 128, (q, w, h) => { q.fillStyle = '#7a6a5a'; q.fillRect(0, 0, w, h); noise(q, w, h, 0.3, 3000, '#5a4a3a', '#9a8a7a'); }), 4, 4), 0, 0.02, -D / 2, og, nocast);
    add(new THREE.PlaneGeometry(W - 0.5, D - 0.5).rotateX(Math.PI / 2), texM(plasterT('#efe8da'), 2, 2), 0, 3.0, -D / 2, og, nocast);
    for (const [x, z, w, ry] of [[0, -D + 0.26, W - 0.5, 0], [-W / 2 + 0.26, -D / 2, D, Math.PI / 2], [W / 2 - 0.26, -D / 2, D, -Math.PI / 2]]) add(new THREE.PlaneGeometry(w, 3.0), M.plasterB, x, 1.5, z, og, nocast).rotation.y = ry;
    add(new THREE.PlaneGeometry(W - 0.3, 2.0), M.glass, 0, 1.6, 0.02, og, nocast).userData.ndSkip = true; add(new THREE.PlaneGeometry(2.6, 0.32), signM(cv(780, 96, (q, w, h) => { q.fillStyle = '#f4f0e4'; q.fillRect(0, 0, w, h); txt(q, 'PROPERTY OFFICE', w / 2, h / 2 + 3, 58, '#2a3a5a', 'Georgia, serif'); })), 0, 3.15, 0.14, og, nocast);
    const dk = grp(og, 0, 0, -3.2); add(tbox(1.8, 0.05, 0.8, 0.5), M.oak, 0, 0.75, 0, dk); add(tbox(1.7, 0.7, 0.05, 0.5), M.oak, 0, 0.38, -0.35, dk); for (const s of [-1, 1]) add(tbox(0.05, 0.72, 0.75, 0.3), M.oak, s * 0.85, 0.37, 0, dk);
    add(tbox(0.4, 0.3, 0.04, 0.2), M.dark, -0.5, 0.95, -0.25, dk); add(tbox(0.36, 0.26, 0.01, 0.2), glowM('#9ac0e8'), -0.5, 0.95, -0.228, dk, nocast); for (let i = 0; i < 3; i++) add(tbox(0.22, 0.012, 0.3, 0.2), M.paper, 0.4 + i * 0.03, 0.78 + i * 0.012, 0.05, dk);
    MS.deskCash = grp(dk, 0.0, 0.775, 0.15); { const L = []; for (let s = 0; s < 6; s++) for (let k = 0; k < 8; k++) L.push({ x: -0.3 + s * 0.12, y: 0.003 + k * 0.004, z: 0, ry: Math.PI / 2 + (k % 3 - 1) * 0.05 }); instP(new THREE.BoxGeometry(0.156, 0.004, 0.066), texM(cv(128, 56, (q, w, h) => { q.fillStyle = '#a8c890'; q.fillRect(0, 0, w, h); q.strokeStyle = '#5a7a4a'; q.lineWidth = 3; q.strokeRect(4, 4, w - 8, h - 8); })), L, MS.deskCash); }
    add(tbox(0.5, 1.3, 0.6, 0.3), M.steelD, 2.2, 0.65, -6.8, og); for (let k = 0; k < 3; k++) add(box(0.2, 0.03, 0.02), M.chrome, 2.2, 0.35 + k * 0.4, -6.48, og);
    pictureFrame(og, -1.2, 1.9, -D + 0.28, 0, 0.6, 0.45, (q, w, h) => { q.fillStyle = '#c8d8e8'; q.fillRect(0, 0, w, h); q.fillStyle = '#5a7a4a'; q.fillRect(0, h * 0.6, w, h * 0.4); q.fillStyle = '#e8e0d0'; q.fillRect(w * 0.3, h * 0.35, w * 0.4, h * 0.3); });
    const ch = (x, z, ry) => { const c = grp(og, x, 0, z, ry); add(tbox(0.5, 0.08, 0.5, 0.3), M.cushion, 0, 0.47, 0, c); add(tbox(0.5, 0.55, 0.08, 0.3), M.cushion, 0, 0.78, -0.22, c); add(cyl(0.03, 0.03, 0.45, 8), M.chrome, 0, 0.22, 0, c); }; ch(0, -4.2, 0); ch(-0.6, -2.0, Math.PI); ch(0.6, -2.0, Math.PI);
  }
  // parked car in the lot (Day 29: Linda cries next to it)
  MS.lotCar = car(g, 2.2, -2.5, 0, '#6a7a8a'); MS.lotCar2 = car(g, 7.4, -3.0, 0.05, '#a83a32', 'pickup');
  // ---- OLD GAS STATION → DAY ONE SMALL ENGINES (x 12..26). Office part x 12..17 with counter; two bays x 17..26 with roll-up doors. Interior visible.
  { const sg = grp(g, 19, 0, 0); MS.shop = sg; const W = 14, D = 9, Hh = 4.2;
    const shopFloor = add(new THREE.PlaneGeometry(W - 0.4, D - 0.4).rotateX(-Math.PI / 2), texM(concreteT('#a8a49a'), 4, 3, { roughness: 0.6, clearcoat: 0.25 }), 0, 0.02, -D / 2, sg, nocast);
    add(new THREE.PlaneGeometry(W - 0.4, D - 0.4).rotateX(Math.PI / 2), texM(cv(128, 128, (q, w, h) => { q.fillStyle = '#e8e4da'; q.fillRect(0, 0, w, h); q.fillStyle = '#c8c4b8'; for (let i = 0; i < w; i += 32) { q.fillRect(i, 0, 2, h); q.fillRect(0, i, w, 2); } }), 6, 4), 0, 3.6, -D / 2, sg, nocast);
    const wallT = texM(cv(256, 256, (q, w, h) => { q.fillStyle = '#e8e6de'; q.fillRect(0, 0, w, h); q.fillStyle = '#d0cec4'; for (let r = 0; r < 8; r++) { q.fillRect(0, r * 32, w, 2); for (let c = 0; c < 4; c++) q.fillRect(c * 64 + (r % 2) * 32, r * 32, 2, 32); } noise(q, w, h, 0.08, 3000); }), 4, 2);
    for (const [x, z, w, ry] of [[0, -D + 0.2, W - 0.4, 0], [-W / 2 + 0.2, -D / 2, D, Math.PI / 2], [W / 2 - 0.2, -D / 2, D, -Math.PI / 2]]) add(new THREE.PlaneGeometry(w, 3.6), wallT, x, 1.8, z, sg, nocast).rotation.y = ry;
    // exterior shell: white enamel panels with blue stripe, flat roof with parapet
    for (const s of [-1, 1]) add(tbox(0.3, Hh, D, 1), M.sidingE, s * (W / 2), Hh / 2, -D / 2, sg); add(tbox(W, Hh, 0.3, 1), M.sidingE, 0, Hh / 2, -D, sg);
    add(tbox(W + 0.4, 0.6, 0.35, 1), M.white, 0, Hh - 0.3, 0.0, sg); add(tbox(W + 0.4, 0.18, 0.37, 1), M.blue, 0, Hh - 0.62, 0.0, sg); add(tbox(W + 0.4, 0.3, D + 0.4, 1), M.white, 0, Hh + 0.15, -D / 2, sg, nocast);
    // office front: window + glass door (x 12..17 => local -7..-2)
    add(tbox(5, 0.8, 0.2, 1), M.white, -4.5, 0.4, 0.0, sg); add(new THREE.PlaneGeometry(3.2, 2.6), M.glass, -5.2, 2.1, 0.02, sg, nocast).userData.ndSkip = true; add(tbox(0.1, 2.9, 0.22, 0.3), M.blue, -3.4, 1.95, 0.0, sg); add(tbox(0.1, 2.9, 0.22, 0.3), M.blue, -2.0, 1.95, 0.0, sg); add(tbox(5, 0.1, 0.22, 1), M.blue, -4.5, 3.4, 0.0, sg);
    MS.shopDoor = grp(sg, -3.35, 0, 0.05); add(tbox(1.25, 2.4, 0.04, 0.3), M.blue, 0.62, 1.2, 0, MS.shopDoor, nocast); add(new THREE.PlaneGeometry(1.05, 2.1), M.glass, 0.62, 1.2, 0.03, MS.shopDoor, nocast).userData.ndSkip = true;
    add(tbox(0.3, Hh, 0.3, 0.3), M.white, -2.0, Hh / 2, 0.0, sg); add(tbox(0.3, Hh, 0.3, 0.3), M.white, 2.5, Hh / 2, 0.0, sg);
    // two bays with roll-up doors (open by W.bayOpen)
    MS.bays = []; for (const bx of [0.25, 4.75]) { add(box(4.2, 0.12, 0.12), M.steelD, bx, 3.4, 0.05, sg, nocast); const bd = grp(sg, bx, 0, 0.0); for (let k = 0; k < 9; k++) add(tbox(4.0, 0.38, 0.05, 0.5), toon({ color: '#e4e0d4', roughness: 0.6 }), 0, 0.2 + k * 0.38, 0, bd, nocast); MS.bays.push(bd); }
    add(new THREE.PlaneGeometry(0.4, 3.4), M.sidingE, 2.5 + 0.0, 1.7, -0.0, sg, nocast);
    // sign board on the parapet (dynamic: faded old / new DAY ONE SMALL ENGINES)
    MS.signD = dynTex(1400, 230); MS.sign = add(new THREE.PlaneGeometry(9.8, 1.6), MS.signD.m, 0.5, Hh + 0.95, 0.3, sg, nocast); add(tbox(10.1, 1.8, 0.15, 0.5), M.trimD, 0.5, Hh + 0.95, 0.2, sg);
    MS.newSign = grp(sg, 0.5, 0, 0.42); MS.newSignP = add(new THREE.PlaneGeometry(9.6, 1.5), signM(cv(1400, 220, (q, w, h) => { const gr = q.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2a5aa8'); gr.addColorStop(1, '#1c3c7a'); q.fillStyle = gr; q.fillRect(0, 0, w, h); q.strokeStyle = '#f2c23a'; q.lineWidth = 10; q.strokeRect(10, 10, w - 20, h - 20); txt(q, 'DAY ONE SMALL ENGINES', w / 2, 92, 120, '#ffffff'); txt(q, 'BRING IT BROKEN', w / 2, 178, 56, '#f2c23a'); })), 0, Hh + 0.95, 0, MS.newSign, nocast);
    // pole sign by the road (old station sign, later repainted)
    { const ps = grp(g, 10.5, 0, 5.5); add(cyl(0.12, 0.12, 5.0, 10), M.steelD, 0, 2.5, 0, ps); add(tbox(2.4, 1.6, 0.25, 0.5), M.white, 0, 5.4, 0, ps); MS.poleD = dynTex(480, 320); for (const s of [-1, 1]) { const pm = add(new THREE.PlaneGeometry(2.2, 1.45), MS.poleD.m, 0, 5.4, s * 0.13, ps, nocast); if (s < 0) pm.rotation.y = Math.PI; } }
    // canopy over the old pump island (pumps removed)
    { const cp = grp(sg, -2, 0, 5.2); add(tbox(8, 0.6, 4.2, 1), M.white, 0, 4.5, 0, cp); add(tbox(8.04, 0.19, 4.24, 1), M.blue, 0, 4.315, 0, cp); for (const x of [-2.5, 2.5]) add(tbox(0.35, 4.3, 0.35, 0.5), M.white, x, 2.15, 0, cp); add(tbox(5.5, 0.18, 1.0, 0.5), M.concrete, 0, 0.09, 0, cp); for (const x of [-1.5, 1.5]) add(tbox(0.5, 0.06, 0.4, 0.3), M.rust, x, 0.21, 0, cp); add(new THREE.PlaneGeometry(7.6, 4.0).rotateX(Math.PI / 2), glowM('#fff8e8'), 0, 4.19, 0, cp, nocast).visible = false; }
    // interior: front counter (office), shelves of parts, four workbenches (Day 70), pegboards, BRING IT BROKEN sign above the inside of the door
    MS.counter = grp(sg, -4.5, 0, -3.2); add(tbox(2.6, 1.0, 0.6, 0.5), M.oak, 0, 0.5, 0, MS.counter); add(tbox(2.7, 0.05, 0.7, 0.5), M.counter, 0, 1.02, 0, MS.counter); add(tbox(0.36, 0.26, 0.3, 0.2), M.dark, -0.7, 1.18, 0, MS.counter); add(tbox(0.3, 0.2, 0.02, 0.2), glowM('#cfe8c8'), -0.7, 1.2, 0.16, MS.counter, nocast); add(cyl(0.05, 0.05, 0.08, 10), M.chrome, 0.8, 1.08, 0.1, MS.counter);
    MS.cash1 = add(new THREE.PlaneGeometry(0.16, 0.07).rotateX(-Math.PI / 2), texM(cv(128, 56, (q, w, h) => { q.fillStyle = '#a8c890'; q.fillRect(0, 0, w, h); q.strokeStyle = '#5a7a4a'; q.lineWidth = 3; q.strokeRect(4, 4, w - 8, h - 8); })), 0.3, 1.048, 0.12, MS.counter, nocast);
    { const sh = grp(sg, -6.6, 0, -6.0); for (const y of [0.4, 1.0, 1.6, 2.2]) add(tbox(0.4, 0.03, 2.4, 0.5), M.metal, 0, y, 0, sh); for (let i = 0; i < 24; i++) add(tbox(0.25, 0.18, 0.25, 0.3), toon({ color: ['#c8322e', '#2f5aa8', '#e8b830', '#3a7a4a'][i % 4] }), 0, [0.4, 1.0, 1.6, 2.2][i % 4] + 0.1, -1.0 + Math.floor(i / 4) * 0.4, sh); }
    add(new THREE.PlaneGeometry(1.3, 0.7), signM(cv(600, 330, (q, w, h) => { q.drawImage(cardboardT, 0, 0, w, h); q.strokeStyle = '#8a5a2a'; q.lineWidth = 6; q.strokeRect(6, 6, w - 12, h - 12); hand(q, 'BRING IT', w / 2, 112, 96, '#1a1a22', -0.03); hand(q, 'BROKEN', w / 2, 232, 112, '#c8322e', 0.02); })), -2.7, 2.85, -0.12, sg, nocast).rotation.y = Math.PI;
    MS.benches = []; for (let i = 0; i < 4; i++) { const bx = -0.7 + i * 2.0; const b = grp(sg, bx, 0, -7.6); add(tbox(1.6, 0.06, 0.7, 0.5), M.oak, 0, 0.9, 0, b); for (const x of [-0.72, 0.72]) for (const z of [-0.3, 0.3]) add(box(0.06, 0.88, 0.06), M.steelD, x, 0.44, z, b); add(new THREE.PlaneGeometry(1.6, 1.0), M.peg, 0, 1.6, -0.6, b, nocast);
      const e = grp(b, 0.2, 0.93, 0.05); add(tbox(0.24, 0.18, 0.22, 0.2), engM, 0, 0.09, 0, e); add(cyl(0.1, 0.11, 0.05, 16), toon({ color: MOWCOL[i * 2] }), 0, 0.2, 0, e); add(cyl(0.12, 0.08, 0.5, 8), M.dark, 0, 1.8, 0, b, nocast);
      add(new THREE.SphereGeometry(0.05, 10, 8), glowM('#fff4d8'), 0, 1.5, 0.0, b, nocast); for (let k = 0; k < 6; k++) add(box(0.02, 0.2 + k % 3 * 0.05, 0.02), M.steel, -0.6 + k * 0.2, 1.75, -0.58, b, nocast); MS.benches.push(b); }
    mowerSet('shop61', [...grid(-1.5, -5.2, 10, 2, 0.95, 1.0, Math.PI, 0.1, 9), ...grid(-1.5, -2.6, 10, 2, 0.95, 1.0, Math.PI, 0.1, 10), ...grid(-6.2, 1.8, 7, 3, 1.0, 1.2, Math.PI * 0.95, 0.15, 11)].slice(0, 61), false, sg);
    MS.hero = heroMower(sg, '#2f8a4a'); MS.hero.position.set(-0.7, 0, -6.4); MS.hero.rotation.y = Math.PI * 0.9;
    for (let x = -5; x <= 6; x += 2.2) { add(box(1.2, 0.06, 0.25), M.steel, x, 3.55, -4.5, sg, nocast); add(box(1.1, 0.02, 0.2), glowM('#f8fbff'), x, 3.52, -4.5, sg, nocast); }
    add(new THREE.PlaneGeometry(1.4, 0.8), signM(cv(420, 240, (q, w, h) => { q.fillStyle = '#f8f8f4'; q.fillRect(0, 0, w, h); q.strokeStyle = '#8a8a92'; q.lineWidth = 6; q.strokeRect(3, 3, w - 6, h - 6); txt(q, 'REPAIR $60', w / 2, 70, 48, '#c8322e', 'Comic Sans MS, Arial Black'); txt(q, '+ PARTS', w / 2, 140, 40, '#1b2a44', 'Comic Sans MS, Arial Black'); txt(q, 'WAITLIST \u2192', w / 2, 200, 30, '#2f5aa8', 'Comic Sans MS, Arial Black'); })), -6.75, 1.9, -2.0, sg, nocast).rotation.y = Math.PI / 2;
  }
  // ---- storage units (south side) + storefronts ----
  { const st = grp(g, -8, 0, 21, Math.PI); add(tbox(18, 3.0, 5, 1), M.concreteD, 0, 1.5, -2.5, st); add(tbox(18.4, 0.3, 5.4, 1), M.trimD, 0, 3.1, -2.5, st); MS.units = [];
    for (let i = 0; i < 6; i++) { const x = -7.5 + i * 3.0; const u_ = grp(st, x, 0, 0.02); add(tbox(2.4, 2.4, 0.04, 0.5), toon({ color: '#d8a030', roughness: 0.5 }), 0, 1.2, 0, u_, nocast); for (let k = 0; k < 12; k++) add(box(2.38, 0.02, 0.01), toon({ color: '#b88020' }), 0, 0.1 + k * 0.2, 0.025, u_, nocast); add(new THREE.PlaneGeometry(0.4, 0.2), signM(signTex(String(101 + i), 120, 60, '#f4f0e4', '#1a1a22', 40)), 0, 2.6, 0.03, u_, nocast); MS.units.push(u_); }
    add(new THREE.PlaneGeometry(3.4, 0.5), signM(signTex('SELF STORAGE', 680, 100, '#1c3c7a', '#ffffff', 64)), 0, 3.6, 0.1, st, nocast); add(tbox(3.6, 0.7, 0.1, 0.5), M.trimD, 0, 3.6, 0.04, st);
    mowerSet('storage6', [...grid(-4.6, -1.6, 3, 2, 0.6, 0.9, 0.2, 0.08, 12)], false, st); MS.storageOpen = MS.units[1];
    for (let i = 0; i < 4; i++) { const b = facade(8 + i * 9, 8.5, 4 + (i % 2) * 1.5, [M.brick, M.sidingD, M.sidingC, M.brick][i], Math.PI, 19.5, 9); add(new THREE.PlaneGeometry(6, 2.2), nightGlow('#ffd898'), 0, 1.8, 0.02, b, nocast).position.z = 0.02;
      add(new THREE.PlaneGeometry(4, 0.6), signM(signTex(['BAKERY', 'BOOKS', 'BARBER', 'FLOWERS'][i], 600, 90, ['#6a2a2a', '#2a4a6a', '#3a3a3a', '#3a6a3a'][i], '#f4f0e4', 60)), 0, 3.4, 0.03, b, nocast); }
  }
  // ---- working gas station (far west): canopy + pumps + kiosk with window (Mia's night shift) ----
  { const gs = grp(g, -44, 0, 0); MS.gas = gs; add(new THREE.PlaneGeometry(22, 14).rotateX(-Math.PI / 2), texM(concreteT('#b8b4aa'), 5, 3), 0, 0.028, 1, gs, nocast);
    add(tbox(12, 0.7, 7, 1), M.white, 0, 5.0, 3.2, gs); add(tbox(12.04, 0.25, 7.04, 1), M.red, 0, 4.785, 3.2, gs); for (const x of [-4, 0, 4]) add(tbox(0.4, 4.6, 0.4, 0.5), M.white, x, 2.3, 3.2, gs);
    add(new THREE.PlaneGeometry(11.6, 6.6).rotateX(Math.PI / 2), glowM('#fffaf0'), 0, 4.64, 3.2, gs, nocast);
    for (const x of [-2, 2]) { add(tbox(1.6, 0.2, 0.8, 0.3), M.concrete, x, 0.1, 3.2, gs); const pu = grp(gs, x, 0.2, 3.2); add(tbox(0.7, 1.6, 0.5, 0.3), M.white, 0, 0.8, 0, pu); add(tbox(0.72, 0.3, 0.52, 0.3), M.red, 0, 1.44, 0, pu); add(box(0.4, 0.25, 0.02), glowM('#9ae8c8'), 0, 1.05, 0.26, pu, nocast); add(cyl(0.02, 0.02, 0.8, 6), M.black, 0.4, 0.8, 0.1, pu); }
    const k = grp(gs, 0, 0, -3); add(tbox(6, 3.2, 4, 1), M.sidingE, 0, 1.6, -2, k); add(tbox(6.2, 0.4, 4.2, 1), M.red, 0, 3.4, -2, k); // lit store interior seen through the big front window: snack shelves, glowing drink coolers, coffee station, posters
    add(new THREE.PlaneGeometry(4.6, 2.0), emisC(cv(1150, 500, (q, w, h) => { const gr = q.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#fff6e2'); gr.addColorStop(1, '#e8dcc4'); q.fillStyle = gr; q.fillRect(0, 0, w, h);
      q.fillStyle = '#f8f8ff'; for (let x = 60; x < w; x += 230) q.fillRect(x, 8, 140, 12);                                  // ceiling tubes
      for (let c = 0; c < 3; c++) { const x0 = 20 + c * 120; q.fillStyle = '#9aa4ac'; q.fillRect(x0, 40, 112, 380); q.fillStyle = '#d8f4ff'; q.fillRect(x0 + 6, 46, 100, 368);   // cooler doors
        for (let r = 0; r < 5; r++) for (let b = 0; b < 6; b++) { q.fillStyle = ['#c8322e', '#2a6ac8', '#3aa04a', '#f2a22a', '#8a3ac8', '#e8e8e8'][(b + r + c) % 6]; q.fillRect(x0 + 12 + b * 16, 60 + r * 72, 11, 48); q.fillStyle = '#ffffff90'; q.fillRect(x0 + 13 + b * 16, 62 + r * 72, 3, 30); }
        q.fillStyle = '#5a6670'; q.fillRect(x0 + 96, 180, 5, 80); }
      for (let r = 0; r < 4; r++) { const y = 120 + r * 85; q.fillStyle = '#6a6460'; q.fillRect(400, y + 52, 480, 8);              // snack gondola
        for (let i = 0; i < 26; i++) { q.fillStyle = ['#e8402a', '#f2c23a', '#2a8ad8', '#38a848', '#e86aa0', '#f08a2a', '#7a4ac8'][(i * 3 + r) % 7]; const hh = 30 + ((i * 7 + r * 5) % 4) * 5; q.fillRect(404 + i * 18.4, y + 52 - hh, 15, hh); q.fillStyle = '#ffffff70'; q.fillRect(406 + i * 18.4, y + 56 - hh, 11, 6); } }
      q.fillStyle = '#4a3a30'; q.fillRect(900, 230, 240, 270); q.fillStyle = '#6a5040'; q.fillRect(900, 222, 240, 14);              // counter
      q.fillStyle = '#2a2a30'; q.fillRect(950, 170, 70, 52); q.fillStyle = '#6ae0a8'; q.fillRect(958, 176, 54, 22);                 // register
      q.fillStyle = '#c8c4bc'; q.fillRect(1050, 150, 70, 72); q.fillStyle = '#2a2a2a'; q.fillRect(1058, 186, 22, 30); q.fillRect(1088, 186, 22, 30); txt(q, 'COFFEE', 1085, 165, 15, '#8a2a1a'); // coffee machine
      q.fillStyle = '#f4ead0'; q.fillRect(905, 50, 225, 90); q.strokeStyle = '#2a2a30'; q.lineWidth = 4; q.strokeRect(905, 50, 225, 90); txt(q, 'HOT COFFEE', 1018, 78, 28, '#c8322e'); txt(q, '99\u00a2', 1018, 115, 34, '#2a2a30');
      q.fillStyle = '#00000018'; q.fillRect(0, h - 70, w, 70); })), 0, 1.75, 0.01, k, nocast);
    { const wf = toon({ color: '#d8d8d8', roughness: 0.4 }); add(tbox(4.9, 0.12, 0.14, 0.4), wf, 0, 2.8, 0.06, k); add(tbox(4.9, 0.12, 0.14, 0.4), wf, 0, 0.72, 0.06, k);   // window frame + mullions
      for (const x of [-2.4, -0.6, 2.4]) add(tbox(0.1, 2.1, 0.14, 0.4), wf, x, 1.76, 0.06, k);
      add(tbox(5.0, 0.7, 0.5, 0.5), M.sidingE, 0, 0.35, 0.25, k); add(tbox(5.1, 0.06, 0.62, 0.3), M.steelD, 0, 0.72, 0.3, k);          // sill wall + steel night-window counter
      add(new THREE.PlaneGeometry(0.9, 0.55), signM(cv(360, 220, (q, w, h) => { q.fillStyle = '#f2c23a'; q.fillRect(0, 0, w, h); txt(q, 'COLD', w / 2, 70, 70, '#1c2a44'); txt(q, 'DRINKS', w / 2, 160, 70, '#c8322e'); })), -1.5, 2.25, 0.02, k, nocast);
      add(new THREE.PlaneGeometry(0.7, 0.5), signM(cv(280, 200, (q, w, h) => { q.fillStyle = '#ffffff'; q.fillRect(0, 0, w, h); txt(q, 'ICE', w / 2, 80, 90, '#2a6ac8'); txt(q, '$2.49', w / 2, 160, 50, '#1c2a44'); })), 1.75, 2.35, 0.02, k, nocast);
      const ic = grp(k, -2.0, 0, 0.9); add(tbox(1.4, 1.0, 0.7, 0.4), M.white, 0, 0.5, 0, ic); add(new THREE.PlaneGeometry(1.2, 0.35), signM(signTex('ICE', 300, 90, '#2a6ac8', '#ffffff', 70)), 0, 0.62, 0.36, ic, nocast);  // ice chest
      const pc = grp(k, 3.6, 0, 0.6); add(tbox(1.0, 1.6, 0.6, 0.4), M.steelD, 0, 0.8, 0, pc); for (const y of [0.35, 1.1]) for (const x of [-0.25, 0.25]) add(cyl(0.14, 0.14, 0.6, 10), toon({ color: '#d8d8d8' }), x, y, 0, pc);  // propane cage
      const tr = grp(k, -3.6, 0, 0.6); add(cyl(0.28, 0.28, 0.9, 12), toon({ color: '#3a5a3a' }), 0, 0.45, 0, tr); }
    add(new THREE.PlaneGeometry(5.6, 0.62), emisC(signTex('24 HR  GAS  \u2022  SNACKS', 1600, 177, '#c8322e', '#ffffff', 110)), 0, 3.4, 0.11, k, nocast);
    { const pg = grp(gs, 7.5, 0, 6); add(cyl(0.1, 0.1, 6, 8), M.steelD, 0, 3, 0, pg); add(tbox(2.2, 1.6, 0.2, 0.5), M.white, 0, 6.3, 0, pg); add(new THREE.PlaneGeometry(2.0, 1.4), emisC(cv(400, 280, (q, w, h) => { q.fillStyle = '#1c2a44'; q.fillRect(0, 0, w, h); txt(q, 'GAS', w / 2, 70, 80, '#ffffff'); txt(q, '3.29', w / 2, 190, 110, '#f2c23a'); })), 0, 6.3, 0.11, pg, nocast); }
  }
  // street dressing: lamps, trees in planters, benches, hydrant, parked cars, distant buildings
  for (let x = -60; x <= 60; x += 12) { streetLamp(g, x, 7.6, 0); streetLamp(g, x + 6, 16.4, Math.PI); }
  for (const x of [-30, -9, 30, 40, 52]) { add(tbox(1.2, 0.4, 1.2, 0.5), M.concreteD, x, 0.2, 6.6, g); tree(x + O[0], 6.6, 6, (x / 3 + 9) % 5 | 0); }
  for (const x of [-24.5, 34]) { const b = grp(g, x, 0, 6.8); add(tbox(1.6, 0.06, 0.45, 0.3), M.oak, 0, 0.45, 0, b); add(tbox(1.6, 0.4, 0.06, 0.3), M.oak, 0, 0.75, -0.2, b); for (const s of [-1, 1]) add(tbox(0.06, 0.45, 0.45, 0.3), M.steelD, s * 0.75, 0.22, 0, b); }
  { const h = grp(g, 9, 0, 7.0); add(cyl(0.12, 0.14, 0.6, 12), M.red, 0, 0.3, 0, h); add(new THREE.SphereGeometry(0.12, 10, 8), M.red, 0, 0.62, 0, h); }
  MS.cars = [car(g, -30, 9.6, Math.PI / 2, '#3a6a8a'), car(g, -8, 9.6, Math.PI / 2, '#d8d4c8', 'pickup'), car(g, 38, 9.6, Math.PI / 2, '#8a3a3a'), car(g, 30, 14.4, -Math.PI / 2, '#4a4a52')];
  MS.moveTruck = car(g, 22, 9.6, Math.PI / 2, '#e8e4d8', 'pickup'); MS.buyerCar = car(g, 14.5, 9.6, Math.PI / 2, '#1a1c22');
  for (let i = 0; i < 10; i++) { const x = -110 + i * 24; if (Math.abs(x) < 70) continue; facade(x, 14, 5 + (i % 3), [M.brick, M.sidingC, M.sidingE][i % 3], 0, 4.5, 9); }
  for (let i = 0; i < 16; i++) tree(O[0] - 100 + i * 14 + R() * 6, -28 - R() * 14, 10 + R() * 5, i % 5);
  for (let i = 0; i < 10; i++) tree(O[0] - 90 + i * 20 + R() * 6, 40 + R() * 14, 10 + R() * 5, i % 5);
  for (const [x, z, s] of [[-60, -150, 80], [80, -130, 70], [-150, 40, 70]]) cloudCard(g, x, 70 + s * 0.3, z, s);
}
// plant every tree / bush list now (instanced)
TREES.forEach((L, k) => { if (L.length) qinst(TV[k], L); }); if (BUSH.length) qinst(BV, BUSH); if (BUSHF.length) qinst(BVF, BUSHF);
