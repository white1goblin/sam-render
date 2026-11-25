#!/bin/bash
# Sam 3D build: cast -> toon.js (with patches), world sources -> main.js, then syntax + story sanity checks.
cd /workspace/reachmora-videos/sam-3d/web
cat toonbase.js roman.js vesnacast.js ytcast.js mcast.js pjcast.js ptcast.js samcast.js > toon.js
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
open('toon.js', 'w').write(s)
PY
cat src/head1.js src/head2.js src/trees.js src/w1_mat.js src/w2_house.js src/w3_int.js src/w4_main.js src/w5_state.js src/post.js src/tail.js > main.js
node --check main.js 2>&1 | head -5; node --check toon.js 2>&1 | head -5
node -e "import('./story.js').then(m=>{console.log('story ok', m.TOTAL); for (let f=0; f<m.TOTAL; f+=1) { m.camAt(f); m.worldAt(f); m.dofAt(f); m.overlayAt(f); } console.log('fns ok')}).catch(e=>console.log('ERR',e.message, e.stack.split('\n')[1]))"
