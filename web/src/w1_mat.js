
// ================= world: "Sam — Day 0 to Day 100" (3D sets, real scale, no logos) =================
const R = P.rng(17);
const txt = (g, s, x, y, size, col, font = 'Arial Black, Arial', w = 900, align = 'center') => { g.font = `${w} ${size}px ${font}`; g.fillStyle = col; g.textAlign = align; g.textBaseline = 'middle'; g.fillText(s, x, y); };
const noise = (g, w, h, a = 0.1, n = 3000, c1 = '#000', c2 = '#fff', sz = 2) => { g.save(); g.globalAlpha = a; for (let i = 0; i < n; i++) { g.fillStyle = R() < 0.5 ? c1 : c2; g.fillRect(R() * w, R() * h, sz, sz); } g.restore(); };
const blobs = (g, w, h, cols, n, r0, r1, a = 0.45) => { g.save(); for (let i = 0; i < n; i++) { g.globalAlpha = a; g.fillStyle = cols[i % cols.length]; g.beginPath(); g.ellipse(R() * w, R() * h, r0 + R() * (r1 - r0), (r0 + R() * (r1 - r0)) * 0.6, R() * 3, 0, 6.28); g.fill(); } g.restore(); };
const rr = (g, x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };
const hand = (g, s, x, y, size, col, rot = 0, font = 'Comic Sans MS, Chalkboard, Arial Black') => { g.save(); g.translate(x, y); g.rotate(rot); txt(g, s, 0, 0, size, col, font, 900); g.restore(); };

// ---------- painted textures ----------
const sidingT = (base, line) => cv(256, 256, (g, w, h) => { for (let i = 0; i < 8; i++) { const gr = g.createLinearGradient(0, i * 32, 0, i * 32 + 32); gr.addColorStop(0, base); gr.addColorStop(0.85, base); gr.addColorStop(1, line); g.fillStyle = gr; g.fillRect(0, i * 32, w, 32); g.fillStyle = line; g.fillRect(0, i * 32 + 30, w, 2); } noise(g, w, h, 0.05, 2500); blobs(g, w, h, ['#00000010'], 8, 20, 60, 0.4); });
const brickT = (c0 = '#9a4a36') => cv(512, 512, (g, w, h) => { g.fillStyle = '#b8ab98'; g.fillRect(0, 0, w, h); for (let r = 0; r < 16; r++) for (let c = 0; c < 9; c++) { const x = c * 60 + (r % 2) * 30 - 30, y = r * 32; g.fillStyle = `hsl(${12 + R() * 8},${38 + R() * 14}%,${30 + R() * 12}%)`; g.fillRect(x + 2, y + 2, 56, 28); } noise(g, w, h, 0.1, 6000); });
const asphaltT = cv(512, 512, (g, w, h) => { g.fillStyle = '#4a4a50'; g.fillRect(0, 0, w, h); noise(g, w, h, 0.35, 30000, '#2e2e34', '#6a6a72', 2); blobs(g, w, h, ['#3a3a40', '#56565c'], 30, 30, 90, 0.25);
  g.strokeStyle = '#2a2a2e'; g.lineWidth = 2; for (let i = 0; i < 6; i++) { g.beginPath(); let x = R() * w, y = R() * h; g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (R() - 0.5) * 60; y += (R() - 0.5) * 60; g.lineTo(x, y); } g.stroke(); } });
const concreteT = (b = '#bdb8ae') => cv(512, 512, (g, w, h) => { g.fillStyle = b; g.fillRect(0, 0, w, h); noise(g, w, h, 0.25, 16000, '#9a958c', '#d8d4cc', 2); blobs(g, w, h, ['#a8a398', '#cfcac0'], 24, 30, 80, 0.3); g.fillStyle = '#8a857c'; g.fillRect(0, 0, w, 3); g.fillRect(0, 0, 3, h); });
const gravelT = cv(512, 512, (g, w, h) => { g.fillStyle = '#9a9286'; g.fillRect(0, 0, w, h); for (let i = 0; i < 9000; i++) { g.fillStyle = `hsl(${30 + R() * 20},${8 + R() * 10}%,${40 + R() * 35}%)`; g.beginPath(); g.ellipse(R() * w, R() * h, 2 + R() * 4, 1.5 + R() * 3, R() * 3, 0, 6.28); g.fill(); } noise(g, w, h, 0.2, 4000, '#3a362e', '#ffffff'); });
const lawnT = cv(512, 512, (g, w, h) => { g.fillStyle = '#5d8a3a'; g.fillRect(0, 0, w, h); blobs(g, w, h, ['#6a9a42', '#4e7a30', '#7aa64a'], 60, 30, 90, 0.35);
  for (let i = 0; i < 9000; i++) { const x = R() * w, y = R() * h; g.strokeStyle = `hsl(${85 + R() * 25},${40 + R() * 20}%,${28 + R() * 26}%)`; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x, y); g.lineTo(x + R() * 3 - 1.5, y - 4 - R() * 6); g.stroke(); } });
const shingleT = (hue = 0, L = 30) => cv(256, 256, (g, w, h) => { g.fillStyle = `hsl(${hue},10%,${L - 8}%)`; g.fillRect(0, 0, w, h); for (let row = 0; row < 8; row++) for (let i = 0; i < 7; i++) { const x = i * 40 + (row % 2) * 20 - 10, y = row * 32; g.fillStyle = `hsl(${hue + R() * 10},${8 + R() * 8}%,${L - 4 + R() * 10}%)`; g.fillRect(x + 1, y + 1, 38, 29); } g.fillStyle = 'rgba(0,0,0,.35)'; for (let row = 0; row < 8; row++) g.fillRect(0, row * 32 + 28, w, 4); });
const woodFloorT = (c0 = '#b07a4a') => cv(512, 512, (g, w, h) => { for (let r = 0; r < 8; r++) { let x = -R() * 200; while (x < w) { const L = 120 + R() * 200; g.fillStyle = `hsl(${26 + R() * 8},${40 + R() * 12}%,${36 + R() * 14}%)`; g.fillRect(x, r * 64, L, 64); for (let k = 0; k < 4; k++) { g.strokeStyle = 'rgba(70,40,20,.25)'; g.lineWidth = 1; g.beginPath(); const y = r * 64 + 8 + R() * 48; g.moveTo(x, y); g.lineTo(x + L, y + (R() - 0.5) * 6); g.stroke(); } g.fillStyle = 'rgba(40,24,12,.7)'; g.fillRect(x, r * 64, 2, 64); x += L; } g.fillStyle = 'rgba(40,24,12,.8)'; g.fillRect(0, r * 64, w, 2); } });
const lino = cv(512, 512, (g, w, h) => { for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { g.fillStyle = (r + c) % 2 ? '#e8e0cc' : '#c84a3a'; g.fillRect(c * 64, r * 64, 64, 64); } noise(g, w, h, 0.08, 6000); g.strokeStyle = 'rgba(0,0,0,.15)'; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, h); g.moveTo(0, i * 64); g.lineTo(w, i * 64); g.stroke(); } });
const kitFloorT = cv(512, 512, (g, w, h) => { for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { g.fillStyle = (r + c) % 2 ? '#e6dcc6' : '#cfc2a6'; g.fillRect(c * 64, r * 64, 64, 64); } noise(g, w, h, 0.1, 8000); blobs(g, w, h, ['#00000012'], 10, 30, 80, 1); });
const wallpaperT = (bg, fg) => cv(256, 256, (g, w, h) => { g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; for (let x = 0; x < w; x += 32) { g.fillRect(x, 0, 6, h); } for (let y = 0; y < h; y += 64) for (let x = 0; x < w; x += 64) { g.beginPath(); g.arc(x + 19 + (y % 128 ? 32 : 0), y + 32, 5, 0, 6.28); g.fill(); } noise(g, w, h, 0.05, 2000); });
const plasterT = (base) => cv(256, 256, (g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h); blobs(g, w, h, ['#00000010', '#ffffff14'], 20, 20, 70, 1); noise(g, w, h, 0.05, 3000); });
const pegT = cv(512, 512, (g, w, h) => { g.fillStyle = '#b88c5a'; g.fillRect(0, 0, w, h); noise(g, w, h, 0.12, 6000, '#8a6038', '#d8b080'); g.fillStyle = '#4a3420'; for (let y = 8; y < h; y += 21) for (let x = 8; x < w; x += 21) { g.beginPath(); g.arc(x, y, 3.2, 0, 6.28); g.fill(); } });
const cardboardT = cv(256, 256, (g, w, h) => { g.fillStyle = '#c8945a'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 6) { g.fillStyle = 'rgba(120,80,40,.12)'; g.fillRect(x, 0, 2, h); } noise(g, w, h, 0.12, 3000); });
const metalT = (b = '#8a9098') => cv(256, 256, (g, w, h) => { g.fillStyle = b; g.fillRect(0, 0, w, h); for (let i = 0; i < 300; i++) { g.fillStyle = R() < 0.5 ? '#ffffff14' : '#00000014'; g.fillRect(0, R() * h, w, 1); } blobs(g, w, h, ['#7a4a2a40'], 6, 6, 24, 0.5); });
const counterT = cv(256, 256, (g, w, h) => { g.fillStyle = '#e8e2d2'; g.fillRect(0, 0, w, h); noise(g, w, h, 0.25, 6000, '#c8c0aa', '#ffffff'); blobs(g, w, h, ['#d0c8b4'], 14, 10, 30, 0.4); });
const fabricT = (c0, c1) => cv(128, 128, (g, w, h) => { g.fillStyle = c0; g.fillRect(0, 0, w, h); for (let i = 0; i < w; i += 4) { g.fillStyle = c1; g.globalAlpha = 0.25; g.fillRect(i, 0, 2, h); g.fillRect(0, i, w, 1); } g.globalAlpha = 1; noise(g, w, h, 0.1, 1500); });
const cloudT = cv(512, 256, (g, w, h) => { for (let i = 0; i < 26; i++) { const x = 60 + R() * 390, y = 110 + (R() - 0.5) * 60 * (1 - Math.abs(x - 256) / 256), r = 30 + R() * 50; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(255,255,255,.95)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 6.28); g.fill(); } });

// ---------- materials ----------
const M = {
  sidingA: texM(sidingT('#d6e2e8', '#8a9aa4'), 3, 2, { roughness: 0.8 }), sidingB: texM(sidingT('#efe4c8', '#a89a78'), 3, 2), sidingC: texM(sidingT('#c8d8c0', '#7a8a72'), 3, 2), sidingD: texM(sidingT('#e8c8b8', '#a88878'), 3, 2), sidingE: texM(sidingT('#c8ccd8', '#7a7e8a'), 3, 2),
  roofA: texM(shingleT(10, 26), 4, 3, { roughness: 0.95 }), roofB: texM(shingleT(200, 32), 4, 3, { roughness: 0.95 }), roofC: texM(shingleT(20, 40), 4, 3, { roughness: 0.95 }),
  brick: texM(brickT(), 2, 2, { roughness: 0.9 }), asphalt: texM(asphaltT, 1, 1, { roughness: 0.95 }), concrete: texM(concreteT(), 1, 1, { roughness: 0.9 }), concreteD: texM(concreteT('#a8a296'), 1, 1, { roughness: 0.9 }),
  gravel: texM(gravelT, 1, 1, { roughness: 1 }), lawn: texM(lawnT, 1, 1, { roughness: 1, normalMap: PH.grassN, normalScale: new THREE.Vector2(0.6, 0.6) }),
  trim: toon({ color: '#f4f2ec', roughness: 0.6 }), trimD: toon({ color: '#3a3a42', roughness: 0.6 }), white: toon({ color: '#f6f3ea' }), cream: toon({ color: '#efe6d2' }),
  wood: texM(P.planks(3), 1, 1, { roughness: 0.75 }), woodFloor: texM(woodFloorT(), 3, 3, { roughness: 0.55, clearcoat: 0.25, clearcoatRoughness: 0.4 }), kitFloor: texM(kitFloorT, 4, 4, { roughness: 0.5 }),
  lino: texM(lino, 6, 6, { roughness: 0.35, clearcoat: 0.4 }), oak: texM(P.planks(5), 1, 1, { roughness: 0.6 }), peg: texM(pegT, 3, 1, { roughness: 0.85 }), cardboard: texM(cardboardT, 1, 1, { roughness: 0.95 }),
  steel: toon({ color: '#b8bec6', metalness: 0.75, roughness: 0.35 }), steelD: toon({ color: '#5a6068', metalness: 0.6, roughness: 0.4 }), chrome: toon({ color: '#dfe3e8', metalness: 0.9, roughness: 0.15 }),
  rubber: toon({ color: '#1e1e22', roughness: 0.8 }), black: toon({ color: '#18181c', roughness: 0.5 }), dark: toon({ color: '#2e2e34' }), rust: texM(metalT('#8a5a3a'), 1, 1, { roughness: 0.8, metalness: 0.3 }),
  metal: texM(metalT(), 1, 1, { metalness: 0.5, roughness: 0.45 }), counter: texM(counterT, 2, 1, { roughness: 0.4, clearcoat: 0.3 }), glass: toon({ color: '#cfe6f2', roughness: 0.05, specularIntensity: 1.2, transparent: true, opacity: 0.22, depthWrite: false }),
  paper: toon({ color: '#fbf8f0' }), red: toon({ color: '#c8322e', roughness: 0.45 }), green: toon({ color: '#3a7a4a', roughness: 0.5 }), yellow: toon({ color: '#e8b830', roughness: 0.5 }), orange: toon({ color: '#e0742a', roughness: 0.5 }),
  blue: toon({ color: '#2f5aa8', roughness: 0.5 }), teal: toon({ color: '#2a9a92', roughness: 0.5 }), brown: toon({ color: '#6a4428', roughness: 0.6 }), brass: toon({ color: '#d8a845', metalness: 0.75, roughness: 0.3 }),
  plasterW: texM(plasterT('#efe6d4'), 2, 2, { roughness: 0.95 }), plasterG: texM(plasterT('#d8dcd2'), 2, 2, { roughness: 0.95 }), plasterB: texM(plasterT('#cfd8e0'), 2, 2, { roughness: 0.95 }),
  wallpaper: texM(wallpaperT('#e8d8b0', '#d8c490'), 3, 2, { roughness: 0.9 }), tileW: texM(cv(256, 256, (g, w, h) => { g.fillStyle = '#f2f0ea'; g.fillRect(0, 0, w, h); g.fillStyle = '#c8c4ba'; for (let i = 0; i <= 8; i++) { g.fillRect(i * 32, 0, 2, h); g.fillRect(0, i * 32, w, 2); } }), 4, 2, { roughness: 0.3, clearcoat: 0.4 }),
  vinylR: toon({ color: '#b8282c', roughness: 0.35, clearcoat: 0.5 }), cushion: texM(fabricT('#6a7a9a', '#3a4a6a'), 2, 2, { roughness: 1 }), bedding: texM(fabricT('#e8eef4', '#a8b8c8'), 2, 2, { roughness: 1 }),
  cabinet: toon({ color: '#c8b48a', roughness: 0.6 }), cabinetB: toon({ color: '#6f8f9f', roughness: 0.6 }), fridge: toon({ color: '#eef0ec', roughness: 0.3, clearcoat: 0.6 }), oil: toon({ color: '#d8a020', roughness: 0.4 }),
  pane: toon({ color: '#3a4e62', roughness: 0.08, specularIntensity: 1.2, clearcoat: 1, emissive: '#000000' }), paneShop: toon({ color: '#3a4e62', roughness: 0.08, specularIntensity: 1.2, clearcoat: 1, emissive: '#000000' }),
  leafHedge: toon({ color: '#3e6a2e', roughness: 1 }), mulch: toon({ color: '#5a3a26', roughness: 1 }), dirt: texM(P.dirt(7), 2, 2, { roughness: 1 }),
};
const emisC = (c, rx_ = 1, ry_ = 1) => new THREE.MeshBasicMaterial({ map: ctex(c, rx_, ry_), fog: false });
const glowM = (col) => new THREE.MeshBasicMaterial({ color: col, fog: false });
const signM = (c, o = {}) => { const m = new THREE.MeshPhysicalMaterial({ map: ctex(c), roughness: 0.9, ...o }); STD.push(m); return m; };
const dynTex = (w, h, emissive = false) => { const c = cv(w, h, () => {}), t = ctex(c); const m = emissive ? new THREE.MeshBasicMaterial({ map: t, fog: false, toneMapped: false }) : new THREE.MeshPhysicalMaterial({ map: t, roughness: 0.85, side: THREE.DoubleSide }); if (!emissive) STD.push(m); return { c, t, m, key: null }; };
const dynDraw = (D, key, fn) => { if (D.key === key) return; D.key = key; const g = D.c.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, D.c.width, D.c.height); fn(g, D.c.width, D.c.height); D.t.needsUpdate = true; };
const instP = (geo, mat, list, parent, opts = {}) => { const im = inst(geo, mat, list, opts); world.remove(im); parent.add(im); return im; };
const nocast = { cast: false };
const grp = (parent, x = 0, y = 0, z = 0, ry = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; parent.add(g); return g; };
const cyl = (rt, rb, h, n = 16) => new THREE.CylinderGeometry(rt, rb, h, n);
const lamp = (parent, x, y, z, r = 0.12, col = '#fff1cc') => { add(new THREE.SphereGeometry(r, 16, 12), glowM(col), x, y, z, parent, nocast); };
const signTex = (s, w, h, bg, fg, sz, font = 'Arial Black, Arial') => cv(w, h, (g) => { g.fillStyle = bg; g.fillRect(0, 0, w, h); txt(g, s, w / 2, h / 2 + 4, sz, fg, font, 900); });
const GLOWS = []; // night-only emissive surfaces (window panes, lamp heads): {m, on, off}
const nightGlow = (col, offCol = '#3a4e62') => { const m = toon({ color: offCol, roughness: 0.1, clearcoat: 1, emissive: '#000000' }); GLOWS.push({ m, on: col }); return m; };

// ---------- trees / bushes (Quaternius) ----------
const TV = QN.slice(0, 5).map((n) => qgeo(QA[n])), BV = qgeo(QA.Bush_Common), BVF = qgeo(QA.Bush_Common_Flowers), PV = qgeo(QA.Pine_2);
const TREES = [[], [], [], [], []], BUSH = [], BUSHF = [], PINES = [];
const tree = (x, z, h = 9, k = 0, ry = 0) => TREES[(((k | 0) % 5) + 5) % 5].push({ x, y: 0, z, ry, s: [h, h, h] });
const bush = (x, z, h = 1.0, fl = false) => (fl ? BUSHF : BUSH).push({ x, y: 0, z, ry: R() * 6, s: [h * 1.3, h, h * 1.3] });

// ---------- lawn mower (real scale: deck 0.52 x 0.56, handle to 0.98 m). Parts merged per material, instanced per placement list ----------
const mowerParts = (fold = false) => {
  const body = [], blk = [], met = [], eng = [], tag = [];
  const B = (arr, g, m) => arr.push([g, m]);
  // deck: rounded shell + skirt
  B(body, new THREE.CylinderGeometry(0.27, 0.29, 0.1, 24), mtx(0, 0.15, 0.02, 0, 0, 0, 1, 1, 1.0)); B(body, tbox(0.5, 0.05, 0.16, 0.3), mtx(0, 0.18, -0.24));
  B(body, new THREE.CylinderGeometry(0.105, 0.115, 0.07, 20), mtx(0, 0.43, 0.0)); // recoil cover
  B(body, new THREE.BoxGeometry(0.1, 0.06, 0.03), mtx(0.23, 0.17, 0.3)); // discharge chute
  // wheels
  for (const [x, z, r] of [[-0.25, 0.22, 0.085], [0.25, 0.22, 0.085], [-0.26, -0.22, 0.1], [0.26, -0.22, 0.1]]) { B(blk, new THREE.CylinderGeometry(r, r, 0.05, 18).rotateZ(Math.PI / 2), mtx(x, r, z)); B(met, new THREE.CylinderGeometry(r * 0.45, r * 0.45, 0.055, 12).rotateZ(Math.PI / 2), mtx(x * 1.02, r, z)); }
  // engine block + tank + muffler + spark plug + air filter
  B(eng, tbox(0.2, 0.16, 0.2, 0.2), mtx(0, 0.3, 0.0)); B(eng, new THREE.BoxGeometry(0.07, 0.05, 0.12), mtx(0.13, 0.27, 0.06)); B(met, new THREE.CylinderGeometry(0.012, 0.012, 0.05, 8).rotateX(Math.PI / 2), mtx(0, 0.31, 0.12));
  B(blk, new THREE.BoxGeometry(0.1, 0.06, 0.08), mtx(-0.12, 0.36, 0.05)); B(body, new THREE.CylinderGeometry(0.05, 0.05, 0.05, 14), mtx(-0.06, 0.48, -0.06)); // tank cap area
  // handle (two tubes + cross bar + bail)
  const hl = fold ? [[0, 0.2, -0.28], [0, 0.62, -0.42]] : [[0, 0.2, -0.28], [0, 0.98, -0.82]];
  const [a, b] = hl, L = Math.hypot(b[1] - a[1], b[2] - a[2]), ang = Math.atan2(b[2] - a[2], b[1] - a[1]);
  for (const sx of [-0.2, 0.2]) B(met, new THREE.CylinderGeometry(0.012, 0.012, L, 8), mtx(sx, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2, ang, 0, 0));
  B(blk, new THREE.CylinderGeometry(0.018, 0.018, 0.44, 10).rotateZ(Math.PI / 2), mtx(0, b[1], b[2])); B(met, new THREE.CylinderGeometry(0.008, 0.008, 0.4, 6).rotateZ(Math.PI / 2), mtx(0, b[1] - 0.06, b[2] + 0.06));
  B(blk, new THREE.BoxGeometry(0.03, 0.03, 0.03), mtx(0.12, (a[1] + b[1]) * 0.55, (a[2] + b[2]) * 0.55)); // cord guide
  if (!fold) B(tag, new THREE.BoxGeometry(0.004, 0.06, 0.04), mtx(0.215, 0.78, -0.62)); // repair tag (zip-tied)
  return { body: merge(body), blk: merge(blk), met: merge(met), eng: merge(eng), tag: tag.length ? merge(tag) : null };
};
const MP = mowerParts(false), MPF = mowerParts(true);
const mowerBodyM = toon({ color: '#ffffff', roughness: 0.45, clearcoat: 0.3 }), engM = toon({ color: '#6a6e76', roughness: 0.5, metalness: 0.3 }), tagM = toon({ color: '#fbf6e0' });
const MOWCOL = ['#c8322e', '#2f8a4a', '#e8b830', '#2f5aa8', '#e0742a', '#8a3a8a', '#3a9aa8', '#b8282c', '#4a8a3a', '#d8a020', '#6a6e76'];
const MOWERS = {};
const mowerSet = (name, list, fold = false, parent = world) => { const P_ = fold ? MPF : MP; const g = new THREE.Group(); parent.add(g); const L = list.map((o, i) => ({ ...o, col: o.col || MOWCOL[(i * 7 + (o.ci || 0)) % MOWCOL.length] }));
  const ims = [instP(P_.body, mowerBodyM, L, g), instP(P_.blk, M.rubber, L.map((o) => ({ ...o, col: undefined })), g), instP(P_.met, M.steel, L.map((o) => ({ ...o, col: undefined })), g), instP(P_.eng, engM, L.map((o) => ({ ...o, col: undefined })), g)];
  if (P_.tag) ims.push(instP(P_.tag, tagM, L.map((o) => ({ ...o, col: undefined })), g));
  ims.forEach((im) => { im.computeBoundingSphere(); im.frustumCulled = false; }); MOWERS[name] = { g, ims, n: L.length }; g.visible = false; return MOWERS[name]; };
const mowerShow = (name, n) => { const S = MOWERS[name]; if (!S) return; S.g.visible = n > 0; for (const im of S.ims) im.count = Math.min(S.n, Math.max(0, n | 0)); };
// one free (non-instanced) hero mower that can shake / tilt / be carried
const heroMower = (parent, col = '#c8322e', fold = false) => { const P_ = fold ? MPF : MP; const g = new THREE.Group(); parent.add(g); const bm = toon({ color: col, roughness: 0.45, clearcoat: 0.3 });
  for (const [geo, m] of [[P_.body, bm], [P_.blk, M.rubber], [P_.met, M.steel], [P_.eng, engM], [P_.tag, tagM]]) if (geo) add(geo, m, 0, 0, 0, g); g.userData.bm = bm; return g; };
const grid = (x0, z0, nx, nz, dx, dz, ry = 0, jit = 0.15, seed = 1) => { const rn = P.rng(seed), L = []; for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) L.push({ x: x0 + i * dx + (rn() - 0.5) * jit, y: 0, z: z0 + j * dz + (rn() - 0.5) * jit, ry: ry + (rn() - 0.5) * 0.5, ci: i + j * 3 }); return L; };

// ---------- utility trailer (deck 1.5 x 2.6 m, tongue toward -z) ----------
const trailer = (parent, x, z, ry = 0) => { const g = grp(parent, x, 0, z, ry);
  add(tbox(1.6, 0.08, 2.6, 0.5), M.wood, 0, 0.5, 0, g); add(tbox(1.64, 0.1, 0.06, 0.5), M.steelD, 0, 0.44, 1.3, g); add(tbox(1.64, 0.1, 0.06, 0.5), M.steelD, 0, 0.44, -1.3, g);
  for (const s of [-1, 1]) { add(tbox(0.06, 0.1, 2.6, 0.5), M.steelD, s * 0.82, 0.44, 0, g); add(tbox(0.04, 0.28, 2.6, 0.5), M.steelD, s * 0.82, 0.7, 0, g); for (let k = -2; k <= 2; k++) add(box(0.04, 0.3, 0.04), M.steelD, s * 0.82, 0.68, k * 0.62, g);
    add(new THREE.CylinderGeometry(0.28, 0.28, 0.18, 22).rotateZ(Math.PI / 2), M.rubber, s * 0.98, 0.28, 0.05, g); add(new THREE.CylinderGeometry(0.15, 0.15, 0.19, 16).rotateZ(Math.PI / 2), M.chrome, s * 0.98, 0.28, 0.05, g);
    const fe = add(new THREE.CylinderGeometry(0.36, 0.36, 0.22, 20, 1, true, -Math.PI / 2, Math.PI).rotateZ(Math.PI / 2), M.steelD, s * 0.98, 0.32, 0.05, g); fe.material = M.steelD; add(box(0.2, 0.06, 0.12), M.red, s * 0.86, 0.48, 1.32, g); }
  add(tbox(0.1, 0.1, 1.4, 0.5), M.steelD, 0, 0.44, -1.9, g); add(new THREE.SphereGeometry(0.06, 10, 8), M.chrome, 0, 0.5, -2.6, g); add(cyl(0.03, 0.03, 0.5), M.steelD, 0.12, 0.25, -2.2, g); add(cyl(0.06, 0.06, 0.04), M.rubber, 0.12, 0.03, -2.2, g);
  return g; };

// ---------- car (generic sedan / pickup / police; ~4.6 m) ----------
const car = (parent, x, z, ry = 0, col = '#3a5a8a', kind = 'sedan') => { const g = grp(parent, x, 0, z, ry); const bm = toon({ color: col, roughness: 0.25, clearcoat: 0.9, clearcoatRoughness: 0.1 });
  const L = 4.6, W = 1.8; add(tbox(W, 0.6, L, 1), bm, 0, 0.62, 0, g); add(tbox(W - 0.04, 0.12, L - 0.3, 1), bm, 0, 0.98, 0, g);
  if (kind === 'pickup') { add(tbox(W - 0.1, 0.55, 1.6, 1), bm, 0, 1.25, 0.55, g); add(tbox(W - 0.14, 0.42, 1.5, 1), M.pane, 0, 1.28, 0.55, g); add(tbox(W, 0.4, 1.9, 1), bm, 0, 1.12, -1.3, g).scale.y = 0.6; add(tbox(W - 0.2, 0.05, 1.66, 1), M.rubber, 0, 1.0, -1.3, g); }
  else { add(tbox(W - 0.14, 0.55, 2.4, 1), bm, 0, 1.3, -0.2, g); add(tbox(W - 0.1, 0.44, 2.3, 1), M.pane, 0, 1.3, -0.2, g); }
  for (const [sx, sz] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) { add(new THREE.CylinderGeometry(0.34, 0.34, 0.24, 20).rotateZ(Math.PI / 2), M.rubber, sx * 0.86, 0.34, sz * 1.45, g); add(new THREE.CylinderGeometry(0.2, 0.2, 0.25, 14).rotateZ(Math.PI / 2), M.chrome, sx * 0.87, 0.34, sz * 1.45, g); }
  for (const s of [-1, 1]) { add(box(0.34, 0.14, 0.04), glowM('#fff4d8'), s * 0.6, 0.78, L / 2 + 0.01, g, nocast); add(box(0.3, 0.12, 0.04), glowM('#d82a2a'), s * 0.65, 0.8, -L / 2 - 0.01, g, nocast); }
  add(tbox(W + 0.04, 0.16, 0.12, 0.5), M.chrome, 0, 0.42, L / 2, g); add(tbox(W + 0.04, 0.16, 0.12, 0.5), M.chrome, 0, 0.42, -L / 2, g); add(box(0.5, 0.14, 0.02), M.white, 0, 0.5, -L / 2 - 0.07, g);
  if (kind === 'police') { add(tbox(W - 0.2, 0.32, 1.2, 1), M.white, 0, 0.75, 0.6, g).position.x = 0; add(box(1.1, 0.1, 0.25), glowM('#3a5aff'), -0.28, 1.62, -0.2, g, nocast); add(box(0.55, 0.1, 0.25), glowM('#ff3a3a'), 0.28, 1.62, -0.2, g, nocast); add(box(1.2, 0.04, 0.3), M.black, 0, 1.57, -0.2, g, nocast);
    for (const s of [-1, 1]) add(new THREE.PlaneGeometry(1.4, 0.24).rotateY(s * Math.PI / 2), signM(signTex('POLICE', 512, 88, '#ffffff', '#1c2648', 60)), s * (W / 2 + 0.01), 0.78, 0.2, g, nocast); }
  g.userData.bm = bm; return g; };

// ---------- small street furniture ----------
const mailbox = (parent, x, z, ry = 0) => { const g = grp(parent, x, 0, z, ry); add(tbox(0.1, 1.1, 0.1, 0.3), M.wood, 0, 0.55, 0, g); add(tbox(0.24, 0.24, 0.5, 0.3), M.dark, 0, 1.18, 0, g); add(new THREE.CylinderGeometry(0.12, 0.12, 0.5, 16, 1, false, 0, Math.PI).rotateX(Math.PI / 2).rotateZ(-Math.PI / 2), M.dark, 0, 1.3, 0, g); add(box(0.02, 0.18, 0.04), M.red, 0.13, 1.32, -0.12, g); return g; };
const bin = (parent, x, z, ry = 0, col = '#2f5a3a') => { const g = grp(parent, x, 0, z, ry); const m = toon({ color: col, roughness: 0.6 }); add(new THREE.CylinderGeometry(0.33, 0.28, 1.0, 16), m, 0, 0.5, 0, g); add(new THREE.CylinderGeometry(0.36, 0.36, 0.06, 16), m, 0, 1.02, 0, g); add(box(0.5, 0.04, 0.04), M.black, 0, 0.95, -0.36, g); for (const s of [-1, 1]) add(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 12).rotateZ(Math.PI / 2), M.rubber, s * 0.25, 0.08, -0.28, g); return g; };
const streetLamp = (parent, x, z, ry = 0) => { const g = grp(parent, x, 0, z, ry); add(cyl(0.07, 0.1, 5.2, 10), M.steelD, 0, 2.6, 0, g); add(cyl(0.035, 0.035, 1.4, 8).rotateZ(Math.PI / 2), M.steelD, 0.7, 5.15, 0, g); add(tbox(0.5, 0.12, 0.26, 0.3), M.steelD, 1.35, 5.1, 0, g); const h = add(box(0.42, 0.04, 0.2), nightGlow('#fff2c8', '#c8ccd0'), 1.35, 5.03, 0, g, nocast); return g; };
const pole = (parent, x, z) => { add(cyl(0.12, 0.15, 9, 10), M.brown, x, 4.5, z, parent); add(box(1.8, 0.1, 0.1), M.brown, x, 8.4, z, parent); for (const s of [-0.7, 0, 0.7]) add(cyl(0.04, 0.04, 0.12, 6), M.white, x + s, 8.5, z, parent); };
const wire = (parent, a, b, sag = 0.6) => { const pts = []; for (let i = 0; i <= 16; i++) { const t = i / 16; pts.push(new THREE.Vector3(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t - sag * 4 * t * (1 - t), a[2] + (b[2] - a[2]) * t)); } const m = add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.015, 4), M.black, 0, 0, 0, parent, nocast); };
const picket = (parent, x0, z0, x1, z1, col = M.trim) => { const L = Math.hypot(x1 - x0, z1 - z0), n = Math.round(L / 0.16), a = Math.atan2(z1 - z0, x1 - x0), list = [];
  for (let i = 0; i <= n; i++) { const t = i / n; list.push({ x: x0 + (x1 - x0) * t, y: 0.45, z: z0 + (z1 - z0) * t, ry: -a }); } instP(new THREE.BoxGeometry(0.08, 0.9, 0.025), col, list, parent);
  for (const y of [0.3, 0.7]) { const m = add(box(L, 0.07, 0.03), col, (x0 + x1) / 2, y, (z0 + z1) / 2, parent); m.rotation.y = -a; } };
const cloudCard = (parent, x, y, z, s = 40) => { const m = add(new THREE.PlaneGeometry(s, s / 2), new THREE.MeshBasicMaterial({ map: ctex(cloudT), transparent: true, depthWrite: false, fog: false, opacity: 0.85 }), x, y, z, parent, nocast); m.userData.ndSkip = true; m.userData.cloud = true; return m; };

// ---------- a gable house (front facing +z) ----------
const house = (parent, x, z, o = {}) => { const W = o.w ?? 10, D = o.d ?? 8, Hh = o.h ?? 2.9, F = 0.45, g = grp(parent, x, 0, z, o.ry || 0); const sid = o.siding || M.sidingA, roofM = o.roof || M.roofA;
  add(tbox(W + 0.1, F, D + 0.1, 1), M.concreteD, 0, F / 2, -D / 2, g); add(tbox(W, Hh, D, 2.4), sid, 0, F + Hh / 2, -D / 2, g, { cast: true });
  const rh = o.rh ?? 2.2, sl = Math.hypot(D / 2 + 0.5, rh); // gable roof (ridge along x)
  for (const s of [-1, 1]) { const r = add(tbox(W + 0.7, 0.12, sl, 2), roofM, 0, F + Hh + rh / 2, -D / 2 + s * (D / 4 + 0.25), g); r.rotation.x = s * Math.atan2(rh, D / 2 + 0.5); }
  const gable = new THREE.Shape([new THREE.Vector2(-D / 2, 0), new THREE.Vector2(D / 2, 0), new THREE.Vector2(0, rh)]); for (const s of [-1, 1]) { const ge = add(new THREE.ExtrudeGeometry(gable, { depth: 0.02, bevelEnabled: false }), [sid, sid], s * (W / 2) - (s > 0 ? 0 : 0.02), F + Hh, -D / 2, g); ge.rotation.y = Math.PI / 2; }
  add(tbox(W + 0.7, 0.18, 0.1, 1), M.trim, 0, F + Hh + 0.02, 0.48, g); add(tbox(0.12, Hh, 0.12, 1), M.trim, -W / 2, F + Hh / 2, 0.01, g); add(tbox(0.12, Hh, 0.12, 1), M.trim, W / 2, F + Hh / 2, 0.01, g);
  add(box(0.5, 1.4, 0.5), M.brick, (o.chim ?? 0.3) * W, F + Hh + rh * 0.9, -D * 0.6, g);
  const win = (wx, wy, ww = 1.1, wh = 1.3, face = 0) => { const wg = grp(g, wx, wy, 0.02); add(tbox(ww + 0.18, wh + 0.18, 0.08, 0.5), M.trim, 0, 0, 0, wg, nocast); const pn = add(new THREE.PlaneGeometry(ww, wh), o.pane || M.pane, 0, 0, 0.045, wg, nocast);
    add(box(ww, 0.04, 0.03), M.trim, 0, 0, 0.06, wg, nocast); add(box(0.04, wh, 0.03), M.trim, 0, 0, 0.06, wg, nocast); add(tbox(ww + 0.3, 0.06, 0.16, 0.5), M.trim, 0, -wh / 2 - 0.1, 0.06, wg);
    if (o.shutters !== false) for (const s of [-1, 1]) add(tbox(0.36, wh + 0.1, 0.04, 0.5), o.shutter || M.trimD, s * (ww / 2 + 0.28), 0, 0.03, wg, nocast); return wg; };
  for (const wx of (o.wins || [-W * 0.32, W * 0.32])) win(wx, F + 1.65);
  const dx = o.door ?? 0; const dh = grp(g, dx - 0.46, F, 0.03); const dg = grp(dh, 0.46, 0, 0); add(tbox(1.1, 2.25, 0.08, 0.5), M.trim, 0, 1.12, 0, dg, nocast); const dm = add(tbox(0.92, 2.1, 0.06, 0.5), o.doorM || M.red, 0, 1.05, 0.03, dg, nocast);
  add(new THREE.SphereGeometry(0.035, 8, 6), M.brass, 0.34, 1.0, 0.09, dg, nocast); for (const y of [0.55, 1.5]) add(box(0.6, 0.6, 0.02), o.doorM || M.red, 0, y, 0.07, dg, nocast);
  if (o.steps !== false) for (let k = 0; k < 2; k++) add(tbox(1.4, 0.2, 0.32, 0.5), M.concrete, dx, F - 0.12 - k * 0.2, 0.25 + k * 0.32, g);
  g.userData.win = win; g.userData.door = dh; return g; };
