// Shots 2/3: Day 5 → Day 53 (the business, the theft, the viral video, Bring it broken, the stolen mower).
import { shot, smooth, eo, bk, clamp, lerp, lerp3, q, pulse, walkP } from './story_core.js';
import { H, K, G, Mn, jarAt } from './story_shots1.js';
const SHELF = [-2.84, 1.585, -0.75], TBL = [-0.25, 0.768, 0.1];

// =============================== DAY 5 / DAY 10 ===============================
shot(87, { set: 'house', light: 'day', tag: 'DAY 5', flash: 0.4, note: 'Driveway sale: a customer hands Sam $120 cash, rolls the red mower away; cash flutters', cam: [[H(9.6, 1.5, 9.5), H(6.2, 1.0, 4.5), 40], [H(8.6, 1.4, 8.4), H(6.0, 1.05, 4.6), 36]],
  w: (k) => ({ garOpen: 1, mowers: { man1: 1 }, mpos: { man1: lerp3([6.3, 0, 5.0], [7.4, 0, 6.6], smooth(k.r(k.n * 0.6, k.n))) }, mrot: { man1: 0.6 } }),
  act: (k, A) => { A('sam', H(5.3, 0, 4.6), { expr: k.lf > k.w(88, 5) ? 'yay' : 'smile', R: k.lf > k.w(88, 5) ? 'hold' : 'offer', prop: k.lf > k.w(88, 5) ? 'tips' : null }); A('custB', lerp3(H(6.9, 0, 5.4), H(8.0, 0, 7.0), smooth(k.r(k.n * 0.6, k.n))), { expr: 'happy', R: k.lf < k.w(88, 5) ? 'offer' : 'hang', prop: k.lf < k.w(88, 5) ? 'tips' : null }); },
  fx: (k, FX, pop, T) => { for (let i = 0; i < 3; i++) pop('c' + i, (p, t) => T.fxCash(p, t * 3 + i), H(5.7 + i * 0.15, 1.6 + i * 0.1, 4.9), 0.08, k.w(88, 5) + i * 4, 24); } });
shot(89, { set: 'gar', light: 'garD', note: 'Insert on the bench: one spark plug with an $8 tag next to the jar — his only cost', cam: [[G(-0.1, 1.25, -2.2), G(-0.3, 0.95, -2.85), 30], [G(-0.25, 1.15, -2.4), G(-0.32, 0.95, -2.85), 26]], focus: G(-0.3, 0.96, -2.82), cinf: 6,
  w: () => ({ gar: { open: 1, board: { mode: 'fix' } }, mowers: { garIn: 2 } }),
  act: (k, A) => A('sam', G(0.6, 0, -2.4), { expr: 'smile', R: 'pointDown' }) });
shot(90, { set: 'gar', light: 'garD', tag: 'DAY 10', flash: 0.4, note: 'Whiteboard tally: Sam adds the fifth stroke and writes JAR $490 with a marker', cam: [[G(0.6, 1.55, 0.4), G(2.97, 1.5, -0.6), 40], [G(1.4, 1.55, 0.1), G(2.97, 1.5, -0.6), 34]],
  w: (k) => ({ gar: { open: 1, board: { mode: 'tally', sold: k.lf > k.w(91) ? 5 : 4, jar: k.lf > k.w(92) ? 490 : 370, left: 21 } }, mowers: { garIn: 3 } }), focus: G(2.97, 1.5, -0.6),
  act: (k, A) => A('sam', G(2.2, 0, 0.6), { expr: 'proud', R: 'point', prop: 'marker' }) });
shot(93, { set: 'kit', light: 'kitD', note: 'Kitchen calendar: days crossed out, RENT circled in red — twenty-one days left; push in', cam: [[K(-1.3, 1.55, 0.6), K(-2.97, 1.5, 0.9), 36], [K(-2.1, 1.52, 0.75), K(-2.97, 1.5, 0.9), 32]], focus: K(-2.97, 1.5, 0.9),
  w: (k) => ({ kit: { ...jarAt(SHELF, 0.22, 'FOR SAM'), cal: { month: 'APRIL', off: 2, crossed: k.lf > 20 ? 10 : 9, due: 31 } } }) });
shot(94, { set: 'gar', light: 'garD', note: 'The hard part: an empty garage floor — Sam scratches his head; a question mark pops', cam: [[G(1.8, 1.6, 2.8), G(-0.3, 0.8, -1.5), 44], [G(1.2, 1.4, 1.8), G(-0.3, 1.0, -1.5), 40]],
  w: () => ({ gar: { open: 1, hero: false } }), act: (k, A) => A('sam', G(-0.3, 0, -1.2), { expr: 'puzzled', R: 'temple', swirl: k.lf * 0.2 }),
  fx: (k, FX, pop, T) => { if (k.lf > 30) FX('q' + q(Math.min(1, (k.lf - 30) / 8), 2), (p) => T.fxQ(p, Math.min(1, (k.lf - 30) / 8)), G(0.1, 2.15, -1.2), 0.2); } });

// =============================== DAY 11: DOOR TO DOOR ===============================
shot(96, { set: 'house', light: 'day', tag: 'DAY 11', flash: 0.4, note: 'Door-to-door montage: Sam marches house to house; a counter ticks up to 41', ease: 'lin', ov: (k) => ({ count: 'DOORS: ' + Math.min(41, Math.round(1 + 40 * k.t)), col: '#ffffff' }),
  w: () => ({ noParked: 1 }), cam: (k) => { const x = lerp(-50, -20, k.t); return { pos: [x + 1, 1.6, 16], look: [x - 2, 1.0, 3], fov: 42 }; },
  act: (k, A) => { const x = lerp(-51, -21, k.t), ph = (k.t * 4) % 1, onPath = ph > 0.3 && ph < 0.8; A('sam', [x - 2, 0, onPath ? lerp(10, 2.4, Math.sin((ph - 0.3) / 0.5 * Math.PI)) : 10.5], { expr: 'happy', step: q((k.lf / 10) % 1, 2), R: ph > 0.5 && ph < 0.6 ? 'fist' : 'hang' }); } });
shot(99, { set: 'house', light: 'day', note: 'Doorstep: Sam\u2019s pitch to an old lady in a cardigan — "Got a mower that won\u2019t start? I\u2019ll take it off your hands for free."', cam: [[H(-44.5, 1.55, 6.0), H(-47.5, 1.4, 1.2), 38], [H(-45.3, 1.55, 5.0), H(-47.7, 1.45, 1.2), 34]],
  act: (k, A) => { A('sam', H(-46.9, 0, 2.6), { expr: 'grin', R: 'offer', L: 'hang' }); A('custC', H(-48.3, 0, 1.4), { expr: 'puzzled', L: 'cross', R: 'cross' }); } });
shot(101, { set: 'house', light: 'day', note: 'Most say no (door shuts in his face, kick); seven say yes — he wheels mowers away, YES x7 tally', cam: [[H(-25, 1.55, 6.5), H(-26, 1.3, 1.0), 38], [H(-23, 1.6, 7.5), H(-24.6, 1.1, 2.0), 40]], kicks: [[14, 0.5]],
  ov: (k) => k.lf > k.w(102) - 6 ? { count: 'YES: 7', col: '#8ac06a' } : { count: 'NO  NO  NO', col: '#e85a4a' },
  w: (k) => ({ mowers: k.lf > k.w(102) - 6 ? { man1: 1 } : {}, mpos: { man1: [-24.2, 0, lerp(2.8, 5.5, smooth(k.r(k.w(102), k.n)))] } }),
  act: (k, A) => { const yes = k.lf > k.w(102) - 6; A('sam', yes ? H(-24.6, 0, lerp(3.6, 6.2, smooth(k.r(k.w(102), k.n)))) : H(-25.6, 0, 2.6), { expr: yes ? 'yay' : 'sad', R: yes ? 'reach' : 'hang', lift: -0.3, step: yes ? q((k.lf / 10) % 1, 2) : 0 });
    if (!yes) A('custB', H(-26.9, 0, 1.3), { expr: 'stern', headTilt: 8 * Math.sin(k.lf * 0.4), L: 'cross', R: 'cross' }); } });
shot(103, { set: 'house', light: 'golden', note: 'Mr. Hollis (bald, glasses, white moustache, cardigan) in his driveway gives Sam a mower AND his old utility trailer', cam: [[H(38.5, 1.6, 10.5), H(35, 1.1, 4.8), 40], [H(37.6, 1.55, 9.2), H(34.8, 1.15, 5.0), 36]],
  w: () => ({ trailer: 1, trailerPos: [36.4, 0, 4.0], trailerRy: Math.PI, mowers: { man1: 1 }, mpos: { man1: [34.2, 0, 6.2] }, mrot: { man1: 0.5 } }),
  act: (k, A) => { A('hollis', H(33.6, 0, 5.4), { expr: 'smile', R: k.lf > k.n * 0.5 ? 'offer' : 'thumb', prop: k.lf > k.n * 0.5 ? 'keys' : null }); A('sam', H(35.0, 0, 7.0), { expr: k.lf > k.n * 0.5 ? 'wow' : 'happy', L: 'hang' }); } });
shot(104, { set: 'house', light: 'golden', note: 'Hollis close-up: "Haven\u2019t used either since I sold my farm" — thumb over his shoulder at the trailer', cam: [[H(35.0, 1.6, 8.2), H(33.6, 1.55, 5.4), 36], [H(34.6, 1.62, 7.6), H(33.6, 1.6, 5.4), 32]],
  w: () => ({ trailer: 1, trailerPos: [36.4, 0, 4.0], trailerRy: Math.PI }), act: (k, A) => A('hollis', H(33.6, 0, 5.4), { expr: 'calm', R: 'thumb', L: 'hang' }) });
shot(105, { set: 'house', light: 'golden', note: 'Now he can haul five at a time: Sam pulls the trailer (5 mowers) down the street by the tongue, grinning', cam: [[H(14, 1.3, 19.5), H(16, 0.9, 16), 40], [H(4, 1.5, 19.8), H(5, 0.9, 16), 40]],
  w: (k) => { const x = lerp(20, 5, k.t); return { trailer: 1, trailerPos: [x, 0, 16.3], trailerRy: -Math.PI / 2, mowers: { trailer: 5 } }; },
  act: (k, A) => { const x = lerp(20, 5, k.t); A('sam', H(x - 2.9, 0, 16.3), { expr: 'grin', L: 'reach', R: 'reach', lift: -0.4, step: q((k.lf / 12) % 1, 2) }); } });

// =============================== DAY 18: RAY LISTENS ===============================
shot(106, { set: 'gar', light: 'garN', tag: 'DAY 18  \u2022  MIDNIGHT', flash: 0.4, note: 'Midnight garage under one bulb: Sam hunched over a dead engine; Ray limps in through the door', cam: [[G(2.2, 1.7, 2.6), G(-0.4, 1.0, -1.6), 44], [G(1.6, 1.5, 1.8), G(-0.1, 1.0, -1.4), 40]],
  w: () => ({ gar: { open: 0.15, out: 'night', heroPos: [0.0, 0, -2.0] }, mowers: { garIn: 4 } }),
  act: (k, A) => { A('sam', G(-0.8, 0, -2.0), { expr: 'tired', R: 'hold', prop: 'wrench' }); const W_ = walkP(k, G(1.9, 0, 2.9), G(1.0, 0, -0.6), k.w(108), k.n, 0.4); A('ray', W_.pos, { expr: 'pained', step: W_.step, tilt: 3 * Math.sin(k.lf * 0.25), L: 'calf' }); } });
shot(109, { set: 'gar', light: 'garN', note: 'He says nothing; just listens — hand cupped at his ear, eyes closed; the engine sputters', cam: [[G(2.2, 1.55, 1.5), G(0.0, 1.25, -1.3), 40], [G(1.9, 1.5, 1.1), G(0.1, 1.3, -1.2), 36]],
  w: (k) => ({ gar: { open: 0.15, out: 'night', heroPos: [0.0, 0, -2.0], shake: 0.25 * (Math.sin(k.lf * 0.3) > 0.4 ? 1 : 0) }, mowers: { garIn: 4 } }), focus: G(0.6, 1.55, -0.6),
  act: (k, A) => { A('ray', G(0.6, 0, -0.6), { expr: 'calm', closed: true, R: 'cheek', L: 'hang' }); A('sam', G(-0.8, 0, -2.0), { expr: 'frown', R: 'hold', prop: 'wrench' }); },
  fx: (k, FX, pop, T) => { pop('p1', T.fxPuff, G(0.0, 0.6, -1.9), 0.12, 10, 14); pop('p2', T.fxPuff, G(0.1, 0.6, -1.9), 0.12, 40, 14); pop('p3', T.fxPuff, G(0.0, 0.6, -1.9), 0.12, 70, 14); } });
shot(111, { set: 'gar', light: 'garN', note: 'Ray points: "Your float\u2019s stuck. Tap the bowl." — push past his finger to the carb bowl', cam: [[G(-0.4, 1.55, 1.9), G(0.0, 1.1, -1.5), 42], [G(-0.25, 1.4, 1.2), G(0.0, 0.9, -1.7), 38]], noFix: true,
  w: () => ({ gar: { open: 0.15, out: 'night', heroPos: [0.0, 0, -2.0] }, mowers: { garIn: 4 } }), focus: (k) => k.t < 0.5 ? G(1.0, 1.5, -0.9) : G(0.0, 0.45, -2.0),
  act: (k, A) => { A('ray', G(1.0, 0, -0.9), { expr: 'serious', R: 'point', L: 'hang' }); A('sam', G(-1.15, 0, -2.2), { expr: 'puzzled', R: 'hold', prop: 'wrench' }); } });
shot(114, { set: 'gar', light: 'garN', note: 'Tap, tap — the engine catches: shake, smoke ring, Sam\u2019s jaw drops, Ray\u2019s small nod', cam: [[G(0.5, 1.3, 0.0), G(-0.2, 0.85, -2.0), 38], [G(0.9, 1.45, 0.8), G(0.0, 1.0, -1.7), 42]], kicks: [[20, 0.6]],
  w: (k) => ({ gar: { open: 0.15, out: 'night', heroPos: [0.0, 0, -2.0], shake: k.lf > 20 ? 1 : 0, tap: k.lf < 20 }, mowers: { garIn: 4 } }),
  act: (k, A) => { A('sam', G(-0.75, 0, -2.0), { expr: k.lf > 20 ? 'wow' : 'focus', R: k.lf < 20 ? 'reach' : 'cheek', L: k.lf > 20 ? 'cheek' : 'hang', prop: k.lf < 20 ? 'wrench' : null, lift: -0.4 }); A('ray', G(1.15, 0, -1.5), { expr: k.lf > 26 ? 'smug' : 'calm', L: 'cross', R: 'cross' }); },
  fx: (k, FX, pop, T) => { pop('rg', T.fxRing2, G(0.0, 0.6, -1.9), 0.18, 20, 18); if (k.lf > 20) { const t = ((k.lf - 20) / 22) % 1; FX('sm' + q(t, 2), (p) => T.fxSmoke(p, t, '#c8c4bc'), G(0.25 + t * 0.2, 0.55 + t * 0.6, -1.8), 0.22); } } });
shot(116, { set: 'gar', light: 'memory', flash: 0.5, note: 'Push into the old photo on the garage wall: young Ray on his uncle\u2019s tractor (sepia memory grade)', cam: [[G(1.4, 1.55, 1.5), G(2.96, 1.55, 1.75), 34], [G(2.45, 1.55, 1.72), G(2.96, 1.55, 1.75), 30]], focus: G(2.96, 1.55, 1.75),
  w: () => ({ gar: { open: 0.15, out: 'night', heroPos: [0.0, 0, -2.0] } }), lmod: { sunI: 0.6, hemi: 1.0 } });
shot(118, { set: 'gar', light: 'garN', note: 'The new team: Ray on the stool listening, Sam doing the lifting; slow orbit around them', cam: [[G(1.8, 1.5, 0.9), G(-0.8, 1.0, -1.8), 40], [G(-0.2, 1.6, 1.5), G(-0.9, 1.0, -1.8), 40], [G(-2.2, 1.5, 0.6), G(-0.6, 1.0, -1.8), 40]],
  w: () => ({ gar: { open: 0.15, out: 'night', heroPos: [0.0, 0, -2.0] }, mowers: { garIn: 4 } }),
  act: (k, A) => { A('ray', G(-1.9, 0, -1.6), { sit: 1, expr: 'calm', R: 'cheek', closed: k.lf % 90 < 50 }, { dy: 0.2 }); A('sam', G(0.6, 0, -2.2), { expr: 'focus', R: 'hold', prop: 'wrench', L: 'hold' }); } });

// =============================== DAY 29: THE RENT ===============================
shot(120, { set: 'kit', light: 'kitD', tag: 'DAY 29', flash: 0.4, note: 'Sam tips the jar onto the kitchen table — a landslide of bills; the total counts up to $2,460', cam: [[K(1.2, 1.6, 1.4), K(-0.1, 0.8, 0.1), 40], [K(0.55, 1.25, 0.75), K(0.0, 0.82, 0.1), 32]],
  w: (k) => ({ kit: { cash: k.lf > 20, ...jarAt([-0.45, 0.768, -0.1], k.lf > 20 ? 0.02 : 0.9, 'FOR SAM') } }),
  act: (k, A) => A('sam', K(-0.7, 0, -0.65), { expr: k.lf > k.w(122) ? 'wow' : 'focus', R: 'hold', L: 'hold' }),
  fx: (k, FX, pop, T) => { if (k.lf > k.w(122) - 4) FX('n' + q(Math.min(1, (k.lf - k.w(122) + 4) / 10), 2) + Math.round(lerp(43, 2460, smooth(Math.min(1, (k.lf - k.w(122) + 4) / 40)))), (p) => T.fxBig(p, '$' + Math.round(lerp(43, 2460, smooth(Math.min(1, (k.lf - k.w(122) + 4) / 40)))).toLocaleString('en-US'), Math.min(1, (k.lf - k.w(122) + 4) / 10), '#8ac06a'), K(0.1, 1.15, 0.1), 0.2);
    for (let i = 0; i < 5; i++) pop('fl' + i, (p, t) => T.fxCash(p, t * 4 + i), K(-0.3 + i * 0.12, 1.0 - 0.2 * i % 3 * 0.05, 0.1), 0.06, 14 + i * 3, 20); } });
shot(123, { set: 'main', light: 'office', flash: 0.4, note: 'Landlord\u2019s office: Sam sets stacks of cash on the desk — every cent; the landlord\u2019s eyebrows; TWO DAYS EARLY on screen', cam: [[Mn(-5.8, 1.7, 4.2), Mn(-4.7, 1.15, 1.0), 46], [Mn(-5.2, 1.6, 3.8), Mn(-4.6, 1.1, 1.0), 44]],
  w: () => ({ main: { deskCash: 1 } }), ov: (k) => k.lf > k.w(124) - 4 ? { count: 'PAID \u2014 2 DAYS EARLY', col: '#8ac06a' } : null,
  act: (k, A) => { A('landlord', Mn(-5.0, 0, 0.55), { expr: k.lf > 40 ? 'wow' : 'stern', L: 'hang', R: 'hang' }); A('sam', Mn(-4.1, 0, 2.0), { expr: 'proud', R: 'offer', L: 'hang' }); } });
shot(125, { set: 'main', light: 'day', note: 'Parking lot: Linda breaks down crying and hugs Sam; Mia films the whole thing with her phone', cam: [[Mn(6.8, 1.6, 4.2), Mn(3.6, 1.2, -0.6), 40], [Mn(6.0, 1.55, 3.0), Mn(3.6, 1.25, -0.6), 36]],
  act: (k, A) => { A('linda', Mn(3.2, 0, -0.4), { expr: 'cry', tears: (k.lf * 0.05) % 1, L: 'reach', R: 'reach', lift: 0.1 }); A('sam', Mn(3.9, 0, -0.3), { expr: 'teary', L: 'reach', R: 'hang' }); A('mia', Mn(5.6, 0, 1.0), { expr: 'teary', R: 'tele', prop: 'phoneUp' }); } });
shot(127, { set: 'main', light: 'day', vf: 'phone', vfText: 'DAY 29', note: 'Mia\u2019s phone POV: REC frame on Mom crying — "Remember that video."', cam: [[Mn(6.0, 1.6, 1.8), Mn(3.5, 1.35, -0.4), 34], [Mn(5.7, 1.6, 1.5), Mn(3.5, 1.4, -0.4), 31]], hand: 3,
  act: (k, A) => { A('linda', Mn(3.2, 0, -0.4), { expr: 'cry', tears: (k.lf * 0.05) % 1, L: 'reach', R: 'reach', lift: 0.1 }); A('sam', Mn(3.9, 0, -0.3), { expr: 'teary', L: 'reach' }); } });
shot(129, { set: 'gar', light: 'garD', note: 'For one week every dollar goes into parts: boxes on the bench, cash fluttering into a parts box; Ray checks the list', cam: [[G(-1.4, 1.5, 0.6), G(0.0, 1.0, -3.0), 40], [G(-0.5, 1.4, 0.0), G(0.3, 1.0, -3.0), 36]],
  w: () => ({ gar: { open: 1, board: { mode: 'tally', sold: 11, jar: 0, left: 0 } }, mowers: { garIn: 6 } }),
  act: (k, A) => { A('sam', G(0.7, 0, -2.4), { expr: 'happy', R: 'hold', prop: 'box', propAt: [0, 300] }); A('ray', G(-1.0, 0, -2.2), { expr: 'calm', R: 'hold', prop: 'notebook' }); },
  fx: (k, FX, pop, T) => { for (let i = 0; i < 4; i++) pop('c' + i, (p, t) => T.fxCash(p, t * 3 + i), G(0.4 + i * 0.1, 1.6 - 0.05 * i, -2.3), 0.07, i * 12, 24); } });
shot(130, { set: 'house', light: 'golden', tag: 'DAY 36', note: 'Golden dusk: eleven mowers strapped on the trailer; Sam pulls the last strap tight', cam: [[H(9.5, 1.6, 11), H(6, 0.9, 5), 40], [H(8.8, 1.5, 9.8), H(6, 0.9, 5.2), 36]],
  w: () => ({ trailer: 1, mowers: { trailer: 11 } }), act: (k, A) => A('sam', H(7.3, 0, 7.4), { expr: 'proud', R: 'reach', L: 'hip', lift: -0.2 }) });
shot(131, { set: 'house', light: 'golden', note: 'Slow dolly along the loaded trailer — about $1,500 of mowers right before peak season', cam: [[H(8.6, 1.3, 2.4), H(6, 0.8, 4.4), 36], [H(8.6, 1.4, 7.6), H(6, 0.8, 6.0), 36]],
  w: () => ({ trailer: 1, mowers: { trailer: 11 } }),
  fx: (k, FX, pop, T) => { if (k.lf > 20) FX('n1500' + q(Math.min(1, (k.lf - 20) / 10), 2), (p) => T.fxBig(p, '$1,500', Math.min(1, (k.lf - 20) / 10), '#8ac06a'), H(6.0, 2.0, 5.2), 0.35); } });
shot(132, { set: 'house', light: 'golden', light2: 'night', note: 'Day melts into night in one move; the trailer fades out of existence (flash) — back to the empty driveway', cam: [[H(9.6, 1.5, 12.5), H(6, 0.9, 5), 38], [H(9.6, 1.4, 12), H(5.8, 0.9, 5.2), 36]],
  w: (k) => ({ trailer: k.t < 0.55, mowers: { trailer: k.t < 0.55 ? 11 : 0 }, tire: k.t >= 0.55 }), lt: (k) => smooth(k.r(0, k.n * 0.7)),
  fx: (k, FX, pop, T) => pop('pf', T.fxPuff, H(6, 1.0, 5.4), 0.8, Math.round(k.n * 0.52), 14) });

// =============================== DAY 37: THE MORNING AFTER ===============================
shot(133, { set: 'house', light: 'night', flash: true, title: 'DAY 37', sub: 'THE TRAILER IS GONE', titleLen: 75, note: 'CHAPTER: night, high angle over the empty driveway and the tire marks; Sam in socks',
  cam: [[H(11, 6, 14), H(6, 0, 6), 42], [H(9, 3.2, 12), H(6, 0.4, 6), 40]], w: () => ({ tire: 1 }), act: (k, A) => A('samSocks', H(6.4, 0, 7.6), { expr: 'sad' }) });
shot(135, { set: 'house', light: 'night', note: 'Police cruiser lights pulsing; an officer writes a report, unimpressed; Sam and Mom in robe', cam: [[H(11, 1.6, 15.5), H(5.5, 1.2, 9), 42], [H(10, 1.5, 14), H(5.6, 1.25, 9.5), 38]],
  w: (k) => ({ tire: 1, police: 1, extra3: { i: 2.5 * (Math.floor(k.lf / 6) % 2), pos: [2.2, 1.8, 14.5], col: Math.floor(k.lf / 12) % 2 ? '#ff3a3a' : '#3a5aff', dist: 12 } }),
  act: (k, A) => { A('cop', H(6.8, 0, 10.6), { expr: 'meh', R: 'hold', prop: 'notebook', L: 'hang' }); A('samSocks', H(5.4, 0, 9.6), { expr: 'nervous' }); A('lindaHome', H(4.3, 0, 8.8), { expr: 'sad', L: 'cross', R: 'cross' }); } });
shot(137, { set: 'house', light: 'night', light2: 'dawn', note: 'Sam sits on the curb from night until the sun comes up — one continuous move, the sky turns over', cam: [[H(9.5, 1.0, 17.5), H(5, 0.7, 12.7), 40], [H(8.0, 0.95, 16.0), H(4.7, 0.75, 12.7), 34]], lt: (k) => smooth(k.t),
  act: (k, A) => A('samSocks', H(4.6, 0.1, 12.75), { sit: 1, expr: 'sad', L: 'hold', R: 'hold' }), w: () => ({ tire: 1 }) });
shot(138, { set: 'house', light: 'dawn', note: 'Close on Sam at dawn: $1,500 · 36 days · gone in one night (numbers rise and get crossed out)', cam: [[H(6.2, 1.15, 15.6), H(4.3, 1.0, 12.75), 36], [H(5.9, 1.1, 15.2), H(4.3, 1.05, 12.75), 34]],
  focus: H(4.6, 1.0, 12.75), act: (k, A) => A('samSocks', H(4.6, 0.1, 12.75), { sit: 1, expr: k.lf > k.w(140) ? 'cry' : 'sad', L: 'hold', R: 'hold', tears: k.lf > k.w(140) ? (k.lf * 0.05) % 1 : 0 }),
  fx: (k, FX, pop, T) => { const it = [[k.w(138), '$1,500'], [k.w(139), '36 DAYS'], [k.w(140), 'GONE']]; it.forEach(([f0, s], i) => { if (k.lf >= f0 - 3) FX('t' + i + q(Math.min(1, (k.lf - f0 + 3) / 8), 2), (p) => T.fxBig(p, s, Math.min(1, (k.lf - f0 + 3) / 8), i === 2 ? '#e85a4a' : '#f2c23a'), H(3.7 + i * 0.0, 1.9 - i * 0.3, 12.6), 0.17); }); } });
shot(141, { set: 'house', light: 'dawn', note: 'Mia walks in and sits down beside him on the curb, phone in hand', cam: [[H(7.4, 1.0, 16.0), H(4.4, 0.8, 12.7), 38], [H(6.6, 0.95, 15.3), H(4.2, 0.8, 12.7), 34]],
  act: (k, A) => { A('samSocks', H(4.6, 0.1, 12.75), { sit: 1, expr: 'sad', L: 'hold', R: 'hold' }); const sit = k.lf > k.n * 0.65; const W_ = walkP(k, H(1.5, 0, 11.8), H(3.75, 0, 12.75), 0, k.n * 0.65); A('mia', sit ? H(3.75, 0.1, 12.75) : W_.pos, { sit: sit ? 1 : 0, expr: 'nervous', R: 'hold', prop: 'phoneShow', screen: '', step: W_.step }); } });
shot(142, { set: 'house', light: 'dawn', note: 'Mia: "Don\u2019t be mad." — two-shot, tight', cam: [[H(4.9, 1.1, 15.6), H(4.15, 0.95, 12.75), 36], [H(4.6, 1.1, 15.2), H(4.15, 1.0, 12.75), 34]],
  act: (k, A) => { A('samSocks', H(4.6, 0.1, 12.75), { sit: 1, expr: 'puzzled', L: 'hold', R: 'hold' }); A('mia', H(3.75, 0.1, 12.75), { sit: 1, expr: 'nervous', R: 'hold', prop: 'phoneShow' }); } });
shot(143, { set: 'house', light: 'dawn', note: 'Insert: her phone — 212 clips since Day 3: every repair, every failed pull; she scrolls', cam: [[H(4.0, 1.22, 13.2), H(4.05, 1.0, 12.85), 34], [H(4.0, 1.15, 13.1), H(4.05, 1.0, 12.85), 30]], cinf: 5, focus: H(4.05, 1.0, 12.88),
  w: (k) => ({ phone: { pos: H(4.05, 1.0, 12.88), rot: [-0.8, 0, 0.05], screen: { mode: 'clips', scroll: q(k.t, 2) } } }) });
shot(146, { set: 'kit', light: 'kitN', flash: 0.4, note: 'Last night: Mia at the kitchen table editing on her laptop in the dark; the timeline ends on Mom crying', cam: [[K(1.4, 1.35, 1.2), K(0.05, 0.95, -0.1), 38], [K(0.6, 1.15, 0.6), K(0.05, 0.95, -0.2), 32]],
  w: (k) => ({ kit: { laptop: k.lf > k.n * 0.6 ? 'upload' : 'edit', ...jarAt(SHELF, 0.1, 'FOR SAM') }, extra2: { i: 0.9, pos: [100.05, 1.0, 0.1], col: '#a8c8ff', dist: 2.5 } }),
  act: (k, A) => A('mia', K(0.05, 0, -0.7), { sit: 1, expr: 'focus', L: 'hold', R: 'hold' }) });
shot(148, { set: 'kit', light: 'kitN', note: 'Insert phone: the title — "My brother fixes trash mowers to save our house" · 400 views', cam: [[K(0.3, 1.0, 0.45), K(0.3, 0.8, 0.25), 32], [K(0.3, 0.97, 0.4), K(0.3, 0.8, 0.25), 28]], cinf: 4, focus: K(0.3, 0.79, 0.25),
  w: () => ({ kit: { laptop: 'upload' }, phone: { pos: K(0.3, 0.78, 0.25), rot: [-Math.PI / 2 + 0.05, 0, 0.1], screen: { mode: 'views', views: '400' } } }) });
shot(149, { set: 'kit', light: 'kitN', note: 'She yawns, shuts the laptop and goes to bed — 400 views', cam: [[K(1.6, 1.4, 1.6), K(0.0, 1.0, -0.4), 40], [K(1.4, 1.4, 1.3), K(0.4, 1.1, -0.2), 38]],
  w: (k) => ({ kit: { laptop: 'upload', hall: k.t > 0.6 ? 0.8 : 0.2 } }), act: (k, A) => { const W_ = walkP(k, K(0.05, 0, -0.7), K(2.5, 0, 0.9), k.n * 0.35, k.n); A('mia', W_.pos, { expr: k.lf < k.n * 0.35 ? 'sleep' : 'tired', R: k.lf < k.n * 0.35 ? 'cheek' : 'hang', step: W_.step }); } });
shot(150, { set: 'house', light: 'dawn', note: 'Back on the curb: the view counter rockets 400 → 300,000; Sam\u2019s jaw drops', cam: [[H(4.1, 1.28, 13.4), H(4.05, 1.05, 12.95), 30], [H(4.8, 1.15, 15.3), H(4.2, 1.0, 12.8), 36]], ease: 'out', focus: H(4.1, 1.0, 12.85),
  w: (k) => ({ phone: { pos: H(4.05, 1.08, 12.95), rot: [-0.4, 0, 0.05], screen: { mode: 'views', views: Math.round(lerp(400, 300000, eo(k.r(5, k.n * 0.7)))).toLocaleString('en-US') } } }),
  act: (k, A) => { A('samSocks', H(4.6, 0.1, 12.75), { sit: 1, expr: k.t > 0.5 ? 'shock' : 'puzzled', L: 'hold', R: 'hold' }); A('mia', H(3.75, 0.1, 12.75), { sit: 1, expr: 'smirk', R: 'hold' }); } });
shot(151, { set: 'house', light: 'dawn', note: 'The comments: "Do you do repairs?" "Where are you?" "I\u2019ll pay you to fix mine." — each pops in on the word', cam: [[H(4.05, 1.25, 13.38), H(4.05, 1.08, 12.95), 32], [H(4.05, 1.22, 13.3), H(4.05, 1.06, 12.95), 28]], cinf: 4, focus: H(4.05, 1.08, 12.95),
  w: (k) => ({ phone: { pos: H(4.05, 1.08, 12.95), rot: [-0.4, 0, 0.0], screen: { mode: 'comments', views: '300,000', nc: k.lf < k.w(152) ? 0 : k.lf < k.w(153) ? 1 : k.lf < k.w(154) ? 2 : 3 } } }) });
shot(155, { set: 'house', light: 'dawn', note: 'Right there on the curb, Sam realizes: a light bulb flickers on over his head', cam: [[H(6.1, 1.1, 15.8), H(4.6, 1.3, 12.75), 36], [H(5.6, 1.1, 15.2), H(4.6, 1.4, 12.75), 34]],
  act: (k, A) => A('samSocks', H(4.6, 0.1, 12.75), { sit: 1, expr: k.t > 0.4 ? 'wow' : 'think2', L: 'hold', R: 'hold' }), fx: (k, FX, pop, T) => { if (k.t > 0.4) FX('id' + q(Math.min(1, (k.t - 0.4) * 4), 2), (p) => T.ideaCard(p, Math.min(1, (k.t - 0.4) * 4)), H(4.6, 2.05, 12.75), 0.2); } });
shot(156, { set: 'house', light: 'dawn', note: 'He stands up into the sunrise: never selling mowers — selling the FIX. Low crane up around him', cam: [[H(5.8, 0.5, 15.2), H(4.6, 1.3, 12.75), 40], [H(3.2, 1.8, 15.6), H(4.6, 1.5, 12.75), 38]], lmod: { rimI: 1.8 },
  act: (k, A) => A('samSocks', H(4.6, k.lf > 18 ? 0 : 0.1, 12.75), { sit: k.lf > 18 ? 0 : 1, expr: k.lf > k.w(157) ? 'proud' : 'serious', L: k.lf > k.w(157) ? 'fist' : 'hang', R: 'hang' }),
  fx: (k, FX, pop, T) => { pop('sp', T.fxSparkle, H(4.2, 1.9, 12.6), 0.25, k.w(157, 3), 18); } });

// =============================== DAY 38-45: BRING IT BROKEN ===============================
shot(158, { set: 'house', light: 'day', tag: 'DAY 38', flash: 0.4, note: 'Mia paints a cardboard sign on the driveway, three words; then it is zip-tied to the garage: BRING IT BROKEN', cam: [[H(4.0, 1.4, 4.0), H(5.0, 0.9, 1.0), 38], [H(3.8, 1.7, 5.6), H(6.6, 1.5, -1.8), 38]],
  w: (k) => ({ sign: k.lf > k.w(161) - 6, garOpen: 0 }), focus: (k) => k.lf > k.w(161) - 6 ? H(8.25, 1.6, -1.9) : H(5.0, 0.9, 1.0),
  act: (k, A) => { const up = k.lf > k.w(161) - 6; A('mia', up ? H(6.0, 0, -0.9) : H(5.0, 0, 0.6), { expr: up ? 'proud' : 'focus', R: up ? 'thumb' : 'hold', prop: up ? null : (k.lf > k.w(160) ? 'sign' : 'brush'), propDX: k.lf > k.w(160) ? -40 : 0 }); },
  fx: (k, FX, pop, T) => { const w3 = ['BRING', 'IT', 'BROKEN']; for (let i = 0; i < 3; i++) if (k.lf > k.w(161, i) - 2) FX('w' + i + q(Math.min(1, (k.lf - k.w(161, i) + 2) / 6), 2), (p) => T.fxSpeech(p, w3[i], Math.min(1, (k.lf - k.w(161, i) + 2) / 6), i === 2 ? '#ffe0d8' : '#ffffff', i === 2 ? '#c8322e' : '#1b2a44'), H(5.6 + i * 1.1, 2.6, -0.5), 0.3); } });
shot(162, { set: 'house', light: 'day', note: 'By noon nine mowers crowd the driveway — other people\u2019s; a customer wheels in another', cam: [[H(10, 2.6, 14), H(6, 0.6, 3), 42], [H(9, 3.2, 12), H(6, 0.5, 3), 40]],
  w: (k) => ({ sign: 1, garOpen: 1, mowers: { drive9: Math.min(9, 5 + Math.floor(k.t * 6)), man1: 1 }, mpos: { man1: lerp3([7.3, 0, 8.2], [6.6, 0, 6.2], smooth(k.t)) }, custCars: 1 }),
  act: (k, A) => { A('custA', lerp3(H(7.9, 0, 8.7), H(7.2, 0, 6.7), smooth(k.t)), { expr: 'happy', R: 'reach', lift: -0.4, step: q((k.lf / 10) % 1, 2) }); A('sam', H(4.8, 0, 0.4), { expr: 'wow', R: 'wave', wv: k.lf * 0.4 }); } });
shot(164, { set: 'house', light: 'day', note: 'Sam\u2019s hand-lettered price sheet taped to the garage: REPAIRS $60 + PARTS; a customer pays', cam: [[H(7.6, 1.55, 1.0), H(7.7, 1.5, -1.9), 36], [H(7.2, 1.5, 0.5), H(7.6, 1.5, -1.9), 32]], focus: H(7.6, 1.5, -1.9),
  w: () => ({ sign: 1, garOpen: 1, mowers: { drive9: 9 }, paper: { pos: H(7.7, 1.45, -1.93), rot: [0, 0, 0.04], kind: 'price' } }),
  act: (k, A) => { A('sam', H(6.4, 0, -0.6), { expr: 'smile', R: 'hold', prop: 'wrench' }); A('custC', H(8.6, 0, -0.4), { expr: 'happy', R: 'offer', prop: 'tips' }); } });
shot(165, { set: 'house', light: 'day', note: 'Wide busy driveway, garage open; no buying, no trailer — just fixing', cam: [[H(2, 2.4, 13), H(6, 0.8, 0), 42], [H(4, 2.0, 11), H(6, 0.8, -1), 40]],
  w: () => ({ sign: 1, garOpen: 1, mowers: { drive9: 9 }, custCars: 1 }),
  act: (k, A) => { A('sam', H(5.2, 0, 3.8), { expr: 'focus', R: 'hold', prop: 'wrench' }); A('ray', H(7.6, 0, 2.6), { expr: 'calm', R: 'cheek' }); } ,
  fx: (k, FX, pop, T) => { pop('x', (p, t) => { p.g.globalAlpha = Math.sin(Math.PI * t); p.stroke([[150, 300], [450, 700]], 40, '#c8322e'); p.stroke([[450, 300], [150, 700]], 40, '#c8322e'); p.g.globalAlpha = 1; }, H(6, 1.0, 5.4), 0.6, k.w(166) - 4, 30); } });
shot(167, { set: 'house', light: 'day', tag: 'DAY 45', flash: 0.4, note: 'Phone insert: the counter blows past 2,000,000 views; confetti', cam: [[H(5.4, 1.45, 3.3), H(5.4, 1.3, 2.7), 32], [H(5.4, 1.42, 3.2), H(5.4, 1.3, 2.7), 28]], cinf: 5, focus: H(5.4, 1.3, 2.75),
  w: (k) => ({ sign: 1, garOpen: 1, mowers: { drive9: 9 }, phone: { pos: H(5.4, 1.3, 2.75), rot: [-0.15, 0, 0.03], screen: { mode: 'views', views: Math.round(lerp(1200000, 2000000, eo(k.r(0, k.n * 0.7)))).toLocaleString('en-US') } } }),
  fx: (k, FX, pop, T) => { if (k.t > 0.6) FX('cf' + q((k.lf * 0.03) % 1, 2), (p) => T.fxConfetti(p, (k.lf * 0.03) % 1, 3), H(5.4, 1.6, 2.6), 0.4); } });
shot(169, { set: 'house', light: 'day', note: 'Cars and pickups line the street from three towns away, mowers in their beds; slow truck along the line', ease: 'lin', cam: [[H(-26, 1.6, 23), H(-14, 1.0, 14.5), 42], [H(-2, 1.8, 23.5), H(8, 1.0, 14.5), 42]],
  w: () => ({ sign: 1, garOpen: 1, mowers: { drive9: 9 }, custCars: 5 }), act: (k, A) => { A('custA', H(-5.0, 0, 12.0), { expr: 'happy', R: 'reach', lift: -0.4 }); A('custB', H(-15.5, 0, 12.2), { expr: 'smile', L: 'wave', wv: k.lf * 0.3 }); } });

// =============================== DAY 50 / 53 ===============================
shot(170, { set: 'gar', light: 'garD', tag: 'DAY 50', flash: 0.4, note: 'Whiteboard: WAITLIST 84 MOWERS, Mia\u2019s schedule underneath; she taps it with the marker', cam: [[G(0.9, 1.55, 0.6), G(2.97, 1.5, -0.6), 40], [G(1.7, 1.55, 0.0), G(2.97, 1.55, -0.6), 34]], focus: G(2.97, 1.5, -0.6),
  w: (k) => ({ gar: { open: 1, board: { mode: 'wait', n: Math.round(lerp(60, 84, eo(k.r(10, k.n * 0.6)))) } }, mowers: { garIn: 6 } }),
  act: (k, A) => A('mia', G(2.2, 0, 0.7), { expr: 'proud', R: 'point', prop: 'marker' }) });
shot(172, { set: 'gar', light: 'garD', note: 'The system, in one sliding move: Ray on his stool listening → Sam fixing → Mia scheduling and filming', ease: 'lin', cam: [[G(-1.2, 1.3, 0.6), G(-1.9, 1.0, -1.6), 38], [G(0.6, 1.3, 0.4), G(0.3, 1.0, -2.0), 38], [G(2.0, 1.4, 1.4), G(1.6, 1.2, -0.4), 38]],
  w: () => ({ gar: { open: 1, board: { mode: 'wait', n: 84 } }, mowers: { garIn: 6 } }),
  act: (k, A) => { A('ray', G(-1.9, 0, -1.6), { sit: 1, expr: 'calm', R: 'cheek', closed: true }, { dy: 0.2 }); A('sam', G(0.3, 0, -2.3), { expr: 'focus', R: 'hold', prop: 'wrench', L: 'hold' }); A('mia', G(1.6, 0, -0.4), { expr: 'smile', R: 'tele', prop: 'phoneUp', L: 'hold' }); } });
shot(175, { set: 'kit', light: 'kitN', note: 'Linda writes every dollar in a notebook at the kitchen table, glasses of tea, careful columns', cam: [[K(1.2, 1.4, 1.3), K(-0.2, 0.9, 0.0), 38], [K(0.5, 1.2, 0.8), K(-0.25, 0.9, 0.0), 32]],
  w: () => ({ kit: { notebook: 1, tips: 1, mug: 1, ...jarAt(SHELF, 0.3, 'FOR SAM') } }), act: (k, A) => A('lindaHome', K(-0.3, 0, -0.62), { sit: 1, expr: 'focus', R: 'hold', prop: 'marker', L: 'hold' }) });
shot(176, { set: 'house', light: 'day', tag: 'DAY 53', flash: 0.4, note: 'A pickup pulls up; a man in a flannel unloads a mower that won\u2019t start', cam: [[H(16, 2.4, 24), H(9.5, 0.9, 14), 38], [H(15, 2.2, 22.5), H(9, 0.9, 13.5), 38]],
  w: (k) => ({ sign: 1, garOpen: 1, manCar: 1, manCarZ: lerp(24, 10.5, eo(k.r(0, k.n * 0.45))), mowers: { man1: k.t > 0.5 ? 1 : 0, drive9: 6 }, mpos: { man1: [8.6, 0, 12.4] } }),
  act: (k, A) => { if (k.t > 0.45) A('flea', H(9.4, 0, 12.6), { expr: 'meh', R: 'reach', lift: -0.4 }); } });
shot(178, { set: 'house', light: 'day', note: 'Sam knows it the second he sees it: crash zoom on his face, music drops', cam: [[H(7.6, 1.6, 10.6), H(6.0, 1.4, 7.2), 42], [H(6.8, 1.55, 9.4), H(6.0, 1.45, 7.2), 30]], ease: 'out', kicks: [[8, 0.4]],
  w: () => ({ sign: 1, garOpen: 1, manCar: 1, mowers: { man1: 1, drive9: 6 }, mpos: { man1: [8.6, 0, 12.4] } }), act: (k, A) => A('sam', H(6.0, 0, 7.2), { expr: 'squint', look: 0.5 }) });
shot(179, { set: 'house', light: 'day', note: 'Insert: the mower handle — HIS repair tag, still zip-tied: FIXED BY SAM ✓ DAY 31', cam: [[H(9.4, 0.95, 13.0), H(8.6, 0.8, 12.0), 30], [H(9.15, 0.92, 12.75), H(8.6, 0.82, 12.0), 26]], cinf: 6, focus: H(8.75, 0.8, 11.95),
  w: () => ({ sign: 1, manCar: 1, mowers: { man1: 1 }, mpos: { man1: [8.6, 0, 12.4] } }),
  act: (k, A, C, T) => C('tag', (p) => T.tagCard(p), H(8.78, 0.82 - 1.069 * 0.14, 11.98), 0.14, { flat: 1 }) });
shot(181, { set: 'house', light: 'day', note: 'The man shrugs: bought it at a flea market two days ago (still has the $40 price tag)', cam: [[H(9.0, 1.6, 15.2), H(9.4, 1.4, 12.6), 34], [H(8.6, 1.6, 14.8), H(9.2, 1.45, 12.6), 32]],
  w: () => ({ sign: 1, manCar: 1, mowers: { man1: 1 }, mpos: { man1: [8.6, 0, 12.4] } }),
  act: (k, A) => { A('flea', H(9.4, 0, 12.6), { expr: 'puzzled', L: 'shrug', R: 'hold', prop: 'flea' }); A('sam', H(7.6, 0, 11.6), { expr: 'serious', L: 'cross', R: 'cross' }); } });
shot(182, { set: 'main', light: 'day', flash: 0.4, note: 'One phone call later: across town a storage unit door rolls up — six more stolen mowers inside; an officer\u2019s flashlight', cam: [[Mn(-1.0, 1.4, 14.0), Mn(-3.6, 1.0, 21.5), 40], [Mn(-2.0, 1.3, 15.6), Mn(-3.8, 0.8, 22.0), 36]],
  w: (k) => ({ main: { unitOpen: smooth(k.r(k.n * 0.3, k.n * 0.6)) }, mowers: { storage6: 6 } }),
  act: (k, A) => { A('cop', Mn(-1.7, 0, 18.4), { expr: 'wow', R: 'point' }); A('sam', Mn(-5.6, 0, 18.0), { expr: k.t > 0.6 ? 'yay' : 'nervous', L: k.t > 0.6 ? 'up' : 'hang' }); A('ray', Mn(-6.6, 0, 17.4), { expr: k.t > 0.6 ? 'happy' : 'stern', L: 'hip' }); } });
shot(183, { set: 'house', light: 'golden', note: 'For three days everything is perfect: golden evening, the whole family working and laughing in the driveway', cam: [[H(11, 1.9, 13), H(5.5, 1.0, 2), 42], [H(9, 1.7, 10.5), H(5.0, 1.0, 2), 38]],
  w: () => ({ sign: 1, garOpen: 1, mowers: { drive9: 9 } }),
  act: (k, A) => { A('sam', H(5.0, 0, 4.0), { expr: 'laugh', R: 'hold', prop: 'wrench' }); A('mia', H(3.6, 0, 5.4), { expr: 'happy', R: 'tele', prop: 'phoneUp' }); A('ray', H(7.4, 0, 2.6), { sit: 1, expr: 'smile', R: 'cheek' }, { dy: 0.2 }); A('lindaHome', H(3.0, 0, 2.2), { expr: 'laugh', R: 'hold', prop: 'notebook' }); } });
shot(184, { set: 'house', light: 'golden', note: 'And then the city shows up: a white sedan glides in, the inspector steps out with a clipboard — sting', cam: [[H(9, 1.4, 11), H(10, 1.0, 15), 40], [H(8.6, 1.3, 10.4), H(9.4, 1.4, 14.3), 34]],
  w: (k) => ({ sign: 1, garOpen: 1, mowers: { drive9: 9 }, inspCar: 1, inspCarX: lerp(-6, 12.5, eo(k.r(0, k.n * 0.5))) }),
  act: (k, A) => { if (k.t > 0.55) A('inspector', H(10.6, 0, 12.6), { expr: 'stern', R: 'hold', prop: 'paper' }); } });
