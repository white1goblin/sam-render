
// =====================================================================================
// HOUSE: Sam's small-town Ohio house. Street along x (z 13..21), sidewalk z 11..12.9, lawn, porch, detached garage, gravel driveway.
// =====================================================================================
const HS = {};
{ const O = HOUSE, g = grp(world, O[0], 0, O[2]); HS.g = g;
  // ground: lawn, street, curb, sidewalk, driveway, back yard
  add(new THREE.PlaneGeometry(260, 140).rotateX(-Math.PI / 2), M.lawn, 0, 0, -20, g, nocast).material = texM(lawnT, 60, 32, { roughness: 1, normalMap: PH.grassN, normalScale: new THREE.Vector2(0.6, 0.6) });
  add(new THREE.PlaneGeometry(260, 8).rotateX(-Math.PI / 2), texM(asphaltT, 40, 1.3, { roughness: 0.95 }), 0, 0.012, 17, g, nocast);
  add(tbox(260, 0.15, 0.25, 1), M.concrete, 0, 0.075, 12.92, g, nocast); add(tbox(260, 0.15, 0.25, 1), M.concrete, 0, 0.075, 21.08, g, nocast);
  add(new THREE.PlaneGeometry(260, 1.7).rotateX(-Math.PI / 2), texM(concreteT(), 150, 1), 0, 0.03, 11.9, g, nocast); add(new THREE.PlaneGeometry(260, 1.7).rotateX(-Math.PI / 2), texM(concreteT(), 150, 1), 0, 0.02, 22.1, g, nocast);
  for (let x = -128; x < 130; x += 1.7) add(box(0.02, 0.005, 1.7), M.dark, x, 0.035, 11.9, g, nocast);
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
  HS.bins = [bin(g, 2.4, 12.42, 0.1), bin(g, 1.6, 12.45, -0.2, '#2a4a8a')];
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
  mowerSet('curb3', [{ x: -25.3, y: 0, z: 12.4, ry: 0.6, col: '#c8322e' }, { x: -47.3, y: 0, z: 12.4, ry: -0.4, col: '#2f8a4a' }, { x: 29.0, y: 0, z: 12.4, ry: 0.3, col: '#e8b830' }], false, g);
  for (const [x, c] of [[-26.6, '#2f5a3a'], [-48.6, '#3a3a40'], [31, '#2a4a8a']]) { bin(g, x, 12.42, 0.2, c); bin(g, x - 0.8, 12.42, -0.3, '#2f5a3a'); const bxX = x > 0 ? x + 0.95 : x - 1.75; add(tbox(0.6, 0.5, 0.5, 0.5), M.cardboard, bxX, 0.25, 12.45, g, ).rotation.y = 0.25; add(tbox(0.62, 0.02, 0.3, 0.3), M.cardboard, bxX - 0.12, 0.52, 12.27, g, nocast).rotation.x = -0.5; }
  // neighbouring houses (same street + across)
  const NB = [[-26, 0, M.sidingB, M.roofB], [-48, 0, M.sidingC, M.roofC], [-70, 0, M.sidingD, M.roofA], [30, 0, M.sidingE, M.roofC], [52, 0, M.sidingD, M.roofB], [-30, 34, M.sidingC, M.roofA, Math.PI], [-6, 34, M.sidingD, M.roofB, Math.PI], [18, 34, M.sidingB, M.roofC, Math.PI], [42, 34, M.sidingA, M.roofA, Math.PI], [-54, 34, M.sidingE, M.roofB, Math.PI]];
  HS.nb = NB.map(([x, z, s, r, ry]) => house(g, x, z, { siding: s, roof: r, ry: ry || 0, w: 9 + (Math.abs(x) % 3), d: 8, pane: nightGlow('#ffc878'), shutter: toon({ color: ['#2f4a6a', '#6a2a2a', '#2a5a3a'][Math.abs(x) % 3] }), doorM: toon({ color: ['#2a4a6a', '#e8e0d0', '#3a6a4a'][Math.abs(x / 2) % 3 | 0] }) }));
  for (const [x, z] of [[-26, 0], [-48, 0], [30, 0], [52, 0]]) { add(new THREE.PlaneGeometry(3, 12).rotateX(-Math.PI / 2), M.concreteD, x + 6.5, 0.016, 6, g, nocast); add(new THREE.PlaneGeometry(1.1, 10).rotateX(-Math.PI / 2), M.concrete, x, 0.016, 6, g, nocast); mailbox(g, x + 4.6, 12.55); }
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
  HS.custCars = [car(g, -6, 15.2, Math.PI / 2, '#d8d4c8', 'pickup'), car(g, 18, 15.2, Math.PI / 2, '#3a6a4a'), car(g, -15, 15.2, Math.PI / 2, '#c8a038'), car(g, 23, 15.2, Math.PI / 2, '#5a5a62', 'pickup'), car(g, -24, 19.0, -Math.PI / 2, '#8a5a3a')];
  HS.inspCar = car(g, 12.5, 15.2, Math.PI / 2, '#e8e8e8');
  HS.manCar = car(g, 10.5, 15.4, Math.PI / 2, '#6a4a3a', 'pickup');
}
