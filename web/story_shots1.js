// Shots 1/3: cold open (Day 37 night), DAY 0, the montage, DAY 1, Day 2-3. Sentence indices refer to work/sentences.txt.
import { shot, smooth, eo, bk, clamp, lerp, lerp3, ramp, q, pulse, walkP, add3 } from './story_core.js';
export const H = (x, y, z) => [x, y, z], K = (x, y, z) => [100 + x, y, z], G = (x, y, z) => [200 + x, y, z], Mn = (x, y, z) => [300 + x, y, z], Hp = (x, y, z) => [500 + x, y, z], Wa = (x, y, z) => [600 + x, y, z];
const DRV = H(6, 0, 6.2);           // Sam's spot in the driveway (cold open)
const SHELF = [-2.84, 1.585, -0.75]; // jar on the kitchen shelf (kitchen-local)
const TBL = [-0.25, 0.768, 0.1];     // jar on the table (kitchen-local)
export const jarAt = (p, fill, lid, ex = {}) => ({ jar: { pos: p, fill, lid, ...ex } });

// =============================== COLD OPEN: DAY 37, 2 A.M. ===============================
shot(0, { set: 'house', light: 'night', note: 'Crane down from above the street trees to the empty driveway; Sam tiny in the gravel; porch light', tag: 'DAY 37  \u2022  2:00 A.M.', tagLen: 70,
  cam: [[H(20, 9, 26), H(5, 0.5, 3), 46], [H(12, 3.2, 18), H(5.6, 0.9, 4), 40], [H(9.5, 1.5, 13.5), H(6, 1.0, 5.5), 38]],
  act: (k, A) => { A('samSocks', DRV, { expr: 'shock', L: 'hang', R: 'hang' }); } });
shot(2, { set: 'house', light: 'night', note: 'Low dolly at sock height across the gravel, tilt up to his face', cam: [[H(7.4, 0.25, 7.9), H(6.05, 0.15, 6.2), 34], [H(7.0, 0.95, 8.1), H(6.0, 1.45, 6.2), 36], [H(6.7, 1.5, 7.9), H(6.0, 1.62, 6.2), 34]],
  focus: H(6, 1.0, 6.2), act: (k, A) => A('samSocks', DRV, { expr: k.t < 0.5 ? 'shock' : 'sad', look: -0.2 }), fx: (k, FX, pop, T) => { for (let i = 0; i < 2; i++) pop('br' + i, T.fxSmoke, H(6.12 + i * 0.03, 1.55, 6.25), 0.12, 20 + i * 40, 30); } });
shot(3, { set: 'house', light: 'memory', flash: true, note: 'MEMORY (warm, grain): same framing, last evening, trailer in the driveway loaded with mowers; Sam proud beside it', light2: null,
  cam: [[H(10.5, 1.5, 13), H(6, 0.9, 5), 38], [H(9.6, 1.4, 12), H(5.8, 0.9, 5.2), 36]], w: () => ({ trailer: 1, mowers: { trailer: 11 } }),
  act: (k, A) => A('sam', H(7.3, 0, 7.6), { expr: 'proud', L: 'hip', R: 'thumb' }) });
shot(4, { set: 'house', light: 'memory', note: 'Dolly along the trailer: eleven mowers strapped down, rack focus to Sam with a wrench', cam: [[H(8.4, 1.25, 2.6), H(6.1, 0.65, 4.4), 36], [H(8.3, 1.3, 6.6), H(5.9, 0.7, 5.6), 34], [H(8.6, 1.4, 8.8), H(6.8, 1.0, 7.0), 34]],
  w: () => ({ trailer: 1, mowers: { trailer: 11 } }), focus: (k) => k.t < 0.6 ? H(6, 0.8, 5.2) : H(7.3, 1.3, 7.6),
  act: (k, A) => A('sam', H(7.3, 0, 7.6), { expr: 'happy', R: 'hold', prop: 'wrench', L: 'hip' }), fx: (k, FX, pop, T) => { pop('sp', T.fxSparkle, H(6.2, 1.3, 4.6), 0.3, 50, 18); pop('sp2', T.fxSparkle, H(5.6, 1.1, 6.0), 0.25, 70, 18); } });
shot(5, { set: 'house', light: 'memory', note: 'Wide from the street: the family on the porch watching the loaded trailer — every dollar they have left',
  cam: [[H(1.0, 1.8, 19), H(1.0, 1.2, 3), 44], [H(2.6, 2.4, 17), H(1.5, 1.1, 3), 42]], w: () => ({ trailer: 1, mowers: { trailer: 11 } }),
  act: (k, A) => { A('lindaHome', H(-5.2, 0.45, 1.4), { expr: 'hopeful', L: 'cross', R: 'cross' }); A('ray', H(-3.2, 0.45, 1.5), { expr: 'calm', L: 'hip' }); A('mia', H(-1.6, 0.0, 3.4), { expr: 'smile', R: 'tele', prop: 'phoneUp' }); A('sam', H(7.3, 0, 7.6), { expr: 'proud', R: 'thumb' }); } });
shot(6, { set: 'house', light: 'night', flash: 0.8, flashCol: '#000000', note: 'Back to night, same framing: trailer gone. Nothing.', cam: [[H(9.6, 1.4, 12), H(5.8, 0.9, 5.2), 36], [H(9.4, 1.5, 11.4), H(5.9, 0.8, 5.0), 34]],
  w: () => ({ tire: 1 }), kicks: [[3, 0.35]], act: (k, A) => A('samSocks', H(7.3, 0, 7.6), { expr: 'sad' }) });
shot(7, { set: 'house', light: 'night', note: 'Ground-level slide along the tire marks in the gravel; rack to Sam', cam: [[H(5.2, 0.18, 2.4), H(5.6, 0.05, 8), 40], [H(5.6, 0.32, 3.4), H(6.3, 0.6, 9), 38]],
  w: () => ({ tire: 1 }), focus: (k) => k.t < 0.55 ? H(5.3, 0, 5) : H(7.3, 1, 9), act: (k, A) => A('samSocks', H(7.0, 0, 9.4), { expr: 'sad', look: 0.3 }) });
shot(8, { set: 'house', light: 'night', note: 'Over the empty drive toward the porch: Mom in the doorway light; 63 DAYS chalked by the overlay', cam: [[H(9.5, 1.55, 11.5), H(1, 1.4, 2), 40], [H(8.6, 1.6, 10.2), H(-1.5, 1.5, 1.5), 36]],
  w: () => ({ tire: 1, houseDoor: 1 }), focus: H(6.6, 1.5, 8), ov: (k) => k.lf > 40 ? { count: '63 DAYS LEFT', col: '#ffffff' } : null,
  act: (k, A) => { A('samSocks', H(6.6, 0, 8.0), { expr: 'serious', look: -0.4 }); A('lindaHome', H(-4.3, 0.45, 0.7), { expr: 'sad', L: 'cross', R: 'cross' }); } });
shot(9, { set: 'house', light: 'night', note: 'Rewind: camera rises and spins up over the roofs; ◀◀ overlay; white flash into Day 0', ov: () => ({ rewind: 1 }), ease: 'lin',
  cam: [[H(8.6, 1.6, 10.2), H(4, 1.2, 3), 36], [H(10, 8, 16), H(2, 0, 0), 50, 8], [H(0, 30, 24), H(0, 0, 0), 62, -20]], kicks: [[4, 0.3]],
  act: (k, A) => A('samSocks', H(6.6, 0, 8.0), { expr: 'serious' }) });

// =============================== DAY 0 ===============================
shot(11, { set: 'house', light: 'night', flash: true, title: 'DAY 0', sub: 'A SMALL TOWN IN OHIO', titleLen: 120, note: 'CHAPTER: cold March night over the street; windows glowing; breath-cold blue; slow crane down the block',
  lmod: { fog: '#1a2440', sat: 0.85, gain: '#cfdcff' }, cam: [[H(-40, 14, 32), H(-10, 2, 0), 46], [H(-18, 6, 26), H(-6, 1.5, 0), 42], [H(-8, 2.4, 20), H(-4, 1.6, 0), 40]],
  fx: (k, FX, pop, T) => { for (let i = 0; i < 18; i++) { const tt = ((k.lf * 0.004 + i * 0.137) % 1); FX('sn' + i + q(tt, 2), (p) => p.ell(300, 500, 40, 40, '#ffffff', 0), H(-12 + (i * 3.1) % 14, 7 - tt * 7, 8 + (i * 1.7) % 9), 0.05, { flat: 1 }); } } });
shot(14, { set: 'hosp', light: 'hosp', flash: 0.6, note: 'Hospital: push in on the wall clock at 10:52, pan down to Linda with the newborn; Ray still in work boots (tilt to boots)',
  cam: (k) => { const t1 = smooth(k.r(0, k.w(14, 8) - 5)), t2 = smooth(k.r(k.w(14, 8), k.w(14, 13))), t3 = smooth(k.r(k.w(14, 13), k.n));
    const p = lerp3(lerp3(Hp(1.1, 1.9, -0.6), Hp(0.9, 1.5, 1.6), t1), Hp(1.7, 0.9, 0.3), t2); const l = lerp3(lerp3(Hp(1.2, 2.0, -2.47), Hp(0.1, 1.0, -1.3), t1), Hp(1.3, 0.2, -0.6), t2);
    return { pos: lerp3(p, Hp(1.6, 1.4, 1.1), t3), look: lerp3(l, Hp(1.0, 1.2, -0.7), t3), fov: lerp(lerp(30, 44, t1), 40, t2) }; }, w: () => ({ clock: [10, 52] }),
  act: (k, A, C, T) => { A('lindaOff', Hp(-0.6, 0, -0.7), { sit: 1, expr: 'teary', L: 'hold', R: 'hold' }); C('baby' + (k.lf % 40 < 20 ? 1 : 0), (p) => T.babyCard(p, { sleep: 1 }), Hp(-0.55, 0.62, -0.6), 0.36); A('rayYoung', Hp(1.0, 0, -0.7), { expr: 'beam', L: 'hip', R: 'hang' }); } });
shot(15, { noFix: true, set: 'hosp', light: 'hosp', note: 'Medium on Linda, still in her teal diner uniform, baby in arms; slow arc', cam: [[Hp(0.7, 1.35, 1.3), Hp(-0.6, 1.0, -0.7), 38], [Hp(-0.15, 1.3, 1.6), Hp(-0.6, 1.0, -0.7), 36]],
  act: (k, A, C, T) => { A('lindaOff', Hp(-0.6, 0, -0.7), { sit: 1, expr: 'soft', L: 'hold', R: 'hold' }); C('baby', (p) => T.babyCard(p, { sleep: 1 }), Hp(-0.55, 0.62, -0.6), 0.36); } });
shot(16, { noFix: true, set: 'hosp', light: 'hosp', note: 'Kid-height low angle: Mia (3) with Dad\u2019s big old camcorder', cam: [[Hp(1.4, 1.0, 1.95), Hp(0.85, 0.95, 0.0), 42], [Hp(1.3, 0.95, 1.75), Hp(0.85, 1.0, 0.0), 40]],
  act: (k, A) => { A('mia3', Hp(1.2, 0, 0.3), { expr: k.lf > 50 ? 'proud' : 'happy', R: k.lf > 40 ? 'tele' : 'hold', prop: 'camcorder', propDX: k.lf > 40 ? 0 : 8 }); A('rayYoung', Hp(0.4, 0, -0.3), { expr: 'smile', L: 'hip' }, { blob: true }); } });
shot(18, { noFix: true, set: 'hosp', light: 'hosp', vf: 'cam', vfText: 'MAR 14  10:58 PM', note: 'Through Mia\u2019s camcorder viewfinder: REC, the baby; handheld wobble at kid height', hand: 4,
  cam: [[Hp(0.6, 0.85, 0.5), Hp(-0.55, 0.75, -0.6), 30], [Hp(0.4, 0.9, 0.3), Hp(-0.55, 0.78, -0.6), 24]],
  act: (k, A, C, T) => { A('lindaOff', Hp(-0.6, 0, -0.7), { sit: 1, expr: 'smile', L: 'hold', R: 'hold' }); C('baby' + (k.lf > 60 ? 'c' : ''), (p) => T.babyCard(p, { sleep: k.lf > 60 ? 0 : 1, cry: k.lf > 90 }), Hp(-0.55, 0.62, -0.6), 0.36); } });
shot(19, { noFix: true, set: 'hosp', light: 'hosp', note: 'Mia lowers the camera and delivers the review — a potato pops up; Ray laughs', cam: [[Hp(1.4, 1.0, 1.9), Hp(0.85, 1.0, 0.0), 42], [Hp(1.3, 1.05, 1.7), Hp(0.8, 1.05, -0.05), 42]],
  act: (k, A) => { A('mia3', Hp(1.2, 0, 0.3), { expr: k.lf > k.w(20) - 3 ? 'smug' : 'serious', R: 'hold', prop: 'camcorder', propDX: 8, L: k.lf > k.w(20) ? 'shrug' : 'hang' }); A('rayYoung', Hp(0.4, 0, -0.3), { expr: k.lf > k.w(20) + 20 ? 'lol' : 'smile', L: 'belly', headTilt: k.lf > k.w(20) + 20 ? 5 * Math.sin(k.lf * 0.6) : 0 }); },
  fx: (k, FX, pop, T) => { if (k.lf > k.w(20)) FX('pot' + q(Math.min(1, (k.lf - k.w(20)) / 10), 2), (p) => T.potatoCard(p, Math.min(1, (k.lf - k.w(20)) / 10)), Hp(1.45, 1.35, 0.35), 0.22); } });
shot(21, { set: 'kit', light: 'kitN', flash: 0.5, note: 'Kitchen, that night: Ray (younger, dark beard) takes an empty pickle jar off the shelf, pendant lamp swaying', lmod: { cardTint: '#ffe6cc' },
  cam: [[K(1.6, 1.6, 2.1), K(-2.3, 1.45, -0.6), 40], [K(0.2, 1.55, 1.4), K(-2.6, 1.5, -0.7), 36]], w: (k) => ({ kit: { ...jarAt(lerp3(SHELF, [-2.35, 1.2, -0.5], smooth(k.r(40, 70))), 0, ''), cal: { month: 'MARCH', off: 3 } } }),
  act: (k, A) => A('rayYoung', K(-2.1, 0, -0.3), { expr: 'puzzled', L: 'hang', R: k.lf > 30 ? 'hold' : 'reach', lift: 0.6 }) });
shot(22, { set: 'kit', light: 'kitN', note: 'Insert on the table: one dollar drops into the jar; the marker writes FOR SAM on the lid, letter by letter', cam: [[K(0.35, 1.25, 0.75), K(-0.25, 0.86, 0.1), 32], [K(0.05, 1.32, 0.42), K(-0.25, 0.93, 0.1), 28]],
  w: (k) => { const n = Math.floor(clamp((k.lf - k.w(23) + 6) / 18) * 7); return { kit: { ...jarAt(TBL, k.lf > 34 ? 0.04 : 0, 'FOR SAM'.slice(0, n)), cal: { month: 'MARCH', off: 3 } } }; },
  act: (k, A) => A('rayYoung', K(0.35, 0, -0.75), { expr: 'smile', R: k.lf > k.w(23) - 10 ? 'hold' : 'reach', prop: k.lf > k.w(23) - 10 ? 'marker' : 'dollar', lift: 0.2 }, { s: 0.98 }),
  fx: (k, FX, pop, T) => { if (k.lf < 36) FX('dl' + q(k.lf / 36, 2), (p) => T.fxCash(p, k.lf * 0.15), K(-0.25, 1.45 - 0.5 * eo(k.lf / 36), 0.1), 0.07); pop('spk', T.fxSparkle, K(-0.2, 1.05, 0.15), 0.12, 36, 16); } });

// =============================== MONTAGE ===============================
shot(24, { set: 'kit', light: 'kitD', flash: true, note: 'Time starts moving: jar on the shelf in the foreground, the calendar flips months; whip-pan', ease: 'lin',
  cam: [[K(-1.6, 1.62, -0.3), K(-2.9, 1.5, 0.9), 40, -6], [K(-1.9, 1.6, 0.1), K(-2.95, 1.5, 0.9), 36, 6]], focus: K(-2.95, 1.5, 0.9),
  w: (k) => { const M = ['MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPT', 'OCTOBER', 'NOV', 'DEC', 'JANUARY', 'FEBRUARY']; const i = Math.floor(k.lf / 4) % 12; return { kit: { ...jarAt(SHELF, 0.06, 'FOR SAM'), cal: { month: M[i], off: i % 7, pic: ['#6a9a5a', '#e8b830', '#3a7ad8', '#c8642a'][i % 4] } } }; } });
shot(26, { set: 'kit', light: 'kitD', tag: 'AGE 1', note: 'Age 1: toddler Sam on the kitchen floor holds up a toy truck; Mom and Dad gasp at "truck"', cam: [[K(1.3, 0.9, 1.9), K(-0.2, 0.5, -0.2), 40], [K(0.9, 0.8, 1.5), K(-0.2, 0.45, -0.2), 36]],
  w: () => ({ kit: { ...jarAt(SHELF, 0.1, 'FOR SAM'), cal: { month: 'MAY', off: 1 } } }),
  act: (k, A) => { const said = k.lf > k.w(27, 4); A('sam1', K(0.35, 0, 1.0), { expr: said ? 'yay' : 'happy', R: said ? 'lift' : 'hold', prop: 'truck', L: said ? 'up' : 'hang' }); A('lindaHome', K(-1.1, 0, -0.6), { expr: said ? 'wow' : 'smile', L: said ? 'cheek' : 'hang', R: said ? 'cheek' : 'hang' }); A('rayYoung', K(0.9, 0, -0.9), { expr: said ? 'laugh' : 'smile', L: 'hip' }); },
  fx: (k, FX, pop, T) => { pop('tr', (p, t) => T.fxSpeech(p, 'TRUCK!', Math.min(1, t * 4)), K(0.2, 1.05, 0.45), 0.22, k.w(27, 4), 40); } });
shot(28, { set: 'kit', light: 'kitD', tag: 'AGE 5', note: 'Age 5: Sam at the table with the toaster in pieces, butter knife as a screwdriver; Mom hands on hips', cam: [[K(1.4, 1.35, 1.6), K(0.1, 0.85, 0.1), 40], [K(0.9, 1.15, 1.25), K(0.15, 0.85, 0.05), 34]],
  w: () => ({ kit: { toaster: 1, ...jarAt(SHELF, 0.14, 'FOR SAM') } }),
  act: (k, A) => { A('sam5', K(0.15, 0, -0.62), { expr: 'grin', R: 'hold', prop: 'knife', L: 'hold' }, { dy: 0.46 }); A('lindaHome', K(-1.3, 0, -0.9), { expr: 'stern', L: 'hip', R: 'hip' }); },
  fx: (k, FX, pop, T) => { pop('bg', T.fxBang, K(0.25, 0.95, 0.12), 0.18, 26, 14); pop('st', T.fxStars, K(0.3, 1.0, 0.1), 0.16, 30, 26); } });
shot(30, { set: 'kit', light: 'kitD', note: 'Nobody gets toast: Ray with an empty plate, Mia (12) with a sad crust; Sam proudly holding a spring', cam: [[K(-0.6, 1.35, 1.7), K(0.4, 1.0, -0.7), 38], [K(-0.2, 1.3, 1.5), K(0.6, 1.0, -0.7), 36]],
  w: () => ({ kit: { toaster: 1, ...jarAt(SHELF, 0.14, 'FOR SAM') } }),
  act: (k, A) => { A('rayYoung', K(1.1, 0, -0.9), { expr: 'sad', R: 'hold', prop: 'toast', propDX: 6 }); A('mia12', K(-0.1, 0, -1.1), { expr: 'meh', L: 'shrug', R: 'shrug' }); A('sam5', K(1.0, 0, 0.3), { expr: 'proud', R: 'lift', prop: 'wrench' }); } });
shot(31, { set: 'house', light: 'golden', tag: 'AGE 9', flash: 0.5, note: 'Age 9: front lawn, Sam fixes the neighbor\u2019s leaf blower with a butter knife — it coughs to life; neighbor amazed', cam: [[H(-1, 1.2, 9.6), H(-3.6, 0.8, 6.0), 38], [H(-2.2, 1.0, 8.8), H(-3.8, 0.8, 6.2), 34]],
  act: (k, A) => { const on = k.lf > k.n * 0.55; A('sam9', H(-3.4, 0, 6.3), { expr: on ? 'cheer' : 'focus', R: 'hold', prop: 'knife', L: on ? 'up' : 'hang' }); A('neighbor', H(-5.2, 0, 5.4), { expr: on ? 'wow' : 'puzzled', R: 'hold', prop: 'blower', propDX: 10 }); },
  fx: (k, FX, pop, T) => { if (k.lf > k.n * 0.55) { const t = ((k.lf * 0.05) % 1); FX('lv' + q(t, 2), (p) => T.fxSmoke(p, t, '#e8e0d0'), H(-6.0 + t, 0.5, 5.8), 0.25); pop('nt', T.fxNotes, H(-4.8, 1.6, 5.6), 0.3, Math.round(k.n * 0.55), 40); } } });
shot(33, { set: 'house', light: 'golden', note: 'Mia (12) films it on her phone, of course — reverse angle over her shoulder', vf: 'phone', vfText: 'MIA FILMS',
  cam: [[H(-6.4, 1.4, 8.2), H(-3.6, 0.9, 6.2), 36], [H(-6.1, 1.35, 7.8), H(-3.5, 0.95, 6.2), 30]],
  act: (k, A) => { A('mia12', H(-6.4, 0, 7.2), { expr: 'smirk', R: 'tele', prop: 'phoneUp' }, { s: 0.88 }); A('sam9', H(-3.4, 0, 6.3), { expr: 'cheer', L: 'up', R: 'hold', prop: 'knife' }); A('neighbor', H(-5.0, 0, 5.2), { expr: 'happy', R: 'hold', prop: 'blower' }); } });
shot(34, { set: 'kit', light: 'kitD', tag: 'AGE 12', note: 'Age 12: the rent-increase notice lands on the table; insert, $1,050 crossed out → $1,200', cam: [[K(0.1, 1.4, 0.75), K(0.15, 0.77, 0.05), 34], [K(0.15, 1.15, 0.45), K(0.15, 0.77, 0.05), 30]],
  w: (k) => ({ kit: { ...jarAt(SHELF, 0.2, 'FOR SAM') }, paper: { pos: K(0.15, 0.775, 0.05), rot: [-Math.PI / 2, 0, 0.15 - 0.15 * eo(k.r(0, 16))], kind: 'rent' } }),
  act: (k, A) => A('sam12', K(-0.5, 0, -0.6), { expr: 'nervous', L: 'hang' }) });
shot(36, { set: 'ware', light: 'ware', note: 'Ray takes a second job: warehouse aisle, hi-vis vest, carrying boxes on a night shift; tracking dolly', cam: [[Wa(-1.4, 1.5, 6), Wa(0.4, 1.2, -1), 42], [Wa(-0.6, 1.4, 3.6), Wa(0.8, 1.2, -1.2), 38]],
  act: (k, A) => { const W_ = walkP(k, Wa(1.2, 0, 2.5), Wa(0.6, 0, -0.2), 0, k.n); A('rayVest', W_.pos, { expr: 'tired', L: 'belly', R: 'belly', prop: 'box', propAt: [0, 300], step: W_.step }); } });
shot(37, { set: 'house', light: 'day', tag: 'AGE 15', flash: 0.5, note: 'Age 15: Mia turns 18; birthday balloons on the mailbox; she pulls out a BIG envelope; Sam (15) on the steps',
  cam: [[H(5.5, 1.5, 15.5), H(3.4, 1.2, 11.7), 40], [H(4.6, 1.45, 14.4), H(3.2, 1.25, 11.6), 34]],
  act: (k, A) => { const got = k.lf > k.w(39) - 4; A('mia', H(2.8, 0, 12.1), { expr: got ? 'wow' : 'happy', R: got ? 'hold' : 'reach', prop: got ? 'envelope' : null, propDX: -8 }); A('sam15', H(0.6, 0, 11.6), { expr: 'smile', L: 'wave', wv: k.lf * 0.4 }); },
  fx: (k, FX, pop, T) => { for (let i = 0; i < 3; i++) FX('bl' + i, (p) => { p.ell(300, 400, 120, 150, ['#c8322e', '#e8b830', '#3a7ad8'][i], 12); p.stroke([[300, 550], [300 + 20 * Math.sin(k.lf * 0.1 + i), 900]], 6); }, H(3.25 + i * 0.12, 1.75 + 0.05 * Math.sin(k.lf * 0.08 + i), 11.65), 0.25, { flat: 1 }); } });
shot(40, { set: 'kit', light: 'kitN', note: 'She reads it alone at night, hides it in a drawer...', cam: [[K(1.3, 1.45, 1.9), K(0.3, 1.1, -1.4), 38], [K(0.9, 1.35, 1.5), K(0.6, 1.1, -1.6), 34]],
  w: () => ({ kit: { ...jarAt(SHELF, 0.25, 'FOR SAM') } }),
  act: (k, A) => { const hide = k.lf > k.w(40, 5) - 4; A('mia', K(0.7, 0, -1.6), { expr: hide ? 'sad' : 'wow', R: hide ? 'pointDown' : 'hold', prop: hide ? null : 'envelope', propDX: -6 }); } });
shot([40, 11], { set: 'main', light: 'night', lead: 4, note: '...and takes the night shift at the gas station: Mia in a red polo behind the kiosk glass, canopy lights buzzing', cam: [[Mn(-40.2, 1.9, 2.6), Mn(-43.4, 1.85, -2.9), 44], [Mn(-41.7, 1.8, 0.9), Mn(-43.3, 1.75, -2.9), 40]], focus: Mn(-43.3, 1.5, -2.85),
  act: (k, A) => A('mia18', Mn(-43.3, 0, -2.75), { expr: 'tired', L: 'hang', R: 'hold', prop: 'mug' }) });
shot(41, { set: 'kit', light: 'kitN', note: 'Every night: Mom counts tips at the kitchen table under the pendant lamp; Sam (15) watches from the hall doorway', cam: [[K(-1.4, 1.5, 2.0), K(0.3, 0.95, 0.1), 40], [K(-0.8, 1.4, 1.9), K(1.4, 1.1, 0.5), 40]],
  w: () => ({ kit: { tips: 1, coins: 1, ...jarAt(SHELF, 0.25, 'FOR SAM'), hall: 0.8 } }),
  act: (k, A) => { A('lindaOff', K(0.1, 0, -0.62), { sit: 1, expr: 'tired', R: 'hold', prop: 'tips', L: 'hold' }); A('sam15', K(2.55, 0, 0.9), { expr: 'sad', L: 'hang' }); } });
shot(42, { set: 'ware', light: 'ware', tag: 'AGE 17', flash: 0.5, note: 'Age 17: Ray lifts a box and his back gives out — freeze-shake, stars', cam: [[Wa(2.6, 1.3, 1.6), Wa(1.2, 1.0, -0.8), 38], [Wa(2.3, 1.2, 1.1), Wa(1.2, 1.0, -0.8), 32]],
  kicks: [[60, 0.6]], act: (k, A) => { const hurt = k.lf > 58; A('ray', Wa(1.3, 0, -0.4), { expr: hurt ? 'grimace' : 'focus', L: 'belly', R: 'belly', prop: 'box', propAt: [0, hurt ? 330 : 300], tilt: hurt ? 6 : 0, sweat: hurt }, {}); },
  fx: (k, FX, pop, T) => { pop('bg', T.fxBang, Wa(1.6, 1.0, -0.3), 0.25, 58, 14); pop('st', T.fxStars, Wa(1.3, 2.0, -0.3), 0.25, 60, 40); } });
shot(44, { set: 'kit', light: 'kitD', note: 'He can\u2019t work for months: Ray in a kitchen chair, hand on his back; the calendar pages flip behind him', cam: [[K(1.6, 1.3, 1.8), K(-0.6, 1.0, -0.2), 40], [K(1.2, 1.2, 1.4), K(-1.0, 1.1, 0.2), 36]],
  w: (k) => { const M = ['JUNE', 'JULY', 'AUGUST', 'SEPT', 'OCTOBER']; return { kit: { ...jarAt(SHELF, 0.25, 'FOR SAM'), cal: { month: M[Math.min(4, Math.floor(k.lf / 10))], off: Math.floor(k.lf / 10) % 6 } } }; },
  act: (k, A) => A('ray', K(-0.5, 0, 1.25), { sit: 1, expr: 'pained', L: 'calf', R: 'hang', tilt: 4 }) });
shot(45, { set: 'kit', light: 'kitN', note: 'The bills keep coming: envelopes fall onto the table in a pile (PAST DUE, FINAL NOTICE)', cam: [[K(0.4, 1.45, 0.9), K(-0.05, 0.77, -0.05), 34], [K(0.25, 1.25, 0.6), K(-0.05, 0.78, -0.05), 30]],
  w: () => ({ kit: { bills: 1, ...jarAt(SHELF, 0.25, 'FOR SAM') } }),
  fx: (k, FX, pop, T) => { for (let i = 0; i < 4; i++) { const f0 = i * 9; if (k.lf >= f0 && k.lf < f0 + 14) { const t = (k.lf - f0) / 14; FX('ev' + i + q(t, 2), (p) => T.fxEnv(p, t * 2 + i), K(-0.2 + i * 0.1, 1.3 - 0.5 * eo(t), -0.05), 0.09); } } } });
shot(46, { set: 'kit', light: 'kitN', note: 'The pickle jar on the shelf stops getting dollars: slow push in, dust floats in the lamp light', cam: [[K(-1.6, 1.6, 0.4), K(-2.84, 1.68, -0.75), 32], [K(-2.1, 1.65, -0.2), K(-2.84, 1.68, -0.75), 28]],
  w: () => ({ kit: { ...jarAt(SHELF, 0.25, 'FOR SAM') } }), focus: K(-2.84, 1.7, -0.75),
  fx: (k, FX) => { for (let i = 0; i < 6; i++) { const t = ((k.lf * 0.01 + i * 0.17) % 1); FX('du' + i + q(t, 2), (p) => p.ell(300, 500, 30, 30, '#fff4d8', 0), K(-2.6 + (i % 3) * 0.08, 1.4 + t * 0.6, -0.6 + i * 0.05), 0.03, { flat: 1, alpha: Math.sin(t * Math.PI) }); } } });
shot(47, { set: 'kit', light: 'kitN', note: 'Sam turns 18: a single cupcake with one candle in the dark kitchen; small smile, then he looks at the camera', cam: [[K(0.7, 1.35, 2.3), K(-0.05, 0.95, -0.3), 38], [K(0.5, 1.32, 1.95), K(-0.05, 1.05, -0.5), 35]],
  w: () => ({ kit: { cake: 1, flame: 1, ...jarAt(SHELF, 0.25, 'FOR SAM') } }), lmod: { sunI: 0.25, hemi: 0.7 },
  act: (k, A) => A('sam', K(-0.05, 0, -0.62), { sit: 1, expr: k.t > 0.5 ? 'hopeful' : 'calm', L: 'hold', R: 'hold' }), focus: K(-0.05, 1.2, -0.6) });

// =============================== DAY 1 ===============================
shot(48, { set: 'house', light: 'day', flash: true, title: 'DAY 1', sub: 'HAPPY 18TH, SAM', titleLen: 75, note: 'CHAPTER: bright morning on the street, crane down toward the house', cam: [[H(4, 7, 26), H(-4, 1.5, 0), 44], [H(0, 2.2, 18), H(-4, 1.6, 0), 40]],
  w: () => ({ doorLetter: 1 }) });
shot(49, { set: 'house', light: 'day', note: 'No party: Sam steps onto the porch and finds a letter taped to the front door; push in', cam: [[H(-4.0, 1.6, 6.5), H(-4.2, 1.5, 0.5), 38], [H(-4.05, 1.75, 3.2), H(-4.2, 1.85, 0.1), 34]],
  w: (k) => ({ doorLetter: 1 }), act: (k, A) => A('sam', H(-3.25, 0.45, 1.0), { expr: k.lf > k.w(50) ? 'gulp' : 'meh', R: k.lf > k.w(50) ? 'reach' : 'hang', lift: 0.5 }) });
shot(51, { set: 'house', light: 'day', note: 'Insert: the notice — BACK RENT OWED $2,400', cam: [[H(-4.15, 1.88, 0.7), H(-4.2, 1.9, 0.13), 30], [H(-4.2, 1.95, 0.48), H(-4.2, 1.92, 0.13), 26]],
  w: () => ({ doorLetter: 1 }), cinf: 3, focus: H(-4.2, 1.9, 0.14) });
shot(52, { set: 'house', light: 'day', note: '30 DAYS — tilt down the notice, then pull back to the whole family on the porch', cam: [[H(-4.2, 1.85, 0.45), H(-4.2, 1.82, 0.13), 26], [H(-4.1, 1.75, 4.4), H(-4.2, 1.6, 0.3), 30], [H(-2.6, 1.7, 7.4), H(-4.0, 1.3, 0.8), 40]], ck: [0, 0.45, 1],
  w: () => ({ doorLetter: 1 }), focus: (k) => k.t < 0.4 ? H(-4.2, 1.82, 0.14) : H(-4, 1.3, 1.3),
  act: (k, A) => { if (k.t < 0.35) return; A('sam', H(-3.6, 0.45, 1.5), { expr: 'sad', R: 'hold', prop: 'letter' }); A('lindaHome', H(-4.8, 0.45, 1.1), { expr: 'sad', L: 'cheek' }); A('ray', H(-5.6, 0.45, 1.6), { expr: 'stern', L: 'cross', R: 'cross' }); A('mia', H(-2.7, 0.45, 1.4), { expr: 'sad' }); } });
shot(54, { set: 'main', light: 'diner', flash: 0.4, note: 'Every tip for two months: Linda in her apron behind the diner counter, slipping tips into her pocket; tips counter on screen', cam: [[Mn(-14.4, 1.55, -0.2), Mn(-15.6, 1.3, -2.9), 40], [Mn(-14.9, 1.5, -0.9), Mn(-15.6, 1.35, -2.9), 34]],
  ov: (k) => ({ count: '$' + Math.round(lerp(0, 2400, smooth(k.r(10, k.n - 10)))).toLocaleString('en-US') + '  =  2 MONTHS OF TIPS', col: '#f2c23a' }),
  act: (k, A) => A('linda', Mn(-15.6, 0, -2.9), { expr: 'tired', R: 'hold', prop: k.lf % 50 < 25 ? 'tips' : 'mug', L: 'hang' }) });
shot(55, { set: 'kit', light: 'kitN', note: 'That night Ray hands Sam the pickle jar across the table (the jar travels from his hands to Sam\u2019s)', cam: [[K(1.7, 1.45, 1.4), K(-0.2, 1.1, -0.1), 40], [K(1.35, 1.4, 1.1), K(-0.3, 1.15, -0.2), 36]],
  w: (k) => ({ kit: { ...jarAt(lerp3([0.25, 1.05, -0.2], [-0.55, 1.0, -0.15], smooth(k.r(18, 52))), 0.06, 'FOR SAM') } }),
  act: (k, A) => { A('ray', K(0.55, 0, -0.6), { expr: 'sad', L: 'offer', R: 'offer' }); A('sam', K(-0.85, 0, -0.45), { expr: 'puzzled', L: k.lf > 40 ? 'hold' : 'hang', R: k.lf > 40 ? 'hold' : 'hang' }); } });
shot(56, { set: 'kit', light: 'kitN', note: 'Insert: the jar tipped out on the table — a few bills and coins; $43 pops up', cam: [[K(0.15, 1.25, 0.75), K(-0.05, 0.8, -0.05), 36], [K(0.05, 1.15, 0.6), K(-0.05, 0.82, -0.05), 32]],
  w: () => ({ kit: { coins: 1, ...jarAt([-0.4, 0.768, -0.05], 0, 'FOR SAM') } }),
  fx: (k, FX, pop, T) => { if (k.lf > k.w(57) - 4) FX('n43' + q(Math.min(1, (k.lf - k.w(57) + 4) / 10), 2), (p) => T.fxBig(p, '$43', Math.min(1, (k.lf - k.w(57) + 4) / 10), '#8ac06a'), K(0.0, 1.06, 0.05), 0.18); for (let i = 0; i < 3; i++) FX('bill' + i, (p) => T.fxCash(p, 1.4 + i * 0.3), K(-0.1 + i * 0.09, 0.79, 0.15 + i * 0.02), 0.06, { fixedYaw: 0, roll: 0, flat: 1, dy: 0 }); } });
shot(58, { set: 'kit', light: 'kitN', note: 'Ray: "It\u2019s all we\u2019ve got. Happy birthday, kid." — two-shot, Ray squeezes Sam\u2019s shoulder', cam: [[K(1.4, 1.5, 1.6), K(-0.1, 1.3, -0.5), 38], [K(0.6, 1.5, 1.4), K(-0.1, 1.35, -0.5), 34]],
  w: () => ({ kit: { ...jarAt([-0.4, 0.768, -0.05], 0, 'FOR SAM'), coins: 1 } }),
  act: (k, A) => { const pat = k.lf > k.w(59) - 3; A('ray', K(0.45, 0, -0.65), { expr: pat ? 'soft' : 'sad', R: pat ? 'reach' : 'hang', L: 'hang', lift: 0.25 }); A('sam', K(-0.45, 0, -0.55), { expr: pat ? 'teary' : 'sad', L: 'hold', R: 'hang', prop: 'jar', propHand: 'L', lid: 'FOR SAM', jarK: 0.7, jarFill: 0.05 }); } });
shot(60, { set: 'kit', light: 'kitN', note: 'Sam doesn\u2019t sleep: alone at the table, 3 a.m. by the clock-light, staring at the jar; slow push — a promise forms', cam: [[K(1.9, 1.7, 1.9), K(-0.3, 0.95, -0.2), 40], [K(0.65, 1.3, 0.95), K(-0.3, 1.1, -0.4), 32]], lmod: { sunI: 0.3 },
  w: () => ({ kit: { ...jarAt(TBL, 0.03, 'FOR SAM') } }), act: (k, A) => A('sam', K(-0.3, 0, -0.62), { sit: 1, expr: k.t > 0.6 ? 'serious' : 'sad', L: 'hold', R: 'hold' }) });
shot(62, { set: 'kit', light: 'kitD', lmod: { az: 80, el: 14, sun: '#ffd0a0' }, note: 'Dawn: Mom in her apron heading out for a double; Sam stops her — "In one hundred days you\u2019ll never work a double shift again."', cam: [[K(-1.6, 1.5, 1.8), K(1.0, 1.35, 0.4), 38], [K(-0.9, 1.5, 1.5), K(1.2, 1.4, 0.4), 34]],
  w: () => ({ kit: { ...jarAt(TBL, 0.03, 'FOR SAM'), hall: 0.6 } }), focus: (k) => K(0.6, 1.5, 0.6),
  act: (k, A) => { A('linda', K(1.9, 0, 0.6), { expr: k.lf > k.w(62, 6) ? 'teary' : 'tired', L: 'hang', R: 'hold', prop: 'keys' }); A('sam', K(0.5, 0, 0.7), { expr: 'serious', R: k.lf > k.w(62, 8) ? 'point' : 'hang', L: 'hang' }); } });
shot(63, { set: 'kit', light: 'kitD', note: 'Top-down insert: Sam\u2019s notebook page THE PLAN — money $43, car NO, plan ???', cam: [[K(0.05, 1.4, 0.25), K(0.05, 0.77, 0.08), 30], [K(0.05, 1.18, 0.18), K(0.05, 0.77, 0.1), 28]],
  w: () => ({ kit: { ...jarAt([-0.35, 0.768, -0.15], 0.03, 'FOR SAM') }, paper: { pos: K(0.05, 0.775, 0.1), rot: [-Math.PI / 2, 0, -0.05], kind: 'plan' } }), cinf: 2 });

// =============================== DAY 2: TRASH DAY ===============================
shot(65, { set: 'house', light: 'day', tag: 'DAY 2', flash: 0.4, note: 'Trash day: bins at every curb, morning; Sam steps out of the drive onto the sidewalk', cam: [[H(-6, 1.0, 15.5), H(2, 1.0, 11.5), 44], [H(-3, 1.2, 15.8), H(3.5, 1.0, 11.5), 40]],
  act: (k, A) => { const W_ = walkP(k, H(5.6, 0, 9.5), H(3.0, 0, 12.0), 0, k.n); A('sam', W_.pos, { expr: 'calm', step: W_.step, L: 'hang' }); } });
shot(67, { set: 'house', light: 'day', note: 'Tracking alongside Sam down the whole street; houses slide by; three broken mowers come into view at the curbs', ease: 'lin',
  cam: (k) => { const x = lerp(-4, -44, k.t); return { pos: [x + 3, 1.5, 17.5], look: [x - 1.5, 1.0, 11.8], fov: 40 }; },
  act: (k, A) => { const W_ = walkP(k, H(-2.5, 0, 12.0), H(-45, 0, 12.0), 0, k.n, 0.8); A('sam', W_.pos, { expr: 'puzzled', step: W_.step, look: -0.4 }); }, w: () => ({ mowers: { curb3: 3 } }) });
shot(68, { set: 'house', light: 'day', note: 'Broken lawn mowers next to the garbage: close on one at the curb, then two quick whip-pans to the others', ease: 'lin', w: () => ({ mowers: { curb3: 3 } }),
  cam: (k) => { const i = Math.min(2, Math.floor(k.t * 3)), u = smooth((k.t * 3) % 1); const X = [-25.4, -47.4, 29.0][i]; return { pos: [X + 1.3 - 0.4 * u, 0.85, 14.3 - 0.3 * u], look: [X, 0.35, 12.25], fov: 36 }; },
  kicks: [[0, 0.2]], focus: (k) => { const i = Math.min(2, Math.floor(k.t * 3)); return [[-25.4, -47.4, 29.0][i], 0.35, 12.25]; } });
shot(70, { set: 'house', light: 'day', note: 'Spring cleaning: neighbors carry boxes and junk out of their garages to the curb', cam: [[H(-26, 1.6, 19), H(-29, 1.0, 9), 42], [H(-29, 1.7, 18.2), H(-31, 1.0, 9), 40]],
  w: () => ({ mowers: { curb3: 3 } }),
  act: (k, A) => { const a = walkP(k, H(-30, 0, 6.5), H(-30, 0, 11.4), 0, k.n * 0.8); A('custB', a.pos, { expr: 'calm', L: 'belly', R: 'belly', prop: 'box', propAt: [0, 300], step: a.step }); A('neighbor', H(-27.8, 0, 10.6), { expr: 'smile', R: 'hold', prop: 'box', propAt: [0, 300] }); } });
shot(72, { set: 'house', light: 'day', note: 'Crane up high over the yards: every lawn in town will need cutting', cam: [[H(-10, 2, 24), H(-10, 0, 0), 44], [H(-6, 22, 34), H(-10, 0, -6), 52]] });
shot(73, { set: 'house', light: 'day', note: 'Insert: Sam\u2019s phone — marketplace listings: used mowers that run, $110-$140', cam: [[H(-45, 1.6, 12.75), H(-45, 1.36, 12.2), 34], [H(-45, 1.55, 12.6), H(-45, 1.36, 12.2), 30]],
  w: () => ({ mowers: { curb3: 3 }, phone: { pos: H(-45, 1.36, 12.2), rot: [-0.4, 0, 0], screen: { mode: 'listing' } } }), focus: H(-45, 1.36, 12.2), cinf: 5 });
shot(74, { set: 'house', light: 'day', note: 'He drags all three home: comic wide, Sam hauling a train of three mowers down the sidewalk, sweating', cam: [[H(-8, 1.1, 16.5), H(-4, 0.8, 12), 40], [H(-1, 1.3, 16.5), H(2, 0.8, 12), 40]],
  w: (k) => { const x = lerp(-8, 3.5, k.t); return { mowers: { drag3: 3 }, mpos: { drag3: [x, 0, 12.1] } }; },
  act: (k, A) => { const x = lerp(-8, 3.5, k.t); A('sam', H(x + 0.7, 0, 12.0), { expr: 'grimace', L: 'reach', R: 'reach', lift: -0.3, step: q((k.lf / 14) % 1, 2), sweat: true, tilt: -5 }); } });
shot(75, { set: 'house', light: 'day', note: 'Ray watches from the porch, shaking his head: "Get a real job, Sam."', cam: [[H(-1.8, 1.6, 6.0), H(-4.6, 1.45, 1.3), 38], [H(-2.6, 1.65, 5.0), H(-4.6, 1.55, 1.3), 34]],
  act: (k, A) => A('ray', H(-4.6, 0.45, 1.3), { expr: k.lf > k.w(76) - 3 ? 'stern' : 'meh', L: 'cross', R: 'cross', headTilt: k.lf < k.w(76) ? 8 * Math.sin(k.lf * 0.35) : 0 }) });

// =============================== DAY 3: THE FIRST MOWER ===============================
shot(77, { set: 'gar', light: 'garD', tag: 'DAY 3', flash: 0.4, note: 'Garage, morning light through the open door; the first mower on the floor; push into the carburetor (dirt, smoke)', cam: [[G(1.6, 1.6, 2.6), G(0.0, 0.6, -1.5), 42], [G(1.05, 1.05, 0.0), G(0.0, 0.6, -1.6), 38]],
  w: () => ({ gar: { open: 1, board: { mode: 'fix' } }, mowers: { garIn: 2 } }), focus: G(0.25, 0.35, -1.4),
  act: (k, A) => A('sam', G(-0.6, 0, -1.9), { sit: 1, expr: 'focus', R: 'hold', prop: 'wrench' }),
  fx: (k, FX, pop, T) => { pop('sm', (p, t) => T.fxSmoke(p, t, '#5a5248'), G(0.25, 0.55, -1.3), 0.2, 40, 30); } });
shot(79, { set: 'gar', light: 'garD', note: 'He watches repair videos on his phone (stand on the bench), scrubs the carb, then grabs the cord', cam: [[G(1.0, 1.45, -0.2), G(-0.8, 1.0, -2.7), 38], [G(1.5, 1.45, 0.8), G(-0.1, 1.05, -1.7), 42]],
  w: (k) => ({ gar: { open: 1, phone: { mode: 'video', t: k.t } }, mowers: { garIn: 2 } }),
  act: (k, A) => { const ph = k.lf < k.w(79, 3) ? 0 : k.lf < k.w(79, 6) ? 1 : 2; A('sam', G(-0.55, 0, -1.9), { expr: ph === 0 ? 'think2' : 'focus', R: ph === 2 ? 'reach' : 'hold', prop: ph === 1 ? 'brush' : ph === 2 ? 'cord' : null, cordX: -30, cordY: 40, lift: ph === 2 ? -0.2 : 0 }); } });
shot(80, { set: 'gar', light: 'garD', note: 'Nothing. (dead silence, tiny puff)', cam: [[G(0.9, 1.3, 0.2), G(-0.4, 1.3, -1.9), 32], [G(0.75, 1.32, 0.0), G(-0.45, 1.35, -1.9), 30]],
  w: () => ({ gar: { open: 1 }, mowers: { garIn: 2 } }), act: (k, A) => A('sam', G(-0.55, 0, -1.9), { expr: 'meh', R: 'out', prop: 'cord', cordX: 10, cordY: 50 }),
  fx: (k, FX, pop, T) => pop('pf', T.fxPuff, G(0.25, 0.6, -1.3), 0.12, 2, 16) });
shot(81, { set: 'gar', light: 'garD', note: 'He pulls again — yank, wobble — nothing; sweat drop', cam: [[G(1.9, 1.3, 0.3), G(-0.1, 1.0, -1.6), 42], [G(1.7, 1.3, 0.0), G(-0.2, 1.05, -1.7), 40]],
  w: (k) => ({ gar: { open: 1, shake: pulse(k.lf, 10, 12) * 0.6 }, mowers: { garIn: 2 } }), kicks: [[10, 0.25]],
  act: (k, A) => { const y = pulse(k.lf, 6, 14); A('sam', G(-0.55, 0, -1.9), { expr: k.lf > 28 ? 'frown' : 'grimace', R: y > 0.2 ? 'up' : 'reach', prop: 'cord', cordX: 30 * y, cordY: 60 - 40 * y, sweat: k.lf > 28, tilt: -6 * y }); },
  fx: (k, FX, pop, T) => pop('pf', T.fxPuff, G(0.25, 0.6, -1.3), 0.12, 18, 16) });
shot(83, { set: 'gar', light: 'garD', note: 'PULL #11: it ROARS — the mower shakes, smoke blast, camera shake, Sam leaps', ov: (k) => ({ count: 'PULL #' + Math.min(11, 3 + Math.floor(k.lf / 3.5)), col: '#ffffff' }),
  cam: [[G(1.2, 0.8, 0.0), G(0.0, 0.7, -1.6), 40], [G(1.5, 1.1, 0.6), G(-0.1, 1.0, -1.7), 44]], kicks: [[30, 0.8], [38, 0.4]],
  w: (k) => ({ gar: { open: 1, shake: k.lf > 30 ? 1 : 0 }, mowers: { garIn: 2 } }),
  act: (k, A) => { const on = k.lf > 30; A('sam', G(-0.55, on ? 0.08 * Math.abs(Math.sin(k.lf * 0.5)) : 0, -1.9), { expr: on ? 'yay' : 'grimace', R: on ? 'up' : 'reach', L: on ? 'up' : 'hang', prop: on ? null : 'cord', cordX: 30, cordY: 20 }); },
  fx: (k, FX, pop, T) => { if (k.lf > 30) { const t = ((k.lf - 30) / 20) % 1; FX('smk' + q(t, 2), (p) => T.fxSmoke(p, t, '#d8d4cc'), G(0.5 + t * 0.3, 0.5 + t * 0.5, -1.2), 0.3); pop('bng', T.fxBang, G(0.25, 0.7, -1.2), 0.3, 30, 12); pop('nt', T.fxNotes, G(-0.4, 1.9, -1.8), 0.25, 34, 30); } } });
shot(84, { set: 'gar', light: 'garD', note: 'Behind him, in the open doorway: Mia lowers her phone — the camera clicks off; she smirks and slips away. He doesn\u2019t notice.', cam: [[G(-1.6, 1.45, -3.0), G(0.2, 1.3, 3.2), 42], [G(-1.35, 1.45, -2.7), G(0.3, 1.3, 3.2), 40]],
  w: () => ({ gar: { open: 1, shake: 0.7 }, mowers: { garIn: 2 } }), focus: (k) => k.lf < k.w(86) - 10 ? G(0.6, 1.4, 3.0) : G(-0.2, 1.3, -1.0),
  act: (k, A) => { const lv = k.lf > k.w(85) + 10; A('mia', lv ? lerp3(G(0.6, 0, 3.0), G(2.6, 0, 3.4), smooth(k.r(k.w(85) + 10, k.w(86) + 10))) : G(0.6, 0, 3.0), { expr: 'smirk', R: k.lf < k.w(84, 4) ? 'tele' : 'hold', prop: 'phoneUp', rec: k.lf < k.w(84, 4), step: lv ? q((k.lf / 10) % 1, 2) : 0 });
    A('sam', G(-0.9, 0, 0.2), { expr: 'laugh', L: 'up', R: 'fist', shake: Math.sin(k.lf) }); } });
