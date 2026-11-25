// ---------- render targets & post ----------
const rtColor = new THREE.WebGLRenderTarget(W, H, { samples: 4, type: THREE.HalfFloatType });
const rtNd = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter });
const rtInk = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType });
const rtAO = new THREE.WebGLRenderTarget(W, H, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter });
const fsCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), fsGeo = new THREE.PlaneGeometry(2, 2);
const fs = (mat) => { const s = new THREE.Scene(); s.add(new THREE.Mesh(fsGeo, mat)); return s; };
const inkU = { col: { value: rtColor.texture }, nd: { value: rtNd.texture }, ao: { value: rtAO.texture }, aoK: { value: 0.75 }, expo: { value: 1.12 }, warm: { value: new THREE.Color('#fff1dc') }, cool: { value: new THREE.Color('#e8ecfa') }, res: { value: new THREE.Vector2(W, H) }, px: { value: 1.6 }, fogCol: { value: new THREE.Color() },
  sat: { value: 1.08 }, lift: { value: new THREE.Color(0, 0, 0) }, gain: { value: new THREE.Color(1, 1, 1) }, vig: { value: 0.22 }, flash: { value: 0 }, flashCol: { value: new THREE.Color(1, 1, 1) } };
const inkScene = fs(new THREE.ShaderMaterial({ uniforms: inkU, vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `uniform sampler2D col, nd, ao; uniform vec2 res; uniform float px, sat, vig, flash, aoK, expo; uniform vec3 fogCol, lift, gain, warm, cool, flashCol; varying vec2 vUv;
  vec3 aces(vec3 x){ return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14), 0., 1.); }
  float aoAt(vec2 uv, float d0){ float s = 0., w = 0.; for (int j=0;j<4;j++) for (int i=0;i<4;i++){ vec2 o = (vec2(float(i),float(j))-1.5)*1.6/res; float dd = abs(texture2D(nd, uv+o).a); float wt = (dd > 0. && abs(dd-d0)/d0 < .08) ? 1. : .0; s += texture2D(ao, uv+o).r*wt; w += wt; } return w > 0. ? s/w : 1.; }
  float edgeAt(vec2 uv, float r){
    vec4 c = texture2D(nd, uv); if (dot(c.rgb,c.rgb) < .01 || c.g > 1.5) return 0.; bool lf = c.a < 0.; float d = abs(c.a); vec3 n = c.rgb*2.-1.;
    float e = 0.; float rr = r * clamp(7./d, .62, 1.25);
    for (int i=0;i<16;i++){ float a = float(i)*.785398 + (i>7 ? .39 : 0.); float k = i>7 ? .5 : 1.;
      vec2 o = vec2(cos(a), sin(a))*rr*k/res; vec4 s = texture2D(nd, uv+o);
      float ds = abs(s.a); bool slf = s.a < 0.; bool card = dot(s.rgb,s.rgb) < .01;
      if (card && ds > 0.) continue; if (s.g > 1.5) continue;
      if (card) ds = 1e4;
      vec3 ns = s.rgb*2.-1.;
      if (lf && slf) e = max(e, smoothstep(.05, .11, (ds - d)/d) * .8);
      else e = max(e, smoothstep(.006 + d * .0009, .02 + d * .0012, (ds - d)/d));
      if (!card && !lf && !slf && abs(ds-d)/d < .06) e = max(e, smoothstep(.88, .72, dot(n, ns)) * .9);
    }
    return e * (1. - smoothstep(140., 520., d)*.8);
  }
  void main(){
    vec3 c = texture2D(col, vUv).rgb;
    vec4 ndc = texture2D(nd, vUv); ndc.a = abs(ndc.a); bool isCard = dot(ndc.rgb, ndc.rgb) < .01 && ndc.a > 0.;
    if (!isCard) { float a = (ndc.a > 0.) ? aoAt(vUv, ndc.a) : 1.; c *= mix(1., a, aoK * (1. - smoothstep(22., 60., ndc.a)));
      vec3 tm = aces(c*expo*1.12); tm = pow(tm, vec3(1./1.06)); float L0 = dot(tm, vec3(.299,.587,.114));
      tm *= mix(cool, warm, smoothstep(.15, .75, L0)); tm = max(mix(vec3(L0), tm, 1.07), 0.); c = ndc.a > 0. ? tm : c; }
    else { c *= 1.03; }
    float e = edgeAt(vUv, px);
    c = mix(c, vec3(.012,.01,.014), e);
    if (flash < -0.5) c = vec3(e);
    float l = dot(c, vec3(.299,.587,.114)); c = mix(vec3(l), c, sat);
    c = c*gain + lift;
    vec2 q = vUv-.5; c *= 1. - vig*dot(q*vec2(1.,.75), q*vec2(1.,.75))*2.2;
    c = mix(c, flashCol, max(flash, 0.));
    gl_FragColor = vec4(c,1.); }` }));
const aoU = { nd: { value: rtNd.texture }, tanY: { value: 0.36 }, aspect: { value: W / H }, radius: { value: 1.0 }, res: { value: new THREE.Vector2(W, H) } };
const aoScene = fs(new THREE.ShaderMaterial({ uniforms: aoU, vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `uniform sampler2D nd; uniform float tanY, aspect, radius; uniform vec2 res; varying vec2 vUv;
  vec3 vpos(vec2 uv, float d){ vec2 n = uv*2.-1.; return vec3(n.x*tanY*aspect*d, n.y*tanY*d, -d); }
  void main(){ vec4 c = texture2D(nd, vUv); float d = abs(c.a);
    if (d <= 0. || dot(c.rgb,c.rgb) < .01) { gl_FragColor = vec4(1.); return; }
    vec3 n = normalize(c.rgb*2.-1.); vec3 P = vpos(vUv, d) + n*.02*d*.01;
    vec2 ip = mod(floor(gl_FragCoord.xy), 4.); float rot = (ip.x*4. + mod(ip.y*3., 4.)*1.)*.3927 + ip.y*1.57;
    vec3 t = normalize(cross(n, abs(n.y) < .95 ? vec3(0.,1.,0.) : vec3(1.,0.,0.))), b = cross(n, t);
    float R = radius * clamp(d/6., .6, 3.), occ = 0.;
    for (int i=0;i<12;i++){ float fi = float(i), h = (fi+.5)/12.; float a = fi*2.39996 + rot;
      vec3 dir = (t*cos(a) + b*sin(a))*sqrt(1.-h*h*.6) + n*(.25+.75*fract(fi*.618));
      vec3 S = P + normalize(dir)*R*mix(.12, 1., h*h);
      vec2 su = vec2(S.x/(-S.z)/(tanY*aspect), S.y/(-S.z)/tanY)*.5+.5;
      if (su.x < 0. || su.x > 1. || su.y < 0. || su.y > 1.) continue;
      float sd = abs(texture2D(nd, su).a); if (sd <= 0.) continue;
      float diff = -S.z - sd; occ += step(.03*R, diff) * smoothstep(0., 1., R*1.6/max(abs(d - sd), 1e-3)); }
    float ao = clamp(1. - occ/12.*1.5, 0., 1.); gl_FragColor = vec4(vec3(ao), 1.); }` }));
const dofU = { src: { value: rtInk.texture }, nd: { value: rtNd.texture }, res: { value: new THREE.Vector2(W, H) }, focus: { value: 5 }, cinf: { value: 0 }, near: { value: 1 } };
const dofScene = fs(new THREE.ShaderMaterial({ uniforms: dofU, vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `uniform sampler2D src, nd; uniform vec2 res; uniform float focus, cinf, near; varying vec2 vUv;
  float coc(vec2 uv){ float d = abs(texture2D(nd, uv).a); if (d <= 0.) d = 2000.; float k = 1. - focus/d; return k > 0. ? cinf*k : min(-k*cinf*near, cinf*1.4); }
  void main(){
    float c0 = coc(vUv);
    if (cinf < .5 || c0 < .6) { gl_FragColor = linearToOutputTexel(vec4(texture2D(src, vUv).rgb, 1.)); return; }
    vec3 acc = vec3(0.); float wsum = 0.;
    for (int i=0;i<48;i++){ float fi = float(i); float r = sqrt((fi+.5)/48.); float a = fi*2.39996;
      vec2 o = vec2(cos(a), sin(a))*r*c0/res; float cs = coc(vUv+o);
      float w = smoothstep(r*c0-1.5, r*c0+.5, cs + .5);
      acc += texture2D(src, vUv+o).rgb*w; wsum += w; }
    gl_FragColor = linearToOutputTexel(vec4(acc/max(wsum,1e-3), 1.)); }` }));
dofScene.children[0].material.toneMapped = false;

