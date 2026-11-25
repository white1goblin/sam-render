import * as THREE from './lib/three.module.js';
import * as T from './toon.js';
import * as P from './paint.js';
import { SHOTS, TOTAL, shotAt, camAt, dofAt, LIGHTS, lightFor, actorsAt, worldAt, fxAt, overlayAt } from './story.js';
import { HOUSE, KIT, GAR, MAIN, HOSP, WARE, H_, K_, G_, M_, HO_, WA_ } from './sets.js';
import { GLTFLoader } from './lib/jsm/GLTFLoader.js';
import { RGBELoader } from './lib/jsm/RGBELoader.js';
import { shadeCard } from './cardshade.js';

const W = 1920, H = 1080;
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, W / H, 0.05, 3200);
const rx = (a) => a * Math.PI / 180;
const GLL = new GLTFLoader(), TXL = new THREE.TextureLoader();
const PH = {}, QA = {};
const QN = ['CommonTree_1', 'CommonTree_2', 'CommonTree_3', 'CommonTree_4', 'CommonTree_5', 'Bush_Common', 'Bush_Common_Flowers', 'Pine_2'];
const phTex = async (n, srgb = true) => { const t = await TXL.loadAsync('assets/ph/' + n); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace; t.anisotropy = 8; return t; };
await Promise.all([
  (async () => { PH.hdr = await new RGBELoader().loadAsync('assets/ph/hdri_kloofendal_overcast_1k.hdr'); })(),
  ...QN.map(async (n) => { QA[n] = await GLL.loadAsync('assets/q/' + n + '.gltf'); }),
  (async () => { const t = await TXL.loadAsync('assets/ph3/sky_8k.jpg'); t.colorSpace = THREE.SRGBColorSpace; t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.wrapS = THREE.RepeatWrapping; PH.sky = t; })(),
  ...[['grassN', 'leafy_grass_nor_1k.jpg', 0], ['bark', 'bark_brown_02_diff_1k.jpg', 1], ['barkN', 'bark_brown_02_nor_1k.jpg', 0], ['planks', 'weathered_brown_planks_diff_1k.jpg', 1], ['planksN', 'weathered_brown_planks_nor_1k.jpg', 0], ['fabN', 'denim_fabric_nor_1k.jpg', 0]]
    .map(async ([k, f, srgb]) => { PH[k] = await phTex(f, !!srgb); }),
  new Promise((res) => { const im = new Image(); im.onload = () => { window.FABRIC_IMG = im; res(); }; im.onerror = res; im.src = 'assets/ph/detail_fabric.jpg'; }),
]);

// ---------- materials ----------
const STD = [];
const toon = (o) => { const m = new THREE.MeshPhysicalMaterial({ roughness: 0.82, metalness: 0, specularIntensity: 0.35, ...o }); STD.push(m); return m; };
const cv = (w, h, fn) => { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); return c; };
const ctex = (c, rx_ = 1, ry_ = 1) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx_, ry_); t.anisotropy = 8; return t; };
const texM = (c, rx_ = 1, ry_ = 1, o = {}) => toon({ map: ctex(c, rx_, ry_), ...o });
const rp = (t, x, y) => { const c = t.clone(); c.repeat.set(x, y); c.needsUpdate = true; return c; };

// ---------- ink / normal-depth contract ----------
const ndMat = new THREE.ShaderMaterial({
  vertexShader: `varying vec3 vN; varying float vD; void main(){ vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.); vD = -mv.z; gl_Position = projectionMatrix*mv; }`,
  fragmentShader: `varying vec3 vN; varying float vD; void main(){ vec3 n = normalize(vN); if(!gl_FrontFacing) n = -n; gl_FragColor = vec4(n*.5+.5, vD); }`, side: THREE.DoubleSide });
const cardNd = (map) => new THREE.ShaderMaterial({ uniforms: { map: { value: map } },
  vertexShader: `varying vec2 vUv; varying float vD; void main(){ vUv=uv; vec4 mv = modelViewMatrix*vec4(position,1.); vD=-mv.z; gl_Position=projectionMatrix*mv; }`,
  fragmentShader: `uniform sampler2D map; varying vec2 vUv; varying float vD; void main(){ if(texture2D(map,vUv).a<.5) discard; gl_FragColor=vec4(0.,0.,0.,vD); }`, side: THREE.DoubleSide });
const ndInst = new THREE.ShaderMaterial({
  vertexShader: `varying vec3 vN; varying float vD; void main(){ vN = normalize(normalMatrix*mat3(instanceMatrix)*normal); vec4 mv = modelViewMatrix*instanceMatrix*vec4(position,1.); vD = -mv.z; gl_Position = projectionMatrix*mv; }`,
  fragmentShader: `varying vec3 vN; varying float vD; void main(){ vec3 n = normalize(vN); if(!gl_FrontFacing) n = -n; gl_FragColor = vec4(n*.5+.5, vD); }`, side: THREE.DoubleSide });
const ndInstA = (map) => new THREE.ShaderMaterial({ uniforms: { map: { value: map } },
  vertexShader: `varying vec3 vN; varying float vD; varying vec2 vUv; void main(){ vUv = uv; vN = normalize(normalMatrix*mat3(instanceMatrix)*normal); vec4 mv = modelViewMatrix*instanceMatrix*vec4(position,1.); vD = -mv.z; gl_Position = projectionMatrix*mv; }`,
  fragmentShader: `uniform sampler2D map; varying vec3 vN; varying float vD; varying vec2 vUv; void main(){ if (texture2D(map, vUv).a < .5) discard; vec3 n = normalize(vN); if(!gl_FrontFacing) n = -n; gl_FragColor = vec4(n*.5+.5, -vD); }`, side: THREE.DoubleSide });

// ---------- helpers ----------
const add = (geo, mat, x = 0, y = 0, z = 0, parent = scene, opts = {}) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = opts.cast ?? true; m.receiveShadow = opts.recv ?? true; parent.add(m); return m; };
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const tbox = (w, h, d, t = 2) => { const g = box(w, h, d), uv = g.attributes.uv; const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, uv.getX(i) * dims[f][0] / t, uv.getY(i) * dims[f][1] / t); } return g; };
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _p = new THREE.Vector3(), _e = new THREE.Euler(), _c = new THREE.Color(), _tc = new THREE.Color();
const mtx = (x = 0, y = 0, z = 0, rx_ = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) => new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx_, ry, rz)), new THREE.Vector3(sx, sy, sz));
const merge = (parts) => { const arrs = { position: [], normal: [], uv: [] };
  for (const [g0, m] of parts) { const g = (g0.index ? g0.toNonIndexed() : g0.clone()); if (m) g.applyMatrix4(m); for (const k in arrs) { const A = g.attributes[k]; if (A) arrs[k].push(A.array); else arrs[k].push(new Float32Array(g.attributes.position.count * (k === 'uv' ? 2 : 3))); } }
  const out = new THREE.BufferGeometry(); for (const k in arrs) { const n = arrs[k].reduce((a, b) => a + b.length, 0), arr = new Float32Array(n); let o = 0; for (const a of arrs[k]) { arr.set(a, o); o += a.length; } out.setAttribute(k, new THREE.BufferAttribute(arr, k === 'uv' ? 2 : 3)); } return out; };
const world = new THREE.Group(); scene.add(world);
const inst = (geo, mat, list, opts = {}) => { const im = new THREE.InstancedMesh(geo, mat, list.length); im.castShadow = opts.cast ?? true; im.receiveShadow = true;
  list.forEach((o, i) => { _p.set(o.x, o.y, o.z); _e.set(o.rx || 0, o.ry || 0, o.rz || 0); _q.setFromEuler(_e); const s = o.s || [1, 1, 1]; _s.set(s[0], s[1], s[2]); _m4.compose(_p, _q, _s); im.setMatrixAt(i, _m4); if (o.col) { _c.set(o.col); im.setColorAt(i, _c); } });
  im.userData.nd = ndInst; world.add(im); return im; };
const sst = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// ---------- sky (Poly Haven panorama, tinted per light: day / night with stars + moon) ----------
const SKY_SUN_U = 0.5953;
const skyU = { pano: { value: PH.sky }, yaw: { value: 0 }, expo: { value: 1 }, tint: { value: new THREE.Color(1, 1, 1) }, haze: { value: new THREE.Color() }, skySat: { value: 1.1 }, hazeH: { value: 0.05 },
  stars: { value: 0 }, moonDir: { value: new THREE.Vector3(0, 1, 0) }, moon: { value: 0 }, night: { value: 0 }, top: { value: new THREE.Color('#0b1740') }, hor: { value: new THREE.Color('#3a5a9a') } };
const sky = new THREE.Mesh(new THREE.SphereGeometry(2500, 48, 24), new THREE.ShaderMaterial({ uniforms: skyU, side: THREE.BackSide, depthWrite: false, fog: false,
  vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `uniform sampler2D pano; uniform vec3 tint, haze, moonDir, top, hor; uniform float yaw, expo, skySat, hazeH, stars, moon, night; varying vec3 vP;
    float h3(vec3 p){ return fract(sin(dot(p, vec3(127.1,311.7,74.7)))*43758.5453); }
    void main(){ vec3 d = normalize(vP);
      float u = fract(atan(d.z, d.x) / 6.2831853 + .5 + yaw); float e = asin(clamp(d.y, -1., 1.)); float v = 1. - (1.5707963 - e) / (3.1415926 * 102. / 180.);
      vec3 c = texture2D(pano, vec2(u, clamp(v, .002, .998))).rgb * expo * tint; float L = dot(c, vec3(.2126,.7152,.0722)); c = mix(vec3(L), c, skySat);
      vec3 ng = mix(hor, top, pow(clamp(d.y*1.3+.05, 0., 1.), .6)) + c*.18; c = mix(c, ng, night);
      if (stars > 0.) { vec3 q = floor(d*420.); float s = step(.9975, h3(q)) * smoothstep(.0, .25, d.y); c += vec3(s*stars*(.6+.4*h3(q+3.))); }
      if (moon > 0.) { float md = dot(d, normalize(moonDir)); c += vec3(1.,.97,.9)*smoothstep(.99955,.9997,md)*moon + vec3(.35,.45,.7)*pow(max(md,0.),300.)*moon*.6; }
      float hz = 1. - smoothstep(-.004, hazeH, d.y); c = mix(c, haze, hz * .92); if (d.y < -.004) c = haze;
      gl_FragColor = vec4(c, 1.); }` }));
sky.userData.sky = true; scene.add(sky);

// ---------- lights ----------
const hemi = new THREE.HemisphereLight('#ffffff', '#ffffff', 1); scene.add(hemi);
const sun = new THREE.DirectionalLight('#ffffff', 2); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.025; sun.shadow.radius = 2.0;
scene.add(sun); scene.add(sun.target);
const lantern = new THREE.PointLight('#ffb35a', 0, 9, 1.6); scene.add(lantern);
const spot = new THREE.PointLight('#ffe0b0', 0, 14, 1.2); scene.add(spot);
{ const pm = new THREE.PMREMGenerator(renderer); PH.hdr.mapping = THREE.EquirectangularReflectionMapping; PH.env = pm.fromEquirectangular(PH.hdr).texture; pm.dispose(); }
scene.fog = new THREE.Fog('#ffffff', 40, 600);

// ---------- cards ----------
const CW = 1200, CH = 2000, CM = 2.25;
const cardGeo = new THREE.PlaneGeometry(CM * 0.6, CM); cardGeo.translate(0, CM / 2 - CM * 0.025, 0);
const blobTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'); const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(18,12,26,0.9)'); gr.addColorStop(0.3, 'rgba(18,12,26,0.7)'); gr.addColorStop(0.7, 'rgba(18,12,26,0.22)'); gr.addColorStop(1, 'rgba(18,12,26,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
class Card {
  constructor(res = 1) {
    this.res = res; this.W = Math.round(CW * res); this.H = Math.round(CH * res);
    [this.c, this.g] = (() => { const c = document.createElement('canvas'); c.width = this.W; c.height = this.H; return [c, c.getContext('2d', { willReadFrequently: true })]; })();
    this.t = new THREE.CanvasTexture(this.c); this.t.colorSpace = THREE.SRGBColorSpace; this.t.anisotropy = 4;
    this.mat = new THREE.MeshBasicMaterial({ map: this.t, transparent: true, alphaTest: 0.02, side: THREE.DoubleSide, fog: true });
    this.mesh = new THREE.Mesh(cardGeo, this.mat); this.mesh.userData.nd = cardNd(this.t); this.mesh.castShadow = true;
    this.mesh.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: this.t, alphaTest: 0.5 });
    this.blob = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, fog: true }));
    this.blob.rotation.x = -Math.PI / 2; this.blob.userData.ndSkip = true; this.blob.renderOrder = 1;
    scene.add(this.mesh); scene.add(this.blob); this.key = ''; this.mesh.visible = this.blob.visible = false;
  }
  draw(key, fn, sh) { const k2 = key + (sh ? '|' + sh.key : ''); if (k2 === this.key) return; this.key = k2;
    const g = this.g; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, this.W, this.H); g.setTransform(this.W / 600, 0, 0, this.H / 1000, 0, 0);
    const p = new T.Pen(g); fn(p); if (sh) shadeCard(this.c, sh); this.t.needsUpdate = true; }
}
const cards = [], POOLS = {}; const getCard = (i, res = 1) => { const P_ = POOLS[res] || (POOLS[res] = []); if (!P_[i]) { P_[i] = new Card(res); cards.push(P_[i]); } return P_[i]; };

// ---------- Quaternius trees ----------
const QMAT = {}, TREEMESH = [];
const qgeo = (gltf, snowy = false) => { gltf.scene.updateMatrixWorld(true); const parts = []; const bb = new THREE.Box3();
  gltf.scene.traverse((o) => { if (!o.isMesh) return; const g = o.geometry.clone(); g.applyMatrix4(o.matrixWorld); g.computeBoundingBox(); bb.union(g.boundingBox); parts.push([g, o.material]); });
  const h = bb.max.y - bb.min.y, out = [];
  for (const [g, m0] of parts) { g.translate(0, -bb.min.y, 0); g.scale(1 / h, 1 / h, 1 / h);
    if (g.attributes.color && g.attributes.color.itemSize === 4) { const c = g.attributes.color, a = new Float32Array(c.count * 3); for (let i = 0; i < c.count; i++) { a[i * 3] = c.getX(i); a[i * 3 + 1] = c.getY(i); a[i * 3 + 2] = c.getZ(i); } g.setAttribute('color', new THREE.BufferAttribute(a, 3)); }
    const leaf = /Leaves|Leaf/.test(m0.name);
    if (leaf) { g.computeBoundingBox(); const cb = g.boundingBox, cy = (cb.min.y + cb.max.y) / 2, ry_ = (cb.max.y - cb.min.y) / 2, pa = g.attributes.position, na = g.attributes.normal, v = new THREE.Vector3(), nn = new THREE.Vector3();
      for (let i = 0; i < pa.count; i++) { v.set(pa.getX(i), (pa.getY(i) - cy) / Math.max(ry_, 1e-3) * 0.9 + 0.35, pa.getZ(i)).normalize(); nn.set(na.getX(i), na.getY(i), na.getZ(i)); if (nn.dot(v) < 0) nn.negate(); nn.lerp(v, 0.78).normalize(); na.setXYZ(i, nn.x, nn.y, nn.z); } }
    const key = m0.name + (snowy ? '_s' : ''); let m = QMAT[key];
    if (!m) { if (m0.map) { m0.map.colorSpace = THREE.SRGBColorSpace; m0.map.anisotropy = 4; }
      m = leaf ? new THREE.MeshLambertMaterial({ map: m0.map, alphaTest: 0.5, side: THREE.DoubleSide, vertexColors: !!g.attributes.color, color: '#ffffff' }) : new THREE.MeshLambertMaterial({ map: m0.map, normalMap: m0.normalMap, vertexColors: !!g.attributes.color, color: '#ffffff' });
      if (m0.name === 'Leaves_Pine') { m.color.setRGB(1.45, 1.55, 1.3); m.emissive.set('#0f1c0c'); } if (m0.name === 'Leaves_NormalTree') { m.color.setRGB(1.5, 1.62, 1.2); m.emissive.set('#1a2410'); }
      if (leaf) m.onBeforeCompile = (sh) => { sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWN;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvWN = normalize(mat3(modelMatrix*instanceMatrix)*normal);');
        sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWN;').replace('#include <normal_fragment_begin>', '#include <normal_fragment_begin>\n  normal = normalize(vNormal);')
          .replace('#include <map_fragment>', '#include <map_fragment>\n' + (snowy ? 'diffuseColor.rgb = mix(diffuseColor.rgb, vec3(.62,.66,.74), smoothstep(-.1,.45,vWN.y)*.85);' : '')); };
      QMAT[key] = m; }
    g.computeBoundingSphere(); out.push({ geo: g, mat: m, alpha: leaf ? m0.map : null }); }
  return out; };
const qinst = (V, list, cell = 60) => { const ch = {}; for (const o of list) { const k = Math.floor(o.x / cell) + ',' + Math.floor(o.z / cell); (ch[k] = ch[k] || []).push(o); }
  for (const L of Object.values(ch)) for (const P_ of V) { const im = inst(P_.geo, P_.mat, L); if (P_.alpha) { im.userData.nd = ndInstA(P_.alpha); im.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: P_.alpha, alphaTest: 0.5 }); }
    im.computeBoundingSphere(); im.userData.tree = true; TREEMESH.push(im); } };

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
  if (kind === 'pickup') { add(tbox(W - 0.1, 0.55, 1.6, 1), bm, 0, 1.25, 0.55, g); add(tbox(W - 0.14, 0.42, 1.5, 1), M.pane, 0, 1.28, 0.55, g); add(tbox(W, 0.4, 1.9, 1), bm, 0, 1.12, -1.3, g).scale.y = 0.6; add(tbox(W - 0.2, 0.05, 1.7, 1), M.rubber, 0, 1.0, -1.3, g); }
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

// =====================================================================================
// HOUSE: Sam's small-town Ohio house. Street along x (z 13..21), sidewalk z 11..12.9, lawn, porch, detached garage, gravel driveway.
// =====================================================================================
const HS = {};
{ const O = HOUSE, g = grp(world, O[0], 0, O[2]); HS.g = g;
  // ground: lawn, street, curb, sidewalk, driveway, back yard
  add(new THREE.PlaneGeometry(260, 140).rotateX(-Math.PI / 2), M.lawn, 0, 0, -20, g, nocast).material = texM(lawnT, 60, 32, { roughness: 1, normalMap: PH.grassN, normalScale: new THREE.Vector2(0.6, 0.6) });
  add(new THREE.PlaneGeometry(260, 8).rotateX(-Math.PI / 2), texM(asphaltT, 40, 1.3, { roughness: 0.95 }), 0, 0.012, 17, g, nocast);
  add(tbox(260, 0.15, 0.25, 1), M.concrete, 0, 0.075, 12.92, g, nocast); add(tbox(260, 0.15, 0.25, 1), M.concrete, 0, 0.075, 21.08, g, nocast);
  add(new THREE.PlaneGeometry(260, 1.7).rotateX(-Math.PI / 2), texM(concreteT(), 150, 1), 0, 0.02, 11.9, g, nocast); add(new THREE.PlaneGeometry(260, 1.7).rotateX(-Math.PI / 2), texM(concreteT(), 150, 1), 0, 0.02, 22.1, g, nocast);
  for (let x = -128; x < 130; x += 1.7) add(box(0.02, 0.005, 1.7), M.dark, x, 0.026, 11.9, g, nocast);
  add(new THREE.PlaneGeometry(3.4, 15).rotateX(-Math.PI / 2), texM(gravelT, 2, 9), 6, 0.018, 5.2, g, nocast); // gravel driveway
  for (const s of [-1, 1]) add(box(0.08, 0.06, 15), M.concreteD, 6 + s * 1.74, 0.03, 5.2, g, nocast);
  add(new THREE.PlaneGeometry(1.2, 9.5).rotateX(-Math.PI / 2), texM(concreteT(), 1, 6), -4.2, 0.02, 7.0, g, nocast); // front walk
  // tire marks in the gravel (Day 37): two dark curved tracks, shown only when the trailer is gone
  HS.tire = grp(g); { const tm = toon({ color: '#1e1a16', roughness: 1, transparent: true, opacity: 0.92, depthWrite: false }); for (const s of [-1, 1]) { const pts = []; for (let i = 0; i <= 20; i++) { const t = i / 20; pts.push(new THREE.Vector3(6 + s * 0.98 + 0.5 * Math.sin(t * 2.6) * t, 0.03, 2.4 + t * 10.2)); }
    for (let i = 0; i < 20; i++) { const a_ = pts[i], b_ = pts[i + 1], L = a_.distanceTo(b_) + 0.02; const m = add(new THREE.PlaneGeometry(0.27, L).rotateX(-Math.PI / 2), tm, (a_.x + b_.x) / 2, 0.026, (a_.z + b_.z) / 2, HS.tire, nocast); m.rotation.y = -Math.atan2(b_.x - a_.x, b_.z - a_.z); m.userData.ndSkip = true; } } }
  // Sam's house
  HS.house = house(g, -4, 0, { w: 10, d: 8, siding: M.sidingA, roof: M.roofA, wins: [-3.3, 2.9], door: -0.2, pane: nightGlow('#ffcf80'), shutter: toon({ color: '#2f4a6a' }), doorM: toon({ color: '#a8322e', roughness: 0.4 }), steps: false });
  // porch: deck, steps, posts, rails, shed roof, porch light, chair
  { const pg = grp(g, -4.2, 0, 0); add(tbox(4.2, 0.12, 2.2, 1), M.wood, 0, 0.39, 1.1, pg); add(tbox(4.2, 0.33, 0.1, 1), M.trim, 0, 0.16, 2.2, pg);
    for (let k = 0; k < 3; k++) add(tbox(1.5, 0.15, 0.3, 0.5), M.wood, 0, 0.075 + k * 0.15 - 0.0, 2.6 - k * 0.3 + 0.15, pg);
    for (const x of [-2.0, -0.8, 0.8, 2.0]) add(tbox(0.12, 2.6, 0.12, 0.5), M.trim, x, 1.75, 2.12, pg);
    for (const s of [-1, 1]) { add(tbox(1.15, 0.06, 0.06, 0.5), M.trim, s * 1.4, 1.35, 2.12, pg); add(tbox(1.15, 0.06, 0.06, 0.5), M.trim, s * 1.4, 0.55, 2.12, pg); const bl = []; for (let i = 0; i < 9; i++) bl.push({ x: s * (0.9 + i * 0.12), y: 0.95, z: 2.12 }); instP(new THREE.BoxGeometry(0.035, 0.8, 0.035), M.trim, bl, pg);
      add(tbox(0.06, 0.06, 2.1, 0.5), M.trim, s * 2.0, 1.35, 1.1, pg); }
    const rf = add(tbox(4.6, 0.1, 2.6, 1), M.roofA, 0, 3.12, 1.2, pg); rf.rotation.x = 0.18; add(tbox(4.6, 0.2, 0.1, 1), M.trim, 0, 2.95, 2.45, pg);
    HS.porchLamp = add(new THREE.SphereGeometry(0.09, 12, 10), nightGlow('#ffd890', '#e8e0c8'), 0.85, 2.25, 0.12, pg, nocast); add(box(0.12, 0.2, 0.06), M.black, 0.85, 2.38, 0.06, pg, nocast);
    // porch rocking chair + small table + plant pots
    { const ch = grp(pg, -1.3, 0.45, 1.1, 0.4); add(tbox(0.55, 0.06, 0.5, 0.3), M.oak, 0, 0.44, 0, ch); add(tbox(0.55, 0.7, 0.06, 0.3), M.oak, 0, 0.8, -0.24, ch); for (const s of [-1, 1]) { add(box(0.05, 0.44, 0.05), M.oak, s * 0.24, 0.22, 0.2, ch); add(box(0.05, 0.44, 0.05), M.oak, s * 0.24, 0.22, -0.2, ch); add(tbox(0.06, 0.06, 0.55, 0.3), M.oak, s * 0.27, 0.66, 0, ch); } }
    add(cyl(0.2, 0.15, 0.3, 14), toon({ color: '#b86a3a' }), 1.7, 0.6, 0.4, pg); add(new THREE.SphereGeometry(0.28, 10, 8), M.leafHedge, 1.7, 0.95, 0.4, pg);
    add(box(0.6, 0.02, 0.4), toon({ color: '#8a3a2a' }), 0, 0.46, 0.5, pg, nocast); // doormat
  }
  // the letter taped to the front door (Day 1) — dynamic
  HS.letter = add(new THREE.PlaneGeometry(0.21, 0.28), (HS.letterD = dynTex(420, 560)).m, -4.2, 1.9, 0.135, g, nocast); HS.letter.userData.flatNd = true;
  HS.tape = add(box(0.1, 0.025, 0.003), toon({ color: '#e8e0b8', transparent: true, opacity: 0.8 }), -4.2, 2.04, 0.138, g, nocast);
  // detached garage (front door at z=-2, centred x=6)
  { const gg = grp(g, 6, 0, -2); HS.gar = gg; add(tbox(6, 2.7, 7, 2.4), M.sidingB, 0, 1.35, -3.5, gg); add(tbox(6.2, 0.1, 7.2, 1), M.concreteD, 0, 0.05, -3.5, gg);
    for (const s of [-1, 1]) { const r = add(tbox(6.6, 0.12, 4.0, 2), M.roofB, 0, 3.25, -3.5 + s * 1.85, gg); r.rotation.x = s * 0.33; }
    const gab = new THREE.Shape([new THREE.Vector2(-3.5, 0), new THREE.Vector2(3.5, 0), new THREE.Vector2(0, 1.25)]); for (const s of [-1, 1]) { const ge = add(new THREE.ExtrudeGeometry(gab, { depth: 0.02, bevelEnabled: false }), [M.sidingB, M.sidingB], 0, 2.7, -3.5, gg); ge.rotation.y = Math.PI / 2; ge.position.x = s * 3 - (s > 0 ? 0 : 0.02); }
    { const ge = add(new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(-3.1, 0), new THREE.Vector2(3.1, 0), new THREE.Vector2(0, 1.2)]), { depth: 0.02, bevelEnabled: false }), [M.sidingB, M.sidingB], 0, 2.7, 0.0, gg); }
    add(tbox(3.1, 2.5, 0.1, 1), M.trim, 0, 1.2, 0.03, gg, nocast); add(box(2.8, 2.35, 0.05), M.dark, 0, 1.17, 0.0, gg, nocast); // opening (dark inside)
    // roll-up door (8 panels) — group slides up into the ceiling by W.garOpen
    HS.garDoor = grp(gg, 0, 0, 0.06); for (let k = 0; k < 6; k++) { const pnl = add(tbox(2.8, 0.38, 0.05, 0.5), toon({ color: '#ece8de', roughness: 0.55 }), 0, 0.2 + k * 0.39, 0, HS.garDoor, nocast); for (const x of [-1.05, -0.35, 0.35, 1.05]) add(box(0.6, 0.26, 0.012), toon({ color: '#dcd6ca', roughness: 0.6 }), x, 0.2 + k * 0.39, 0.03, HS.garDoor, nocast); }
    add(box(0.3, 0.04, 0.04), M.steelD, 0, 0.3, 0.05, HS.garDoor, nocast);
    // BRING IT BROKEN cardboard sign (Mia's, Day 38+) zip-tied on the garage siding
    HS.sign = add(new THREE.PlaneGeometry(1.5, 0.82), signM(cv(600, 330, (q, w, h) => { q.drawImage(cardboardT, 0, 0, w, h); q.strokeStyle = '#8a5a2a'; q.lineWidth = 6; q.strokeRect(6, 6, w - 12, h - 12); hand(q, 'BRING IT', w / 2, 112, 96, '#1a1a22', -0.03); hand(q, 'BROKEN', w / 2, 232, 112, '#c8322e', 0.02); })), 2.25, 1.6, 0.075, gg, nocast);
    HS.garLamp = add(new THREE.SphereGeometry(0.08, 12, 10), nightGlow('#ffe0a0', '#e8e0c8'), -1.7, 2.45, 0.12, gg, nocast);
    for (const x of [-2.3, 2.3]) add(box(0.04, 0.04, 0.04), M.black, x, 1.6, 0.08, gg, nocast);
    add(cyl(0.05, 0.05, 2.6, 8), M.steelD, -2.85, 1.3, 0.1, gg, nocast); // downspout
  }
  mailbox(g, H_.mailbox[0], H_.mailbox[2], 0);
  HS.bins = [bin(g, 2.4, 12.2, 0.1), bin(g, 1.6, 12.25, -0.2, '#2a4a8a')];
  picket(g, -9.5, 11.0, -1.2, 11.0); picket(g, -9.5, 11.0, -9.5, 2.0); bush(-8.6, 0.8, 1.1); bush(-6.8, 0.7, 0.9, true); bush(0.2, 0.7, 1.0, true); bush(1.6, 0.6, 1.1); bush(-9.2, -2.5, 1.2);
  add(new THREE.PlaneGeometry(9.2, 1.2).rotateX(-Math.PI / 2), M.mulch, -4.2, 0.015, 0.75, g, nocast);
  tree(-13, 6, 10, 0); tree(13, -6, 12, 2); tree(-6, -14, 11, 1); tree(4, -15, 9, 3); tree(-22, 9, 9, 4); tree(26, 8, 10, 0);
  // the trailer (Mr. Hollis gave it; Day 36 it is loaded with 11 folded mowers; Day 37 it is gone)
  HS.trailer = trailer(g, 6, 5.4, Math.PI); { const L = []; for (let j = 0; j < 4; j++) for (let i = 0; i < 3; i++) if (L.length < 11) L.push({ x: 6 - 0.52 + i * 0.52, y: 0.54, z: 5.4 - 0.95 + j * 0.62, ry: Math.PI + (i - 1) * 0.08, ci: i * 2 + j });
    mowerSet('trailer', L, true, g); }
  // mower placement lists at the house
  mowerSet('garFront', [{ x: 5.3, y: 0, z: 0.2, ry: 0.4 }, { x: 6.4, y: 0, z: 0.6, ry: -0.2 }, { x: 7.3, y: 0, z: 0.1, ry: 0.1 }], false, g);
  mowerSet('drive9', grid(4.9, 1.0, 3, 3, 1.1, 1.7, 0, 0.2, 4), false, g);
  mowerSet('drive61', [...grid(4.9, 1.0, 3, 6, 1.1, 1.7, 0, 0.2, 5), ...grid(-0.2, 3.0, 4, 6, 1.05, 1.3, 0.2, 0.25, 6), ...grid(8.6, 1.0, 3, 6, 1.05, 1.6, -0.2, 0.25, 7), ...grid(-3.2, 6.0, 3, 1, 1.05, 1.3, 0, 0.25, 8)].slice(0, 61), false, g);
  mowerSet('drag3', [{ x: 0, y: 0, z: 0, ry: Math.PI / 2, col: '#c8322e' }, { x: -1.0, y: 0, z: 0.1, ry: Math.PI / 2 + 0.2, col: '#2f8a4a' }, { x: -2.0, y: 0, z: -0.05, ry: Math.PI / 2 - 0.15, col: '#e8b830' }], false, g);
  mowerSet('man1', [{ x: 0, y: 0, z: 0, ry: 0, col: '#2f5aa8' }], false, g); mowerSet('sleep', grid(-0.9, -0.6, 3, 2, 0.6, 0.7, 0.3, 0.1, 21), false, g);
  // three broken mowers on trash day at the curbs of three houses along the street (x = -26, -48, 30)
  mowerSet('curb3', [{ x: -25.4, y: 0, z: 12.25, ry: 0.6, col: '#c8322e' }, { x: -47.4, y: 0, z: 12.3, ry: -0.4, col: '#2f8a4a' }, { x: 29.0, y: 0, z: 12.35, ry: 0.3, col: '#e8b830' }], false, g);
  for (const [x, c] of [[-26.6, '#2f5a3a'], [-48.6, '#3a3a40'], [31, '#2a4a8a']]) { bin(g, x, 12.2, 0.2, c); bin(g, x - 0.8, 12.15, -0.3, '#2f5a3a'); const bxX = x > 0 ? x + 0.95 : x - 1.75; add(tbox(0.6, 0.5, 0.5, 0.5), M.cardboard, bxX, 0.25, 12.0, g, ).rotation.y = 0.25; add(tbox(0.62, 0.02, 0.3, 0.3), M.cardboard, bxX - 0.12, 0.52, 11.82, g, nocast).rotation.x = -0.5; }
  // neighbouring houses (same street + across)
  const NB = [[-26, 0, M.sidingB, M.roofB], [-48, 0, M.sidingC, M.roofC], [-70, 0, M.sidingD, M.roofA], [30, 0, M.sidingE, M.roofC], [52, 0, M.sidingD, M.roofB], [-30, 34, M.sidingC, M.roofA, Math.PI], [-6, 34, M.sidingD, M.roofB, Math.PI], [18, 34, M.sidingB, M.roofC, Math.PI], [42, 34, M.sidingA, M.roofA, Math.PI], [-54, 34, M.sidingE, M.roofB, Math.PI]];
  HS.nb = NB.map(([x, z, s, r, ry]) => house(g, x, z, { siding: s, roof: r, ry: ry || 0, w: 9 + (Math.abs(x) % 3), d: 8, pane: nightGlow('#ffc878'), shutter: toon({ color: ['#2f4a6a', '#6a2a2a', '#2a5a3a'][Math.abs(x) % 3] }), doorM: toon({ color: ['#2a4a6a', '#e8e0d0', '#3a6a4a'][Math.abs(x / 2) % 3 | 0] }) }));
  for (const [x, z] of [[-26, 0], [-48, 0], [30, 0], [52, 0]]) { add(new THREE.PlaneGeometry(3, 12).rotateX(-Math.PI / 2), M.concreteD, x + 6.5, 0.016, 6, g, nocast); add(new THREE.PlaneGeometry(1.1, 10).rotateX(-Math.PI / 2), M.concrete, x, 0.016, 6, g, nocast); mailbox(g, x + 4.6, 11.7); }
  for (const [x, z] of [[-30, 34], [-6, 34], [18, 34], [42, 34]]) { add(new THREE.PlaneGeometry(1.1, 11).rotateX(-Math.PI / 2), M.concrete, x, 0.016, 28, g, nocast); mailbox(g, x + 4.6, 22.6, Math.PI); }
  for (const x of [-60, -36, -12, 12, 36, 60]) { tree(x + 3, 26, 9 + (x % 7 + 7) % 3, (x / 12 + 9) % 5 | 0); }
  for (const x of [-40, -16, 16, 40]) tree(x, 8.5, 8.5, ((x + 40) / 8) % 5 | 0);
  for (const x of [-38, -14, 12, 38, 62]) { streetLamp(g, x, 12.6, 0); }
  for (const x of [-50, -20, 10, 40]) pole(g, x, 23); for (const x of [-50, -20, 10]) { wire(g, [x - 0.7, 8.5, 23], [x + 30 - 0.7, 8.5, 23], 0.7); wire(g, [x + 0.7, 8.5, 23], [x + 30.7, 8.5, 23], 0.7); }
  for (const x of [-110, -90, 80, 100, 120]) tree(x, -10 + (x % 20), 13, 2);
  for (let i = 0; i < 24; i++) tree(-120 + i * 10 + R() * 5, -40 - R() * 20, 11 + R() * 6, i % 5);
  for (let i = 0; i < 18; i++) tree(-120 + i * 14 + R() * 5, 52 + R() * 20, 10 + R() * 6, i % 5);
  for (const [x, z, s] of [[-80, -120, 70], [40, -140, 90], [150, -80, 70], [-160, 60, 80]]) cloudCard(g, x, 70 + s * 0.3, z, s);
  // parked cars along the street + police car + customer cars + the hardware buyer's car (toggled)
  HS.carA = car(g, -36, 15.2, Math.PI / 2, '#8a2a2a'); HS.carB = car(g, 22, 19.0, -Math.PI / 2, '#4a6a8a', 'pickup');
  HS.police = car(g, 2.0, 15.4, Math.PI / 2, '#1c2648', 'police');
  HS.custCars = [car(g, -6, 15.2, Math.PI / 2, '#d8d4c8', 'pickup'), car(g, 14, 15.2, Math.PI / 2, '#3a6a4a'), car(g, -15, 15.2, Math.PI / 2, '#c8a038'), car(g, 23, 15.2, Math.PI / 2, '#5a5a62', 'pickup'), car(g, -24, 19.0, -Math.PI / 2, '#8a5a3a')];
  HS.inspCar = car(g, 12.5, 15.2, Math.PI / 2, '#e8e8e8');
  HS.manCar = car(g, 10.5, 15.4, Math.PI / 2, '#6a4a3a', 'pickup');
}

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
  add(new THREE.PlaneGeometry(11, 10.5).rotateX(-Math.PI / 2), texM(asphaltT, 3, 3), 4.5, 0.014, -0.7, g, nocast); for (let i = 0; i < 5; i++) add(new THREE.PlaneGeometry(0.1, 4.5).rotateX(-Math.PI / 2), M.white, 0 + i * 2.6, 0.02, -3.2, g, nocast); // parking lot
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
    { const cp = grp(sg, -2, 0, 5.2); add(tbox(8, 0.6, 4.2, 1), M.white, 0, 4.5, 0, cp); add(tbox(8.04, 0.2, 4.24, 1), M.blue, 0, 4.3, 0, cp); for (const x of [-2.5, 2.5]) add(tbox(0.35, 4.3, 0.35, 0.5), M.white, x, 2.15, 0, cp); add(tbox(5.5, 0.18, 1.0, 0.5), M.concrete, 0, 0.09, 0, cp); for (const x of [-1.5, 1.5]) add(tbox(0.5, 0.06, 0.4, 0.3), M.rust, x, 0.21, 0, cp); add(new THREE.PlaneGeometry(7.6, 4.0).rotateX(Math.PI / 2), glowM('#fff8e8'), 0, 4.19, 0, cp, nocast).visible = false; }
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
  { const gs = grp(g, -44, 0, 0); MS.gas = gs; add(new THREE.PlaneGeometry(22, 14).rotateX(-Math.PI / 2), texM(concreteT('#b8b4aa'), 5, 3), 0, 0.016, 1, gs, nocast);
    add(tbox(12, 0.7, 7, 1), M.white, 0, 5.0, 3.2, gs); add(tbox(12.04, 0.25, 7.04, 1), M.red, 0, 4.7, 3.2, gs); for (const x of [-4, 0, 4]) add(tbox(0.4, 4.6, 0.4, 0.5), M.white, x, 2.3, 3.2, gs);
    add(new THREE.PlaneGeometry(11.6, 6.6).rotateX(Math.PI / 2), glowM('#fffaf0'), 0, 4.64, 3.2, gs, nocast);
    for (const x of [-2, 2]) { add(tbox(1.6, 0.2, 0.8, 0.3), M.concrete, x, 0.1, 3.2, gs); const pu = grp(gs, x, 0.2, 3.2); add(tbox(0.7, 1.6, 0.5, 0.3), M.white, 0, 0.8, 0, pu); add(tbox(0.72, 0.3, 0.52, 0.3), M.red, 0, 1.45, 0, pu); add(box(0.4, 0.25, 0.02), glowM('#9ae8c8'), 0, 1.05, 0.26, pu, nocast); add(cyl(0.02, 0.02, 0.8, 6), M.black, 0.4, 0.8, 0.1, pu); }
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

// ---------- insert props: a phone (hero close-ups), a paper notice, the hardware-company letter ----------
const PHN = {}; { const g = grp(world, 0, -50, 0); PHN.g = g; add(tbox(0.076, 0.158, 0.009, 0.1), M.black, 0, 0, 0, g); add(tbox(0.08, 0.162, 0.006, 0.1), M.chrome, 0, 0, -0.001, g);
  PHN.D = dynTex(540, 1120, true); const s = add(new THREE.PlaneGeometry(0.07, 0.15), PHN.D.m, 0, 0, 0.0047, g, nocast); s.userData.flatNd = true; add(new THREE.CircleGeometry(0.004, 12), M.dark, 0.022, 0.071, -0.0047, g, nocast).rotation.y = Math.PI; }
const PAP = {}; { const g = grp(world, 0, -50, 0); PAP.g = g; PAP.D = dynTex(510, 660); const m = add(new THREE.PlaneGeometry(0.216, 0.28), PAP.D.m, 0, 0, 0, g, nocast); m.userData.flatNd = true; }

// ---------- dynamic canvas drawers ----------
const hw = 'Comic Sans MS, Chalkboard, Arial Black';
const letterDraw = (D, kind = 'evict') => dynDraw(D, kind, (q, w, h) => { q.fillStyle = '#fbf8f0'; q.fillRect(0, 0, w, h); noise(q, w, h, 0.03, 1500);
  if (kind === 'evict') { q.fillStyle = '#c8322e'; q.fillRect(0, 0, w, 70); txt(q, 'NOTICE', w / 2, 38, 52, '#ffffff'); txt(q, 'PAY RENT OR QUIT', w / 2, 112, 30, '#1b2a44');
    txt(q, 'BACK RENT OWED:', w / 2, 190, 26, '#1b2a44', 'Arial', 700); txt(q, '$2,400', w / 2, 255, 78, '#c8322e'); txt(q, 'DUE WITHIN', w / 2, 330, 26, '#1b2a44', 'Arial', 700); txt(q, '30 DAYS', w / 2, 390, 66, '#1b2a44');
    for (let k = 0; k < 6; k++) { q.fillStyle = '#9aa4b4'; q.fillRect(50, 450 + k * 22, k % 2 ? 300 : 410, 6); } q.strokeStyle = '#1b2a44'; q.lineWidth = 3; q.beginPath(); q.moveTo(260, h - 40); q.bezierCurveTo(300, h - 70, 330, h - 20, 380, h - 50); q.stroke(); }
  else if (kind === 'city') { q.fillStyle = '#2a4a6a'; q.fillRect(0, 0, w, 70); txt(q, 'CITY OF ELM FALLS', w / 2, 38, 34, '#ffffff'); txt(q, 'CEASE AND DESIST', w / 2, 120, 40, '#c8322e'); txt(q, 'ZONING VIOLATION', w / 2, 175, 28, '#1b2a44');
    txt(q, 'RESIDENTIAL LOT', w / 2, 240, 26, '#1b2a44', 'Arial', 700); txt(q, 'NO COMMERCIAL REPAIRS', w / 2, 285, 26, '#1b2a44', 'Arial', 700); txt(q, 'EFFECTIVE TODAY', w / 2, 360, 40, '#c8322e'); for (let k = 0; k < 6; k++) { q.fillStyle = '#9aa4b4'; q.fillRect(50, 430 + k * 24, k % 2 ? 300 : 410, 6); } }
  else if (kind === 'rent') { q.fillStyle = '#2a4a6a'; q.fillRect(0, 0, w, 70); txt(q, 'NOTICE OF RENT INCREASE', w / 2, 38, 30, '#ffffff'); txt(q, 'MONTHLY RENT', w / 2, 150, 30, '#1b2a44', 'Arial', 700); txt(q, '$1,050', w / 2, 220, 50, '#9aa4b4'); q.strokeStyle = '#c8322e'; q.lineWidth = 6; q.beginPath(); q.moveTo(150, 222); q.lineTo(360, 218); q.stroke(); txt(q, '$1,200', w / 2, 300, 78, '#c8322e'); for (let k = 0; k < 6; k++) { q.fillStyle = '#9aa4b4'; q.fillRect(50, 400 + k * 24, k % 2 ? 300 : 410, 6); } }
  else if (kind === 'plan') { q.fillStyle = '#fbf8f0'; q.fillRect(0, 0, w, h); q.strokeStyle = '#a8c0e0'; q.lineWidth = 2; for (let y = 90; y < h; y += 52) { q.beginPath(); q.moveTo(0, y); q.lineTo(w, y); q.stroke(); } q.strokeStyle = '#e8a0a0'; q.beginPath(); q.moveTo(70, 0); q.lineTo(70, h); q.stroke();
    hand(q, 'THE PLAN', w / 2, 60, 50, '#1b2a44', -0.03, hw); hand(q, 'money: $43', 250, 168, 40, '#1b2a44', 0, hw); hand(q, 'car:  NO', 230, 270, 40, '#1b2a44', 0, hw); hand(q, 'plan:  ???', 240, 372, 44, '#c8322e', 0.03, hw); hand(q, '100 DAYS', 260, 520, 52, '#2f5aa8', -0.05, hw); }
  else if (kind === 'price') { q.fillStyle = '#fbf8f0'; q.fillRect(0, 0, w, h); hand(q, 'REPAIRS', w / 2, 110, 70, '#1b2a44', -0.03, hw); hand(q, '$60', w / 2, 290, 170, '#c8322e', 0.02, hw); hand(q, '+ PARTS', w / 2, 450, 70, '#1b2a44', -0.02, hw); }
  else if (kind === 'film') { q.fillStyle = '#fbf8f0'; q.fillRect(0, 0, w, h); q.fillStyle = '#2a4a8a'; q.fillRect(0, 0, w, 80); txt(q, 'SCHOOL OF FILM', w / 2, 42, 40, '#ffffff', 'Georgia, serif'); txt(q, 'Dear Mia,', 110, 140, 30, '#1b2a44', 'Georgia, serif', 700); txt(q, 'CONGRATULATIONS!', w / 2, 220, 40, '#2a4a8a', 'Georgia, serif'); txt(q, 'You have been', w / 2, 290, 30, '#1b2a44', 'Georgia, serif', 700); txt(q, 'ACCEPTED', w / 2, 360, 64, '#c8322e', 'Georgia, serif'); for (let k = 0; k < 5; k++) { q.fillStyle = '#9aa4b4'; q.fillRect(60, 430 + k * 26, k % 2 ? 300 : 390, 6); } }
  else if (kind === 'offer') { q.fillStyle = '#e07a1a'; q.fillRect(0, 0, w, 80); txt(q, 'HARDWARE COMPANY', w / 2, 42, 40, '#ffffff'); txt(q, 'PURCHASE OFFER', w / 2, 130, 34, '#1b2a44'); txt(q, 'videos  \u2022  name  \u2022  sign', w / 2, 200, 28, '#1b2a44', 'Arial', 700); txt(q, '$50,000', w / 2, 300, 96, '#2f8a4a'); for (let k = 0; k < 5; k++) { q.fillStyle = '#9aa4b4'; q.fillRect(60, 400 + k * 26, k % 2 ? 300 : 390, 6); } q.strokeStyle = '#1b2a44'; q.lineWidth = 2; q.beginPath(); q.moveTo(60, h - 60); q.lineTo(300, h - 60); q.stroke(); txt(q, 'sign here', 120, h - 40, 18, '#6a6a72', 'Arial', 700); }
  else if (kind === 'closed') { q.fillStyle = '#fbf8f0'; q.fillRect(0, 0, w, h); hand(q, 'NO NEW', w / 2, 110, 80, '#c8322e', -0.03, hw); hand(q, 'REPAIRS', w / 2, 210, 80, '#c8322e', 0.02, hw); hand(q, 'THIS WEEK', w / 2, 320, 60, '#1b2a44', -0.02, hw); hand(q, "(we're training!)", w / 2, 440, 40, '#2f5aa8', 0.02, hw); hand(q, '- Sam', w * 0.7, 540, 40, '#1b2a44', 0, hw); }
  else if (kind === 'hardware') { q.fillStyle = '#e07a1a'; q.fillRect(0, 0, w, 80); txt(q, 'HARDWARE COMPANY', w / 2, 42, 40, '#ffffff'); txt(q, 'LEGAL DEPARTMENT', w / 2, 120, 28, '#1b2a44');
    txt(q, 'RE: "BRING IT BROKEN"', w / 2, 190, 30, '#1b2a44', 'Arial', 900); for (let k = 0; k < 9; k++) { q.fillStyle = '#9aa4b4'; q.fillRect(50, 250 + k * 26, k % 3 ? 410 : 280, 6); } txt(q, 'NOT AN OFFER', w / 2, h - 80, 40, '#c8322e'); } });
const calDraw = (D, st) => dynDraw(D, JSON.stringify(st), (q, w, h) => { q.fillStyle = '#fbf8f0'; q.fillRect(0, 0, w, h); q.fillStyle = st.pic || '#6a9a5a'; q.fillRect(0, 0, w, h * 0.32); q.fillStyle = '#ffffff40'; q.beginPath(); q.arc(w * 0.7, h * 0.12, 40, 0, 6.28); q.fill();
  q.fillStyle = '#3a6a3a'; for (let i = 0; i < 7; i++) { q.beginPath(); q.moveTo(i * 80, h * 0.32); q.lineTo(i * 80 + 40, h * 0.14); q.lineTo(i * 80 + 80, h * 0.32); q.fill(); }
  txt(q, st.month || 'APRIL', w / 2, h * 0.37, 40, '#1b2a44'); const cw = w / 7, ch = (h * 0.58) / 5, y0 = h * 0.41;
  for (let i = 0; i < 35; i++) { const x = (i % 7) * cw, y = y0 + Math.floor(i / 7) * ch; q.strokeStyle = '#c8c4b8'; q.lineWidth = 1; q.strokeRect(x, y, cw, ch); const d = i - (st.off ?? 2) + 1; if (d < 1 || d > 30) continue; txt(q, String(d), x + 14, y + 14, 15, '#3a3a42', 'Arial', 700);
    if (d <= (st.crossed || 0)) { q.strokeStyle = '#c8322e'; q.lineWidth = 4; q.beginPath(); q.moveTo(x + 6, y + 6); q.lineTo(x + cw - 6, y + ch - 6); q.moveTo(x + cw - 6, y + 6); q.lineTo(x + 6, y + ch - 6); q.stroke(); }
    if (d === st.due) { q.strokeStyle = '#c8322e'; q.lineWidth = 4; q.beginPath(); q.ellipse(x + cw / 2, y + ch / 2, cw * 0.55, ch * 0.5, 0, 0, 6.28); q.stroke(); txt(q, 'RENT', x + cw / 2, y + ch * 0.62, 15, '#c8322e', hw); }
    if (d === st.paid) { txt(q, 'PAID!', x + cw / 2, y + ch * 0.55, 18, '#2f8a4a', hw); } } });
const boardDraw = (D, st) => dynDraw(D, JSON.stringify(st), (q, w, h) => { q.fillStyle = '#f8f8f4'; q.fillRect(0, 0, w, h); q.globalAlpha = 0.25; q.fillStyle = '#b8c0c8'; q.fillRect(30, 40, 200, 6); q.fillRect(500, 400, 260, 8); q.globalAlpha = 1;
  const L = (s, x, y, sz, col = '#1b2a44', rot = 0) => hand(q, s, x, y, sz, col, rot, hw);
  if (st.mode === 'tally') { L('MOWERS SOLD', 230, 70, 46); for (let i = 0; i < (st.sold || 0); i++) { q.strokeStyle = '#1b2a44'; q.lineWidth = 7; q.beginPath(); q.moveTo(80 + i * 34, 120); q.lineTo(80 + i * 34, 200); q.stroke(); }
    L('JAR: $' + (st.jar || 0), 230, 280, 60, '#2f8a4a'); L('RENT DUE IN', 220, 390, 44, '#c8322e'); L(String(st.left ?? 21) + ' DAYS', 220, 470, 70, '#c8322e'); L('$2,400', 640, 120, 54, '#1b2a44', 0.05); q.strokeStyle = '#2f5aa8'; q.lineWidth = 5; q.strokeRect(520, 70, 250, 100); L('PARTS', 640, 300, 40, '#2f5aa8'); L('carb kit  plug  belt', 640, 360, 28, '#2f5aa8'); }
  else if (st.mode === 'wait') { L('WAITLIST', w / 2, 70, 66, '#c8322e'); L(String(st.n || 84), w / 2, 210, 170, '#1b2a44'); L('MOWERS', w / 2, 330, 50); for (let k = 0; k < 6; k++) L(['MON  Ray / Sam', 'TUE  Sam', 'WED  pickup x9', 'THU  Sam / Ray', 'FRI  pickup x12', 'SAT  film day'][k], k < 3 ? 210 : 620, 420 + (k % 3) * 50, 28, '#2f5aa8'); }
  else if (st.mode === 'plan') { L('DAY ' + (st.day || 64), w / 2, 70, 60, '#c8322e'); L('NO NEW REPAIRS', w / 2, 170, 50); L('THIS WEEK', w / 2, 240, 44); L('TEACH:', 200, 350, 44, '#2f5aa8'); L('kids x2', 220, 420, 38); L('Dee', 220, 480, 38); L('LISTEN FIRST - Ray', 600, 450, 30, '#c8322e', -0.05); }
  else if (st.mode === 'week') { L('THIS WEEK', w / 2, 70, 60); L('$' + (st.n || '12,480'), w / 2, 220, 120, '#2f8a4a'); L('(Ray old job: 2 months)', w / 2, 360, 34, '#c8322e'); L('4 BENCHES  20/DAY', w / 2, 470, 44, '#2f5aa8'); }
  else { L('FIX LIST', 220, 70, 50); for (let k = 0; k < 5; k++) { L(['carb - clogged', 'plug - $8', 'cord - frayed', 'blade - dull', 'float - stuck?'][k], 260, 150 + k * 70, 34, '#2f5aa8'); } } });
const phoneDraw = (D, st) => dynDraw(D, JSON.stringify(st), (q, w, h) => { q.fillStyle = '#ffffff'; q.fillRect(0, 0, w, h); q.fillStyle = '#1a1a22'; q.fillRect(0, 0, w, 60); txt(q, '9:41', 60, 32, 24, '#ffffff', 'Arial', 700);
  const thumb = (x, y, tw, th, k = 0) => { const gr = q.createLinearGradient(0, y, 0, y + th); gr.addColorStop(0, '#8ab8e0'); gr.addColorStop(0.6, '#c8d8b0'); gr.addColorStop(1, '#6a9a4a'); q.fillStyle = gr; q.fillRect(x, y, tw, th);
    q.fillStyle = '#c8322e'; q.fillRect(x + tw * 0.25, y + th * 0.62, tw * 0.3, th * 0.14); q.fillStyle = '#2a2a30'; q.beginPath(); q.arc(x + tw * 0.3, y + th * 0.8, th * 0.05, 0, 6.28); q.arc(x + tw * 0.5, y + th * 0.8, th * 0.05, 0, 6.28); q.fill();
    q.fillStyle = '#3d7fd0'; q.fillRect(x + tw * 0.6, y + th * 0.4, tw * 0.12, th * 0.32); q.fillStyle = '#f2c9a4'; q.beginPath(); q.arc(x + tw * 0.66, y + th * 0.32, th * 0.08, 0, 6.28); q.fill(); q.fillStyle = '#6a4228'; q.beginPath(); q.arc(x + tw * 0.66, y + th * 0.29, th * 0.08, Math.PI, 0); q.fill();
    if (k === 1) { q.fillStyle = '#e8b830'; q.fillRect(x, y + th * 0.5, tw, th * 0.5); q.fillStyle = '#c8322e'; for (let i = 0; i < 4; i++) q.fillRect(x + 20 + i * tw * 0.22, y + th * 0.6, tw * 0.15, th * 0.12); }
    q.fillStyle = '#ffffffd0'; q.beginPath(); q.moveTo(x + tw / 2 - 26, y + th / 2 - 30); q.lineTo(x + tw / 2 + 30, y + th / 2); q.lineTo(x + tw / 2 - 26, y + th / 2 + 30); q.fill(); };
  const wrap = (s, x, y, sz, col, maxw) => { q.font = `900 ${sz}px Arial`; q.fillStyle = col; q.textAlign = 'left'; q.textBaseline = 'top'; const ws = s.split(' '); let line = '', yy = y; for (const wd of ws) { const t = line ? line + ' ' + wd : wd; if (q.measureText(t).width > maxw) { q.fillText(line, x, yy); line = wd; yy += sz * 1.2; } else line = t; } q.fillText(line, x, yy); return yy + sz * 1.2; };
  if (st.mode === 'video') { thumb(0, 60, w, 400, 0); q.fillStyle = '#c8322e'; q.fillRect(0, 456, w * (st.t || 0.4), 8); let y = wrap('How to clean a lawn mower carburetor (easy)', 24, 490, 34, '#1b2a44', w - 48); txt(q, '1.2M views', 100, y + 20, 24, '#6a6a72', 'Arial', 700); for (let i = 0; i < 3; i++) { q.fillStyle = '#e8e8ec'; q.fillRect(24, y + 70 + i * 150, 200, 120); q.fillStyle = '#c8c8d0'; q.fillRect(240, y + 80 + i * 150, 260, 18); q.fillRect(240, y + 110 + i * 150, 180, 14); } }
  else if (st.mode === 'rec') { q.fillStyle = '#20242c'; q.fillRect(0, 0, w, h); thumb(0, 160, w, 800, 0); q.strokeStyle = '#ffffff90'; q.lineWidth = 2; for (const k of [1, 2]) { q.beginPath(); q.moveTo(w * k / 3, 160); q.lineTo(w * k / 3, 960); q.moveTo(0, 160 + 800 * k / 3); q.lineTo(w, 160 + 800 * k / 3); q.stroke(); }
    q.fillStyle = '#ff3a2a'; q.beginPath(); q.arc(w / 2, 1040, 44, 0, 6.28); q.fill(); q.strokeStyle = '#ffffff'; q.lineWidth = 6; q.beginPath(); q.arc(w / 2, 1040, 56, 0, 6.28); q.stroke(); q.fillStyle = '#ff3a2a'; q.fillRect(w / 2 - 70, 90, 140, 44); txt(q, st.time || '00:12', w / 2, 112, 28, '#ffffff', 'Arial', 900); }
  else if (st.mode === 'views' || st.mode === 'comments' || st.mode === 'newvid') { const nv = st.mode === 'newvid'; thumb(0, 60, w, 300, nv ? 1 : 0);
    let y = wrap(nv ? 'The city closed us. 61 people are waiting. We need a garage.' : 'My brother fixes trash mowers to save our house', 24, 380, 34, '#1b2a44', w - 48);
    q.fillStyle = '#c8322e'; q.font = '900 46px Arial Black, Arial'; q.textAlign = 'left'; q.textBaseline = 'top'; q.fillText((st.views || '400') + ' views', 24, y + 6); y += 70;
    q.fillStyle = '#f2f2f4'; q.fillRect(0, y, w, 4); q.fillStyle = '#3a3a42'; q.font = '700 26px Arial'; q.fillText('Mia  \u2022  ' + (nv ? '2 hours ago' : 'posted last night'), 24, y + 16); y += 64;
    if (st.mode === 'comments' || nv) { const C = st.cmts || ['Do you do repairs?', 'Where are you??', "I'll pay you to fix mine", 'This made me cry', 'Ohio here, 2 mowers waiting!'];
      C.forEach((c, i) => { if (i >= (st.nc ?? C.length)) return; q.fillStyle = ['#e8b830', '#3a7ad8', '#2f8a4a', '#c8322e', '#8a3a8a'][i % 5]; q.beginPath(); q.arc(50, y + 30, 22, 0, 6.28); q.fill(); q.fillStyle = '#1b2a44'; q.font = '700 30px Arial'; q.fillText(c, 88, y + 14); q.fillStyle = '#9a9aa2'; q.font = '700 20px Arial'; q.fillText('\u2665 ' + (120 + i * 37) + '   reply', 88, y + 54); y += 96; }); }
    else { q.fillStyle = '#e8e8ec'; for (let i = 0; i < 4; i++) { q.fillRect(24, y + i * 130, 160, 100); q.fillStyle = '#c8c8d0'; q.fillRect(200, y + 10 + i * 130, 280, 16); q.fillRect(200, y + 40 + i * 130, 180, 14); q.fillStyle = '#e8e8ec'; } } }
  else if (st.mode === 'call') { q.fillStyle = '#1c2a3a'; q.fillRect(0, 0, w, h); txt(q, 'INCOMING CALL', w / 2, 220, 34, '#9ab0c8', 'Arial', 700); q.fillStyle = '#e07a1a'; q.beginPath(); q.arc(w / 2, 430, 110, 0, 6.28); q.fill(); txt(q, 'HC', w / 2, 432, 90, '#ffffff');
    txt(q, 'Hardware Company', w / 2, 610, 44, '#ffffff', 'Arial', 900); txt(q, 'Corporate Office', w / 2, 670, 30, '#9ab0c8', 'Arial', 700); for (const [x, c] of [[150, '#d83a3a'], [390, '#2fb85a']]) { q.fillStyle = c; q.beginPath(); q.arc(x, 960, 60, 0, 6.28); q.fill(); } }
  else if (st.mode === 'listing') { q.fillStyle = '#f4f4f6'; q.fillRect(0, 60, w, h); txt(q, 'MARKETPLACE', w / 2, 110, 34, '#1b2a44', 'Arial', 900); const it = [['Used mower - RUNS GREAT', '$120'], ['Push mower, like new', '$140'], ['Lawn mower, runs', '$110'], ['Mower (needs work)', '$15']];
    it.forEach(([a, b], i) => { const y = 160 + i * 230; q.fillStyle = '#ffffff'; q.fillRect(20, y, w - 40, 210); q.fillStyle = ['#c8322e', '#2f8a4a', '#e8b830', '#6a6e76'][i]; q.fillRect(40, y + 30, 150, 110); q.fillStyle = '#1a1a22'; q.fillRect(55, y + 140, 26, 26); q.fillRect(150, y + 140, 26, 26); txt(q, b, 360, y + 70, 64, i === 3 ? '#6a6a72' : '#2f8a4a'); q.fillStyle = '#1b2a44'; q.font = '700 26px Arial'; q.textAlign = 'left'; q.fillText(a, 220, y + 150); }); }
  else if (st.mode === 'clips') { q.fillStyle = '#101014'; q.fillRect(0, 60, w, h); txt(q, 'Videos  (' + (st.n || 212) + ')', w / 2, 110, 34, '#ffffff', 'Arial', 900); const lab = ['DAY 3', 'pull #2', 'pull #7', 'DAY 5', 'carb', 'DAY 11', 'trailer', 'float', 'DAY 29', 'Mom'];
    for (let i = 0; i < 15; i++) { const x = (i % 3) * (w / 3), y = 150 + Math.floor(i / 3) * 190 - (st.scroll || 0) * 400; if (y < 60 || y > h) continue; const gr = q.createLinearGradient(0, y, 0, y + 180); gr.addColorStop(0, ['#8ab8e0', '#c8a878', '#6a8a5a'][i % 3]); gr.addColorStop(1, '#3a3a42'); q.fillStyle = gr; q.fillRect(x + 4, y, w / 3 - 8, 180); q.fillStyle = '#3d7fd0'; q.fillRect(x + 70, y + 70, 36, 80); q.fillStyle = '#f2c9a4'; q.beginPath(); q.arc(x + 88, y + 60, 20, 0, 6.28); q.fill(); txt(q, lab[i % 10], x + w / 6, y + 165, 22, '#ffffff', 'Arial', 900); } }
  else if (st.mode === 'ending') { q.fillStyle = '#101014'; q.fillRect(0, 60, w, h); const y = 300; const gr = q.createLinearGradient(0, y, 0, y + 420); gr.addColorStop(0, '#9ac0e8'); gr.addColorStop(0.6, '#8a8a92'); gr.addColorStop(1, '#4a4a50'); q.fillStyle = gr; q.fillRect(0, y, w, 420);
    q.fillStyle = '#6a7a8a'; q.fillRect(260, y + 220, 240, 110); q.fillStyle = '#2a9a92'; q.fillRect(150, y + 200, 70, 150); q.fillStyle = '#f0c8a4'; q.beginPath(); q.arc(185, y + 180, 34, 0, 6.28); q.fill(); q.fillStyle = '#3d7fd0'; q.fillRect(226, y + 210, 60, 140); q.fillStyle = '#f2c9a4'; q.beginPath(); q.arc(256, y + 190, 30, 0, 6.28); q.fill(); q.fillStyle = '#9fd4ff'; for (let k = 0; k < 3; k++) q.fillRect(172 + k * 10, y + 190 + k * 8, 5, 12);
    q.fillStyle = '#c8322e'; q.fillRect(0, y + 420, w * 0.97, 10); txt(q, '\u25B6  ' + (st.time || '11:58') + ' / 12:04', w / 2, y + 470, 30, '#ffffff', 'Arial', 700); txt(q, 'EXPORT', w / 2, 900, 40, '#2fb85a', 'Arial', 900); }
  else if (st.mode === 'notes') { txt(q, 'Day 0', w / 2, 140, 60, '#1b2a44'); }
});
const lidDraw = (D, s) => dynDraw(D, s, (q, w, h) => { q.fillStyle = '#d8a845'; q.fillRect(0, 0, w, h); q.fillStyle = '#f4ecd0'; q.beginPath(); q.arc(w / 2, h / 2, w * 0.4, 0, 6.28); q.fill(); if (s) { hand(q, s.split(' ')[0], w / 2, h / 2 - 26, 50, '#1a1a22', -0.08, hw); hand(q, s.split(' ').slice(1).join(' '), w / 2, h / 2 + 32, 54, s.includes('MIA') ? '#c8322e' : '#2f5aa8', -0.05, hw); } });
const clockDraw = (D, hh, mm) => dynDraw(D, hh + ':' + mm, (q, w, h) => { q.fillStyle = '#fbfbf6'; q.beginPath(); q.arc(w / 2, h / 2, w / 2, 0, 6.28); q.fill(); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; q.fillStyle = '#1a1a22'; q.fillRect(w / 2 + Math.sin(a) * 105 - 3, h / 2 - Math.cos(a) * 105 - 8, 6, 16); }
  const hand_ = (a, L, wd) => { q.strokeStyle = '#1a1a22'; q.lineWidth = wd; q.lineCap = 'round'; q.beginPath(); q.moveTo(w / 2, h / 2); q.lineTo(w / 2 + Math.sin(a) * L, h / 2 - Math.cos(a) * L); q.stroke(); };
  hand_((hh % 12 + mm / 60) / 12 * 6.283, 60, 10); hand_(mm / 60 * 6.283, 92, 6); q.fillStyle = '#c8322e'; q.beginPath(); q.arc(w / 2, h / 2, 8, 0, 6.28); q.fill(); });
const outDraw = (D, kind) => dynDraw(D, kind, (q, w, h) => { const sky = { night: ['#0a1430', '#24345e'], day: ['#7ab0e8', '#d8e8f4'], dawn: ['#f2a060', '#f8d8a8'], dusk: ['#3a2a5a', '#e88a5a'] }[kind] || ['#7ab0e8', '#d8e8f4'];
  const gr = q.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, sky[0]); gr.addColorStop(1, sky[1]); q.fillStyle = gr; q.fillRect(0, 0, w, h); if (kind === 'night') { q.fillStyle = '#fff8e0'; for (let i = 0; i < 40; i++) q.fillRect(R() * w, R() * h * 0.5, 2, 2); q.fillStyle = '#e8e8f0'; q.beginPath(); q.arc(w * 0.75, h * 0.2, 18, 0, 6.28); q.fill(); }
  const dk = kind === 'night' ? '#101828' : kind === 'dusk' ? '#2a2438' : '#4a7a3a'; q.fillStyle = dk; for (let i = 0; i < 8; i++) { q.beginPath(); q.arc(i * 80 + R() * 30, h * 0.72, 40 + R() * 40, 0, 6.28); q.fill(); } q.fillRect(0, h * 0.72, w, h * 0.28);
  q.fillStyle = kind === 'night' ? '#1a2438' : '#e8e0d0'; q.fillRect(w * 0.55, h * 0.48, w * 0.3, h * 0.3); q.fillStyle = kind === 'night' ? '#ffd080' : '#3a4e62'; q.fillRect(w * 0.6, h * 0.55, w * 0.06, h * 0.08); q.fillRect(w * 0.74, h * 0.55, w * 0.06, h * 0.08);
  q.fillStyle = kind === 'night' ? '#141c2c' : '#8a7a6a'; q.fillRect(0, h * 0.82, w, 6); for (let x = 0; x < w; x += 22) q.fillRect(x, h * 0.75, 6, h * 0.1); });
const garOutDraw = (D, kind) => dynDraw(D, kind, (q, w, h) => { const day = kind !== 'night'; const gr = q.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, day ? '#a8d0f0' : '#0a1430'); gr.addColorStop(0.55, day ? '#e8f0f4' : '#24345e'); gr.addColorStop(0.56, day ? '#9a9286' : '#2a2a30'); gr.addColorStop(1, day ? '#b8b0a0' : '#1a1a20'); q.fillStyle = gr; q.fillRect(0, 0, w, h);
  q.fillStyle = day ? '#5a8a3a' : '#101820'; for (let i = 0; i < 10; i++) { q.beginPath(); q.arc(i * 110 + 40, h * 0.5, 60 + (i % 3) * 20, 0, 6.28); q.fill(); } q.fillStyle = day ? '#d8e2e8' : '#1c2438'; q.fillRect(w * 0.1, h * 0.3, w * 0.35, h * 0.26); q.fillStyle = day ? '#6a2a2a' : '#141a28'; q.beginPath(); q.moveTo(w * 0.07, h * 0.3); q.lineTo(w * 0.275, h * 0.16); q.lineTo(w * 0.48, h * 0.3); q.fill();
  if (kind === 'line') { for (let i = 0; i < 9; i++) { q.fillStyle = MOWCOL[i % 10]; q.fillRect(80 + i * 100, h * 0.74, 70, 40); q.fillStyle = '#1a1a22'; q.fillRect(95 + i * 100, h * 0.8, 14, 14); q.fillRect(130 + i * 100, h * 0.8, 14, 14); } } });
const signOldDraw = (D) => dynDraw(D, 'old', (q, w, h) => { q.fillStyle = '#e8e4d8'; q.fillRect(0, 0, w, h); noise(q, w, h, 0.25, 9000, '#b8b0a0', '#ffffff'); q.globalAlpha = 0.35; txt(q, 'SERVICE  \u2022  REPAIR', w / 2, h / 2 + 6, 120, '#2f5aa8'); q.globalAlpha = 1; blobs(q, w, h, ['#8a6a4a'], 12, 20, 60, 0.25); });
const poleDraw = (D, kind) => dynDraw(D, kind, (q, w, h) => { if (kind === 'new') { q.fillStyle = '#2a5aa8'; q.fillRect(0, 0, w, h); q.strokeStyle = '#f2c23a'; q.lineWidth = 10; q.strokeRect(8, 8, w - 16, h - 16); txt(q, 'DAY ONE', w / 2, 90, 84, '#ffffff'); txt(q, 'SMALL ENGINES', w / 2, 180, 52, '#ffffff'); txt(q, 'BRING IT BROKEN', w / 2, 256, 40, '#f2c23a'); }
  else { q.fillStyle = '#e8e4d8'; q.fillRect(0, 0, w, h); noise(q, w, h, 0.25, 6000, '#b8b0a0', '#ffffff'); q.globalAlpha = 0.4; txt(q, 'GAS', w / 2, h / 2, 150, '#c8322e'); q.globalAlpha = 1; if (kind === 'rent') { q.fillStyle = '#fbf8f0'; q.fillRect(60, 200, 360, 90); txt(q, 'FOR RENT', w / 2, 245, 60, '#c8322e'); } } });
const lapDraw = (D, kind) => dynDraw(D, kind, (q, w, h) => { q.fillStyle = '#1e2028'; q.fillRect(0, 0, w, h); q.fillStyle = '#3a3e4a'; q.fillRect(0, 0, w, 18); const gr = q.createLinearGradient(0, 30, 0, 140); gr.addColorStop(0, '#8ab8e0'); gr.addColorStop(1, '#6a9a4a'); q.fillStyle = gr; q.fillRect(40, 26, 260, 120);
  for (let i = 0; i < 12; i++) { q.fillStyle = ['#c8322e', '#3a7ad8', '#e8b830', '#2f8a4a'][i % 4]; q.fillRect(10 + i * 27, 160, 24, 18); q.fillRect(10 + i * 27 + (i % 3) * 4, 184, 18, 12); } q.fillStyle = '#ff3a2a'; q.fillRect(10 + (kind === 'upload' ? 300 : 170), 152, 3, 56); if (kind === 'upload') { q.fillStyle = '#2fb85a'; q.fillRect(60, 80, 220, 26); txt(q, 'UPLOADING... 98%', 170, 93, 16, '#ffffff', 'Arial', 900); } });

// ---------- wipe occluders (an object crossing just in front of the lens = hidden cut) ----------
const WIPE = {}; const wipeG = new THREE.Group(); scene.add(wipeG);
{ const mk = (k, g) => { wipeG.add(g); g.visible = false; g.traverse((o) => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; o.userData.wipe = true; o.renderOrder = 10; } }); WIPE[k] = g; };
  const mw = new THREE.Group(); const hm = heroMower(mw, '#c8322e'); hm.scale.setScalar(1.6); hm.position.set(0, -0.6, 0); mk('mower', mw);
  const cb = new THREE.Group(); add(tbox(1.8, 1.2, 0.03, 0.5), M.cardboard, 0, 0, 0, cb); mk('board', cb);
  const ap = new THREE.Group(); add(new THREE.PlaneGeometry(1.6, 1.8), signM(cv(256, 300, (q, w, h) => { q.drawImage(cardboardT, 0, 0, w, h); hand(q, 'BRING IT', w / 2, 120, 46, '#1a1a22', 0, hw); hand(q, 'BROKEN', w / 2, 180, 52, '#c8322e', 0, hw); }), { side: THREE.DoubleSide }), 0, 0, 0, ap, nocast); mk('sign', ap); }

// ---------- per-frame world state ----------
const SETS = { house: [HS.g], kit: [KS.g], gar: [GS.g], main: [MS.g], hosp: [HSP.g], ware: [WS.g] };
let _lastSet = '';
function worldState(S, f) {
  extraL.intensity = S.extra ? S.extra.i : 0; if (S.extra) { extraL.position.set(...S.extra.pos); extraL.color.set(S.extra.col || '#ffd08a'); extraL.distance = S.extra.dist || 12; }
  scrL.intensity = 0; bulbL.intensity = 0; if (S.extra2) { scrL.intensity = S.extra2.i; scrL.position.set(...S.extra2.pos); scrL.color.set(S.extra2.col || '#ffe0b0'); scrL.distance = S.extra2.dist || 14; }
  if (S.extra3) { bulbL.intensity = S.extra3.i; bulbL.position.set(...S.extra3.pos); bulbL.color.set(S.extra3.col || '#ffb35a'); bulbL.distance = S.extra3.dist || 9; }
  // set visibility (only the active set is drawn; trees stay)
  if (S.set !== _lastSet) { _lastSet = S.set; for (const k in SETS) for (const g of SETS[k]) g.visible = (k === S.set); }
  for (const G of GLOWS) G.m.emissive.set(S.night ? G.on : '#000000'), G.m.emissiveIntensity = S.night ? (S.glowK ?? 1.2) : 0;
  // ---- house ----
  HS.trailer.visible = !!S.trailer; HS.tire.visible = !!S.tire; HS.letter.visible = HS.tape.visible = !!S.doorLetter; if (S.doorLetter) letterDraw(HS.letterD, 'evict');
  HS.garDoor.position.y = (S.garOpen ?? 0) * 2.2; HS.garDoor.visible = (S.garOpen ?? 0) < 0.98; HS.sign.visible = !!S.sign; HS.police.visible = !!S.police; HS.custCars.forEach((c, i) => { c.visible = i < (S.custCars || 0); });
  HS.inspCar.visible = !!S.inspCar; HS.manCar.visible = !!S.manCar; HS.carA.visible = !S.noParked; HS.carB.visible = !S.noParked;
  for (const k in MOWERS) mowerShow(k, (S.mowers && S.mowers[k]) || 0);
  for (const k in (S.mpos || {})) { const m = MOWERS[k]; if (m) { m.g.position.set(...S.mpos[k]); m.g.rotation.y = (S.mrot && S.mrot[k]) || 0; } }
  if (S.trailerPos) { HS.trailer.position.set(...S.trailerPos); HS.trailer.rotation.y = S.trailerRy ?? Math.PI; MOWERS.trailer.g.position.set(S.trailerPos[0] - 6, 0, S.trailerPos[2] - 5.4); } else { HS.trailer.position.set(6, 0, 5.4); HS.trailer.rotation.y = Math.PI; MOWERS.trailer.g.position.set(0, 0, 0); }
  HS.house.userData.door.rotation.y = -(S.houseDoor || 0) * 1.3; if (S.manCarZ != null) HS.manCar.position.x = S.manCarZ; else HS.manCar.position.x = 10.5; if (S.inspCarX != null) HS.inspCar.position.x = S.inspCarX; else HS.inspCar.position.x = 12.5;
  if (KS.flame) KS.flame.visible = !!(S.kit && S.kit.flame);
  // ---- kitchen ----
  const KI = S.kit || {}; outDraw(KS.outD, S.night ? 'night' : (S.out || 'day'));
  KS.jar.visible = !!KI.jar; if (KI.jar) { const [x, y, z] = KI.jar.pos; KS.jar.position.set(x, y, z); KS.jar.rotation.y = KI.jar.ry || 0; KS.jarCash.scale.y = Math.max(0.02, KI.jar.fill ?? 0.05); KS.jarCash.position.y = 0.1 * KS.jarCash.scale.y + 0.003; lidDraw(KS.jarLidD, KI.jar.lid || ''); KS.envOpen.visible = !!KI.jar.env; }
  for (const k in KS.items) KS.items[k].visible = !!KI[k]; if (KI.letter) letterDraw(KS.letterD, KI.letter === true ? 'evict' : KI.letter); if (KI.laptop) lapDraw(KS.lapD, KI.laptop === true ? 'edit' : KI.laptop);
  calDraw(KS.calD, KI.cal || { crossed: 0, due: 0 }); KS.hallDoor.rotation.y = -(KI.hall ?? 0) * 1.3;
  // ---- garage ----
  const GI = S.gar || {}; GS.door.position.y = (GI.open ?? 0) * 2.2; garOutDraw(GS.outD, GI.out || (S.night ? 'night' : 'day')); boardDraw(GS.boardD, GI.board || { mode: 'fix' }); calDraw(GS.calD, GI.cal || { crossed: 0 });
  GS.hero.visible = GI.hero !== false; if (GI.heroPos) GS.hero.position.set(...GI.heroPos); else GS.hero.position.set(0.25, 0, -1.4); GS.hero.rotation.y = GI.heroRy ?? Math.PI * 0.85;
  const sh = GI.shake || 0; GS.hero.position.x += sh * 0.006 * Math.sin(f * 2.7); GS.hero.position.y = sh * 0.004 * Math.abs(Math.sin(f * 3.3)); GS.hero.rotation.z = sh * 0.012 * Math.sin(f * 3.1);
  phoneDraw(GS.phoneD, GI.phone || { mode: 'video', t: 0.4 }); GS.bulb.material.color.set(GI.bulbOff ? '#5a5040' : '#fff0c0'); GS.bowl.position.y = GI.tap ? -0.004 * Math.abs(Math.sin(f * 1.6)) : 0;
  // ---- main street ----
  const MI = S.main || {}; signOldDraw(MS.signD); MS.newSign.visible = MI.newSign != null; if (MI.newSign != null) { MS.newSign.position.y = -2.2 * (1 - MI.newSign); MS.newSign.rotation.z = 0.04 * (1 - MI.newSign); } poleDraw(MS.poleD, MI.pole || 'old');
  MS.bays.forEach((b, i) => { const o = MI.bays ?? 0; b.position.y = o * 3.0; b.visible = o < 0.98; }); MS.benches.forEach((b, i) => { b.visible = i < (MI.benches ?? 0); }); MS.hero.visible = !!MI.hero; MS.apron.visible = !!MI.apron; MS.deskCash.visible = !!MI.deskCash;
  MS.dinerDoor.rotation.y = -(MI.dinerDoor || 0) * 1.2; MS.shopDoor.rotation.y = -(MI.shopDoor || 0) * 1.2; MS.lotCar.visible = MI.lotCar !== false; MS.buyerCar.visible = !!MI.buyerCar; MS.moveTruck.visible = !!MI.moveTruck; MS.cash1.visible = !!MI.cash1;
  MS.units.forEach((u_, i) => { const o = i === 1 ? (MI.unitOpen || 0) : 0; u_.position.y = o * 2.2; u_.visible = o < 0.98; });
  // ---- hospital ----
  if (S.clock) clockDraw(HSP.clockD, S.clock[0], S.clock[1]);
  // ---- insert props ----
  if (S.phone) { PHN.g.position.set(...S.phone.pos); PHN.g.rotation.set(...(S.phone.rot || [0, 0, 0])); phoneDraw(PHN.D, S.phone.screen); PHN.g.visible = true; } else PHN.g.visible = false;
  if (S.paper) { PAP.g.position.set(...S.paper.pos); PAP.g.rotation.set(...(S.paper.rot || [0, 0, 0])); letterDraw(PAP.D, S.paper.kind || 'city'); PAP.g.visible = true; } else PAP.g.visible = false;
  // ---- wipes ----
  for (const k in WIPE) WIPE[k].visible = false;
  const wp = S.wipe; if (wp && WIPE[wp.kind]) { const g = WIPE[wp.kind]; g.visible = true; camera.getWorldDirection(_fwd); _rt.set(1, 0, 0).applyQuaternion(camera.quaternion); _up.set(0, 1, 0).applyQuaternion(camera.quaternion);
    const d = wp.d ?? 0.6; g.position.copy(camera.position).addScaledVector(_fwd, d).addScaledVector(_rt, wp.x * d * 2.6).addScaledVector(_up, (wp.y || 0) * d); g.quaternion.copy(camera.quaternion); if (wp.spin) g.rotateZ(wp.spin); if (wp.yaw) g.rotateY(wp.yaw); }
}
// ---------- render targets & post ----------
const rtColor = new THREE.WebGLRenderTarget(W, H, { samples: 4, type: THREE.HalfFloatType });
const rtNd = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter });
const rtInk = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType });
const rtAO = new THREE.WebGLRenderTarget(W, H, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter });
const fsCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), fsGeo = new THREE.PlaneGeometry(2, 2);
const fs = (mat) => { const s = new THREE.Scene(); s.add(new THREE.Mesh(fsGeo, mat)); return s; };
const inkU = { col: { value: rtColor.texture }, nd: { value: rtNd.texture }, ao: { value: rtAO.texture }, aoK: { value: 0.75 }, expo: { value: 1.12 }, warm: { value: new THREE.Color('#fff1dc') }, cool: { value: new THREE.Color('#e8ecfa') }, res: { value: new THREE.Vector2(W, H) }, px: { value: 1.6 }, fogCol: { value: new THREE.Color() },
  sat: { value: 1.08 }, lift: { value: new THREE.Color(0, 0, 0) }, gain: { value: new THREE.Color(1, 1, 1) }, vig: { value: 0.22 }, flash: { value: 0 }, flashCol: { value: new THREE.Color(1, 1, 1) } };
const inkScene = fs(new THREE.ShaderMaterial({ uniforms: inkU, vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `uniform sampler2D col, nd, ao; uniform vec2 res; uniform float px, sat, vig, flash, aoK, expo; uniform vec3 fogCol, lift, gain, warm, cool, flashCol; varying vec2 vUv;
  vec3 aces(vec3 x){ return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14), 0., 1.); }
  float aoAt(vec2 uv, float d0){ float s = 0., w = 0.; for (int j=0;j<4;j++) for (int i=0;i<4;i++){ vec2 o = (vec2(float(i),float(j))-1.5)*1.6/res; float dd = abs(texture2D(nd, uv+o).a); float wt = (dd > 0. && abs(dd-d0)/d0 < .08) ? 1. : .0; s += texture2D(ao, uv+o).r*wt; w += wt; } return w > 0. ? s/w : 1.; }
  float edgeAt(vec2 uv, float r){
    vec4 c = texture2D(nd, uv); if (dot(c.rgb,c.rgb) < .01 || c.g > 1.5) return 0.; bool lf = c.a < 0.; float d = abs(c.a); vec3 n = c.rgb*2.-1.;
    float e = 0.; float rr = r * clamp(7./d, .62, 1.25);
    for (int i=0;i<16;i++){ float a = float(i)*.785398 + (i>7 ? .39 : 0.); float k = i>7 ? .5 : 1.;
      vec2 o = vec2(cos(a), sin(a))*rr*k/res; vec4 s = texture2D(nd, uv+o);
      float ds = abs(s.a); bool slf = s.a < 0.; bool card = dot(s.rgb,s.rgb) < .01;
      if (card && ds > 0.) continue; if (s.g > 1.5) continue;
      if (card) ds = 1e4;
      vec3 ns = s.rgb*2.-1.;
      if (lf && slf) e = max(e, smoothstep(.05, .11, (ds - d)/d) * .8);
      else e = max(e, smoothstep(.006 + d * .0009, .02 + d * .0012, (ds - d)/d));
      if (!card && !lf && !slf && abs(ds-d)/d < .06) e = max(e, smoothstep(.88, .72, dot(n, ns)) * .9);
    }
    return e * (1. - smoothstep(140., 520., d)*.8);
  }
  void main(){
    vec3 c = texture2D(col, vUv).rgb;
    vec4 ndc = texture2D(nd, vUv); ndc.a = abs(ndc.a); bool isCard = dot(ndc.rgb, ndc.rgb) < .01 && ndc.a > 0.;
    if (!isCard) { float a = (ndc.a > 0.) ? aoAt(vUv, ndc.a) : 1.; c *= mix(1., a, aoK * (1. - smoothstep(22., 60., ndc.a)));
      vec3 tm = aces(c*expo*1.12); tm = pow(tm, vec3(1./1.06)); float L0 = dot(tm, vec3(.299,.587,.114));
      tm *= mix(cool, warm, smoothstep(.15, .75, L0)); tm = max(mix(vec3(L0), tm, 1.07), 0.); c = ndc.a > 0. ? tm : c; }
    else { c *= 1.03; }
    float e = edgeAt(vUv, px);
    c = mix(c, vec3(.012,.01,.014), e);
    if (flash < -0.5) c = vec3(e);
    float l = dot(c, vec3(.299,.587,.114)); c = mix(vec3(l), c, sat);
    c = c*gain + lift;
    vec2 q = vUv-.5; c *= 1. - vig*dot(q*vec2(1.,.75), q*vec2(1.,.75))*2.2;
    c = mix(c, flashCol, max(flash, 0.));
    gl_FragColor = vec4(c,1.); }` }));
const aoU = { nd: { value: rtNd.texture }, tanY: { value: 0.36 }, aspect: { value: W / H }, radius: { value: 1.0 }, res: { value: new THREE.Vector2(W, H) } };
const aoScene = fs(new THREE.ShaderMaterial({ uniforms: aoU, vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `uniform sampler2D nd; uniform float tanY, aspect, radius; uniform vec2 res; varying vec2 vUv;
  vec3 vpos(vec2 uv, float d){ vec2 n = uv*2.-1.; return vec3(n.x*tanY*aspect*d, n.y*tanY*d, -d); }
  void main(){ vec4 c = texture2D(nd, vUv); float d = abs(c.a);
    if (d <= 0. || dot(c.rgb,c.rgb) < .01) { gl_FragColor = vec4(1.); return; }
    vec3 n = normalize(c.rgb*2.-1.); vec3 P = vpos(vUv, d) + n*.02*d*.01;
    vec2 ip = mod(floor(gl_FragCoord.xy), 4.); float rot = (ip.x*4. + mod(ip.y*3., 4.)*1.)*.3927 + ip.y*1.57;
    vec3 t = normalize(cross(n, abs(n.y) < .95 ? vec3(0.,1.,0.) : vec3(1.,0.,0.))), b = cross(n, t);
    float R = radius * clamp(d/6., .6, 3.), occ = 0.;
    for (int i=0;i<12;i++){ float fi = float(i), h = (fi+.5)/12.; float a = fi*2.39996 + rot;
      vec3 dir = (t*cos(a) + b*sin(a))*sqrt(1.-h*h*.6) + n*(.25+.75*fract(fi*.618));
      vec3 S = P + normalize(dir)*R*mix(.12, 1., h*h);
      vec2 su = vec2(S.x/(-S.z)/(tanY*aspect), S.y/(-S.z)/tanY)*.5+.5;
      if (su.x < 0. || su.x > 1. || su.y < 0. || su.y > 1.) continue;
      float sd = abs(texture2D(nd, su).a); if (sd <= 0.) continue;
      float diff = -S.z - sd; occ += step(.03*R, diff) * smoothstep(0., 1., R*1.6/max(abs(d - sd), 1e-3)); }
    float ao = clamp(1. - occ/12.*1.5, 0., 1.); gl_FragColor = vec4(vec3(ao), 1.); }` }));
const dofU = { src: { value: rtInk.texture }, nd: { value: rtNd.texture }, res: { value: new THREE.Vector2(W, H) }, focus: { value: 5 }, cinf: { value: 0 }, near: { value: 1 } };
const dofScene = fs(new THREE.ShaderMaterial({ uniforms: dofU, vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `uniform sampler2D src, nd; uniform vec2 res; uniform float focus, cinf, near; varying vec2 vUv;
  float coc(vec2 uv){ float d = abs(texture2D(nd, uv).a); if (d <= 0.) d = 2000.; float k = 1. - focus/d; return k > 0. ? cinf*k : min(-k*cinf*near, cinf*1.4); }
  void main(){
    float c0 = coc(vUv);
    if (cinf < .5 || c0 < .6) { gl_FragColor = linearToOutputTexel(vec4(texture2D(src, vUv).rgb, 1.)); return; }
    vec3 acc = vec3(0.); float wsum = 0.;
    for (int i=0;i<48;i++){ float fi = float(i); float r = sqrt((fi+.5)/48.); float a = fi*2.39996;
      vec2 o = vec2(cos(a), sin(a))*r*c0/res; float cs = coc(vUv+o);
      float w = smoothstep(r*c0-1.5, r*c0+.5, cs + .5);
      acc += texture2D(src, vUv+o).rgb*w; wsum += w; }
    gl_FragColor = linearToOutputTexel(vec4(acc/max(wsum,1e-3), 1.)); }` }));
dofScene.children[0].material.toneMapped = false;


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
