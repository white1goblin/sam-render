
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

