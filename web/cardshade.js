// v2 card shading (CPU, once per card redraw): warm rim just inside the ink line on the light side
// + soft core shadow on the far side. Ink pixels (#241726) are left untouched. Deterministic.
const _sc1 = document.createElement('canvas'), _sc2 = document.createElement('canvas'), _sc3 = document.createElement('canvas');
export const shadeCard = (c, o) => {
  const W = c.width, H = c.height, k = W / 1200;
  for (const t of [_sc1, _sc2, _sc3]) if (t.width !== W || t.height !== H) { t.width = W; t.height = H; }
  const shifted = (t, dx, dy, blur) => { const g = t.getContext('2d', { willReadFrequently: true }); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H); g.filter = `blur(${blur}px)`; g.drawImage(c, dx, dy); g.filter = 'none'; return g.getImageData(0, 0, W, H).data; };
  const R = shifted(_sc1, -o.vx * (o.rimPx ?? 30) * k, -o.vy * (o.rimPx ?? 22) * k, 3 * k), C = shifted(_sc2, o.vx * 70 * k, o.vy * 70 * k, 34 * k), Q = shifted(_sc3, o.vx * 34 * k, o.vy * 34 * k, 2 * k); // Q: body continues behind -> not a thin limb
  const g = c.getContext('2d'); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); const im = g.getImageData(0, 0, W, H), d = im.data; const [rr, rg, rb] = o.rim, ri = o.rimI, ci = o.coreI;
  for (let i = 0; i < d.length; i += 4) { const a = d[i + 3]; if (a < 10) continue; let r = d[i], gg = d[i + 1], b = d[i + 2];
    if (Math.abs(r - 36) + Math.abs(gg - 23) + Math.abs(b - 38) < 46) continue; // ink stays ink
    const core = (1 - C[i + 3] / 255) * ci; r *= 1 - core * 0.30; gg *= 1 - core * 0.34; b *= 1 - core * 0.16;
    const rim = Math.min(1, Math.max(0, 1 - R[i + 3] / 255) * 2.3) * ri * (Q[i + 3] / 255); r = 255 - (255 - r) * (1 - rim * rr / 255); gg = 255 - (255 - gg) * (1 - rim * rg / 255); b = 255 - (255 - b) * (1 - rim * rb / 255);
    d[i] = r; d[i + 1] = gg; d[i + 2] = b; }
  g.putImageData(im, 0, 0); g.restore();
};
