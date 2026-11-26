
// =====================================================================================
// "The $9.99 Trap" — BOUTIQUE (SHOP): 12 x 10 x 3.4 m (x -6..6, z -6..4). Light oak floor, warm white walls, pink arch display at the back.
// Front-left: display table with the hanging $9.99 tag on a fishing line (+ hook + bobber) and the little "brain" filing cabinet.
// Mid-left: face-out rail (manager hangs .99 tags). Back: platform with 3 mannequins in the same teal dress + hanging SOLD flip boards.
// No logos / brands anywhere.
// =====================================================================================
const FNT = 'MB, Arial Black, Arial', FNT2 = 'MXB, Arial Black, Arial';
const ndAlpha = (map) => new THREE.ShaderMaterial({ uniforms: { map: { value: map } }, side: THREE.DoubleSide,
  vertexShader: `varying vec3 vN; varying float vD; varying vec2 vUv; void main(){ vUv = uv; vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.); vD = -mv.z; gl_Position = projectionMatrix*mv; }`,
  fragmentShader: `uniform sampler2D map; varying vec3 vN; varying float vD; varying vec2 vUv; void main(){ if (texture2D(map, vUv).a < .5) discard; vec3 n = normalize(vN); if(!gl_FrontFacing) n = -n; gl_FragColor = vec4(n*.5+.5, vD); }` });
// alpha-cut canvas plane (tags, labels with shaped outlines). Returns mesh; D = dynTex-like {c,t,m,key}
const cutPlane = (parent, w, h, cw, ch, x = 0, y = 0, z = 0, o = {}) => { const c = cv(cw, ch, () => {}), t = ctex(c); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  const m = new THREE.MeshPhysicalMaterial({ map: t, transparent: false, alphaTest: 0.5, side: THREE.DoubleSide, roughness: o.rough ?? 0.75, emissive: o.emis ? '#ffffff' : '#000000', emissiveMap: o.emis ? t : null, emissiveIntensity: o.emis ?? 0 }); STD.push(m);
  const me = add(new THREE.PlaneGeometry(w, h), m, x, y, z, parent, { cast: o.cast ?? true }); me.userData.nd = ndAlpha(t); me.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: t, alphaTest: 0.5 });
  me.userData.D = { c, t, m, key: null }; return me; };
const SS = {}; // boutique handles

// ---------- price-tag painters (alpha-cut canvases) ----------
const tagPath = (q, w, h, cut, holeY, holeR) => { q.beginPath(); q.moveTo(cut, 0); q.lineTo(w - cut, 0); q.lineTo(w, cut); q.lineTo(w, h - 18); q.quadraticCurveTo(w, h, w - 18, h); q.lineTo(18, h); q.quadraticCurveTo(0, h, 0, h - 18); q.lineTo(0, cut); q.closePath();
  q.moveTo(w / 2 + holeR, holeY); q.arc(w / 2, holeY, holeR, 0, Math.PI * 2, true); };
const tagBase = (q, w, h, cut, holeY, holeR, col = '#fbf6e6') => { q.clearRect(0, 0, w, h); q.save(); tagPath(q, w, h, cut, holeY, holeR); q.fillStyle = col; q.fill('evenodd'); q.clip('evenodd');
  const gr = q.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(120,90,40,.12)'); q.fillStyle = gr; q.fillRect(0, 0, w, h); noise(q, w, h, 0.05, Math.round(w * h / 160), '#8a7a5a', '#ffffff');
  q.restore(); q.save(); tagPath(q, w, h, cut, holeY, holeR); q.lineWidth = Math.max(4, w * 0.018); q.strokeStyle = '#2a2026'; q.stroke(); q.restore();
  q.save(); q.beginPath(); q.arc(w / 2, holeY, holeR + w * 0.02, 0, 6.29); q.lineWidth = w * 0.014; q.strokeStyle = '#c9b98a'; q.stroke(); q.restore(); };
// generic tag: text centred; glowI = index of a char to glow (warm orange), glowK 0..1
const tagDraw = (D, text, glowK = 0, glowI = -1, col = '#c8322e') => dynDraw(D, text + '|' + glowK.toFixed(2) + '|' + glowI, (q, w, h) => { tagBase(q, w, h, w * 0.2, h * 0.12, w * 0.05);
  let sz = w * 0.42; q.font = `900 ${sz}px ${FNT}`; let tw = q.measureText(text).width; if (tw > w * 0.84) { sz *= w * 0.84 / tw; q.font = `900 ${sz}px ${FNT}`; tw = q.measureText(text).width; }
  let x = w / 2 - tw / 2; const y = h * 0.58; q.textBaseline = 'middle'; q.textAlign = 'left';
  for (let i = 0; i < text.length; i++) { const ch = text[i], cw = q.measureText(ch).width; if (i === glowI && glowK > 0) { q.save(); const gr = q.createRadialGradient(x + cw / 2, y, 4, x + cw / 2, y, sz * 0.9); gr.addColorStop(0, `rgba(255,220,90,${0.7 * glowK})`); gr.addColorStop(1, 'rgba(255,220,90,0)'); q.fillStyle = gr; q.fillRect(x - sz, y - sz, cw + 2 * sz, 2 * sz);
      q.shadowColor = '#ff9a10'; q.shadowBlur = sz * 0.35 * glowK; q.fillStyle = mixHex(col, '#ff6a00', glowK); q.fillText(ch, x, y); q.shadowBlur = 0; q.lineWidth = sz * 0.03; q.strokeStyle = '#7a2a00'; q.strokeText(ch, x, y); q.restore(); }
    else { q.fillStyle = col; q.fillText(ch, x, y); } x += cw; }
  q.fillStyle = '#2a2026'; q.globalAlpha = 0.55; q.fillRect(w * 0.18, h * 0.84, w * 0.64, h * 0.012); q.fillRect(w * 0.26, h * 0.875, w * 0.48, h * 0.012); q.globalAlpha = 1; });
const mixHex = (a, b, t) => { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const c = [16, 8, 0].map((s) => Math.round(((A >> s) & 255) * (1 - t) + ((B >> s) & 255) * t)); return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join(''); };
// hero tag "$9.99": st = { glow 0..1, arrow 0..1 (sweep progress, 0 = hidden), gone 0..1 (big 9 has left), tint }
const baitDraw = (D, st) => dynDraw(D, JSON.stringify(st), (q, w, h) => { tagBase(q, w, h, 120, 92, 30);
  q.save(); q.fillStyle = '#d8342c'; q.beginPath(); q.roundRect(150, 170, w - 300, 92, 14); q.fill(); q.font = `900 66px ${FNT}`; q.fillStyle = '#ffffff'; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText('ONLY', w / 2, 219); q.restore();
  const y = 590, gk = st.glow || 0, gone = st.gone || 0; q.textBaseline = 'alphabetic'; q.textAlign = 'left';
  q.font = `900 150px ${FNT}`; q.fillStyle = '#1e1820'; q.fillText('$', 34, y - 205);
  q.font = `900 470px ${FNT}`; const nx = 118, nw = q.measureText('9').width;
  if (gone < 1) { q.save(); q.globalAlpha = 1 - gone; if (gk > 0) { const gr = q.createRadialGradient(nx + nw / 2, y - 170, 10, nx + nw / 2, y - 170, 300); gr.addColorStop(0, `rgba(255,214,90,${0.75 * gk})`); gr.addColorStop(1, 'rgba(255,214,90,0)'); q.fillStyle = gr; q.fillRect(0, 250, w, 560);
      q.shadowColor = '#ff9a10'; q.shadowBlur = 60 * gk; } q.fillStyle = mixHex('#1e1820', '#ff7a0a', gk); q.fillText('9', nx, y); if (gk > 0) q.fillText('9', nx, y); q.restore(); }
  if (gone > 0) { q.save(); q.globalAlpha = Math.min(1, gone * 1.5) * 0.6; q.setLineDash([22, 18]); q.lineWidth = 8; q.strokeStyle = '#9a8a70'; q.strokeText('9', nx, y); q.restore(); }
  q.font = `900 152px ${FNT}`; q.fillStyle = '#1e1820'; q.fillText('.99', nx + nw - 6, y - 206); q.fillRect(nx + nw + 36, y - 180, 140, 13);
  if (st.arrow > 0) { const a0 = 46, a1 = 46 + (w - 110) * Math.min(1, st.arrow), ay = 708; q.save(); q.globalAlpha = Math.min(1, (1.25 - st.arrow) * 4, st.arrow * 6); q.strokeStyle = '#f08a1a'; q.lineWidth = 26; q.lineCap = 'round'; q.beginPath(); q.moveTo(a0, ay); q.lineTo(a1, ay); q.stroke();
    q.fillStyle = '#f08a1a'; q.beginPath(); q.moveTo(a1 + 46, ay); q.lineTo(a1 - 10, ay - 44); q.lineTo(a1 - 10, ay + 44); q.closePath(); q.fill(); q.restore(); }
  q.save(); q.globalAlpha = 0.5; q.fillStyle = '#2a2026'; for (let i = 0; i < 26; i++) q.fillRect(150 + i * 15, 800, i % 3 ? 6 : 10, 90); q.restore(); q.font = `800 34px ${FNT2}`; q.fillStyle = '#5a4e40'; q.textAlign = 'center'; q.fillText('KNIT SWEATER  \u2022  ONE SIZE', w / 2, 930); });


// ---------- painted textures for the shop ----------
const oakFloorT = cv(1024, 1024, (g, w, h) => { for (let r = 0; r < 8; r++) { let x = -R() * 300; while (x < w) { const L = 260 + R() * 360; g.fillStyle = `hsl(${32 + R() * 6},${38 + R() * 10}%,${66 + R() * 9}%)`; g.fillRect(x, r * 128, L, 128);
  for (let k = 0; k < 7; k++) { g.strokeStyle = `rgba(150,105,60,${0.12 + R() * 0.12})`; g.lineWidth = 1.5; g.beginPath(); const y = r * 128 + 10 + R() * 108; g.moveTo(x, y); g.bezierCurveTo(x + L * 0.3, y + (R() - 0.5) * 10, x + L * 0.7, y + (R() - 0.5) * 10, x + L, y + (R() - 0.5) * 6); g.stroke(); }
  g.fillStyle = 'rgba(110,75,45,.55)'; g.fillRect(x, r * 128, 3, 128); x += L; } g.fillStyle = 'rgba(110,75,45,.6)'; g.fillRect(0, r * 128, w, 3); } noise(g, w, h, 0.06, 9000); });
const wallWT = cv(512, 512, (g, w, h) => { g.fillStyle = '#f6efe6'; g.fillRect(0, 0, w, h); blobs(g, w, h, ['#00000008', '#ffffff18'], 30, 30, 90, 1); noise(g, w, h, 0.04, 4000); });
const pinkT = cv(512, 512, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#f8c8cf'); gr.addColorStop(1, '#f1a9b6'); g.fillStyle = gr; g.fillRect(0, 0, w, h); blobs(g, w, h, ['#ffffff14', '#c8708010'], 26, 30, 90, 1); noise(g, w, h, 0.04, 3000); });
const knitT = (c0, c1) => cv(128, 128, (g, w, h) => { g.fillStyle = c0; g.fillRect(0, 0, w, h); g.strokeStyle = c1; g.lineWidth = 2; g.globalAlpha = 0.35; for (let y = 0; y < h; y += 8) for (let x = 0; x < w; x += 8) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + 4, y + 6); g.lineTo(x + 8, y); g.stroke(); } g.globalAlpha = 1; noise(g, w, h, 0.08, 800); });
const dressT = cv(256, 256, (g, w, h) => { g.fillStyle = '#23a39a'; g.fillRect(0, 0, w, h); for (let i = 0; i < 60; i++) { const x = R() * w, y = R() * h; g.fillStyle = R() < 0.5 ? '#ffffff2a' : '#0a5a5422'; g.beginPath(); g.arc(x, y, 3 + R() * 4, 0, 6.28); g.fill(); }
  g.strokeStyle = '#0e6e6830'; g.lineWidth = 3; for (let x = 0; x < w; x += 22) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 8, h); g.stroke(); } noise(g, w, h, 0.06, 1500); });
const SM = {
  floor: texM(oakFloorT, 5, 5, { roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.35 }), wall: texM(wallWT, 4, 2, { roughness: 0.95 }), pink: texM(pinkT, 2, 2, { roughness: 0.9 }), ceil: toon({ color: '#fbf7f0', roughness: 1 }),
  oakT: texM(P.planks(5), 1, 1, { roughness: 0.55, clearcoat: 0.3 }), whiteG: toon({ color: '#fbfaf6', roughness: 0.25, clearcoat: 0.6 }), brassS: toon({ color: '#e0b25a', metalness: 0.8, roughness: 0.28 }),
  rail: toon({ color: '#d8dde3', metalness: 0.85, roughness: 0.2 }), dress: texM(dressT, 2, 2, { roughness: 0.75, side: THREE.DoubleSide }), mannq: toon({ color: '#f4efe8', roughness: 0.3, clearcoat: 0.7 }),
  garm: toon({ color: '#ffffff', roughness: 0.85, map: ctex(knitT('#ffffff', '#9a9a9a'), 6, 6) }), plant: toon({ color: '#4e8a46', roughness: 0.9 }), pot: toon({ color: '#e9e2d6', roughness: 0.5 }),
  navy: toon({ color: '#1f2a44', roughness: 0.5 }), line: toon({ color: '#f2f6f8', roughness: 0.3 }), mint: toon({ color: '#8fd4c4', roughness: 0.45, clearcoat: 0.4 }), mintD: toon({ color: '#6cbcaa', roughness: 0.45, clearcoat: 0.4 }),
  hookM: toon({ color: '#dfe5ea', metalness: 0.95, roughness: 0.12 }), bobR: toon({ color: '#e2392f', roughness: 0.3, clearcoat: 0.8 }), bobW: toon({ color: '#fbfbf6', roughness: 0.3, clearcoat: 0.8 }),
  brain: toon({ color: '#f5a3b8', roughness: 0.55, clearcoat: 0.3, map: ctex(cv(256, 256, (g, w, h) => { g.fillStyle = '#f5a3b8'; g.fillRect(0, 0, w, h); g.strokeStyle = '#d4708a'; g.lineWidth = 7; g.lineCap = 'round';
    for (let i = 0; i < 26; i++) { g.beginPath(); let x = R() * w, y = R() * h; g.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (R() - 0.5) * 70; y += (R() - 0.5) * 70; g.quadraticCurveTo(x + 20, y - 20, x, y); } g.stroke(); } })) }),
};
// ---------- garment silhouettes (extruded, inked by the post pass) ----------
const shirtShape = (() => { const s = new THREE.Shape(); const pts = [[-0.07, 0], [0.07, 0], [0.24, -0.06], [0.3, -0.26], [0.2, -0.29], [0.18, -0.2], [0.19, -0.7], [-0.19, -0.7], [-0.18, -0.2], [-0.2, -0.29], [-0.3, -0.26], [-0.24, -0.06]];
  s.moveTo(...pts[0]); for (const p of pts.slice(1)) s.lineTo(...p); s.lineTo(...pts[0]); return s; })();
const dressShape = (() => { const s = new THREE.Shape(); s.moveTo(-0.08, 0); s.lineTo(0.08, 0); s.quadraticCurveTo(0.16, -0.03, 0.17, -0.12); s.lineTo(0.13, -0.32); s.quadraticCurveTo(0.22, -0.6, 0.29, -0.95); s.quadraticCurveTo(0, -0.99, -0.29, -0.95); s.quadraticCurveTo(-0.22, -0.6, -0.13, -0.32); s.lineTo(-0.17, -0.12); s.quadraticCurveTo(-0.16, -0.03, -0.08, 0); return s; })();
const garmGeo = (shape) => { const g = new THREE.ExtrudeGeometry(shape, { depth: 0.022, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 1, curveSegments: 6 }); g.translate(0, -0.06, -0.011); // hanger hook above y=0
  return g; };
const SHIRT = garmGeo(shirtShape), DRESSG = garmGeo(dressShape);
const HANGER = merge([[new THREE.TorusGeometry(0.03, 0.004, 4, 10, Math.PI * 1.3), mtx(0, 0.0, 0, 0, 0, 0.2)], [new THREE.CylinderGeometry(0.004, 0.004, 0.42, 5).rotateZ(Math.PI / 2), mtx(0, -0.06, 0)]]);
const GCOL = ['#ef7458', '#f2c23a', '#2f8a7a', '#f4efe2', '#e86a8a', '#5a7ac8', '#c8a8e0', '#7ab86a', '#1f2a44', '#e0a070', '#f5d8c8', '#3a9ab0'];
const garmList = (pts, seed = 1, kinds = 0.3) => { const rn = P.rng(seed); const A = [], B = []; pts.forEach((p, i) => { const o = { ...p, col: GCOL[Math.floor(rn() * GCOL.length)] }; (rn() < kinds ? B : A).push(o); }); return [A, B]; };
const hangGarments = (parent, pts, seed) => { const [A, B] = garmList(pts, seed); if (A.length) instP(SHIRT, SM.garm, A, parent); if (B.length) instP(DRESSG, SM.garm, B, parent); instP(HANGER, SM.rail, pts.map((p) => ({ ...p, col: undefined })), parent, nocast); };
// round rack: ring rail r at height hgt; garments side-hung around it
const roundRack = (parent, x, z, r = 0.5, hgt = 1.35, seed = 3) => { const g = grp(parent, x, 0, z);
  add(new THREE.TorusGeometry(r, 0.012, 6, 40).rotateX(Math.PI / 2), SM.rail, 0, hgt, 0, g); add(cyl(0.02, 0.02, hgt, 8), SM.rail, 0, hgt / 2, 0, g); add(cyl(0.26, 0.28, 0.04, 20), SM.rail, 0, 0.02, 0, g);
  for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2; add(cyl(0.008, 0.008, r, 6).rotateZ(Math.PI / 2), SM.rail, Math.cos(a) * r / 2, hgt, Math.sin(a) * r / 2, g).rotation.y = -a; }
  const pts = []; const n = Math.round(2 * Math.PI * r / 0.075); for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + 0.1; const tx = -Math.sin(a), tz = Math.cos(a); pts.push({ x: Math.cos(a) * r, y: hgt, z: Math.sin(a) * r, ry: Math.atan2(tx, tz) + Math.PI / 2 + (R() - 0.5) * 0.15 }); }
  hangGarments(g, pts, seed); return g; };
// straight rail along local x, side-hung garments
const straightRack = (parent, x, z, len = 1.6, hgt = 1.45, ry = 0, seed = 5) => { const g = grp(parent, x, 0, z, ry);
  add(cyl(0.013, 0.013, len, 8).rotateZ(Math.PI / 2), SM.rail, 0, hgt, 0, g); for (const s of [-1, 1]) { add(cyl(0.016, 0.016, hgt, 8), SM.rail, s * len / 2, hgt / 2, 0, g); add(box(0.04, 0.03, 0.5), SM.rail, s * len / 2, 0.015, 0, g); }
  const pts = []; for (let xx = -len / 2 + 0.1; xx < len / 2 - 0.08; xx += 0.07) pts.push({ x: xx, y: hgt, z: 0, ry: Math.PI / 2 + (R() - 0.5) * 0.2 }); hangGarments(g, pts, seed); return g; };
const foldStack = (parent, x, y, z, n = 6, ry = 0, seed = 7) => { const rn = P.rng(seed), L = []; for (let i = 0; i < n; i++) L.push({ x: x + (rn() - 0.5) * 0.02, y: y + 0.03 + i * 0.055, z, ry: ry + (rn() - 0.5) * 0.08, col: GCOL[Math.floor(rn() * GCOL.length)] }); instP(tbox(0.34, 0.05, 0.27, 0.3), SM.garm, L, parent); };
const plantPot = (parent, x, z, h = 1.2) => { const g = grp(parent, x, 0, z); add(cyl(0.2, 0.15, 0.4, 18), SM.pot, 0, 0.2, 0, g); add(cyl(0.18, 0.18, 0.02, 18), toon({ color: '#4a3424' }), 0, 0.39, 0, g, nocast);
  for (let i = 0; i < 9; i++) { const a = i * 2.4, r = 0.1 + (i % 3) * 0.05; const lf = add(new THREE.SphereGeometry(0.13, 10, 8), SM.plant, Math.cos(a) * r, 0.5 + (i / 9) * (h - 0.5), Math.sin(a) * r, g); lf.scale.set(1.2, 0.5, 0.6); lf.rotation.set(0.3 * Math.sin(i), a, 0.5 * Math.cos(i)); } return g; };
const pendant = (parent, x, z, y = 2.7, col = '#fff3d6') => { add(cyl(0.004, 0.004, 3.4 - y, 4), M.black, x, (3.4 + y) / 2, z, parent, nocast); add(new THREE.CylinderGeometry(0.06, 0.2, 0.16, 20, 1, true), toon({ color: '#e0b25a', metalness: 0.7, roughness: 0.3, side: THREE.DoubleSide }), x, y, z, parent, nocast); lamp(parent, x, y - 0.07, z, 0.07, col); };

// =====================================================================================
{ const O = SHOP, g = grp(world, O[0], 0, O[2]); SS.g = g; const RW = 12, RD = 10, RH = 3.4, zc = -1;
  add(new THREE.PlaneGeometry(RW, RD).rotateX(-Math.PI / 2), SM.floor, 0, 0, zc, g, nocast); add(new THREE.PlaneGeometry(RW, RD).rotateX(Math.PI / 2), SM.ceil, 0, RH, zc, g, nocast);
  for (const [x, z, w, ry] of [[0, -6, RW, 0], [-6, zc, RD, Math.PI / 2], [6, zc, RD, -Math.PI / 2], [0, 4, RW, Math.PI]]) { const wg = grp(g, x, 0, z, ry); add(new THREE.PlaneGeometry(w, RH), SM.wall, 0, RH / 2, 0, wg, nocast);
    add(tbox(w, 0.12, 0.02, 0.5), SM.whiteG, 0, 0.06, 0.012, wg, nocast); add(tbox(w, 0.08, 0.04, 0.5), SM.whiteG, 0, RH - 0.04, 0.02, wg, nocast); }
  // ceiling: track lights + pendants
  for (const x of [-3, 0, 3]) { add(box(0.05, 0.04, 8.5), M.black, x, RH - 0.03, zc, g, nocast); for (let k = 0; k < 4; k++) { const z = -4.6 + k * 2.4; add(cyl(0.035, 0.045, 0.12, 10), M.black, x, RH - 0.1, z, g, nocast); lamp(g, x, RH - 0.17, z, 0.03, '#fff6e0'); } }
  for (const [x, z] of [[-1.6, 2.2], [1.2, 2.2], [-1.6, -0.4], [4.4, 1.4]]) pendant(g, x, z, 2.55);
  // front wall: shop windows with a bright street (painted, emissive) + entrance
  { const wg = grp(g, 0, 0, 3.97, Math.PI); SS.outD = dynTex(1024, 380, true); for (const x of [-3.6, 3.6]) { add(tbox(3.6, 2.5, 0.06, 0.5), SM.whiteG, x, 1.5, 0, wg, nocast); const pn = add(new THREE.PlaneGeometry(3.4, 2.3), SS.outD.m, x, 1.5, 0.035, wg, nocast); pn.userData.flatNd = true; }
    add(tbox(1.8, 2.6, 0.06, 0.5), SM.whiteG, 0, 1.3, 0, wg, nocast); add(new THREE.PlaneGeometry(1.6, 2.45), SS.outD.m, 0, 1.28, 0.035, wg, nocast).userData.flatNd = true; }
  // ---- back wall: pink arch feature + platform + 3 mannequins + SOLD boards ----
  { const D = S_.disp, dg = grp(g, D[0], 0, D[2]); SS.disp = dg;
    const arch = new THREE.Shape(); arch.moveTo(-1.75, 0); arch.lineTo(1.75, 0); arch.lineTo(1.75, 2.0); arch.absarc(0, 2.0, 1.75, 0, Math.PI, false); arch.lineTo(-1.75, 0);
    const ag = add(new THREE.ExtrudeGeometry(arch, { depth: 0.06, bevelEnabled: false, curveSegments: 40 }), SM.pink, 0, 0, -1.37, dg, nocast); ag.scale.y = 0.86;
    const strip = []; for (let i = 0; i <= 40; i++) { const a = Math.PI * i / 40; strip.push(new THREE.Vector3(Math.cos(a) * 1.82, (2.0 + Math.sin(a) * 1.82) * 0.86, -1.3)); }
    add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(1.82, 0.1, -1.3), ...strip, new THREE.Vector3(-1.82, 0.1, -1.3)]), 80, 0.018, 6), glowM('#fff1d8'), 0, 0, 0, dg, nocast);
    add(tbox(3.0, 0.2, 1.4, 0.5), SM.whiteG, 0, 0.1, -0.15, dg); add(tbox(3.04, 0.02, 1.44, 0.5), SM.oakT, 0, 0.21, -0.15, dg, nocast);
    SS.mq = []; for (const dx of [-0.7, 0, 0.7]) SS.mq.push(mannequin(dg, dx, -0.25));
    // hanging SOLD flip boards
    add(cyl(0.015, 0.015, 2.6, 8).rotateZ(Math.PI / 2), SM.rail, 0, 3.0, -0.25, dg, nocast); for (const s of [-1.3, 1.3]) add(cyl(0.01, 0.01, 0.4, 6), SM.rail, s, 3.2, -0.25, dg, nocast);
    SS.boards = [-0.7, 0, 0.7].map((dx) => { const bg = grp(dg, dx, 2.52, -0.25); add(tbox(0.52, 0.36, 0.05, 0.3), SM.navy, 0, 0, 0, bg); for (const s of [-0.18, 0.18]) add(cyl(0.004, 0.004, 0.32, 4), SM.rail, s, 0.34, 0, bg, nocast);
      const D_ = dynTex(512, 352, true); const fp = add(new THREE.PlaneGeometry(0.5, 0.344), D_.m, 0, 0, 0.027, bg, nocast); fp.userData.flatNd = true; return { g: bg, D: D_ }; });
    for (const s of [-1, 1]) { plantPot(dg, s * 2.05, -0.5, 1.35); add(cyl(0.05, 0.07, 0.14, 12), M.black, s * 1.2, 3.33, 0.9, dg, nocast); }
    SS.dspL = new THREE.PointLight('#ffe6c8', 0, 6, 1.5); SS.dspL.position.set(0, 2.6, 1.0); dg.add(SS.dspL); }
  // ---- hook table (front-left) ----
  { const T0 = S_.table, tg = grp(g, T0[0], 0, T0[2]); SS.tableG = tg; add(tbox(1.25, 0.05, 0.72, 0.5), SM.oakT, 0, 0.735, 0, tg); for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) add(cyl(0.02, 0.016, 0.71, 8), SM.brassS, sx * 0.56, 0.355, sz * 0.31, tg);
    add(tbox(1.15, 0.03, 0.62, 0.5), SM.oakT, 0, 0.18, 0, tg); foldStack(tg, -0.38, 0.76, 0.08, 5, 0.1, 11); foldStack(tg, -0.4, 0.2, 0.0, 4, 0, 12); foldStack(tg, 0.3, 0.2, 0.0, 4, 0, 13);
    // little "brain files" cabinet on the table (to the right of the tag)
    // side-by-side drawers ($9 left, $10 right) so both labels sit above the caption band
    const C0 = S_.cab, cg = grp(g, C0[0], C0[1], C0[2], -0.18); SS.cab = cg; add(tbox(0.54, 0.3, 0.34, 0.3), SM.mint, 0, 0.15, 0, cg); add(tbox(0.56, 0.02, 0.36, 0.3), SM.mintD, 0, 0.31, 0, cg);
    for (const s of [-1, 1]) add(box(0.04, 0.03, 0.3), SM.brassS, s * 0.22, 0.015, 0, cg);
    SS.drw = [-0.13, 0.13].map((x, i) => { const dg_ = grp(cg, x, 0.15, 0.17); add(tbox(0.24, 0.24, 0.03, 0.3), SM.mintD, 0, 0, 0, dg_); add(tbox(0.22, 0.22, 0.3, 0.3), SM.mint, 0, 0, -0.16, dg_);
      add(box(0.1, 0.014, 0.02), SM.brassS, 0, -0.075, 0.022, dg_, nocast); const D_ = dynTex(256, 128, false); const lp = add(new THREE.PlaneGeometry(0.17, 0.085), D_.m, 0, 0.025, 0.0165, dg_, nocast); return { g: dg_, D: D_ }; });
    const br = add(new THREE.SphereGeometry(0.09, 20, 14), SM.brain, 0, 0.38, -0.02, cg); br.scale.set(1.15, 0.78, 0.95); SS.brain = br; add(box(0.008, 0.05, 0.14), toon({ color: '#d4708a' }), 0, 0.42, -0.02, cg, nocast); }
  // ---- the bait: hanging $9.99 tag on a fishing line (hook through the hole, red/white bobber above) ----
  { const TG = S_.tag, hg = grp(g, TG[0], TG[1], TG[2]); SS.hookG = hg; // group origin = tag centre at rest; animated in worldState
    hg.scale.setScalar(1.2); const tagM = cutPlane(hg, 0.34, 0.48, 680, 960, 0, 0, 0, { rough: 0.7 }); SS.tag = tagM; tagM.userData.ndSkip = false;
    // hook: eye at y .40 above the tag centre, shank down, bend through the hole (hole at y +.19), point up behind the tag
    const hp = [[0, 0.42, 0.012], [0, 0.33, 0.014], [0.002, 0.25, 0.012], [0.02, 0.19, 0.004], [0.04, 0.175, -0.008], [0.062, 0.19, -0.014], [0.07, 0.23, -0.012], [0.066, 0.27, -0.006]].map((p) => new THREE.Vector3(...p));
    add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hp), 40, 0.0055, 8), SM.hookM, 0, 0, 0, hg, nocast); add(new THREE.ConeGeometry(0.009, 0.026, 8), SM.hookM, 0.066, 0.28, -0.006, hg, nocast).rotation.z = 0.1; // point
    add(new THREE.ConeGeometry(0.006, 0.016, 6), SM.hookM, 0.058, 0.262, -0.006, hg, nocast).rotation.z = -2.6; // barb
    add(new THREE.TorusGeometry(0.011, 0.0035, 6, 14), SM.hookM, 0, 0.432, 0.012, hg, nocast); // eye
    SS.line = add(cyl(0.0022, 0.0022, 1, 5), SM.line, 0, 0, 0.012, hg, nocast); // scaled per frame up to the ceiling
    const bb = grp(hg, 0, 0.5, 0.012); SS.bob = bb; add(new THREE.SphereGeometry(0.036, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), SM.bobR, 0, 0, 0, bb, nocast); add(new THREE.SphereGeometry(0.036, 16, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), SM.bobW, 0, 0, 0, bb, nocast);
    add(cyl(0.004, 0.004, 0.05, 6), SM.bobR, 0, 0.05, 0, bb, nocast); add(new THREE.TorusGeometry(0.036, 0.004, 4, 24).rotateX(Math.PI / 2), M.black, 0, 0, 0, bb, nocast); }
  // ---- face-out rail (manager hangs .99 tags) ----
  { const RL = S_.rail, rg = grp(g, RL[0], 0, RL[2]); SS.railG = rg; const len = 3.4; add(cyl(0.014, 0.014, len, 8).rotateZ(Math.PI / 2), SM.rail, 0, 1.62, 0, rg); for (const s of [-1, 1]) { add(cyl(0.018, 0.018, 1.62, 8), SM.rail, s * len / 2, 0.81, 0, rg); add(box(0.05, 0.03, 0.6), SM.rail, s * len / 2, 0.015, 0, rg); }
    const pts = []; SS.railTags = []; for (let i = 0; i < 7; i++) { const x = -1.42 + i * 0.47; pts.push({ x, y: 1.62, z: 0.02, ry: (R() - 0.5) * 0.06 }); }
    const [A, B] = garmList(pts, 21, 0.45); if (A.length) instP(SHIRT, SM.garm, A, rg); if (B.length) instP(DRESSG, SM.garm, B, rg); instP(HANGER, SM.rail, pts.map((p) => ({ ...p, col: undefined })), rg, nocast);
    for (let i = 0; i < 7; i++) { const tg_ = grp(rg, pts[i].x + 0.13, 1.36, 0.06); add(cyl(0.0012, 0.0012, 0.1, 3), M.black, 0, 0.07, 0, tg_, nocast); const tp = cutPlane(tg_, 0.15, 0.21, 300, 420, 0, -0.08, 0, { emis: 0.1 }); tagDraw(tp.userData.D, ['$4.99', '$7.99', '$12.99', '$9.99', '$19.99', '$24.99', '$14.99'][i], 0); tg_.visible = false; SS.railTags.push(tg_); }
    // a second side-hung rail behind + shelves on the left wall
    straightRack(g, -2.6, -3.6, 2.6, 1.5, 0, 31); for (const z of [-4.4, -2.0, 0.4]) { add(tbox(0.42, 0.04, 1.6, 0.4), SM.oakT, -5.75, 1.25, z, g); add(tbox(0.42, 0.04, 1.6, 0.4), SM.oakT, -5.75, 1.75, z, g); for (let k = 0; k < 3; k++) { foldStack(g, -5.75, 1.27, z - 0.5 + k * 0.5, 4, Math.PI / 2, 40 + k + z * 10); foldStack(g, -5.75, 1.77, z - 0.5 + k * 0.5, 3, Math.PI / 2, 50 + k + z * 10); } } }
  // ---- other racks / mirror / cash desk / plants ----
  roundRack(g, 0.7, 0.2, 0.5, 1.32, 61); roundRack(g, -4.9, 2.4, 0.55, 1.32, 62); roundRack(g, -0.6, -4.0, 0.5, 1.32, 63); straightRack(g, 4.6, -2.4, 2.4, 1.5, Math.PI / 2, 64); straightRack(g, -4.4, -4.9, 2.2, 1.5, 0, 65);
  { const mg = grp(g, 5.96, 0, -0.6, -Math.PI / 2); add(tbox(1.0, 2.1, 0.05, 0.5), SM.brassS, 0, 1.15, 0, mg); const mm = add(new THREE.PlaneGeometry(0.9, 2.0), toon({ color: '#cfe0e8', metalness: 0.9, roughness: 0.05 }), 0, 1.15, 0.03, mg, nocast); }
  { const C = S_.counter, cg = grp(g, C[0], 0, C[2], -Math.PI / 2); add(tbox(2.2, 1.0, 0.6, 0.5), SM.whiteG, 0, 0.5, 0, cg); add(tbox(2.3, 0.05, 0.7, 0.5), SM.oakT, 0, 1.02, 0, cg); add(tbox(2.2, 0.8, 0.02, 0.5), SM.pink, 0, 0.5, 0.31, cg, nocast);
    add(tbox(0.36, 0.06, 0.3, 0.2), M.dark, -0.5, 1.08, 0, cg); add(tbox(0.3, 0.22, 0.03, 0.2), M.dark, -0.5, 1.22, -0.1, cg); add(new THREE.PlaneGeometry(0.26, 0.17), glowM('#bfe6f0'), -0.5, 1.23, -0.084, cg, nocast);
    for (let i = 0; i < 4; i++) add(tbox(0.28, 0.32, 0.12, 0.2), toon({ color: ['#f2c23a', '#e86a8a', '#f4efe2', '#2f8a7a'][i] }), 0.35 + i * 0.06, 1.2, 0.05 - i * 0.03, cg); }
  for (const [x, z] of [[-5.4, 3.3], [5.4, 3.3], [-5.4, -5.4], [5.4, -5.4]]) plantPot(g, x, z, 1.5);
  // floor rug under the hook table
  add(new THREE.CircleGeometry(1.6, 40).rotateX(-Math.PI / 2), texM(cv(256, 256, (q, w, h) => { q.fillStyle = '#efe0cc'; q.fillRect(0, 0, w, h); q.strokeStyle = '#e0c8a8'; q.lineWidth = 10; for (let r = 30; r < 128; r += 24) { q.beginPath(); q.arc(128, 128, r, 0, 6.28); q.stroke(); } noise(q, w, h, 0.1, 3000); }), 1, 1, { roughness: 1 }), -1.3, 0.004, 1.0, g, nocast);
}
// ---------- mannequin with the teal dress (real scale ~1.75 m on its base) ----------
function mannequin(parent, x, z) { const g = grp(parent, x, 0.21, z);
  add(cyl(0.17, 0.19, 0.025, 24), SM.rail, 0, 0.012, 0, g); add(cyl(0.012, 0.012, 0.5, 8), SM.rail, 0, 0.27, 0, g);
  for (const s of [-1, 1]) { add(cyl(0.035, 0.05, 0.6, 10), SM.mannq, s * 0.065, 0.33, 0, g).rotation.z = s * 0.03; add(new THREE.SphereGeometry(0.04, 10, 8), SM.mannq, s * 0.068, 0.04, 0.03, g).scale.set(1, 0.6, 1.6); }
  const prof = [[0.0, 1.47], [0.065, 1.46], [0.15, 1.41], [0.165, 1.33], [0.155, 1.24], [0.125, 1.1], [0.135, 1.04], [0.19, 0.92], [0.25, 0.76], [0.285, 0.63], [0.29, 0.6], [0.0, 0.6]].map(([r, y]) => new THREE.Vector2(r, y));
  const dr = add(new THREE.LatheGeometry(prof, 36), SM.dress, 0, 0, 0, g); dr.scale.z = 0.72;
  add(new THREE.TorusGeometry(0.128, 0.012, 6, 30).rotateX(Math.PI / 2), toon({ color: '#f4ecd8', roughness: 0.5 }), 0, 1.075, 0, g).scale.set(1, 0.72, 1); // belt (scaled in z via group?)
  for (const s of [-1, 1]) { const a = add(cyl(0.028, 0.022, 0.5, 10), SM.mannq, s * 0.19, 1.15, 0, g); a.rotation.z = s * 0.16; add(new THREE.SphereGeometry(0.03, 10, 8), SM.mannq, s * 0.225, 0.9, 0.0, g); }
  add(cyl(0.035, 0.04, 0.1, 12), SM.mannq, 0, 1.51, 0, g); const hd = add(new THREE.SphereGeometry(0.1, 20, 16), SM.mannq, 0, 1.65, 0.0, g); hd.scale.set(0.92, 1.22, 1.0);
  // price tag hanging at the hip (pops in on its word): string + alpha-cut tag
  const tg = grp(g, 0.06, 1.43, 0.17); add(cyl(0.0012, 0.0012, 0.05, 3), M.black, 0, -0.01, 0, tg, nocast); const tp = cutPlane(tg, 0.2, 0.28, 400, 560, 0, -0.16, 0.01, { emis: 0.1 }); tg.visible = false;
  return { g, tag: tg, tagP: tp }; }
