
// ---------- per-frame state ----------
const tmpV = new THREE.Vector3();
const bulbL = lantern, scrL = spot; // reuse the two point lights: hanging bulb / CRT glow
const extraL = new THREE.PointLight('#ffd08a', 0, 12, 1.4); scene.add(extraL);
function applyLight(L) {
  hemi.color.set(L.sky); hemi.groundColor.set(L.ground); sun.color.set(L.sun); sun.intensity = L.sunI * (L.sunK ?? 1.4); hemi.intensity = L.hemi * (L.hemiK ?? 0.3);
  for (const m of STD) { m.envMap = PH.env; m.envMapIntensity = L.envI ?? 0.3; }
  scene.fog.color.set(L.fog); scene.fog.near = L.fogNear; scene.fog.far = L.fogFar;
  inkU.sat.value = L.sat; inkU.gain.value.set(L.gain || '#ffffff'); inkU.lift.value.set(L.lift || '#000000');
  skyU.tint.value.set(L.skyTint || '#ffffff'); skyU.expo.value = L.skyExpo ?? 1.15; skyU.skySat.value = L.skySat ?? 1.1; skyU.haze.value.set(L.haze || L.fog); skyU.night.value = L.night || 0; skyU.stars.value = L.stars || 0; skyU.moon.value = L.moon || 0;
  skyU.top.value.set(L.skyTop || '#0b1740'); skyU.hor.value.set(L.skyHor || '#3a5a9a'); skyU.hazeH.value = L.hazeH ?? 0.05;
}
function placeSun(L, focus) {
  const az = rx(L.az), el = rx(L.el); tmpV.set(Math.cos(el) * Math.cos(az), Math.sin(el), Math.cos(el) * Math.sin(az));
  skyU.yaw.value = SKY_SUN_U - 0.5 - az / (2 * Math.PI); skyU.moonDir.value.set(Math.cos(rx(L.moonEl ?? 30)) * Math.cos(rx(L.moonAz ?? 200)), Math.sin(rx(L.moonEl ?? 30)), Math.cos(rx(L.moonEl ?? 30)) * Math.sin(rx(L.moonAz ?? 200)));
  sun.position.copy(focus).addScaledVector(tmpV, 120); sun.target.position.copy(focus);
  const ext = L.shadowExt || 30, sc = sun.shadow.camera; sc.left = -ext; sc.right = ext; sc.top = ext; sc.bottom = -ext; sc.near = 1; sc.far = 300; sc.updateProjectionMatrix();
}
const _fwd = new THREE.Vector3(), _rt = new THREE.Vector3(), _up = new THREE.Vector3();

function drawActors(list, cam) {
  cards.forEach((c) => { c.mesh.visible = c.blob.visible = false; });
  const used = {}; const th = Math.tan(rx(cam.fov / 2));
  list.forEach((a, i) => { const d = Math.max(0.05, Math.hypot(cam.position.x - a.x, cam.position.y - a.y - 1.1 * (a.s || 1), cam.position.z - a.z)), px = (a.s || 1) * 2.25 / (2 * d * th) * H;
    const res = a.res ?? (px > 1500 ? 1 : px > 750 ? 0.6 : 0.4); used[res] = (used[res] ?? -1) + 1; const c = getCard(used[res], res);
    c.draw(a.key, a.draw, a._fx || a.flat ? null : (a.flip ? CARDSH.flip : CARDSH.n));
    c.mesh.visible = true; c.mesh.position.set(a.x, a.y, a.z); const s = a.s || 1; c.mesh.scale.set(s * (a.flip ? -1 : 1), s, s);
    c.mesh.rotation.set(0, (a.fixedYaw ?? Math.atan2(cam.position.x - a.x, cam.position.z - a.z)) + (a.yaw || 0), a.roll || 0);
    c.mat.color.set(a.tint || '#ffffff'); c.mat.opacity = a.alpha ?? 1; c.mat.transparent = true; c.mat.depthTest = a.noDepth ? false : true; c.mesh.castShadow = a.shadow !== false; c.mesh.renderOrder = a.order || 2;
    const gr = a.ground ?? a.y; if (a.blob !== false && a.y < gr + 0.5) { c.blob.visible = true; c.blob.position.set(a.x, gr + 0.02, a.z); c.blob.scale.set(1.05 * s * (a.blobW || 1), 0.62 * s * (a.blobW || 1), 1); } });
}
const CARDSH = { n: null, flip: null };
const setCardShade = (L) => { const az = rx(L.az), el = rx(L.el); tmpV.set(Math.cos(el) * Math.cos(az), Math.sin(el), Math.cos(el) * Math.sin(az));
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion), sx = tmpV.dot(right), side = Math.abs(sx) < 0.08 ? 1 : Math.sign(sx);
  const rim = new THREE.Color(L.rimCol || '#ffa85c'), base = { rim: [rim.r * 255, rim.g * 255, rim.b * 255], rimI: L.rimI ?? 1.0, coreI: L.coreI ?? 0.55 };
  const mk = (sgn) => ({ ...base, vx: 0.91 * sgn, vy: -0.41, key: (sgn > 0 ? 'R' : 'L') + (L.rimCol || '') + base.rimI + base.coreI }); CARDSH.n = mk(side); CARDSH.flip = mk(-side); };
const flatNd = new THREE.ShaderMaterial({ vertexShader: `varying float vD; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vD=-mv.z; gl_Position=projectionMatrix*mv; }`, fragmentShader: `varying float vD; void main(){ gl_FragColor=vec4(.5,.5,1.,vD); }` });
const swapForNd = (on) => { scene.traverse((o) => { if (!o.isMesh && !o.isPoints) return;
  if (on) { o.userData.mat0 = o.material; if (o.userData.ndSkip || o.isPoints) { o.userData.vis0 = o.visible; o.visible = false; return; } if (o === sky || o.userData.sky) { o.userData.vis0 = o.visible; o.visible = false; return; } o.material = o.userData.nd || (o.userData.flatNd ? flatNd : ndMat); }
  else { o.material = o.userData.mat0; if (o.userData.vis0 !== undefined) { o.visible = o.userData.vis0; delete o.userData.vis0; } } }); };
// screen-space overlay (camcorder viewfinder etc.)
const OVC = document.createElement('canvas'); OVC.width = W; OVC.height = H; const ovTex = new THREE.CanvasTexture(OVC); ovTex.colorSpace = THREE.SRGBColorSpace;
const ovScene = fs(new THREE.MeshBasicMaterial({ map: ovTex, transparent: true, depthTest: false, depthWrite: false })); let ovKey = '';

const PT = (k) => { if (!window.PROF) return; renderer.getContext().finish(); const n = performance.now(); window.PROF[k] = (window.PROF[k] || 0) + n - (window._pt || n); window._pt = n; };
window.renderFrame = (f) => { PT('idle');
  const S = shotAt(f), L = lightFor(S, f), C = camAt(f);
  applyLight(L);
  camera.position.set(...C.pos); camera.up.set(0, 1, 0); camera.lookAt(...C.look); camera.rotateZ(rx(C.roll || 0));
  camera.fov = C.fov; camera.updateProjectionMatrix(); camera.updateMatrixWorld();
  const Wd = worldAt(f); worldState(Wd, f);
  placeSun(L, new THREE.Vector3(...(C.shadowAt || C.look)));
  PT('state'); setCardShade(L); drawActors([...depen(actorsAt(f, T), f), ...fxAt(f, T).map((a) => ({ ...a, _fx: 1 }))], camera); PT('cards');
  sky.position.copy(camera.position);
  renderer.setRenderTarget(rtColor); renderer.setClearColor(0x000000, 1); renderer.clear(); renderer.render(scene, camera); PT('color');
  const fog = scene.fog; scene.fog = null; const sm = renderer.shadowMap.enabled; renderer.shadowMap.enabled = false; renderer.shadowMap.autoUpdate = false;
  swapForNd(true); renderer.setRenderTarget(rtNd); renderer.setClearColor(0x000000, 0); renderer.clear(); renderer.render(scene, camera); swapForNd(false); PT('nd');
  scene.fog = fog; renderer.shadowMap.enabled = sm; renderer.shadowMap.autoUpdate = true;
  if (window.DEBUG_ND) { renderer.setRenderTarget(null); renderer.render(fs(new THREE.MeshBasicMaterial({ map: rtNd.texture })), fsCam); return true; }
  aoU.tanY.value = Math.tan(rx(camera.fov / 2)); renderer.setRenderTarget(rtAO); renderer.render(aoScene, fsCam); PT('ao');
  const D = dofAt(f);
  inkU.px.value = 2.5; inkU.aoK.value = L.aoK ?? 0.95; inkU.expo.value = L.expo ?? 1.0; inkU.flash.value = window.DEBUG_E ? -1 : (C.flash || 0); inkU.flashCol.value.set(C.flashCol || '#ffffff'); inkU.vig.value = L.vig ?? 0.22;
  renderer.setRenderTarget(rtInk); renderer.render(inkScene, fsCam); PT('ink');
  dofU.focus.value = D.focus; dofU.cinf.value = D.cinf; dofU.near.value = D.near ?? 1;
  renderer.setRenderTarget(null); renderer.render(dofScene, fsCam); PT('dof');
  const ov = overlayAt(f); if (ov) { if (ov.key !== ovKey) { ovKey = ov.key; const g = OVC.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H); ov.draw(g, W, H); ovTex.needsUpdate = true; }
    const ac = renderer.autoClear; renderer.autoClear = false; renderer.render(ovScene, fsCam); renderer.autoClear = ac; }
  PT('ov'); return true;
};
window.TOTAL = TOTAL; window.DBG = { proj: (k) => { const c = cards.find((c) => c.key.startsWith(k)); c.mesh.updateMatrixWorld(); const v = c.mesh.localToWorld(new THREE.Vector3(0, 0.4, 0)).project(camera); return [v.x.toFixed(2), v.y.toFixed(2), v.z.toFixed(3), c.mesh.renderOrder, c.mat.depthTest, c.mat.opacity, c.mat.transparent, scene.children.includes(c.mesh)].join(","); }, canv: (k) => { const c = cards.find((c) => c.key.startsWith(k)); const d = c.g.getImageData(0, 0, c.W, c.H).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 128) n++; return n + "/" + (d.length / 4) + " vis " + c.mesh.visible + " rot " + c.mesh.rotation.toArray().slice(0,3).map(v=>(+v).toFixed(2)); }, cards: () => cards.filter((c) => c.mesh.visible).map((c) => ({ key: c.key.slice(0, 30), res: c.res, p: c.mesh.position.toArray().map((v) => +v.toFixed(2)), s: c.mesh.scale.x })) };
window.ready = true;
// ---- collision audit (debug only) ----
const _bx = new THREE.Box3(), _pv = new THREE.Vector3();
const _visible = (o) => { for (let p = o; p; p = p.parent) if (!p.visible) return false; return true; };
let _boxCache = { set: null, boxes: [] };
const _setBoxes = (setName) => { if (_boxCache.set === setName) return _boxCache.boxes; const boxes = [];
  scene.updateMatrixWorld(true);
  scene.traverse((o) => { if (!o.isMesh || o === sky || o.userData.sky || o.userData.cloud) return; if (cards.some((c) => c.mesh === o || c.blob === o)) return; if (!_visible(o)) return;
    if (o.material && (o.material.transparent && o.material.depthWrite === false)) return;
    _bx.setFromObject(o); const sz = _bx.getSize(_pv); if (sz.y < 0.06) return; if (sz.x > 40 || sz.z > 40) return;
    boxes.push({ b: _bx.clone(), o, sz: [sz.x, sz.y, sz.z].map((v) => +v.toFixed(2)) }); });
  _boxCache = { set: setName, boxes }; return boxes; };
window.DEP = (f) => { const S = shotAt(f), C = camAt(f); camera.position.set(...C.pos); worldState(worldAt(f), f); _dpKey = null; const L = actorsAt(f, T); const D = depen(L, f); return { n: _dpBoxes.length, a: L.map((a, i) => [a.key.split('{')[0], a.x, a.z, D[i].x, D[i].z, a.y]) }; };
window.COLL = (f) => { const S = shotAt(f), C = camAt(f); camera.position.set(...C.pos); const Wd = worldAt(f); worldState(Wd, f);
  _boxCache.set = null; const boxes = _setBoxes(S.set + '|' + f); const out = [];
  for (const a of depen(actorsAt(f, T), f)) { if (a.y > 3 || a.flat) continue; const s = a.s || 1; const yaw = Math.atan2(C.pos[0] - a.x, C.pos[2] - a.z); const rx_ = Math.cos(yaw), rz_ = -Math.sin(yaw);
    const hits = new Map();
    for (const u of [-0.24, -0.12, 0, 0.12, 0.24]) for (const h of [0.15, 0.5, 0.9, 1.3, 1.65]) { const p = new THREE.Vector3(a.x + rx_ * u * s, a.y + h * s, a.z + rz_ * u * s);
      for (const B of boxes) { const b = B.b; const m = 0.03; if (p.x > b.min.x + m && p.x < b.max.x - m && p.y > b.min.y + m && p.y < b.max.y - m && p.z > b.min.z + m && p.z < b.max.z - m) { const k = B.sz.join('x') + '@' + [b.min.x, b.min.y, b.min.z].map((v) => v.toFixed(1)).join(','); hits.set(k, (hits.get(k) || 0) + 1); } } }
    if (hits.size) out.push({ who: a.key.split('{')[0], pos: [a.x, a.y, a.z].map((v) => +v.toFixed(2)), hits: [...hits].map(([k, n]) => k + ' n' + n) }); }
  return { shot: SHOTS.indexOf(S), set: S.set, out }; };

// ---- depenetration: keep characters out of furniture, props, doors and walls ----
let _dpKey = null, _dpBoxes = [];
const depen = (list, f) => { const S = shotAt(f); if (S.noPush === true) return list; const key = SHOTS.indexOf(S) + ':' + Math.floor(f / 12);
  if (key !== _dpKey) { _dpKey = key; scene.updateMatrixWorld(true); _dpBoxes = [];
    scene.traverse((o) => { if (!o.isMesh || o === sky || o.userData.sky || o.userData.cloud) return; if (cards.some((c) => c.mesh === o || c.blob === o)) return; if (!_visible(o)) return;
      if (o.material && o.material.transparent && o.material.depthWrite === false) return;
      const b = new THREE.Box3().setFromObject(o), sz = b.getSize(new THREE.Vector3()); if (sz.y < 0.3 || (sz.x > 6 && sz.z > 6) || Math.max(sz.x, sz.z) > 25) return;
      const thin = Math.min(sz.x, sz.z), wide = Math.max(sz.x, sz.z); if (thin < 0.2 && wide < 1.3 && sz.y > 1.8) return; // door frames / open doorways
      _dpBoxes.push(b); }); }
  const skip = S.noPushKeys || [];
  const C = camAt(f);
  return list.map((a) => { if (a.flat || a.noPush || a.y > 0.6 || skip.some((k) => a.key.startsWith(k))) return a; const s = a.s || 1, r = 0.27 * s;
    const rel = _dpBoxes.filter((b) => !(b.max.y < a.y + 0.3 || b.min.y > a.y + 1.2 * s));
    const hit = (x, z) => { for (const b of rel) if (x > b.min.x - r && x < b.max.x + r && z > b.min.z - r && z < b.max.z + r) return true; return false; };
    if (!hit(a.x, a.z)) return a;
    const cx = C.pos[0] - a.x, cz = C.pos[2] - a.z, cl = Math.hypot(cx, cz) || 1; let best = null, bc = 1e9;
    for (let ring = 1; ring <= 30 && !best; ring++) { const R = ring * 0.04; for (let k = 0; k < 24; k++) { const th = k / 24 * Math.PI * 2, dx = Math.cos(th) * R, dz = Math.sin(th) * R;
        if (hit(a.x + dx, a.z + dz)) continue; const cost = R - 0.25 * R * (dx * cx + dz * cz) / (R * cl); if (cost < bc) { bc = cost; best = [a.x + dx, a.z + dz]; } } }
    return best ? { ...a, x: best[0], z: best[1] } : a; }); };
