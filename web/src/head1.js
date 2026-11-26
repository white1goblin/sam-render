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
