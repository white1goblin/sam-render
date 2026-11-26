import * as THREE from './lib/three.module.js';
import * as T from './toon.js';
import * as P from './paint.js';
import { SHOTS, TOTAL, shotAt, camAt, dofAt, LIGHTS, lightFor, actorsAt, worldAt, fxAt, overlayAt } from './story.js';
import { SHOP, LAB, S_, L_ } from './sets.js';
import { GLTFLoader } from './lib/jsm/GLTFLoader.js';
import { RGBELoader } from './lib/jsm/RGBELoader.js';
import { shadeCard } from './cardshade.js';

const W = 1080, H = 1920;
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
  ...[['MB', 'Montserrat-Black.ttf'], ['MXB', 'Montserrat-ExtraBold.ttf']].map(async ([n, f]) => { const ff = new FontFace(n, `url(fonts/${f})`); await ff.load(); document.fonts.add(ff); }),
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
// decals: small planes sitting on walls/props get a depth bias toward the camera (kills z-fighting shimmer); materials shared with solid meshes are left alone
{ scene.updateMatrixWorld(true); const good = new Set(), bad = new Set(); let n = 0;
  scene.traverse((o) => { if (!o.isMesh || !o.material || Array.isArray(o.material) || o === sky || o.userData.sky || o.userData.cloud) return; if (cards.some((c) => c.mesh === o || c.blob === o)) return;
    let ok = false; if (o.geometry && o.geometry.type === 'PlaneGeometry') { const b = new THREE.Box3().setFromObject(o), z = b.getSize(new THREE.Vector3()); const vert = Math.min(z.x, z.z) < 0.002 && z.y > 0.002, horiz = z.y < 0.002;
      ok = (vert && z.y * Math.max(z.x, z.z) < 30) || (horiz && z.x * z.z < 2.5); }
    (ok ? good : bad).add(o.material); });
  for (const m of good) if (!bad.has(m)) { m.polygonOffset = true; m.polygonOffsetFactor = -1; m.polygonOffsetUnits = -4; m.needsUpdate = true; n++; }
  window.DECALS = n; }
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
// ---- z-fight finder (diagnostic): coplanar same-side faces of overlapping world AABBs ----
window.ZF = (f) => { const S = shotAt(f); worldState(worldAt(f), f); scene.updateMatrixWorld(true); const B = [];
  scene.traverse((o) => { if (!o.isMesh || o === sky || o.userData.sky || o.userData.cloud) return; if (cards.some((c) => c.mesh === o || c.blob === o)) return; if (!_visible(o)) return;
    const e = o.matrixWorld.elements; const ax = Math.abs(e[1]) + Math.abs(e[2]) + Math.abs(e[4]) + Math.abs(e[6]) + Math.abs(e[8]) + Math.abs(e[9]); const rot = ax > 0.02 && !(Math.abs(e[0]) < 0.02 && Math.abs(e[10]) < 0.02);
    const b = new THREE.Box3().setFromObject(o); if (b.isEmpty()) return; B.push({ b, o, rot, m: (o.material && o.material.uuid) || '', c: o.material && o.material.color ? o.material.color.getHexString() : '' }); });
  const R = [], ks = ['x', 'y', 'z'];
  for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) { const A = B[i], C = B[j]; if (A.m === C.m) continue; if (A.rot && C.rot) continue;
    const a = A.b, c = C.b; let ok = true; for (const k of ks) if (a.max[k] < c.min[k] - 0.003 || c.max[k] < a.min[k] - 0.003) ok = false; if (!ok) continue;
    for (let d = 0; d < 3; d++) { const k = ks[d], o1 = ks[(d + 1) % 3], o2 = ks[(d + 2) % 3];
      const ov = Math.max(0, Math.min(a.max[o1], c.max[o1]) - Math.max(a.min[o1], c.min[o1])) * Math.max(0, Math.min(a.max[o2], c.max[o2]) - Math.max(a.min[o2], c.min[o2])); if (ov < 0.02) continue;
      for (const sd of ['min', 'max']) if (Math.abs(a[sd][k] - c[sd][k]) < 0.0025) { const thinA = a.max[k] - a.min[k] < 0.001, thinC = c.max[k] - c.min[k] < 0.001;
        R.push({ shot: S.id, set: S.set, ax: k + sd, at: +a[sd][k].toFixed(3), ov: +ov.toFixed(2), A: [A.c, a.min.toArray().map((v) => +v.toFixed(2)), a.max.toArray().map((v) => +v.toFixed(2))], C: [C.c, c.min.toArray().map((v) => +v.toFixed(2)), c.max.toArray().map((v) => +v.toFixed(2))], thin: thinA || thinC }); } } }
  return R; };
