// v3 sea: planar-mirror water derived from three.js r160 examples/jsm/objects/Water.js (MIT, (c) 2010-2023 three.js authors,
// https://unpkg.com/three@0.160.0/examples/jsm/objects/Water.js). Changes: HalfFloat mirror target, render hooks (hide cards/crowds in the
// reflection, skip during the normal/depth pass), deterministic time uniform, and a new fragment shader with shallow-water transparency,
// depth-map shore foam, fresnel + sun glints, all in linear space (the ink/grade pass tone-maps it).
import { Color, Matrix4, Mesh, PerspectiveCamera, Plane, ShaderMaterial, UniformsLib, UniformsUtils, Vector3, Vector4, WebGLRenderTarget, HalfFloatType, LinearFilter } from '../three.module.js';

export class WaterV3 extends Mesh {
  constructor(geometry, o = {}) {
    super(geometry);
    const scope = this;
    this.enabled = true; this.beforeMirror = null; this.afterMirror = null;
    const mirrorPlane = new Plane(), normal = new Vector3(), mirrorWorldPosition = new Vector3(), cameraWorldPosition = new Vector3(), rotationMatrix = new Matrix4();
    const lookAtPosition = new Vector3(0, 0, -1), clipPlane = new Vector4(), view = new Vector3(), target = new Vector3(), q = new Vector4();
    const textureMatrix = new Matrix4(), mirrorCamera = new PerspectiveCamera();
    const renderTarget = new WebGLRenderTarget(o.textureWidth || 540, o.textureHeight || 960, { type: HalfFloatType, minFilter: LinearFilter, magFilter: LinearFilter });
    this.renderTarget = renderTarget; this.mirrorCamera = mirrorCamera;
    const uniforms = UniformsUtils.merge([UniformsLib.fog, UniformsLib.lights, {
      normalSampler: { value: null }, mirrorSampler: { value: null }, time: { value: 0 }, size: { value: 1 }, distortionScale: { value: 3.7 },
      textureMatrix: { value: new Matrix4() }, sunColor: { value: new Color(0xffffff) }, sunDirection: { value: new Vector3(0.7, 0.7, 0) }, eye: { value: new Vector3() },
      deep: { value: new Color('#1f6690') }, shal: { value: new Color('#56b4c2') }, foamCol: { value: new Color('#f2fbff') }, hm: { value: null }, ts: { value: 900 },
      reflK: { value: 1.0 }, specK: { value: 1.0 }, skyRefl: { value: new Color('#bcd4ea') },
    }]);
    const material = new ShaderMaterial({
      name: 'WaterV3', uniforms, lights: true, fog: true, transparent: true,
      vertexShader: /* glsl */`
        uniform mat4 textureMatrix; varying vec4 mirrorCoord; varying vec4 worldPosition;
        #include <common>
        #include <fog_pars_vertex>
        #include <shadowmap_pars_vertex>
        void main() {
          mirrorCoord = modelMatrix * vec4(position, 1.0); worldPosition = mirrorCoord.xyzw; mirrorCoord = textureMatrix * mirrorCoord;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
          #include <beginnormal_vertex>
          #include <defaultnormal_vertex>
          #include <fog_vertex>
          #include <shadowmap_vertex>
        }`,
      fragmentShader: /* glsl */`
        uniform sampler2D mirrorSampler, normalSampler, hm; uniform float time, size, distortionScale, ts, reflK, specK;
        uniform vec3 sunColor, sunDirection, eye, deep, shal, foamCol, skyRefl;
        varying vec4 mirrorCoord; varying vec4 worldPosition;
        vec4 getNoise(vec2 uv) {
          vec2 uv0 = (uv / 103.0) + vec2(time / 17.0, time / 29.0);
          vec2 uv1 = uv / 107.0 - vec2(time / -19.0, time / 31.0);
          vec2 uv2 = uv / vec2(8907.0, 9803.0) + vec2(time / 101.0, time / 97.0);
          vec2 uv3 = uv / vec2(1091.0, 1027.0) - vec2(time / 109.0, time / -113.0);
          vec4 noise = texture2D(normalSampler, uv0) + texture2D(normalSampler, uv1) + texture2D(normalSampler, uv2) + texture2D(normalSampler, uv3);
          return noise * 0.5 - 1.0;
        }
        #include <common>
        #include <packing>
        #include <bsdfs>
        #include <fog_pars_fragment>
        #include <lights_pars_begin>
        #include <shadowmap_pars_fragment>
        #include <shadowmask_pars_fragment>
        void main() {
          vec2 huv = worldPosition.xz / ts + .5; float dep = 1.;
          if (huv.x > 0. && huv.x < 1. && huv.y > 0. && huv.y < 1.) dep = texture2D(hm, huv).r;
          vec3 worldToEye = eye - worldPosition.xyz; float dist = length(worldToEye); vec3 eyeDir = worldToEye / dist;
          vec4 nz = getNoise(worldPosition.xz * size);
          float calm = mix(.45, 1., smoothstep(.0, .3, dep)) * mix(1., .55, smoothstep(250., 1400., dist)); // calmer in the shallows + far away (no shimmer)
          vec3 n = normalize(nz.xzy * vec3(1.5 * calm, 1.0, 1.5 * calm));
          float sm = getShadowMask();
          // reflection (mirror pass) with normal-map distortion
          vec2 distortion = n.xz * (0.001 + 1.0 / dist) * distortionScale;
          vec3 refl = texture2D(mirrorSampler, mirrorCoord.xy / mirrorCoord.w + distortion).rgb;
          float cosT = clamp(dot(eyeDir, n), 0., 1.);
          float fres = .04 + .96 * pow(1. - cosT, 5.);
          // water body: shallow -> deep from the baked depth map, lit by the sun (diffuse-ish scatter)
          vec3 body = mix(shal, deep, smoothstep(.03, .6, dep));
          float sc = max(dot(n, sunDirection), 0.);
          body *= .78 + .32 * sc * mix(.6, 1., sm);
          body += shal * .18 * pow(max(dot(-eyeDir, sunDirection) * .5 + .5, 0.), 3.) * smoothstep(.0, .4, dep); // forward scatter glow
          if (reflK < .5) refl = skyRefl; // no mirror pass in this shot
          vec3 c = mix(body, refl, clamp(fres * .82 + .05, 0., 1.));
          // sun glints
          vec3 R = reflect(-sunDirection, n); float rd = max(dot(eyeDir, R), 0.);
          c += sunColor * (pow(rd, 260.) * 7. + pow(rd, 36.) * .22) * specK * sm;
          // shore foam: solid lap line + broken bands moving in with the swell
          float fbreak = smoothstep(.15, .65, nz.x * .5 + .5 + .25 * sin(worldPosition.x * .7 + worldPosition.z * .5));
          float sh = smoothstep(.17, .0, dep);
          float band = smoothstep(.55, .95, sin(dep * 70. - time * 2.2 + nz.y * 3.5) * .5 + .5);
          float foam = clamp(sh * (.25 + .75 * band) * fbreak + smoothstep(.04, .0, dep), 0., 1.) * .92;
          c = mix(c, foamCol * mix(.7, 1., sm), foam);
          float a = mix(.5, .97, smoothstep(.02, .32, dep)); a = max(a, foam); a = mix(a, 1., fres * .6);
          gl_FragColor = vec4(c, a);
          #ifdef USE_FOG
          float fogF = smoothstep(fogNear, fogFar * 1.5, vFogDepth) * .85; gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogF); // lighter sea haze than the land fog
          #endif
        }`,
    });
    material.uniforms.mirrorSampler.value = renderTarget.texture; material.uniforms.textureMatrix.value = textureMatrix;
    if (o.waterNormals) material.uniforms.normalSampler.value = o.waterNormals;
    this.material = material;
    this.onBeforeRender = function (renderer, scene, camera) {
      if (!scope.enabled) return;
      mirrorWorldPosition.setFromMatrixPosition(scope.matrixWorld); cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);
      rotationMatrix.extractRotation(scope.matrixWorld); normal.set(0, 0, 1); normal.applyMatrix4(rotationMatrix);
      view.subVectors(mirrorWorldPosition, cameraWorldPosition); if (view.dot(normal) > 0) return;
      view.reflect(normal).negate(); view.add(mirrorWorldPosition);
      rotationMatrix.extractRotation(camera.matrixWorld); lookAtPosition.set(0, 0, -1); lookAtPosition.applyMatrix4(rotationMatrix); lookAtPosition.add(cameraWorldPosition);
      target.subVectors(mirrorWorldPosition, lookAtPosition); target.reflect(normal).negate(); target.add(mirrorWorldPosition);
      mirrorCamera.position.copy(view); mirrorCamera.up.set(0, 1, 0); mirrorCamera.up.applyMatrix4(rotationMatrix); mirrorCamera.up.reflect(normal); mirrorCamera.lookAt(target);
      mirrorCamera.far = camera.far; mirrorCamera.updateMatrixWorld(); mirrorCamera.projectionMatrix.copy(camera.projectionMatrix);
      textureMatrix.set(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0);
      textureMatrix.multiply(mirrorCamera.projectionMatrix); textureMatrix.multiply(mirrorCamera.matrixWorldInverse);
      mirrorPlane.setFromNormalAndCoplanarPoint(normal, mirrorWorldPosition); mirrorPlane.applyMatrix4(mirrorCamera.matrixWorldInverse);
      clipPlane.set(mirrorPlane.normal.x, mirrorPlane.normal.y, mirrorPlane.normal.z, mirrorPlane.constant);
      const pm = mirrorCamera.projectionMatrix;
      q.x = (Math.sign(clipPlane.x) + pm.elements[8]) / pm.elements[0]; q.y = (Math.sign(clipPlane.y) + pm.elements[9]) / pm.elements[5]; q.z = -1.0; q.w = (1.0 + pm.elements[10]) / pm.elements[14];
      clipPlane.multiplyScalar(2.0 / clipPlane.dot(q));
      pm.elements[2] = clipPlane.x; pm.elements[6] = clipPlane.y; pm.elements[10] = clipPlane.z + 1.0 - (o.clipBias || 0); pm.elements[14] = clipPlane.w;
      material.uniforms.eye.value.setFromMatrixPosition(camera.matrixWorld);
      const cur = renderer.getRenderTarget(), sau = renderer.shadowMap.autoUpdate;
      scope.visible = false; renderer.shadowMap.autoUpdate = false;
      if (scope.beforeMirror) scope.beforeMirror(mirrorCamera);
      renderer.setRenderTarget(renderTarget); renderer.state.buffers.depth.setMask(true); renderer.setClearColor(0x000000, 1); renderer.clear();
      renderer.render(scene, mirrorCamera);
      if (scope.afterMirror) scope.afterMirror(mirrorCamera);
      scope.visible = true; renderer.shadowMap.autoUpdate = sau; renderer.setRenderTarget(cur);
      const vp = camera.viewport; if (vp !== undefined) renderer.state.viewport(vp);
    };
  }
}
