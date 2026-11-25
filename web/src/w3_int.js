
// ---------- interior room builder: inward-facing walls (never cast), optional skip of walls ----------
const room = (parent, O, w, d, h, wallM, floorM, ceilM, skip = {}) => { const g = grp(parent, O[0], 0, O[2]);
  add(new THREE.PlaneGeometry(w, d).rotateX(-Math.PI / 2), floorM, 0, 0, 0, g, nocast); if (ceilM) add(new THREE.PlaneGeometry(w, d).rotateX(Math.PI / 2), ceilM, 0, h, 0, g, nocast);
  const wl = (k, W, x, z, ry) => { if (skip[k] || !wallM) return null; const m = add(new THREE.PlaneGeometry(W, h), wallM, x, h / 2, z, g, nocast); m.rotation.y = ry; return m; };
  g.userData.walls = { n: wl('n', w, 0, -d / 2, 0), s: wl('s', w, 0, d / 2, Math.PI), w: wl('w', d, -w / 2, 0, Math.PI / 2), e: wl('e', d, w / 2, 0, -Math.PI / 2) }; return g; };
const pictureFrame = (parent, x, y, z, ry, w, h, draw, frameM = M.oak) => { const g = grp(parent, x, y, z, ry); add(tbox(w + 0.06, h + 0.06, 0.03, 0.3), frameM, 0, 0, 0, g, nocast); add(new THREE.PlaneGeometry(w, h), signM(cv(256, Math.round(256 * h / w), draw)), 0, 0, 0.017, g, nocast); return g; };
const kidDrawing = (seed) => (q, w, h) => { q.fillStyle = '#fbf8f0'; q.fillRect(0, 0, w, h); const r = P.rng(seed); q.lineWidth = 6; q.lineCap = 'round';
  q.strokeStyle = '#3a7ad8'; q.beginPath(); q.moveTo(20, h * 0.75); q.lineTo(w - 20, h * 0.75); q.stroke(); q.fillStyle = '#f2c23a'; q.beginPath(); q.arc(w * 0.8, h * 0.22, 26, 0, 6.28); q.fill();
  q.strokeStyle = '#d8443c'; q.strokeRect(w * 0.2, h * 0.4, w * 0.3, h * 0.35); q.beginPath(); q.moveTo(w * 0.17, h * 0.42); q.lineTo(w * 0.35, h * 0.22); q.lineTo(w * 0.53, h * 0.42); q.stroke();
  q.strokeStyle = '#2a2a30'; for (let k = 0; k < 3; k++) { const x = w * (0.6 + k * 0.1); q.beginPath(); q.arc(x, h * 0.5, 9, 0, 6.28); q.moveTo(x, h * 0.55); q.lineTo(x, h * 0.68); q.stroke(); } };

// =====================================================================================
// KITCHEN (KIT): 6 x 5 x 2.6. Back wall z=-2.5: counters, sink under the window, fridge; west wall x=-3: open shelf with the pickle jar + calendar; east: hallway door.
// =====================================================================================
const KS = {};
{ const O = KIT, g = room(world, O, 6, 5, 2.6, M.wallpaper, M.kitFloor, texM(plasterT('#f4efe4'), 3, 3)); KS.g = g;
  for (const [x, z, w, ry] of [[0, -2.49, 6, 0], [-2.99, 0, 5, Math.PI / 2], [2.99, 0, 5, -Math.PI / 2], [0, 2.49, 6, Math.PI]]) { const wg = grp(g, x, 0, z, ry); add(tbox(w, 0.95, 0.02, 0.6), toon({ color: '#d8ccb0', roughness: 0.6 }), 0, 0.475, 0, wg, nocast); add(tbox(w, 0.05, 0.04, 0.5), M.trim, 0, 0.96, 0.01, wg, nocast); add(tbox(w, 0.12, 0.03, 0.5), M.trim, 0, 0.06, 0.01, wg, nocast); for (let i = 0; i < w / 0.12; i++) add(box(0.01, 0.9, 0.012), toon({ color: '#c8bca0' }), -w / 2 + i * 0.12, 0.47, 0.012, wg, nocast); }
  // window over the sink (outside view = dynamic panel: night yard / day yard)
  { const wg = grp(g, -0.3, 1.55, -2.48); add(tbox(1.3, 1.1, 0.06, 0.3), M.trim, 0, 0, 0, wg, nocast); KS.outD = dynTex(512, 420, true); add(new THREE.PlaneGeometry(1.16, 0.96), KS.outD.m, 0, 0, -0.02, wg, nocast).userData.flatNd = true;
    add(box(1.16, 0.035, 0.03), M.trim, 0, 0, 0.03, wg, nocast); add(box(0.035, 0.96, 0.03), M.trim, 0, 0, 0.03, wg, nocast); add(tbox(1.5, 0.05, 0.18, 0.3), M.trim, 0, -0.58, 0.07, wg);
    for (const s of [-1, 1]) add(tbox(0.36, 1.2, 0.02, 0.3), texM(fabricT('#f4f0e4', '#d84a3a'), 1, 2), s * 0.78, 0.05, 0.06, wg, nocast); add(cyl(0.012, 0.012, 1.9, 6).rotateZ(Math.PI / 2), M.brass, 0, 0.68, 0.07, wg, nocast);
    add(cyl(0.06, 0.05, 0.1, 10), toon({ color: '#c8643a' }), 0.35, -0.5, 0.1, wg); add(new THREE.SphereGeometry(0.08, 8, 6), M.leafHedge, 0.35, -0.4, 0.1, wg); }
  // counters + cabinets along the back wall
  { const cg = grp(g, -0.8, 0, -2.2); add(tbox(4.0, 0.88, 0.6, 0.5), M.cabinetB, 0, 0.44, 0, cg); add(tbox(4.06, 0.04, 0.64, 0.5), M.counter, 0, 0.9, 0.02, cg);
    const dl = []; for (let i = 0; i < 6; i++) { dl.push({ x: -1.67 + i * 0.67, y: 0.36, z: 0.305 }); } instP(new THREE.BoxGeometry(0.62, 0.62, 0.02), toon({ color: '#7f9fae', roughness: 0.5 }), dl, cg); instP(new THREE.BoxGeometry(0.1, 0.02, 0.025), M.brass, dl.map((d) => ({ x: d.x, y: 0.74, z: 0.32 })), cg);
    for (let i = 0; i < 6; i++) add(box(0.62, 0.14, 0.02), toon({ color: '#7f9fae' }), -1.67 + i * 0.67, 0.79, 0.305, cg, nocast);
    add(tbox(0.7, 0.04, 0.45, 0.3), M.steel, 0.5, 0.915, 0.0, cg); add(cyl(0.012, 0.012, 0.3, 6), M.chrome, 0.5, 1.08, -0.2, cg); add(cyl(0.012, 0.012, 0.18, 6).rotateX(Math.PI / 2), M.chrome, 0.5, 1.22, -0.12, cg); // sink + tap
    for (const x of [-1.45, 1.6]) { add(tbox(0.9, 0.7, 0.34, 0.5), M.cabinetB, x, 1.95, -0.13, cg); add(box(0.02, 0.6, 0.02), M.trim, x, 1.95, 0.05, cg); }
    // toaster, kettle, dish rack, canisters, fruit bowl
    KS.toaster = grp(cg, -0.6, 0.92, 0.0); add(tbox(0.28, 0.18, 0.16, 0.2), M.chrome, 0, 0.09, 0, KS.toaster); for (const x of [-0.05, 0.05]) add(box(0.03, 0.01, 0.12), M.black, x, 0.185, 0, KS.toaster); add(box(0.02, 0.04, 0.02), M.black, 0.15, 0.1, 0, KS.toaster);
    add(cyl(0.08, 0.1, 0.2, 16), M.red, -1.1, 1.02, 0.0, cg); add(cyl(0.02, 0.02, 0.1, 8).rotateZ(1), M.red, -1.0, 1.06, 0, cg);
    for (let i = 0; i < 3; i++) add(cyl(0.06, 0.06, 0.18 - i * 0.03, 14), toon({ color: ['#e8e0c8', '#c8d8e0', '#e8c8b8'][i] }), -1.8 + i * 0.15, 1.0 - i * 0.015, -0.1, cg);
    add(cyl(0.16, 0.1, 0.08, 18), M.white, 1.4, 0.96, 0.05, cg); for (let i = 0; i < 4; i++) add(new THREE.SphereGeometry(0.045, 10, 8), toon({ color: ['#d8443c', '#e8b830', '#6aa83a', '#d8443c'][i] }), 1.36 + (i % 2) * 0.08, 1.02 + (i > 1 ? 0.05 : 0), 0.02 + (i % 3) * 0.04, cg);
    // stove
    const st = grp(cg, 1.0, 0, 0.0); add(tbox(0.76, 0.9, 0.62, 0.5), M.white, 0, 0.45, 0.0, st); add(box(0.6, 0.4, 0.02), M.black, 0, 0.4, 0.315, st); for (const [x, z] of [[-0.18, -0.12], [0.18, -0.12], [-0.18, 0.14], [0.18, 0.14]]) add(cyl(0.09, 0.09, 0.012, 16), M.black, x, 0.91, z, st); add(cyl(0.11, 0.11, 0.1, 18), M.steel, 0.18, 0.97, -0.12, st);
    for (let k = 0; k < 4; k++) add(cyl(0.02, 0.02, 0.02, 8).rotateX(Math.PI / 2), M.black, -0.26 + k * 0.17, 0.82, 0.32, st);
  }
  // fridge with magnets + kid drawings
  { const fg = grp(g, 2.25, 0, -2.08); add(tbox(0.82, 1.8, 0.7, 0.5), M.fridge, 0, 0.9, 0, fg); add(box(0.8, 0.012, 0.02), M.dark, 0, 1.2, 0.355, fg, nocast); add(box(0.03, 0.4, 0.04), M.chrome, -0.33, 1.45, 0.37, fg, nocast); add(box(0.03, 0.5, 0.04), M.chrome, -0.33, 0.75, 0.37, fg, nocast);
    for (let i = 0; i < 9; i++) add(box(0.05, 0.05, 0.015), toon({ color: MOWCOL[i % 10] }), -0.2 + (i % 3) * 0.18, 1.35 + Math.floor(i / 3) * 0.14, 0.36, fg, nocast);
    pictureFrame(fg, 0.12, 1.5, 0.355, 0, 0.24, 0.32, kidDrawing(3), M.white); pictureFrame(fg, -0.08, 0.95, 0.355, 0.05, 0.22, 0.28, kidDrawing(8), M.white); }
  // west wall: open shelf with jars, cans, cookbooks; the pickle jar sits at its right end; calendar further along
  { const sg = grp(g, -2.86, 0, 0); for (const y of [1.55, 1.95]) { add(tbox(0.26, 0.03, 1.4, 0.3), M.oak, 0, y, -0.6, sg); for (const z of [-1.2, 0.0]) add(box(0.2, 0.04, 0.04), M.brass, -0.02, y - 0.05, z, sg, nocast); }
    for (let i = 0; i < 5; i++) add(tbox(0.18, 0.24 + (i % 2) * 0.04, 0.05, 0.2), toon({ color: ['#8a3a2a', '#2a4a7a', '#3a6a3a', '#c8a038', '#6a3a6a'][i] }), 0, 1.97 + 0.12 + (i % 2) * 0.02, -1.15 + i * 0.06, sg);
    for (let i = 0; i < 4; i++) add(cyl(0.045, 0.045, 0.12, 12), toon({ color: ['#c8322e', '#e8b830', '#e8e0c8', '#2f8a4a'][i] }), 0, 1.63, -1.2 + i * 0.12, sg);
    add(cyl(0.07, 0.07, 0.14, 14), M.glass, 0, 1.64, -0.6, sg).userData.ndSkip = true; add(cyl(0.065, 0.065, 0.08, 12), toon({ color: '#d8a868' }), 0, 1.61, -0.6, sg);
    KS.cal = add(new THREE.PlaneGeometry(0.5, 0.66), (KS.calD = dynTex(500, 660)).m, -2.97, 1.5, 0.9, g, nocast); KS.cal.rotation.y = Math.PI / 2;
    add(box(0.02, 0.02, 0.02), M.black, -2.98, 1.85, 0.9, g, nocast); }
  // east wall: hallway door (dark opening + frame), coat hooks, light switch, framed family photos
  { const eg = grp(g, 2.98, 0, 0.9, -Math.PI / 2); add(tbox(1.05, 2.15, 0.06, 0.3), M.trim, 0, 1.075, 0, eg, nocast); add(new THREE.PlaneGeometry(0.9, 2.05), glowM('#2a2620'), 0, 1.025, 0.031, eg, nocast);
    KS.hallDoor = grp(eg, -0.45, 0, 0.04); add(tbox(0.88, 2.04, 0.04, 0.3), M.cream, 0.44, 1.02, 0, KS.hallDoor, nocast); add(new THREE.SphereGeometry(0.03, 8, 6), M.brass, 0.8, 1.0, 0.03, KS.hallDoor, nocast);
    for (let i = 0; i < 3; i++) pictureFrame(eg, 1.25 + (i % 2) * 0.45, 1.55 + (i > 1 ? 0.45 : 0), 0.03, 0, 0.3, 0.24, (q, w, h) => { q.fillStyle = ['#a8c8e0', '#e8c8a8', '#c8e0b8'][i]; q.fillRect(0, 0, w, h); for (let k = 0; k < 2 + i; k++) { q.fillStyle = '#f0c8a4'; q.beginPath(); q.arc(50 + k * 55, h * 0.45, 18, 0, 6.28); q.fill(); q.fillStyle = ['#3d7fd0', '#2a9a92', '#d9a326', '#4f7a4a'][k % 4]; q.fillRect(32 + k * 55, h * 0.6, 36, 60); } });
    for (let i = 0; i < 3; i++) add(cyl(0.012, 0.012, 0.08, 6).rotateX(Math.PI / 2), M.brass, -1.0 + i * 0.15, 1.65, 0.05, eg, nocast); add(box(0.08, 0.12, 0.01), M.white, 0.75, 1.25, 0.03, eg, nocast); }
  // table + chairs + pendant lamp (dynamic items are placed on the table by worldState)
  { const tg = grp(g, 0, 0, 0.1); KS.table = tg; add(tbox(1.5, 0.05, 0.95, 0.5), M.oak, 0, 0.74, 0, tg); for (const [x, z] of [[-0.68, -0.4], [0.68, -0.4], [-0.68, 0.4], [0.68, 0.4]]) add(box(0.06, 0.72, 0.06), M.oak, x, 0.36, z, tg);
    add(tbox(1.38, 0.1, 0.03, 0.3), M.oak, 0, 0.66, 0.44, tg); add(tbox(1.38, 0.1, 0.03, 0.3), M.oak, 0, 0.66, -0.44, tg);
    add(new THREE.PlaneGeometry(0.9, 0.5).rotateX(-Math.PI / 2), texM(fabricT('#f4f0e4', '#c84a3a'), 3, 2), 0, 0.768, 0, tg, nocast); // runner
    const chair = (x, z, ry) => { const c = grp(tg, x, 0, z, ry); add(tbox(0.44, 0.04, 0.42, 0.3), M.oak, 0, 0.46, 0, c); for (const [a, b] of [[-0.19, -0.18], [0.19, -0.18], [-0.19, 0.18], [0.19, 0.18]]) add(box(0.035, 0.46, 0.035), M.oak, a, 0.23, b, c); for (const a of [-0.19, 0.19]) add(box(0.035, 0.5, 0.035), M.oak, a, 0.73, -0.19, c); for (let k = 0; k < 3; k++) add(box(0.38, 0.05, 0.02), M.oak, 0, 0.62 + k * 0.14, -0.19, c); return c; };
    KS.chairs = [chair(0, -0.68, 0), chair(0, 0.72, Math.PI), chair(-1.0, 0, Math.PI / 2), chair(1.0, 0, -Math.PI / 2)];
    add(cyl(0.004, 0.004, 0.7, 4), M.black, 0, 2.25, 0, tg, nocast); add(new THREE.ConeGeometry(0.22, 0.2, 24, 1, true), toon({ color: '#2f5a4a', side: THREE.DoubleSide, roughness: 0.5 }), 0, 1.86, 0, tg, nocast); KS.bulb = add(new THREE.SphereGeometry(0.05, 12, 8), glowM('#fff0c0'), 0, 1.78, 0, tg, nocast);
    add(cyl(0.05, 0.05, 0.12, 12), M.white, 0.45, 0.83, -0.25, tg); add(box(0.1, 0.08, 0.05), M.steel, -0.5, 0.81, -0.28, tg); }
  // dynamic table items (local to the table group): letter, jar, cash piles, tip stacks, bills, toaster parts, notebook, laptop, envelope
  { const tg = KS.table; const T_ = (KS.items = {});
    T_.letter = add(new THREE.PlaneGeometry(0.21, 0.28).rotateX(-Math.PI / 2), (KS.letterD = dynTex(420, 560)).m, 0.15, 0.772, 0.05, tg, nocast); T_.letter.rotation.y = 0.2;
    // pickle jar (hero): glass, cash inside (scaled by fill), gold lid with label (dynamic)
    const jar = (KS.jar = grp(KS.g, -0.25, 0.768, 0.1)); add(cyl(0.075, 0.075, 0.22, 24), toon({ color: '#d8f0e4', roughness: 0.05, transparent: true, opacity: 0.35, depthWrite: false, specularIntensity: 1.4 }), 0, 0.11, 0, jar, nocast).userData.ndSkip = false;
    KS.jarCash = add(cyl(0.066, 0.066, 0.2, 18), texM(cv(256, 128, (q, w, h) => { q.fillStyle = '#8ab868'; q.fillRect(0, 0, w, h); for (let i = 0; i < 40; i++) { q.fillStyle = R() < 0.5 ? '#6a9a4a' : '#b8d898'; q.save(); q.translate(R() * w, R() * h); q.rotate(R() * 3); q.fillRect(-14, -6, 28, 12); q.restore(); } }), 1, 1), 0, 0.1, 0, jar, nocast);
    add(cyl(0.077, 0.077, 0.03, 24), M.brass, 0, 0.235, 0, jar); KS.jarLid = add(new THREE.CircleGeometry(0.07, 24).rotateX(-Math.PI / 2), (KS.jarLidD = dynTex(256, 256)).m, 0, 0.2515, 0, jar, nocast);
    add(new THREE.CylinderGeometry(0.0755, 0.0755, 0.07, 24, 1, true), signM(cv(512, 96, (q, w, h) => { q.fillStyle = '#e8dcb0'; q.fillRect(0, 0, w, h); txt(q, 'DILL PICKLES', w * 0.75, h / 2, 40, '#3a6a3a', 'Georgia, serif', 900); q.fillStyle = '#3a6a3a'; q.fillRect(0, 4, w, 4); q.fillRect(0, h - 8, w, 4); }), { transparent: false }), 0, 0.09, 0, jar, nocast);
    KS.envOpen = add(new THREE.PlaneGeometry(0.1, 0.07), signM(cv(200, 140, (q, w, h) => { q.fillStyle = '#e8dcc0'; q.fillRect(0, 0, w, h); q.strokeStyle = '#8a7a5a'; q.lineWidth = 3; q.beginPath(); q.moveTo(0, 0); q.lineTo(w / 2, h * 0.55); q.lineTo(w, 0); q.stroke(); txt(q, 'FILM SCHOOL', w / 2, h * 0.8, 18, '#2a4a8a'); })), 0, 0.2, 0, jar, nocast); KS.envOpen.rotation.x = -Math.PI / 2;
    T_.cash = grp(tg, 0.15, 0.768, 0.12); { const L = []; const rn = P.rng(31); for (let i = 0; i < 60; i++) L.push({ x: (rn() - 0.5) * 0.5, y: 0.004 + rn() * 0.04, z: (rn() - 0.5) * 0.32, ry: rn() * 3, rx: (rn() - 0.5) * 0.15 }); instP(new THREE.BoxGeometry(0.156, 0.003, 0.066), texM(cv(128, 56, (q, w, h) => { q.fillStyle = '#a8c890'; q.fillRect(0, 0, w, h); q.strokeStyle = '#5a7a4a'; q.lineWidth = 3; q.strokeRect(4, 4, w - 8, h - 8); q.fillStyle = '#6a8a5a'; q.beginPath(); q.ellipse(w / 2, h / 2, 12, 16, 0, 0, 6.28); q.fill(); })), L, T_.cash); }
    T_.coins = grp(tg, 0.4, 0.768, -0.2); { const L = []; const rn = P.rng(32); for (let i = 0; i < 26; i++) L.push({ x: (rn() - 0.5) * 0.18, y: 0.002 + (i % 6) * 0.002, z: (rn() - 0.5) * 0.12, col: rn() < 0.6 ? '#c8c8cc' : '#c8925a' }); instP(cyl(0.012, 0.012, 0.002, 12), toon({ color: '#ffffff', metalness: 0.7, roughness: 0.3 }), L, T_.coins); }
    T_.tips = grp(tg, 0.25, 0.768, 0.05); { const L = []; for (let s = 0; s < 4; s++) for (let k = 0; k < 6 + s * 2; k++) L.push({ x: -0.2 + s * 0.13, y: 0.003 + k * 0.003, z: 0, ry: (k % 3 - 1) * 0.08 }); instP(new THREE.BoxGeometry(0.156, 0.003, 0.066), texM(cv(128, 56, (q, w, h) => { q.fillStyle = '#a8c890'; q.fillRect(0, 0, w, h); q.strokeStyle = '#5a7a4a'; q.lineWidth = 3; q.strokeRect(4, 4, w - 8, h - 8); })), L.map((o) => ({ ...o, ry: o.ry + Math.PI / 2 })), T_.tips); }
    T_.bills = grp(tg, -0.05, 0.768, -0.15); for (let i = 0; i < 6; i++) { const e = add(new THREE.PlaneGeometry(0.22, 0.11).rotateX(-Math.PI / 2), signM(cv(220, 110, (q, w, h) => { q.fillStyle = '#fbf8f0'; q.fillRect(0, 0, w, h); q.fillStyle = i % 2 ? '#c8322e' : '#2a4a8a'; q.fillRect(0, 0, w, 16); txt(q, ['PAST DUE', 'FINAL NOTICE', 'ELECTRIC', 'GAS BILL', 'WATER', 'PAST DUE'][i], w / 2, h / 2 + 8, 22, i % 2 ? '#c8322e' : '#1b2a44'); })), (i % 3 - 1) * 0.12, 0.002 + i * 0.002, (i > 2 ? 0.1 : 0), T_.bills, nocast); e.rotation.y = (i - 2.5) * 0.25; }
    T_.toaster = grp(tg, 0.2, 0.768, 0.0); { add(tbox(0.28, 0.02, 0.16, 0.2), M.chrome, 0, 0.01, 0, T_.toaster); add(tbox(0.28, 0.16, 0.02, 0.2), M.chrome, 0.05, 0.05, -0.2, T_.toaster).rotation.x = -1.4; for (let i = 0; i < 8; i++) add(box(0.04 + (i % 3) * 0.02, 0.012, 0.02), [M.steel, M.copper || M.brass, M.black][i % 3], -0.2 + (i % 4) * 0.13, 0.008, 0.12 + Math.floor(i / 4) * 0.08, T_.toaster); add(cyl(0.004, 0.004, 0.25, 6).rotateZ(1.2), M.copper || M.brass, 0.15, 0.01, 0.18, T_.toaster); }
    T_.notebook = grp(tg, -0.35, 0.768, 0.12); add(tbox(0.22, 0.012, 0.3, 0.2), M.paper, 0, 0.006, 0, T_.notebook); add(tbox(0.22, 0.013, 0.012, 0.2), M.blue, 0, 0.007, -0.15, T_.notebook);
    T_.laptop = grp(tg, 0.05, 0.768, -0.1); add(tbox(0.34, 0.015, 0.23, 0.2), M.steelD, 0, 0.008, 0, T_.laptop); const lid = grp(T_.laptop, 0, 0.015, -0.115); lid.rotation.x = -0.3; add(tbox(0.34, 0.22, 0.01, 0.2), M.steelD, 0, 0.11, 0, lid); KS.lapD = dynTex(340, 220, true); add(new THREE.PlaneGeometry(0.31, 0.19), KS.lapD.m, 0, 0.11, 0.006, lid, nocast);
    T_.envelope = add(new THREE.PlaneGeometry(0.24, 0.16).rotateX(-Math.PI / 2), signM(cv(240, 160, (q, w, h) => { q.fillStyle = '#e8dcc0'; q.fillRect(0, 0, w, h); q.strokeStyle = '#8a7a5a'; q.lineWidth = 3; q.beginPath(); q.moveTo(0, 0); q.lineTo(w / 2, h * 0.55); q.lineTo(w, 0); q.stroke(); q.fillStyle = '#2a4a8a'; q.fillRect(0, h - 18, w, 8); txt(q, 'SCHOOL OF FILM', w * 0.6, h * 0.72, 16, '#2a4a8a', 'Georgia, serif', 700); })), -0.1, 0.772, 0.2, tg, nocast); T_.envelope.rotation.y = -0.3;
    T_.cake = grp(tg, -0.05, 0.768, 0.15); add(cyl(0.035, 0.028, 0.04, 16), toon({ color: '#c8a06a' }), 0, 0.02, 0, T_.cake); add(new THREE.SphereGeometry(0.038, 14, 10, 0, 6.3, 0, 1.6), toon({ color: '#f4d0dc' }), 0, 0.04, 0, T_.cake); add(cyl(0.004, 0.004, 0.05, 6), toon({ color: '#5ab8e8' }), 0, 0.09, 0, T_.cake); KS.flame = add(new THREE.SphereGeometry(0.008, 8, 6), glowM('#ffd060'), 0, 0.122, 0, T_.cake, nocast); KS.flame.scale.y = 1.8;
    T_.mug = grp(tg, 0.55, 0.768, 0.2); add(cyl(0.04, 0.035, 0.1, 14), M.white, 0, 0.05, 0, T_.mug); add(new THREE.TorusGeometry(0.025, 0.007, 6, 12), M.white, 0.045, 0.05, 0, T_.mug);
  }
}

// =====================================================================================
// GARAGE WORKSHOP (GAR): 6 x 7 x 2.8. Workbench at back (z=-3.5) under pegboard; shelves west; whiteboard east; roll-up door front (z=+3.5).
// =====================================================================================
const GS = {};
{ const O = GAR, blockT = texM(cv(256, 256, (q, w, h) => { q.fillStyle = '#c8c4b8'; q.fillRect(0, 0, w, h); q.fillStyle = '#a8a498'; for (let r = 0; r < 8; r++) { q.fillRect(0, r * 32, w, 3); for (let c = 0; c < 4; c++) q.fillRect(c * 64 + (r % 2) * 32, r * 32, 3, 32); } noise(q, w, h, 0.12, 4000); }), 3, 2, { roughness: 0.95 });
  const g = room(world, O, 6, 7, 2.8, blockT, texM(concreteT('#a8a49c'), 4, 5, { roughness: 0.85 }), texM(cv(128, 128, (q, w, h) => { q.fillStyle = '#c8b898'; q.fillRect(0, 0, w, h); q.fillStyle = '#a89878'; for (let i = 0; i < w; i += 32) q.fillRect(i, 0, 2, h); }), 4, 4), { s: true }); GS.g = g;
  // oil stains on the floor
  for (let i = 0; i < 6; i++) { const m = add(new THREE.CircleGeometry(0.2 + R() * 0.35, 20).rotateX(-Math.PI / 2), toon({ color: '#5a564c', transparent: true, opacity: 0.45, depthWrite: false }), -2 + R() * 4, 0.004, -2.5 + R() * 4.5, g, nocast); m.userData.ndSkip = true; }
  // rafters
  for (let z = -3; z <= 3; z += 1.2) add(tbox(6, 0.18, 0.06, 0.5), M.wood, 0, 2.7, z, g, nocast);
  // front wall with the roll-up door (open = daylight panel outside)
  { const fw = grp(g, 0, 0, 3.5, Math.PI); for (const s of [-1, 1]) add(new THREE.PlaneGeometry(1.6, 2.8), blockT, s * 2.2, 1.4, 0, fw, nocast); add(new THREE.PlaneGeometry(2.8, 0.45), blockT, 0, 2.575, 0, fw, nocast);
    GS.outD = dynTex(1024, 820, true); const op = add(new THREE.PlaneGeometry(2.8, 2.35), GS.outD.m, 0, 1.175, 0.4, fw, nocast); op.rotation.y = Math.PI; op.userData.flatNd = true;
    GS.door = grp(fw, 0, 0, -0.03); for (let k = 0; k < 6; k++) add(tbox(2.8, 0.38, 0.05, 0.5), toon({ color: '#d8d2c4', roughness: 0.6 }), 0, 0.2 + k * 0.39, 0, GS.door, nocast); }
  // workbench + vise + pegboard with tools + shelf above
  { const wb = grp(g, 0, 0, -3.1); add(tbox(3.2, 0.07, 0.75, 0.5), M.oak, 0, 0.9, 0, wb); for (const x of [-1.5, 1.5]) for (const z of [-0.32, 0.32]) add(box(0.08, 0.88, 0.08), M.wood, x, 0.44, z, wb); add(tbox(3.1, 0.04, 0.7, 0.5), M.wood, 0, 0.25, 0, wb);
    add(tbox(0.18, 0.12, 0.12, 0.2), M.blue, -1.35, 1.0, 0.25, wb); add(box(0.02, 0.06, 0.18), M.steel, -1.35, 1.08, 0.25, wb);
    add(new THREE.PlaneGeometry(3.2, 1.1), signM(cv(1024, 352, (q, w, h) => { q.drawImage(pegT, 0, 0, w, h); q.lineCap = 'round'; const tool = (x, y, L, wd, col, head) => { q.strokeStyle = col; q.lineWidth = wd; q.beginPath(); q.moveTo(x, y); q.lineTo(x, y + L); q.stroke(); if (head) { q.fillStyle = col; q.beginPath(); q.arc(x, y, wd * 1.5, 0, 6.28); q.fill(); } };
      for (let i = 0; i < 8; i++) tool(60 + i * 26, 40 + i * 4, 120 + i * 10, 10, '#9aa4ae', true); for (let i = 0; i < 6; i++) tool(330 + i * 30, 50, 130, 12, ['#c8322e', '#e8b830', '#2f5aa8'][i % 3], false);
      q.fillStyle = '#5a3a22'; q.fillRect(560, 60, 22, 160); q.fillStyle = '#9aa4ae'; q.fillRect(530, 50, 82, 30); q.fillStyle = '#c8a060'; q.fillRect(660, 80, 30, 180); q.fillStyle = '#b8c0c8'; q.beginPath(); q.moveTo(690, 70); q.lineTo(860, 70); q.lineTo(860, 120); q.lineTo(690, 160); q.fill();
      for (let i = 0; i < 5; i++) { q.strokeStyle = '#2a2a30'; q.lineWidth = 6; q.beginPath(); q.arc(910 + (i % 2) * 40, 80 + i * 50, 18, 0, 6.28); q.stroke(); } })), 0, 1.65, -0.38, wb, nocast);
    add(tbox(3.2, 0.03, 0.3, 0.5), M.wood, 0, 2.3, -0.22, wb); for (let i = 0; i < 9; i++) add(cyl(0.06, 0.06, 0.12 + (i % 3) * 0.04, 12), [M.oil, M.red, M.blue, M.green][i % 4], -1.4 + i * 0.35, 2.38 + (i % 3) * 0.02, -0.22, wb);
    // things on the bench: engine block, carb parts, spark plugs, rags, the phone on a stand (repair video)
    GS.engine = grp(wb, 0.6, 0.935, 0.05); add(tbox(0.26, 0.2, 0.24, 0.2), engM, 0, 0.1, 0, GS.engine); add(cyl(0.11, 0.12, 0.06, 18), M.red, 0, 0.23, 0, GS.engine); add(cyl(0.03, 0.03, 0.08, 10).rotateZ(Math.PI / 2), M.steel, 0.16, 0.08, 0.05, GS.engine);
    GS.carb = grp(wb, 0.05, 0.935, 0.15); add(tbox(0.08, 0.07, 0.08, 0.1), M.steel, 0, 0.035, 0, GS.carb); GS.bowl = add(cyl(0.035, 0.03, 0.04, 14), M.chrome, 0, -0.0, 0, GS.carb); add(cyl(0.01, 0.01, 0.06, 8).rotateZ(Math.PI / 2), M.steel, 0.06, 0.04, 0, GS.carb);
    for (let i = 0; i < 6; i++) add(cyl(0.008, 0.008, 0.06, 8).rotateZ(Math.PI / 2), i % 2 ? M.white : M.steel, -0.4 + i * 0.04, 0.945, 0.25, wb);
    add(tbox(0.3, 0.02, 0.2, 0.2), toon({ color: '#c8322e', roughness: 1 }), -0.6, 0.945, 0.1, wb).rotation.y = 0.4;
    GS.phone = grp(wb, -0.9, 0.935, 0.0, 0.35); add(tbox(0.06, 0.08, 0.06, 0.1), M.dark, 0, 0.04, 0, GS.phone); add(tbox(0.075, 0.15, 0.01, 0.1), M.black, 0, 0.14, 0.02, GS.phone).rotation.x = -0.2; GS.phoneD = dynTex(150, 300, true); const ps = add(new THREE.PlaneGeometry(0.066, 0.135), GS.phoneD.m, 0, 0.14, 0.027, GS.phone, nocast); ps.rotation.x = -0.2;
    // second bench (Day 70 shop has its own); here: tire stack + gas can + broom + extension cord reel
  }
  { add(cyl(0.3, 0.3, 0.2, 18), M.rubber, 2.4, 0.1, -2.6, g); add(cyl(0.3, 0.3, 0.2, 18), M.rubber, 2.4, 0.3, -2.6, g); add(tbox(0.3, 0.3, 0.2, 0.3), M.red, 2.4, 0.15, -1.9, g); add(cyl(0.015, 0.015, 1.4, 6), M.wood, -2.8, 0.7, 2.4, g).rotation.z = 0.15; add(cyl(0.18, 0.18, 0.12, 16).rotateX(Math.PI / 2), M.orange, 2.6, 0.2, 2.6, g); }
  // west shelves: oil cans, parts bins, spark plug boxes, spare blades
  { const sh = grp(g, -2.72, 0, -0.6); for (const x of [-1.2, 1.2]) for (const z of [-0.2, 0.2]) add(box(0.04, 2.0, 0.04), M.steelD, z, 1.0, x, sh); for (const y of [0.3, 0.8, 1.3, 1.8]) add(tbox(0.45, 0.03, 2.5, 0.5), M.metal, 0, y, 0, sh);
    for (let i = 0; i < 26; i++) { const y = [0.3, 0.8, 1.3, 1.8][i % 4], z = -1.1 + Math.floor(i / 4) * 0.36; if (i % 3 === 0) add(tbox(0.3, 0.16, 0.3, 0.3), toon({ color: ['#c8322e', '#2f5aa8', '#e8b830'][i % 3 === 0 ? (i / 3) % 3 : 0] }), 0, y + 0.1, z, sh); else add(cyl(0.06, 0.06, 0.18, 12), [M.oil, M.red, M.blue, M.green][i % 4], 0.05, y + 0.1, z, sh); } }
  // east wall: whiteboard (dynamic: schedule / waitlist / tallies), calendar, light switch
  { GS.board = add(new THREE.PlaneGeometry(1.4, 0.95), (GS.boardD = dynTex(840, 570)).m, 2.97, 1.5, -0.6, g, nocast); GS.board.rotation.y = -Math.PI / 2; add(tbox(1.48, 1.03, 0.03, 0.3), M.chrome, 2.985, 1.5, -0.6, g, nocast).rotation.y = -Math.PI / 2;
    add(tbox(0.04, 0.04, 1.3, 0.3), M.chrome, 2.95, 1.0, -0.6, g, nocast); for (let i = 0; i < 3; i++) add(cyl(0.008, 0.008, 0.1, 6).rotateX(Math.PI / 2), toon({ color: ['#1a1a22', '#c8322e', '#2f5aa8'][i] }), 2.92, 1.03, -0.9 + i * 0.08, g, nocast);
    GS.cal = add(new THREE.PlaneGeometry(0.46, 0.6), (GS.calD = dynTex(460, 600)).m, 2.97, 1.6, 1.0, g, nocast); GS.cal.rotation.y = -Math.PI / 2; }
  GS.photo = pictureFrame(g, 2.96, 1.55, 1.75, -Math.PI / 2, 0.42, 0.32, (q, w, h) => { const gr = q.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#d8c8a0'); gr.addColorStop(1, '#a8906a'); q.fillStyle = gr; q.fillRect(0, 0, w, h); q.fillStyle = '#6a5a3a'; q.fillRect(0, h * 0.72, w, h * 0.28);
    q.fillStyle = '#8a3a2a'; q.fillRect(w * 0.3, h * 0.42, w * 0.34, h * 0.22); q.fillRect(w * 0.55, h * 0.3, w * 0.12, h * 0.14); q.fillStyle = '#2a2420'; q.beginPath(); q.arc(w * 0.36, h * 0.68, h * 0.12, 0, 6.28); q.arc(w * 0.62, h * 0.7, h * 0.08, 0, 6.28); q.fill();
    q.fillStyle = '#e8c8a0'; q.beginPath(); q.arc(w * 0.18, h * 0.42, h * 0.07, 0, 6.28); q.fill(); q.fillStyle = '#4a6a4a'; q.fillRect(w * 0.14, h * 0.48, w * 0.08, h * 0.16); q.fillStyle = '#c8322e'; q.fillRect(w * 0.13, h * 0.34, w * 0.1, h * 0.04); q.strokeStyle = '#f4ecd8'; q.lineWidth = 8; q.strokeRect(4, 4, w - 8, h - 8); }, M.oak);
  GS.tag8 = add(new THREE.PlaneGeometry(0.06, 0.035).rotateX(-Math.PI / 2 + 0.3), signM(cv(120, 70, (q, w, h) => { q.fillStyle = '#f2e04a'; q.fillRect(0, 0, w, h); txt(q, '$8', w / 2, h / 2 + 2, 48, '#c8322e'); })), -0.31, 0.95, -2.8, g, nocast);
  // hanging bulb
  add(cyl(0.004, 0.004, 0.55, 4), M.black, 0, 2.52, -1.8, g, nocast); add(cyl(0.025, 0.025, 0.05, 8), M.black, 0, 2.23, -1.8, g, nocast); GS.bulb = add(new THREE.SphereGeometry(0.05, 12, 8), glowM('#fff0c0'), 0, 2.17, -1.8, g, nocast);
  // stool + floor mowers (hero + instanced extras)
  { const st = grp(g, -1.9, 0, -1.6); add(cyl(0.18, 0.18, 0.04, 16), M.red, 0, 0.66, 0, st); for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + 0.4; const l = add(cyl(0.015, 0.015, 0.7, 6), M.steelD, Math.cos(a) * 0.14, 0.33, Math.sin(a) * 0.14, st); l.rotation.set(Math.sin(a) * 0.15, 0, -Math.cos(a) * 0.15); } add(new THREE.TorusGeometry(0.15, 0.01, 6, 20).rotateX(Math.PI / 2), M.steelD, 0, 0.25, 0, st); }
  GS.hero = heroMower(g, '#c8322e'); GS.hero.position.set(...[0.25, 0, -1.4]); GS.hero.rotation.y = Math.PI * 0.85;
  mowerSet('garIn', [{ x: -1.6, y: 0, z: 0.6, ry: 0.5 }, { x: 1.9, y: 0, z: 0.3, ry: -0.6 }, { x: 1.4, y: 0, z: 1.8, ry: -0.2 }, { x: -1.9, y: 0, z: 1.9, ry: 0.3 }, { x: 0.2, y: 0, z: 2.3, ry: 0.1 }, { x: -0.8, y: 0, z: 1.2, ry: -0.3 }], false, g);
}

// =====================================================================================
// HOSPITAL ROOM (HOSP): 5 x 5 x 2.7. Bed against back wall, window (night city), wall clock, monitor, IV pole, curtain.
// =====================================================================================
const HSP = {};
{ const O = HOSP, g = room(world, O, 5, 5, 2.7, M.plasterG, texM(cv(256, 256, (q, w, h) => { q.fillStyle = '#d8d4c8'; q.fillRect(0, 0, w, h); noise(q, w, h, 0.2, 5000, '#b8b4a8', '#ece8dc'); q.fillStyle = '#c8c4b8'; for (let i = 0; i < w; i += 64) { q.fillRect(i, 0, 2, h); q.fillRect(0, i, w, 2); } }), 4, 4, { roughness: 0.3, clearcoat: 0.4 }), texM(plasterT('#eeeee8'), 3, 3)); HSP.g = g;
  add(tbox(5, 0.1, 0.03, 0.5), toon({ color: '#6aa0a8' }), 0, 0.9, -2.48, g, nocast); add(tbox(0.03, 0.1, 5, 0.5), toon({ color: '#6aa0a8' }), -2.48, 0.9, 0, g, nocast);
  // window with night town lights
  { const wg = grp(g, -1.2, 1.5, -2.48); add(tbox(1.5, 1.2, 0.06, 0.3), M.trim, 0, 0, 0, wg, nocast); add(new THREE.PlaneGeometry(1.38, 1.08), emisC(cv(512, 400, (q, w, h) => { const gr = q.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0c1630'); gr.addColorStop(1, '#2a3a6a'); q.fillStyle = gr; q.fillRect(0, 0, w, h); q.fillStyle = '#fff8e0'; for (let i = 0; i < 60; i++) q.fillRect(R() * w, R() * h * 0.5, 2, 2);
      q.fillStyle = '#141c34'; for (let i = 0; i < 9; i++) { const bw = 40 + R() * 40, bh = 60 + R() * 120; q.fillRect(i * 58, h - bh, bw, bh); } q.fillStyle = '#ffd890'; for (let i = 0; i < 50; i++) q.fillRect(R() * w, h - R() * 120, 5, 6); q.fillStyle = '#e8e8f0'; q.beginPath(); q.arc(w * 0.75, h * 0.2, 22, 0, 6.28); q.fill(); })), 0, 0, -0.02, wg, nocast).userData.flatNd = true;
    add(box(1.38, 0.035, 0.03), M.trim, 0, 0, 0.03, wg, nocast); add(box(0.035, 1.08, 0.03), M.trim, 0, 0, 0.03, wg, nocast); for (let k = 0; k < 10; k++) add(box(1.4, 0.012, 0.04), toon({ color: '#e8e8e4' }), 0, 0.55 - k * 0.025, 0.06, wg, nocast); }
  // bed
  { const bg = grp(g, 0.4, 0, -1.3); add(tbox(1.0, 0.1, 2.1, 0.5), M.steel, 0, 0.55, 0.2, bg); add(tbox(0.95, 0.18, 2.0, 0.5), M.bedding, 0, 0.68, 0.2, bg); const back = add(tbox(0.95, 0.12, 0.8, 0.5), M.bedding, 0, 0.9, -0.55, bg); back.rotation.x = 0.7;
    add(tbox(0.7, 0.14, 0.42, 0.3), M.white, 0, 1.12, -0.72, bg).rotation.x = 0.7; add(tbox(1.0, 0.06, 1.2, 0.5), toon({ color: '#9ac0d8', roughness: 1 }), 0, 0.8, 0.6, bg); add(tbox(1.04, 0.5, 0.05, 0.3), M.steel, 0, 0.85, -0.85, bg); add(tbox(1.04, 0.35, 0.05, 0.3), M.steel, 0, 0.75, 1.25, bg);
    for (const s of [-1, 1]) { add(tbox(0.03, 0.2, 0.9, 0.3), M.steel, s * 0.52, 0.85, 0.3, bg); for (const z of [-0.7, 1.1]) add(cyl(0.06, 0.06, 0.04, 12).rotateX(Math.PI / 2), M.rubber, s * 0.45, 0.08, z, bg); add(box(0.04, 0.5, 0.04), M.steel, s * 0.45, 0.3, -0.7, bg); add(box(0.04, 0.5, 0.04), M.steel, s * 0.45, 0.3, 1.1, bg); } }
  // clock (dynamic hands), monitor, IV pole, curtain rail, visitor chair, sink, bin
  HSP.clock = add(new THREE.CircleGeometry(0.17, 32), (HSP.clockD = dynTex(256, 256)).m, 1.2, 2.0, -2.47, g, nocast); add(new THREE.TorusGeometry(0.17, 0.015, 8, 32), M.black, 1.2, 2.0, -2.46, g, nocast);
  { const mg = grp(g, 1.35, 0, -2.0); add(cyl(0.03, 0.03, 1.4, 8), M.steel, 0, 0.7, 0, mg); add(tbox(0.36, 0.28, 0.12, 0.2), M.dark, 0, 1.5, 0, mg); add(new THREE.PlaneGeometry(0.3, 0.22), emisC(cv(300, 220, (q, w, h) => { q.fillStyle = '#081418'; q.fillRect(0, 0, w, h); q.strokeStyle = '#3aff8a'; q.lineWidth = 3; q.beginPath(); for (let x = 0; x < w; x++) { const k = (x % 75) / 75; q.lineTo(x, 70 - (k > 0.4 && k < 0.47 ? 40 * Math.sin((k - 0.4) / 0.07 * Math.PI) : 0)); } q.stroke(); txt(q, '72', w - 40, 150, 50, '#3aff8a'); txt(q, '98%', 60, 160, 34, '#5ad8ff'); })), 0, 1.5, 0.065, mg, nocast);
    add(cyl(0.25, 0.25, 0.03, 16), M.steel, 0, 0.02, 0, mg); }
  { const iv = grp(g, -0.55, 0, -1.9); add(cyl(0.015, 0.015, 2.0, 6), M.steel, 0, 1.0, 0, iv); add(new THREE.TorusGeometry(0.12, 0.01, 6, 16).rotateX(Math.PI / 2), M.steel, 0, 2.0, 0, iv); add(tbox(0.1, 0.16, 0.04, 0.1), toon({ color: '#e8f0f4', transparent: true, opacity: 0.7 }), 0.08, 1.85, 0, iv); add(cyl(0.2, 0.2, 0.02, 10), M.steel, 0, 0.02, 0, iv); }
  add(cyl(0.012, 0.012, 3.2, 6).rotateX(Math.PI / 2), M.chrome, -2.25, 2.55, -0.6, g, nocast); { const cu = add(new THREE.PlaneGeometry(1.2, 2.0, 12, 1), texM(cv(256, 128, (q, w, h) => { for (let i = 0; i < w; i += 16) { q.fillStyle = (i / 16) % 2 ? '#b8d0d8' : '#a8c4cc'; q.fillRect(i, 0, 16, h); } }), 3, 1, { side: THREE.DoubleSide }), -2.25, 1.5, 0.6, g, nocast); cu.rotation.y = Math.PI / 2; const p_ = cu.geometry.attributes.position; for (let i = 0; i < p_.count; i++) p_.setZ(i, 0.06 * Math.sin(p_.getX(i) * 12)); cu.geometry.computeVertexNormals(); }
  { const ch = grp(g, 1.5, 0, -0.3, -0.5); add(tbox(0.55, 0.12, 0.55, 0.3), M.cushion, 0, 0.45, 0, ch); add(tbox(0.55, 0.6, 0.12, 0.3), M.cushion, 0, 0.8, -0.24, ch); for (const s of [-1, 1]) add(tbox(0.08, 0.25, 0.55, 0.3), M.oak, s * 0.3, 0.6, 0, ch); for (const s of [-1, 1]) for (const z of [-0.22, 0.22]) add(box(0.04, 0.4, 0.04), M.oak, s * 0.24, 0.2, z, ch); }
  { add(tbox(0.6, 0.85, 0.45, 0.3), M.cream, 2.15, 0.425, 1.2, g); add(tbox(0.62, 0.04, 0.47, 0.3), M.counter, 2.15, 0.87, 1.2, g); add(new THREE.PlaneGeometry(0.5, 0.7), M.glass, 2.47, 1.5, 1.2, g, nocast).rotation.y = -Math.PI / 2; }
  add(tbox(0.5, 0.4, 0.35, 0.3), toon({ color: '#e8c8d0' }), -1.8, 0.2, -2.1, g); add(new THREE.SphereGeometry(0.12, 10, 8), toon({ color: '#f2c23a' }), -1.8, 0.52, -2.1, g); // gift bag + balloon-ish
}

// =====================================================================================
// WAREHOUSE (WARE): aisle between tall pallet racks with boxes; high-bay lights.
// =====================================================================================
const WS = {};
{ const O = WARE, g = room(world, O, 24, 30, 9, texM(P.corrugated(24, 70), 8, 3), texM(concreteT('#b4b0a6'), 10, 12, { roughness: 0.6, clearcoat: 0.2 }), toon({ color: '#3a3e46' })); 
  WS.g = g; add(new THREE.PlaneGeometry(0.12, 30).rotateX(-Math.PI / 2), M.yellow, -1.8, 0.005, 0, g, nocast); add(new THREE.PlaneGeometry(0.12, 30).rotateX(-Math.PI / 2), M.yellow, 1.8, 0.005, 0, g, nocast);
  const up = [], beam = [], bx = [], rn = P.rng(44); for (const sx of [-1, 1]) for (let i = 0; i < 9; i++) { const z = -12 + i * 2.8, x = sx * 3.2; for (const dx of [-0.55, 0.55]) up.push({ x: x + dx, y: 3.5, z }); if (i < 8) for (const y of [0.15, 1.8, 3.4, 5.0]) { for (const dx of [-0.55, 0.55]) beam.push({ x: x + dx, y, z: z + 1.4 });
      for (let k = 0; k < 3; k++) if (rn() < 0.85) { const h = 0.35 + rn() * 0.5; bx.push({ x: x + (rn() - 0.5) * 0.3, y: y + 0.08 + h / 2, z: z + 0.5 + k * 0.85, ry: (rn() - 0.5) * 0.1, s: [0.9 + rn() * 0.2, h / 0.5, 0.75] }); } } }
  instP(new THREE.BoxGeometry(0.08, 7, 0.08), toon({ color: '#2f5aa8' }), up, g); instP(new THREE.BoxGeometry(0.06, 0.12, 2.8), toon({ color: '#e0742a' }), beam, g); instP(tbox(1, 0.5, 1, 0.6), M.cardboard, bx, g);
  for (let z = -10; z <= 10; z += 5) { add(cyl(0.3, 0.45, 0.3, 16), M.steelD, 0, 7.5, z, g, nocast); add(new THREE.CircleGeometry(0.4, 16).rotateX(Math.PI / 2), glowM('#f4f8ff'), 0, 7.34, z, g, nocast); }
  // floor stack Ray lifts from (pallet + boxes) + hand truck
  { const st = grp(g, WA_.stack[0] - O[0], 0, WA_.stack[2]); add(tbox(1.2, 0.14, 1.0, 0.5), M.wood, 0, 0.07, 0, st); for (let k = 0; k < 6; k++) add(tbox(0.5, 0.36, 0.4, 0.5), M.cardboard, -0.27 + (k % 2) * 0.54, 0.32 + Math.floor(k / 2) * 0.37, 0, st); }
  { const ht = grp(g, -1.0, 0, -0.6, 0.3); add(box(0.04, 1.3, 0.04), M.red, -0.2, 0.65, 0, ht); add(box(0.04, 1.3, 0.04), M.red, 0.2, 0.65, 0, ht); add(box(0.45, 0.03, 0.3), M.steel, 0, 0.02, 0.12, ht); for (const s of [-1, 1]) add(new THREE.CylinderGeometry(0.12, 0.12, 0.06, 14).rotateZ(Math.PI / 2), M.rubber, s * 0.26, 0.12, -0.05, ht); }
}
