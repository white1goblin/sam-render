
// ---------- dynamic painters ----------
const shopOutDraw = (D) => dynDraw(D, 'day', (q, w, h) => { const gr = q.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#bfe0f6'); gr.addColorStop(1, '#f4f2ea'); q.fillStyle = gr; q.fillRect(0, 0, w, h);
  const rn = P.rng(5); for (let i = 0; i < 9; i++) { const x = i * 120 - 20, bw = 110, bh = 150 + rn() * 120; q.fillStyle = ['#f2d8c0', '#d8e4ec', '#f4e8c8', '#e8d0d8', '#d8e8d0'][i % 5]; q.fillRect(x, h - 90 - bh, bw, bh);
    q.fillStyle = '#ffffff90'; for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) q.fillRect(x + 12 + c * 34, h - 80 - bh + 16 + r * 40, 22, 26); }
  q.fillStyle = '#c8c4bc'; q.fillRect(0, h - 90, w, 90); q.fillStyle = '#5d8a3a'; for (let i = 0; i < 8; i++) { q.beginPath(); q.arc(60 + i * 135, h - 110, 46, 0, 6.28); q.fill(); } q.fillStyle = '#ffffff'; q.globalAlpha = 0.25; q.fillRect(0, 0, w, h); q.globalAlpha = 1; });
const labOutDraw = (D) => dynDraw(D, 'lab', (q, w, h) => { const gr = q.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#a8c8e8'); gr.addColorStop(1, '#e8ecef'); q.fillStyle = gr; q.fillRect(0, 0, w, h);
  q.fillStyle = '#a8584a'; q.fillRect(40, 150, 300, 220); q.fillStyle = '#e8e0d0'; for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) q.fillRect(56 + c * 48, 170 + r * 64, 28, 40); q.fillStyle = '#7a9a52';
  for (let i = 0; i < 6; i++) { q.beginPath(); q.arc(i * 100 + 20, 340 + (i % 2) * 20, 70, 0, 6.28); q.fill(); } q.fillStyle = '#6a8a4a'; q.fillRect(0, 370, w, 50); q.fillStyle = '#ffffff'; q.globalAlpha = 0.2; q.fillRect(0, 0, w, h); q.globalAlpha = 1; });
const flipDigit = (q, x, y, w, h, cur, nxt, t) => { const mid = y + h / 2; const half = (ch, top, sy = 1) => { q.save(); q.beginPath(); q.rect(x, top ? y : mid, w, h / 2); q.clip();
    q.translate(0, mid); q.scale(1, sy); q.translate(0, -mid); q.fillStyle = top ? '#2c3650' : '#252e46'; q.beginPath(); q.roundRect(x, y, w, h, 14); q.fill(); q.fillStyle = '#fbf6e6'; q.font = `900 ${h * 0.78}px ${FNT}`; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText(ch, x + w / 2, mid + h * 0.04); q.restore(); };
  if (!(t > 0) || cur === nxt) { half(cur, true); half(cur, false); }
  else { half(nxt, true); half(cur, false); if (t < 0.5) half(cur, true, 1 - 2 * t); else half(nxt, false, 2 * t - 1); }
  q.fillStyle = '#0c1020'; q.fillRect(x, mid - 2, w, 4); for (const s of [0.18, 0.82]) { q.fillStyle = '#8a8e96'; q.fillRect(x - 4, y + h * s - 3, 8, 6); q.fillRect(x + w - 4, y + h * s - 3, 8, 6); } };
const boardDraw = (D, v, win = 0) => dynDraw(D, v.toFixed(3) + '|' + win.toFixed(2), (q, w, h) => { q.fillStyle = '#18203a'; q.fillRect(0, 0, w, h); q.strokeStyle = mixHex('#3a4870', '#f2c23a', win); q.lineWidth = 10 + 8 * win; q.strokeRect(6, 6, w - 12, h - 12);
  q.font = `900 46px ${FNT}`; q.fillStyle = mixHex('#9fb0d8', '#f2c23a', win); q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText('SOLD', w / 2, 46);
  const n = Math.floor(v + 1e-6), t = v - n, a = String(Math.min(99, n)).padStart(2, '0'), b = String(Math.min(99, n + 1)).padStart(2, '0');
  for (let i = 0; i < 2; i++) flipDigit(q, 58 + i * 206, 86, 190, 240, a[i], b[i], t > 0.001 ? t : 0); });
const labelDraw = (D, s, x = 0) => dynDraw(D, s + '|' + x.toFixed(2), (q, w, h) => { q.fillStyle = '#fbf6e6'; q.fillRect(0, 0, w, h); q.strokeStyle = '#2a2026'; q.lineWidth = 8; q.strokeRect(4, 4, w - 8, h - 8);
  q.font = `900 84px ${FNT}`; q.fillStyle = '#1e1820'; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText(s, w / 2, h / 2 + 4);
  if (x > 0) { q.save(); q.globalAlpha = Math.min(1, x * 2); q.strokeStyle = '#e0261e'; q.lineWidth = 22; q.lineCap = 'round'; const k = Math.min(1, x); q.beginPath(); q.moveTo(30, 18); q.lineTo(30 + (w - 60) * k, 18 + (h - 36) * k); q.stroke();
    if (x > 0.5) { const k2 = Math.min(1, (x - 0.5) * 2); q.beginPath(); q.moveTo(w - 30, 18); q.lineTo(w - 30 - (w - 60) * k2, 18 + (h - 36) * k2); q.stroke(); } q.restore(); } });

// ---------- wipe occluders (an object crossing just in front of the lens = hidden cut) ----------
const WIPE = {}; const wipeG = new THREE.Group(); scene.add(wipeG);
{ const mk = (k, g) => { wipeG.add(g); g.visible = false; g.traverse((o) => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; o.userData.wipe = true; o.renderOrder = 10; } }); WIPE[k] = g; };
  const pg = new THREE.Group(); const pm = add(new THREE.PlaneGeometry(1.1, 1.46), toon({ map: ctex(catCover('B')), side: THREE.DoubleSide, roughness: 0.7 }), 0, 0, 0, pg, nocast); mk('page', pg);
  const rg = new THREE.Group(); [['#ef7458', -0.42], ['#2f8a7a', 0.08], ['#f2c23a', 0.55]].forEach(([c, x], i) => { const m = add(i === 1 ? DRESSG : SHIRT, toon({ color: c, roughness: 0.85 }), x, 1.05, i * 0.03, rg, nocast); m.scale.set(1.9, 1.9, 1.9); m.rotation.z = x * 0.08; }); mk('rack', rg); }

// ---------- per-frame world state ----------
const SETS = { shop: [SS.g], lab: [LS.g] };
let _lastSet = '';
const _tagBase = new THREE.Vector3(...S_.tag);
function worldState(S, f) {
  extraL.intensity = S.extra ? S.extra.i : 0; if (S.extra) { extraL.position.set(...S.extra.pos); extraL.color.set(S.extra.col || '#ffd08a'); extraL.distance = S.extra.dist || 12; }
  scrL.intensity = 0; bulbL.intensity = 0; if (S.extra2) { scrL.intensity = S.extra2.i; scrL.position.set(...S.extra2.pos); scrL.color.set(S.extra2.col || '#ffe0b0'); scrL.distance = S.extra2.dist || 14; }
  if (S.extra3) { bulbL.intensity = S.extra3.i; bulbL.position.set(...S.extra3.pos); bulbL.color.set(S.extra3.col || '#ffb35a'); bulbL.distance = S.extra3.dist || 9; }
  if (S.set !== _lastSet) { _lastSet = S.set; for (const k in SETS) for (const g of SETS[k]) g.visible = (k === S.set); }
  // ---- boutique ----
  shopOutDraw(SS.outD); labOutDraw(LS.outD);
  const TG = S.tag || {}; SS.hookG.position.set(_tagBase.x + (TG.dx || 0), _tagBase.y + (TG.y || 0), _tagBase.z); SS.hookG.rotation.set(TG.rx || 0, TG.ry ?? 0, TG.rz || 0);
  const top = (3.4 - SS.hookG.position.y) / 1.2; SS.line.scale.set(1, top - 0.43, 1); SS.line.position.y = 0.43 + (top - 0.43) / 2; // line from the hook eye to the ceiling (bait group is scaled 1.2x)
  baitDraw(SS.tag.userData.D, { glow: +(TG.glow || 0).toFixed(2), arrow: +(TG.arrow || 0).toFixed(2), gone: +(TG.gone || 0).toFixed(2) }); SS.tag.userData.D.m.emissiveIntensity = 0.12 + 0.25 * (TG.glow || 0);
  const CB = S.cab || {}; SS.cab.visible = (CB.pop ?? 0) > 0.01; SS.cab.scale.setScalar(Math.max(0.01, CB.pop ?? 0)); SS.drw[0].g.position.z = 0.17 + 0.2 * (CB.d9 || 0); SS.drw[1].g.position.z = 0.17 + 0.2 * (CB.d10 || 0); SS.drw[1].g.position.x = 0.13 + (CB.shake || 0) * 0.006 * Math.sin(f * 2.9);
  labelDraw(SS.drw[0].D, '$9'); labelDraw(SS.drw[1].D, '$10', CB.x10 || 0); SS.brain.scale.set(1.15 * (1 + 0.06 * (CB.brain || 0)), 0.78 * (1 + 0.06 * (CB.brain || 0)), 0.95);
  const MQ = S.mq || {}; const tags = MQ.tags || [0, 0, 0]; SS.mq.forEach((m, i) => { const k = tags[i]; m.tag.visible = k > 0.01; m.tag.scale.setScalar(Math.max(0.01, k)); m.tag.rotation.z = 0.05 * Math.sin(f * 0.09 + i * 2) + (1 - Math.min(1, k)) * 0.6;
    tagDraw(m.tagP.userData.D, ['$34', '$39', '$44'][i], i === 1 ? (MQ.glow39 || 0) : 0, i === 1 ? 2 : -1); });
  const CN = S.cnt || [0, 0, 0]; SS.boards.forEach((b, i) => { boardDraw(b.D, CN[i], i === 1 ? (S.cntWin || 0) : 0); b.g.rotation.z = 0.01 * Math.sin(f * 0.05 + i); });
  SS.dspL.intensity = S.dspL ?? 0;
  const RT = S.rail || []; SS.railTags.forEach((t, i) => { const k = RT[i] || 0; t.visible = k > 0.01; t.scale.setScalar(Math.max(0.01, k)); t.rotation.z = 0.12 * Math.sin(f * 0.11 + i * 1.7) * Math.min(1, k); });
  // ---- lab ----
  const LB = S.lab || {}; LS.cats.forEach((c, i) => { const k = LB.cats ?? 0; c.rotation.x = k * 1.15; c.position.y = 0.752 + k * 0.01; c.rotation.z = k * (i - 1) * 0.08; c.position.x = [-0.27, 0, 0.27][i] * (1 + 0.12 * k); });
  LS.tents.forEach((t, i) => { const k = (LB.tent || [0, 0])[i] || 0; t.position.y = 0.75 + 0.03 * Math.sin(Math.PI * Math.min(1, k)); t.rotation.y = 0.25 * Math.sin(Math.PI * Math.min(1, k)) * (i ? -1 : 1); });
  // ---- wipes ----
  for (const k in WIPE) WIPE[k].visible = false;
  const wp = S.wipe; if (wp && WIPE[wp.kind]) { const g = WIPE[wp.kind]; g.visible = true; camera.getWorldDirection(_fwd); _rt.set(1, 0, 0).applyQuaternion(camera.quaternion); _up.set(0, 1, 0).applyQuaternion(camera.quaternion);
    const d = wp.d ?? 0.6; g.position.copy(camera.position).addScaledVector(_fwd, d).addScaledVector(_rt, wp.x * d * (wp.kind === 'page' ? 1.4 : 2.8)).addScaledVector(_up, (wp.y || 0) * d); g.quaternion.copy(camera.quaternion); if (wp.spin) g.rotateZ(wp.spin); if (wp.yaw) g.rotateY(wp.yaw); }
}
