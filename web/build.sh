#!/bin/bash
# The $9.99 Trap build (from the Sam 3D engine): cast -> toon.js (with patches), world sources -> main.js, then syntax + story sanity checks.
cd /workspace/shorts/nine-trap/web
cat toonbase.js roman.js vesnacast.js ytcast.js mcast.js pjcast.js ptcast.js samcast.js rickface.js ninecast.js > toon.js
python3 - <<'PY'
s = open('toon.js').read()
def rep(a, b):
    global s
    assert s.count(a) == 1, (s.count(a), a); s = s.replace(a, b)
rep('} else if (O.uniform === "teen") {', '} else if (O.uniform === "hoodie") { hoodiePaint(p, O, tcx, T, chin, torsoBot, HH, u);\n    } else if (SAM_TORSO[O.uniform]) { SAM_TORSO[O.uniform](p, O, tcx, T, chin, torsoBot, HH, u);\n    } else if (O.uniform === "teen") {')
rep('const torsoL = O.stout ? 1.12 : 1.08, legsL = 1.38, sole = 975;', 'const torsoL = (O.stout ? 1.12 : 1.08) * (O.torsoK || 1), legsL = (opts.sit ? 0.62 : 1.38) * (O.legK || 1), sole = 975;')
rep('const sandal = O.boots || (O.helmet ? LEATHER : "#5a3b2a");', 'const sandal = O.boots || O.shoe || (O.helmet ? LEATHER : "#5a3b2a");')
rep('const castAfter = () => {};\nconst glow', 'const castAfter = (...a) => samAfter(...a);\nconst glow')
rep('const castLate = (p, prop, arms, u, opts, cx, hc, H) => {\n  const [hx, hy] = arms[1].pts[2], [lx, ly] = arms[0].pts[2];\n  if (prop === "clip")', 'const castLate = (p, prop, arms, u, opts, cx, hc, H) => {\n  samLate(p, prop, arms, u, opts, cx, hc, H);\n  const [hx, hy] = arms[1].pts[2], [lx, ly] = arms[0].pts[2];\n  if (prop === "clip")')
rep('const bd = blobPts(cx + 6 * u * facing, hc + 0.85 * H.b, { a: 0.62 * H.a, b: 0.75 * H.b', 'const bk_ = O.beardK || 1; const bd = blobPts(cx + 6 * u * facing, hc + (0.85 - (1 - bk_) * 0.6) * H.b, { a: 0.62 * H.a * (bk_ < 1 ? 1.15 : 1), b: 0.75 * H.b * bk_')
# --- Rick-style face upgrade (gated by globalThis.RICK_FACE) ---
rep('  else if (O.hair) hatOn(p, { hat: "hair", hair: O.hair, jacket: O.tunic }, hp, H, cx, hc, light, seed, facing, false);', '  else if (O.hair) { if (RK()) rickHair(p, O, H, cx, hc, light, facing, seed, u, ow); else hatOn(p, { hat: "hair", hair: O.hair, jacket: O.tunic }, hp, H, cx, hc, light, seed, facing, false); }')
rep('if (O.hair && !helmet && !hatNow) {', 'if (O.hair && !helmet && !hatNow && !RK()) {')
rep('  if (O.beard) {\n    const bk_', '  if (O.beard && RK()) rickBeard(p, O, H, cx, hc, light, facing, u, ow);\n  else if (O.beard) {\n    const bk_')
rep('    if (moustache) for (const s of [\n        -1,\n        1\n    ])taper(p, [\n        mx + s * 1.5 * u,', '    if (moustache && RK()) rickStache(p, mx, cy, u, moustache, !stout, stout); else if (moustache) for (const s of [\n        -1,\n        1\n    ])taper(p, [\n        mx + s * 1.5 * u,')
rep('const [dI, dO] = F.brow, by = ey - (brim ? 17 : 20) * u;', 'const [dI, dO] = (RK() && F.browR && side > 0) ? F.browR : F.brow, by = ey - (brim ? 17 : 20) * u;')
rep('            x - side * 8.5 * u,\n            by + dI * u\n        ], [\n            x + side * 8.5 * u,\n            by + dO * u\n        ], 5 * u, 2.5 * u);', '            x - side * (RK() ? 7 : 8.5) * u,\n            by + dI * u\n        ], [\n            x + side * (RK() ? 7 : 8.5) * u,\n            by + dO * u\n        ], RK() ? 6.5 * u : 5 * u, RK() ? 4.6 * u : 2.5 * u);')
rep('        case "lick":\n            p.arc(mx, my - 3 * u, 8 * u * k', '        default: rickMouth(p, kind, mx, my, u, k); break;\n        case "lick":\n            p.arc(mx, my - 3 * u, 8 * u * k')
rep('const mx = cx + 8 * u * facing, my = cy + 20 * u;', 'const mx = cx + 8 * u * facing + (RK() ? 3 * u * (facing || 1) : 0), my = cy + 20 * u;')
rep('        case "shock":\n        case "shockHalf":', '        case "googly": p.ell(x, ey, 8.5 * u, 9.5 * u, WHITE, 2.4 * u); p.dot(lx, ey + 1.5 * u, 3.4 * u); break;\n        case "shock":\n        case "shockHalf":')
rep('  faceFront(p, cx, hc, W, expr, facing, look, lid, helmet || hatNow, skin, O.beard ? O.beard : O.moustache, !!O.stout);', '  if (RK()) rickFXPre(p, O, expr, hp, H, cx, hc, facing, u);\n  faceFront(p, cx, hc, W, expr, facing, look, lid, helmet || hatNow, skin, O.beard ? O.beard : O.moustache, !!O.stout);\n  if (RK()) rickFXPost(p, O, expr, H, cx, hc, facing, u);')
rep('  // ---- head ----\n  const [cpx, cpy]', '  // ---- head ----\n  if (RK()) rickCollar(p, cx, hc, H);\n  const [cpx, cpy]')
open('toon.js', 'w').write(s)
PY
cat src/head1.js src/head2.js src/trees.js src/n1_mat.js src/n2_shop.js src/n3_lab.js src/n4_state.js src/post.js src/tail.js > main.js
node --check main.js 2>&1 | head -5; node --check toon.js 2>&1 | head -5
node -e "import('./story.js').then(m=>{console.log('story ok', m.TOTAL); for (let f=0; f<m.TOTAL; f+=1) { m.camAt(f); m.worldAt(f); m.dofAt(f); m.overlayAt(f); } console.log('fns ok')}).catch(e=>console.log('ERR',e.message, e.stack.split('\n')[1]))"
