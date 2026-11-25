import { HOUSE, KIT, GAR, MAIN, HOSP, WARE, H_, K_, G_, M_, at } from './sets.js';
export const TOTAL = 12;
const BASE = { az: 40, el: 34, sky: '#a8c8f0', ground: '#5a6a3a', hemi: 1.15, sun: '#fff0d8', sunI: 2.2, fog: '#c8d8e8', fogNear: 60, fogFar: 400, night: 0, skyTop: '#3f7fd6', skyHor: '#e8f0f8', skyTint: '#ffffff', sat: 1.08, gain: '#fffaf2', rimCol: '#ffd090', rimI: 1.0, coreI: 0.5, vig: 0.24, shadowExt: 14, envI: 0.35, expo: 1.0, cardTint: '#fff8ee', hazeH: 0.07, hemiK: 0.42 };
export const LIGHTS = { day: BASE, night: { ...BASE, az: 200, el: 40, sun: '#8aa8e8', sunI: 0.5, sky: '#30406a', ground: '#141820', hemi: 0.9, fog: '#18223a', night: 1, stars: 1, moon: 1, gain: '#d8e0ff', rimCol: '#8ab0ff', cardTint: '#b8c4e8' }, int: { ...BASE, az: 120, el: 60, sunI: 1.2, hemi: 1.8, shadowExt: 5 } };
const C = [
  { set: 'house', l: 'day', pos: [2, 1.7, 22], look: [-1, 1.5, 0], fov: 40 },
  { set: 'house', l: 'night', pos: [9, 1.6, 15], look: [5, 1.0, 3], fov: 40, night: 1, trailer: 1, mowers: { trailer: 11 } },
  { set: 'house', l: 'day', pos: [8, 2.2, 10], look: [6, 0.6, 2], fov: 40, sign: 1, garOpen: 1, mowers: { drive61: 61 } },
  { set: 'kit', l: 'int', pos: at(KIT, 1.8, 1.6, 2.2), look: at(KIT, -0.5, 1.0, -1.5), fov: 42, kit: { jar: { pos: [-2.84, 1.585, -0.75], fill: 0.1, lid: 'FOR SAM' }, letter: true, cash: 1, cal: { crossed: 10, due: 30 } } },
  { set: 'kit', l: 'int', pos: at(KIT, 0.4, 1.3, 0.8), look: at(KIT, -0.25, 0.85, 0.1), fov: 36, kit: { jar: { pos: [-0.25, 0.768, 0.1], fill: 0.6, lid: 'FOR SAM' }, cash: 1 } },
  { set: 'gar', l: 'int', pos: at(GAR, 1.5, 1.6, 2.6), look: at(GAR, -0.3, 1.0, -2.5), fov: 44, gar: { open: 1, board: { mode: 'tally', sold: 5, jar: 490, left: 21 } }, mowers: { garIn: 4 } },
  { set: 'main', l: 'day', pos: at(MAIN, 6, 1.8, 20), look: at(MAIN, 6, 2.0, 0), fov: 50, main: { newSign: 1, pole: 'new', bays: 1, benches: 4 } },
  { set: 'main', l: 'day', pos: at(MAIN, 21, 1.6, 1.5), look: at(MAIN, 20, 1.0, -7), fov: 50, main: { bays: 1, benches: 4 }, mowers: { shop61: 61 } },
  { set: 'main', l: 'day', pos: at(MAIN, -14, 1.6, 2), look: at(MAIN, -14, 1.2, -9), fov: 50, main: { apron: 1 } },
  { set: 'hosp', l: 'int', pos: at(HOSP, 2.0, 1.6, 2.2), look: at(HOSP, 0, 1.0, -1.5), fov: 46, clock: [10, 52] },
  { set: 'ware', l: 'int', pos: at(WARE, 0, 1.7, 8), look: at(WARE, 0, 1.5, -5), fov: 46 },
  { set: 'main', l: 'night', pos: at(MAIN, -40, 1.7, 14), look: at(MAIN, -44, 2, 0), fov: 46, night: 1 },
];
export const SHOTS = C.map((c, i) => ({ id: 't' + i, a: i, b: i, light: c.l }));
export const shotAt = (f) => SHOTS[Math.min(f, SHOTS.length - 1)];
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
export const camAt = (f) => ({ ...C[f], roll: 0, flash: 0 });
export const dofAt = () => ({ focus: 10, cinf: 0 });
export const worldAt = (f) => ({ ...C[f] });
export const actorsAt = (f, T) => { if (f !== 0 && f !== 3) return []; const P = (k, o, pos, s = 1) => ({ key: k + JSON.stringify(o), draw: (p) => T.samFront(p, k, o), x: pos[0], y: pos[1], z: pos[2], s, tint: '#fff8ee' });
  return f === 0 ? [P('sam', { expr: 'happy' }, [-2, 0, 9]), P('mia', { expr: 'smirk', R: 'tele', prop: 'phoneUp' }, [0, 0, 8.5]), P('ray', { expr: 'stern' }, [-5, 0.45, 1.2])] : [P('linda', { expr: 'tired', R: 'hold', prop: 'tips' }, at(KIT, 0.3, 0, 0.9))]; };
export const fxAt = () => [];
export const overlayAt = () => null;
