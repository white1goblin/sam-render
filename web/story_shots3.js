// Shots 3/3: DAY 56 (the city), Day 58-90 (the garage on Main Street, the team, the offer), DAY 100, the ending + subscribe.
import { shot, smooth, eo, bk, clamp, lerp, lerp3, q, pulse, walkP } from './story_core.js';
import { H, K, G, Mn, Hp, jarAt } from './story_shots1.js';
const SHELF = [-2.84, 1.585, -0.75], TBL = [-0.25, 0.768, 0.1];
const D61 = { sign: 1, mowers: { drive61: 61 } };

// =============================== DAY 56: THE CITY ===============================
shot(185, { set: 'house', light: 'day', flash: true, title: 'DAY 56', sub: 'THE CITY SHOWS UP', titleLen: 80, note: 'CHAPTER: the inspector taps a paper against the garage door — tap, tap, tap', cam: [[H(9.5, 1.6, 4.5), H(7.0, 1.5, -1.9), 38], [H(8.6, 1.6, 2.6), H(7.0, 1.45, -1.9), 34]],
  w: (k) => ({ ...D61, garOpen: 0, inspCar: 1, paper: { pos: H(7.0 - 0.02 * pulse(k.lf % 20, 0, 6), 1.45, -1.9 + 0.03 * pulse(k.lf % 20, 0, 6)), rot: [0, 0, 0.05], kind: 'city' } }), focus: H(7.0, 1.45, -1.9),
  act: (k, A) => A('inspector', H(7.6, 0, -1.2), { expr: 'stern', R: 'reach', lift: 0.2, L: 'hang' }) });
shot(187, { set: 'house', light: 'day', note: 'A neighbor complained (arms crossed at her fence); quick beats on THE NOISE (a revving mower), THE OIL (stains), THE CARS (blocking the street)', ease: 'lin',
  cam: (k) => { const i = k.lf < k.w(188) ? 0 : k.lf < k.w(189) ? 1 : k.lf < k.w(190) ? 2 : 3; const P = [[H(-6.5, 1.6, 9.2), H(-9.0, 1.4, 11.0), 34], [H(6.6, 0.8, 4.4), H(5.6, 0.4, 2.6), 34], [H(6.0, 0.8, 1.6), H(6.1, 0.0, 0.4), 38], [H(-2, 1.7, 22.5), H(6, 1.0, 15), 40]][i];
    return { pos: [P[0][0] + 0.15 * Math.sin(k.lf * 0.05), P[0][1], P[0][2]], look: P[1], fov: P[2] - 2 * ((k.lf % 30) / 30) }; },
  w: (k) => ({ ...D61, garOpen: 1, inspCar: 1, custCars: 5 }),
  act: (k, A) => { A('neighbor', H(-9.2, 0, 10.4), { expr: 'angry', L: 'cross', R: 'cross' }); A('inspector', H(8.4, 0, 1.0), { expr: 'stern', R: 'hold', prop: 'paper' }); },
  fx: (k, FX, pop, T) => { if (k.lf >= k.w(188) && k.lf < k.w(189)) { pop('bg', T.fxBang, H(5.6, 0.7, 2.6), 0.2, k.w(188), 12); FX('nt' + q((k.lf * 0.05) % 1, 2), (p) => T.fxNotes(p, (k.lf * 0.05) % 1), H(5.4, 1.1, 2.4), 0.2); }
    if (k.lf >= k.w(189) && k.lf < k.w(190)) for (let i = 0; i < 3; i++) FX('oil' + i, (p) => p.ell(300, 500, 240, 120, '#1e1c22', 0), H(5.7 + i * 0.4, 0.03, 0.2 + i * 0.3), 0.2, { fixedYaw: 0, roll: 0, flat: 1, alpha: 0.75 }); } });
shot(191, { set: 'house', light: 'day', note: 'Insert: the notice — CEASE AND DESIST, ZONING VIOLATION, NO COMMERCIAL REPAIRS', cam: [[H(7.0, 1.6, -1.35), H(7.0, 1.45, -1.9), 30], [H(7.0, 1.52, -1.5), H(7.0, 1.42, -1.9), 26]], cinf: 4, focus: H(7.0, 1.45, -1.9),
  w: () => ({ ...D61, garOpen: 0, paper: { pos: H(7.0, 1.45, -1.9), rot: [0, 0, 0.05], kind: 'city' } }) });
shot(193, { set: 'house', light: 'day', note: '"All repairs stop. Today." — the wrench slips from Sam\u2019s hand; the garage door rolls down behind him', cam: [[H(7.8, 1.5, 3.6), H(6.0, 1.3, 0.2), 36], [H(7.4, 1.5, 2.8), H(6.0, 1.35, 0.2), 32]], kicks: [[24, 0.5]],
  w: (k) => ({ ...D61, garOpen: 1 - smooth(k.r(10, k.n)), inspCar: 1 }),
  act: (k, A) => A('sam', H(6.0, 0, 0.6), { expr: k.lf > 18 ? 'shock' : 'gulp', R: k.lf > 18 ? 'hang' : 'hold', prop: k.lf > 18 ? null : 'wrench' }),
  fx: (k, FX, pop, T) => { if (k.lf > 18 && k.lf < 34) FX('wr' + k.lf, (p) => { p.g.save(); p.g.translate(300, 500); p.g.rotate(k.lf * 0.5); p.g.translate(-300, -500); p.band([[300, 300], [300, 700]], '#b8c0c8', 50, 14); p.ell(300, 260, 70, 60, '#b8c0c8', 14); p.g.restore(); }, H(6.25, 1.0 - 0.9 * ((k.lf - 18) / 16) ** 2, 0.7), 0.08); pop('cl', T.fxDust, H(6.25, 0.1, 0.7), 0.2, 34, 16); } });
shot(195, { set: 'house', light: 'day', note: 'Crane up high: sixty-one mowers fill the driveway and lawn — and every one belongs to a customer', cam: [[H(9, 2.0, 12), H(4, 0.4, 3), 42], [H(14, 13, 18), H(3, 0, 3), 46]],
  w: () => ({ ...D61, garOpen: 0, inspCar: 0 }), fx: (k, FX, pop, T) => { if (k.lf > 12) FX('61' + q(Math.min(1, (k.lf - 12) / 10), 2), (p) => T.fxBig(p, '61', Math.min(1, (k.lf - 12) / 10), '#f2c23a'), H(3, 3.5, 4), 1.4); for (let i = 0; i < 5; i++) if (k.lf > k.w(196) + i * 3) FX('tg' + i, (p) => T.tagCard(p), H(-0.5 + i * 2.2, 1.6, 4 + (i % 2)), 0.45); } });
shot(197, { set: 'kit', light: 'kitN', flash: 0.4, note: 'That night: kitchen, tension — Sam pacing, Mia at the table', cam: [[K(1.8, 1.55, 2.0), K(-0.2, 1.2, -0.3), 40], [K(1.3, 1.55, 1.6), K(-0.2, 1.3, -0.3), 36]],
  w: () => ({ kit: { ...jarAt(SHELF, 0.5, 'FOR SAM'), laptop: 'edit' } }),
  act: (k, A) => { A('sam', lerp3(K(-1.3, 0, 0.6), K(-0.9, 0, 0.2), 0.5 + 0.5 * Math.sin(k.lf * 0.05)), { expr: 'angry', L: 'hang', step: q((k.lf / 12) % 1, 2) }); A('mia', K(0.4, 0, -0.65), { sit: 1, expr: 'nervous', L: 'hold', R: 'hold' }); } });
shot(198, { set: 'kit', light: 'kitN', note: '"This is your fault. Your videos brought all these people here." — Sam points at her, shouting; push in', cam: [[K(-0.2, 1.5, 1.6), K(-0.9, 1.5, 0.2), 34], [K(-0.4, 1.55, 1.25), K(-0.9, 1.6, 0.2), 30]], kicks: [[4, 0.3]],
  w: () => ({ kit: { ...jarAt(SHELF, 0.5, 'FOR SAM'), laptop: 'edit' } }), act: (k, A) => { A('sam', K(-0.9, 0, 0.2), { expr: 'yell', R: 'point', L: 'fist' }); } });
shot(200, { set: 'kit', light: 'kitN', note: 'Mia doesn\u2019t yell. She walks to her room (hall door) and comes back with an old envelope', cam: [[K(-1.8, 1.5, 1.8), K(1.4, 1.3, 0.4), 38], [K(-1.4, 1.5, 1.6), K(1.6, 1.35, 0.6), 36]],
  w: (k) => ({ kit: { ...jarAt(SHELF, 0.5, 'FOR SAM'), hall: 0.8 } }),
  act: (k, A) => { const back = k.lf > k.w(201, 7); const W_ = back ? walkP(k, K(2.6, 0, 0.9), K(1.0, 0, 0.5), k.w(201, 7), k.n) : walkP(k, K(0.4, 0, -0.4), K(2.6, 0, 0.9), k.w(201) - 10, k.w(201, 6)); A('mia', W_.pos, { expr: back ? 'serious' : 'sad', step: W_.step, R: back ? 'hold' : 'hang', prop: back ? 'envelope' : null, old: true, propDX: -6 }); A('sam', K(-0.9, 0, 0.2), { expr: 'frown', L: 'cross', R: 'cross' }); } });
shot(202, { set: 'house', light: 'memory', flash: 0.6, note: 'Flash back to age 18: Mia at the mailbox, reading the big envelope in secret', cam: [[H(5.2, 1.5, 15), H(3.2, 1.3, 11.7), 36], [H(4.4, 1.5, 14), H(3.0, 1.35, 11.8), 32]],
  act: (k, A) => A('mia', H(2.8, 0, 12.1), { expr: 'wow', R: 'hold', prop: 'envelope', open: true, propDX: -8 }) });
shot(203, { set: 'kit', light: 'kitN', note: 'Insert: the letter — SCHOOL OF FILM · CONGRATULATIONS · ACCEPTED; push in. She never went.', cam: [[K(0.1, 1.25, 0.6), K(0.1, 0.77, 0.12), 32], [K(0.1, 1.05, 0.42), K(0.1, 0.77, 0.12), 26]], cinf: 3, focus: K(0.1, 0.78, 0.12),
  w: () => ({ kit: { envelope: 1 }, paper: { pos: K(0.1, 0.776, 0.12), rot: [-Math.PI / 2, 0, -0.06], kind: 'film' } }) });
shot(206, { set: 'kit', light: 'kitN', note: 'Mia: "Somebody had to help pay the rent. I never told anyone." — close, teary; Sam\u2019s anger drains away', cam: [[K(-0.3, 1.5, 1.6), K(1.0, 1.45, 0.4), 32], [K(-0.1, 1.5, 1.3), K(1.0, 1.5, 0.4), 30]],
  w: () => ({ kit: { envelope: 1 } }), act: (k, A) => { A('mia', K(1.0, 0, 0.5), { expr: 'teary', R: 'hold', prop: 'envelope', old: true, open: true, tears: (k.lf * 0.04) % 1 }); A('sam', K(-0.6, 0, -0.1), { expr: 'sad', L: 'hang' }, { k: 1 }); } });
shot(208, { set: 'kit', light: 'kitN', note: 'She goes back to her room; the hall door closes; laptop glow under the door → she makes one more video', cam: [[K(-1.6, 1.4, 1.6), K(2.0, 1.1, 0.9), 38], [K(0.2, 1.3, 1.6), K(2.98, 1.0, 0.9), 34]],
  w: (k) => ({ kit: { hall: 1 - smooth(k.r(k.n * 0.3, k.n * 0.6)) }, extra2: { i: 1.2 * smooth(k.r(k.n * 0.6, k.n)), pos: [102.6, 0.3, 0.9], col: '#a8c8ff', dist: 3 } }),
  act: (k, A) => { const W_ = walkP(k, K(1.0, 0, 0.5), K(2.7, 0, 0.9), 0, k.n * 0.3); if (k.t < 0.35) A('mia', W_.pos, { expr: 'sad', step: W_.step }); A('sam', K(2.0, 0, 0.1), { expr: 'sad' }); } });

// =============================== DAY 58-60: THE GARAGE ON MAIN STREET ===============================
shot(210, { set: 'gar', light: 'garN', tag: 'DAY 58', flash: 0.4, vf: 'phone', vfText: 'MIA \u2022 NEW VIDEO', note: 'Mia\u2019s new video: Sam asleep sitting on a pile of mowers in the garage, Zzz', cam: [[G(1.7, 1.35, 2.7), G(-0.7, 0.95, 0.9), 38], [G(1.3, 1.3, 2.3), G(-0.7, 1.0, 0.9), 34]],
  w: () => ({ gar: { open: 0, out: 'night', hero: false, board: { mode: 'wait', n: 61 } }, mowers: { garIn: 6 } }),
  act: (k, A) => A('sam', G(-0.8, 0.45, 1.2), { sit: 1, expr: 'sleep', L: 'hang', R: 'hang', headTilt: 12 }), fx: (k, FX, pop, T) => FX('z' + q((k.lf * 0.02) % 1, 2), (p) => T.fxZz(p, (k.lf * 0.02) % 1), G(-0.5, 1.75, 1.2), 0.22) });
shot(212, { set: 'gar', light: 'garN', note: 'Phone insert: the title "The city closed us. 61 people are waiting. We need a garage." and comments flooding in', cam: [[G(-0.9, 1.08, -2.42), G(-0.9, 1.08, -2.85), 32], [G(-0.9, 1.06, -2.5), G(-0.9, 1.07, -2.85), 28]], cinf: 4, focus: G(-0.9, 1.08, -2.82),
  w: (k) => ({ gar: { open: 0, out: 'night' }, phone: { pos: G(-0.9, 1.08, -2.85), rot: [0, 0, 0], screen: { mode: 'newvid', views: Math.round(lerp(1000, 410000, eo(k.t))).toLocaleString('en-US'), cmts: ['Ohio hero!!', 'Someone give this kid a garage', 'Sharing everywhere', 'I have a space in Dayton'], nc: Math.min(4, Math.floor(k.t * 5)) } } }) });
shot(216, { set: 'house', light: 'day', note: 'Two hours later — knock knock: Sam opens the front door; Mr. Hollis on the porch', cam: [[H(-2.0, 1.6, 5.4), H(-4.2, 1.45, 0.8), 38], [H(-2.8, 1.62, 4.2), H(-4.2, 1.5, 0.8), 34]],
  w: (k) => ({ ...D61, houseDoor: smooth(k.r(k.n * 0.3, k.n * 0.55)) }), ov: (k) => k.lf < k.n * 0.35 ? { count: 'KNOCK KNOCK', col: '#ffffff' } : null,
  act: (k, A) => { A('hollis', H(-3.4, 0.45, 1.6), { expr: 'smile', R: k.lf < k.n * 0.35 ? 'fist' : 'wave', wv: k.lf * 0.3 }); if (k.lf > k.n * 0.45) A('sam', H(-4.3, 0.45, 0.6), { expr: 'wow' }); } });
shot(218, { set: 'house', light: 'day', note: 'Hollis talks: the man with the trailer owns an empty garage on Main Street', cam: [[H(-2.6, 1.6, 3.9), H(-3.6, 1.55, 1.4), 34], [H(-2.4, 1.62, 3.6), H(-3.5, 1.6, 1.4), 32]],
  w: () => ({ ...D61, houseDoor: 1 }), act: (k, A) => { A('hollis', H(-3.4, 0.45, 1.6), { expr: 'calm', R: 'thumb' }); A('sam', H(-4.3, 0.45, 0.8), { expr: 'hopeful' }); } });
shot([219, 0], { set: 'main', light: 'day', lead: 4, note: 'Main Street: the old gas-station garage — faded SERVICE sign, FOR RENT on the pole, bays shut; slow push', cam: [[Mn(4, 2.4, 22), Mn(19, 2.6, 0), 44], [Mn(10, 2.0, 15), Mn(19, 2.2, 0), 40]],
  w: () => ({ main: { pole: 'rent', bays: 0 } }) });
shot(221, { set: 'main', light: 'day', note: 'At the shop front Hollis hands Sam the keys: "First three months are free. After that you pay like everybody else." (finger wag)', cam: [[Mn(17.5, 1.6, 6.2), Mn(16.8, 1.4, 1.6), 38], [Mn(17.0, 1.6, 5.2), Mn(16.6, 1.45, 1.6), 34]],
  w: () => ({ main: { pole: 'rent', bays: 0 } }),
  act: (k, A) => { const late = k.lf > k.w(222) - 4; A('hollis', Mn(17.6, 0, 1.6), { expr: late ? 'smirk' : 'smile', R: late ? 'point' : 'offer', prop: late ? null : 'keys' }); A('sam', Mn(15.9, 0, 1.8), { expr: late ? 'laugh' : 'yay', L: 'hold', prop: late ? 'keys' : null, propHand: 'L' }); } });
shot(223, { set: 'main', light: 'day', tag: 'DAY 60', flash: 0.4, note: 'Moving day, legal this time: bays roll open; a truck and the family wheel mower after mower inside — the shop fills up', cam: [[Mn(10, 2.4, 13), Mn(20, 1.0, -2), 44], [Mn(14, 2.0, 9), Mn(21, 1.0, -3), 42]],
  w: (k) => ({ main: { pole: 'rent', bays: smooth(k.r(0, 30)), moveTruck: 1 }, mowers: { shop61: Math.round(lerp(8, 61, k.t)), man1: 1 }, mpos: { man1: [lerp(306, 318, (k.lf * 0.01) % 1) - 300, 0, lerp(8, 1, (k.lf * 0.01) % 1)] } }),
  act: (k, A) => { const u = (k.lf * 0.01) % 1; A('sam', Mn(lerp(6.8, 18.6, u), 0, lerp(8.4, 1.4, u)), { expr: 'happy', R: 'reach', lift: -0.4, step: q((k.lf / 10) % 1, 2) }); A('ray', Mn(16.5, 0, 3.5), { expr: 'smile', R: 'point' }); A('mia', Mn(13.6, 0, 4.4), { expr: 'happy', R: 'tele', prop: 'phoneUp' }); } });
shot(226, { set: 'main', light: 'shopD', note: 'Inside among the rows of mowers, Sam finally says it: "I\u2019m sorry, Mia."', cam: [[Mn(20.5, 1.6, -0.9), Mn(18.4, 1.45, -4.6), 36], [Mn(20.0, 1.6, -1.4), Mn(18.4, 1.5, -4.6), 32]],
  w: () => ({ main: { bays: 1 }, mowers: { shop61: 61 } }), act: (k, A) => { A('sam', Mn(19.0, 0, -4.2), { expr: k.lf > k.w(227) ? 'sad' : 'nervous', L: 'hang' }); A('mia', Mn(17.6, 0, -4.8), { expr: 'calm', L: 'cross', R: 'cross' }); } });
shot(228, { set: 'main', light: 'shopD', note: 'She just hands him a wrench — and hits record (REC light)', cam: [[Mn(19.6, 1.5, -1.6), Mn(18.3, 1.3, -4.5), 34], [Mn(19.2, 1.55, -2.2), Mn(18.2, 1.4, -4.6), 30]],
  w: () => ({ main: { bays: 1 }, mowers: { shop61: 61 } }),
  act: (k, A) => { const rec = k.lf > k.n * 0.5; A('mia', Mn(17.6, 0, -4.8), { expr: rec ? 'smirk' : 'soft', R: rec ? 'tele' : 'offer', prop: rec ? 'phoneUp' : 'wrench' }); A('sam', Mn(19.0, 0, -4.2), { expr: rec ? 'laugh' : 'teary', L: rec ? 'hold' : 'hang', prop: rec ? 'wrench' : null, propHand: 'L' }); } });

// =============================== DAY 62-70: THE TEAM ===============================
shot(229, { set: 'main', light: 'shopD', light2: 'shopN', tag: 'DAY 62', flash: 0.4, note: 'Time-lapse: Sam works sixteen hours a day — light swings from day to night across one push; the pile shrinks only a little', cam: [[Mn(24, 1.8, -0.8), Mn(19, 1.0, -7.0), 42], [Mn(21.5, 1.6, -3.4), Mn(19.5, 1.1, -7.4), 38]],
  w: (k) => ({ main: { bays: 0, benches: 1, hero: 1 }, mowers: { shop61: Math.round(lerp(61, 52, k.t)) } }), lt: (k) => smooth(k.t), ov: (k) => ({ count: String(Math.min(16, Math.floor(k.t * 17))) + ' HRS', col: '#ffffff' }),
  act: (k, A) => A('sam', Mn(18.5, 0, -6.9), { expr: k.t > 0.6 ? 'tired' : 'focus', R: 'hold', prop: 'wrench', L: (k.lf >> 3) % 2 ? 'hold' : 'hang' }) });
shot(231, { set: 'main', light: 'shopN', note: 'He falls asleep standing up at the bench — sways, nods, Zzz', cam: [[Mn(19.8, 1.6, -5.4), Mn(18.4, 1.5, -7.0), 32], [Mn(19.6, 1.6, -5.7), Mn(18.4, 1.55, -7.0), 30]],
  w: () => ({ main: { bays: 0, benches: 1, hero: 1 }, mowers: { shop61: 52 } }),
  act: (k, A) => A('sam', Mn(18.5, 0, -6.9), { expr: 'sleep', R: 'hold', prop: 'wrench', tilt: 6 * Math.sin(k.lf * 0.06), headTilt: 10 }),
  fx: (k, FX, pop, T) => FX('zz' + q((k.lf * 0.02) % 1, 2), (p) => T.fxZz(p, (k.lf * 0.02) % 1), Mn(18.9, 2.0, -6.9), 0.25) });
shot(232, { set: 'main', light: 'shopN', note: 'Ray, hand on his son\u2019s shoulder: "You can\u2019t fix every mower in Ohio by yourself, son."', cam: [[Mn(20.6, 1.6, -4.6), Mn(18.9, 1.5, -6.9), 36], [Mn(20.2, 1.6, -5.0), Mn(19.0, 1.55, -6.9), 32]],
  w: () => ({ main: { bays: 0, benches: 1, hero: 1 }, mowers: { shop61: 52 } }),
  act: (k, A) => { A('sam', Mn(18.5, 0, -6.9), { expr: k.lf > k.w(233) ? 'sad' : 'tired', R: 'hold', prop: 'wrench' }); A('ray', Mn(19.5, 0, -6.4), { expr: 'soft', L: 'reach', lift: 0.2 }); } });
shot(234, { set: 'main', light: 'day', tag: 'DAY 64', flash: 0.4, note: 'Scariest thing: Sam tapes a hand-written sign to the shop door — NO NEW REPAIRS THIS WEEK (we\u2019re training!)', cam: [[Mn(18.4, 1.6, 4.4), Mn(15.9, 1.5, 0.0), 38], [Mn(17.2, 1.55, 2.8), Mn(15.9, 1.45, 0.0), 32]],
  w: (k) => ({ main: { bays: 0 }, paper: k.t > 0.4 ? { pos: Mn(15.95, 1.45, 0.09), rot: [0, 0, 0.03], kind: 'closed' } : null }), focus: Mn(15.95, 1.45, 0.1),
  act: (k, A) => A('sam', Mn(15.3, 0, 0.9), { expr: 'nervous', R: k.t > 0.4 ? 'reach' : 'hold', prop: k.t > 0.4 ? null : 'paper', sweat: true }) });
shot(236, { set: 'main', light: 'shopD', note: 'And he teaches: Sam at a bench, pointing at the engine while two students watch', cam: [[Mn(23.6, 1.6, -3.4), Mn(20.6, 1.2, -7.4), 38], [Mn(22.6, 1.55, -4.2), Mn(20.6, 1.25, -7.4), 34]],
  w: () => ({ main: { bays: 0, benches: 2 }, mowers: { shop61: 40 } }),
  act: (k, A) => { A('sam', Mn(20.0, 0, -6.8), { expr: 'calm', R: 'point', L: 'hang' }); if (k.lf > k.w(237) - 6) { A('kidA', Mn(21.2, 0, -6.2), { expr: 'happy' }); A('kidB', Mn(21.9, 0, -6.6), { expr: 'wow' }); } } });
shot(238, { set: 'main', light: 'shopD', note: 'Two kids from his old high school wave hello; then Dee — a laid-off mechanic in coveralls — walks in through the bay', cam: [[Mn(18.8, 1.6, -2.6), Mn(21.6, 1.3, -6.6), 38], [Mn(17.6, 1.6, -2.2), Mn(22.0, 1.3, -5.6), 40]],
  w: () => ({ main: { bays: 0.7, benches: 3 }, mowers: { shop61: 40 } }),
  act: (k, A) => { A('kidA', Mn(21.2, 0, -6.2), { expr: 'happy', R: 'wave', wv: k.lf * 0.4 }); A('kidB', Mn(21.9, 0, -6.6), { expr: 'grin', L: 'thumb' }); if (k.lf > k.w(239) - 6) { const W_ = walkP(k, Mn(23.6, 0, -0.6), Mn(23.0, 0, -4.6), k.w(239) - 6, k.n); A('dee', W_.pos, { expr: 'smirk', R: 'hold', prop: 'wrench', step: W_.step }); } } });
shot(240, { set: 'main', light: 'shopD', note: 'Ray teaches them how to listen: eyes closed, hand to the ear — the three copy him', cam: [[Mn(23.6, 1.6, -3.2), Mn(21.2, 1.4, -6.4), 38], [Mn(23.0, 1.55, -3.6), Mn(21.2, 1.45, -6.4), 34]],
  w: () => ({ main: { bays: 0.7, benches: 3, hero: 1 }, mowers: { shop61: 40 } }),
  act: (k, A) => { A('ray', Mn(20.2, 0, -6.6), { expr: 'calm', R: 'cheek', closed: true }); const c = k.lf > 20; A('kidA', Mn(21.2, 0, -6.0), { expr: c ? 'calm' : 'puzzled', R: c ? 'cheek' : 'hang', closed: c }); A('kidB', Mn(22.0, 0, -6.5), { expr: c ? 'calm' : 'puzzled', L: c ? 'cheek' : 'hang', closed: c }); A('dee', Mn(22.8, 0, -5.8), { expr: c ? 'smirk' : 'meh', R: c ? 'cheek' : 'hang' }); },
  fx: (k, FX, pop, T) => FX('nt' + q((k.lf * 0.04) % 1, 2), (p) => T.fxNotes(p, (k.lf * 0.04) % 1), Mn(21.0, 2.2, -6.6), 0.3) });
shot(241, { set: 'main', light: 'shopD', tag: 'DAY 70', flash: 0.4, note: 'FOUR BENCHES · FOUR PEOPLE · 20 MOWERS A DAY — a long lateral dolly past all four benches, each word lands on a bench', ease: 'lin',
  cam: [[Mn(17.4, 1.7, -4.4), Mn(18.4, 1.2, -7.6), 40], [Mn(24.8, 1.7, -4.4), Mn(24.0, 1.2, -7.6), 40]],
  w: () => ({ main: { bays: 1, benches: 4 }, mowers: { shop61: 30 } }),
  act: (k, A) => { A('sam', Mn(18.6, 0, -6.9), { expr: 'focus', R: 'hold', prop: 'wrench' }); A('dee', Mn(20.6, 0, -6.9), { expr: 'smirk', R: 'hold', prop: 'wrench' }); A('kidA', Mn(22.6, 0, -6.9), { expr: 'happy', R: 'hold', prop: 'brush' }); A('kidB', Mn(24.6, 0, -6.9), { expr: 'grin', R: 'hold', prop: 'wrench' }); },
  fx: (k, FX, pop, T) => { const L = [[k.w(242), '4 BENCHES', 18.8], [k.w(243), '4 PEOPLE', 21.6], [k.w(244), '20 / DAY', 24.0]]; L.forEach(([f0, s, x], i) => { if (k.lf > f0 - 3) FX('b' + i + q(Math.min(1, (k.lf - f0 + 3) / 8), 2), (p) => T.fxBig(p, s, Math.min(1, (k.lf - f0 + 3) / 8), '#f2c23a'), Mn(x, 2.5, -6.6), 0.5); }); } });

// =============================== DAY 80-90: THE OFFER ===============================
shot(245, { set: 'main', light: 'shopD', tag: 'DAY 80', flash: 0.4, note: 'The shop phone rings on the counter: INCOMING CALL — Hardware Company', cam: [[Mn(15.0, 1.35, -2.4), Mn(14.7, 1.08, -3.05), 30], [Mn(14.9, 1.3, -2.6), Mn(14.7, 1.07, -3.05), 26]], cinf: 5, focus: Mn(14.7, 1.06, -3.05),
  w: () => ({ main: { bays: 1, benches: 4 }, mowers: { shop61: 30 }, phone: { pos: Mn(14.7, 1.055, -3.05), rot: [-Math.PI / 2 + 0.02, 0, 0.3 + 0.03 * Math.sin(Math.random() * 0)], screen: { mode: 'call' } } }), kicks: [[6, 0.15], [20, 0.15]] });
shot(247, { set: 'main', light: 'shopD', note: 'A man in a suit lays the offer on the counter: the videos, the name, the sign — $50,000 (number pops)', cam: [[Mn(16.2, 1.6, -0.8), Mn(14.4, 1.3, -3.4), 38], [Mn(15.8, 1.55, -1.4), Mn(14.4, 1.3, -3.4), 34]],
  w: () => ({ main: { bays: 1, benches: 4, buyerCar: 1 }, mowers: { shop61: 30 }, paper: { pos: Mn(14.5, 1.05, -3.05), rot: [-Math.PI / 2, 0, 0.1], kind: 'offer' } }),
  act: (k, A) => { A('buyer', Mn(15.6, 0, -2.2), { expr: 'smile', R: 'pointDown' }); A('sam', Mn(13.6, 0, -3.8), { expr: 'puzzled' }); },
  fx: (k, FX, pop, T) => { if (k.lf > k.w(248) - 3) FX('50k' + q(Math.min(1, (k.lf - k.w(248) + 3) / 10), 2), (p) => T.fxBig(p, '$50,000', Math.min(1, (k.lf - k.w(248) + 3) / 10), '#8ac06a'), Mn(14.6, 2.3, -3.2), 0.4); } });
shot(249, { set: 'main', light: 'shopD', note: 'More money than the family has ever seen: Linda, Ray and Mia lean in — gasps', cam: [[Mn(16.4, 1.55, -1.2), Mn(14.6, 1.4, -3.8), 36], [Mn(16.0, 1.6, -1.8), Mn(14.4, 1.45, -3.8), 34]],
  w: () => ({ main: { bays: 1, benches: 4 }, mowers: { shop61: 30 }, paper: { pos: Mn(14.5, 1.05, -3.05), rot: [-Math.PI / 2, 0, 0.1], kind: 'offer' } }),
  act: (k, A) => { A('lindaHome', Mn(13.4, 0, -4.0), { expr: 'gasp', L: 'cheek', R: 'cheek' }); A('rayShop', Mn(14.4, 0, -4.3), { expr: 'wow' }); A('mia', Mn(15.4, 0, -4.0), { expr: 'wow' }); A('sam', Mn(16.2, 0, -3.2), { expr: 'serious', L: 'cross', R: 'cross' }); } });
shot(250, { set: 'main', light: 'shopD', note: 'And the first to say "take it" is Mia — she nods, thumbs up, smiling for him', cam: [[Mn(16.6, 1.6, -2.0), Mn(15.4, 1.55, -4.0), 34], [Mn(16.3, 1.6, -2.4), Mn(15.4, 1.6, -4.0), 30]],
  w: () => ({ main: { bays: 1, benches: 4 }, mowers: { shop61: 30 } }), act: (k, A) => A('mia', Mn(15.4, 0, -4.0), { expr: 'smile', R: 'thumb', headTilt: 6 * Math.sin(k.lf * 0.2) }) });
shot(251, { set: 'main', light: 'shopD', note: 'That\u2019s Mia: slow push on her face; she gives up her own things first — a quick memory flash of little Mia with the camcorder', cam: [[Mn(16.1, 1.5, -2.6), Mn(15.4, 1.35, -4.0), 32], [Mn(15.85, 1.5, -3.05), Mn(15.4, 1.4, -4.0), 30]],
  w: () => ({ main: { bays: 1, benches: 4 }, mowers: { shop61: 30 } }), act: (k, A) => A('mia', Mn(15.4, 0, -4.0), { expr: 'soft', L: 'hang' }) });
shot(254, { set: 'main', light: 'shopD', note: 'Sam looks up at the cardboard sign above the door — BRING IT BROKEN, Mia\u2019s three words; tilt up', cam: [[Mn(16.6, 1.5, -3.0), Mn(16.3, 1.7, -0.2), 38], [Mn(16.4, 1.6, -2.3), Mn(16.3, 2.85, -0.12), 34]], focus: Mn(16.3, 2.85, -0.12),
  w: () => ({ main: { bays: 1, benches: 4 }, mowers: { shop61: 30 } }), act: (k, A) => A('sam', Mn(16.9, 0, -0.3), { expr: 'calm', look: 0.2 }) });
shot(256, { set: 'main', light: 'shopD', note: '"And he says no." — head shake; the buyer blinks', cam: [[Mn(16.8, 1.55, -1.6), Mn(15.2, 1.45, -3.4), 34], [Mn(16.6, 1.55, -1.9), Mn(15.2, 1.5, -3.4), 30]],
  w: () => ({ main: { bays: 1, benches: 4 }, mowers: { shop61: 30 } }), act: (k, A) => { A('sam', Mn(15.6, 0, -3.0), { expr: 'serious', headTilt: 9 * Math.sin(k.lf * 0.45), L: 'cross', R: 'cross' }); A('buyer', Mn(14.4, 0, -2.4), { expr: 'shock' }); } });
shot(257, { set: 'main', light: 'shopD', note: '"That\u2019s your sign. It\u2019s not for sale." — Sam to Mia; her eyes fill; push in', cam: [[Mn(17.2, 1.6, -2.2), Mn(15.6, 1.5, -4.0), 34], [Mn(16.7, 1.6, -2.7), Mn(15.6, 1.55, -4.0), 30]],
  w: () => ({ main: { bays: 1, benches: 4 }, mowers: { shop61: 30 } }), act: (k, A) => { A('sam', Mn(16.2, 0, -3.4), { expr: 'soft', R: 'point', L: 'hang' }); A('mia', Mn(15.2, 0, -4.2), { expr: 'teary', tears: (k.lf * 0.04) % 1, L: 'cheek' }); } });
shot(259, { set: 'main', light: 'golden', tag: 'DAY 90', flash: 0.4, note: 'By day 90 the "no" looks smart: the forecourt packed with customers and cars at golden hour', cam: [[Mn(6, 3, 16), Mn(19, 1.2, 0), 44], [Mn(11, 2.2, 11), Mn(20, 1.2, -1), 40]],
  w: () => ({ main: { bays: 1, benches: 4, pole: 'old' }, mowers: { shop61: 30 } }),
  act: (k, A) => { A('custA', Mn(17, 0, 4.6), { expr: 'happy', R: 'reach', lift: -0.4 }); A('custB', Mn(21, 0, 5.2), { expr: 'smile', R: 'wave', wv: k.lf * 0.3 }); A('custC', Mn(14, 0, 3.6), { expr: 'happy' }); } });
shot(260, { set: 'main', light: 'shopD', note: 'The counter: one week\u2019s take on the whiteboard vs. Ray\u2019s two months — Ray grins at the register', cam: [[Mn(16.0, 1.5, -1.8), Mn(14.5, 1.3, -3.4), 36], [Mn(15.6, 1.5, -2.2), Mn(14.5, 1.35, -3.4), 32]],
  w: () => ({ main: { bays: 1, benches: 4, cash1: 1 }, mowers: { shop61: 30 } }),
  act: (k, A) => A('rayShop', Mn(14.5, 0, -4.0), { expr: 'beam', R: 'hold', prop: 'tips' }),
  fx: (k, FX, pop, T) => { if (k.lf > k.w(260, 7)) FX('wk' + q(Math.min(1, (k.lf - k.w(260, 7)) / 10), 2), (p) => T.fxBig(p, '1 WEEK > 2 MONTHS', Math.min(1, (k.lf - k.w(260, 7)) / 10), '#8ac06a'), Mn(14.6, 2.3, -3.6), 0.5); } });

// =============================== DAY 100 ===============================
shot(261, { set: 'main', light: 'day', flash: true, title: 'DAY 100', sub: 'MAIN STREET', titleLen: 50, note: 'CHAPTER: bright morning on Main Street, crane down to the shop', cam: [[Mn(0, 12, 30), Mn(19, 3, 0), 46], [Mn(8, 4, 20), Mn(19, 3.6, 0), 42]],
  w: () => ({ main: { bays: 0, newSign: 0, pole: 'old' } }) });
shot(262, { set: 'main', light: 'day', note: 'The new sign rises into place — DAY ONE SMALL ENGINES · BRING IT BROKEN; the pole sign flips; family cheers below', cam: [[Mn(14, 1.4, 12), Mn(19.5, 3.8, 0), 42], [Mn(16, 1.6, 10), Mn(19.5, 4.6, 0), 40]],
  w: (k) => ({ main: { bays: 1, benches: 4, newSign: bk(k.r(6, 50), 1.4), pole: k.lf > k.w(263) ? 'new' : 'old' } }),
  act: (k, A) => { const c = k.lf > k.w(263); A('sam', Mn(18.0, 0, 3.4), { expr: c ? 'yay' : 'hopeful', L: c ? 'up' : 'hang', R: c ? 'up' : 'hang' }); A('mia', Mn(16.8, 0, 3.8), { expr: c ? 'happy' : 'smile', R: 'tele', prop: 'phoneUp' }); A('rayShop', Mn(19.4, 0, 3.6), { expr: c ? 'laugh' : 'smile', L: 'hip' }); A('lindaHome', Mn(20.4, 0, 4.0), { expr: c ? 'cheer' : 'smile', L: c ? 'up' : 'hang' }); },
  fx: (k, FX, pop, T) => { if (k.lf > k.w(264)) FX('cf' + q((k.lf * 0.025) % 1, 2), (p) => T.fxConfetti(p, (k.lf * 0.025) % 1, 5), Mn(18.6, 3.0, 3.6), 1.0); } });
shot(265, { set: 'main', light: 'shopD', note: 'Ray works the front counter in his shop apron — never lifts a box again (a kid wheels the boxes for him)', cam: [[Mn(16.2, 1.6, -1.4), Mn(14.5, 1.4, -3.6), 38], [Mn(15.8, 1.6, -1.9), Mn(14.4, 1.45, -3.6), 34]],
  w: () => ({ main: { bays: 1, benches: 4, newSign: 1, pole: 'new', cash1: 1 }, mowers: { shop61: 20 } }),
  act: (k, A) => { A('rayShop', Mn(14.5, 0, -4.0), { expr: 'beam', R: 'hold', prop: 'mug' }); A('custC', Mn(15.6, 0, -2.4), { expr: 'happy', R: 'offer', prop: 'tips' }); A('kidA', Mn(12.8, 0, -4.8), { expr: 'happy', L: 'belly', R: 'belly', prop: 'box', propAt: [0, 300] }); } });
shot(267, { set: 'main', light: 'golden', note: 'Linda walks into the diner one last time — tracking with her along the sidewalk to the door', cam: [[Mn(-8, 1.6, 9.5), Mn(-11, 1.3, 5), 40], [Mn(-12.5, 1.6, 9.5), Mn(-14.4, 1.4, 4.5), 38]],
  w: (k) => ({ main: { newSign: 1, pole: 'new', dinerDoor: smooth(k.r(k.n * 0.7, k.n)) } }),
  act: (k, A) => { const W_ = walkP(k, Mn(-9, 0, 6.5), Mn(-14.0, 0, 4.9), 0, k.n * 0.85); A('linda', W_.pos, { expr: 'calm', step: W_.step }); } });
shot(268, { set: 'main', light: 'diner', note: 'She hangs up her apron on the hook — no more double shifts. Ever. Co-workers clap; she unties it and smiles', cam: [[Mn(-12.6, 1.6, -2.4), Mn(-11.2, 1.4, -5.3), 38], [Mn(-12.2, 1.6, -3.0), Mn(-11.1, 1.45, -5.3), 34]],
  w: (k) => ({ main: { newSign: 1, apron: k.lf > k.w(268, 3) } }), focus: Mn(-11.3, 1.4, -5.2),
  act: (k, A) => { const off = k.lf > k.w(268, 3); A(off ? 'lindaOff' : 'linda', Mn(-11.6, 0, -4.6), { expr: off ? (k.lf > k.w(270) ? 'beam' : 'teary') : 'calm', R: off ? 'hang' : 'reach', lift: 0.4, L: 'hang' }); A('nurse', Mn(-14.0, 0, -3.4), { expr: 'happy', L: 'up', R: 'up' }, { s: 0.96 }); } });
shot(271, { set: 'main', light: 'golden', note: 'Sam kept his promise: Linda walks out into the sunset street and hugs him', cam: [[Mn(-9.5, 1.5, 9.8), Mn(-13, 1.4, 5.8), 38], [Mn(-10.5, 1.55, 8.4), Mn(-13, 1.5, 5.8), 32]], lmod: { rimI: 1.8 },
  act: (k, A) => { A('lindaOff', Mn(-13.4, 0, 5.9), { expr: 'beam', L: 'reach', R: 'reach', lift: 0.1 }); A('sam', Mn(-12.6, 0, 6.1), { expr: 'soft', R: 'reach', lift: 0.1 }); } });

// =============================== FOR MIA ===============================
shot(272, { set: 'kit', light: 'kitN', flash: 0.4, note: 'That night: Sam reaches up and takes the old pickle jar off the shelf', cam: [[K(-0.8, 1.55, 1.2), K(-2.6, 1.5, -0.6), 38], [K(-1.2, 1.6, 0.6), K(-2.7, 1.55, -0.7), 34]],
  w: (k) => ({ kit: { ...jarAt(lerp3(SHELF, [-2.2, 1.15, -0.35], smooth(k.r(k.n * 0.4, k.n * 0.8))), 0.03, 'FOR SAM') } }),
  act: (k, A) => A('sam', K(-2.0, 0, -0.1), { expr: 'soft', R: k.t > 0.4 ? 'hold' : 'reach', lift: 0.8 }) });
shot(273, { set: 'kit', light: 'kitN', note: 'Insert: he drops in the first dollar the new shop ever earned (it flutters in, sparkle)', cam: [[K(0.3, 1.25, 0.75), K(-0.25, 0.9, 0.1), 32], [K(0.05, 1.3, 0.45), K(-0.25, 0.95, 0.1), 28]],
  w: (k) => ({ kit: { ...jarAt(TBL, k.lf > 40 ? 0.08 : 0.03, 'FOR SAM') } }),
  fx: (k, FX, pop, T) => { if (k.lf < 40) FX('d' + q(k.lf / 40, 2), (p) => T.fxCash(p, k.lf * 0.15), K(-0.25, 1.45 - 0.5 * eo(k.lf / 40), 0.1), 0.07); pop('sp', T.fxSparkle, K(-0.2, 1.05, 0.15), 0.12, 40, 18); } });
shot(274, { set: 'kit', light: 'kitN', note: 'He tapes Mia\u2019s old film-school envelope inside the lid', cam: [[K(0.2, 1.35, 0.55), K(-0.25, 0.98, 0.1), 32], [K(0.0, 1.38, 0.35), K(-0.25, 1.0, 0.1), 28]],
  w: (k) => ({ kit: { ...jarAt(TBL, 0.08, '', { env: k.t > 0.35 }) } }), act: (k, A) => A('sam', K(-0.25, 0, -0.75), { expr: 'focus', R: 'hold', prop: 'envelope', old: true, propDX: -10 }) });
shot(275, { set: 'kit', light: 'kitN', note: 'And on top, in marker: FOR MIA (written letter by letter)', cam: [[K(-0.25, 1.42, 0.32), K(-0.25, 1.02, 0.1), 30], [K(-0.25, 1.32, 0.22), K(-0.25, 1.02, 0.1), 26]], cinf: 4, focus: K(-0.25, 1.02, 0.1),
  w: (k) => { const n = Math.floor(clamp((k.lf - k.w(276) + 10) / 18) * 7); return { kit: { ...jarAt(TBL, 0.08, 'FOR MIA'.slice(0, n), { env: 1 }) } }; } });
shot(277, { set: 'kit', light: 'kitN', note: 'Mia says nothing — she lifts Dad\u2019s old camcorder, points it at Sam and presses record', cam: [[K(1.4, 1.5, 1.4), K(0.0, 1.35, -0.2), 38], [K(1.0, 1.5, 1.1), K(0.2, 1.4, -0.2), 34]],
  w: () => ({ kit: { ...jarAt(TBL, 0.08, 'FOR MIA', { env: 1 }) } }),
  act: (k, A) => { const rec = k.lf > k.w(278, 3); A('mia', K(0.9, 0, -0.4), { expr: rec ? 'teary' : 'soft', R: rec ? 'tele' : 'hold', prop: 'camcorder', propDX: rec ? 0 : 8 }); A('sam', K(-0.7, 0, -0.5), { expr: 'smile', L: 'hold', R: 'hang' }); } });
shot(279, { noFix: true, set: 'hosp', light: 'hosp', vf: 'cam', vfText: 'MAR 14  10:58 PM', flash: 0.6, note: 'Just like Day 0: a flash of the hospital viewfinder shot, the same REC frame on baby Sam', cam: [[Hp(1.0, 0.85, 0.1), Hp(-0.05, 0.75, -0.92), 28], [Hp(0.85, 0.88, -0.1), Hp(-0.05, 0.78, -0.92), 24]], hand: 3,
  act: (k, A, C, T) => { A('lindaOff', Hp(-0.1, 0.2, -1.0), { sit: 1, expr: 'smile', L: 'hold', R: 'hold' }); C('baby', (p) => T.babyCard(p, { sleep: 0 }), Hp(-0.05, 0.62, -0.92), 0.36); } });
shot(280, { set: 'kit', light: 'kitN', vf: 'cam', vfText: 'DAY 100', note: '...and back: the same viewfinder on Sam at the table with the jar; then pull back wide — the family together, not rich, not yet', cam: [[K(0.6, 1.35, 0.4), K(-0.6, 1.3, -0.5), 30], [K(1.9, 1.8, 2.0), K(-0.2, 1.1, -0.3), 44]],
  w: () => ({ kit: { ...jarAt(TBL, 0.08, 'FOR MIA', { env: 1 }), mug: 1 } }),
  act: (k, A) => { A('sam', K(-0.6, 0, -0.5), { expr: 'smile', L: 'hold' }); if (k.t > 0.3) { A('lindaOff', K(-1.4, 0, 0.1), { expr: 'beam' }); A('rayShop', K(0.3, 0, -1.1), { expr: 'smile', L: 'hip' }); A('mia', K(0.9, 0, -0.4), { expr: 'happy', R: 'tele', prop: 'camcorder' }); } } });

// =============================== DAY 101: THE LETTER ===============================
shot(282, { set: 'main', light: 'dawn', tag: 'DAY 101', flash: 0.5, note: 'Next morning on Main Street: another letter taped to the shop\u2019s glass door; slow push', cam: [[Mn(18, 1.6, 9), Mn(16.27, 1.5, 0), 38], [Mn(16.5, 1.55, 1.9), Mn(16.27, 1.45, 0), 34]],
  w: () => ({ main: { bays: 0, benches: 4, newSign: 1, pole: 'new' }, paper: { pos: Mn(16.27, 1.45, 0.09), rot: [0, 0, -0.03], kind: 'hardware' } }) });
shot(283, { set: 'main', light: 'dawn', note: 'Insert: the letterhead — HARDWARE COMPANY · LEGAL DEPARTMENT · RE: "BRING IT BROKEN"', cam: [[Mn(16.27, 1.62, 0.6), Mn(16.27, 1.55, 0.09), 30], [Mn(16.27, 1.6, 0.45), Mn(16.27, 1.55, 0.09), 26]], cinf: 3, focus: Mn(16.27, 1.5, 0.1),
  w: () => ({ main: { newSign: 1, pole: 'new' }, paper: { pos: Mn(16.27, 1.45, 0.09), rot: [0, 0, -0.03], kind: 'hardware' } }) });
shot(284, { set: 'main', light: 'dawn', note: 'Push down the page to NOT AN OFFER — sting, slow roll', cam: [[Mn(16.27, 1.5, 0.45), Mn(16.27, 1.42, 0.09), 26, 0], [Mn(16.27, 1.38, 0.33), Mn(16.27, 1.36, 0.09), 22, -4]], cinf: 3, focus: Mn(16.27, 1.38, 0.1), kicks: [[8, 0.35]],
  w: () => ({ main: { newSign: 1, pole: 'new' }, paper: { pos: Mn(16.27, 1.45, 0.09), rot: [0, 0, -0.03], kind: 'hardware' } }), lmod: { sat: 0.9, vig: 0.42 } });
shot(285, { set: 'main', light: 'day', flash: 0.4, note: 'ENDING: Sam to camera in front of the shop, the letter in one hand — "Want to know what was in that letter?" — then up comes a hand-drawn SUBSCRIBE sign with a bell; he waves: "see you in part two"', lead: 10,
  cam: [[Mn(16.95, 1.55, 4.9), Mn(16.95, 1.45, 1.4), 38], [Mn(16.95, 1.55, 4.4), Mn(16.95, 1.5, 1.4), 36]], focus: Mn(16.6, 1.5, 1.4), cinf: 3, noFix: true,
  w: () => ({ main: { bays: 0, benches: 4, newSign: 1, pole: 'new' } }),
  act: (k, A) => { const sub = k.lf > k.w(286) - 6, bye = k.lf > k.w(286, 3); A('sam', Mn(16.45, 0, 1.4), { expr: sub ? 'grin' : 'smirk', look: 0, L: bye ? 'wave' : 'hang', wv: k.lf * 0.5, R: sub ? 'point' : 'hold', prop: sub ? null : 'letter' }); },
  fx: (k, FX, pop, T) => { const t0 = k.w(286) - 6; if (k.lf >= t0) { const t = q(Math.min(1, (k.lf - t0) / 12), 2); FX('subS' + t, (p) => T.subSign(p, t), Mn(17.4, 1.55 + 0.02 * Math.sin(k.lf * 0.15), 1.45), 0.78); } } });
