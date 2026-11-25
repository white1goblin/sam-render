// Canvas2D painted textures (our own). All deterministic.
import * as THREE from './lib/three.module.js';

export const rng = (seed) => { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
const cv = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; };
export const tex = (c, rx = 1, ry = 1) => {
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
};
const hsl = (h, s, l, a = 1) => `hsla(${h},${s}%,${l}%,${a})`;
const speckle = (g, w, h, r, n, cols, rad = [1, 3]) => { for (let i = 0; i < n; i++) { g.fillStyle = cols[(r() * cols.length) | 0]; g.beginPath(); g.ellipse(r() * w, r() * h, rad[0] + r() * rad[1], rad[0] + r() * rad[1] * 0.7, r() * 3, 0, 7); g.fill(); } };

export function planks(seed = 1, rot = 0) {
  const [c, g] = cv(512, 512), r = rng(seed), n = 8, w = 512 / n;
  for (let i = 0; i < n; i++) {
    const L = 52 + r() * 10, H = 30 + r() * 6;
    g.fillStyle = hsl(H, 42, L); g.fillRect(i * w, 0, w, 512);
    for (let k = 0; k < 14; k++) { g.strokeStyle = hsl(H - 4, 40, L - 10 - r() * 8, 0.5); g.lineWidth = 1 + r() * 2; g.beginPath(); const x = i * w + 4 + r() * (w - 8); g.moveTo(x, 0); g.bezierCurveTo(x + r() * 6 - 3, 170, x + r() * 6 - 3, 340, x + r() * 4 - 2, 512); g.stroke(); }
    const cut = r() * 512; g.fillStyle = 'rgba(40,24,14,.9)'; g.fillRect(i * w, cut, w, 4);
    for (const y of [cut - 18, cut + 18]) { g.fillStyle = '#2b2620'; g.beginPath(); g.arc(i * w + w * 0.3, y, 2.6, 0, 7); g.arc(i * w + w * 0.7, y, 2.6, 0, 7); g.fill(); }
    g.fillStyle = 'rgba(30,18,10,.95)'; g.fillRect(i * w, 0, 3, 512);
    if (r() < 0.5) { g.fillStyle = hsl(H, 40, L - 16, .8); g.beginPath(); g.ellipse(i * w + w / 2, r() * 512, 5, 9, 0, 0, 7); g.fill(); }
  }
  return c;
}
export function beam(seed = 2, base = [30, 40, 40]) {
  const [c, g] = cv(256, 512), r = rng(seed);
  g.fillStyle = hsl(base[0], base[1], base[2]); g.fillRect(0, 0, 256, 512);
  for (let k = 0; k < 40; k++) { g.strokeStyle = hsl(base[0] - 3, base[1], base[2] - 8 - r() * 10, .45); g.lineWidth = 1 + r() * 3; g.beginPath(); const x = r() * 256; g.moveTo(x, 0); g.bezierCurveTo(x + 8, 170, x - 8, 340, x + r() * 10 - 5, 512); g.stroke(); }
  return c;
}
/** rotting pile: wet dark lower part, moss, rot holes, pale fungus streaks */
export function rotten(seed = 3) {
  const [c, g] = cv(256, 1024), r = rng(seed);
  const gr = g.createLinearGradient(0, 0, 0, 1024); gr.addColorStop(0, '#6b4a2e'); gr.addColorStop(0.45, '#4f3722'); gr.addColorStop(0.8, '#33281c'); gr.addColorStop(1, '#22231a');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 1024);
  for (let k = 0; k < 50; k++) { g.strokeStyle = `rgba(20,12,6,${.3 + r() * .4})`; g.lineWidth = 1 + r() * 3; g.beginPath(); const x = r() * 256; g.moveTo(x, 0); g.bezierCurveTo(x + 10, 300, x - 10, 700, x + r() * 10 - 5, 1024); g.stroke(); }
  // moss bands near the water line and patches
  for (let i = 0; i < 260; i++) { const y = 650 + Math.pow(r(), 0.6) * 374; g.fillStyle = hsl(85 + r() * 25, 45, 26 + r() * 14, .85); g.beginPath(); g.ellipse(r() * 256, y, 4 + r() * 12, 3 + r() * 6, 0, 0, 7); g.fill(); }
  for (let i = 0; i < 70; i++) { g.fillStyle = hsl(95, 40, 30 + r() * 10, .8); g.beginPath(); g.ellipse(r() * 256, r() * 650, 3 + r() * 8, 2 + r() * 5, 0, 0, 7); g.fill(); }
  // rot holes with cracks
  for (let i = 0; i < 9; i++) {
    const x = r() * 256, y = 200 + r() * 760, w = 10 + r() * 26, h = 18 + r() * 50;
    g.fillStyle = '#120c08'; g.beginPath(); g.ellipse(x, y, w, h, 0, 0, 7); g.fill();
    g.strokeStyle = '#8a6a48'; g.lineWidth = 3; g.beginPath(); g.ellipse(x - 2, y - 2, w, h, 0, 3.6, 5.6); g.stroke();
    g.strokeStyle = '#120c08'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(x, y - h); g.lineTo(x + 6, y - h - 40 - r() * 60); g.moveTo(x, y + h); g.lineTo(x - 5, y + h + 30 + r() * 50); g.stroke();
  }
  // pale fungus spots
  for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(226,214,180,${.5 + r() * .4})`; g.beginPath(); g.ellipse(r() * 256, 150 + r() * 700, 2 + r() * 4, 2 + r() * 3, 0, 0, 7); g.fill(); }
  return c;
}
export function stone(seed = 4, hue = 36, sat = 14, lig = 66, bw = 128, bh = 64) {
  const [c, g] = cv(512, 512), r = rng(seed);
  g.fillStyle = '#4a4238'; g.fillRect(0, 0, 512, 512);
  for (let row = 0; row < 512 / bh; row++) for (let col = -1; col < 512 / bw + 1; col++) {
    const x = col * bw + (row % 2) * bw / 2, y = row * bh, L = lig - 6 + r() * 12;
    g.fillStyle = hsl(hue + r() * 8 - 4, sat, L); g.beginPath(); g.roundRect(x + 3, y + 3, bw - 6, bh - 6, 6); g.fill();
    g.fillStyle = hsl(hue, sat, L + 7, .6); g.fillRect(x + 6, y + 5, bw - 14, 5);
    g.fillStyle = hsl(hue, sat, L - 12, .5); g.fillRect(x + 6, y + bh - 10, bw - 12, 5);
    speckle(g, 0, 0, r, 0, ['#000']);
    for (let k = 0; k < 6; k++) { g.fillStyle = hsl(hue, sat, L - 8 - r() * 8, .6); g.beginPath(); g.ellipse(x + r() * bw, y + r() * bh, 2 + r() * 5, 1 + r() * 3, 0, 0, 7); g.fill(); }
  }
  return c;
}
export function mossy(c0, seed = 5, amt = 1) {
  const [c, g] = cv(c0.width, c0.height), r = rng(seed); g.drawImage(c0, 0, 0);
  for (let i = 0; i < 500 * amt; i++) { const y = c.height * (0.4 + 0.6 * Math.pow(r(), 0.5)); g.fillStyle = hsl(90 + r() * 30, 40, 28 + r() * 16, .85); g.beginPath(); g.ellipse(r() * c.width, y, 4 + r() * 10, 3 + r() * 6, 0, 0, 7); g.fill(); }
  // ivy strands with leaves
  for (let s = 0; s < 8 * amt; s++) {
    let x = r() * c.width, y = c.height;
    for (let k = 0; k < 40; k++) { x += (r() - 0.5) * 18; y -= 8 + r() * 6; g.fillStyle = hsl(100 + r() * 20, 45, 30 + r() * 15); g.beginPath(); g.ellipse(x, y, 7, 5, r() * 3, 0, 7); g.fill(); g.strokeStyle = '#1d2b14'; g.lineWidth = 1.5; g.stroke(); }
  }
  return c;
}
export function grass(seed = 6) {
  const [c, g] = cv(512, 512), r = rng(seed);
  g.fillStyle = '#6fa04a'; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 90; i++) { g.fillStyle = hsl(85 + r() * 20, 42, 38 + r() * 14, .5); g.beginPath(); g.ellipse(r() * 512, r() * 512, 20 + r() * 50, 12 + r() * 30, r() * 3, 0, 7); g.fill(); }
  for (let i = 0; i < 1400; i++) { const x = r() * 512, y = r() * 512; g.strokeStyle = hsl(80 + r() * 30, 45, 30 + r() * 25, .9); g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, y); g.lineTo(x + r() * 4 - 2, y - 5 - r() * 7); g.stroke(); }
  for (let i = 0; i < 30; i++) { g.fillStyle = ['#f3e27a', '#ffffff', '#e8a0c0'][i % 3]; g.beginPath(); g.arc(r() * 512, r() * 512, 2.5, 0, 7); g.fill(); }
  return c;
}
export function dirt(seed = 7) {
  const [c, g] = cv(512, 512), r = rng(seed);
  g.fillStyle = '#a88a62'; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 300; i++) { g.fillStyle = hsl(30 + r() * 10, 25, 40 + r() * 25, .6); g.beginPath(); g.ellipse(r() * 512, r() * 512, 3 + r() * 14, 2 + r() * 8, r() * 3, 0, 7); g.fill(); }
  return c;
}
export function plaster(seed = 8, hue = 40) {
  const [c, g] = cv(256, 256), r = rng(seed);
  g.fillStyle = hsl(hue, 40, 86); g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 40; i++) { g.fillStyle = hsl(hue, 30, 76 + r() * 8, .5); g.beginPath(); g.ellipse(r() * 256, r() * 256, 10 + r() * 30, 6 + r() * 16, 0, 0, 7); g.fill(); }
  g.fillStyle = hsl(hue, 20, 60, .5); g.fillRect(0, 236, 256, 20);
  return c;
}
export function roof(seed = 9) {
  const [c, g] = cv(256, 256), r = rng(seed);
  g.fillStyle = '#7b2e1c'; g.fillRect(0, 0, 256, 256);
  for (let row = 0; row < 8; row++) for (let col = 0; col < 8; col++) {
    const x = col * 32 + (row % 2) * 16, y = row * 32; g.fillStyle = hsl(12 + r() * 8, 58, 42 + r() * 10);
    g.beginPath(); g.ellipse(x + 16, y + 16, 14, 17, 0, 0, Math.PI); g.lineTo(x + 2, y); g.fill();
    g.fillStyle = 'rgba(255,220,180,.25)'; g.fillRect(x + 6, y + 2, 5, 22);
  }
  return c;
}
export function marble(seed = 10) {
  const [c, g] = cv(256, 512), r = rng(seed);
  g.fillStyle = '#efe7d6'; g.fillRect(0, 0, 256, 512);
  for (let i = 0; i < 8; i++) { g.fillStyle = 'rgba(160,140,110,.25)'; g.fillRect(i * 32 + 2, 0, 6, 512); }
  for (let k = 0; k < 10; k++) { g.strokeStyle = 'rgba(150,140,130,.35)'; g.lineWidth = 1.5; g.beginPath(); let x = r() * 256, y = 0; g.moveTo(x, y); while (y < 512) { x += r() * 30 - 15; y += 20 + r() * 30; g.lineTo(x, y); } g.stroke(); }
  return c;
}
export function banner() {
  const [c, g] = cv(256, 512);
  g.fillStyle = '#b8282b'; g.fillRect(0, 0, 256, 512);
  g.fillStyle = '#8a1c22'; for (let i = 0; i < 5; i++) g.fillRect(20 + i * 50, 0, 12, 512);
  g.strokeStyle = '#e6b84a'; g.lineWidth = 12; g.strokeRect(14, 14, 228, 484);
  g.fillStyle = '#e6b84a'; g.font = 'bold 66px DejaVu Serif, serif'; g.textAlign = 'center'; g.fillText('SPQR', 128, 300);
  g.lineWidth = 9; g.beginPath(); g.arc(128, 180, 60, 0.4, Math.PI - 0.4, true); g.stroke();
  for (let i = 0; i < 9; i++) { const a = Math.PI + 0.35 + i * 0.3; g.beginPath(); g.ellipse(128 + Math.cos(a) * 60, 180 - Math.sin(a) * 60 * -1, 10, 5, a, 0, 7); g.fill(); }
  for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(i * 32, 512); g.lineTo(i * 32 + 16, 470); g.lineTo(i * 32 + 32, 512); g.fillStyle = '#000'; g.globalCompositeOperation = 'destination-out'; g.fill(); g.globalCompositeOperation = 'source-over'; }
  return c;
}
/** interior of the helmet, planar-mapped: rusty iron + the carved message */
export function helmetInside(reveal = 1) {
  const [c, g] = cv(1024, 1024), r = rng(77);
  const gr = g.createRadialGradient(512, 512, 40, 512, 512, 520); gr.addColorStop(0, '#6d675e'); gr.addColorStop(0.7, '#575148'); gr.addColorStop(1, '#3a352f');
  g.fillStyle = gr; g.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 220; i++) { g.fillStyle = hsl(22 + r() * 12, 55, 28 + r() * 16, .35 + r() * .4); g.beginPath(); g.ellipse(r() * 1024, r() * 1024, 4 + r() * 26, 3 + r() * 14, r() * 3, 0, 7); g.fill(); }
  for (let i = 0; i < 90; i++) { g.strokeStyle = `rgba(30,26,22,${.2 + r() * .3})`; g.lineWidth = 1 + r() * 2; g.beginPath(); const x = r() * 1024, y = r() * 1024; g.moveTo(x, y); g.lineTo(x + r() * 60 - 30, y + r() * 60 - 30); g.stroke(); }
  const lines = ['THE BRIDGE', 'IS NOT', 'SAFE'], ys = [400, 530, 670], sz = [104, 112, 150];
  g.textAlign = 'center'; g.textBaseline = 'middle';
  lines.forEach((t, li) => {
    g.font = `bold ${sz[li]}px DejaVu Serif, serif`;
    const w = g.measureText(t).width; let x = 512 - w / 2;
    for (const ch of t) {
      const cw = g.measureText(ch).width, a = (r() - 0.5) * 0.12, dy = (r() - 0.5) * 10;
      g.save(); g.translate(x + cw / 2, ys[li] + dy); g.rotate(a);
      g.fillStyle = '#d6cdbd'; g.fillText(ch, 3, 4);       // lit lower lip of the groove
      g.fillStyle = '#16120f'; g.fillText(ch, 0, 0);       // groove
      g.fillStyle = 'rgba(70,60,50,.9)'; g.fillText(ch, -2, -3);
      g.restore(); x += cw;
    }
  });
  // scratch-out flourish under the words
  g.strokeStyle = '#16120f'; g.lineWidth = 7; g.beginPath(); g.moveTo(330, 765); g.lineTo(700, 760); g.stroke();
  g.strokeStyle = '#cbbfa9'; g.lineWidth = 3; g.beginPath(); g.moveTo(332, 772); g.lineTo(702, 767); g.stroke();
  return c;
}
export function radial(col = '0,0,0', a = 0.55) {
  const [c, g] = cv(128, 128), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, `rgba(${col},${a})`); gr.addColorStop(0.55, `rgba(${col},${a * 0.6})`); gr.addColorStop(1, `rgba(${col},0)`);
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return c;
}

// ---------------- outback painters ----------------
export function redDirt(seed = 21, base = '#b5643a') {
  const [c, g] = cv(512, 512), r = rng(seed);
  g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 120; i++) { g.fillStyle = hsl(16 + r() * 12, 50, 38 + r() * 18, .45); g.beginPath(); g.ellipse(r() * 512, r() * 512, 16 + r() * 40, 8 + r() * 22, r() * 3, 0, 7); g.fill(); }
  for (let i = 0; i < 700; i++) { g.fillStyle = hsl(18 + r() * 16, 40, 25 + r() * 45, .8); g.beginPath(); g.ellipse(r() * 512, r() * 512, 1 + r() * 3, 1 + r() * 2, r() * 3, 0, 7); g.fill(); }
  for (let i = 0; i < 40; i++) { const x = r() * 512, y = r() * 512; g.strokeStyle = hsl(60 + r() * 30, 30, 40 + r() * 15, .9); g.lineWidth = 2; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + r() * 10 - 5, y - 6 - r() * 8); g.stroke(); } }
  return c;
}
export function road(seed = 22) {
  const [c, g] = cv(512, 512), r = rng(seed);
  g.fillStyle = '#c0703f'; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 160; i++) { g.fillStyle = hsl(18 + r() * 10, 48, 44 + r() * 16, .5); g.beginPath(); g.ellipse(r() * 512, r() * 512, 10 + r() * 30, 4 + r() * 10, 0, 0, 7); g.fill(); }
  for (const y of [120, 170, 340, 390]) { g.fillStyle = 'rgba(110,50,25,.35)'; g.fillRect(0, y + (r() - .5) * 6, 512, 18); }
  for (let i = 0; i < 500; i++) { g.fillStyle = hsl(20, 30, 30 + r() * 50, .8); g.fillRect(r() * 512, r() * 512, 2, 2); }
  return c;
}
export function stubble(seed = 23) { // wheat field ground
  const [c, g] = cv(512, 512), r = rng(seed);
  g.fillStyle = '#c99a45'; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 80; i++) { g.fillStyle = hsl(38 + r() * 10, 55, 42 + r() * 18, .5); g.beginPath(); g.ellipse(r() * 512, r() * 512, 20 + r() * 50, 10 + r() * 20, 0, 0, 7); g.fill(); }
  for (let i = 0; i < 2200; i++) { const x = r() * 512, y = r() * 512; g.strokeStyle = hsl(40 + r() * 10, 60, 45 + r() * 30, .9); g.lineWidth = 1.6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + r() * 4 - 2, y - 6 - r() * 8); g.stroke(); }
  return c;
}
export function corrugated(seed = 24, L = 70) {
  const [c, g] = cv(256, 256), r = rng(seed);
  for (let x = 0; x < 256; x++) { const k = 0.5 + 0.5 * Math.sin(x / 256 * Math.PI * 2 * 16); g.fillStyle = hsl(205, 8, L - 18 + k * 26); g.fillRect(x, 0, 1, 256); }
  for (let i = 0; i < 30; i++) { g.fillStyle = hsl(22, 60, 38, .35); g.beginPath(); g.ellipse(r() * 256, r() * 256, 4 + r() * 16, 3 + r() * 10, 0, 0, 7); g.fill(); }
  g.fillStyle = 'rgba(40,40,50,.6)'; for (let y = 0; y < 256; y += 128) g.fillRect(0, y, 256, 3);
  return c;
}
export function weatherboard(seed = 25, hue = 45, L = 84) {
  const [c, g] = cv(256, 256), r = rng(seed);
  for (let i = 0; i < 8; i++) { g.fillStyle = hsl(hue, 30, L - r() * 6); g.fillRect(0, i * 32, 256, 32); g.fillStyle = hsl(hue, 20, L - 30, .8); g.fillRect(0, i * 32 + 28, 256, 4); }
  for (let i = 0; i < 30; i++) { g.fillStyle = hsl(hue, 15, L - 18, .4); g.fillRect(r() * 256, r() * 256, 20 + r() * 40, 2); }
  return c;
}
export function bark(seed = 26) { // gum tree bark: pale with grey/peach patches
  const [c, g] = cv(256, 512), r = rng(seed);
  g.fillStyle = '#e4ddcf'; g.fillRect(0, 0, 256, 512);
  for (let i = 0; i < 50; i++) { g.fillStyle = ['#c9c0b0', '#d8b89a', '#b7b4a8', '#efe9de'][i % 4]; g.beginPath(); g.ellipse(r() * 256, r() * 512, 10 + r() * 30, 20 + r() * 60, 0, 0, 7); g.fill(); }
  for (let i = 0; i < 20; i++) { g.strokeStyle = 'rgba(90,80,70,.4)'; g.lineWidth = 2; g.beginPath(); const x = r() * 256; g.moveTo(x, 0); g.lineTo(x + r() * 20 - 10, 512); g.stroke(); }
  return c;
}
export function canvasTex(seed = 27) { // tent canvas
  const [c, g] = cv(256, 256), r = rng(seed);
  g.fillStyle = '#b9ad84'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 256; i += 4) { g.fillStyle = `rgba(90,80,50,${.06 + r() * .06})`; g.fillRect(i, 0, 2, 256); g.fillRect(0, i, 256, 1); }
  for (let i = 0; i < 12; i++) { g.fillStyle = 'rgba(120,90,60,.2)'; g.beginPath(); g.ellipse(r() * 256, r() * 256, 10 + r() * 30, 6 + r() * 14, 0, 0, 7); g.fill(); }
  return c;
}
export function crate(seed = 28) {
  const [c, g] = cv(256, 256), r = rng(seed);
  for (let i = 0; i < 4; i++) { g.fillStyle = hsl(34, 40, 52 + r() * 8); g.fillRect(0, i * 64, 256, 64); g.fillStyle = 'rgba(40,24,14,.8)'; g.fillRect(0, i * 64, 256, 3); }
  g.strokeStyle = '#5a3b22'; g.lineWidth = 14; g.strokeRect(7, 7, 242, 242); g.beginPath(); g.moveTo(14, 14); g.lineTo(242, 242); g.stroke();
  g.fillStyle = '#2b2620'; for (const [x, y] of [[20, 20], [236, 20], [20, 236], [236, 236]]) { g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); }
  return c;
}

// ---------------- Pig War painters ----------------
export function speckleTex(seed = 41) { // neutral ground texture tinted by vertex colours
  const [c, g] = cv(512, 512), r = rng(seed);
  g.fillStyle = '#f2f2f2'; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 110; i++) { g.fillStyle = `rgba(0,0,0,${0.03 + r() * 0.05})`; g.beginPath(); g.ellipse(r() * 512, r() * 512, 18 + r() * 50, 10 + r() * 26, r() * 3, 0, 7); g.fill(); }
  for (let i = 0; i < 1300; i++) { const x = r() * 512, y = r() * 512; g.strokeStyle = `rgba(${r() < 0.5 ? '0,0,0' : '255,255,255'},${0.12 + r() * 0.18})`; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + r() * 4 - 2, y - 4 - r() * 6); g.stroke(); }
  return c;
}
export function logs(seed = 42) { // horizontal log-cabin wall
  const [c, g] = cv(512, 512), r = rng(seed), n = 8, h = 512 / n;
  for (let i = 0; i < n; i++) { const y = i * h, L = 34 + r() * 8;
    const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, hsl(28, 40, L + 10)); gr.addColorStop(0.5, hsl(28, 42, L)); gr.addColorStop(1, hsl(26, 45, L - 14)); g.fillStyle = gr; g.fillRect(0, y, 512, h);
    for (let k = 0; k < 6; k++) { g.strokeStyle = hsl(26, 40, L - 12, .5); g.lineWidth = 1 + r() * 2; g.beginPath(); const yy = y + 8 + r() * (h - 16); g.moveTo(0, yy); g.bezierCurveTo(170, yy + r() * 6 - 3, 340, yy + r() * 6 - 3, 512, yy); g.stroke(); }
    g.fillStyle = 'rgba(30,18,10,.9)'; g.fillRect(0, y + h - 4, 512, 4); g.fillStyle = 'rgba(200,190,160,.5)'; g.fillRect(0, y + h - 6, 512, 2); }
  return c;
}
export function shingles(seed = 43) {
  const [c, g] = cv(256, 256), r = rng(seed);
  g.fillStyle = '#5b4a3e'; g.fillRect(0, 0, 256, 256);
  for (let row = 0; row < 8; row++) for (let i = 0; i < 6; i++) { const x = i * 44 + (row % 2) * 22 - 10 + r() * 4, y = row * 32; g.fillStyle = hsl(24, 18, 30 + r() * 12); g.fillRect(x, y, 40, 30); g.fillStyle = 'rgba(20,12,8,.8)'; g.fillRect(x, y + 28, 42, 3); g.fillRect(x + 40, y, 3, 30); }
  return c;
}
export function hull(seed = 44) { // warship side: black hull, ochre gun-deck band with black ports (u along length, v up)
  const [c, g] = cv(1024, 256), r = rng(seed);
  g.fillStyle = '#25232a'; g.fillRect(0, 0, 1024, 256);
  for (let i = 0; i < 9; i++) { g.fillStyle = `rgba(255,255,255,${0.03 + r() * 0.03})`; g.fillRect(0, 20 + i * 26, 1024, 2); }
  g.fillStyle = '#d9b45a'; g.fillRect(0, 118, 1024, 54);
  g.fillStyle = '#e8e2d2'; g.fillRect(0, 196, 1024, 10);
  for (let i = 0; i < 15; i++) { const x = 70 + i * 60; g.fillStyle = '#141216'; g.fillRect(x, 126, 30, 36); g.fillStyle = '#b8282b'; g.fillRect(x + 4, 130, 22, 4); }
  g.fillStyle = '#7a3a2a'; g.fillRect(0, 0, 1024, 14); // copper waterline below (v=0 bottom after flip)
  return c;
}
export function sail(seed = 45) {
  const [c, g] = cv(256, 256), r = rng(seed);
  g.fillStyle = '#f2ead6'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 6; i++) { g.fillStyle = 'rgba(150,130,100,.18)'; g.fillRect(i * 43, 0, 3, 256); }
  for (let i = 0; i < 3; i++) { g.fillStyle = 'rgba(150,130,100,.22)'; g.fillRect(0, 60 + i * 70, 256, 2); }
  for (let i = 0; i < 20; i++) { g.fillStyle = 'rgba(160,140,110,.12)'; g.beginPath(); g.ellipse(r() * 256, r() * 256, 10 + r() * 30, 6 + r() * 20, 0, 0, 7); g.fill(); }
  return c;
}
export function soil(seed = 46) {
  const [c, g] = cv(512, 512), r = rng(seed);
  g.fillStyle = '#6e4a30'; g.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 64) { g.fillStyle = 'rgba(40,24,14,.35)'; g.fillRect(0, y + 40, 512, 18); g.fillStyle = 'rgba(160,110,70,.3)'; g.fillRect(0, y + 10, 512, 14); }
  for (let i = 0; i < 600; i++) { g.fillStyle = hsl(26 + r() * 8, 35, 22 + r() * 30, .8); g.beginPath(); g.ellipse(r() * 512, r() * 512, 1 + r() * 4, 1 + r() * 3, r() * 3, 0, 7); g.fill(); }
  return c;
}
export function cloth(seed = 47) { // red/white gingham tablecloth
  const [c, g] = cv(256, 256);
  g.fillStyle = '#f7f2e8'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 8; i++) { g.fillStyle = 'rgba(200,40,46,.55)'; g.fillRect(i * 32, 0, 16, 256); g.fillRect(0, i * 32, 256, 16); }
  return c;
}
const star5 = (g, x, y, R) => { g.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? R * 0.4 : R; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.closePath(); g.fill(); };
export function usFlag() { // 1859: 13 stripes, 33 stars (hoist at u=0)
  const [c, g] = cv(760, 400);
  for (let i = 0; i < 13; i++) { g.fillStyle = i % 2 ? '#f8f6f0' : '#c4282f'; g.fillRect(0, i * 400 / 13, 760, 400 / 13 + 1); }
  g.fillStyle = '#23347a'; g.fillRect(0, 0, 304, 215);
  g.fillStyle = '#ffffff'; const rows = [6, 5, 6, 5, 6, 5]; let n = 0;
  rows.forEach((k, ri) => { for (let i = 0; i < k; i++) { if (n >= 33) break; star5(g, 26 + i * 50 + (k === 5 ? 25 : 0), 22 + ri * 34, 11); n++; } });
  return c;
}
export function unionJack() {
  const [c, g] = cv(760, 380), W = 760, H = 380;
  g.fillStyle = '#1f3f8f'; g.fillRect(0, 0, W, H);
  g.lineCap = 'butt';
  g.strokeStyle = '#ffffff'; g.lineWidth = 76; g.beginPath(); g.moveTo(0, 0); g.lineTo(W, H); g.moveTo(W, 0); g.lineTo(0, H); g.stroke();
  g.strokeStyle = '#c8282f'; g.lineWidth = 25; g.beginPath(); g.moveTo(0, 0); g.lineTo(W, H); g.moveTo(W, 0); g.lineTo(0, H); g.stroke();
  g.fillStyle = '#ffffff'; g.fillRect(W / 2 - 63, 0, 126, H); g.fillRect(0, H / 2 - 63, W, 126);
  g.fillStyle = '#c8282f'; g.fillRect(W / 2 - 38, 0, 76, H); g.fillRect(0, H / 2 - 38, W, 76);
  return c;
}
export function whiteEnsign() {
  const [c, g] = cv(760, 380), W = 760, H = 380;
  g.fillStyle = '#f8f6f0'; g.fillRect(0, 0, W, H);
  g.fillStyle = '#c8282f'; g.fillRect(0, H / 2 - 30, W, 60); g.fillRect(W * 0.62 - 30, 0, 60, H);
  const uj = unionJack(); g.drawImage(uj, 0, 0, W / 2, H / 2);
  return c;
}
export function bunting() { // three pennant colours in one texture (u thirds)
  const [c, g] = cv(384, 128);
  ['#c8282f', '#f8f6f0', '#23347a'].forEach((col, i) => { g.fillStyle = col; g.beginPath(); g.moveTo(i * 128 + 4, 0); g.lineTo(i * 128 + 124, 0); g.lineTo(i * 128 + 64, 124); g.closePath(); g.fill(); g.strokeStyle = '#241726'; g.lineWidth = 5; g.stroke(); });
  return c;
}
export function grassTuft(seed = 48) { // alpha card: grass blades + a few wildflowers
  const [c, g] = cv(512, 512), r = rng(seed);
  for (let i = 0; i < 46; i++) { const bx = 120 + r() * 272, tx = bx + (r() - 0.5) * 220, ty = 120 + r() * 230, col = hsl(88 + r() * 24, 45, 34 + r() * 22);
    g.strokeStyle = '#2a3a1e'; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(bx, 512); g.quadraticCurveTo((bx + tx) / 2 + (r() - 0.5) * 40, (512 + ty) / 2, tx, ty); g.stroke();
    g.strokeStyle = col; g.lineWidth = 5; g.beginPath(); g.moveTo(bx, 512); g.quadraticCurveTo((bx + tx) / 2, (512 + ty) / 2, tx, ty); g.stroke(); }
  for (let i = 0; i < 5; i++) { const x = 140 + r() * 230, y = 150 + r() * 150; g.fillStyle = '#241726'; g.beginPath(); g.arc(x, y, 15, 0, 7); g.fill(); g.fillStyle = ['#ffffff', '#ffe066', '#e88ac0', '#a58ae8'][i % 4]; g.beginPath(); g.arc(x, y, 11, 0, 7); g.fill(); g.fillStyle = '#ffcf3a'; g.beginPath(); g.arc(x, y, 4, 0, 7); g.fill(); }
  return c;
}
