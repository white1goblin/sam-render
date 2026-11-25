// ---------- Quaternius trees ----------
const QMAT = {}, TREEMESH = [];
const qgeo = (gltf, snowy = false) => { gltf.scene.updateMatrixWorld(true); const parts = []; const bb = new THREE.Box3();
  gltf.scene.traverse((o) => { if (!o.isMesh) return; const g = o.geometry.clone(); g.applyMatrix4(o.matrixWorld); g.computeBoundingBox(); bb.union(g.boundingBox); parts.push([g, o.material]); });
  const h = bb.max.y - bb.min.y, out = [];
  for (const [g, m0] of parts) { g.translate(0, -bb.min.y, 0); g.scale(1 / h, 1 / h, 1 / h);
    if (g.attributes.color && g.attributes.color.itemSize === 4) { const c = g.attributes.color, a = new Float32Array(c.count * 3); for (let i = 0; i < c.count; i++) { a[i * 3] = c.getX(i); a[i * 3 + 1] = c.getY(i); a[i * 3 + 2] = c.getZ(i); } g.setAttribute('color', new THREE.BufferAttribute(a, 3)); }
    const leaf = /Leaves|Leaf/.test(m0.name);
    if (leaf) { g.computeBoundingBox(); const cb = g.boundingBox, cy = (cb.min.y + cb.max.y) / 2, ry_ = (cb.max.y - cb.min.y) / 2, pa = g.attributes.position, na = g.attributes.normal, v = new THREE.Vector3(), nn = new THREE.Vector3();
      for (let i = 0; i < pa.count; i++) { v.set(pa.getX(i), (pa.getY(i) - cy) / Math.max(ry_, 1e-3) * 0.9 + 0.35, pa.getZ(i)).normalize(); nn.set(na.getX(i), na.getY(i), na.getZ(i)); if (nn.dot(v) < 0) nn.negate(); nn.lerp(v, 0.78).normalize(); na.setXYZ(i, nn.x, nn.y, nn.z); } }
    const key = m0.name + (snowy ? '_s' : ''); let m = QMAT[key];
    if (!m) { if (m0.map) { m0.map.colorSpace = THREE.SRGBColorSpace; m0.map.anisotropy = 4; }
      m = leaf ? new THREE.MeshLambertMaterial({ map: m0.map, alphaTest: 0.5, side: THREE.DoubleSide, vertexColors: !!g.attributes.color, color: '#ffffff' }) : new THREE.MeshLambertMaterial({ map: m0.map, normalMap: m0.normalMap, vertexColors: !!g.attributes.color, color: '#ffffff' });
      if (m0.name === 'Leaves_Pine') { m.color.setRGB(1.45, 1.55, 1.3); m.emissive.set('#0f1c0c'); } if (m0.name === 'Leaves_NormalTree') { m.color.setRGB(1.5, 1.62, 1.2); m.emissive.set('#1a2410'); }
      if (leaf) m.onBeforeCompile = (sh) => { sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWN;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvWN = normalize(mat3(modelMatrix*instanceMatrix)*normal);');
        sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWN;').replace('#include <normal_fragment_begin>', '#include <normal_fragment_begin>\n  normal = normalize(vNormal);')
          .replace('#include <map_fragment>', '#include <map_fragment>\n' + (snowy ? 'diffuseColor.rgb = mix(diffuseColor.rgb, vec3(.62,.66,.74), smoothstep(-.1,.45,vWN.y)*.85);' : '')); };
      QMAT[key] = m; }
    g.computeBoundingSphere(); out.push({ geo: g, mat: m, alpha: leaf ? m0.map : null }); }
  return out; };
const qinst = (V, list, cell = 60) => { const ch = {}; for (const o of list) { const k = Math.floor(o.x / cell) + ',' + Math.floor(o.z / cell); (ch[k] = ch[k] || []).push(o); }
  for (const L of Object.values(ch)) for (const P_ of V) { const im = inst(P_.geo, P_.mat, L); if (P_.alpha) { im.userData.nd = ndInstA(P_.alpha); im.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: P_.alpha, alphaTest: 0.5 }); }
    im.computeBoundingSphere(); im.userData.tree = true; TREEMESH.push(im); } };
