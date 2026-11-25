
// ================= world: "The Popcorn Trap" (decoy effect) =================
// Sets (metres, real-world scale): LOBBY (cinema concession stand at origin), AUD (auditorium, +100 x), LIB (university study room, +200 x).
// No logos or brands anywhere: generic "POPCORN"/"SNACKS" wording, made-up film titles, generic magazine "THE WORLD REVIEW".
const W_ = {}; const R = P.rng(17);
const txt = (g, s, x, y, size, col, font = 'Arial Black, Arial', w = 900, align = 'center') => { g.font = `${w} ${size}px ${font}`; g.fillStyle = col; g.textAlign = align; g.textBaseline = 'middle'; g.fillText(s, x, y); };
const noise = (g, w, h, a = 0.1, n = 3000, c1 = '#000', c2 = '#fff', sz = 2) => { g.save(); g.globalAlpha = a; for (let i = 0; i < n; i++) { g.fillStyle = R() < 0.5 ? c1 : c2; g.fillRect(R() * w, R() * h, sz, sz); } g.restore(); };
const blobs = (g, w, h, cols, n, r0, r1, a = 0.45) => { g.save(); for (let i = 0; i < n; i++) { g.globalAlpha = a; g.fillStyle = cols[i % cols.length]; g.beginPath(); g.ellipse(R() * w, R() * h, r0 + R() * (r1 - r0), (r0 + R() * (r1 - r0)) * 0.6, R() * 3, 0, 6.28); g.fill(); } g.restore(); };
const rr = (g, x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };

// ---------- painted textures ----------
// cinema carpet: deep navy with a repeating confetti / swirl pattern (classic multiplex look)
const carpetT = cv(512, 512, (g, w, h) => { g.fillStyle = '#1c2148'; g.fillRect(0, 0, w, h); noise(g, w, h, 0.18, 14000, '#0e1230', '#2a3060');
  const cols = ['#d8443c', '#f2b23a', '#2fa6a0', '#7a5ab8'];
  for (let i = 0; i < 26; i++) { const x = (i * 97) % w, y = (i * 173) % h; g.save(); g.translate(x, y); g.rotate(i); g.strokeStyle = cols[i % 4]; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.arc(0, 0, 18 + (i % 3) * 6, 0, 3.6); g.stroke(); g.restore(); }
  for (let i = 0; i < 40; i++) { const x = (i * 61 + 30) % w, y = (i * 131 + 50) % h; g.fillStyle = cols[(i + 1) % 4]; g.save(); g.translate(x, y); g.rotate(i * 0.7); g.fillRect(-9, -3, 18, 6); g.restore(); }
  for (let i = 0; i < 30; i++) { g.fillStyle = cols[(i + 2) % 4]; g.beginPath(); g.arc((i * 83 + 11) % w, (i * 47 + 90) % h, 5, 0, 6.28); g.fill(); } });
// polished dark granite counter top
const graniteT = cv(512, 512, (g, w, h) => { g.fillStyle = '#26232a'; g.fillRect(0, 0, w, h); noise(g, w, h, 0.5, 26000, '#141216', '#4a4650', 2); noise(g, w, h, 0.35, 1800, '#8a8692', '#d8d4dc', 2); blobs(g, w, h, ['#3a3640', '#1a181e'], 30, 20, 70, 0.25); });
// burgundy counter front: vertical grooved panels + brass kick strip
const panelRedT = cv(512, 512, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#8e1f26'); gr.addColorStop(1, '#6a141a'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 8; i++) { g.fillStyle = '#5a1016'; g.fillRect(i * 64, 0, 5, h); g.fillStyle = '#a8343a'; g.fillRect(i * 64 + 5, 0, 2, h); } noise(g, w, h, 0.06, 5000); });
// brushed stainless steel
const steelT = cv(256, 256, (g, w, h) => { g.fillStyle = '#b8bec6'; g.fillRect(0, 0, w, h); for (let i = 0; i < 400; i++) { g.fillStyle = R() < 0.5 ? '#a4aab2' : '#ccd2da'; g.fillRect(0, R() * h, w, 1); } });
// wall: dark charcoal fabric-wrapped panels with a thin seam grid (cinema lobby)
const wallPanT = cv(512, 512, (g, w, h) => { g.fillStyle = '#2e2a36'; g.fillRect(0, 0, w, h); noise(g, w, h, 0.22, 12000, '#24202c', '#3a3644');
  g.fillStyle = '#1a1820'; for (let i = 0; i <= 2; i++) { g.fillRect(i * 256 - 2, 0, 4, h); g.fillRect(0, i * 256 - 2, w, 4); } });
const plasterT = (base, b2) => cv(512, 512, (g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h); blobs(g, w, h, [b2], 30, 40, 120, 0.12); noise(g, w, h, 0.05, 5000); });
// ceiling: acoustic tile grid
const ceilT = (base) => cv(256, 256, (g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h); noise(g, w, h, 0.15, 4000, '#000', '#fff', 1); g.fillStyle = '#00000030'; g.fillRect(0, 0, w, 3); g.fillRect(0, 0, 3, h); });
const woodT = (c0, c1, c2, lines = 30) => cv(256, 256, (g, w, h) => { g.fillStyle = c0; g.fillRect(0, 0, w, h); for (let i = 0; i < lines; i++) { g.strokeStyle = i % 2 ? c1 : c2; g.globalAlpha = 0.55; g.lineWidth = 1 + R() * 2; g.beginPath(); const y = R() * h; g.moveTo(0, y); g.bezierCurveTo(80, y + (R() - 0.5) * 20, 160, y + (R() - 0.5) * 20, w, y + (R() - 0.5) * 10); g.stroke(); } g.globalAlpha = 1; noise(g, w, h, 0.05); });
// oak parquet (library floor)
const parquetT = cv(512, 512, (g, w, h) => { for (let r = 0; r < 8; r++) for (let c = 0; c < 5; c++) { const x = c * 128 + (r % 2) * 64 - 64, y = r * 64; g.fillStyle = ['#b98a58', '#a87a4a', '#c49464', '#b08050'][(r * 3 + c) % 4]; g.fillRect(x, y, 128, 64); g.strokeStyle = '#7a5430'; g.lineWidth = 2; g.strokeRect(x, y, 128, 64);
  g.globalAlpha = 0.3; for (let k = 0; k < 5; k++) { g.strokeStyle = '#8a6038'; g.beginPath(); g.moveTo(x, y + 8 + k * 12 + R() * 4); g.lineTo(x + 128, y + 8 + k * 12 + R() * 4); g.stroke(); } g.globalAlpha = 1; } noise(g, w, h, 0.05); });
// auditorium acoustic fabric (dark red wavy)
const audWallT = cv(512, 512, (g, w, h) => { g.fillStyle = '#4a1c24'; g.fillRect(0, 0, w, h); for (let i = 0; i < 16; i++) { const gr = g.createLinearGradient(i * 32, 0, i * 32 + 32, 0); gr.addColorStop(0, '#3a141a'); gr.addColorStop(0.5, '#5e2630'); gr.addColorStop(1, '#3a141a'); g.fillStyle = gr; g.fillRect(i * 32, 0, 32, h); } noise(g, w, h, 0.08, 5000); });
const seatFabT = cv(256, 256, (g, w, h) => { g.fillStyle = '#a3222c'; g.fillRect(0, 0, w, h); noise(g, w, h, 0.25, 9000, '#7a1820', '#c0343e', 2); });
// popcorn bucket wall: red/white vertical stripes + wordless kernel badges (u wraps around)
const bucketT = cv(1024, 512, (g, w, h) => { for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? '#f7f3ea' : '#d32630'; g.fillRect(i * 64, 0, 64, h); }
  g.fillStyle = '#00000014'; for (let i = 0; i < 16; i++) g.fillRect(i * 64 + 58, 0, 6, h);
  // wordless badges (cartoon popped kernel in a cream roundel) at 4 points round the bucket: no text, so no fragment can ever read as a word
  for (const cx of [0, 256, 512, 768, 1024]) { g.save(); g.translate(cx, 262); g.fillStyle = '#fbf6e6'; g.beginPath(); g.arc(0, 0, 74, 0, 6.28); g.fill(); g.strokeStyle = '#8a1018'; g.lineWidth = 9; g.stroke();
    g.fillStyle = '#ffe9a8'; g.strokeStyle = '#7a4a1a'; g.lineWidth = 5; for (const [dx, dy, r] of [[-20, -10, 24], [18, -16, 26], [0, 16, 26], [-24, 18, 18], [26, 14, 18]]) { g.beginPath(); g.arc(dx, dy, r, 0, 6.28); g.fill(); g.stroke(); }
    g.fillStyle = '#fff8e0'; for (const [dx, dy] of [[-26, -18], [12, -24], [-6, 8]]) { g.beginPath(); g.arc(dx, dy, 7, 0, 6.28); g.fill(); }
    g.fillStyle = '#e8a23a'; g.beginPath(); g.ellipse(4, 38, 12, 7, 0, 0, 6.28); g.fill(); g.restore(); }
  g.fillStyle = '#e8e2d2'; g.fillRect(0, 0, w, 22); g.fillStyle = '#ffffff'; g.fillRect(0, 22, w, 6); });
const cupT = (col) => cv(512, 256, (g, w, h) => { g.fillStyle = '#f6f3ec'; g.fillRect(0, 0, w, h); g.fillStyle = col; for (let i = 0; i < 6; i++) { g.beginPath(); g.ellipse(i * 90 + 40, 140, 30, 60, 0.4, 0, 6.28); g.fill(); } g.fillStyle = col; g.fillRect(0, 0, w, 26); g.fillRect(0, h - 26, w, 26); });
// candy boxes (generic, colourful, no brands)
const candyT = cv(512, 256, (g, w, h) => { const cols = ['#e8463c', '#f2b23a', '#3a7ad8', '#2fa66a', '#a04ab8', '#f27a2a', '#e83a8a', '#1fa6c8'];
  for (let i = 0; i < 8; i++) { const x = i * 64; g.fillStyle = cols[i]; g.fillRect(x + 3, 30, 58, 200); g.fillStyle = '#ffffffcc'; g.beginPath(); g.ellipse(x + 32, 110, 22, 30, 0, 0, 6.28); g.fill(); g.fillStyle = cols[(i + 3) % 8]; g.beginPath(); g.arc(x + 32, 110, 12, 0, 6.28); g.fill(); g.fillStyle = '#00000030'; g.fillRect(x + 3, 200, 58, 30); g.fillStyle = '#ffffff'; g.fillRect(x + 10, 44, 44, 10); } });
const signTex = (s, w, h, bg, fg, sz, font = 'Arial Black, Arial') => cv(w, h, (g) => { g.fillStyle = bg; g.fillRect(0, 0, w, h); txt(g, s, w / 2, h / 2 + 4, sz, fg, font, 900); });
// movie posters (made-up films)
const poster = (bg, fg, title, art) => cv(400, 600, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, bg[0]); gr.addColorStop(1, bg[1]); g.fillStyle = gr; g.fillRect(0, 0, w, h); art(g, w, h);
  g.fillStyle = '#00000088'; g.fillRect(0, h - 150, w, 150); txt(g, title[0], w / 2, h - 105, title[0].length > 9 ? 40 : 52, fg, 'Georgia, serif', 900); if (title[1]) txt(g, title[1], w / 2, h - 55, 30, fg, 'Georgia, serif', 700); txt(g, 'COMING SOON', w / 2, 30, 20, '#ffffffaa', 'Arial', 700); });
const posterA = poster(['#1a2a5a', '#0a0a1a'], '#ffd66a', ['SPACE', 'LLAMAS'], (g, w) => { g.fillStyle = '#fff8e0'; for (let i = 0; i < 60; i++) g.fillRect(R() * w, R() * 400, 2, 2); g.fillStyle = '#e8e0d0'; g.beginPath(); g.ellipse(200, 290, 70, 90, 0, 0, 6.28); g.fill(); g.beginPath(); g.ellipse(200, 180, 34, 50, 0, 0, 6.28); g.fill(); g.fillStyle = '#9ad0ff'; g.beginPath(); g.arc(200, 185, 60, 0, 6.28); g.globalAlpha = 0.35; g.fill(); g.globalAlpha = 1; g.fillStyle = '#c84a3a'; g.beginPath(); g.arc(320, 110, 40, 0, 6.28); g.fill(); });
const posterB = poster(['#f2a23a', '#c8402a'], '#fff4e0', ['THE LAST', 'ORCHARD'], (g, w) => { g.fillStyle = '#ffe9a8'; g.beginPath(); g.arc(200, 200, 90, 0, 6.28); g.fill(); g.fillStyle = '#5a2a1a'; for (let i = 0; i < 5; i++) { g.fillRect(40 + i * 75, 260, 12, 160); g.beginPath(); g.arc(46 + i * 75, 250, 40, 0, 6.28); g.fill(); } });
const posterC = poster(['#2a6a5a', '#0e2a24'], '#e8fff4', ['DEEP', 'REEF'], (g, w) => { g.fillStyle = '#7ad8c8'; for (let i = 0; i < 7; i++) { g.beginPath(); g.ellipse(80 + i * 45, 300 - (i % 3) * 40, 26, 12, 0.3, 0, 6.28); g.fill(); } g.fillStyle = '#f2a23a'; g.beginPath(); g.moveTo(140, 200); g.lineTo(260, 170); g.lineTo(240, 240); g.fill(); });
const posterD = poster(['#3a2a4a', '#120a18'], '#ffb0c8', ['MIDNIGHT', 'DINER'], (g, w) => { g.strokeStyle = '#ff5a8a'; g.lineWidth = 8; rr(g, 70, 120, 260, 120, 20); g.stroke(); txt(g, 'OPEN', 200, 180, 56, '#ff8ab0', 'Arial Black', 900); g.fillStyle = '#5ad8ff'; g.fillRect(90, 300, 220, 14); });
// the "DECOY EFFECT" title card on the auditorium screen: wooden duck decoy + serif title
const duck = (g, x, y, s) => { g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = '#7a4a26'; g.beginPath(); g.ellipse(0, 0, 150, 70, 0, 0, 6.28); g.fill(); g.fillStyle = '#5a3418'; g.beginPath(); g.ellipse(30, 15, 110, 45, 0.1, 0, 6.28); g.fill();
  g.fillStyle = '#2f6a4a'; g.beginPath(); g.ellipse(-120, -70, 55, 48, 0, 0, 6.28); g.fill(); g.fillStyle = '#e8b040'; g.beginPath(); g.moveTo(-170, -70); g.lineTo(-230, -58); g.lineTo(-168, -50); g.fill();
  g.fillStyle = '#ffffff'; g.beginPath(); g.arc(-132, -82, 9, 0, 6.28); g.fill(); g.fillStyle = '#141014'; g.beginPath(); g.arc(-134, -82, 5, 0, 6.28); g.fill(); g.fillStyle = '#f2efe6'; g.fillRect(-100, -30, 34, 8);
  g.fillStyle = '#3a2210'; g.fillRect(-60, 66, 120, 16); g.restore(); };

// ---------- materials ----------
const M = {
  carpet: texM(carpetT, 8, 8, { roughness: 1, normalMap: rp(PH.fabN, 30, 30), normalScale: new THREE.Vector2(0.4, 0.4) }),
  granite: texM(graniteT, 4, 1, { roughness: 0.22, specularIntensity: 1.0, clearcoat: 0.6, clearcoatRoughness: 0.15 }),
  panelRed: texM(panelRedT, 3, 1, { roughness: 0.55 }), steel: texM(steelT, 1, 1, { metalness: 0.8, roughness: 0.32 }), steelD: toon({ color: '#6a7078', metalness: 0.7, roughness: 0.35 }),
  wall: texM(wallPanT, 6, 2, { roughness: 0.95 }), ceil: texM(ceilT('#2a2832'), 20, 20, { roughness: 1 }),
  brass: toon({ color: '#d8a845', metalness: 0.75, roughness: 0.28 }), chrome: toon({ color: '#d8dce2', metalness: 0.9, roughness: 0.15 }),
  black: toon({ color: '#141317', roughness: 0.4, specularIntensity: 0.7 }), dark: toon({ color: '#2a2a30' }), white: toon({ color: '#f6f3ea' }), cream: toon({ color: '#efe6d2' }),
  red: toon({ color: '#c41e28', roughness: 0.4 }), redD: toon({ color: '#7a141a', roughness: 0.5 }), belt: toon({ color: '#b8202a', roughness: 0.5 }),
  glass: toon({ color: '#d8eef6', roughness: 0.05, specularIntensity: 1.2, transparent: true, opacity: 0.18, depthWrite: false }),
  bucket: toon({ map: ctex(bucketT), roughness: 0.6, side: THREE.DoubleSide }), bucketIn: toon({ color: '#efe6d6', roughness: 0.9, side: THREE.BackSide }),
  pine: texM(woodT('#e2c08a', '#c8a06a', '#f0d4a0', 18), 1, 1, { roughness: 0.8 }), copper: toon({ color: '#c8783a', metalness: 0.7, roughness: 0.35 }), wire: toon({ color: '#c4c8cc', metalness: 0.85, roughness: 0.25 }),
  oak: texM(woodT('#a87a4a', '#8a5e34', '#c4945e'), 2, 1, { roughness: 0.6 }), oakD: texM(woodT('#6a4428', '#553620', '#7a5232'), 2, 1, { roughness: 0.55 }),
  parquet: texM(parquetT, 6, 6, { roughness: 0.55, clearcoat: 0.3, clearcoatRoughness: 0.4 }), audWall: texM(audWallT, 8, 2, { roughness: 1 }), seat: texM(seatFabT, 2, 2, { roughness: 1 }),
  seatPlast: toon({ color: '#222024', roughness: 0.5 }), paper: toon({ color: '#fbf8f0' }), green: toon({ color: '#2f6a4a', roughness: 0.35, specularIntensity: 0.8 }),
};
const emisC = (c, rx_ = 1, ry_ = 1) => new THREE.MeshBasicMaterial({ map: ctex(c, rx_, ry_), fog: false });
const glowM = (col) => new THREE.MeshBasicMaterial({ color: col, fog: false });
const signM = (c, o = {}) => { const m = new THREE.MeshPhysicalMaterial({ map: ctex(c), roughness: 0.9, ...o }); STD.push(m); return m; };
const dynTex = (w, h, emissive = false) => { const c = cv(w, h, () => {}), t = ctex(c); const m = emissive ? new THREE.MeshBasicMaterial({ map: t, fog: false, toneMapped: false }) : new THREE.MeshPhysicalMaterial({ map: t, roughness: 0.85, side: THREE.DoubleSide }); if (!emissive) STD.push(m); return { c, t, m, key: null }; };
const dynDraw = (D, key, fn) => { if (D.key === key) return; D.key = key; const g = D.c.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, D.c.width, D.c.height); fn(g, D.c.width, D.c.height); D.t.needsUpdate = true; };
const instP = (geo, mat, list, parent, opts = {}) => { const im = inst(geo, mat, list, opts); world.remove(im); parent.add(im); return im; };
const nocast = { cast: false };

// ---------- popcorn (instanced puffy kernels) ----------
const kernelGeo = (() => { const g = new THREE.IcosahedronGeometry(1, 1), p = g.attributes.position; const r = P.rng(5); for (let i = 0; i < p.count; i++) { const k = 0.75 + 0.45 * r(); p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * 0.9, p.getZ(i) * k); } g.computeVertexNormals(); return g; })();
const kernelM = toon({ color: '#ffffff', roughness: 0.85 });
const KCOL = ['#fff4d6', '#fbe8b8', '#f6dc9a', '#fff9ea', '#f2d28a', '#fbeccc'];
// popcorn mound: a lumpy cap made of overlapping "puffs" (displaced sphere), vertex-coloured cream/butter; flat-normal ink pass so only
// the silhouette is inked (no noisy crease lines inside the heap)
const ndFlatInst = new THREE.ShaderMaterial({ vertexShader: `varying float vD; void main(){ vec4 mv = modelViewMatrix*instanceMatrix*vec4(position,1.); vD=-mv.z; gl_Position=projectionMatrix*mv; }`, fragmentShader: `varying float vD; void main(){ gl_FragColor=vec4(.5,.5,1.,vD); }`, side: THREE.DoubleSide });
const moundGeo = (rx_, rz_, hgt, seed, nPuff = 60, slope = 0) => { const g = new THREE.SphereGeometry(1, 72, 36, 0, Math.PI * 2, 0, Math.PI / 2), p = g.attributes.position, rn = P.rng(seed);
  const puffs = []; for (let i = 0; i < nPuff; i++) { const a = rn() * 6.283, el = Math.asin(rn()); puffs.push([Math.cos(el) * Math.cos(a), Math.sin(el), Math.cos(el) * Math.sin(a), 0.16 + 0.12 * rn()]); }
  const col = new Float32Array(p.count * 3), c = new THREE.Color(), v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) { v.set(p.getX(i), p.getY(i), p.getZ(i)); let bump = 0, best = 0, bi = 0;
    for (let k = 0; k < puffs.length; k++) { const P_ = puffs[k], d = Math.hypot(v.x - P_[0], v.y - P_[1], v.z - P_[2]); const b = Math.max(0, 1 - (d / P_[3]) ** 2); if (b > best) { best = b; bi = k; } bump = Math.max(bump, Math.sqrt(b)); }
    const k = 1 + 0.16 * bump - 0.05; p.setXYZ(i, v.x * rx_ * k, (v.y * k) * hgt + slope * v.z * hgt, v.z * rz_ * k);
    c.set(KCOL[bi % 6]); const sh = 0.82 + 0.18 * best; if (best < 0.15) c.set('#e8c878'); col[i * 3] = c.r * sh; col[i * 3 + 1] = c.g * sh; col[i * 3 + 2] = c.b * sh; }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.computeVertexNormals(); return g; };
const moundM = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.85, specularIntensity: 0.25, color: '#ffffff' }); STD.push(moundM);
const mound = (parent, x, y, z, rx_, rz_, hgt, seed, slope = 0) => { const m = add(moundGeo(rx_, rz_, hgt, seed, 60, slope), moundM, x, y, z, parent); m.userData.flatNd = true; return m; };
const kernels = (parent, list) => { const im = instP(kernelGeo, kernelM, list, parent); im.userData.nd = ndFlatInst; return im; };
// a few loose kernels resting on a mound top / spilled
const loose = (r, y0, n, seed, h) => { const rn = P.rng(seed), L = []; for (let i = 0; i < n; i++) { const a = rn() * 6.283, d = Math.sqrt(rn()) * r * 0.8, top = y0 + h * Math.sqrt(Math.max(0, 1 - (d / r) ** 2)); const s = r * 0.13;
  L.push({ x: Math.cos(a) * d, y: top + s * 0.3, z: Math.sin(a) * d, rx: rn() * 6, ry: rn() * 6, rz: rn() * 6, s: [s, s, s], col: KCOL[i % 6] }); } return L; };

// ---------- popcorn bucket (tapered, open, striped; size in metres) ----------
const BUCKETS = { S: { h: 0.17, rt: 0.075, rb: 0.056 }, M: { h: 0.24, rt: 0.1, rb: 0.075 }, L: { h: 0.27, rt: 0.114, rb: 0.085 } };
const mkBucket = (sz, parent, x, y, z, seed = 1, full = true) => { const B = BUCKETS[sz], g = new THREE.Group(); g.position.set(x, y, z); parent.add(g);
  add(new THREE.CylinderGeometry(B.rt, B.rb, B.h, 40, 1, true), M.bucket, 0, B.h / 2, 0, g);
  add(new THREE.CylinderGeometry(B.rt * 0.985, B.rb * 0.985, B.h, 40, 1, true), M.bucketIn, 0, B.h / 2, 0, g, nocast);
  add(new THREE.CircleGeometry(B.rb, 32).rotateX(-Math.PI / 2), M.cream, 0, 0.004, 0, g, nocast);
  add(new THREE.TorusGeometry(B.rt, 0.0035, 6, 48).rotateX(Math.PI / 2), M.white, 0, B.h, 0, g); // rolled rim
  if (full) { mound(g, 0, B.h - 0.006, 0, B.rt * 0.97, B.rt * 0.97, B.rt * 0.62, seed); kernels(g, loose(B.rt, B.h - 0.006, 7, seed + 50, B.rt * 0.62)); }
  g.userData.B = B; return g; };

// ---------- interior room builder (walls/ceiling never cast shadows; the overhead "sun" is the key light) ----------
const room = (O, w, d, h, wallM, floorM, ceilM) => { const g = new THREE.Group(); g.position.set(...O); world.add(g);
  add(new THREE.PlaneGeometry(w, d).rotateX(-Math.PI / 2), floorM, 0, 0, 0, g, nocast);
  if (ceilM) add(new THREE.PlaneGeometry(w, d).rotateX(Math.PI / 2), ceilM, 0, h, 0, g, nocast);
  const wl = (W, x, z, ry) => { if (!wallM) return null; const m = add(new THREE.PlaneGeometry(W, h), wallM, x, h / 2, z, g, nocast); m.rotation.y = ry; return m; };
  g.userData.walls = [wl(w, 0, -d / 2, 0), wl(w, 0, d / 2, Math.PI), wl(d, -w / 2, 0, Math.PI / 2), wl(d, w / 2, 0, -Math.PI / 2)]; return g; };
const downlight = (parent, x, y, z, r = 0.09) => { add(new THREE.CylinderGeometry(r * 1.3, r * 1.3, 0.02, 20), M.chrome, x, y - 0.005, z, parent, nocast); add(new THREE.CircleGeometry(r, 20).rotateX(Math.PI / 2), glowM('#fff4dc'), x, y - 0.017, z, parent, nocast); };

// =====================================================================================
// LOBBY: concession stand. Customer side is +z. Front counter top at y=1.00 (z -1.75..-1.05), aisle, back counter (worktop 0.95) at z -4..-3.3,
// three menu screens on the back wall, popcorn machine on the back counter (left), drink fountain (right), queue posts, posters, doors.
// =====================================================================================
const LB = {};
{ const g = room(LOBBY, 16, 18, 4.2, M.wall, M.carpet, M.ceil); W_.lobby = g; g.position.set(LOBBY[0], 0, LOBBY[2] + 2.5); // room centre z = +2.5 → back wall z = -6.5
  const C = new THREE.Group(); C.position.set(...LOBBY); world.add(C); LB.g = C;
  // back wall section behind the stand: warm wood slats + menu screens
  add(tbox(7.6, 4.2, 0.12, 1.2), M.oakD, 0, 2.1, -4.06, C, nocast);
  const slat = []; for (let i = 0; i < 46; i++) slat.push({ x: -3.75 + i * 0.165, y: 2.1, z: -3.985 }); instP(new THREE.BoxGeometry(0.07, 4.2, 0.04), M.oak, slat, C, nocast);
  // side returns of the stand (wing walls)
  for (const s of [-1, 1]) add(tbox(0.3, 4.2, 2.9, 1), M.wall, s * 3.95, 2.1, -2.6, C, nocast);
  // bulkhead soffit over the stand with downlights and an LED edge
  add(tbox(7.6, 0.5, 3.0, 1), toon({ color: '#1a1820', roughness: 0.6 }), 0, 3.55, -2.6, C, nocast);
  add(tbox(7.6, 0.05, 0.03, 1), glowM('#ffd9a0'), 0, 3.31, -1.09, C, nocast);
  for (const x of [-2.6, -1.3, 0, 1.3, 2.6]) for (const z of [-3.4, -2.0]) downlight(C, x, 3.3, z);
  // "SNACKS" marquee letters on the soffit face (generic word, bulb-lit)
  { const sc = cv(1024, 160, (q, w, h) => { q.fillStyle = '#1a1820'; q.fillRect(0, 0, w, h); txt(q, 'S N A C K S', w / 2, h / 2 + 4, 104, '#ffcf6a'); q.fillStyle = '#fff6d0'; for (let i = 0; i < 36; i++) { q.beginPath(); q.arc(20 + i * 28, 14, 5, 0, 6.28); q.fill(); q.beginPath(); q.arc(20 + i * 28, h - 14, 5, 0, 6.28); q.fill(); } });
    add(new THREE.PlaneGeometry(2.6, 0.4), emisC(sc), 0, 3.56, -1.095, C, nocast); }

  // ---- menu screens (dynamic canvas, emissive) ----
  LB.scr = []; const SX = [-1.36, 0, 1.36];
  SX.forEach((x, i) => { add(tbox(1.28, 0.76, 0.06, 0.5), M.black, x, 2.62, -3.93, C, nocast); const D = dynTex(1024, 600, true); const m = add(new THREE.PlaneGeometry(1.2, 0.704), D.m, x, 2.62, -3.896, C, nocast); m.userData.flatNd = true; LB.scr.push(D);
    add(box(0.05, 0.3, 0.05), M.steelD, x, 3.13, -3.95, C, nocast); });
  LB.SX = SX;

  // ---- back counter (worktop 0.95 m) with cabinets ----
  add(tbox(7.5, 0.9, 0.66, 0.6), toon({ color: '#3a2a26', roughness: 0.6 }), 0, 0.45, -3.67, C);
  add(tbox(7.56, 0.05, 0.7, 0.6), M.steel, 0, 0.925, -3.66, C);
  const doors = []; for (let i = 0; i < 12; i++) doors.push({ x: -3.44 + i * 0.625, y: 0.47, z: -3.335 }); instP(new THREE.BoxGeometry(0.6, 0.8, 0.02), toon({ color: '#4a3630', roughness: 0.5 }), doors, C);
  const handles = doors.map((d) => ({ x: d.x + 0.24, y: 0.75, z: -3.32 })); instP(new THREE.BoxGeometry(0.012, 0.12, 0.02), M.chrome, handles, C);

  // ---- popcorn machine (on the back counter, left): steel base, glass cabinet 0.9 x 0.75 x 0.55, kettle, heap of popcorn, heat lamp ----
  { const pm = new THREE.Group(); pm.position.set(-2.35, 0.95, -3.62); C.add(pm); LB.pm = pm;
    add(tbox(0.96, 0.16, 0.6, 0.5), M.red, 0, 0.08, 0, pm); add(tbox(0.98, 0.02, 0.62, 0.5), M.chrome, 0, 0.165, 0, pm);
    for (const [x, z] of [[-0.46, -0.28], [0.46, -0.28], [-0.46, 0.28], [0.46, 0.28]]) add(box(0.025, 0.76, 0.025), M.chrome, x, 0.55, z, pm);
    const gl = [[0, 0.55, 0.285, 0.92, 0.76, 0], [0, 0.55, -0.285, 0.92, 0.76, 0], [-0.465, 0.55, 0, 0.57, 0.76, 1], [0.465, 0.55, 0, 0.57, 0.76, 1]];
    for (const [x, y, z, w, h, sd] of gl) { const m = add(new THREE.PlaneGeometry(w, h), M.glass, x, y, z, pm, nocast); if (sd) m.rotation.y = Math.PI / 2; m.userData.ndSkip = true; m.renderOrder = 3; }
    add(tbox(0.98, 0.14, 0.62, 0.5), M.red, 0, 1.0, 0, pm); add(tbox(1.0, 0.02, 0.64, 0.5), M.chrome, 0, 0.93, 0, pm);
    add(new THREE.PlaneGeometry(0.8, 0.11), emisC(signTex('POPCORN', 512, 72, '#c41e28', '#ffe9a0', 56)), 0, 1.0, 0.312, pm, nocast);
    add(new THREE.CylinderGeometry(0.03, 0.03, 0.18, 10), M.chrome, 0, 0.84, 0, pm, nocast);
    const ket = add(new THREE.CylinderGeometry(0.15, 0.12, 0.16, 24), M.steel, 0, 0.7, 0, pm); add(new THREE.CylinderGeometry(0.155, 0.155, 0.02, 24), M.chrome, 0, 0.78, 0, pm);
    add(new THREE.CylinderGeometry(0.008, 0.008, 0.2, 6).rotateZ(Math.PI / 2), M.dark, 0.26, 0.72, 0, pm);
    add(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16), glowM('#ffd27a'), -0.3, 0.9, 0.0, pm, nocast);
    // heap: popcorn piled in the cabinet floor, higher at the back
    mound(pm, 0, 0.17, 0, 0.45, 0.27, 0.16, 8, -0.45); { const rn = P.rng(8), L = []; for (let i = 0; i < 70; i++) { const x = (rn() - 0.5) * 0.8, z = 0.05 + rn() * 0.2, s = 0.011; L.push({ x, y: 0.19 + 0.12 * (1 - (x / 0.45) ** 2) * Math.max(0, 0.6 - z * 1.6), z, rx: rn() * 6, ry: rn() * 6, s: [s, s, s], col: KCOL[i % 6] }); } kernels(pm, L); }
    // scoop resting on the heap
    add(tbox(0.14, 0.006, 0.11, 0.2), M.steel, 0.25, 0.3, 0.08, pm).rotation.z = 0.2; add(new THREE.CylinderGeometry(0.009, 0.009, 0.16, 8).rotateZ(Math.PI / 2), M.dark, 0.38, 0.33, 0.08, pm).rotation.z = Math.PI / 2 + 0.3;
  }
  // ---- drink fountain (back counter, right): generic, plain coloured taps ----
  { const df = new THREE.Group(); df.position.set(1.95, 0.95, -3.66); C.add(df);
    add(tbox(1.3, 0.8, 0.56, 0.5), M.steel, 0, 0.4, -0.02, df); add(tbox(1.32, 0.12, 0.58, 0.5), M.black, 0, 0.86, -0.02, df);
    const tapCols = ['#c8322e', '#2f8a4a', '#f2b23a', '#3a6ad8', '#7a3a2a', '#e8e4da'];
    tapCols.forEach((c, i) => { const x = -0.5 + i * 0.2; add(tbox(0.17, 0.2, 0.02, 0.2), toon({ color: c, roughness: 0.4 }), x, 0.6, 0.265, df); add(tbox(0.13, 0.03, 0.025, 0.2), M.white, x, 0.6, 0.278, df);
      add(new THREE.CylinderGeometry(0.014, 0.012, 0.06, 8), M.chrome, x, 0.42, 0.25, df); add(box(0.05, 0.1, 0.02), M.chrome, x, 0.47, 0.27, df); });
    add(tbox(1.25, 0.03, 0.22, 0.3), M.steelD, 0, 0.04, 0.16, df); const gr = []; for (let i = 0; i < 30; i++) gr.push({ x: -0.6 + i * 0.042, y: 0.057, z: 0.16 }); instP(new THREE.BoxGeometry(0.02, 0.006, 0.2), M.chrome, gr, df, nocast);
  }
  // ---- cup towers + lids between machine and fountain ----
  { const cups = [], rn = P.rng(12); const cupG = new THREE.CylinderGeometry(0.05, 0.036, 0.15, 18, 1, true);
    for (let s = 0; s < 3; s++) { const n = 6 + s * 2, sc = [0.8, 1.0, 1.2][s]; for (let k = 0; k < n; k++) cups.push({ x: -0.45 + s * 0.2, y: 0.95 + 0.075 * sc + k * 0.018, z: -3.6, s: [sc, sc, sc] }); }
    instP(cupG, toon({ map: ctex(cupT('#c41e28')), side: THREE.DoubleSide, roughness: 0.6 }), cups, C);
    const lids = []; for (let k = 0; k < 14; k++) lids.push({ x: 0.35, y: 0.955 + k * 0.006, z: -3.6 }); instP(new THREE.CylinderGeometry(0.058, 0.058, 0.006, 20), toon({ color: '#f0f0f0', roughness: 0.3 }), lids, C);
    // empty buckets stacked (spares)
    for (let k = 0; k < 4; k++) mkBucket('L', C, -1.4, 0.95 + k * 0.035, -3.66, 1, false); for (let k = 0; k < 4; k++) mkBucket('M', C, -1.1, 0.95 + k * 0.032, -3.66, 1, false);
  }

  // ---- front counter (top 1.00 m) ----
  const F = new THREE.Group(); F.position.set(0, 0, -1.4); C.add(F); LB.F = F;
  add(tbox(6.2, 0.96, 0.66, 0.6), toon({ color: '#3a2a26' }), 0, 0.48, -0.01, F);
  add(tbox(6.3, 0.04, 0.74, 0.74), M.granite, 0, 0.98, 0, F);
  const fp = add(tbox(6.24, 0.82, 0.03, 1), M.panelRed, 0, 0.52, 0.345, F); // customer-side face
  add(tbox(6.26, 0.08, 0.04, 1), M.brass, 0, 0.06, 0.35, F); add(tbox(6.26, 0.025, 0.04, 1), M.brass, 0, 0.93, 0.35, F);
  // candy display window (left part of the customer face): glass front, lit shelves of candy boxes
  { const cx = -1.9; add(tbox(1.9, 0.5, 0.04, 1), toon({ color: '#1a1416' }), cx, 0.58, 0.352, F, nocast);
    add(new THREE.PlaneGeometry(1.8, 0.42), emisC(cv(1024, 240, (q, w, h) => { q.fillStyle = '#fff4dc'; q.fillRect(0, 0, w, h); q.drawImage(candyT, 0, 6, w / 2, h / 2 - 8); q.drawImage(candyT, w / 2, 6, w / 2, h / 2 - 8); q.drawImage(candyT, 64, h / 2 + 4, w / 2, h / 2 - 8); q.drawImage(candyT, w / 2 + 64, h / 2 + 4, w / 2, h / 2 - 8); q.fillStyle = '#c9ccd0'; q.fillRect(0, h / 2 - 3, w, 5); })), cx, 0.58, 0.374, F, nocast);
    const gm = add(new THREE.PlaneGeometry(1.8, 0.42), M.glass, cx, 0.58, 0.378, F, nocast); gm.userData.ndSkip = true; }
  // POS terminal (staff side) + small customer display
  { const pos = new THREE.Group(); pos.position.set(1.15, 1.0, -0.12); pos.rotation.y = Math.PI + 0.25; F.add(pos);
    add(tbox(0.2, 0.03, 0.18, 0.2), M.black, 0, 0.015, 0, pos); add(box(0.04, 0.2, 0.04), M.black, 0, 0.12, -0.04, pos); const sc = add(tbox(0.36, 0.26, 0.03, 0.3), M.black, 0, 0.3, -0.05, pos); sc.rotation.x = -0.25;
    add(new THREE.PlaneGeometry(0.33, 0.23), emisC(cv(330, 230, (q, w, h) => { q.fillStyle = '#1a2a3a'; q.fillRect(0, 0, w, h); const c = ['#d8443c', '#f2b23a', '#2fa66a', '#3a7ad8']; for (let i = 0; i < 12; i++) { q.fillStyle = c[i % 4]; q.fillRect(14 + (i % 4) * 78, 20 + Math.floor(i / 4) * 66, 70, 56); } })), 0, 0.302, -0.032, pos, nocast).rotation.x = -0.25; }
  // napkin dispenser + straw holder (customer end, right)
  { const nd = new THREE.Group(); nd.position.set(2.6, 1.0, 0.0); F.add(nd); add(tbox(0.16, 0.2, 0.12, 0.2), M.chrome, 0, 0.1, 0, nd); add(tbox(0.12, 0.02, 0.012, 0.2), M.white, 0, 0.17, 0.062, nd);
    add(new THREE.CylinderGeometry(0.045, 0.045, 0.2, 18, 1, true), M.glass, 0.24, 0.1, 0, nd, nocast).userData.ndSkip = true; const st = []; for (let i = 0; i < 18; i++) { const a = i * 2.4, r = 0.03 * Math.sqrt(i / 18); st.push({ x: 0.24 + Math.cos(a) * r, y: 0.13, z: Math.sin(a) * r, rx: (R() - 0.5) * 0.2, rz: (R() - 0.5) * 0.2, col: ['#c41e28', '#f6f3ea', '#2f8a4a'][i % 3] }); }
    instP(new THREE.CylinderGeometry(0.003, 0.003, 0.25, 5), toon({ color: '#ffffff' }), st, nd, nocast); add(new THREE.CylinderGeometry(0.05, 0.05, 0.01, 18), M.chrome, 0.24, 0.005, 0, nd); }
  // the three popcorn buckets on the counter (customer's left → right: S, M, L) + the trap in front of the medium
  LB.BX = { S: -0.52, M: -0.08, L: 0.38 }; LB.BZ = -0.02; // F-local z (counter centre); customer edge is at +0.37
  LB.bS = mkBucket('S', F, LB.BX.S, 1.0, LB.BZ, 21); LB.bM = mkBucket('M', F, LB.BX.M, 1.0, LB.BZ, 22); LB.bL = mkBucket('L', F, LB.BX.L, 1.0, LB.BZ, 23);
  // price cards (folded tents) in front of each bucket
  LB.tents = {}; for (const [k, p_] of [['S', '$3.00'], ['M', '$6.50'], ['L', '$7.00']]) { const t = new THREE.Group(); t.position.set(LB.BX[k] + (k === 'M' ? 0.12 : 0), 1.0, LB.BZ + 0.2); F.add(t); LB.tents[k] = t;
    const tc = signM(cv(256, 160, (q, w, h) => { q.fillStyle = '#fbf6e6'; q.fillRect(0, 0, w, h); q.strokeStyle = '#8a1018'; q.lineWidth = 8; q.strokeRect(4, 4, w - 8, h - 8); txt(q, { S: 'SMALL', M: 'MEDIUM', L: 'LARGE' }[k], w / 2, 46, 34, '#3a2a2a'); txt(q, p_, w / 2, 108, 60, '#c41e28'); }));
    for (const s of [-1, 1]) { const pl = add(new THREE.PlaneGeometry(0.1, 0.064), s > 0 ? tc : M.cream, 0, 0.03, s * 0.009, t); pl.rotation.x = -s * 0.28; if (s < 0) pl.rotation.y = Math.PI; } }
  // rat-trap (wooden base 0.20 x 0.10 along z, spring wire bar hinged across x), bait pedal with three kernels; snaps toward -z
  { const tr = new THREE.Group(); tr.position.set(LB.BX.M + 0.0, 1.0, 0.205); F.add(tr); LB.trap = tr;
    add(tbox(0.1, 0.012, 0.2, 0.15), M.pine, 0, 0.006, 0, tr); // base
    add(new THREE.PlaneGeometry(0.07, 0.03).rotateX(-Math.PI / 2), signM(cv(256, 110, (q, w, h) => { q.fillStyle = '#e2c08a'; q.fillRect(0, 0, w, h); txt(q, 'SNAP!', w / 2, h / 2 + 3, 60, '#8a3a1a', 'Arial Black', 900); })), 0, 0.0125, -0.07, tr, nocast);
    for (const s of [-1, 1]) add(new THREE.TorusGeometry(0.008, 0.0022, 6, 14).rotateY(Math.PI / 2), M.wire, s * 0.032, 0.02, 0.0, tr); // springs
    add(tbox(0.034, 0.003, 0.03, 0.05), M.copper, 0, 0.014, 0.045, tr); // bait pedal
    for (let i = 0; i < 3; i++) { const kk = add(kernelGeo, toon({ color: KCOL[i] }), -0.011 + i * 0.011, 0.026, 0.045 + (i % 2) * 0.007, tr); kk.scale.setScalar(0.0105); kk.userData.flatNd = true; } // bait kernels
    add(new THREE.CylinderGeometry(0.0016, 0.0016, 0.07, 6).rotateX(Math.PI / 2), M.wire, 0.0, 0.0145, 0.06, tr, nocast); // catch rod
    const bar = new THREE.Group(); bar.position.set(0, 0.02, 0); tr.add(bar); LB.trapBar = bar; // hinge axis = local x through the springs
    const U = new THREE.Group(); bar.add(U); // U loop of wire lying toward +z (armed)
    for (const s of [-1, 1]) add(new THREE.CylinderGeometry(0.0022, 0.0022, 0.085, 6).rotateX(Math.PI / 2), M.wire, s * 0.036, 0, 0.0425, U, nocast);
    add(new THREE.CylinderGeometry(0.0022, 0.0022, 0.074, 6).rotateZ(Math.PI / 2), M.wire, 0, 0, 0.085, U, nocast);
  }

  // ---- queue stanchions with retractable belts (customer side) ----
  { const posts = [[-1.2, 0.35], [-1.2, 1.6], [-1.2, 2.85], [1.4, 0.35], [1.4, 1.6], [1.4, 2.85], [-2.6, 2.85], [2.8, 2.85]];
    for (const [x, z] of posts) { add(new THREE.CylinderGeometry(0.17, 0.18, 0.03, 24), M.chrome, x, 0.015, z, C); add(new THREE.CylinderGeometry(0.03, 0.03, 0.95, 12), M.chrome, x, 0.5, z, C); add(new THREE.CylinderGeometry(0.04, 0.04, 0.07, 12), M.chrome, x, 0.95, z, C); }
    const belt = (a, b) => { const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz); const m = add(tbox(L - 0.06, 0.05, 0.004, 0.5), M.belt, (a[0] + b[0]) / 2, 0.92, (a[1] + b[1]) / 2, C); m.rotation.y = -Math.atan2(dz, dx); };
    belt(posts[0], posts[1]); belt(posts[1], posts[2]); belt(posts[3], posts[4]); belt(posts[4], posts[5]); belt(posts[2], posts[6]); belt(posts[5], posts[7]); }

  // ---- side walls: poster lightboxes; far wall (customer side, z=+11): doors to the screens, bench, bin ----
  const lightbox = (tex, x, y, z, ry, wdt = 0.9, hgt = 1.35) => { const lb = new THREE.Group(); lb.position.set(x, y, z); lb.rotation.y = ry; C.add(lb); add(tbox(wdt + 0.1, hgt + 0.1, 0.08, 0.5), M.black, 0, 0, -0.03, lb, nocast); add(new THREE.PlaneGeometry(wdt, hgt), emisC(tex), 0, 0, 0.012, lb, nocast); add(tbox(wdt + 0.12, 0.02, 0.1, 0.5), M.chrome, 0, hgt / 2 + 0.06, -0.02, lb, nocast); return lb; };
  lightbox(posterA, -7.94, 1.7, -0.5, Math.PI / 2); lightbox(posterB, -7.94, 1.7, 1.2, Math.PI / 2); lightbox(posterC, 7.94, 1.7, -0.5, -Math.PI / 2); lightbox(posterD, 7.94, 1.7, 1.2, -Math.PI / 2);
  lightbox(posterC, -5.5, 1.7, 11.35, Math.PI); lightbox(posterA, 5.5, 1.7, 11.35, Math.PI);
  for (const x of [-2.2, 2.2]) { const d = new THREE.Group(); d.position.set(x, 0, 11.38); d.rotation.y = Math.PI; C.add(d); add(tbox(1.9, 2.4, 0.06, 1), M.black, 0, 1.2, 0, d, nocast); for (const s of [-1, 1]) { add(tbox(0.88, 2.25, 0.04, 1), toon({ color: '#5a1820', roughness: 0.6 }), s * 0.46, 1.14, 0.02, d, nocast); add(box(0.03, 0.4, 0.04), M.chrome, s * 0.08, 1.1, 0.06, d, nocast); }
    add(new THREE.PlaneGeometry(1.0, 0.26), emisC(signTex(x < 0 ? 'SCREEN 3' : 'SCREEN 4', 512, 130, '#141317', '#ffcf6a', 74)), 0, 2.62, 0.02, d, nocast); }
  { const bn = new THREE.Group(); bn.position.set(4.6, 0, 9.8); C.add(bn); add(tbox(1.8, 0.08, 0.5, 0.5), M.oak, 0, 0.45, 0, bn); for (const s of [-1, 1]) add(tbox(0.06, 0.45, 0.45, 0.5), M.steelD, s * 0.8, 0.22, 0, bn); }
  { add(new THREE.CylinderGeometry(0.22, 0.2, 0.9, 20), M.steelD, -4.4, 0.45, 9.9, C); add(new THREE.CylinderGeometry(0.23, 0.23, 0.04, 20), M.black, -4.4, 0.92, 9.9, C); }
  // ceiling downlights over the lobby floor
  for (let x = -6; x <= 6; x += 2) for (let z = 0; z <= 10; z += 2.5) downlight(C, x, 4.19, z, 0.1);
}

// =====================================================================================
// AUDITORIUM: stadium seating (rows step up toward +z), screen at z=-11 (9.6 x 4.0 m, bottom at y=1.4), red seats, aisle lights.
// =====================================================================================
const AU = {};
{ const O = AUD, g = room([O[0], 0, O[2]], 14, 24, 9, M.audWall, M.carpet, M.ceil); W_.aud = g;
  const A = new THREE.Group(); A.position.set(...O); world.add(A); AU.g = A;
  // screen + black masking + stage lip
  AU.scrD = dynTex(2048, 860, true); const sm = add(new THREE.PlaneGeometry(9.6, 4.03), AU.scrD.m, 0, 3.42, -11.0, A, nocast); sm.userData.flatNd = true;
  add(tbox(11.2, 5.2, 0.1, 1), M.black, 0, 3.4, -11.1, A, nocast); add(tbox(12, 0.9, 1.2, 1), toon({ color: '#1a1418' }), 0, 0.45, -10.6, A);
  // rows: riser per row 0.36 m, depth 1.05 m; 12 seats per row in two blocks with a centre aisle
  const ROWS = 9, Z0 = -5.2, DZ = 1.05, RH = 0.36; AU.ROWS = { Z0, DZ, RH };
  for (let r = 0; r < ROWS; r++) { const z = Z0 + r * DZ, y = r * RH; if (r > 0) add(tbox(14, y, DZ, 1), M.carpet, 0, y / 2, z, A, nocast); add(tbox(14, 0.02, 0.04, 1), glowM('#3a2a18'), 0, y + 0.005, z - DZ / 2 + 0.02, A, nocast); }
  const seatX = []; for (let i = 0; i < 6; i++) { seatX.push(-0.75 - i * 0.58); seatX.push(0.75 + i * 0.58); } AU.seatX = seatX;
  const cush = [], back = [], arm = [], legs = [], cupH = []; for (let r = 0; r < ROWS; r++) { const z = Z0 + r * DZ, y = r * RH; for (const x of seatX) {
    cush.push({ x, y: y + 0.45, z: z + 0.05 }); back.push({ x, y: y + 0.78, z: z + 0.33, rx: -0.12 }); legs.push({ x, y: y + 0.2, z: z + 0.15 }); }
    for (const x of seatX) for (const s of [-1, 1]) arm.push({ x: x + s * 0.29, y: y + 0.62, z: z + 0.1 }); }
  instP(new THREE.BoxGeometry(0.5, 0.12, 0.5), M.seat, cush, A); instP(new THREE.BoxGeometry(0.54, 0.7, 0.14), M.seat, back, A); instP(new THREE.BoxGeometry(0.06, 0.06, 0.55), M.seatPlast, arm, A); instP(new THREE.BoxGeometry(0.4, 0.4, 0.3), M.seatPlast, legs, A);
  const backShell = back.map((b) => ({ ...b, z: b.z + 0.075 })); instP(new THREE.BoxGeometry(0.56, 0.72, 0.03), toon({ color: '#4a1a20', roughness: 0.6 }), backShell, A);
  AU.seatAt = (row, idx) => ({ x: seatX[idx], y: row * RH, z: Z0 + row * DZ });
  // aisle step lights + wall sconces
  const al = []; for (let r = 0; r < ROWS; r++) al.push({ x: 0.42, y: r * RH + 0.05, z: Z0 + r * DZ - DZ / 2 + 0.05 }, { x: -0.42, y: r * RH + 0.05, z: Z0 + r * DZ - DZ / 2 + 0.05 }); instP(new THREE.BoxGeometry(0.1, 0.03, 0.02), glowM('#ffb84a'), al, A, nocast);
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) { add(new THREE.SphereGeometry(0.12, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), glowM('#ffc070'), s * 6.92, 3.6, -7 + i * 4, A, nocast).rotation.z = s * Math.PI / 2; }
  // projector beam (soft additive cone from the booth to the screen; skipped by the ink pass)
  { const L = 18, geo = new THREE.CylinderGeometry(0.06, 3.2, L, 24, 1, true); geo.translate(0, -L / 2, 0); geo.rotateX(Math.PI / 2 + 0.0); const beam = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: '#9ab8ff', transparent: true, opacity: 0.045, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false }));
    beam.position.set(0, 6.6, 7.2); beam.lookAt(new THREE.Vector3(O[0], 3.4, O[2] - 11)); beam.position.add(new THREE.Vector3(O[0], 0, O[2])); beam.lookAt(new THREE.Vector3(O[0], 3.4, O[2] - 11)); beam.rotateX(Math.PI / 2); beam.userData.ndSkip = true; beam.renderOrder = 4; scene.add(beam); AU.beam = beam; }
  AU.bucketL = mkBucket('L', A, 0, 0, 0, 31); // placed per frame on the armrest beside the customer
}

// =====================================================================================
// LIB: university study room (daylight). Long table (top 0.75 m) facing the camera side (+z), three students behind it,
// bookshelves on the back wall, wall screen for the chart, windows on the left wall (sun through the openings).
// =====================================================================================
const LI = {};
{ const O = LIB, w = 9, d = 8, h = 3.3; const g = room([O[0], 0, O[2]], w, d, h, null, M.parquet, texM(ceilT('#ecebe6'), 12, 12)); W_.lib = g;
  const L = new THREE.Group(); L.position.set(...O); world.add(L); LI.g = L; const wallM = texM(plasterT('#e8e2d4', '#cfc6b4'), 3, 1, { roughness: 0.95 });
  // back wall (z=-4), right wall (x=+4.5), front wall (z=+4) as planes; left wall (x=-4.5) built around two window openings (casts shadow)
  add(new THREE.PlaneGeometry(w, h), wallM, 0, h / 2, -4, L, nocast); { const m = add(new THREE.PlaneGeometry(d, h), wallM, 4.5, h / 2, 0, L, nocast); m.rotation.y = -Math.PI / 2; } { const m = add(new THREE.PlaneGeometry(w, h), wallM, 0, h / 2, 4, L, nocast); m.rotation.y = Math.PI; }
  const lw = (z0, z1, y0, y1) => add(tbox(0.2, y1 - y0, z1 - z0, 1), wallM, -4.6, (y0 + y1) / 2, (z0 + z1) / 2, L, { cast: true, recv: true });
  lw(-4, -2.6, 0, h); lw(-1.4, -0.4, 0, h); lw(0.8, 4, 0, h); lw(-2.6, -1.4, 0, 0.9); lw(-2.6, -1.4, 2.6, h); lw(-0.4, 0.8, 0, 0.9); lw(-0.4, 0.8, 2.6, h);
  const skyC = cv(512, 512, (q, W2, H2) => { const gr = q.createLinearGradient(0, 0, 0, H2); gr.addColorStop(0, '#8fc4f0'); gr.addColorStop(1, '#e4f0f8'); q.fillStyle = gr; q.fillRect(0, 0, W2, H2); q.fillStyle = '#ffffffcc'; for (let i = 0; i < 4; i++) { q.beginPath(); q.ellipse(80 + i * 120, 120 + (i % 2) * 60, 70, 26, 0, 0, 6.28); q.fill(); }
    q.fillStyle = '#6a9a5a'; for (let i = 0; i < 9; i++) { q.beginPath(); q.arc(i * 64, 420 + (i % 3) * 18, 60, 0, 6.28); q.fill(); } q.fillStyle = '#5a8a4a'; q.fillRect(0, 440, W2, 72); });
  for (const zc of [-2.0, 0.2]) { add(new THREE.PlaneGeometry(1.2, 1.7), emisC(skyC), -5.4, 1.75, zc, L, nocast).rotation.y = Math.PI / 2;
    for (const dz of [-0.6, 0, 0.6]) add(box(0.06, 1.7, 0.05), M.white, -4.52, 1.75, zc + dz, L); for (const y of [0.9, 1.75, 2.6]) add(box(0.06, 0.05, 1.25), M.white, -4.52, y, zc, L); add(tbox(0.3, 0.05, 1.3, 1), M.white, -4.4, 0.9, zc, L); }
  // bookshelves along the back wall (instanced books)
  { const shelfM = M.oakD, books = [], rn = P.rng(31), bcol = ['#8a2a2a', '#2a4a7a', '#3a6a3a', '#c8a050', '#5a3a6a', '#7a5030', '#2a5a5a', '#b84a30', '#e8dcc0', '#3a3a44'];
    for (const [x0, x1] of [[-4.3, -1.25], [1.25, 4.3]]) { const cx = (x0 + x1) / 2, W2 = x1 - x0; add(tbox(W2, 2.6, 0.04, 1), shelfM, cx, 1.3, -3.96, L); for (const s of [x0, x1]) add(tbox(0.04, 2.6, 0.34, 1), shelfM, s, 1.3, -3.8, L);
      for (let k = 0; k < 6; k++) { const y = 0.05 + k * 0.44; add(tbox(W2, 0.03, 0.34, 1), shelfM, cx, y, -3.8, L); let x = x0 + 0.04; while (x < x1 - 0.06) { const bw = 0.025 + rn() * 0.035, bh = 0.24 + rn() * 0.12; if (rn() < 0.06) { x += 0.08; continue; } books.push({ x: x + bw / 2, y: y + 0.015 + bh / 2, z: -3.78 + rn() * 0.03, s: [bw, bh, 0.22 + rn() * 0.06], rz: rn() < 0.05 ? 0.2 : 0, col: bcol[Math.floor(rn() * bcol.length)] }); x += bw + 0.003; } } }
    instP(new THREE.BoxGeometry(1, 1, 1), toon({ color: '#ffffff', roughness: 0.7 }), books, L); }
  // wall screen between the shelves (chart)
  add(tbox(2.36, 1.38, 0.06, 0.5), M.black, 0, 2.12, -3.94, L, nocast); LI.chartD = dynTex(1280, 720, true); { const m = add(new THREE.PlaneGeometry(2.24, 1.26), LI.chartD.m, 0, 2.12, -3.905, L, nocast); m.userData.flatNd = true; }
  // the long study table (top 0.75), modesty panel on the camera side, chairs behind
  { const T = new THREE.Group(); T.position.set(0, 0, -0.6); L.add(T); LI.T = T;
    add(tbox(2.6, 0.05, 1.0, 1), M.oak, 0, 0.75, 0, T); for (const s of [-1, 1]) add(tbox(0.06, 0.72, 0.9, 1), M.oakD, s * 1.22, 0.36, 0, T); add(tbox(2.4, 0.5, 0.03, 1), M.oakD, 0, 0.47, 0.42, T);
    for (const x of [-0.66, 0, 0.66]) { const ch = new THREE.Group(); ch.position.set(x, 0, -0.85); T.add(ch); add(tbox(0.46, 0.05, 0.44, 0.5), M.oakD, 0, 0.46, 0, ch); add(tbox(0.46, 0.5, 0.04, 0.5), M.oakD, 0, 0.98, -0.22, ch); for (const [a, b] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) add(box(0.035, 0.46, 0.035), M.oakD, a, 0.23, b, ch); add(box(0.035, 0.52, 0.035), M.oakD, -0.2, 0.72, -0.21, ch); add(box(0.035, 0.52, 0.035), M.oakD, 0.2, 0.72, -0.21, ch); }
    // desk dressing: banker's lamps, books, pencils, water bottle, the magazines + subscription forms (form B is dynamic)
    for (const x of [-1.1, 1.1]) { const lp = new THREE.Group(); lp.position.set(x, 0.775, -0.3); T.add(lp); add(new THREE.CylinderGeometry(0.07, 0.08, 0.02, 18), M.brass, 0, 0.01, 0, lp); add(new THREE.CylinderGeometry(0.008, 0.008, 0.3, 8), M.brass, 0, 0.16, 0, lp); const sh = add(new THREE.CylinderGeometry(0.04, 0.1, 0.12, 18, 1, true, 0, Math.PI), M.green, 0, 0.32, 0, lp); sh.rotation.z = Math.PI / 2; sh.rotation.y = Math.PI / 2; }
    const mag = (x, z, ry, seed) => { const m = new THREE.Group(); m.position.set(x, 0.776, z); m.rotation.y = ry; T.add(m); add(tbox(0.21, 0.008, 0.28, 0.3), M.paper, 0, 0.004, 0, m); add(new THREE.PlaneGeometry(0.21, 0.28).rotateX(-Math.PI / 2), signM(magCover(seed)), 0, 0.0085, 0, m, nocast); return m; };
    LI.magA = mag(-0.7, 0.14, 0.25, 1); LI.magC = mag(0.72, 0.1, -0.2, 2); LI.magB = mag(-0.27, 0.05, 0.12, 3);
    LI.formD = dynTex(800, 1000); const fm = add(new THREE.PlaneGeometry(0.21, 0.2625).rotateX(-Math.PI / 2), LI.formD.m, 0.02, 0.7775, 0.12, T, nocast); fm.rotation.y = -0.06; LI.form = fm; LI.FORM_P = [0.02, 0.7775, 0.12];
    for (const [x, z, c] of [[-0.5, 0.3, '#f2b23a'], [0.24, 0.28, '#3a6ad8'], [0.95, 0.25, '#c8322e']]) { const p_ = add(new THREE.CylinderGeometry(0.0035, 0.0035, 0.15, 6).rotateZ(Math.PI / 2), toon({ color: c }), x, 0.78, z, T); p_.rotation.y = 0.5; }
    add(new THREE.CylinderGeometry(0.035, 0.035, 0.22, 16), toon({ color: '#9ad0e8', roughness: 0.1, transparent: true, opacity: 0.6 }), 0.4, 0.885, -0.3, T); add(new THREE.CylinderGeometry(0.02, 0.02, 0.03, 12), M.white, 0.4, 1.01, -0.3, T);
    for (let i = 0; i < 3; i++) add(tbox(0.2, 0.04, 0.27, 0.3), toon({ color: ['#2a4a7a', '#8a2a2a', '#3a6a3a'][i] }), -1.0 + i * 0.01, 0.795 + i * 0.04, -0.25, T).rotation.y = i * 0.1; }
  // pendant lights
  for (const x of [-1.25, 1.25]) { add(new THREE.CylinderGeometry(0.005, 0.005, 1.1, 6), M.dark, x, h - 0.55, -0.6, L, nocast); add(new THREE.ConeGeometry(0.22, 0.2, 20, 1, true), toon({ color: '#2a2a30', side: THREE.DoubleSide }), x, h - 1.15, -0.6, L, nocast); add(new THREE.CircleGeometry(0.09, 16).rotateX(Math.PI / 2), glowM('#fff4dc'), x, h - 1.24, -0.6, L, nocast); }
  // a potted plant + radiator under the windows
  { const pt = new THREE.Group(); pt.position.set(3.7, 0, -2.8); L.add(pt); add(new THREE.CylinderGeometry(0.22, 0.17, 0.45, 18), toon({ color: '#c8a87a' }), 0, 0.225, 0, pt); for (let i = 0; i < 11; i++) { const l = add(new THREE.SphereGeometry(0.16, 10, 8), toon({ color: '#3f7a3a' }), Math.cos(i * 1.9) * 0.16, 0.6 + (i % 4) * 0.2, Math.sin(i * 1.9) * 0.16, pt); l.scale.set(0.55, 1.6, 0.55); l.rotation.z = Math.cos(i) * 0.5; } }
}
function magCover(seed) { return cv(420, 560, (q, w, h) => { const bg = ['#f6f2e8', '#e8eef6', '#f4ece0'][seed % 3]; q.fillStyle = bg; q.fillRect(0, 0, w, h); q.fillStyle = '#b8202a'; q.fillRect(0, 0, w, 96); txt(q, 'THE WORLD', w / 2, 34, 40, '#ffffff', 'Georgia, serif', 900); txt(q, 'REVIEW', w / 2, 74, 40, '#ffffff', 'Georgia, serif', 900);
  q.fillStyle = ['#3a5a8a', '#4a7a5a', '#8a5a3a'][seed % 3]; q.fillRect(30, 120, w - 60, 280); q.fillStyle = '#ffffff55'; q.beginPath(); q.arc(w / 2, 260, 90, 0, 6.28); q.fill(); for (let i = 0; i < 5; i++) { q.fillStyle = '#3a3a44'; q.fillRect(30, 424 + i * 24, i % 2 ? 260 : 340, 10); } }); }

// ---------- wipe occluders (pass right in front of the lens = hidden cut) ----------
const WIPE = {}; const wipeG = new THREE.Group(); scene.add(wipeG);
{ const mk = (k, objs) => { const g = new THREE.Group(); for (const o of objs) g.add(o); wipeG.add(g); g.visible = false; g.traverse((o) => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } }); WIPE[k] = g; };
  const ms = (geo, mat, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); return m; };
  // a giant popcorn bucket tumbling past the lens
  const bg = new THREE.Group(); { bg.add(ms(new THREE.CylinderGeometry(0.5, 0.38, 1.2, 36, 1, true), M.bucket)); bg.add(ms(new THREE.CylinderGeometry(0.49, 0.37, 1.2, 36, 1, true), M.bucketIn)); const pk = new THREE.InstancedMesh(kernelGeo, kernelM, 160); const rn = P.rng(3);
    for (let i = 0; i < 160; i++) { const a = rn() * 6.28, d = Math.sqrt(rn()) * 0.47, s = 0.06 + 0.03 * rn(); _p.set(Math.cos(a) * d, 0.6 + 0.25 * Math.sqrt(1 - (d / 0.5) ** 2) - rn() * 0.1, Math.sin(a) * d); _q.setFromEuler(_e.set(rn() * 6, rn() * 6, 0)); _s.set(s, s, s); _m4.compose(_p, _q, _s); pk.setMatrixAt(i, _m4); _c.set(KCOL[i % 6]); pk.setColorAt(i, _c); } pk.userData.nd = ndFlatInst; bg.add(pk); }
  mk('bucket', [bg]);
  const pp = new THREE.Group(); { pp.add(ms(new THREE.PlaneGeometry(1.4, 1.85), new THREE.MeshBasicMaterial({ map: ctex(magCover(4)), side: THREE.DoubleSide, fog: false }))); }
  mk('paper', [pp]);
  wipeG.traverse((o) => { if (o.isMesh) { o.userData.wipe = true; o.renderOrder = 10; } });
}

// ---------- dynamic canvases: menu screens, cinema title, subscription form, chart ----------
const bucketIcon = (q, cx, cy, s, glow = 0) => { q.save(); q.translate(cx, cy); q.scale(s, s);
  if (glow > 0) { const gr = q.createRadialGradient(0, -20, 10, 0, -20, 200); gr.addColorStop(0, `rgba(255,220,120,${0.55 * glow})`); gr.addColorStop(1, 'rgba(255,220,120,0)'); q.fillStyle = gr; q.fillRect(-220, -240, 440, 440); }
  q.fillStyle = '#fff2c8'; for (let i = 0; i < 26; i++) { const a = Math.PI * (1 + i / 25), r = 70 + (i % 3) * 8; q.beginPath(); q.arc(Math.cos(a) * 66 * 1.05, -100 + Math.sin(a) * 52 - (i % 4) * 6, 20 + (i % 3) * 3, 0, 6.28); q.fill(); }
  q.beginPath(); q.moveTo(-80, -100); q.lineTo(80, -100); q.lineTo(58, 100); q.lineTo(-58, 100); q.closePath(); q.save(); q.clip(); for (let i = -6; i <= 6; i++) { q.fillStyle = i % 2 ? '#f7f3ea' : '#d32630'; q.beginPath(); q.moveTo(i * 22 - 11, -100); q.lineTo(i * 22 + 11, -100); q.lineTo(i * 16 + 8, 100); q.lineTo(i * 16 - 8, 100); q.fill(); } q.restore();
  q.strokeStyle = '#2a1416'; q.lineWidth = 7; q.beginPath(); q.moveTo(-80, -100); q.lineTo(80, -100); q.lineTo(58, 100); q.lineTo(-58, 100); q.closePath(); q.stroke(); q.restore(); };
// st: {on 0..1, name, price, sub, hl 0..1, badge text, badgeK, dim 0..1, glitch 0..1, f}
const menuDraw = (D, st) => dynDraw(D, JSON.stringify(st), (q, w, h) => {
  q.fillStyle = '#05060a'; q.fillRect(0, 0, w, h);
  const on = st.on ?? 1; if (on <= 0.001) { const gr = q.createLinearGradient(0, 0, w, h); gr.addColorStop(0, 'rgba(120,130,160,0.10)'); gr.addColorStop(0.45, 'rgba(120,130,160,0.0)'); q.fillStyle = gr; q.fillRect(0, 0, w, h); return; }
  q.save(); if (on < 1) { const k = on; q.globalAlpha = Math.min(1, k * 1.6); q.translate(w / 2, h / 2); q.scale(1, Math.max(0.01, k)); q.translate(-w / 2, -h / 2); }
  const gr = q.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#3a0c12'); gr.addColorStop(1, '#14040a'); q.fillStyle = gr; q.fillRect(0, 0, w, h);
  q.fillStyle = '#ffffff10'; for (let i = 0; i < 9; i++) { q.beginPath(); q.moveTo(w * 0.32, h * 0.5); q.lineTo(w * 0.32 + Math.cos(i * 0.7) * 900, h * 0.5 + Math.sin(i * 0.7) * 900); q.lineTo(w * 0.32 + Math.cos(i * 0.7 + 0.25) * 900, h * 0.5 + Math.sin(i * 0.7 + 0.25) * 900); q.fill(); }
  const sc = { SMALL: 0.95, MEDIUM: 1.22, LARGE: 1.38 }[st.name] || 1; bucketIcon(q, 270, 330, sc * 1.05, st.hl || 0);
  txt(q, st.name, 690, 150, 92, '#ffffff'); txt(q, 'POPCORN', 690, 232, 48, '#f2c8a0', 'Arial Black', 900);
  const pk = 1 + 0.08 * (st.hl || 0); q.save(); q.translate(690, 395); q.scale(pk, pk); q.lineJoin = 'round'; q.font = '900 158px Arial Black, Arial'; q.textAlign = 'center'; q.textBaseline = 'middle'; q.lineWidth = 18; q.strokeStyle = '#2a0408'; q.strokeText(st.price, 0, 0); q.fillStyle = '#ffd23a'; q.fillText(st.price, 0, 0); q.restore();
  if (st.badge) { const k = Math.min(1, st.badgeK ?? 1); q.save(); q.translate(512, 530); q.rotate(-0.04); q.scale(k, k); q.fillStyle = '#ffd23a'; rr(q, -330, -50, 660, 100, 50); q.fill(); q.strokeStyle = '#7a0a12'; q.lineWidth = 6; q.stroke(); txt(q, st.badge, 0, 4, 60, '#7a0a12'); q.restore(); }
  if (st.dim) { q.fillStyle = `rgba(0,0,0,${0.62 * st.dim})`; q.fillRect(0, 0, w, h); }
  q.restore();
  q.fillStyle = 'rgba(0,0,0,0.12)'; for (let y = 0; y < h; y += 4) q.fillRect(0, y, w, 1);
  if (st.glitch) { const rn = P.rng(st.f || 1); for (let i = 0; i < 14; i++) { const y = rn() * h, hh = 6 + rn() * 40; q.drawImage(D.c, 0, y, w, hh, (rn() - 0.5) * 120 * st.glitch, y, w, hh); q.fillStyle = `rgba(${rn() < 0.5 ? '255,40,60' : '40,200,255'},${0.25 * st.glitch})`; q.fillRect(0, y, w, hh); } }
});
const titleDraw = (k, f) => dynDraw(AU.scrD, 'tt' + k.toFixed(2) + (f % 4), (q, w, h) => { const gr = q.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, w * 0.6); gr.addColorStop(0, '#2a3a5a'); gr.addColorStop(1, '#070a14'); q.fillStyle = gr; q.fillRect(0, 0, w, h);
  q.globalAlpha = Math.min(1, k * 1.4); q.fillStyle = '#ffffff08'; for (let i = 0; i < 60; i++) q.fillRect((i * 337) % w, (i * 191) % h, 3, 3);
  duck(q, w / 2 + 20, 330 + 6 * Math.sin(f * 0.15), 0.95 * (0.9 + 0.1 * Math.min(1, k)));
  q.lineJoin = 'round'; q.textAlign = 'center'; q.textBaseline = 'middle'; for (const [t_, y_, sz] of [['THE DECOY', 560, 112], ['EFFECT', 680, 132]]) { q.font = `900 ${sz}px Georgia, serif`; q.lineWidth = 12; q.strokeStyle = '#1a0e04'; q.strokeText(t_, w / 2, y_); q.fillStyle = '#f2c860'; q.fillText(t_, w / 2, y_); }
  txt(q, 'A PSYCHOLOGY STORY', w / 2, 775, 40, '#e8e0d0', 'Georgia, serif', 700); q.globalAlpha = 1; });
// subscription form: rows [{label, price, k(0..1 reveal), hl, strike(0..1), pct, pctK}], check (row idx), mark (pen circle 0..1 on row)
const formDraw = (st) => dynDraw(LI.formD, JSON.stringify(st), (q, w, h) => { q.fillStyle = '#fdfbf4'; q.fillRect(0, 0, w, h); noise(q, w, h, 0.03, 2000);
  q.fillStyle = '#b8202a'; q.fillRect(0, 0, w, 150); txt(q, 'THE WORLD REVIEW', w / 2, 58, 64, '#ffffff', 'Georgia, serif', 900); txt(q, 'SUBSCRIPTION CENTER', w / 2, 116, 34, '#ffe0d8', 'Arial', 700);
  txt(q, 'Pick one:', 60, 214, 44, '#2a2a34', 'Georgia, serif', 700, 'left');
  const y0 = 300, dy = 200; (st.rows || []).forEach((r, i) => { const y = y0 + i * dy + (r.dy || 0) * dy, k = r.k ?? 1; if (k <= 0) return; q.save(); q.globalAlpha = Math.min(1, k * 1.5); q.translate(0, (1 - Math.min(1, k)) * 40);
    if (r.hl) { q.fillStyle = `rgba(255,214,0,${0.35 * r.hl})`; rr(q, 34, y - 74, w - 68, 150, 18); q.fill(); }
    q.strokeStyle = '#2a2a34'; q.lineWidth = 7; q.strokeRect(62, y - 34, 64, 64); if (st.check === i) { q.strokeStyle = '#1b3a8a'; q.lineWidth = 12; q.beginPath(); q.moveTo(70, y); q.lineTo(92, y + 24); q.lineTo(138, y - 46); q.stroke(); }
    txt(q, r.label, 158, y - 18, 44, '#22222c', 'Arial Black, Arial', 900, 'left'); txt(q, r.sub || '', 158, y + 32, 30, '#6a6a76', 'Arial', 700, 'left');
    txt(q, r.price, w - 96, y - 2, 58, '#b8202a', 'Arial Black, Arial', 900, 'right');
    if (r.strike) { q.strokeStyle = '#d8262a'; q.lineWidth = 14; q.lineCap = 'round'; q.beginPath(); q.moveTo(40, y + 4); q.lineTo(40 + (w - 80) * r.strike, y - 6); q.stroke(); }
    q.restore(); });
  if (st.eq) { const k = st.eq; q.save(); q.globalAlpha = k; q.strokeStyle = '#d8262a'; q.lineWidth = 8; const x = w - 70, a = y0 + dy * 1 - 10, b = y0 + dy * 2 - 10; q.beginPath(); q.moveTo(x - 10, a); q.quadraticCurveTo(x + 24, (a + b) / 2, x - 10, b); q.stroke(); txt(q, '=', w - 30, (a + b) / 2, 50, '#d8262a'); q.restore(); }
  txt(q, 'Offer for new subscribers', w / 2, h - 50, 30, '#8a8a96', 'Arial', 700); });
// chart on the study-room screen: bars [{label, sub, v, col, k, gone(0..1)}], title
const chartDraw = (st) => dynDraw(LI.chartD, JSON.stringify(st), (q, w, h) => { const gr = q.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#f8f6f0'); gr.addColorStop(1, '#e8e4da'); q.fillStyle = gr; q.fillRect(0, 0, w, h);
  if (st.idle) { q.fillStyle = '#b8202a'; q.fillRect(0, 0, w, 92); txt(q, 'THE MAGAZINE TEST', w / 2, 48, 52, '#ffffff'); q.drawImage(magCover(5), w / 2 - 150, 160, 300, 400); txt(q, 'Which offer would you pick?', w / 2, 640, 46, '#3a3a44', 'Georgia, serif', 700); return; }
  q.fillStyle = '#b8202a'; q.fillRect(0, 0, w, 92); txt(q, st.title || 'WHAT STUDENTS PICKED', w / 2, 48, 52, '#ffffff');
  const base = 600, top = 170, n = st.bars.length, bw = 230; const live = st.bars.filter((b) => (b.gone || 0) < 1); const m = live.length;
  q.strokeStyle = '#c8c0b0'; q.lineWidth = 3; for (let i = 0; i <= 4; i++) { const y = base - (base - top) * i / 4; q.beginPath(); q.moveTo(80, y); q.lineTo(w - 60, y); q.stroke(); }
  st.bars.forEach((b, i) => { const g0 = b.gone || 0; if (g0 >= 1) return; const slot = b.slot ?? i, cx = 160 + (w - 260) * (slot + 0.5) / (b.of ?? n);
    q.save(); q.globalAlpha = 1 - g0; const hh = (base - top) * (b.v / 100) * Math.min(1, b.k ?? 1); q.fillStyle = b.col; rr(q, cx - bw / 2, base - hh, bw, Math.max(hh, 4), 10); q.fill(); q.strokeStyle = '#241726'; q.lineWidth = 5; q.stroke();
    q.lineJoin = 'round'; q.font = '900 84px Arial Black, Arial'; q.textAlign = 'center'; q.textBaseline = 'alphabetic'; q.lineWidth = 12; q.strokeStyle = '#ffffff'; const lbl = Math.round(b.v * Math.min(1, b.k ?? 1)) + '%'; q.strokeText(lbl, cx, base - hh - 22); q.fillStyle = '#22222c'; q.fillText(lbl, cx, base - hh - 22);
    txt(q, b.label, cx, base + 50, 44, '#22222c'); txt(q, b.sub, cx, base + 98, 36, '#b8202a');
    if (b.x) { q.strokeStyle = '#d8262a'; q.lineWidth = 16; q.lineCap = 'round'; q.beginPath(); q.moveTo(cx - 140, base + 110); q.lineTo(cx - 140 + 280 * b.x, top + 60); q.stroke(); q.beginPath(); if (b.x > 0.5) { const t = (b.x - 0.5) * 2; q.moveTo(cx + 140, base + 110); q.lineTo(cx + 140 - 280 * t, top + 60 + (base + 50 - top - 60) * 0); q.stroke(); } }
    q.restore(); }); });

// ---------- per-frame world state ----------
function worldState(S, f) {
  extraL.intensity = S.extra ? S.extra.i : 0; if (S.extra) { extraL.position.set(...S.extra.pos); extraL.color.set(S.extra.col || '#ffd08a'); extraL.distance = S.extra.dist || 12; }
  bulbL.intensity = 0; scrL.intensity = 0; if (S.extra2) { scrL.intensity = S.extra2.i; scrL.position.set(...S.extra2.pos); scrL.color.set(S.extra2.col || '#ffe0b0'); scrL.distance = S.extra2.dist || 14; }
  if (S.extra3) { bulbL.intensity = S.extra3.i; bulbL.position.set(...S.extra3.pos); bulbL.color.set(S.extra3.col || '#ffb35a'); bulbL.distance = S.extra3.dist || 9; }
  if (S.menu) S.menu.forEach((m, i) => menuDraw(LB.scr[i], m));
  if (S.trap != null) LB.trapBar.rotation.x = -S.trap * Math.PI * 0.98; // 0 = armed (lying toward the customer), 1 = snapped
  LB.trap.visible = !S.trapOff; const mx = S.medX ?? LB.BX.M; LB.bM.position.x = mx; LB.tents.M.position.x = mx + 0.12; LB.bM.visible = S.medX !== null; LB.tents.M.visible = S.medX !== null;
  if (S.handL) { LB.bL.position.set(...S.handL.pos); LB.bL.rotation.set(S.handL.rx || 0, 0, S.handL.rz || 0); } else { LB.bL.position.set(LB.BX.L, 1.0, LB.BZ); LB.bL.rotation.set(0, 0, 0); }
  if (S.title != null) titleDraw(S.title, f);
  if (S.audBucket) { AU.bucketL.visible = true; AU.bucketL.position.set(...S.audBucket); } else AU.bucketL.visible = false;
  if (S.form) formDraw(S.form);
  if (S.chart) chartDraw(S.chart);
  for (const k in WIPE) WIPE[k].visible = false;
  const wp = S.wipe; if (wp && WIPE[wp.kind]) { const g = WIPE[wp.kind]; g.visible = true; camera.getWorldDirection(_fwd); _rt.set(1, 0, 0).applyQuaternion(camera.quaternion); _up.set(0, 1, 0).applyQuaternion(camera.quaternion);
    const d = wp.d ?? 0.5; g.position.copy(camera.position).addScaledVector(_fwd, d).addScaledVector(_rt, wp.x * d * 2.2).addScaledVector(_up, (wp.y || 0) * d); g.quaternion.copy(camera.quaternion); if (wp.spin) g.rotateZ(wp.spin); if (wp.yaw) g.rotateY(wp.yaw); if (wp.pitch) g.rotateX(wp.pitch); }
}
