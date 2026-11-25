export const INK = "#241726";
export const SKIN = "#ffe2c2";
const WHITE = "#ffffff";
const MOUTH = "#5a1e28";
const TONGUE = "#e86e78";
const SH_SKIN = [
    0.96,
    0.86,
    0.84
];
const SH_CLOTH = [
    0.64,
    0.66,
    0.74
];
const SH_FELT = [
    0.62,
    0.62,
    0.7
];
const rad = (d)=>d * Math.PI / 180;
const clamp = (x, a, b)=>Math.max(a, Math.min(b, x));
export const mul = (c, m)=>{
    const n = parseInt(c.slice(1), 16);
    const ch = (v, k)=>Math.min(255, Math.round(v * k)).toString(16).padStart(2, "0");
    return `#${ch(n >> 16 & 255, m[0])}${ch(n >> 8 & 255, m[1])}${ch(n & 255, m[2])}`;
};
export const shade = (c, k)=>mul(c, [
        k,
        k,
        k
    ]);
export const mix = (a, b, t)=>{
    const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16);
    const ch = (s)=>Math.round((A >> s & 255) * (1 - t) + (B >> s & 255) * t).toString(16).padStart(2, "0");
    return `#${ch(16)}${ch(8)}${ch(0)}`;
};
const rnd = (seed, k)=>{
    const x = Math.sin(seed * 127.1 + k * 311.7) * 43758.5453;
    return x - Math.floor(x);
};
const rotPts = (pts, a, cx, cy)=>pts.map(([x, y])=>[
            cx + (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a),
            cy + (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a)
        ]);
const rotAbout = (q, a, c)=>rotPts([
        q
    ], a, c[0], c[1])[0];
const lerp2 = (a, b, t)=>[
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t
    ];
const curve = (a, k, b, n = 10)=>{
    const c = [
        2 * k[0] - (a[0] + b[0]) / 2,
        2 * k[1] - (a[1] + b[1]) / 2
    ], out = [];
    for(let i = 0; i <= n; i++){
        const t = i / n, s = 1 - t;
        out.push([
            s * s * a[0] + 2 * s * t * c[0] + t * t * b[0],
            s * s * a[1] + 2 * s * t * c[1] + t * t * b[1]
        ]);
    }
    return out;
};
export const RIFLEMAN = {
    jacket: "#357650",
    pants: "#3d4440",
    boots: INK,
    hat: "shako",
    belt: "#f1efe6",
    buttons: "#d9dde0",
    rifle: true
};
export const OFFICER = {
    ...RIFLEMAN,
    hat: "shako_tall",
    buttons: "#e8c45a",
    sash: "#c0353a",
    sword: true,
    moustache: "#4a3020",
    rifle: false,
    belt: null,
    build: "stout"
};
export const KID = {
    jacket: "#f08a2c",
    pants: "#3b5b9a",
    boots: "#f4f1ea",
    hat: "cap",
    cap: "#e2453c",
    build: "kid"
};
export const PARENT = {
    jacket: "#7b5ac9",
    pants: "#3b3f52",
    boots: "#5a3b2a",
    hat: "hair",
    hair: "#5a3b2a"
};
export const SKINS = [
    SKIN,
    "#f5c9a0",
    "#ecd0b6",
    "#c99067"
];
export const soldier = (v = 0, extra = {})=>{
    const o = {
        ...RIFLEMAN,
        skin: SKINS[v % 4]
    };
    if (v % 4 === 1) o.moustache = "#4a3426";
    if (v % 4 === 3) o.moustache = "#2a201a";
    return {
        ...o,
        ...extra
    };
};
export const townsfolk = (v = 0)=>{
    const coats = [
        "#3f6fb5",
        "#8c3b4a",
        "#5d7a3a",
        "#b5653f",
        "#2f5f6a",
        "#7b5ac9"
    ];
    const o = {
        jacket: coats[v % 6],
        pants: "#3b3f52",
        boots: "#4a3426",
        skin: SKINS[v % 4]
    };
    return v % 2 ? {
        ...o,
        hat: "bonnet",
        dress: [
            "#d9a441",
            "#c25a7a",
            "#5a8fc2"
        ][v % 3]
    } : {
        ...o,
        hat: "tophat"
    };
};
export class Pen {
    g;
    ol = 12;
    rot = null;
    constructor(g){
        this.g = g;
    }
    P(x, y) {
        if (!this.rot) return [
            x,
            y
        ];
        const r = this.rot, a = r[0], cx = r[1], cy = r[2], dx = r.length > 3 ? r[3] : 0, dy = r.length > 4 ? r[4] : 0, c = Math.cos(a), s = Math.sin(a);
        return [
            cx + (x - cx) * c - (y - cy) * s + dx,
            cy + (x - cx) * s + (y - cy) * c + dy
        ];
    }
    path(pts, close) {
        const g = this.g;
        g.beginPath();
        pts.forEach((p, i)=>{
            const [x, y] = this.P(p[0], p[1]);
            if (i) g.lineTo(x, y);
            else g.moveTo(x, y);
        });
        if (close) g.closePath();
    }
    poly(pts, fill, ol) {
        const g = this.g, w = ol ?? this.ol;
        this.path(pts, true);
        if (fill) {
            g.fillStyle = fill;
            g.fill();
        }
        if (w) {
            g.lineWidth = w;
            g.strokeStyle = INK;
            g.lineJoin = "round";
            g.stroke();
        }
    }
    ell(cx, cy, rx, ry, fill, ol, a0 = 0, a1 = 360, rot = 0) {
        this.poly(ellPts(cx, cy, rx, ry, a0, a1, rot), fill, ol);
    }
    line(pts, fill, w, ink = true) {
        const g = this.g;
        g.lineCap = "round";
        g.lineJoin = "round";
        if (ink) {
            this.path(pts, false);
            g.strokeStyle = INK;
            g.lineWidth = w + 2 * this.ol * 0.9;
            g.stroke();
        }
        this.path(pts, false);
        g.strokeStyle = fill;
        g.lineWidth = w;
        g.stroke();
    }
    stroke(pts, w, fill = INK) {
        const g = this.g;
        g.lineCap = "round";
        g.lineJoin = "round";
        this.path(pts, false);
        g.strokeStyle = fill;
        g.lineWidth = w;
        g.stroke();
    }
    arc(cx, cy, rx, ry, a0, a1, w, fill = INK) {
        const pts = [];
        for(let i = 0; i <= 24; i++)pts.push([
            cx + rx * Math.cos(rad(a0 + (a1 - a0) * i / 24)),
            cy + ry * Math.sin(rad(a0 + (a1 - a0) * i / 24))
        ]);
        this.stroke(pts, w, fill);
    }
    dot(cx, cy, r, fill = INK) {
        const [x, y] = this.P(cx, cy);
        this.g.beginPath();
        this.g.arc(x, y, r, 0, Math.PI * 2);
        this.g.fillStyle = fill;
        this.g.fill();
    }
    clip(pts, fn) {
        const g = this.g;
        g.save();
        this.path(pts, true);
        g.clip();
        fn();
        g.restore();
    }
    shadedFill(pts, base, shadow, light, R, shift = 0.45, r0 = 1.05, r1 = 1.25) {
        const g = this.g, n = pts.length;
        let cx = 0, cy = 0;
        for (const [x, y] of pts){
            cx += x / n;
            cy += y / n;
        }
        const [gx, gy] = this.P(cx + Math.cos(light) * shift * R, cy + Math.sin(light) * shift * R);
        const gr = g.createRadialGradient(gx, gy, 0, gx, gy, r1 * R);
        gr.addColorStop(0, base);
        gr.addColorStop(r0 / r1, base);
        gr.addColorStop(1, shadow);
        this.path(pts, true);
        g.fillStyle = gr;
        g.fill();
    }
    gradFill(pts, base, shadow, light, flat = 0.22) {
        const g = this.g, dx = Math.cos(light), dy = Math.sin(light), n = pts.length;
        let cx = 0, cy = 0, lo = Infinity, hi = -Infinity;
        for (const [x, y] of pts){
            cx += x / n;
            cy += y / n;
            const d = x * dx + y * dy;
            lo = Math.min(lo, d);
            hi = Math.max(hi, d);
        }
        const dc = cx * dx + cy * dy;
        const [ax, ay] = this.P(cx + dx * (hi - dc), cy + dy * (hi - dc)), [bx, by] = this.P(cx + dx * (lo - dc), cy + dy * (lo - dc));
        const gr = g.createLinearGradient(ax, ay, bx, by);
        gr.addColorStop(0, base);
        gr.addColorStop(flat, base);
        gr.addColorStop(1, shadow);
        this.path(pts, true);
        g.fillStyle = gr;
        g.fill();
    }
    inkRing(pts, w0, thick, k = 0.45, col = INK) {
        const n = pts.length;
        let cx = 0, cy = 0;
        for (const [x, y] of pts){
            cx += x / n;
            cy += y / n;
        }
        const out = [], inn = [];
        pts.forEach((q, i)=>{
            const a = pts[(i + n - 1) % n], b = pts[(i + 1) % n];
            let nx = b[1] - a[1], ny = a[0] - b[0];
            const l = Math.hypot(nx, ny) || 1;
            nx /= l;
            ny /= l;
            const h = 0.5 * w0 * (1 + k * Math.cos(Math.atan2(q[1] - cy, q[0] - cx) - thick));
            out.push([
                q[0] + nx * h,
                q[1] + ny * h
            ]);
            inn.push([
                q[0] - nx * h,
                q[1] - ny * h
            ]);
        });
        const g = this.g;
        const trace = (r)=>{
            r.forEach(([x0, y0], i)=>{
                const [x, y] = this.P(x0, y0);
                if (i) g.lineTo(x, y);
                else g.moveTo(x, y);
            });
            g.closePath();
        };
        g.beginPath();
        trace(out);
        trace(inn.reverse());
        g.fillStyle = col;
        g.fill("evenodd");
    }
    band(pts, fill, w, rim, cap = "butt") {
        const g = this.g;
        g.lineCap = cap;
        g.lineJoin = "round";
        this.path(pts, false);
        g.strokeStyle = INK;
        g.lineWidth = w + 2 * rim;
        g.stroke();
        this.path(pts, false);
        g.strokeStyle = fill;
        g.lineWidth = w;
        g.stroke();
        g.lineCap = "round";
    }
}
const ellPts = (cx, cy, rx, ry, a0 = 0, a1 = 360, rot = 0, n = 48)=>{
    const r = rad(rot), pts = [];
    for(let i = 0; i <= n; i++){
        const a = rad(a0 + (a1 - a0) * i / n), x = rx * Math.cos(a), y = ry * Math.sin(a);
        pts.push([
            cx + x * Math.cos(r) - y * Math.sin(r),
            cy + x * Math.sin(r) + y * Math.cos(r)
        ]);
    }
    return pts;
};
const rrect = (x0, y0, x1, y1, r, n = 8)=>{
    const pts = [];
    for (const [cx, cy, a] of [
        [
            x1 - r,
            y0 + r,
            -90
        ],
        [
            x1 - r,
            y1 - r,
            0
        ],
        [
            x0 + r,
            y1 - r,
            90
        ],
        [
            x0 + r,
            y0 + r,
            180
        ]
    ])for(let i = 0; i <= n; i++)pts.push([
        cx + r * Math.cos(rad(a + 90 * i / n)),
        cy + r * Math.sin(rad(a + 90 * i / n))
    ]);
    return pts;
};
const taper = (p, a, b, wa, wb, col = INK)=>{
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
    p.poly([
        [
            a[0] + nx * wa / 2,
            a[1] + ny * wa / 2
        ],
        [
            b[0] + nx * wb / 2,
            b[1] + ny * wb / 2
        ],
        [
            b[0] - nx * wb / 2,
            b[1] - ny * wb / 2
        ],
        [
            a[0] - nx * wa / 2,
            a[1] - ny * wa / 2
        ]
    ], col, 0);
    p.dot(a[0], a[1], wa / 2, col);
    p.dot(b[0], b[1], wb / 2, col);
};
export const blobPts = (cx, cy, B, n = 72)=>{
    const ph = [
        rnd(B.seed, 11),
        rnd(B.seed, 12),
        rnd(B.seed, 13)
    ].map((v)=>v * Math.PI * 2);
    const pts = [];
    for(let i = 0; i < n; i++){
        const t = i / n * Math.PI * 2, c = Math.cos(t), s = Math.sin(t), e = 2 / (s < 0 ? B.nTop : B.nBot);
        let X = Math.sign(c) * Math.abs(c) ** e;
        const Y = Math.sign(s) * Math.abs(s) ** e;
        X *= (1 + B.egg * Y) * (1 + B.asym * Math.sign(X));
        const r = 1 + B.noise * (Math.cos(2 * t + ph[0]) + 0.7 * Math.cos(3 * t + ph[1]) + 0.5 * Math.cos(4 * t + ph[2]));
        const x = B.a * X * r, y = B.b * Y * r;
        pts.push([
            cx + x * Math.cos(B.rot) - y * Math.sin(B.rot),
            cy + x * Math.sin(B.rot) + y * Math.cos(B.rot)
        ]);
    }
    return pts;
};
export const headBlob = (seed, a = 118, facing = 0)=>({
        a,
        b: a * (0.94 + 0.08 * (rnd(seed, 1) - 0.5)),
        nTop: 1.75 + 0.3 * (rnd(seed, 2) - 0.5),
        nBot: 2.3 + 0.3 * (rnd(seed, 3) - 0.5),
        egg: -0.12 + 0.06 * (rnd(seed, 4) - 0.5),
        asym: (0.06 + 0.04 * rnd(seed, 5)) * (facing || (rnd(seed, 6) < 0.5 ? -1 : 1)),
        rot: rad(8 * (rnd(seed, 7) - 0.5)),
        noise: 0.008,
        seed
    });
export const thickAngle = (light)=>Math.atan2(-Math.sin(light) + 0.8, -Math.cos(light));
const DEF_LIGHT = rad(-120);
const FACE = {
    neutral: {
        eye: [
            "lid",
            "lid"
        ],
        brow: [
            0,
            -1
        ],
        mouth: "dash"
    },
    stern: {
        eye: [
            "lid",
            "lid"
        ],
        brow: [
            3,
            -2
        ],
        mouth: "frown"
    },
    grin: {
        eye: [
            "happy",
            "happy"
        ],
        brow: [
            -3,
            -3
        ],
        mouth: "grin"
    },
    laugh: {
        eye: [
            "squeeze",
            "squeeze"
        ],
        brow: [
            -4,
            -4
        ],
        mouth: "laugh"
    },
    whistle: {
        eye: [
            "dash",
            "dash"
        ],
        brow: [
            -2,
            -4
        ],
        mouth: "o"
    },
    nervous: {
        eye: [
            "small",
            "small"
        ],
        brow: [
            -3,
            2
        ],
        mouth: "wave"
    },
    shock: {
        eye: [
            "shock",
            "shock"
        ],
        brow: [
            -7,
            -6
        ],
        mouth: "O"
    },
    relief: {
        eye: [
            "happy",
            "happy"
        ],
        brow: [
            -2,
            1
        ],
        mouth: "smileWide"
    },
    relief_open: {
        eye: [
            "happy",
            "happy"
        ],
        brow: [
            -2,
            1
        ],
        mouth: "grin"
    },
    dazed: {
        eye: [
            "spiral",
            "spiral"
        ],
        brow: [
            -3,
            2
        ],
        mouth: "wave"
    },
    pained: {
        eye: [
            "squeeze",
            "lid"
        ],
        brow: [
            -3,
            2
        ],
        mouth: "teeth"
    },
    smile: {
        eye: [
            "dot",
            "dot"
        ],
        brow: [
            0,
            -1
        ],
        mouth: "smirk"
    },
    smile_closed: {
        eye: [
            "happy",
            "happy"
        ],
        brow: [
            0,
            -1
        ],
        mouth: "smile"
    },
    lick: {
        eye: [
            "dot",
            "dot"
        ],
        brow: [
            0,
            -1
        ],
        mouth: "lick"
    }
};
const halfLid = (k)=>k === "dot" || k === "small" ? "lid" : k === "lid" ? "slit" : k === "shock" ? "shockHalf" : k;
const eyeKind = (k, lid)=>lid >= 1 && k !== "happy" && k !== "squeeze" && k !== "spiral" ? "dash" : lid > 0 ? halfLid(k) : k;
const lidOf = (b)=>b === true ? 1 : Number(b) || 0;
const eye = (p, kind, x, ey, u, side, look, skin)=>{
    const lx = x + look * 3 * u, lw = 3.8 * u;
    switch(kind){
        case "spiral": {
            const sp = []; for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 4 * side, r = (0.6 + i * 0.32) * u; sp.push([x + Math.cos(a) * r, ey + Math.sin(a) * r]); }
            p.ell(x, ey, 9.5 * u, 9.5 * u, "#ffffff", 2.2 * u); p.stroke(sp, 2.2 * u); break; }
        case "dot":
            p.ell(lx, ey, 3.8 * u, 5.5 * u, INK, 0);
            break;
        case "small":
            p.ell(lx, ey, 3 * u, 4.4 * u, INK, 0);
            break;
        case "lid":
            p.ell(lx, ey - u, 7 * u, 6 * u, INK, 0, 0, 180);
            p.stroke([
                [
                    x - 9 * u,
                    ey - u
                ],
                [
                    x + 9 * u,
                    ey - u
                ]
            ], lw);
            break;
        case "slit":
            p.ell(lx, ey, 7 * u, 2.6 * u, INK, 0, 0, 180);
            p.stroke([
                [
                    x - 9 * u,
                    ey
                ],
                [
                    x + 9 * u,
                    ey
                ]
            ], lw);
            break;
        case "happy":
            p.arc(x, ey + 3 * u, 8 * u, 6 * u, 200, 340, lw);
            break;
        case "dash":
            p.stroke([
                [
                    x - 8.5 * u,
                    ey
                ],
                [
                    x + 8.5 * u,
                    ey
                ]
            ], lw);
            break;
        case "squeeze":
            p.stroke([
                [
                    x + 6 * u * side,
                    ey - 5 * u
                ],
                [
                    x - 6 * u * side,
                    ey
                ],
                [
                    x + 6 * u * side,
                    ey + 5 * u
                ]
            ], lw);
            break;
        case "shock":
        case "shockHalf":
            p.ell(x, ey, 11 * u, 11 * u, WHITE, 2.6 * u);
            p.dot(lx - side * 1.5 * u, ey + 1.5 * u, 3 * u);
            if (kind === "shockHalf") {
                p.ell(x, ey, 11 * u, 11 * u, skin, 0, 180, 360);
                p.stroke([
                    [
                        x - 11 * u,
                        ey
                    ],
                    [
                        x + 11 * u,
                        ey
                    ]
                ], 2.6 * u);
            }
            break;
        default:
            {
                const s = [];
                for(let t = 1; t < 15; t++)s.push([
                    x + Math.cos(t * 0.9) * t * 0.55 * u,
                    ey + Math.sin(t * 0.9) * t * 0.55 * u
                ]);
                p.stroke(s, 2.4 * u);
            }
    }
};
const dmouth = (p, mx, y, rx, ry, u, tongue = false)=>{
    p.ell(mx, y, rx, ry, MOUTH, 0, 0, 180);
    p.clip([
        [
            mx - rx,
            y
        ],
        [
            mx + rx,
            y
        ],
        [
            mx + rx,
            y + 3 * u
        ],
        [
            mx - rx,
            y + 3 * u
        ]
    ], ()=>p.ell(mx, y, rx, ry, WHITE, 0, 0, 180));
    if (tongue) p.ell(mx + 2 * u, y + 0.62 * ry, 0.4 * rx, 0.28 * ry, TONGUE, 0);
    p.ell(mx, y, rx, ry, null, 3 * u, 0, 180);
};
const mouth = (p, kind, mx, my, u, k = 1)=>{
    const mw = 4 * u;
    switch(kind){
        case "dash":
            p.stroke([
                [
                    mx - 5.5 * u * k,
                    my
                ],
                [
                    mx + 5.5 * u * k,
                    my - 0.8 * u
                ]
            ], mw);
            break;
        case "frown":
            p.arc(mx, my + 3 * u, 6.5 * u * k, 3.5 * u, 200, 340, mw);
            break;
        case "smirk":
            p.arc(mx + u, my - 3 * u, 7 * u * k, 4 * u, 10, 150, mw);
            break;
        case "smile":
            p.arc(mx, my - 3 * u, 8 * u * k, 4.5 * u, 20, 160, mw);
            break;
        case "smileWide":
            p.arc(mx, my - 4 * u, 11 * u * k, 6 * u, 15, 165, mw);
            break;
        case "grin":
            dmouth(p, mx, my - u, 12 * u * k, 8 * u, u);
            break;
        case "laugh":
            dmouth(p, mx, my, 16 * u * k, 11 * u, u, true);
            break;
        case "o":
            p.ell(mx + 4 * u, my, 3.5 * u, 4 * u, MOUTH, 2.8 * u);
            break;
        case "O":
            p.ell(mx, my + 2 * u, 9 * u * k, 11 * u, MOUTH, 3.2 * u);
            break;
        case "wave":
            {
                const s = [];
                for(let i = 0; i <= 12; i++)s.push([
                    mx - 9 * u * k + i * 1.5 * u * k,
                    my + 1.5 * u * Math.sin(i * 1.3)
                ]);
                p.stroke(s, 3 * u);
                break;
            }
        case "teeth":
            p.poly([
                [
                    mx - 12 * u * k,
                    my - 4 * u
                ],
                [
                    mx + 12 * u * k,
                    my - 4 * u
                ],
                [
                    mx + 11 * u * k,
                    my + 4 * u
                ],
                [
                    mx - 11 * u * k,
                    my + 4 * u
                ]
            ], WHITE, 3 * u);
            for (const j of [
                -1,
                0,
                1
            ])p.stroke([
                [
                    mx + j * 6 * u * k,
                    my - 4 * u
                ],
                [
                    mx + j * 6 * u * k,
                    my + 4 * u
                ]
            ], 1.5 * u);
            break;
        case "lick":
            p.arc(mx, my - 3 * u, 8 * u * k, 4.5 * u, 20, 160, mw);
            p.ell(mx + 6 * u * k, my + 3 * u, 3.6 * u, 4.6 * u, TONGUE, 2.4 * u);
            break;
    }
};
const faceFront = (p, cx, cy, W, expr, facing, look, lid, brim, skin, moustache, stout = false)=>{
    const u = W / 100, F = FACE[expr], fx = cx + 7 * u * facing;
    const ex = (F.eye[0] === "shock" ? 12 : 13) * u, ey = cy;
    for (const side of [
        -1,
        1
    ]){
        const x = fx + side * ex;
        const kind = eyeKind(F.eye[(facing ? side === facing : side > 0) ? 1 : 0], lid);
        eye(p, kind, x, ey, u, side, look, skin);
        const [dI, dO] = F.brow, by = ey - (brim ? 17 : 20) * u;
        if (kind === "shock" || kind === "shockHalf") p.arc(x, by - 6 * u, 9 * u, 3 * u, 200, 340, 4 * u);
        else taper(p, [
            x - side * 8.5 * u,
            by + dI * u
        ], [
            x + side * 8.5 * u,
            by + dO * u
        ], 5 * u, 2.5 * u);
    }
    const mx = cx + 8 * u * facing, my = cy + 20 * u;
    mouth(p, F.mouth, mx, my, u);
    if (moustache) for (const s of [
        -1,
        1
    ])taper(p, [
        mx + s * 1.5 * u,
        cy + 12.5 * u
    ], [
        mx + s * (stout ? 19 : 15) * u,
        cy + (stout ? 10.5 : 15) * u
    ], stout ? 5.5 * u : 4.5 * u, 1.6 * u, moustache);
    if (expr === "nervous") p.ell(cx + 40 * u * (facing || 1), cy - 22 * u, 3 * u, 5 * u, "#9fd4ff", 2 * u);
};
const faceSide = (p, hx, hy, W, expr, lid, brim, skin, moustache, stout = false)=>{
    const u = W / 100, F = FACE[expr], ex = hx + 27 * u, ey = hy;
    const kind = eyeKind(F.eye[1], lid);
    eye(p, kind, ex, ey, u, 1, 0.6, skin);
    const by = ey - (brim ? 17 : 20) * u, [dI, dO] = F.brow;
    if (kind === "shock" || kind === "shockHalf") p.arc(ex, by - 6 * u, 9 * u, 3 * u, 200, 340, 4 * u);
    else taper(p, [
        ex + 8 * u,
        by + dI * u
    ], [
        ex - 7 * u,
        by - u + dO * u
    ], 5 * u, 2.5 * u);
    p.stroke([
        [
            hx + 44 * u,
            hy + 4 * u
        ],
        [
            hx + 47.5 * u,
            hy + 9 * u
        ],
        [
            hx + 43 * u,
            hy + 10 * u
        ]
    ], 3 * u);
    mouth(p, F.mouth, hx + 33 * u, hy + 21 * u, u, 0.62);
    if (moustache) taper(p, [
        hx + 41 * u,
        hy + 13.5 * u
    ], [
        hx + 25 * u,
        hy + (stout ? 11.5 : 16) * u
    ], stout ? 5.5 * u : 4.5 * u, 1.6 * u, moustache);
    if (expr === "nervous") p.ell(hx - 30 * u, hy - 24 * u, 3 * u, 5 * u, "#9fd4ff", 2 * u);
};
const BONNET = "#e9cf8f", BONNET_BRIM = "#d6b46a";
const hatBehind = (p, o, H, cx, hc, light, thick, ow, side)=>{
    if (o.hat !== "bonnet") return;
    const bb = blobPts(cx - (side ? 12 : 0) * (H.a / 50), hc - 0.07 * 2 * H.b, {
        ...H,
        a: H.a * 1.17,
        b: H.b * 1.13,
        asym: 0,
        egg: 0.04,
        seed: H.seed + 3
    });
    p.shadedFill(bb, BONNET, mul(BONNET, SH_CLOTH), light, H.a * 1.17);
    p.inkRing(bb, ow * 0.85, thick);
};
const hatOn = (p, o, hp, H, cx, hc, light, seed, facing, side)=>{
    const W = 2 * H.a, HH = 2 * H.b, u = W / 100, crown = hc - H.b, ow = 0.85 * 5 * u;
    const a = H.rot + rad(4 * (rnd(seed, 20) - 0.5));
    const R = (pts)=>rotPts(pts, a, cx, hc);
    const sag = (yb, wb)=>{
        const base = [];
        for(let i = 0; i <= 12; i++){
            const t = i / 12;
            base.push([
                cx + wb * (2 * t - 1),
                yb + 3 * u * (1 - (2 * t - 1) ** 2)
            ]);
        }
        return base;
    };
    if (o.hat === "shako" || o.hat === "shako_tall") {
        const tall = o.hat === "shako_tall", yb = crown + 0.25 * HH, ht = (tall ? 0.66 : 0.56) * HH, wb = 46 * u, wt = 52 * u;
        const body = R([
            ...sag(yb, wb).reverse(),
            [
                cx - wt,
                yb - ht
            ],
            [
                cx + wt,
                yb - ht
            ]
        ]);
        p.shadedFill(body, "#3a3d47", "#24262d", light, wt, 0.4);
        if (tall) p.clip(body, ()=>p.band(R([
                [
                    cx - wt - 5 * u,
                    yb - ht + 0.07 * HH
                ],
                [
                    cx + wt + 5 * u,
                    yb - ht + 0.07 * HH
                ]
            ]), "#e8c45a", 0.06 * HH, 1.5 * u));
        p.poly(body, null, ow);
        const deg = a * 180 / Math.PI;
        if (side) {
            p.poly(R([
                [
                    cx + 36 * u,
                    yb - 1 * u
                ],
                [
                    cx + 60 * u,
                    yb + 8 * u
                ],
                [
                    cx + 34 * u,
                    yb + 6 * u
                ]
            ]), "#16171b", 2.5 * u);
            const [tx, ty] = R([
                [
                    cx + 24 * u,
                    yb - ht - 6 * u
                ]
            ])[0];
            p.ell(tx, ty, 7 * u, 7 * u, "#2b7a4b", 2.5 * u);
        } else {
            const [px, py] = R([
                [
                    cx + 3 * u * facing,
                    yb + 3 * u
                ]
            ])[0];
            p.ell(px, py, 34 * u, 0.045 * HH, "#16171b", 2.5 * u, 0, 180, deg);
            const [bx, by] = R([
                [
                    cx,
                    yb - 0.45 * ht
                ]
            ])[0];
            p.ell(bx, by, 7 * u, 6 * u, tall ? "#e8c45a" : "#c9ccd2", 2 * u, 0, 360, deg);
            p.arc(bx, by, 3.5 * u, 2.8 * u, 200, 500, 1.6 * u);
            const [tx, ty] = R([
                [
                    cx,
                    yb - ht - 6 * u
                ]
            ])[0];
            p.ell(tx, ty, 7 * u, 7 * u, "#2b7a4b", 2.5 * u);
        }
    } else if (o.hat === "cap" || o.hat === "hair") {
        const cut = crown + (o.hat === "cap" ? 0.3 : 0.42) * HH;
        const keep = (x, y)=>y < cut || side && o.hat === "hair" && x < cx - 6 * u && y < hc + 0.42 * H.b;
        const n = hp.length, startIdx = Math.max(0, hp.findIndex(([x, y], i)=>keep(x, y) && !keep(hp[(i + n - 1) % n][0], hp[(i + n - 1) % n][1])));
        const arc = [
            ...hp.slice(startIdx),
            ...hp.slice(0, startIdx)
        ].filter(([x, y])=>keep(x, y)).map(([x, y])=>[
                cx + (x - cx) * 1.03,
                hc + (y - hc) * 1.03
            ]);
        if (arc.length < 3) return;
        if (o.hat === "hair") {
            const [x0, y0] = arc[arc.length - 1], [x1, y1] = arc[0];
            for(let i = 1; i < 6; i++)arc.push([
                x0 + (x1 - x0) * i / 6,
                y0 + (y1 - y0) * i / 6 + (i % 2 ? 4 * u : 0)
            ]);
        }
        const col = o.hat === "cap" ? o.cap : o.hair;
        p.shadedFill(arc, col, mul(col, SH_FELT), light, H.a, 0.35);
        p.poly(arc, null, ow);
        if (o.hat === "hair") {
            const s = side ? -1 : facing || 1;
            p.stroke([
                [
                    cx + s * 10 * u,
                    cut - 30 * u
                ],
                [
                    cx + s * 2 * u,
                    cut - 12 * u
                ]
            ], 1.2 * u);
        }
        if (o.hat === "cap") {
            const deg = a * 180 / Math.PI;
            if (side) p.poly(R([
                [
                    cx + 40 * u,
                    cut - 2 * u
                ],
                [
                    cx + 74 * u,
                    cut + 4 * u
                ],
                [
                    cx + 40 * u,
                    cut + 6 * u
                ]
            ]), shade(col, 0.8), ow);
            else {
                const s = facing || (rnd(seed, 21) < 0.5 ? -1 : 1), [px, py] = R([
                    [
                        cx + s * 4 * u,
                        cut + 1.5 * u
                    ]
                ])[0];
                p.ell(px, py, 32 * u, 0.06 * HH, shade(col, 0.8), ow, 0, 180, deg);
            }
        }
    } else if (o.hat === "tophat") {
        const yb = crown + 0.22 * HH, ht = 0.8 * HH, wb = 0.31 * W, wt = 0.33 * W, col = "#2e2a36";
        const body = R([
            ...sag(yb, wb).reverse(),
            [
                cx - wt,
                yb - ht
            ],
            [
                cx + wt,
                yb - ht
            ]
        ]);
        p.shadedFill(body, col, mul(col, SH_FELT), light, wt, 0.4);
        p.clip(body, ()=>p.band(R([
                [
                    cx - wt - 4 * u,
                    yb - 0.13 * HH
                ],
                [
                    cx + wt + 4 * u,
                    yb - 0.13 * HH
                ]
            ]), shade(o.jacket, 0.9), 0.14 * HH, 0.8 * u));
        p.poly(body, null, ow);
        const [bx, by] = R([
            [
                cx,
                yb + 1 * u
            ]
        ])[0];
        p.ell(bx, by, 0.45 * W, 0.05 * HH, "#1d1b22", ow, 0, 360, a * 180 / Math.PI);
    } else if (o.hat === "bonnet") {
        const [bx, by] = R([
            [
                cx + (side ? 6 * u : 0),
                crown + 0.16 * HH
            ]
        ])[0];
        p.arc(bx, by, 0.5 * W, 0.2 * HH, 200, 340, 7 * u, BONNET_BRIM);
        p.arc(bx, by, 0.5 * W + 3.5 * u, 0.2 * HH + 3.5 * u, 200, 340, 1.2 * u);
        const cy = hc + H.b * 0.98;
        p.stroke([
            [
                cx - 14 * u,
                cy - 4 * u
            ],
            [
                cx,
                cy + 2 * u
            ],
            [
                cx + 14 * u,
                cy - 4 * u
            ]
        ], 2 * u, BONNET_BRIM);
    }
};
const BUILD = {
    adult: {
        a: 118,
        torso: 1.1,
        legs: 1.4,
        tw: 0.8
    },
    stout: {
        a: 118,
        torso: 1.15,
        legs: 1.32,
        tw: 0.92
    },
    kid: {
        a: 112,
        torso: 0.85,
        legs: 1.0,
        tw: 0.72
    }
};
const footStroke = (p, a, b, w, col)=>{
    if (col !== INK) p.stroke([
        a,
        b
    ], w + 3, INK);
    p.stroke([
        a,
        b
    ], w, col);
};
export const bodyFront = (p, o, opts)=>{
    const { phase = 0, expr = "neutral", mode = "march", look = 0, blink = false, lift = 60, prop = null, tilt = 0, headTilt = 0, wave, light = DEF_LIGHT, facing = 0, seed = 1 } = opts;
    const Bd = BUILD[o.build ?? "adult"], skin = o.skin ?? SKIN, two = Math.PI * 2, lid = lidOf(blink);
    const H = headBlob(seed, Bd.a, facing), W = 2 * H.a, HH = 2 * H.b, u = W / 100;
    const tall = (1 + Bd.torso + Bd.legs) * HH, sole = 975;
    const bob = mode === "march" ? 0.025 * tall * Math.cos(2 * two * phase) : mode === "stroll" ? 0.015 * tall * Math.cos(2 * two * phase) : 0;
    const torsoBot = mode === "sit" ? sole - 0.2 * HH : sole - Bd.legs * HH + bob;
    const chin = torsoBot - Bd.torso * HH, hc = chin - H.b, crown = hc - H.b, hipY = torsoBot - 0.12 * HH;
    const thick = thickAngle(light), ow = 5 * u;
    const legCol = mix(o.pants, INK, 0.55), armCol = mix(o.jacket, INK, 0.5), footCol = o.boots;
    const legW = 5.8 * u, footW = 7.5 * u;
    p.rot = null;
    if (mode === "sit") {
        for (const side of [
            -1,
            1
        ]){
            const h = [
                300 + side * 15 * u,
                hipY
            ], k = [
                300 + side * 36 * u,
                hipY + 0.2 * HH
            ], f = [
                300 + side * 44 * u,
                sole - 8 * u
            ];
            p.stroke(curve(h, k, f), legW, legCol);
            footStroke(p, [
                f[0] - side * 2 * u,
                f[1]
            ], [
                f[0] + side * 12 * u,
                f[1] - 5 * u
            ], footW, footCol);
        }
    } else if (mode === "fall") {
        const legs = [
            [
                [
                    300 - 15 * u,
                    hipY
                ],
                [
                    300 - 46 * u,
                    hipY + 0.5 * HH
                ],
                [
                    300 - 70 * u,
                    hipY + 0.72 * HH
                ]
            ],
            [
                [
                    300 + 15 * u,
                    hipY
                ],
                [
                    300 + 50 * u,
                    hipY + 0.45 * HH
                ],
                [
                    300 + 76 * u,
                    hipY + 0.22 * HH
                ]
            ]
        ];
        legs.forEach(([h, k, f], i)=>{
            p.stroke(curve(h, k, f), legW, legCol);
            footStroke(p, f, [
                f[0] + (i ? 14 : -14) * u,
                f[1] + (i ? -6 : 4) * u
            ], footW, footCol);
        });
    } else if (o.dress) {
        for (const side of [
            -1,
            1
        ]){
            const fx = 300 + side * 12 * u, fy = sole - 4 * u;
            p.stroke([
                [
                    fx,
                    sole - 0.4 * HH
                ],
                [
                    fx + side * u,
                    fy
                ]
            ], legW, legCol);
            footStroke(p, [
                fx - side * 3 * u,
                fy
            ], [
                fx + side * 12 * u,
                fy + u
            ], footW, footCol);
        }
    } else {
        const L = mode === "march" ? lift * 1.25 : mode === "stroll" ? lift * 0.55 : 0;
        for (const [side, ph] of [
            [
                -1,
                0
            ],
            [
                1,
                0.5
            ]
        ]){
            const up = Math.max(0, Math.sin(two * (phase + ph))) * L;
            const hx = 300 + side * 15 * u, fx = 300 + side * 22 * u, fy = sole - 4 * u - up;
            const k = [
                (hx + fx) / 2 + side * (1.5 * u + up * 0.16),
                (hipY + fy) / 2 - up * 0.08
            ];
            p.stroke(curve([
                hx,
                hipY
            ], k, [
                fx,
                fy
            ]), legW, legCol);
            footStroke(p, [
                fx - side * 3 * u,
                fy
            ], [
                fx + side * 13 * u,
                fy + 0.5 * u
            ], footW, footCol);
        }
    }
    const sway = mode === "march" ? 1.6 * Math.sin(two * phase) : mode === "stroll" ? 1.0 * Math.sin(two * phase) : 0;
    const A = tilt + sway;
    p.rot = A ? [
        rad(A),
        300,
        hipY
    ] : null;
    const dress = !!o.dress && mode !== "sit" && mode !== "fall";
    const T = {
        a: Bd.tw / 2 * W / 1.06,
        b: 0.5 * (torsoBot - (chin - 0.25 * HH)),
        nTop: 2.2,
        nBot: 2.6,
        egg: o.build === "stout" ? 0.17 : 0.12,
        asym: 0.04 * facing,
        rot: 0,
        noise: 0.006,
        seed: seed + 7
    };
    const tcx = 300 + 3 * u * facing, tcy = torsoBot - T.b, tp = blobPts(tcx, tcy, T);
    const sh = (side)=>[
            tcx + side * 0.85 * T.a,
            chin + 0.12 * HH
        ];
    const hang = (side, fwd)=>{
        const S = sh(side), ex = tcx + side * (1.12 * T.a + 4 * u);
        const hx = ex + side * 3 * u - side * 6 * u * Math.max(0, fwd) + side * 4 * u * Math.max(0, -fwd);
        return [
            S,
            [
                ex,
                S[1] + 0.48 * HH
            ],
            [
                hx,
                chin + 1.04 * HH - Math.abs(fwd) * 9 * u
            ]
        ];
    };
    const sw = mode === "march" || mode === "stroll" ? Math.sin(two * phase) : 0;
    const R0 = [
        300 + 47 * u,
        torsoBot + 0.12 * HH
    ], R1 = [
        300 + 64 * u,
        crown - 0.32 * HH
    ];
    const rifle = !!o.rifle && (mode === "march" || mode === "stand" || mode === "stroll");
    const arms = [];
    if (mode === "sit") for (const side of [
        -1,
        1
    ])arms.push({
        pts: [
            sh(side),
            [
                tcx + side * (1.1 * T.a + 6 * u),
                sh(side)[1] + 0.4 * HH
            ],
            [
                tcx + side * (1.2 * T.a + 10 * u),
                torsoBot + 0.04 * HH
            ]
        ],
        front: false
    });
    else if (mode === "fall") for (const side of [
        -1,
        1
    ])arms.push({
        pts: [
            sh(side),
            [
                tcx + side * (1.15 * T.a + 12 * u),
                sh(side)[1] - 0.25 * HH
            ],
            [
                tcx + side * (1.3 * T.a + 24 * u),
                sh(side)[1] - 0.68 * HH
            ]
        ],
        front: false
    });
    else {
        arms.push({
            pts: prop === "shako" ? hang(-1, 0) : hang(-1, -sw),
            front: false
        });
        if (rifle) {
            const G = lerp2(R0, R1, 0.1);
            arms.push({
                pts: [
                    sh(1),
                    [
                        tcx + 1.12 * T.a + 5 * u,
                        sh(1)[1] + 0.45 * HH
                    ],
                    G
                ],
                front: false
            });
        } else if (wave !== undefined) {
            const S = sh(1);
            arms.push({
                pts: [
                    S,
                    [
                        tcx + 1.1 * T.a + 10 * u + 3 * u * wave,
                        S[1] - 0.22 * HH
                    ],
                    [
                        tcx + 1.18 * T.a + 16 * u + 12 * u * wave,
                        S[1] - 0.6 * HH
                    ]
                ],
                front: false
            });
        } else if (prop === "icecream") {
            const S = sh(1);
            arms.push({
                pts: [
                    S,
                    [
                        tcx + 1.05 * T.a + 4 * u,
                        S[1] + 0.45 * HH
                    ],
                    [
                        tcx + 0.5 * T.a,
                        S[1] + 0.4 * HH
                    ]
                ],
                front: true
            });
        } else if (Array.isArray(prop)) {
            const S = sh(1), k = clamp(prop[1], 0, 1);
            const E = lerp2([
                tcx + 1.1 * T.a + 10 * u,
                S[1] - 0.15 * HH
            ], [
                tcx + 1.2 * T.a + 10 * u,
                S[1] + 0.3 * HH
            ], k);
            const Hd = lerp2([
                tcx + 1.15 * T.a + 14 * u,
                S[1] - 0.55 * HH
            ], [
                tcx + 1.45 * T.a + 22 * u,
                S[1] + 0.35 * HH
            ], k);
            arms.push({
                pts: [
                    S,
                    E,
                    Hd
                ],
                front: true
            });
        } else arms.push({
            pts: hang(1, sw),
            front: false
        });
    }
    const drawArm = (a)=>{
        p.stroke(curve(a.pts[0], a.pts[1], a.pts[2]), 5.2 * u, armCol);
        p.dot(a.pts[2][0], a.pts[2][1], 5.5 * u);
    };
    if (rifle) {
        p.band([
            R0,
            R1
        ], "#7a4b2a", 5 * u, 1.5 * u, "round");
        p.band([
            lerp2(R0, R1, 0.6),
            R1
        ], "#8d949c", 2.4 * u, 1.2 * u, "round");
    }
    if (o.sword && mode !== "sit") {
        const s0 = [
            tcx - 0.75 * T.a,
            torsoBot - 0.2 * HH
        ];
        p.band([
            s0,
            [
                s0[0] - Math.sin(rad(25)) * 0.8 * HH,
                s0[1] + Math.cos(rad(25)) * 0.8 * HH
            ]
        ], "#c9ccd2", 3 * u, 1.2 * u, "round");
    }
    for (const a of arms)if (!a.front) drawArm(a);
    if (dress) {
        const D = {
            a: 0.5 * W * 0.98,
            b: 0.5 * (sole - 0.35 * HH - (chin - 0.2 * HH)),
            nTop: 2.0,
            nBot: 3.0,
            egg: 0.35,
            asym: 0.03 * facing,
            rot: 0,
            noise: 0.006,
            seed: seed + 9
        };
        const dp = blobPts(300, sole - 0.35 * HH - D.b, D);
        p.gradFill(dp, o.dress, mul(o.dress, SH_CLOTH), light);
        p.inkRing(dp, ow, thick);
        const Sw = {
            a: 0.37 * W,
            b: 0.3 * HH,
            nTop: 2.2,
            nBot: 2.4,
            egg: 0.1,
            asym: 0,
            rot: 0,
            noise: 0.006,
            seed: seed + 8
        };
        const sp = blobPts(300, chin + 0.12 * HH, Sw);
        p.gradFill(sp, o.jacket, mul(o.jacket, SH_CLOTH), light);
        p.inkRing(sp, ow * 0.9, thick);
    } else {
        p.gradFill(tp, o.jacket, mul(o.jacket, SH_CLOTH), light);
        p.clip(tp, ()=>{
            if (o.belt) {
                for (const s of [
                    -1,
                    1
                ])p.band([
                    [
                        tcx - s * 0.75 * T.a,
                        chin - 0.05 * HH
                    ],
                    [
                        tcx + s * 0.8 * T.a,
                        torsoBot - 0.1 * HH
                    ]
                ], o.belt, 5.5 * u, 1.8 * u);
                const xc = tcx + 0.025 * T.a, yc = chin - 0.05 * HH + (torsoBot - 0.1 * HH - (chin - 0.05 * HH)) * (0.75 / 1.55);
                p.poly([
                    [
                        xc - 3.5 * u,
                        yc - 3.5 * u
                    ],
                    [
                        xc + 3.5 * u,
                        yc - 3.5 * u
                    ],
                    [
                        xc + 3.5 * u,
                        yc + 3.5 * u
                    ],
                    [
                        xc - 3.5 * u,
                        yc + 3.5 * u
                    ]
                ], "#d9dde0", 1.5 * u);
            }
            if (o.sash) p.band([
                [
                    tcx - 1.3 * T.a,
                    torsoBot - 0.32 * HH
                ],
                [
                    tcx + 1.3 * T.a,
                    torsoBot - 0.32 * HH
                ]
            ], o.sash, 0.13 * HH, 1.8 * u);
            for(let i = 0; i < 4; i++){
                const y = chin + 0.12 * HH + i * 0.2 * HH;
                if (o.sash && Math.abs(y - (torsoBot - 0.32 * HH)) < 0.08 * HH) continue;
                p.dot(tcx + 2 * u * facing, y, 2.2 * u + 0.8 * u, INK);
                p.dot(tcx + 2 * u * facing, y, 2.2 * u, o.buttons ?? shade(o.jacket, 0.7));
            }
        });
        if (o.sash) {
            const s = facing || 1;
            p.poly([
                [
                    tcx + s * 0.55 * T.a,
                    torsoBot - 0.3 * HH
                ],
                [
                    tcx + s * 0.75 * T.a,
                    torsoBot + 0.05 * HH
                ],
                [
                    tcx + s * 0.45 * T.a,
                    torsoBot + 0.02 * HH
                ]
            ], o.sash, 1.6 * u);
        }
        p.inkRing(tp, ow, thick);
    }
    for (const a of arms)if (a.front) {
        drawArm(a);
        const [hx, hy] = a.pts[2];
        if (prop === "icecream") {
            p.poly([
                [
                    hx - 8 * u,
                    hy - 12 * u
                ],
                [
                    hx + 8 * u,
                    hy - 12 * u
                ],
                [
                    hx,
                    hy + 7 * u
                ]
            ], "#e0a35a", 1.8 * u);
            p.ell(hx, hy - 19 * u, 11 * u, 10 * u, "#f7c6d9", 2.2 * u);
            p.dot(hx, hy, 5.5 * u);
        } else if (Array.isArray(prop)) {
            const ang = rad(-70 + 105 * clamp(prop[1], 0, 1));
            const Rh = (pts)=>rotPts(pts, ang, hx, hy);
            p.band(Rh([
                [
                    hx,
                    hy + 12 * u
                ],
                [
                    hx,
                    hy - 44 * u
                ]
            ]), "#8a5a34", 5 * u, 1.5 * u, "round");
            p.poly(Rh([
                [
                    hx - 12 * u,
                    hy - 58 * u
                ],
                [
                    hx + 20 * u,
                    hy - 58 * u
                ],
                [
                    hx + 20 * u,
                    hy - 42 * u
                ],
                [
                    hx - 12 * u,
                    hy - 42 * u
                ]
            ]), "#7d848c", 2.2 * u);
            p.dot(hx, hy, 5.5 * u);
        }
    }
    if (prop === "shako") {
        const [hx, hy] = arms[0].pts[2];
        p.poly([
            [
                hx - 14 * u,
                hy + 3 * u
            ],
            [
                hx + 14 * u,
                hy + 3 * u
            ],
            [
                hx + 16 * u,
                hy + 30 * u
            ],
            [
                hx - 16 * u,
                hy + 30 * u
            ]
        ], "#3a3d47", 2.2 * u);
        p.ell(hx, hy + 31 * u, 3.5 * u, 3.5 * u, "#2b7a4b", 1.5 * u);
        p.dot(hx, hy, 5.5 * u);
    }
    const Ah = A + headTilt, [cpx, cpy] = rotAbout([
        300,
        chin
    ], rad(A), [
        300,
        hipY
    ]);
    p.rot = Ah ? [
        rad(Ah),
        300,
        chin,
        cpx - 300,
        cpy - chin
    ] : null;
    hatBehind(p, o, H, 300, hc, light, thick, ow, false);
    const hp = blobPts(300, hc, H);
    p.shadedFill(hp, skin, mul(skin, SH_SKIN), light, H.a);
    p.inkRing(hp, ow, thick);
    hatOn(p, o, hp, H, 300, hc, light, seed, facing, false);
    const brim = !!o.hat && o.hat !== "hair" && o.hat !== "bonnet" && o.hat !== "cap";
    faceFront(p, 300, hc, W, expr, facing, look, lid, brim, skin, o.moustache, o.build === "stout");
    p.rot = null;
};
const ik = (hip, ank, l1, l2)=>{
    const dx = ank[0] - hip[0], dy = ank[1] - hip[1], d = clamp(Math.hypot(dx, dy), 1, l1 + l2 - 0.01);
    const A = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1)), k = Math.atan2(dy, dx) - A;
    return [
        hip[0] + l1 * Math.cos(k),
        hip[1] + l1 * Math.sin(k)
    ];
};
const SWING_HIP = 733;
export const bodySide = (p, o, opts)=>{
    const { phase = 0, expr = "neutral", mode = "march", blink = false, stomp = 1, pose = 0, stride = 1, light = DEF_LIGHT, seed = 1 } = opts;
    const Bd = BUILD[o.build ?? "adult"], skin = o.skin ?? SKIN, two = Math.PI * 2, lid = lidOf(blink);
    const H = {
        ...headBlob(seed, Bd.a, 1),
        asym: 0.12,
        rot: rad(3 + 3 * (rnd(seed, 7) - 0.5))
    };
    const W = 2 * H.a, HH = 2 * H.b, u = W / 100, sole = 975, ankY = sole - 4 * u;
    const thick = thickAngle(light), ow = 5 * u;
    const legLen = (Bd.legs + 0.12) * HH - 4 * u, l1 = legLen / 2, l2 = legLen / 2;
    const nearCol = mix(o.pants, INK, 0.55), farCol = mix(o.pants, INK, 0.75), footCol = o.boots;
    const legs = [];
    let hipY = ankY - legLen * 0.995, lean = 0, nearFwd = 0;
    if (mode === "march") {
        const S = 370 * stride, liftH = Math.max(22, 40 + 70 * (stomp - 1));
        const st = (ph)=>{
            const c = ((phase + ph) % 1 + 1) % 1;
            if (c < 0.5) {
                const s = c / 0.5;
                return {
                    x: S / 2 - S * s,
                    h: 0,
                    stance: true,
                    s
                };
            }
            const s = (c - 0.5) / 0.5;
            return {
                x: -S / 2 + S * s - S / Math.PI * Math.sin(2 * Math.PI * s),
                h: liftH * Math.sin(Math.PI * s),
                stance: false,
                s
            };
        };
        const nL = st(0), fL = st(0.5), stance = nL.stance ? nL : fL;
        const Leff = legLen * (1 - 0.035 * Math.sin(Math.PI * stance.s));
        hipY = ankY - Math.sqrt(Math.max(1, Leff * Leff - stance.x * stance.x));
        for (const [L, near] of [
            [
                fL,
                false
            ],
            [
                nL,
                true
            ]
        ])legs.push({
            ank: [
                300 + L.x,
                ankY - L.h
            ],
            pitch: L.stance ? 0 : rad(35 * Math.sin(Math.PI * L.s) * (1 - 1.6 * L.s)),
            near
        });
        lean = 4 + 3 * Math.cos(2 * two * phase);
        nearFwd = nL.x / (S / 2);
    } else if (mode === "push") {
        hipY = ankY - 0.87 * legLen;
        legs.push({
            ank: [
                300 - 0.5 * legLen,
                ankY
            ],
            pitch: rad(-8),
            near: false
        }, {
            ank: [
                300 + 0.32 * legLen,
                ankY
            ],
            pitch: 0,
            near: true
        });
        lean = 14 * pose;
    } else if (mode === "swing") {
        hipY = SWING_HIP;
        const a = rad(60 * pose);
        for (const [dx, near] of [
            [
                -6,
                false
            ],
            [
                0,
                true
            ]
        ]){
            const knee = [
                300 + l1 * 0.98 + dx * u,
                hipY + 6 * u
            ];
            legs.push({
                ank: [
                    knee[0] + l2 * Math.sin(a),
                    knee[1] + l2 * Math.cos(a)
                ],
                pitch: -a * 0.5,
                near
            });
        }
    } else {
        legs.push({
            ank: [
                300 - 4 * u,
                ankY
            ],
            pitch: 0,
            near: false
        }, {
            ank: [
                300 + 4 * u,
                ankY
            ],
            pitch: 0,
            near: true
        });
    }
    const torsoBot = hipY + 0.12 * HH, chin = torsoBot - Bd.torso * HH, hc = chin - H.b, crown = hc - H.b, hip = [
        300,
        hipY
    ];
    p.rot = null;
    for (const L of legs){
        const knee = mode === "swing" ? [
            300 + l1 * 0.98 + (L.near ? 0 : -6 * u),
            hipY + 6 * u
        ] : ik(hip, L.ank, l1, l2);
        const hp0 = [
            300 + (L.near ? 0 : -5 * u),
            hipY
        ];
        p.stroke([
            hp0,
            knee,
            L.ank
        ], 5.8 * u, L.near ? nearCol : farCol);
        const c = Math.cos(L.pitch), s = Math.sin(L.pitch);
        footStroke(p, [
            L.ank[0] - 3 * u * c,
            L.ank[1] - 3 * u * s
        ], [
            L.ank[0] + 13 * u * c,
            L.ank[1] + 13 * u * s + 0.5 * u
        ], 7.5 * u, L.near ? footCol : footCol === INK ? INK : shade(footCol, 0.82));
    }
    p.rot = lean ? [
        rad(lean),
        300,
        hipY
    ] : null;
    const T = {
        a: (o.build === "stout" ? 0.36 : 0.31) * W,
        b: 0.5 * (torsoBot - (chin - 0.25 * HH)),
        nTop: 2.2,
        nBot: 2.5,
        egg: 0.1,
        asym: 0.06,
        rot: 0,
        noise: 0.006,
        seed: seed + 7
    };
    const tcx = 300 + 2 * u, tcy = torsoBot - T.b, tp = blobPts(tcx, tcy, T);
    const armCol = mix(o.jacket, INK, 0.5), farArm = mix(o.jacket, INK, 0.68);
    const S = [
        tcx + 0.05 * T.a,
        chin + 0.14 * HH
    ], aLen = 0.95 * HH;
    const swingArm = (ang)=>{
        const e = [
            S[0] + Math.sin(ang) * aLen * 0.5,
            S[1] + Math.cos(ang) * aLen * 0.5
        ], a2 = ang + rad(16) * Math.sign(ang || 1);
        return [
            S,
            e,
            [
                e[0] + Math.sin(a2) * aLen * 0.5,
                e[1] + Math.cos(a2) * aLen * 0.5
            ]
        ];
    };
    const rifle = !!o.rifle && (mode === "march" || mode === "stand");
    const B0 = [
        tcx + 0.72 * T.a,
        chin + 0.58 * HH
    ], B1 = [
        tcx - 0.95 * T.a - 22 * u,
        crown - 0.4 * HH
    ];
    let near, far;
    if (mode === "swing") {
        near = [
            S,
            [
                S[0] + 12 * u,
                S[1] - 0.16 * HH
            ],
            [
                300 + 6 * u,
                chin - 0.3 * HH
            ]
        ];
        far = [
            S,
            [
                S[0] + 8 * u,
                S[1] - 0.18 * HH
            ],
            [
                300 + 2 * u,
                chin - 0.36 * HH
            ]
        ];
    } else if (mode === "push") {
        const reach = 0.55 * HH + 0.45 * HH * pose;
        let hN = [
            S[0] + reach,
            S[1] + 0.06 * HH
        ];
        if (opts.hand) {
            const th = -rad(lean), dx = opts.hand[0] - 300, dy = opts.hand[1] - hipY;
            const tg = [
                300 + dx * Math.cos(th) - dy * Math.sin(th),
                hipY + dx * Math.sin(th) + dy * Math.cos(th)
            ];
            hN = [
                hN[0] + (tg[0] - hN[0]) * pose,
                hN[1] + (tg[1] - hN[1]) * pose
            ];
        }
        near = [
            S,
            [
                (S[0] + hN[0]) / 2,
                (S[1] + hN[1]) / 2 + 0.06 * HH
            ],
            hN
        ];
        far = [
            S,
            [
                (S[0] + hN[0]) / 2 - 4 * u,
                (S[1] + hN[1]) / 2 - 0.02 * HH
            ],
            [
                hN[0] - 6 * u,
                hN[1] - 0.08 * HH
            ]
        ];
    } else if (rifle) {
        near = [
            S,
            [
                S[0] - 4 * u,
                S[1] + 0.42 * HH
            ],
            B0
        ];
        far = mode === "march" ? swingArm(rad(30) * nearFwd) : swingArm(0);
    } else {
        near = swingArm(rad(-30) * nearFwd);
        far = mode === "march" ? swingArm(rad(30) * nearFwd) : null;
    }
    if (far) {
        p.stroke(curve(far[0], far[1], far[2]), 5.2 * u, farArm);
        p.dot(far[2][0], far[2][1], 5.5 * u);
    }
    p.gradFill(tp, o.jacket, mul(o.jacket, SH_CLOTH), light);
    p.clip(tp, ()=>{
        if (o.belt) p.band([
            [
                tcx - 0.65 * T.a,
                chin - 0.05 * HH
            ],
            [
                tcx + 0.75 * T.a,
                torsoBot - 0.1 * HH
            ]
        ], o.belt, 5.5 * u, 1.8 * u);
        if (o.sash) p.band([
            [
                tcx - 1.3 * T.a,
                torsoBot - 0.32 * HH
            ],
            [
                tcx + 1.3 * T.a,
                torsoBot - 0.32 * HH
            ]
        ], o.sash, 0.13 * HH, 1.8 * u);
        if (!o.dress) for(let i = 0; i < 3; i++){
            const y = chin + 0.16 * HH + i * 0.24 * HH;
            p.dot(tcx + 0.8 * T.a, y, 3 * u, INK);
            p.dot(tcx + 0.8 * T.a, y, 2.2 * u, o.buttons ?? shade(o.jacket, 0.7));
        }
    });
    p.inkRing(tp, ow, thick);
    if (rifle) {
        p.band([
            B0,
            B1
        ], "#7a4b2a", 5 * u, 1.5 * u, "round");
        p.band([
            lerp2(B0, B1, 0.6),
            B1
        ], "#8d949c", 2.4 * u, 1.2 * u, "round");
    }
    p.stroke(curve(near[0], near[1], near[2]), 5.2 * u, armCol);
    p.dot(near[2][0], near[2][1], 5.5 * u);
    const hx = 300 + 4 * u;
    hatBehind(p, o, H, hx, hc, light, thick, ow, true);
    const hp = blobPts(hx, hc, H);
    p.shadedFill(hp, skin, mul(skin, SH_SKIN), light, H.a);
    p.inkRing(hp, ow, thick);
    hatOn(p, o, hp, H, hx, hc, light, seed, 1, true);
    const brim = !!o.hat && o.hat !== "hair" && o.hat !== "bonnet" && o.hat !== "cap";
    faceSide(p, hx, hc, W, expr, lid, brim, skin, o.moustache, o.build === "stout");
    p.rot = null;
};
export const swingKid = (p, o, kick, expr, light = DEF_LIGHT, blink = 0)=>{
    const rope = 1830, k = 1.1, HH = 2 * headBlob(5, BUILD[o.build ?? "adult"].a, 1).b;
    const seat = rope + 18, x0 = 150, x1 = 550;
    p.line([
        [
            350,
            20
        ],
        [
            x0 + 16,
            seat + 4
        ]
    ], "#a07a4c", 10);
    p.poly(rrect(x0, seat, x1, seat + 36, 10), "#b5653f", 9);
    const g = p.g;
    g.save();
    g.translate(350 - 300 * k, rope + 18 - (SWING_HIP + 0.12 * HH) * k);
    g.scale(k, k);
    bodySide(new Pen(g), o, {
        expr,
        mode: "swing",
        pose: kick,
        light,
        seed: 5,
        blink
    });
    g.restore();
    p.line([
        [
            350,
            20
        ],
        [
            x1 - 16,
            seat + 4
        ]
    ], "#a07a4c", 10);
};
export const fxNote = (p, kind, col = "#1f2a44")=>{
    p.ell(70, 200, 46, 34, col, 8, 0, 360, -20);
    p.stroke([
        [
            110,
            190
        ],
        [
            110,
            40
        ]
    ], 14);
    if (kind === 0) p.poly([
        [
            110,
            40
        ],
        [
            170,
            70
        ],
        [
            170,
            110
        ],
        [
            110,
            82
        ]
    ], col, 8);
    else {
        p.ell(150, 170, 40, 30, col, 8, 0, 360, -20);
        p.stroke([
            [
                186,
                160
            ],
            [
                186,
                20
            ]
        ], 14);
        p.poly([
            [
                110,
                40
            ],
            [
                186,
                20
            ],
            [
                186,
                50
            ],
            [
                110,
                70
            ]
        ], col, 8);
    }
};
export const fxBurst = (p, t, col = "#fff3b0", rays = 10, r0 = 40, r1 = 230)=>{
    const c = 250, e = 1 - (1 - t) ** 3;
    for(let i = 0; i < rays; i++){
        const a = rad(i * 360 / rays + 7 * (i % 2)), ra = r0 + (r1 - r0) * e * (0.75 + 0.25 * (i % 2));
        p.poly([
            [
                c + r0 * 0.5 * Math.cos(a + 0.18),
                c + r0 * 0.5 * Math.sin(a + 0.18)
            ],
            [
                c + ra * Math.cos(a),
                c + ra * Math.sin(a)
            ],
            [
                c + r0 * 0.5 * Math.cos(a - 0.18),
                c + r0 * 0.5 * Math.sin(a - 0.18)
            ]
        ], col, Math.max(3, 8 * (1 - t)));
    }
    if (t < 0.5) p.ell(c, c, r0 * (1.4 - t), r0 * (1.4 - t), WHITE, 8);
};
export const fxSplash = (p, t)=>{
    const c = 400, size = 800, rise = Math.sin(Math.min(1, t * 1.3) * Math.PI);
    const blue = "#bfe8ff", deep = "#6cc0f0";
    if (rise > 0.02) {
        const pts = [];
        for(let i = 0; i < 19; i++){
            const h = (i % 2 ? 260 : 130) * rise * (0.7 + 0.3 * Math.sin(i * 1.7));
            pts.push([
                c - 330 + 660 * i / 18,
                size - 120 - h
            ]);
        }
        p.poly([
            ...pts,
            [
                c + 330,
                size - 90
            ],
            [
                c - 330,
                size - 90
            ]
        ], blue, 10);
        p.ell(c, size - 100, 360, 46, deep, 10);
    }
    for(let i = 0; i < 8; i++){
        const a = rad(200 + i * 18), d = 120 + 380 * t, y = size - 160 + d * Math.sin(a) + 520 * t * t, r = 26 * (1 - t) + 6;
        if (t > 0.08 && y < size - 40) p.ell(c + d * Math.cos(a), y, r, r * 1.25, blue, 7);
    }
};
export const fxPuff = (p, t)=>{
    for(let i = 0; i < 5; i++){
        const a = rad(160 + i * 55), d = 40 + 70 * t, r = (34 + 20 * (i % 2)) * (1 - 0.6 * t);
        p.ell(150 + d * Math.cos(a), 180 + d * 0.45 * Math.sin(a), r, r * 0.8, `rgba(238,225,205,${(1 - t).toFixed(3)})`, 0);
    }
};
export const fxStars = (p, t)=>{
    for(let i = 0; i < 4; i++){
        const a = t * Math.PI * 2 + i * Math.PI / 2, x = 210 + 150 * Math.cos(a), y = 110 + 40 * Math.sin(a), pts = [];
        for(let k = 0; k < 10; k++){
            const r = k % 2 ? 14 : 34, b = rad(k * 36 - 90);
            pts.push([
                x + r * Math.cos(b),
                y + r * Math.sin(b)
            ]);
        }
        p.poly(pts, "#ffd84a", 6);
    }
};
export const fxCreak = (p, t)=>{
    const j = 6 * Math.sin(t * 40);
    for (const a of [
        -30,
        0,
        30
    ]){
        const b = rad(a - 90);
        p.stroke([
            [
                150 + 70 * Math.cos(b) + j,
                230 + 70 * Math.sin(b)
            ],
            [
                150 + 100 * Math.cos(b) + 10 + j,
                230 + 100 * Math.sin(b)
            ],
            [
                150 + 130 * Math.cos(b) + j,
                230 + 130 * Math.sin(b)
            ]
        ], 10);
    }
};
export const fxRing = (p, t)=>{
    const g = p.g;
    for(let k = 0; k < 3; k++){
        const u = t - k * 0.22;
        if (u <= 0 || u >= 1) continue;
        g.beginPath();
        g.ellipse(300, 300, 60 + 230 * u, 60 + 230 * u, 0, 0, Math.PI * 2);
        g.strokeStyle = k === 0 ? "#f6fcff" : "#cfe8fa";
        g.lineWidth = 9 * (1 - u) + 3;
        g.stroke();
    }
};
export const fxSign = (p)=>{
    const g = p.g, RED = "#d42f2f";
    p.poly(rrect(14, 14, 686, 506, 40), "#f6ecd2", 0);
    p.poly(rrect(14, 14, 686, 506, 40), null, 14);
    p.poly(rrect(70, 352, 630, 384, 8), "#8a5a3a", 9);
    g.beginPath();
    g.moveTo(112, 470);
    g.quadraticCurveTo(350, 300, 588, 470);
    g.strokeStyle = INK;
    g.lineWidth = 16;
    g.lineCap = "round";
    g.stroke();
    for (const x of [
        88,
        612
    ])p.poly(rrect(x - 16, 384, x + 16, 470, 4), "#8a5a3a", 9);
    for (const x of [
        150,
        278,
        406,
        534
    ]){
        p.poly(rrect(x - 30, 150, x + 30, 214, 14), "#357650", 9);
        p.stroke([
            [
                x - 8,
                210
            ],
            [
                x + 34,
                262
            ],
            [
                x + 46,
                338
            ]
        ], 15, INK);
        p.stroke([
            [
                x + 6,
                210
            ],
            [
                x - 12,
                274
            ],
            [
                x - 36,
                336
            ]
        ], 15, INK);
        p.poly(rrect(x + 30, 330, x + 74, 350, 9), INK, 0);
        p.poly(rrect(x - 52, 328, x - 8, 348, 9), INK, 0);
    }
    for (const [a, b] of [
        [
            [
                96,
                70
            ],
            [
                604,
                452
            ]
        ],
        [
            [
                604,
                70
            ],
            [
                96,
                452
            ]
        ]
    ]){
        p.stroke([
            a,
            b
        ], 58, "#ffffff");
        p.stroke([
            a,
            b
        ], 42, RED);
    }
};
export const fxCloud = (p, seed)=>{
    const blobs = [
        [
            150,
            190,
            80
        ],
        [
            250,
            150,
            105
        ],
        [
            360,
            160,
            95
        ],
        [
            450,
            195,
            70
        ],
        [
            300,
            210,
            90
        ]
    ];
    for (const [x, y, r] of blobs)p.ell(x + seed * 37 % 20 - 10, y, r, r * 0.8, "#ffffff", 0);
    p.ell(300, 235, 230, 40, "#ffffff", 0);
};
export const fxShadow = (p, col)=>{
    const g = p.g;
    g.fillStyle = WHITE;
    g.fillRect(0, 0, 128, 256);
    g.save();
    g.filter = "blur(9px)";
    const lg = g.createLinearGradient(0, 205, 0, 22);
    lg.addColorStop(0, mix(col, WHITE, 0.08));
    lg.addColorStop(0.55, mix(col, WHITE, 0.3));
    lg.addColorStop(1, mix(col, WHITE, 0.85));
    g.fillStyle = lg;
    g.beginPath();
    g.moveTo(40, 205);
    g.bezierCurveTo(36, 120, 46, 50, 64, 30);
    g.bezierCurveTo(82, 50, 92, 120, 88, 205);
    g.closePath();
    g.fill();
    g.fillStyle = col;
    g.beginPath();
    g.ellipse(64, 205, 30, 17, 0, 0, Math.PI * 2);
    g.fill();
    g.restore();
};
export const fxContact = (p, col)=>{
    const g = p.g;
    g.fillStyle = WHITE;
    g.fillRect(0, 0, 128, 128);
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    for (const [r, k] of [
        [
            0,
            0
        ],
        [
            0.32,
            0.02
        ],
        [
            0.5,
            0.22
        ],
        [
            0.66,
            0.58
        ],
        [
            0.82,
            0.88
        ],
        [
            1,
            1
        ]
    ])gr.addColorStop(r, mix(col, WHITE, k));
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
};
export const fxPlank = (p)=>{
    p.poly(rrect(14, 30, 306, 78, 10), "#a8744a", 9);
    p.line([
        [
            40,
            46
        ],
        [
            150,
            44
        ],
        [
            270,
            50
        ]
    ], "#7d5234", 4);
    p.line([
        [
            60,
            62
        ],
        [
            200,
            64
        ],
        [
            284,
            60
        ]
    ], "#7d5234", 4);
    p.dot(36, 54, 5, INK);
    p.dot(284, 54, 5, INK);
};
export const fxDrum = (p)=>{
    p.poly(rrect(40, 70, 220, 190, 16), "#f1ece0", 9);
    p.poly(rrect(32, 58, 228, 86, 12), "#c9373a", 8);
    p.poly(rrect(32, 176, 228, 204, 12), "#c9373a", 8);
    p.line([
        [
            52,
            88
        ],
        [
            82,
            172
        ],
        [
            112,
            88
        ],
        [
            142,
            172
        ],
        [
            172,
            88
        ],
        [
            202,
            172
        ]
    ], INK, 6);
    p.ell(130, 58, 98, 18, "#f7f3ea", 8);
};
export const fxBlob = (p, col)=>{
    const g = p.g;
    g.fillStyle = WHITE;
    g.fillRect(0, 0, 128, 128);
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    for (const [r, k] of [
        [
            0,
            0
        ],
        [
            0.5,
            0.04
        ],
        [
            0.64,
            0.18
        ],
        [
            0.76,
            0.42
        ],
        [
            0.87,
            0.72
        ],
        [
            0.95,
            0.92
        ],
        [
            1,
            1
        ]
    ])gr.addColorStop(r, mix(col, WHITE, k));
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
};
FACE.snore = { eye: ["dash", "dash"], brow: [0, -1], mouth: "o" };
FACE.stubborn = { eye: ["lid", "lid"], brow: [4, -3], mouth: "frown" };
FACE.squint = { eye: ["slit", "slit"], brow: [3, -2], mouth: "dash" };

// ---------------- Roman-era cast (our own designs), built on the Pen / blob / face helpers above ----------------
const STEEL = "#aeb6bf", BRASS = "#d9a845", LEATHER = "#7a4a2a";
export const OUTFITS = {
  legion: { tunic: "#b8322f", cape: "#8f2228", skin: SKIN, helmet: true, armor: true, spear: true, shield: true },
  old: { tunic: "#9c4a3c", cape: "#6e3330", skin: "#f3d6bb", helmet: "old", armor: true, spear: true, shield: false, beard: "#f4f1ea", brows: "#f4f1ea" },
  toga: { tunic: "#f1ead8", skin: "#f5c9a0", toga: "#6b3c8f", hair: "#3b2a20", stout: true },
  civA: { tunic: "#4f7fb8", skin: "#f5c9a0", hair: "#5a3b2a" },
  civB: { tunic: "#d9a441", skin: SKIN, hair: "#2b211c", dress: "#c25a7a" },
  civC: { tunic: "#5d8a3a", skin: "#c99067", hair: "#1e1714", stout: true },
  workA: { tunic: "#8a5d3b", skin: "#f5c9a0", cap: "#c2733a", apron: "#d8c9a6" },
  workB: { tunic: "#3f6a6f", skin: "#ecd0b6", cap: "#5b4a8a", moustache: "#4a3020" },
};

/** galea: iron bowl, brass brow band, cheek guards, transverse red crest */
const galea = (p, H, cx, hc, light, thick, ow, old, u) => {
  const crest = old ? "#8d4b3f" : "#d2372f", bowl = old ? "#8f8a7e" : STEEL;
  // crest (behind the bowl top)
  const cy0 = hc - H.b * 0.98;
  const cr = ellPts(cx, cy0, 0.66 * 2 * H.a, 0.42 * 2 * H.b, 180, 360, 0, 40);
  cr.push([cx + 0.66 * 2 * H.a * 0.98, cy0 + 4 * u], [cx - 0.66 * 2 * H.a * 0.98, cy0 + 4 * u]);
  const crP = [...ellPts(cx, cy0 + 2 * u, 0.62 * 2 * H.a, 0.36 * 2 * H.b, 180, 360, 0, 40)];
  p.shadedFill(crP, crest, mul(crest, [0.7, 0.62, 0.7]), light, 0.62 * 2 * H.a, 0.3);
  p.clip(crP, () => { for (let i = -9; i <= 9; i++) p.stroke([[cx + i * 7.4 * u, cy0], [cx + i * 9.4 * u, cy0 - 0.62 * H.b * Math.cos(i / 11)]], 1.4 * u, mul(crest, [0.62, 0.55, 0.62])); });
  if (old) p.clip(crP, () => { for (let i = 0; i < 6; i++) p.ell(cx + (i - 3) * 22 * u, cy0 - 18 * u - (i % 2) * 10 * u, 9 * u, 5 * u, "#6f6a5e", 0); });
  p.inkRing(crP, ow * 0.85, thick);
  p.poly(rrect(cx - 10 * u, cy0 - 6 * u, cx + 10 * u, cy0 + 6 * u, 3 * u), BRASS, 2 * u);
  // bowl: upper head cap
  const bandY = hc - H.b * 0.42;
  const bp = ellPts(cx, bandY, H.a * 1.05, H.b * 0.66, 180, 360, 0, 48);
  p.shadedFill(bp, bowl, mul(bowl, [0.62, 0.64, 0.72]), light, H.a, 0.4);
  p.clip(bp, () => {
    p.stroke(ellPts(cx - 20 * u, bandY - 0.3 * H.b, 0.25 * H.a, 0.18 * H.b, 200, 300, 0, 16), 4 * u, "#ffffff55");
    if (old) for (let i = 0; i < 9; i++) p.ell(cx + Math.sin(i * 2.3) * 0.8 * H.a, bandY - (0.08 + 0.5 * ((i * 0.37) % 1)) * H.b, (3 + (i % 3) * 2) * u, (2 + (i % 2)) * u, "#8a4b22", 0);
  });
  p.inkRing(bp, ow * 0.9, thick);
  p.band([[cx - H.a * 1.04, bandY], [cx + H.a * 1.04, bandY]], old ? "#a88a4a" : BRASS, 7 * u, 1.8 * u, "round");
  for (const s of [-1, 1]) p.dot(cx + s * 0.55 * H.a, bandY, 2.2 * u, "#fff3c4");
};
const cheeks = (p, H, cx, hc, light, ow, old, u) => {
  const bowl = old ? "#8f8a7e" : STEEL;
  for (const s of [-1, 1]) {
    const x0 = cx + s * 0.78 * H.a, x1 = cx + s * 1.07 * H.a, y0 = hc - H.b * 0.42, y1 = hc + H.b * 0.48;
    const pts = [[x0, y0], [x1, y0], [x1 - s * 0.04 * H.a, y1 - 0.1 * H.b], [x0 + s * 0.06 * H.a, y1], [x0 - s * 0.05 * H.a, (y0 + y1) / 2]];
    p.shadedFill(pts, bowl, mul(bowl, [0.62, 0.64, 0.72]), light, 0.2 * H.a, 0.3);
    p.poly(pts, null, ow * 0.8);
    p.dot((x0 + x1) / 2, (y0 + y1) / 2 - 0.05 * H.b, 2.2 * u, BRASS);
  }
};
const cobweb = (p, cx, cy, r, u) => {
  const g = p.g; g.save(); g.globalAlpha = 0.8;
  for (let i = 0; i < 7; i++) { const a = -Math.PI * (0.05 + 0.9 * i / 6); p.stroke([[cx, cy], [cx + Math.cos(a) * r, cy + Math.sin(a) * r]], 1.1 * u, "#f2f2f2"); }
  for (let k = 1; k <= 4; k++) { const rr = r * k / 4.3, pts = []; for (let i = 0; i < 7; i++) { const a = -Math.PI * (0.05 + 0.9 * i / 6); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } p.stroke(pts, 1 * u, "#f2f2f2"); }
  g.restore();
};

/** front-facing Roman-era character. opts: expr, blink, look, facing, seed, L/R arm poses, tilt, headTilt, bob, nohelmet, light */
export const romanFront = (p, key, opts = {}) => {
  const O = typeof key === "string" ? OUTFITS[key] : key;
  const { expr = "neutral", blink = 0, look = 0, facing = 0, seed = 3, L = "hang", R = O.spear ? "spear" : "hang", tilt = 0, headTilt = 0,
    bob = 0, nohelmet = false, light = rad(-120), web = false, step = 0, nohat = false, prop = null } = opts;
  const lid = lidOf(blink), skin = O.skin ?? SKIN;
  const H = headBlob(seed, 118, facing), W = 2 * H.a, HH = 2 * H.b, u = W / 100;
  const torsoL = (O.stout ? 1.12 : 1.08) * (O.torsoK || 1), legsL = (opts.sit ? 0.62 : 1.38) * (O.legK || 1), sole = 975;
  const torsoBot = sole - legsL * HH - bob * HH, chin = torsoBot - torsoL * HH, hc = chin - H.b, hipY = torsoBot - 0.12 * HH;
  const thick = thickAngle(light), ow = 5 * u, cx = 300;
  const legCol = O.pants || mix(O.tunic, INK, 0.62), armCol = O.sleeve || mix(O.tunic, INK, 0.5);
  const hatNow = !!O.hat && !nohat;
  const helmet = !!O.helmet && !nohelmet, old = O.helmet === "old";
  p.rot = null;
  // ---- cape behind everything ----
  if (O.cape) {
    const cp = [[cx - 0.48 * W, chin + 0.08 * HH], [cx + 0.48 * W, chin + 0.08 * HH], [cx + 0.62 * W, sole - 0.55 * HH], [cx + 0.2 * W, sole - 0.45 * HH], [cx - 0.2 * W, sole - 0.5 * HH], [cx - 0.62 * W, sole - 0.55 * HH]];
    p.gradFill(cp, O.cape, mul(O.cape, [0.6, 0.6, 0.7]), light); p.inkRing(cp, ow * 0.8, thick);
  }
  // ---- legs ----
  const dress = !!O.dress;
  for (const side of [-1, 1]) {
    const up = opts.hop === side ? 46 : Math.max(0, Math.sin(Math.PI * 2 * (step + (side > 0 ? 0.5 : 0)))) * (opts.run ? 52 : 30) * (step ? 1 : 0);
    const hx = cx + side * 16 * u, fx = cx + side * 22 * u, fy = sole - 4 * u - up;
    p.stroke(curve([hx, hipY], [(hx + fx) / 2 + side * 2 * u, (hipY + fy) / 2], [fx, fy]), 5.8 * u, legCol);
    const sandal = O.boots || O.shoe || (O.helmet ? LEATHER : "#5a3b2a");
    if (O.boots) { p.stroke([[fx, fy - 0.16 * HH], [fx, fy - 2 * u]], 8.5 * u + 3, INK); p.stroke([[fx, fy - 0.16 * HH], [fx, fy - 2 * u]], 8.5 * u, O.boots); }
    p.stroke([[fx - side * 3 * u, fy], [fx + side * 13 * u, fy + 0.5 * u]], 7.5 * u + 3, INK);
    p.stroke([[fx - side * 3 * u, fy], [fx + side * 13 * u, fy + 0.5 * u]], 7.5 * u, sandal);
    if (O.helmet) for (let k = 1; k <= 3; k++) p.stroke([[fx - 4 * u, fy - k * 0.07 * HH], [fx + 4 * u, fy - k * 0.07 * HH - 2 * u]], 2 * u, LEATHER);
  }
  // ---- upper body ----
  p.rot = tilt ? [rad(tilt), cx, hipY] : null;
  const T = { a: (0.4 * W) / 1.06 * (O.stout ? 1.12 : O.thin ? 0.82 : 1), b: 0.5 * (torsoBot - (chin - 0.25 * HH)), nTop: 2.2, nBot: 2.6, egg: O.stout ? 0.17 : 0.12, asym: 0.04 * facing, rot: 0, noise: 0.006, seed: seed + 7 };
  const tcx = cx + 3 * u * facing, tcy = torsoBot - T.b, tp = blobPts(tcx, tcy, T);
  const S = (side) => [tcx + side * 0.85 * T.a, chin + 0.12 * HH];
  const arm = (side, pose) => {
    const s = S(side), X = (k) => tcx + side * (T.a * 1.1 + k * u);
    switch (pose) {
      case "spear": return { pts: [s, [X(6), s[1] + 0.42 * HH], [X(10), s[1] + 0.2 * HH]], front: false };
      case "point": return { pts: [s, [X(28), s[1] - 0.02 * HH], [X(62), s[1] - 0.1 * HH]], front: false, finger: true };
      case "up": return { pts: [s, [X(14), s[1] - 0.3 * HH], [X(22), s[1] - 0.75 * HH]], front: false };
      case "wave": return { pts: [s, [X(16), s[1] - 0.2 * HH], [X(30 + 10 * Math.sin(opts.wv || 0)), s[1] - 0.62 * HH]], front: false };
      case "hip": return { pts: [s, [X(22), s[1] + 0.3 * HH], [tcx + side * T.a * 0.95, torsoBot - 0.3 * HH]], front: false };
      case "belly": return { pts: [s, [X(8), s[1] + 0.45 * HH], [tcx + side * 0.25 * T.a, torsoBot - 0.35 * HH]], front: true };
      case "temple": return { pts: [s, [X(26), s[1] + 0.05 * HH], [cx + side * (H.a + 16 * u), hc - 0.1 * HH]], front: false, swirl: true };
      case "lift": return { pts: [s, [X(20), s[1] - 0.25 * HH], [X(4), s[1] - 0.82 * HH]], front: false };
      case "shield": return { pts: [s, [X(4), s[1] + 0.4 * HH], [tcx + side * 0.6 * T.a, torsoBot - 0.1 * HH]], front: true };
      case "cross": return { pts: [s, [X(2), s[1] + 0.38 * HH], [tcx - side * 0.45 * T.a, s[1] + 0.32 * HH]], front: true };
      case "reach": { const lf = (opts.lift || 0) * 0.62 * HH; return { pts: [s, [X(42), s[1] - 0.12 * HH - lf * 0.6], [X(82), s[1] - 0.5 * HH - lf]], front: false }; }
      case "cheek": return { pts: [s, [X(16), s[1] + 0.05 * HH], [cx + side * (H.a + 2 * u), hc + 0.25 * H.b]], front: false };
      case "thumb": return { pts: [s, [X(20), s[1] + 0.12 * HH], [X(44), s[1] - 0.12 * HH]], front: false, thumb: true };
      case "salute": return { pts: [s, [X(16), s[1] - 0.22 * HH], [cx + side * 0.62 * H.a, hc - 0.62 * H.b]], front: false, late: true, flat: true };
      case "palm": return { pts: [s, [X(10), s[1] - 0.05 * HH], [cx + side * 0.12 * H.a + 7 * u * facing, hc - 0.12 * H.b]], front: false, late: true, big: true };
      case "tele": return { pts: [s, [X(12), s[1] - 0.12 * HH], [cx + side * 0.36 * H.a + 7 * u * facing, hc + 0.3 * H.b]], front: false, late: true };
      case "aimR": return { pts: [s, [X(26), s[1] + 0.06 * HH], [X(58), s[1] - 0.06 * HH]], front: false };
      case "aimL": return { pts: [s, [tcx + 0.1 * T.a, s[1] + 0.3 * HH], [tcx + 1.1 * T.a + 22 * u, s[1] + 0.02 * HH]], front: true };
      case "offer": return { pts: [s, [X(20), s[1] + 0.2 * HH], [X(38), s[1] + 0.06 * HH]], front: false };
      case "toast": return { pts: [s, [X(22), s[1] - 0.05 * HH], [X(14), s[1] - 0.5 * HH]], front: false };
      case "out": return { pts: [s, [X(30), s[1] + 0.1 * HH], [X(62), s[1] + 0.12 * HH]], front: false };
      case "across": return { pts: [s, [tcx + side * 0.2 * T.a, s[1] + 0.32 * HH], [tcx - side * (1.1 * T.a + 34 * u), s[1] + 0.14 * HH]], front: true };
      case "fist": { const sh = opts.shake || 0; return { pts: [s, [X(20), s[1] - 0.2 * HH], [X(10 + sh * 6), s[1] - 0.7 * HH + sh * 4 * u]], front: false, fist: true }; }
      case "run": { const sw = Math.sin(Math.PI * 2 * ((opts.ph || 0) + (side > 0 ? 0.5 : 0))) * (opts.runK ?? 1); return { pts: [s, [X(20 - 4 * sw), s[1] + 0.34 * HH + sw * 0.06 * HH], [X(3 - 6 * sw), s[1] + 0.06 * HH - sw * 0.24 * HH]], front: false }; }
      case "flop": { const sw = Math.sin(Math.PI * 2 * ((opts.ph || 0) * 0.5 + (side > 0 ? 0.3 : 0))); return { pts: [s, [X(16 + 6 * sw), s[1] + 0.4 * HH], [X(20 + 12 * sw), s[1] + 0.82 * HH]], front: false }; }
      case "shrug": return { pts: [s, [X(26), s[1] + 0.12 * HH], [X(40), s[1] - 0.18 * HH]], front: false, big: false };
      case "calf": return { pts: [s, [X(16), s[1] + 0.5 * HH], [tcx + side * 0.7 * T.a, torsoBot + 0.55 * HH]], front: true };
      case "shade": return { pts: [s, [X(18), s[1] - 0.1 * HH], [cx + side * 0.5 * H.a, hc - 0.55 * H.b]], front: false, late: true, flat: true };
      case "hold": return { pts: [s, [X(14), s[1] + 0.32 * HH], [X(26), s[1] + 0.02 * HH]], front: false };
      case "feed": return { pts: [s, [X(22), s[1] + 0.05 * HH], [cx + side * (H.a * 0.55), hc + 0.55 * H.b]], front: false, late: true };
      case "crown": return { pts: [s, [X(20), s[1] - 0.25 * HH], [cx + side * (0.9 * H.a) + (opts.reachX || 0) * u, hc - (opts.reachY ?? 1.05) * H.b]], front: false, late: true };
      case "pointDown": return { pts: [s, [X(16), s[1] + 0.36 * HH], [X(26), s[1] + 0.8 * HH]], front: false, finger: true };
      case "flap": { const k = opts.flap || 0; return { pts: [s, [X(26), s[1] - k * 0.25 * HH], [X(44), s[1] - k * 0.55 * HH + 0.1 * HH]], front: false }; }
      default: return { pts: [s, [X(4), s[1] + 0.48 * HH], [X(3), chin + 1.04 * HH]], front: false };
    }
  };
  const arms = [arm(-1, L), arm(1, R)];
  const drawArm = (a) => {
    p.stroke(curve(a.pts[0], a.pts[1], a.pts[2]), 5.2 * u, armCol);
    const [hx, hy] = a.pts[2];
    if (a.flat) p.ell(hx, hy, 14 * u, 6.5 * u, O.glove || skin, 2.4 * u, 0, 360, -25 * Math.sign(hx - cx)); else if (a.big) p.ell(hx, hy, 17 * u, 19 * u, O.glove || (O.skin ?? SKIN), 2.4 * u); else p.dot(hx, hy, (a.fist ? 7.5 : 5.5) * u);
    if (a.finger) { const dx = a.pts[2][0] - a.pts[1][0], dy = a.pts[2][1] - a.pts[1][1], l = Math.hypot(dx, dy); p.stroke([[hx, hy], [hx + dx / l * 14 * u, hy + dy / l * 14 * u]], 2.6 * u); }
    if (a.thumb) p.stroke([[hx, hy], [hx + Math.sign(hx - cx) * 6 * u, hy - 12 * u]], 2.6 * u);
  };
  // spear behind
  if (O.spear && R === "spear") {
    const [hx, hy] = arms[1].pts[2], s0 = [hx + 2 * u, sole - 2 * u], s1 = [hx - 3 * u, 70];
    p.band([s0, s1], old ? "#6d5236" : "#8a5a34", 4.2 * u, 1.4 * u, "round");
    const tip = [[s1[0] - 7 * u, s1[1] + 6 * u], [s1[0], s1[1] - 34 * u], [s1[0] + 7 * u, s1[1] + 6 * u], [s1[0], s1[1] + 14 * u]];
    p.poly(tip, old ? "#8b7c6a" : "#c9cfd6", 2 * u);
    if (web) cobweb(p, s1[0] - 2 * u, s1[1] + 60 * u, 70 * u, u);
  }
  for (const a of arms) if (!a.front && !a.late) drawArm(a);
  // torso
  if (dress) {
    const D = { a: 0.5 * W * 0.98, b: 0.5 * ((sole - 0.35 * HH) - (chin - 0.2 * HH)), nTop: 2.0, nBot: 3.0, egg: 0.35, asym: 0, rot: 0, noise: 0.006, seed: seed + 9 };
    const dp = blobPts(cx, sole - 0.35 * HH - D.b, D);
    p.gradFill(dp, O.dress, mul(O.dress, SH_CLOTH), light); p.inkRing(dp, ow, thick);
  }
  // skirt / pteruges below the torso
  if (!dress) {
    const sk = [[tcx - 0.92 * T.a, torsoBot - 0.2 * HH], [tcx + 0.92 * T.a, torsoBot - 0.2 * HH], [tcx + 1.0 * T.a, torsoBot + 0.3 * HH], [tcx - 1.0 * T.a, torsoBot + 0.3 * HH]];
    if (O.shorts) { const sc = O.shorts, y0 = torsoBot - 0.2 * HH, y1 = torsoBot + 0.34 * HH;
      for (const sd of [-1, 1]) { const lg = [[tcx + sd * 0.02 * T.a, y0], [tcx + sd * 0.92 * T.a, y0], [tcx + sd * 0.86 * T.a, y1], [tcx + sd * 0.12 * T.a, y1 - 0.02 * HH]]; p.gradFill(lg, sc, mul(sc, SH_CLOTH), light); p.poly(lg, null, ow * 0.7); }
      const wb = [[tcx - 0.92 * T.a, y0], [tcx + 0.92 * T.a, y0], [tcx + 0.9 * T.a, y0 + 0.12 * HH], [tcx - 0.9 * T.a, y0 + 0.12 * HH]]; p.gradFill(wb, sc, mul(sc, SH_CLOTH), light); p.poly(wb, null, ow * 0.7); }
    else { p.gradFill(sk, O.tunic, mul(O.tunic, SH_CLOTH), light); p.poly(sk, null, ow * 0.8); }
    if (O.armor) for (let i = -3; i <= 3; i++) { const x = tcx + i * 0.27 * T.a, st = [[x - 9 * u, torsoBot - 0.05 * HH], [x + 9 * u, torsoBot - 0.05 * HH], [x + 9 * u, torsoBot + 0.22 * HH], [x - 9 * u, torsoBot + 0.22 * HH]]; p.poly(st, old ? "#5e4632" : LEATHER, 1.6 * u); }
  }
  p.gradFill(tp, O.tunic, mul(O.tunic, SH_CLOTH), light);
  p.clip(tp, () => {
    if (O.armor) {
      const top = chin - 0.1 * HH, bot = torsoBot - 0.25 * HH, n = 5;
      for (let i = 0; i < n; i++) {
        const y0 = top + (bot - top) * i / n, y1 = top + (bot - top) * (i + 1) / n;
        const c = old ? (i % 2 ? "#8d8679" : "#9a9384") : (i % 2 ? "#a7b0ba" : "#bcc4cc");
        p.poly([[tcx - 1.5 * T.a, y0], [tcx + 1.5 * T.a, y0 + 3 * u], [tcx + 1.5 * T.a, y1 + 3 * u], [tcx - 1.5 * T.a, y1]], c, 1.8 * u);
      }
      p.band([[tcx - 1.4 * T.a, torsoBot - 0.2 * HH], [tcx + 1.4 * T.a, torsoBot - 0.2 * HH]], LEATHER, 0.08 * HH, 1.5 * u);
      for (let i = -2; i <= 2; i++) p.dot(tcx + i * 0.3 * T.a, torsoBot - 0.2 * HH, 2.4 * u, BRASS);
      if (old) for (let i = 0; i < 5; i++) p.ell(tcx + Math.sin(i * 1.7) * 0.7 * T.a, top + (bot - top) * ((i * 0.31) % 1), 6 * u, 3 * u, "#8a4b22", 0);
    } else {
      p.band([[tcx - 1.4 * T.a, torsoBot - 0.24 * HH], [tcx + 1.4 * T.a, torsoBot - 0.24 * HH]], O.apron ? "#5a3b2a" : "#e2c27a", 0.05 * HH, 1.2 * u);
      if (O.toga) p.band([[tcx - 1.0 * T.a, chin - 0.1 * HH], [tcx + 1.1 * T.a, torsoBot - 0.1 * HH]], O.toga, 0.16 * HH, 1.6 * u);
      if (O.apron) p.poly([[tcx - 0.55 * T.a, torsoBot - 0.2 * HH], [tcx + 0.55 * T.a, torsoBot - 0.2 * HH], [tcx + 0.6 * T.a, torsoBot + 0.2 * HH], [tcx - 0.6 * T.a, torsoBot + 0.2 * HH]], O.apron, 1.6 * u);
      p.stroke([[tcx - 0.2 * T.a, chin + 0.02 * HH], [tcx, chin + 0.16 * HH], [tcx + 0.2 * T.a, chin + 0.02 * HH]], 2 * u);
    }
  });
  if (O.uniform || O.overalls) aussieTorso(p, O, tp, tcx, T, chin, torsoBot, HH, u, light);
  p.inkRing(tp, ow, thick);
  if (O.armor) for (const s of [-1, 1]) { // shoulder plates
    const sp = ellPts(tcx + s * 0.72 * T.a, chin + 0.1 * HH, 0.42 * T.a, 0.13 * HH, 180, 360, s * 8, 20);
    p.poly(sp, old ? "#9a9384" : "#c5ccd3", 1.8 * u);
  }
  if (O.moss) {/* reserved */}
  if (O.after) castAfter(p, O, tcx, T, chin, torsoBot, HH, u, light, thick, ow);
  for (const a of arms) if (a.front && !a.late) drawArm(a);
  // shield in front, held by the left hand
  if (O.shield && L === "shield") {
    const sx = tcx - 0.55 * T.a, sy = torsoBot + 0.05 * HH, sw = 0.36 * W, sh = 0.78 * HH;
    const sp = rrect(sx - sw, sy - sh, sx + sw, sy + sh, 8 * u);
    p.gradFill(sp, "#c0302c", "#7d1d22", light);
    p.clip(sp, () => {
      p.band([[sx - sw, sy], [sx + sw, sy]], BRASS, 6 * u, 1.2 * u);
      p.band([[sx, sy - sh], [sx, sy + sh]], BRASS, 6 * u, 1.2 * u);
      for (const s of [-1, 1]) { p.stroke([[sx + s * 12 * u, sy - 14 * u], [sx + s * 34 * u, sy - 46 * u], [sx + s * 22 * u, sy - 44 * u], [sx + s * 46 * u, sy - 74 * u]], 3.5 * u, BRASS); p.stroke([[sx + s * 12 * u, sy + 14 * u], [sx + s * 34 * u, sy + 46 * u], [sx + s * 22 * u, sy + 44 * u], [sx + s * 46 * u, sy + 74 * u]], 3.5 * u, BRASS); }
      p.stroke(ellPts(sx - sw * 0.5, sy - sh * 0.7, sw * 0.3, sh * 0.1, 200, 320, 0, 10), 3 * u, "#ffffff44");
    });
    p.ell(sx, sy, 13 * u, 13 * u, "#e6c068", 2.2 * u);
    p.inkRing(sp, ow, thick);
  }
  if (prop) aussieProp(p, prop, arms, u, opts);
  // ---- head ----
  const [cpx, cpy] = rotAbout([cx, chin], rad(tilt), [cx, hipY]);
  const Ah = tilt + headTilt;
  p.rot = Ah ? [rad(Ah), cx, chin, cpx - cx, cpy - chin] : null;
  if (helmet) galea(p, H, cx, hc, light, thick, ow, old, u);
  const hp = blobPts(cx, hc, H);
  if (O.hair && !helmet && !hatNow) { const hb = blobPts(cx, hc - 0.03 * HH, { ...H, a: H.a * 1.04, b: H.b * 1.05 }); p.poly(hb, O.hair, 0); }
  if (O.bob) { const bb = blobPts(cx, hc + 0.05 * HH, { ...H, a: H.a * 1.15, b: H.b * 0.98, nBot: 3.4 }); p.shadedFill(bb, O.bob, mul(O.bob, [0.7, 0.68, 0.75]), light, H.a * 1.2); p.inkRing(bb, ow * 0.9, thick);
    p.clip(bb, () => { for (let i = -6; i <= 6; i++) p.stroke([[cx + i * 14 * u, hc - 0.3 * HH], [cx + i * 16 * u, hc + 0.6 * HH]], 1.4 * u, mul(O.bob, [0.8, 0.8, 0.85])); }); }
  p.shadedFill(hp, skin, mul(skin, SH_SKIN), light, H.a);
  p.inkRing(hp, ow, thick);
  if (helmet) {
    const bandY = hc - H.b * 0.42, bp = ellPts(cx, bandY, H.a * 1.05, H.b * 0.66, 180, 360, 0, 48);
    p.shadedFill(bp, old ? "#8f8a7e" : STEEL, mul(old ? "#8f8a7e" : STEEL, [0.62, 0.64, 0.72]), light, H.a, 0.4);
    p.clip(bp, () => { p.stroke(ellPts(cx - 20 * u, bandY - 0.3 * H.b, 0.25 * H.a, 0.18 * H.b, 200, 300, 0, 16), 5 * u, "#ffffff66");
      if (old) for (let i = 0; i < 9; i++) p.ell(cx + Math.sin(i * 2.3) * 0.8 * H.a, bandY - (0.08 + 0.5 * ((i * 0.37) % 1)) * H.b, (4 + (i % 3) * 2) * u, (2.5 + (i % 2)) * u, "#8a4b22", 0); });
    p.poly(bp, null, ow * 0.9);
    p.band([[cx - H.a * 1.05, bandY], [cx + H.a * 1.05, bandY]], old ? "#a88a4a" : BRASS, 7 * u, 1.8 * u, "round");
    p.poly(rrect(cx - 4 * u, bandY - 0.55 * H.b, cx + 4 * u, bandY - 3 * u, 2 * u), old ? "#a88a4a" : BRASS, 1.5 * u);
    cheeks(p, H, cx, hc, light, ow, old, u);
  } else if (hatNow) { if (O.hairUnder) hatOn(p, { hat: "hair", hair: O.hair, jacket: O.tunic }, hp, H, cx, hc, light, seed, facing, false); } else if (O.cap) hatOn(p, { hat: "cap", cap: O.cap, jacket: O.tunic }, hp, H, cx, hc, light, seed, facing, false);
  else if (O.hair) hatOn(p, { hat: "hair", hair: O.hair, jacket: O.tunic }, hp, H, cx, hc, light, seed, facing, false);
  else if (O.helmet && nohelmet) { // bald old head with white side tufts
    for (const s of [-1, 1]) p.ell(cx + s * 0.9 * H.a, hc - 0.1 * H.b, 0.22 * H.a, 0.3 * H.b, "#f4f1ea", 3 * u);
  }
  if (O.beard) {
    const bk_ = O.beardK || 1; const bd = blobPts(cx + 6 * u * facing, hc + (0.85 - (1 - bk_) * 0.6) * H.b, { a: 0.62 * H.a * (bk_ < 1 ? 1.15 : 1), b: 0.75 * H.b * bk_, nTop: 2.4, nBot: 1.6, egg: -0.35, asym: 0, rot: 0, noise: 0.02, seed: seed + 4 });
    p.shadedFill(bd, O.beard, mul(O.beard, [0.86, 0.86, 0.92]), light, 0.6 * H.a, 0.3);
    p.clip(bd, () => { for (let i = -3; i <= 3; i++) p.stroke([[cx + i * 9 * u, hc + 0.45 * H.b], [cx + i * 7 * u, hc + 1.35 * H.b]], 1.2 * u, "#c9c4bb"); });
    p.inkRing(bd, ow * 0.8, thick);
  }
  if (hatNow) aussieHat(p, O, H, cx, hc, light, thick, ow, u);
  faceFront(p, cx, hc, W, expr, facing, look, lid, helmet || hatNow, skin, O.beard ? O.beard : O.moustache, !!O.stout);
  if (O.glasses) { const fx_ = cx + 7 * u * facing; for (const sd of [-1, 1]) p.ell(fx_ + sd * 13 * u, hc, 10.5 * u, 9.5 * u, null, 2.6 * u); p.stroke([[fx_ - 3 * u, hc - 1 * u], [fx_ + 3 * u, hc - 1 * u]], 2.4 * u); }
  if (O.blush) for (const sd of [-1, 1]) { const g_ = p.g; g_.save(); g_.globalAlpha = 0.35; p.ell(cx + 7 * u * facing + sd * 27 * u, hc + 14 * u, 9 * u, 5 * u, O.blush, 0); g_.restore(); }
  if (O.lashes && lid < 0.9 && !["happy", "dash", "squeeze", "spiral"].includes((FACE[expr] || FACE.neutral).eye[0])) for (const sd of [-1, 1]) { const ex_ = cx + 7 * u * facing + sd * 13 * u; for (let k = 0; k < 2; k++) p.stroke([[ex_ + sd * (5 + k * 2) * u, hc - (8 - k * 3) * u], [ex_ + sd * (11 + k * 3) * u, hc - (13 - k * 4) * u]], 2.2 * u); }
  for (const a of arms) if (a.late) drawArm(a);
  castLate(p, prop || null, arms, u, opts, cx, hc, H);
  if (O.brows) for (const s of [-1, 1]) p.ell(cx + 7 * u * facing + s * 14 * u, hc - 20 * u, 11 * u, 5 * u, O.brows, 2 * u);
  if (O.beard) { // re-draw the mouth over the beard for open mouths
    if (expr === "shock" || expr === "snore") p.ell(cx + 8 * u * facing, hc + 22 * u, 6 * u, 7 * u, "#5a1e28", 2 * u);
  }
  p.rot = null;
  if (arms.some((a) => a.swirl)) { // cuckoo swirl next to the temple
    const a = arms.find((x) => x.swirl), [hx, hy] = a.pts[2], ph = opts.swirl || 0, pts = [];
    for (let i = 0; i < 40; i++) { const t = i / 40 * Math.PI * 4 + ph, r = (4 + i * 0.7) * u; pts.push([hx + Math.cos(t) * r, hy - 40 * u + Math.sin(t) * r]); }
    p.stroke(pts, 3 * u, "#ffffff"); p.stroke(pts, 1.4 * u, INK);
  }
};

/** loose helmet prop card (lifted off the old soldier) */
export const helmetCard = (p) => {
  const H = headBlob(3, 118, 0), u = 2 * H.a / 100, hc = 560, light = rad(-120), thick = thickAngle(light), ow = 5 * u;
  galea(p, H, 300, hc, light, thick, ow, true, u);
  const bandY = hc - H.b * 0.42, bp = ellPts(300, bandY, H.a * 1.05, H.b * 0.66, 180, 360, 0, 48);
  // dark inside visible from below
  p.ell(300, bandY, H.a * 1.05, 0.12 * H.b, "#2a221e", 0);
  p.shadedFill(bp, "#8f8a7e", mul("#8f8a7e", [0.62, 0.64, 0.72]), light, H.a, 0.4);
  p.clip(bp, () => { for (let i = 0; i < 9; i++) p.ell(300 + Math.sin(i * 2.3) * 0.8 * H.a, bandY - (0.08 + 0.5 * ((i * 0.37) % 1)) * H.b, (4 + (i % 3) * 2) * u, (2.5 + (i % 2)) * u, "#8a4b22", 0); });
  p.poly(bp, null, ow * 0.9);
  p.band([[300 - H.a * 1.05, bandY], [300 + H.a * 1.05, bandY]], "#a88a4a", 7 * u, 1.8 * u, "round");
  cheeks(p, H, 300, hc, light, ow, true, u);
};

/** ZZZ for the sleeping guard */
export const fxZ = (p, t) => {
  const g = p.g; g.save(); g.font = "900 120px Arial Black, Arial"; g.lineJoin = "round";
  for (let i = 0; i < 3; i++) {
    const k = (t + i / 3) % 1, x = 220 + i * 70 + Math.sin(k * 6) * 20, y = 700 - k * 500, s = 0.5 + k * 0.7;
    g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha = Math.min(1, (1 - k) * 2.5);
    g.lineWidth = 16; g.strokeStyle = INK; g.strokeText("Z", 0, 0); g.fillStyle = "#ffffff"; g.fillText("Z", 0, 0); g.restore();
  }
  g.restore();
};
/** falling leaf */
export const fxLeaf = (p, col) => { p.poly([[300, 380], [420, 470], [300, 620], [180, 470]], col, 14); p.stroke([[300, 400], [300, 600]], 8); };
/** dust cloud puff (k 0..1 growth) */
export const fxDust = (p, k, col = "#e8dcc4") => {
  const g = p.g; g.save(); g.globalAlpha = Math.max(0, 1 - k * k);
  for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2, r = 90 + 150 * k; p.ell(300 + Math.cos(a) * r, 520 + Math.sin(a) * r * 0.6, 120 + 60 * k, 100 + 50 * k, col, 12); }
  p.ell(300, 520, 170 + 110 * k, 140 + 80 * k, col, 0);
  g.restore();
};
export const fxDrip = (p) => p.ell(300, 500, 40, 64, "#9fd4ff", 10);
export const fxWood = (p, seed) => { p.poly([[200, 420], [400, 400], [420, 560], [230, 600]], "#5b3d22", 14); p.stroke([[240, 450], [380, 440]], 6, "#3a2614"); p.ell(330, 520, 26, 18, "#4d7a32", 0); };

export const headCenter = (seed = 3) => { const H = headBlob(seed, 118, 0), HH = 2 * H.b; return 975 - 1.38 * HH - 1.08 * HH - H.b; };

// ---------------- Vesna cast (our own designs) — appended after roman.js in toon.js ----------------
FACE.smug = { eye: ["lid", "lid"], brow: [-4, 3], mouth: "smirk" };
FACE.proud = { eye: ["happy", "happy"], brow: [-3, -3], mouth: "smileWide" };
FACE.yell = { eye: ["lid", "lid"], brow: [6, -3], mouth: "O" };
FACE.wink = { eye: ["dot", "happy"], brow: [-2, -4], mouth: "smileWide" };
FACE.sigh = { eye: ["dash", "dash"], brow: [-3, 3], mouth: "wave" };
FACE.cheer = { eye: ["happy", "happy"], brow: [-4, -4], mouth: "laugh" };
FACE.dizzy = { eye: ["spiral", "spiral"], brow: [-3, 2], mouth: "wave" };
FACE.jitter = { eye: ["shock", "shock"], brow: [-7, -6], mouth: "teeth" };
FACE.calm = { eye: ["happy", "happy"], brow: [-1, 1], mouth: "smile" };
FACE.sleep = { eye: ["dash", "dash"], brow: [0, 1], mouth: "o" };
FACE.puzzled = { eye: ["dot", "small"], brow: [5, -5], mouth: "wave" };
FACE.frown = { eye: ["lid", "lid"], brow: [5, -3], mouth: "frown" };
FACE.happy = { eye: ["dot", "dot"], brow: [-2, -2], mouth: "smileWide" };
const TURQ = "#1fa6a6", TURQ_D = "#147e80";
Object.assign(OUTFITS, {
  vesna: { tunic: TURQ, sleeve: "#1c9898", dress: TURQ, pants: "#efc6a4", skin: "#f7d3b4", hat: "pillbox", hatCol: TURQ, uniform: "stew", hair: "#3a2418", bob: "#3a2418", hairUnder: true, lashes: true, blush: "#ff8a8a", tag: "VESNA" },
  vesna2: { tunic: TURQ, sleeve: "#1c9898", dress: TURQ, pants: "#efc6a4", skin: "#f3cfae", hat: "pillbox", hatCol: TURQ, uniform: "stew", hair: "#e8c062", bob: "#e8c062", hairUnder: true, lashes: true, blush: "#ff8a8a", tag: "VESNA", glasses: "#7a3a2a" },
  vesnaOld: { tunic: "#2d3f86", sleeve: "#2a3a7c", dress: "#2d3f86", pants: "#e8c2a2", skin: "#f3cdb0", uniform: "blouse", hair: "#7a6a64", bob: "#7a6a64", lashes: true, blush: "#ff8a8a" },
  vesnaTeen: { tunic: "#f2c23c", sleeve: "#e8b630", dress: "#f2c23c", pants: "#f7d3b4", skin: "#f7d3b4", uniform: "teen", hair: "#3a2418", bob: "#3a2418", lashes: true, blush: "#ff8a8a" },
  vesnaExam: { tunic: "#e0607a", sleeve: "#d45670", dress: "#e0607a", pants: "#f7d3b4", skin: "#f7d3b4", uniform: "teen", hair: "#3a2418", bob: "#3a2418", lashes: true, blush: "#ff8a8a" },
  medic: { tunic: "#6b4e36", sleeve: "#5d432e", pants: "#3e3a40", boots: "#2a201c", skin: "#efc29c", hat: "ushanka", hatCol: "#8a7460", uniform: "coat", hair: "#c9c4bb", moustache: "#e6e1d8", stout: true },
  doc: { tunic: "#f4f6f4", sleeve: "#eef0ee", pants: "#3f4a5a", boots: "#221c1c", skin: "#f0c8a6", hat: "mirror", hatCol: "#c9ccd0", uniform: "lab", hair: "#b9b4ac", moustache: "#9a948c", glasses: "#2a2a30" },
  doc2: { tunic: "#f4f6f4", sleeve: "#eef0ee", dress: "#5f7aa0", pants: "#e8c2a2", skin: "#c99067", uniform: "lab", hair: "#1e1714", bob: "#1e1714", lashes: true },
  examDoc: { tunic: "#f4f6f4", sleeve: "#eef0ee", pants: "#5a4a3a", boots: "#221c1c", skin: "#f3d6bb", uniform: "lab", hair: "#5a3b2a", moustache: "#5a3b2a", glasses: "#2a2a30", stout: true },
});
const GOLD = "#e3b23c", GOLD_D = "#a97c1e";

/** hats drawn over the head (called by romanFront when O.hat) */
const aussieHat = (p, O, H, cx, hc, light, thick, ow, u, lift = 0) => {
  const col = O.hatCol || "#333", dark = mul(col, [0.66, 0.66, 0.72]);
  if (O.hat === "pillbox") { // small tilted 1970s stewardess pillbox, perched back on the head
    const x0 = cx + 0.12 * H.a, top = hc - 1.24 * H.b - lift, bot = hc - 0.82 * H.b - lift, w = 0.62 * H.a;
    const body = [[x0 - w, bot], [x0 - w * 0.96, top + 0.05 * H.b], [x0 + w * 0.96, top - 0.03 * H.b], [x0 + w, bot - 0.08 * H.b]];
    const g = p.g; g.save(); if (p.rot === null) { g.translate(x0, bot); g.rotate(rad(7)); g.translate(-x0, -bot); }
    p.shadedFill(body, col, dark, light, w, 0.35); p.inkRing(body, ow * 0.85, thick);
    p.ell(x0, top + 0.01 * H.b, w * 0.97, 0.1 * H.b, mul(col, [1.15, 1.12, 1.1]), ow * 0.6);
    p.band([[x0 - w, bot - 0.08 * H.b], [x0 + w, bot - 0.14 * H.b]], "#f4f1ea", 0.07 * H.b, 1 * u);
    // little gold wings badge
    const by_ = (top + bot) / 2 + 0.02 * H.b; p.poly([[x0 - 14 * u, by_], [x0 - 3 * u, by_ - 4 * u], [x0, by_ + 2 * u], [x0 + 3 * u, by_ - 4 * u], [x0 + 14 * u, by_], [x0, by_ + 6 * u]], GOLD, 1.2 * u);
    g.restore(); return;
  }
  if (O.hat === "ushanka") { // fur trapper hat with ear flaps down
    const top = hc - 1.42 * H.b - lift, by = hc - 0.36 * H.b - lift;
    for (const s of [-1, 1]) { const fl = [[cx + s * 0.78 * H.a, by - 0.1 * H.b], [cx + s * 1.08 * H.a, by], [cx + s * 1.06 * H.a, hc + 0.42 * H.b], [cx + s * 0.86 * H.a, hc + 0.5 * H.b], [cx + s * 0.76 * H.a, hc + 0.1 * H.b]];
      p.shadedFill(fl, col, dark, light, 0.3 * H.a, 0.3); p.clip(fl, () => { for (let k = 0; k < 8; k++) p.stroke([[cx + s * (0.8 + 0.03 * k) * H.a, by + k * 0.1 * H.b], [cx + s * (0.86 + 0.03 * k) * H.a, by + k * 0.1 * H.b + 6 * u]], 1.4 * u, "#00000030"); }); p.inkRing(fl, ow * 0.8, thick); }
    const dome = []; for (let i = 0; i <= 30; i++) { const a = Math.PI + Math.PI * i / 30; dome.push([cx + Math.cos(a) * 1.02 * H.a, by + Math.sin(a) * (by - top)]); }
    p.shadedFill(dome, "#3e3448", "#262030", light, H.a, 0.35); p.inkRing(dome, ow * 0.85, thick);
    const fold = []; for (let i = 0; i <= 24; i++) { const t = i / 24, x = cx + (t * 2 - 1) * 1.08 * H.a; fold.push([x, by - 0.42 * H.b - 0.08 * H.b * Math.sin(t * Math.PI) + 0.03 * H.b * Math.sin(t * 40)]); }
    for (let i = 24; i >= 0; i--) { const t = i / 24, x = cx + (t * 2 - 1) * 1.1 * H.a; fold.push([x, by + 0.06 * H.b + 0.03 * H.b * Math.sin(t * 37)]); }
    p.shadedFill(fold, col, dark, light, H.a, 0.3); p.clip(fold, () => { for (let k = -12; k <= 12; k++) p.stroke([[cx + k * 9 * u, by - 0.45 * H.b], [cx + k * 9 * u + 3 * u, by + 0.05 * H.b]], 1.3 * u, "#00000026"); }); p.inkRing(fold, ow * 0.8, thick);
    return;
  }
  if (O.hat === "mirror") { // doctor's head mirror on a band
    const by = hc - 0.62 * H.b - lift;
    p.band([[cx - 1.0 * H.a, by + 0.08 * H.b], [cx + 1.0 * H.a, by - 0.02 * H.b]], "#3a3a44", 0.1 * H.b, 1 * u);
    const mx = cx + 0.1 * H.a, my = by - 0.05 * H.b; p.ell(mx, my, 0.36 * H.a, 0.33 * H.b, "#c9ccd0", ow * 0.7); p.ell(mx, my, 0.26 * H.a, 0.24 * H.b, "#eef4fa", 1.4 * u); p.ell(mx, my, 0.06 * H.a, 0.06 * H.b, "#3a3a44", 0);
    p.stroke(ellPts(mx - 0.06 * H.a, my - 0.04 * H.b, 0.16 * H.a, 0.14 * H.b, 200, 290, 0, 10), 3 * u, "#ffffffcc");
    return;
  }
  marHat(p, O, H, cx, hc, light, thick, ow, u, lift);
};

const shine = (p, x, y, r, u) => { p.dot(x - r * 0.35, y - r * 0.35, Math.max(0.6 * u, r * 0.38), "#ffffffcc"); };
const stitch = (p, pts, u, col = "#00000055", w = 1.1) => { const g = p.g; g.save(); g.setLineDash([3.2 * u, 2.6 * u]); p.stroke(pts, w * u, col); g.restore(); };
const fabric = (p, tcx, T, top, bot, HH, u) => {
  const g = p.g, img = (typeof window !== "undefined") ? window.FABRIC_IMG : null;
  if (img) { g.save(); g.globalCompositeOperation = "overlay"; g.globalAlpha = 0.45; const pat = g.createPattern(img, "repeat"); const m = new DOMMatrix(); m.scaleSelf(0.16, 0.16); pat.setTransform(m); g.fillStyle = pat; g.fillRect(tcx - 2 * T.a, top - 0.3 * HH, 4 * T.a, bot - top + 0.6 * HH); g.restore(); }
  g.save(); g.globalAlpha = 0.14; for (const sd of [-1, 1]) p.stroke([[tcx + sd * 0.78 * T.a, top + 0.22 * HH], [tcx + sd * 0.6 * T.a, top + 0.5 * HH], [tcx + sd * 0.66 * T.a, bot - 0.1 * HH]], 3.2 * u, "#000000");
  g.globalAlpha = 0.14; p.stroke([[tcx - 0.9 * T.a, top + 0.12 * HH], [tcx - 0.55 * T.a, top + 0.06 * HH]], 3 * u, "#ffffff"); g.restore();
};
const tagText = (p, x, y, w, h, text, u, bg = "#f8f6ef", fg = "#1b2a44") => {
  p.poly(rrect(x - w / 2, y - h / 2, x + w / 2, y + h / 2, 2 * u), bg, 1.4 * u);
  const g = p.g; g.save(); g.textAlign = "center"; g.textBaseline = "middle"; let fs = h * 0.78; g.font = `900 ${fs}px Arial Black, Arial`;
  while (g.measureText(text).width > w * 0.86 && fs > 4) { fs *= 0.92; g.font = `900 ${fs}px Arial Black, Arial`; }
  g.fillStyle = fg; g.fillText(text, x, y + fs * 0.05); g.restore();
};
/** uniform details painted inside the torso */
const aussieTorso = (p, O, tp, tcx, T, chin, torsoBot, HH, u, light) => {
  p.clip(tp, () => {
    if (O.uniform === "stew") {
      fabric(p, tcx, T, chin, torsoBot, HH, u);
      // white scarf / blouse V at the neck
      p.poly([[tcx - 0.42 * T.a, chin - 0.06 * HH], [tcx + 0.42 * T.a, chin - 0.06 * HH], [tcx, chin + 0.3 * HH]], "#f6f4ee", 1.6 * u);
      p.poly([[tcx - 0.16 * T.a, chin + 0.02 * HH], [tcx + 0.2 * T.a, chin + 0.0 * HH], [tcx + 0.04 * T.a, chin + 0.12 * HH]], "#f2b23a", 1.2 * u); // scarf knot (marigold)
      p.stroke([[tcx + 0.04 * T.a, chin + 0.1 * HH], [tcx - 0.08 * T.a, chin + 0.26 * HH]], 4 * u, "#f2b23a");
      for (const sd of [-1, 1]) { p.stroke([[tcx + sd * 0.45 * T.a, chin - 0.06 * HH], [tcx + sd * 0.1 * T.a, chin + 0.36 * HH]], 2 * u, TURQ_D); for (let k = 0; k < 3; k++) { p.dot(tcx + sd * 0.28 * T.a, chin + (0.42 + k * 0.14) * HH, 2.6 * u, GOLD); shine(p, tcx + sd * 0.28 * T.a, chin + (0.42 + k * 0.14) * HH, 2.6 * u, u); } }
      p.band([[tcx - 1.4 * T.a, torsoBot - 0.2 * HH], [tcx + 1.4 * T.a, torsoBot - 0.2 * HH]], TURQ_D, 0.05 * HH, 1 * u);
      if (O.tag) tagText(p, tcx - 0.56 * T.a, chin + 0.3 * HH, 0.6 * T.a, 0.1 * HH, O.tag, u);
      stitch(p, [[tcx - 1.2 * T.a, torsoBot - 0.17 * HH], [tcx + 1.2 * T.a, torsoBot - 0.17 * HH]], u, "#ffffff40");
    } else if (O.uniform === "coat") {
      fabric(p, tcx, T, chin, torsoBot, HH, u);
      p.poly([[tcx - 0.7 * T.a, chin - 0.08 * HH], [tcx + 0.7 * T.a, chin - 0.08 * HH], [tcx + 0.6 * T.a, chin + 0.12 * HH], [tcx, chin + 0.2 * HH], [tcx - 0.6 * T.a, chin + 0.12 * HH]], "#d8ccb8", 1.4 * u); // sheepskin collar
      p.stroke([[tcx + 0.04 * T.a, chin + 0.18 * HH], [tcx + 0.04 * T.a, torsoBot]], 2 * u, "#3e2a1c");
      for (let k = 0; k < 3; k++) { const y = chin + (0.3 + k * 0.17) * HH; p.poly(rrect(tcx - 6 * u, y - 2.5 * u, tcx + 14 * u, y + 2.5 * u, 2 * u), "#e8dcc0", 1 * u); }
      p.band([[tcx - 1.4 * T.a, torsoBot - 0.24 * HH], [tcx + 1.4 * T.a, torsoBot - 0.24 * HH]], "#2e2420", 0.07 * HH, 1.2 * u);
    } else if (O.uniform === "lab") {
      p.poly([[tcx - 0.36 * T.a, chin - 0.06 * HH], [tcx + 0.36 * T.a, chin - 0.06 * HH], [tcx, chin + 0.42 * HH]], O.dress && O.bob ? "#5f7aa0" : "#8fb0d8", 1.4 * u);
      if (!O.bob) p.poly([[tcx - 0.07 * T.a, chin + 0.02 * HH], [tcx + 0.07 * T.a, chin + 0.02 * HH], [tcx + 0.05 * T.a, chin + 0.36 * HH], [tcx, chin + 0.4 * HH], [tcx - 0.05 * T.a, chin + 0.36 * HH]], "#b8322f", 1 * u);
      for (const sd of [-1, 1]) p.stroke([[tcx + sd * 0.42 * T.a, chin - 0.06 * HH], [tcx + sd * 0.12 * T.a, chin + 0.46 * HH], [tcx + sd * 0.1 * T.a, torsoBot]], 2.2 * u, "#c9ccd0");
      p.poly(rrect(tcx - 0.86 * T.a, chin + 0.36 * HH, tcx - 0.42 * T.a, chin + 0.58 * HH, 2 * u), "#f4f6f4", 1.2 * u);
      p.stroke([[tcx - 0.76 * T.a, chin + 0.3 * HH], [tcx - 0.76 * T.a, chin + 0.42 * HH]], 2.4 * u, "#2b4a9a"); p.stroke([[tcx - 0.62 * T.a, chin + 0.32 * HH], [tcx - 0.62 * T.a, chin + 0.42 * HH]], 2.4 * u, "#b8322f");
      // stethoscope
      p.stroke(ellPts(tcx, chin + 0.02 * HH, 0.48 * T.a, 0.3 * HH, 10, 170, 0, 20), 2.6 * u, "#3a3a44");
      p.stroke([[tcx + 0.46 * T.a, chin + 0.08 * HH], [tcx + 0.5 * T.a, chin + 0.5 * HH]], 2.6 * u, "#3a3a44"); p.ell(tcx + 0.5 * T.a, chin + 0.54 * HH, 6 * u, 6 * u, "#c9ccd0", 1.4 * u);
    } else if (O.uniform === "blouse") {
      fabric(p, tcx, T, chin, torsoBot, HH, u);
      p.poly([[tcx - 0.34 * T.a, chin - 0.06 * HH], [tcx + 0.34 * T.a, chin - 0.06 * HH], [tcx, chin + 0.2 * HH]], O.skin, 1.2 * u);
      for (let i = 0; i <= 10; i++) { const a = Math.PI * (0.1 + 0.8 * i / 10); p.dot(tcx + Math.cos(a) * 0.36 * T.a, chin - 0.04 * HH + Math.sin(a) * 0.17 * HH, 2.6 * u, "#fbf6ee"); }
      p.ell(tcx + 0.55 * T.a, chin + 0.34 * HH, 7 * u, 7 * u, GOLD, 1.2 * u); // brooch
    } else if (O.uniform === "hoodie") { hoodiePaint(p, O, tcx, T, chin, torsoBot, HH, u);
    } else if (SAM_TORSO[O.uniform]) { SAM_TORSO[O.uniform](p, O, tcx, T, chin, torsoBot, HH, u);
    } else if (O.uniform === "teen") {
      fabric(p, tcx, T, chin, torsoBot, HH, u);
      for (const sd of [-1, 1]) p.ell(tcx + sd * 0.22 * T.a, chin + 0.03 * HH, 0.26 * T.a, 0.08 * HH, "#fbf8f0", 1.4 * u);
      for (let k = 0; k < 3; k++) { p.dot(tcx, chin + (0.22 + k * 0.14) * HH, 2.4 * u, "#fbf8f0"); }
      for (let i = 0; i < 8; i++) p.dot(tcx + Math.sin(i * 2.1) * 0.8 * T.a, chin + (0.15 + (i * 0.37) % 1 * 0.7) * HH, 3 * u, "#ffffff70");
    } else marTorso(p, O, tp, tcx, T, chin, torsoBot, HH, u, light);
  });
};
const castAfter = (...a) => samAfter(...a);
const glow = (p, x, y, r, col) => { const g = p.g; g.save(); const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, "rgba(255,200,80,0)"); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); g.restore(); };
const certDraw = (p, x, y, w, h, u, frame = true) => { // framed world-record certificate (diegetic text, reads left-to-right)
  if (frame) p.poly(rrect(x - w / 2 - 8 * u, y - h / 2 - 8 * u, x + w / 2 + 8 * u, y + h / 2 + 8 * u, 3 * u), "#c99a3a", 3 * u);
  p.poly(rrect(x - w / 2, y - h / 2, x + w / 2, y + h / 2, 2 * u), "#fbf4e0", 2 * u);
  const g = p.g; g.save(); g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#7a2a2a";
  g.font = `900 ${h * 0.16}px Georgia, serif`; g.fillText("WORLD RECORD", x, y - h * 0.27);
  g.fillStyle = "#2a2a3a"; g.font = `700 ${h * 0.085}px Georgia, serif`; g.fillText("HIGHEST FALL SURVIVED", x, y - h * 0.06);
  g.font = `900 ${h * 0.17}px Georgia, serif`; g.fillStyle = "#1b2a44"; g.fillText("10,160 m", x, y + h * 0.16);
  g.restore(); p.ell(x + w * 0.3, y + h * 0.34, h * 0.09, h * 0.09, "#d8322e", 1.4 * u); p.ell(x + w * 0.3, y + h * 0.34, h * 0.05, h * 0.05, GOLD, 0);
  p.stroke([[x - w * 0.38, y + h * 0.36], [x - w * 0.05, y + h * 0.36]], 1.4 * u, "#2a2a3a");
};
const cupDraw = (p, x, y, u, steam = 0) => {
  p.poly([[x - 15 * u, y - 18 * u], [x + 15 * u, y - 18 * u], [x + 12 * u, y + 14 * u], [x - 12 * u, y + 14 * u]], "#fbf8f2", 3 * u);
  p.band([[x - 14.5 * u, y - 8 * u], [x + 14.5 * u, y - 8 * u]], TURQ, 4 * u, 0);
  p.ell(x, y - 18 * u, 15 * u, 5 * u, "#5a3420", 2.4 * u); p.arc(x + 16 * u, y - 2 * u, 7 * u, 9 * u, -80, 80, 3 * u);
  if (steam) { const g = p.g; g.save(); g.globalAlpha = 0.7; for (let k = -1; k <= 1; k++) { const pts = []; for (let i = 0; i < 10; i++) pts.push([x + k * 8 * u + 4 * u * Math.sin(i * 0.9 + steam + k), y - 26 * u - i * 5 * u]); p.stroke(pts, 2.4 * u, "#ffffff"); } g.restore(); }
};
/** props drawn before the head */
const aussieProp = (p, prop, arms, u, opts) => {
  const [hx, hy] = arms[1].pts[2], [lx, ly] = arms[0].pts[2];
  if (prop === "bag") { const bx = lx - 10 * u, by = ly + 10 * u; p.stroke([[lx + 40 * u, ly - 180 * u], [bx, by - 20 * u]], 4 * u, "#5a3a22");
    p.poly(rrect(bx - 34 * u, by - 22 * u, bx + 34 * u, by + 30 * u, 6 * u), "#c0302c", 3.5 * u); p.poly(rrect(bx - 34 * u, by - 22 * u, bx + 34 * u, by - 4 * u, 5 * u), "#a02826", 2 * u);
    p.ell(bx, by + 12 * u, 13 * u, 13 * u, "#f6f3ea", 1.6 * u); p.poly([[bx - 3 * u, by + 3 * u], [bx + 3 * u, by + 3 * u], [bx + 3 * u, by + 9 * u], [bx + 9 * u, by + 9 * u], [bx + 9 * u, by + 15 * u], [bx + 3 * u, by + 15 * u], [bx + 3 * u, by + 21 * u], [bx - 3 * u, by + 21 * u], [bx - 3 * u, by + 15 * u], [bx - 9 * u, by + 15 * u], [bx - 9 * u, by + 9 * u], [bx - 3 * u, by + 9 * u]], "#c0302c", 0); }
};
/** props drawn after the head (over the face) */
const castLate = (p, prop, arms, u, opts, cx, hc, H) => {
  samLate(p, prop, arms, u, opts, cx, hc, H);
  const [hx, hy] = arms[1].pts[2], [lx, ly] = arms[0].pts[2];
  if (prop === "clip") { const x = hx - 30 * u, y = hy - 10 * u; p.poly(rrect(x - 34 * u, y - 46 * u, x + 34 * u, y + 46 * u, 3 * u), "#8a5a34", 3 * u); p.poly(rrect(x - 28 * u, y - 36 * u, x + 28 * u, y + 40 * u, 1 * u), "#fbf8f0", 1.4 * u);
    for (let k = 0; k < 6; k++) p.stroke([[x - 20 * u, y - 22 * u + k * 10 * u], [x + (k % 2 ? 8 : 18) * u, y - 22 * u + k * 10 * u]], 1.8 * u, "#7a8aa8"); p.poly(rrect(x - 12 * u, y - 52 * u, x + 12 * u, y - 40 * u, 2 * u), "#c9ccd0", 1.6 * u); p.dot(hx, hy, 6 * u); }
  if (prop === "cup") { cupDraw(p, hx, hy - 16 * u, u, opts.steam ?? 1); p.dot(hx - 10 * u, hy, 5.5 * u); }
  if (prop === "lantern") { const x = hx, y = hy + 52 * u, fl = opts.flicker || 0; glow(p, x, y, 110 * u, "rgba(255,200,90," + (0.5 + 0.1 * fl) + ")");
    p.stroke([[hx, hy], [x, y - 34 * u]], 2.4 * u); p.poly(rrect(x - 16 * u, y - 30 * u, x + 16 * u, y + 26 * u, 4 * u), "#ffd56a", 3 * u); p.ell(x, y, 8 * u, 12 * u, "#fff6c8", 0);
    p.poly(rrect(x - 20 * u, y - 36 * u, x + 20 * u, y - 28 * u, 2 * u), "#3a3a3a", 2 * u); p.poly(rrect(x - 20 * u, y + 24 * u, x + 20 * u, y + 32 * u, 2 * u), "#3a3a3a", 2 * u);
    for (const s of [-1, 1]) p.stroke([[x + s * 16 * u, y - 28 * u], [x + s * 16 * u, y + 24 * u]], 2 * u, "#3a3a3a"); p.dot(hx, hy, 6 * u); }
  if (prop === "stamp") { const x = hx, y = hy; p.ell(x, y - 30 * u, 11 * u, 11 * u, "#7a4a26", 2.6 * u); p.poly(rrect(x - 5 * u, y - 22 * u, x + 5 * u, y - 4 * u, 2 * u), "#7a4a26", 2 * u); p.poly(rrect(x - 20 * u, y - 6 * u, x + 20 * u, y + 6 * u, 2 * u), "#c0302c", 2.4 * u); p.dot(x, y - 12 * u, 6 * u); }
  if (prop === "cert") { const x = (hx + lx) / 2, y = Math.min(hy, ly) - 4 * u, w = 150 * u, h = 106 * u; certDraw(p, x, y, w, h, u); p.dot(x - w / 2 - 4 * u, y + 10 * u, 7 * u, opts.skin || "#f3cdb0"); p.dot(x + w / 2 + 4 * u, y + 10 * u, 7 * u, "#f3cdb0"); }
  if (prop === "blanket") { const HH = 2 * H.b, top = hc + 0.7 * H.b, w = 0.7 * 2 * H.a, bot = 975 - 0.3 * HH;
    const sk = [[cx - w * 0.7, top], [cx + w * 0.7, top], [cx + w * 0.95, bot], [cx - w * 0.95, bot]];
    p.gradFill(sk, "#c0473a", "#8a2e2a", rad(-120)); p.clip(sk, () => { for (let i = -6; i <= 6; i++) { p.stroke([[cx + i * 22 * u, top], [cx + i * 24 * u, bot]], 3 * u, "#f2e2c0aa"); } for (let k = 0; k < 9; k++) p.stroke([[cx - w, top + k * 34 * u], [cx + w, top + k * 34 * u]], 3 * u, "#2e3a5a66"); });
    p.poly(sk, null, 5 * u); p.poly([[cx - w * 0.7, top], [cx + w * 0.1, top + 40 * u], [cx + w * 0.7, top], [cx + w * 0.6, top + 18 * u], [cx, top + 60 * u], [cx - w * 0.6, top + 18 * u]], "#d0584a", 3 * u); }
  if (opts.glasses || null) {}
  marLate(p, prop, arms, u, opts, cx, hc, H);
};
// ---------------- effects ----------------
const M_back = (t, s = 1.7) => { t = Math.max(0, Math.min(1, t)) - 1; return t * t * ((s + 1) * t + s) + 1; };
export const fxSmoke = (p, t, col = "#f4f6fa") => { const g = p.g; g.save(); g.globalAlpha = Math.max(0, 0.85 - t * 0.85);
  for (let i = 0; i < 5; i++) { const a = i * 1.26 + t * 2, r = 80 + t * 120; p.ell(300 + Math.cos(a) * r * 0.6, 500 + Math.sin(a) * r * 0.4, 90 + t * 80, 70 + t * 60, col, 0); } g.restore(); };
export const fxSparkle = (p, t) => { const g = p.g; g.save(); g.globalAlpha = Math.sin(Math.PI * Math.min(1, t)); const s = 0.6 + 0.6 * Math.sin(t * Math.PI);
  const st = []; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, r = (i % 2 ? 50 : 190) * s; st.push([300 + Math.cos(a) * r, 500 + Math.sin(a) * r]); } p.poly(st, "#fff3b0", 10); g.restore(); };
export const fxSpeech = (p, text, t = 1, col = "#ffffff", fg = "#1b2a44") => { const k = M_back(t, 1.6), g = p.g; g.save(); g.translate(300, 600); g.scale(k, k); g.translate(-300, -600);
  p.poly(rrect(60, 380, 540, 620, 60), col, 12); p.poly([[200, 610], [160, 720], [280, 612]], col, 12); p.poly(rrect(66, 386, 534, 614, 56), col, 0);
  g.textAlign = "center"; g.textBaseline = "middle"; let fs = 120; g.font = `900 ${fs}px Arial Black, Arial`; while (g.measureText(text).width > 420) { fs *= 0.92; g.font = `900 ${fs}px Arial Black, Arial`; }
  g.fillStyle = fg; g.fillText(text, 300, 505); g.restore(); };
export const fxPlacard = (p, text, t = 1, fg = "#c8322e", bg = "#f4ead2") => { const k = M_back(t, 1.6), g = p.g; g.save(); g.translate(300, 975); g.scale(k, k); g.translate(-300, -975);
  p.band([[300, 520], [300, 975]], "#7a5434", 26, 8, "round"); p.poly(rrect(70, 300, 530, 560, 26), bg, 14);
  g.textAlign = "center"; g.textBaseline = "middle"; let fs = 170; g.font = `900 ${fs}px Arial Black, Arial`; while (g.measureText(text).width > 400) { fs *= 0.92; g.font = `900 ${fs}px Arial Black, Arial`; }
  g.lineWidth = fs * 0.12; g.strokeStyle = INK; g.lineJoin = "round"; g.strokeText(text, 300, 436); g.fillStyle = fg; g.fillText(text, 300, 436); g.restore(); };
export const fxHeart = (p, beat = 0, glowK = 1) => { const s = 1 + 0.12 * beat, g = p.g; g.save(); g.translate(300, 520); g.scale(s, s); g.translate(-300, -520);
  if (glowK > 0) { const gr = g.createRadialGradient(300, 520, 40, 300, 520, 290); gr.addColorStop(0, "rgba(255,190,200," + 0.7 * glowK + ")"); gr.addColorStop(1, "rgba(255,190,200,0)"); g.fillStyle = gr; g.fillRect(0, 200, 600, 640); }
  const pts = []; for (let i = 0; i <= 80; i++) { const t = i / 80 * Math.PI * 2, x = 16 * Math.pow(Math.sin(t), 3), y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t); pts.push([300 + x * 11, 500 - y * 11]); }
  p.gradFill(pts, "#ff4a63", "#c4203e", rad(-120)); p.inkRing(pts, 12, 0.6); p.ell(230, 420, 30, 20, "#ffffffaa", 0, 0, 360, -30);
  p.ell(255, 520, 10, 13, INK, 0); p.ell(345, 520, 10, 13, INK, 0); p.arc(300, 552, 26, 16, 20, 160, 7); g.restore(); };
export const fxBulb = (p, t) => { const k = M_back(t, 1.8), g = p.g; g.save(); g.translate(300, 520); g.scale(k, k); g.translate(-300, -520);
  const gr = g.createRadialGradient(300, 460, 30, 300, 460, 260); gr.addColorStop(0, "rgba(255,240,150,0.8)"); gr.addColorStop(1, "rgba(255,240,150,0)"); g.fillStyle = gr; g.fillRect(0, 160, 600, 600);
  p.ell(300, 450, 120, 130, "#fff27a", 12); p.poly(rrect(240, 560, 360, 640, 14), "#b9bcc4", 10); for (let k2 = 0; k2 < 3; k2++) p.stroke([[244, 580 + k2 * 20], [356, 580 + k2 * 20]], 5, "#7a7d86");
  p.stroke([[270, 520], [285, 440], [300, 500], [315, 440], [330, 520]], 7, "#c9a020"); for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * 0.4; p.stroke([[300 + Math.cos(a) * 170, 450 + Math.sin(a) * 170], [300 + Math.cos(a) * 220, 450 + Math.sin(a) * 220]], 12, "#fff27a"); } g.restore(); };
export const fxNoChute = (p, t) => { const k = M_back(t, 1.6), g = p.g; g.save(); g.translate(300, 500); g.scale(k, k); g.translate(-300, -500);
  p.ell(300, 500, 230, 230, "#fbf8f0", 14); const can = []; for (let i = 0; i <= 20; i++) { const a = Math.PI + Math.PI * i / 20; can.push([300 + Math.cos(a) * 150, 440 + Math.sin(a) * 110]); }
  for (let i = 0; i < 6; i++) can.push([450 - i * 60 - 30, 440 + 18 * (i % 2)]); p.poly(can, "#f2b23a", 10); for (const x of [-150, -50, 50, 150]) p.stroke([[300 + x, 440], [300, 600]], 5);
  p.ell(300, 610, 22, 22, "#1fa6a6", 6); g.globalAlpha = 1; p.stroke([[150, 350], [450, 650]], 44, INK); p.stroke([[450, 350], [150, 650]], 44, INK); p.stroke([[150, 350], [450, 650]], 28, "#e0302e"); p.stroke([[450, 350], [150, 650]], 28, "#e0302e"); g.restore(); };
export const fxStampMark = (p, t, text = "PASSED") => { const k = 1 + 0.5 * (1 - M_back(t, 2.2)), g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.18); g.scale(k, k); g.translate(-300, -500); g.globalAlpha = Math.min(1, t * 3);
  p.poly(rrect(40, 400, 560, 600, 24), null, 0); g.lineWidth = 18; g.strokeStyle = "#1f8a4a"; g.strokeRect(50, 410, 500, 180);
  g.textAlign = "center"; g.textBaseline = "middle"; let fs = 150; g.font = `900 ${fs}px Arial Black, Arial`; while (g.measureText(text).width > 450) { fs *= 0.92; g.font = `900 ${fs}px Arial Black, Arial`; } g.fillStyle = "#1f8a4a"; g.fillText(text, 300, 505); g.restore(); };
export const fxConfetti = (p, t, seed = 1) => { const g = p.g; g.save(); const cols = ["#f2b23a", "#1fa6a6", "#e0607a", "#ffffff", "#7a9ae0"];
  for (let i = 0; i < 26; i++) { const r1 = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453, r = r1 - Math.floor(r1), r2 = Math.sin(i * 39.3 + seed) * 9631.1, q_ = r2 - Math.floor(r2);
    const x = 40 + r * 520 + 30 * Math.sin(t * 6 + i), y = 60 + ((q_ + t) % 1) * 880, a = t * 9 + i; g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = cols[i % 5]; g.fillRect(-14, -7 * Math.abs(Math.cos(a * 0.7)) - 2, 28, 14 * Math.abs(Math.cos(a * 0.7)) + 4); g.restore(); } g.restore(); };
export const fxNotes = (p, t) => { const g = p.g; g.save(); for (let i = 0; i < 3; i++) { const tt = (t + i / 3) % 1; g.globalAlpha = Math.sin(Math.PI * tt); const x = 200 + i * 90 + 60 * Math.sin(tt * 6 + i), y = 800 - tt * 600; g.save(); g.translate(x, y); g.scale(0.5, 0.5); g.translate(-300, -500); fxNote(p, i % 2 ? "note2" : "note", "#1f2a44"); g.restore(); } g.restore(); };
export const fxSnowPuff = (p, t) => { const g = p.g; g.save(); g.globalAlpha = Math.max(0, 1 - t * 1.05);
  for (let i = 0; i < 9; i++) { const a = Math.PI * (0.05 + 0.9 * i / 8), r = 60 + t * 260; p.ell(300 + Math.cos(a) * r * 1.3, 860 - Math.sin(a) * r * 0.9, 70 + t * 70, 55 + t * 50, i % 2 ? "#ffffff" : "#e6eefc", 0); } g.restore(); };
export const fxZz = (p, t) => { const g = p.g; g.save(); for (let i = 0; i < 3; i++) { const tt = (t + i / 3) % 1; g.globalAlpha = Math.sin(Math.PI * tt); g.textAlign = "center"; g.font = `900 ${90 + 50 * tt}px Arial Black, Arial`; g.lineWidth = 14; g.strokeStyle = INK; g.strokeText("Z", 250 + tt * 160, 700 - tt * 420); g.fillStyle = "#ffffff"; g.fillText("Z", 250 + tt * 160, 700 - tt * 420); } g.restore(); };
export const fxSwirl = (p, t) => { const pts = []; for (let i = 0; i < 46; i++) { const a = i / 46 * Math.PI * 4 + t * 8, r = 20 + i * 4.4; pts.push([300 + Math.cos(a) * r * 1.4, 500 + Math.sin(a) * r * 0.5]); } p.stroke(pts, 16, "#ffffff"); p.stroke(pts, 7, "#f2b23a"); };
/** the Beatle: only a dark suit sleeve and a hand coming in from the right, holding the certificate (no face, no likeness) */
export const fxSleeve = (p, o = {}) => { const g = p.g, u = 1; const y = 520;
  p.poly([[640, y - 70], [330, y - 58], [318, y + 62], [640, y + 78]], "#1c1c24", 12); p.clip([[640, y - 70], [330, y - 58], [318, y + 62], [640, y + 78]], () => { p.stroke([[600, y - 60], [340, y - 40]], 5, "#ffffff18"); });
  p.poly([[338, y - 58], [300, y - 52], [292, y + 52], [330, y + 60]], "#f6f4ee", 8); p.ell(318, y - 2, 5, 5, GOLD, 0);
  if (o.cert) certDraw(p, 150, y - 24, 250, 176, 1.5);
  p.ell(268, y + 6, 46, 40, "#f0c8a6", 10); for (let k = 0; k < 4; k++) p.ell(222 - k * 4, y - 22 + k * 15, 16, 8, "#f0c8a6", 7);
  p.ell(262, y - 34, 22, 10, "#f0c8a6", 7, 0, 360, -30); };
export const fxRecordGlint = (p, t) => fxSparkle(p, t);

// ---------------- "The Dating Site Nobody Wanted" cast (our own designs) — appended after roman.js in toon.js ----------------
// Founders and the zoo guy are drawn ONLY from behind (back of head, hoodie, chair). No faces, no likeness.
FACE.hopeful = { eye: ["dot", "dot"], brow: [-4, -4], mouth: "smileWide" };
FACE.sad = { eye: ["dot", "dot"], brow: [5, 5], mouth: "frown" };
FACE.meh = { eye: ["lid", "lid"], brow: [2, -2], mouth: "dash" };
FACE.sigh2 = { eye: ["dash", "dash"], brow: [4, 4], mouth: "wave" };
FACE.happy2 = { eye: ["happy", "happy"], brow: [-3, -3], mouth: "smileWide" };
FACE.wow = { eye: ["shock", "shock"], brow: [-6, -6], mouth: "O" };
const YT_U = 1, YT_L = rad(-120);
const HOODIES = {
  A: { hood: "#c8463c", hair: "#1c1418", style: "spiky", skin: "#f0c8a6" },
  B: { hood: "#3f63a8", hair: "#5a3a26", style: "short", skin: "#f3d2b4", phones: "#2a2a30" },
  C: { hood: "#3f8a5a", hair: "#241a16", style: "curly", skin: "#d9a57c" },
  L: { hood: "#2f7a6a", hair: "#4a3020", style: "short", skin: "#f0c8a6" },
  Z: { hood: "#f2b23a", hair: "#3a2a1e", style: "cap", cap: "#2f6fa8", skin: "#f0c8a6", tee: true },
};
/** back of a head: ears, hair cap, optional headphones / baseball cap. */
const backHead = (p, O, hx, hy, a, b, thick) => {
  const ow = 10;
  for (const s of [-1, 1]) p.ell(hx + s * a * 0.98, hy + b * 0.12, a * 0.17, b * 0.26, O.skin, ow * 0.8);
  const H = { a, b, nTop: 1.8, nBot: 2.3, egg: -0.1, asym: 0, rot: 0, noise: 0.01, seed: 4 };
  const hp = blobPts(hx, hy, H);
  p.shadedFill(hp, O.skin, mul(O.skin, SH_SKIN), YT_L, a);
  // hair covers all but a crescent of nape
  const hair = blobPts(hx, hy - b * 0.1, { ...H, a: a * 1.03, b: b * 0.98, noise: O.style === "curly" ? 0.05 : 0.012, seed: 9 });
  p.clip(hp.concat([]), () => {});
  p.shadedFill(hair, O.hair, mul(O.hair, [0.55, 0.55, 0.65]), YT_L, a * 1.1, 0.5);
  p.clip(hair, () => { for (let i = -6; i <= 6; i++) p.stroke([[hx + i * a * 0.14, hy - b * 0.9], [hx + i * a * 0.16 + 6, hy + b * 0.6]], 3, mul(O.hair, [1.5, 1.5, 1.5]) + "55"); });
  p.inkRing(hp, ow, thick); p.inkRing(hair, ow * 0.9, thick);
  if (O.style === "spiky") { for (let i = -3; i <= 3; i++) { const x = hx + i * a * 0.26, y = hy - b * 0.92 + Math.abs(i) * 8; p.poly([[x - 22, y + 20], [x + 4 + i * 3, y - 34], [x + 22, y + 20]], O.hair, 7); } }
  if (O.style === "curly") { for (let i = 0; i < 14; i++) { const t = Math.PI * (1.05 + 0.9 * i / 13); p.ell(hx + Math.cos(t) * a * 0.98, hy - b * 0.1 + Math.sin(t) * b * 0.92, 24, 22, O.hair, 7); } }
  if (O.phones) { p.band(ellPts(hx, hy + b * 0.05, a * 1.06, b * 1.04, 192, 348, 0, 24), O.phones, 16, 4, "round"); for (const s of [-1, 1]) p.ell(hx + s * a * 1.02, hy + b * 0.1, a * 0.2, b * 0.3, O.phones, 9); }
  if (O.style === "cap") { const cp = ellPts(hx, hy - b * 0.18, a * 1.06, b * 0.86, 180, 360, 0, 30); cp.push([hx + a * 1.06, hy - b * 0.1], [hx - a * 1.06, hy - b * 0.1]);
    p.shadedFill(cp, O.cap, mul(O.cap, [0.6, 0.6, 0.7]), YT_L, a); p.inkRing(cp, ow, thick); p.poly(rrect(hx - a * 0.3, hy - b * 0.24, hx + a * 0.3, hy - b * 0.06, 10), "#f2efe6", 6); p.dot(hx, hy - b * 1.02, 10, mul(O.cap, [0.7, 0.7, 0.8])); }
};
/** founder seen from behind. opts: who A/B/C/Z, pose type|up|head|hang|point|cheer, seated, ph (typing phase), headTilt, lean, bob, step */
export const founderBack = (p, opts = {}) => {
  const O = HOODIES[opts.who || "A"], seated = opts.seated !== false && opts.who !== "Z", pose = opts.pose || "type", thick = thickAngle(YT_L), ow = 10;
  const bob = (opts.bob || 0) * 300, cx = 300 + (opts.lean || 0) * 20;
  const seatY = seated ? 760 : 700, shY = (seated ? 560 : 505) - bob, hy = shY - 100, a = 96, b = 90;
  const legCol = "#3a4a6a";
  if (opts.empty) { p.stroke([[300, 790], [300, 925]], 22, INK); p.stroke([[300, 790], [300, 925]], 12, "#5a5a64");
    for (const [x1, y1] of [[180, 950], [420, 950], [250, 965], [350, 965], [300, 945]]) { p.stroke([[300, 930], [x1, y1]], 18, INK); p.stroke([[300, 930], [x1, y1]], 9, "#4a4a54"); p.ell(x1, y1 + 10, 13, 11, "#2a2a30", 5); }
    p.poly(rrect(190, 750, 410, 795, 18), "#3a3a44", ow); p.stroke([[300, 760], [300, 700]], 30, INK); p.stroke([[300, 760], [300, 700]], 16, "#4a4a54");
    const cb = rrect(196, 600, 404, 735, 34); p.gradFill(cb, "#4a4a56", "#2a2a32", YT_L); p.inkRing(cb, ow, thick); return; }
  if (seated && !opts.noChair) { // office chair base (drawn first, behind)
    p.stroke([[300, 790], [300, 925]], 22, INK); p.stroke([[300, 790], [300, 925]], 12, "#5a5a64");
    for (const [x1, y1] of [[180, 950], [420, 950], [250, 965], [350, 965], [300, 945]]) { p.stroke([[300, 930], [x1, y1]], 18, INK); p.stroke([[300, 930], [x1, y1]], 9, "#4a4a54"); p.ell(x1, y1 + 10, 13, 11, "#2a2a30", 5); }
    p.poly(rrect(190, 750, 410, 795, 18), "#3a3a44", ow);
  } else {
    const st = opts.step || 0;
    for (const s of [-1, 1]) { const up = st ? Math.max(0, Math.sin(Math.PI * 2 * (st + (s > 0 ? 0.5 : 0)))) * 26 : 0;
      p.stroke([[cx + s * 40, 690], [cx + s * 46, 955 - up]], 60, INK); p.stroke([[cx + s * 40, 690], [cx + s * 46, 955 - up]], 44, O.tee ? "#4a6a9a" : legCol);
      p.ell(cx + s * 48, 958 - up, 36, 20, "#2a2224", 7); p.ell(cx + s * 48, 950 - up, 26, 8, "#f2efe6", 0); }
  }
  // torso (hoodie, back)
  const T = { a: 118, b: (seatY - shY) / 2 + 12, nTop: 2.0, nBot: 2.8, egg: 0.08, asym: 0, rot: 0, noise: 0.008, seed: 21 };
  const tcy = (seatY + shY) / 2 + 6, tp = blobPts(cx, tcy, T);
  const S = (s) => [cx + s * 96, shY + 26];
  const arm = (s) => { const sh = S(s), ph = opts.ph || 0;
    switch (pose) {
      case "type": { const j = 6 * Math.sin(ph * 6.283 + (s > 0 ? 1.7 : 0)); return { pts: [sh, [cx + s * 150, shY + 120 + j], [cx + s * 118, shY + 150 + j]], hand: false }; }
      case "up": case "cheer": { const w = pose === "cheer" ? 14 * Math.sin((opts.ph || 0) * 6.283 + s) : 0; return { pts: [sh, [cx + s * 168, shY - 70 + w], [cx + s * 190, shY - 190 + w]], hand: true }; }
      case "head": return { pts: [sh, [cx + s * 178, shY - 40], [cx + s * 70, hy - 40]], hand: true, late: true };
      case "pull": return s > 0 ? { pts: [sh, [cx + 150, shY + 120], [cx + 128, shY + 236]], hand: true } : { pts: [sh, [cx - 132, shY + 120], [cx - 128, shY + 228]], hand: true };
      case "drop": return s > 0 ? { pts: [sh, [cx + 168, shY - 10], [cx + 96, shY - 120]], hand: true } : { pts: [sh, [cx - 132, shY + 120], [cx - 128, shY + 228]], hand: true };
      case "table": return { pts: [sh, [cx + s * 150, shY + 110], [cx + s * 96, shY + 120]], hand: true };
      case "reach": { const k = Math.max(0, Math.min(1, opts.k ?? 1)); if (s < 0) return { pts: [sh, [cx - 132, shY + 120], [cx - 128, shY + 230]], hand: true };
        const H0 = [[cx + 132, shY + 120], [cx + 128, shY + 230]], H1 = [[cx + 200, shY - 10], [cx + 280, shY - 150 + (opts.dip || 0)]]; const L_ = (a, b) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
        return { pts: [sh, L_(H0[0], H1[0]), L_(H0[1], H1[1])], hand: true }; }
      case "jerk": return s > 0 ? { pts: [sh, [cx + 175, shY - 10], [cx + 150, shY - 110]], hand: true } : { pts: [sh, [cx - 150, shY + 60], [cx - 170, shY - 30]], hand: true };
      case "point": return s > 0 ? { pts: [sh, [cx + 170, shY - 20], [cx + 215, shY - 110]], hand: true } : { pts: [sh, [cx - 150, shY + 120], [cx - 118, shY + 150]], hand: false };
      default: return { pts: [sh, [cx + s * 132, shY + 120], [cx + s * 128, seated ? shY + 200 : shY + 230]], hand: true };
    } };
  const arms = [arm(-1), arm(1)];
  const drawArm = (A) => { const c = curve(A.pts[0], A.pts[1], A.pts[2]); p.stroke(c, 58, INK); p.stroke(c, 42, mul(O.hood, [0.92, 0.92, 0.95]));
    if (A.hand) p.ell(A.pts[2][0], A.pts[2][1], 22, 22, O.skin, 7); else p.ell(A.pts[2][0], A.pts[2][1], 22, 20, mul(O.hood, [0.8, 0.8, 0.85]), 7); };
  for (const A of arms) if (!A.late) drawArm(A);
  p.gradFill(tp, O.hood, mul(O.hood, SH_CLOTH), YT_L);
  p.clip(tp, () => { // hoodie details from behind: centre seam, folded hood, waistband
    p.stroke([[cx, shY + 70], [cx, seatY + 20]], 3, mul(O.hood, [0.7, 0.7, 0.75]));
    p.band([[cx - 140, seatY - 10], [cx + 140, seatY - 10]], mul(O.hood, [0.8, 0.8, 0.85]), 26, 3);
    if (O.tee) { p.stroke([[cx - 80, shY + 30], [cx - 60, seatY]], 4, "#00000022"); }
    for (const s of [-1, 1]) p.stroke([[cx + s * 60, shY + 60], [cx + s * 80, seatY - 30]], 5, "#00000018");
  });
  p.inkRing(tp, ow, thick);
  if (!O.tee) { const hood = ellPts(cx, shY + 22, 92, 52, 0, 360, 0, 36); p.shadedFill(hood, mul(O.hood, [0.86, 0.86, 0.9]), mul(O.hood, [0.6, 0.6, 0.66]), YT_L, 90); p.inkRing(hood, 8, thick);
    p.stroke(ellPts(cx, shY + 14, 60, 28, 20, 160, 0, 16), 4, mul(O.hood, [0.55, 0.55, 0.6])); }
  else p.poly(ellPts(cx, shY + 4, 52, 16, 0, 180, 0, 16), "#e0a230", 6);
  // neck + head
  const ht = opts.headTilt || 0;
  p.rot = ht ? [rad(ht), cx, shY + 10] : null;
  p.poly(rrect(cx - 30, hy + 50, cx + 30, shY + 20, 12), O.skin, 7);
  backHead(p, O, cx, hy, a, b, thick);
  p.rot = null;
  for (const A of arms) if (A.late) drawArm(A);
  if (opts.env) { const [ex, ey] = arms[1].pts[2]; const g = p.g; g.save(); g.translate(ex, ey - 30); g.rotate(-0.25); p.poly(rrect(-62, -40, 62, 40, 6), "#f4ead0", 8); p.stroke([[-58, -36], [0, 6], [58, -36]], 5, "#b8a47e"); p.poly(rrect(30, -32, 54, -6, 2), "#c8322e", 3); g.restore(); p.ell(ex, ey, 22, 22, O.skin, 7); }
  if (seated && !opts.noChair) { // chair back over the lower torso
    p.stroke([[300, 760], [300, 700]], 30, INK); p.stroke([[300, 760], [300, 700]], 16, "#4a4a54");
    const cb = rrect(196, 640, 404, 735, 34); p.gradFill(cb, "#4a4a56", "#2a2a32", YT_L); p.inkRing(cb, ow, thick);
    p.stroke([[214, 662], [386, 662]], 3, "#ffffff22");
  }
};
/** the mascot: a little heart character. opts: expr, L/R arm (hang|wave|cross|up|rose|shrug), d (deflate 0..1), blink, look, wv, flat */
export const heartBuddy = (p, opts = {}) => {
  const d = opts.d || 0, g = p.g, thick = thickAngle(YT_L), wv = opts.wv || 0;
  const k = 12.5, cy = 560 + d * 110, sx = 1 + 0.18 * d, sy = 1 - 0.42 * d;
  const pts = []; for (let i = 0; i <= 90; i++) { const t = i / 90 * Math.PI * 2, x = 16 * Math.pow(Math.sin(t), 3), y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const wob = d > 0 ? 1 + 0.03 * d * Math.sin(t * 7) : 1; pts.push([300 + x * k * sx * wob, cy - (y + 2) * k * sy * wob]); }
  const bot = cy + 15 * k * sy, armY = cy - 1 * k * sy;
  // legs
  for (const s of [-1, 1]) { p.stroke([[300 + s * 46, bot - 40], [300 + s * 58, 960]], 34, INK); p.stroke([[300 + s * 46, bot - 40], [300 + s * 58, 960]], 18, "#c4203e"); p.ell(300 + s * 70, 962, 40, 20, "#3a2430", 7); }
  const armPts = (s, pose) => { const x0 = 300 + s * 175 * sx;
    switch (pose) {
      case "wave": return [[x0, armY], [x0 + s * 70, armY - 90], [x0 + s * (70 + 30 * Math.sin(wv)), armY - 200]];
      case "up": return [[x0, armY], [x0 + s * 80, armY - 100], [x0 + s * 100, armY - 220]];
      case "cross": return [[x0, armY + 30], [x0 - s * 30, armY + 150], [300 - s * 50, armY + 175]];
      case "rose": return [[x0, armY], [x0 + s * 70, armY + 60], [x0 + s * 40, armY - 40]];
      case "shrug": return [[x0, armY], [x0 + s * 90, armY + 20], [x0 + s * 120, armY - 60]];
      default: return [[x0, armY], [x0 + s * 40, armY + 90], [x0 + s * 30, armY + 190]];
    } };
  const L = opts.L || "hang", R = opts.R || "hang", la = armPts(-1, L), ra = armPts(1, R);
  const drawA = (a) => { const c = curve(a[0], a[1], a[2]); p.stroke(c, 32, INK); p.stroke(c, 16, "#c4203e"); p.ell(a[2][0], a[2][1], 24, 24, "#fbf4ee", 7); };
  if (L !== "cross") drawA(la); if (R !== "cross") drawA(ra);
  p.gradFill(pts, "#ff4a63", "#c4203e", YT_L); p.inkRing(pts, 13, thick);
  p.ell(220, cy - 120 * sy, 40, 26, "#ffffffaa", 0, 0, 360, -30);
  if (d > 0.2) { g.save(); g.globalAlpha = Math.min(1, d); for (let i = 0; i < 3; i++) p.stroke([[200 + i * 90, bot - 150 - i * 10], [230 + i * 90, bot - 120 - i * 14]], 5, "#8a1a30"); g.restore(); }
  // face
  const hc = cy - 30 * sy, lid = lidOf(opts.blink || 0);
  faceFront(p, 300, hc, 290, opts.expr || "smile", 0, opts.look || 0, lid, false, "#ff4a63", null, false);
  for (const s of [-1, 1]) { g.save(); g.globalAlpha = 0.45; p.ell(300 + s * 70, hc + 34, 22, 12, "#ffb0c0", 0); g.restore(); }
  if (L === "cross") drawA(la); if (R === "cross") drawA(ra);
  if (R === "rose" || opts.rose) { const [hx, hy] = ra[2], dr = opts.droop || 0; const tip = [hx + 30 + dr * 60, hy - 120 + dr * 70];
    p.stroke(curve([hx, hy + 20], [hx + 20, hy - 60], tip), 14, INK); p.stroke(curve([hx, hy + 20], [hx + 20, hy - 60], tip), 7, "#3f8a3a");
    p.poly([[hx + 8, hy - 40], [hx + 50, hy - 70], [hx + 22, hy - 30]], "#4f9a44", 5);
    p.ell(tip[0], tip[1], 34, 30, "#d8203a", 7); p.ell(tip[0] - 6, tip[1] - 6, 18, 14, "#a8102a", 4); p.ell(tip[0], tip[1], 24 * 0.5, 22 * 0.5, null, 3);
    p.ell(hx, hy, 24, 24, "#fbf4ee", 7); }
};
/** front-view cartoon elephant (body + head + ears; the long trunk is a 3D tube in the world). opts: flap, expr (happy|wow), baby, trunkStub */
export const elephantCard = (p, opts = {}) => {
  const g = p.g, thick = thickAngle(YT_L), fl = opts.flap || 0, col = "#9aa3b2", dk = "#6a7284"; g.save(); g.translate(300, 975); g.scale(0.78, 0.78); g.translate(-300, -975);
  // back legs
  for (const s of [-1, 1]) { p.poly(rrect(300 + s * 150 - 42, 700, 300 + s * 150 + 42, 940, 30), mul(col, [0.82, 0.82, 0.86]), 10); }
  const body = blobPts(300, 700, { a: 210, b: 170, nTop: 2.2, nBot: 2.4, egg: 0.05, asym: 0, rot: 0, noise: 0.01, seed: 3 });
  p.gradFill(body, col, dk, YT_L); p.inkRing(body, 12, thick);
  for (const s of [-1, 1]) { const lg = rrect(300 + s * 70 - 52, 760, 300 + s * 70 + 52, 965, 36); p.gradFill(lg, col, dk, YT_L); p.inkRing(lg, 11, thick);
    for (let k = 0; k < 3; k++) p.ell(300 + s * 70 + (k - 1) * 28, 955, 14, 9, "#eef0f2", 5); }
  // ears
  for (const s of [-1, 1]) { const ep = blobPts(300 + s * 175, 430, { a: 135 + 12 * fl * s, b: 160, nTop: 2.2, nBot: 1.8, egg: 0.2, asym: 0, rot: rad(s * (14 + 10 * fl)), noise: 0.02, seed: 7 + s });
    p.gradFill(ep, mul(col, [1.02, 1.0, 1.0]), dk, YT_L); p.inkRing(ep, 11, thick);
    p.clip(ep, () => p.ell(300 + s * 185, 440, 85, 105, "#e7b8bf", 0)); }
  const head = blobPts(300, 420, { a: 135, b: 140, nTop: 1.9, nBot: 2.2, egg: -0.15, asym: 0, rot: 0, noise: 0.008, seed: 5 });
  p.shadedFill(head, mul(col, [1.06, 1.06, 1.05]), dk, YT_L, 140); p.inkRing(head, 12, thick);
  // eyes
  const ex = (opts.look || 0) * 6;
  for (const s of [-1, 1]) { if (opts.expr === "happy") p.arc(300 + s * 58, 400, 20, 16, 200, 340, 9); else { p.ell(300 + s * 58 + ex, 395, 17, 22, "#1a1620", 0); p.dot(300 + s * 58 + ex - 5, 386, 6, "#ffffff"); }
    p.stroke([[300 + s * 36, 352 - (opts.expr === "wow" ? 12 : 0)], [300 + s * 80, 360 - (opts.expr === "wow" ? 14 : 0)]], 8); }
  for (const s of [-1, 1]) { g.save(); g.globalAlpha = 0.4; p.ell(300 + s * 92, 450, 22, 12, "#ff9aa8", 0); g.restore(); }
  // tusks + trunk root
  for (const s of [-1, 1]) p.poly([[300 + s * 40, 480], [300 + s * 70, 520], [300 + s * 82, 500], [300 + s * 58, 470]], "#fbf6ea", 7);
  if (opts.trunkStub) { const tl = opts.trunkStub; const pts = [[255, 440], [345, 440], [330, 440 + tl], [270, 440 + tl]]; p.gradFill(pts, col, dk, YT_L); p.poly(pts, null, 0);
    p.stroke([[262, 440], [272, 440 + tl]], 10); p.stroke([[338, 440], [328, 440 + tl]], 10); p.ell(300, 440 + tl, 30, 14, "#7a8292", 8);
    for (let k = 1; k < 5; k++) p.arc(300, 440 + tl * k / 5, 32, 8, 20, 160, 4, "#5a6274"); }
  g.restore();
};
/** heart balloon on a string. opts: d (deflate), col */
export const fxBalloon = (p, o = {}) => { const d = o.d || 0, col = o.col || "#ff4a63", k = 12 * (1 - 0.35 * d), cy = 360 + d * 120, thick = thickAngle(YT_L);
  const pts = []; for (let i = 0; i <= 80; i++) { const t = i / 80 * Math.PI * 2, x = 16 * Math.pow(Math.sin(t), 3), y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t); pts.push([300 + x * k * (1 + 0.1 * d), cy - y * k * (1 - 0.2 * d)]); }
  const bt = cy + 17 * k; p.stroke(curve([300, bt], [300 + 30 * Math.sin((o.sw || 0)), (bt + 975) / 2], [300, 975]), 4, "#5a4a50");
  p.gradFill(pts, col, mul(col, [0.7, 0.6, 0.7]), YT_L); p.inkRing(pts, 10, thick); p.poly([[290, bt], [310, bt], [300, bt + 14]], col, 5); p.ell(240, cy - 80, 26, 16, "#ffffffaa", 0, 0, 360, -30); };
export const fxHearts = (p, t, n = 7) => { const g = p.g; g.save(); for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (i - (n - 1) / 2) * 0.42, r = 60 + 330 * M_back(t, 1.2), x = 300 + Math.cos(a) * r, y = 560 + Math.sin(a) * r * 1.1, s = 0.24 + 0.1 * (i % 3);
    g.globalAlpha = Math.max(0, Math.min(1, 1.6 - t * 1.4)); g.save(); g.translate(x, y); g.scale(s, s); g.rotate(0.3 * Math.sin(i * 2 + t * 4)); g.translate(-300, -520); fxHeartPlain(p); g.restore(); } g.restore(); };
const fxHeartPlain = (p, col = "#ff4a63") => { const pts = []; for (let i = 0; i <= 60; i++) { const t = i / 60 * Math.PI * 2, x = 16 * Math.pow(Math.sin(t), 3), y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t); pts.push([300 + x * 11, 500 - y * 11]); }
  p.gradFill(pts, col, mul(col, [0.75, 0.6, 0.7]), YT_L); p.inkRing(pts, 14, 0.6); p.ell(240, 430, 28, 18, "#ffffffaa", 0, 0, 360, -30); };
export const fxHeartOne = (p, col) => fxHeartPlain(p, col);
export const fxTumble = (p, a = 0) => { const g = p.g; g.save(); g.translate(300, 800); g.rotate(a); g.translate(-300, -800);
  for (let i = 0; i < 26; i++) { const r0 = 60 + (i * 37) % 110, t0 = i * 2.39, pts = []; for (let k = 0; k < 9; k++) { const tt = t0 + k * 0.55, rr = r0 + 25 * Math.sin(k * 1.7 + i); pts.push([300 + Math.cos(tt) * rr, 800 + Math.sin(tt) * rr * 0.95]); } p.stroke(pts, 9, INK); p.stroke(pts, 4.5, i % 3 ? "#b08a52" : "#8a6a3a"); }
  g.restore(); };
export const fxCricket = (p, t = 0, chirp = 0) => { const thick = thickAngle(YT_L);
  for (const s of [-1, 1]) { p.stroke([[300 + s * 30, 880], [300 + s * 110, 800], [300 + s * 140, 960]], 12, INK); p.stroke([[300 + s * 30, 880], [300 + s * 110, 800], [300 + s * 140, 960]], 5, "#3f7a2e"); }
  const b = blobPts(300, 880, { a: 120, b: 52, nTop: 2, nBot: 2.4, egg: 0, asym: 0, rot: 0, noise: 0.01, seed: 2 }); p.gradFill(b, "#5aa63c", "#2f6a24", YT_L); p.inkRing(b, 9, thick);
  p.ell(190, 860, 46, 42, "#5aa63c", 9); p.ell(178, 852, 11, 13, "#ffffff", 4); p.dot(175, 853, 6);
  for (const s of [0, 1]) p.stroke(curve([170, 825], [120 - s * 30, 720], [60 + s * 40 + 10 * Math.sin(t * 9), 650]), 5);
  p.poly([[230, 840], [420, 850 - 18 * chirp], [400, 890]], "#7ac454", 7);
  if (chirp > 0) { const g = p.g; g.save(); g.globalAlpha = chirp; for (let k = 0; k < 3; k++) p.arc(330, 760, 40 + k * 34, 40 + k * 34, -130, -50, 8, "#ffffff"); g.restore(); } };
/** the buyer: only a dark suit sleeve + hand, gripping the edge of something (right side of card) */
export const fxGrip = (p) => { const y = 520;
  p.poly([[640, y - 70], [360, y - 58], [350, y + 62], [640, y + 78]], "#1c1c24", 12); p.poly([[366, y - 58], [330, y - 52], [324, y + 52], [358, y + 60]], "#f6f4ee", 8); p.ell(346, y - 2, 5, 5, "#e3b23c", 0);
  p.ell(292, y + 6, 46, 44, "#f0c8a6", 10); for (let k = 0; k < 4; k++) p.ell(250 - k * 3, y - 24 + k * 16, 18, 9, "#f0c8a6", 7); p.ell(286, y - 38, 24, 11, "#f0c8a6", 7, 0, 360, -30); };
export const fxQ = (p, t = 1) => { const k = M_back(t, 1.6), g = p.g; g.save(); g.translate(300, 500); g.scale(k, k); g.translate(-300, -500); g.textAlign = "center"; g.textBaseline = "middle"; g.font = "900 420px Arial Black, Arial"; g.lineWidth = 40; g.strokeStyle = INK; g.lineJoin = "round"; g.strokeText("?", 300, 520); g.fillStyle = "#ffffff"; g.fillText("?", 300, 520); g.restore(); };
export const fxPetal = (p, a = 0) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(a); g.translate(-300, -500); p.poly(ellPts(300, 500, 150, 90, 0, 360, 0, 30), "#d8203a", 16); p.stroke(ellPts(300, 500, 90, 40, 200, 340, 0, 12), 8, "#a8102a"); g.restore(); };

// ---------------- "The Marathon Won by a Car" cast (our own caricatures of long-deceased 1904 figures) — appended after vesnacast.js in toon.js ----------------
FACE.hopeful = { eye: ["dot", "dot"], brow: [-4, -4], mouth: "smileWide" };
FACE.sad = { eye: ["dot", "dot"], brow: [5, 5], mouth: "frown" };
FACE.meh = { eye: ["lid", "lid"], brow: [2, -2], mouth: "dash" };
FACE.wow = { eye: ["shock", "shock"], brow: [-6, -6], mouth: "O" };
FACE.cramp = { eye: ["squeeze", "squeeze"], brow: [7, 7], mouth: "teeth" };
FACE.pant = { eye: ["lid", "lid"], brow: [5, 4], mouth: "lick" };
FACE.beam = { eye: ["happy", "happy"], brow: [-5, -5], mouth: "laugh" };
FACE.spin = { eye: ["spiral", "spiral"], brow: [-3, 3], mouth: "wave" };
FACE.spinGrin = { eye: ["spiral", "spiral"], brow: [-4, -4], mouth: "smileWide" };
FACE.gulp = { eye: ["shock", "shock"], brow: [-5, -5], mouth: "o" };
FACE.blow = { eye: ["lid", "lid"], brow: [5, -4], mouth: "o" };
FACE.sheep = { eye: ["dot", "dot"], brow: [6, 6], mouth: "teeth" };
FACE.point = { eye: ["lid", "lid"], brow: [6, -4], mouth: "O" };
FACE.yay = { eye: ["happy", "happy"], brow: [-5, -5], mouth: "O" };

const VEST = "#f6f3ea";
Object.assign(OUTFITS, {
  lorz: { tunic: VEST, sleeve: "#f1c9a2", pants: "#f1c9a2", skin: "#f1c9a2", boots: "#4a3026", shorts: "#2d3f7a", hair: "#2e2018", uniform: "vest", num: "31", stripe: "#c8322e" },
  hicks: { tunic: "#cfe0ee", sleeve: "#f2dcc8", pants: "#f2dcc8", skin: "#f2dcc8", boots: "#3a2a22", shorts: "#4a4f5a", hair: "#7a5a3a", uniform: "vest", num: "20", stripe: "#2d5a9a", thin: true, moustache: "#6a4a2e" },
  runA: { tunic: "#c8463c", sleeve: "#e8b48a", pants: "#e8b48a", skin: "#e8b48a", boots: "#3a2a22", shorts: "#2a2a30", hair: "#1e1714", uniform: "vest", num: "7", stripe: "#f2efe6" },
  runB: { tunic: "#3f8a5a", sleeve: "#c99067", pants: "#c99067", skin: "#c99067", boots: "#3a2a22", shorts: "#f2efe6", hair: "#1a1410", uniform: "vest", num: "12", stripe: "#f2c23c", moustache: "#1a1410" },
  runC: { tunic: "#f2c23c", sleeve: "#f5c9a0", pants: "#f5c9a0", skin: "#f5c9a0", boots: "#3a2a22", shorts: "#2d3f7a", hair: "#b8742e", uniform: "vest", num: "5", stripe: "#c8322e" },
  runD: { tunic: "#6a4a8a", sleeve: "#ecd0b6", pants: "#ecd0b6", skin: "#ecd0b6", boots: "#3a2a22", shorts: "#2a2a30", hair: "#5a3b2a", uniform: "vest", num: "18", stripe: "#f2efe6", moustache: "#5a3b2a" },
  trainerA: { tunic: "#3a2c28", sleeve: "#33261f", pants: "#2c2a30", boots: "#1c1612", skin: "#f0c8a6", uniform: "suit", tie: "#c8322e", hat: "bowler", hatCol: "#26201e", moustache: "#3a2418", hair: "#3a2418" },
  trainerB: { tunic: "#4a3f5a", sleeve: "#41374f", pants: "#2c2a30", boots: "#1c1612", skin: "#e6b48e", uniform: "suit", tie: "#2d6a5a", hat: "bowler", hatCol: "#3a2a22", moustache: "#7a5a3a", hair: "#7a5a3a", stout: true },
  alice: { tunic: "#f4efe6", sleeve: "#efe8dc", dress: "#e9e1f2", pants: "#efe8dc", skin: "#f7d6bc", uniform: "dress1904", hat: "bighat", hatCol: "#f0e6d0", hair: "#5a3b2a", bob: "#5a3b2a", hairUnder: true, lashes: true, blush: "#ff8a8a" },
  official: { tunic: "#2a2a34", sleeve: "#24242c", pants: "#2c2a30", boots: "#1c1612", skin: "#f3d6bb", uniform: "official", tie: "#1c1c22", hat: "boater", hatCol: "#e8cf8a", band: "#2a2a34", moustache: "#8a8a8a", stout: true },
  farmer: { tunic: "#c0473a", sleeve: "#b8423a", pants: "#3f5a8a", boots: "#4a3026", skin: "#efc29c", uniform: "overalls", over: "#4a6aa0", hat: "straw", hatCol: "#e8c46a", beard: "#c9a070" },
  driver: { tunic: "#c8a878", sleeve: "#bfa070", pants: "#5a4a3a", boots: "#2a201c", skin: "#f0c8a6", uniform: "duster", hat: "dcap", hatCol: "#6a5a4a", moustache: "#5a3b2a" },
  fanA: { tunic: "#5a7aa8", sleeve: "#50709c", pants: "#3a3a44", boots: "#2a201c", skin: "#f5c9a0", uniform: "suit", tie: "#c8322e", hat: "boater", hatCol: "#ead49a", band: "#c8322e" },
  fanB: { tunic: "#c25a7a", sleeve: "#b45270", dress: "#c25a7a", pants: "#efe8dc", skin: "#f3cfae", uniform: "dress1904", hat: "bighat", hatCol: "#f6e9c8", hair: "#3a2418", bob: "#3a2418", hairUnder: true, lashes: true },
  fanC: { tunic: "#6a8a4a", sleeve: "#607e42", pants: "#3a3a44", boots: "#2a201c", skin: "#c99067", uniform: "suit", tie: "#f2c23c", hat: "bowler", hatCol: "#2a2420", moustache: "#1e1714" },
  fanD: { tunic: "#d9a441", sleeve: "#cc9a3a", dress: "#5f7aa0", pants: "#efe8dc", skin: "#f7d3b4", uniform: "dress1904", hat: "bighat", hatCol: "#c8d8f0", hair: "#b8742e", bob: "#b8742e", hairUnder: true, lashes: true },
  fanE: { tunic: "#7a4a2a", sleeve: "#6e4226", pants: "#3a3a44", boots: "#2a201c", skin: "#ecd0b6", uniform: "suit", tie: "#2b4a9a", hat: "boater", hatCol: "#e2c07a", band: "#2b4a9a", beard: "#9a948c" },
});

/** extra hats (called from aussieHat) */
const marHat = (p, O, H, cx, hc, light, thick, ow, u, lift = 0) => {
  const col = O.hatCol || "#333", dark = mul(col, [0.66, 0.66, 0.72]), top = hc - H.b;
  if (O.hat === "bowler") {
    const by = hc - 0.5 * H.b - lift, dome = []; for (let i = 0; i <= 30; i++) { const a = Math.PI + Math.PI * i / 30; dome.push([cx + Math.cos(a) * 0.86 * H.a, by + Math.sin(a) * 0.92 * H.b]); }
    p.shadedFill(dome, col, dark, light, H.a, 0.4); p.inkRing(dome, ow * 0.85, thick);
    p.stroke(ellPts(cx - 0.3 * H.a, by - 0.55 * H.b, 0.22 * H.a, 0.2 * H.b, 200, 290, 0, 10), 3.5 * u, "#ffffff40");
    p.band([[cx - 0.86 * H.a, by - 0.06 * H.b], [cx + 0.86 * H.a, by - 0.06 * H.b]], mul(col, [1.5, 1.4, 1.4]), 0.1 * H.b, 1.2 * u);
    p.ell(cx, by + 0.02 * H.b, 1.18 * H.a, 0.14 * H.b, col, ow * 0.7); return;
  }
  if (O.hat === "boater" || O.hat === "straw") {
    const wide = O.hat === "straw", by = hc - 0.55 * H.b - lift, bw = (wide ? 1.55 : 1.22) * H.a, ch = (wide ? 0.7 : 0.42) * H.b, cw = 0.8 * H.a;
    const brim = ellPts(cx, by, bw, (wide ? 0.26 : 0.16) * H.b, 0, 360, 0, 40);
    p.shadedFill(brim, col, dark, light, bw, 0.3); p.clip(brim, () => { for (let k = 1; k < 6; k++) p.stroke(ellPts(cx, by, bw * k / 6, (wide ? 0.26 : 0.16) * H.b * k / 6, 0, 360, 0, 30), 1.2 * u, "#00000022"); }); p.inkRing(brim, ow * 0.8, thick);
    const crown = wide ? [[cx - cw, by], [cx - cw * 0.8, by - ch], [cx - cw * 0.2, by - ch * 1.12], [cx + cw * 0.3, by - ch * 1.05], [cx + cw * 0.82, by - ch * 0.95], [cx + cw, by]] : [[cx - cw, by], [cx - cw, by - ch], [cx + cw, by - ch], [cx + cw, by]];
    p.shadedFill(crown, col, dark, light, cw, 0.35); p.clip(crown, () => { for (let k = 0; k < 8; k++) p.stroke([[cx - cw, by - ch * k / 8], [cx + cw, by - ch * k / 8 - 1 * u]], 1.2 * u, "#00000020"); }); p.inkRing(crown, ow * 0.8, thick);
    if (!wide) { p.ell(cx, by - ch, cw, 0.08 * H.b, mul(col, [1.1, 1.08, 1.05]), ow * 0.55); p.band([[cx - cw, by - 0.14 * H.b], [cx + cw, by - 0.14 * H.b]], O.band || "#2a2a34", 0.16 * H.b, 1 * u); }
    else for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2; p.stroke([[cx + Math.cos(a) * bw, by + Math.sin(a) * 0.26 * H.b], [cx + Math.cos(a) * (bw + 6 * u), by + Math.sin(a) * 0.3 * H.b + 3 * u]], 1.6 * u, mul(col, [0.8, 0.75, 0.6])); }
    return;
  }
  if (O.hat === "bighat") { // wide Edwardian picture hat with flowers + a plume
    const by = hc - 0.62 * H.b - lift, bw = 1.85 * H.a, bh = 0.34 * H.b, g = p.g;
    g.save(); g.translate(cx, by); g.rotate(rad(-8)); g.translate(-cx, -by);
    const brim = ellPts(cx + 0.1 * H.a, by, bw, bh, 0, 360, 0, 48); p.shadedFill(brim, col, dark, light, bw, 0.3); p.inkRing(brim, ow * 0.8, thick);
    const cw = 0.78 * H.a, crown = ellPts(cx, by - 0.12 * H.b, cw, 0.5 * H.b, 180, 360, 0, 24); crown.push([cx + cw, by], [cx - cw, by]);
    p.shadedFill(crown, col, dark, light, cw, 0.35); p.inkRing(crown, ow * 0.8, thick);
    p.band([[cx - cw, by - 0.1 * H.b], [cx + cw, by - 0.1 * H.b]], O.band || "#8a6ab8", 0.18 * H.b, 1.2 * u);
    const fl = [["#ff8aa0", -0.55, -0.3], ["#ffffff", -0.2, -0.42], ["#f2c23c", 0.15, -0.32], ["#ff6a7a", 0.5, -0.28], ["#c8a0e8", 0.8, -0.18]];
    for (const [c, dx, dy] of fl) { const x = cx + dx * H.a, y = by + dy * H.b; for (let k = 0; k < 5; k++) { const a = k / 5 * 6.283; p.ell(x + Math.cos(a) * 6 * u, y + Math.sin(a) * 6 * u, 6 * u, 6 * u, c, 1.3 * u); } p.dot(x, y, 3.6 * u, "#f2c23c"); }
    const pl = []; for (let i = 0; i <= 14; i++) { const t = i / 14; pl.push([cx + (0.9 + 0.8 * t) * H.a, by - (0.4 + 0.9 * Math.sin(t * 2.4)) * H.b]); } p.stroke(pl, 9 * u, INK); p.stroke(pl, 6 * u, "#fbf8f0");
    g.restore(); return;
  }
  if (O.hat === "dcap") { // driver's flat cap with goggles pushed up
    const by = hc - 0.5 * H.b - lift, cap = ellPts(cx, by, 0.95 * H.a, 0.62 * H.b, 180, 360, 0, 30); cap.push([cx + 0.95 * H.a, by + 0.04 * H.b], [cx - 0.95 * H.a, by + 0.04 * H.b]);
    p.shadedFill(cap, col, dark, light, H.a, 0.4); p.inkRing(cap, ow * 0.85, thick);
    p.ell(cx + 0.18 * H.a, by + 0.04 * H.b, 0.88 * H.a, 0.12 * H.b, dark, ow * 0.7);
    p.band([[cx - 0.95 * H.a, by - 0.1 * H.b], [cx + 0.95 * H.a, by - 0.1 * H.b]], "#3a2a22", 0.12 * H.b, 0.8 * u);
    for (const s of [-1, 1]) { p.ell(cx + s * 0.34 * H.a, by - 0.12 * H.b, 0.27 * H.a, 0.2 * H.b, "#b98a3a", 2.4 * u); p.ell(cx + s * 0.34 * H.a, by - 0.12 * H.b, 0.18 * H.a, 0.13 * H.b, "#bfe4f2", 1.4 * u); p.dot(cx + s * 0.34 * H.a - 4 * u, by - 0.16 * H.b, 2.4 * u, "#ffffff"); }
    return;
  }
};

const bibNum = (p, x, y, w, h, n, u) => {
  p.poly(rrect(x - w / 2, y - h / 2, x + w / 2, y + h / 2, 2 * u), "#fbf9f2", 1.6 * u);
  const g = p.g; g.save(); g.textAlign = "center"; g.textBaseline = "middle"; g.font = `900 ${h * 0.78}px Arial Black, Arial`; g.fillStyle = "#1b1b24"; g.fillText(n, x, y + h * 0.05); g.restore();
  for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) p.dot(x + dx * (w / 2 - 3 * u), y + dy * (h / 2 - 3 * u), 1.4 * u, "#a8a8b0");
};
/** uniform painters (called from aussieTorso, inside the torso clip) */
const marTorso = (p, O, tp, tcx, T, chin, torsoBot, HH, u, light) => {
  if (O.uniform === "vest") {
    // scoop neck + deep armholes (skin), diagonal sash, number bib
    p.poly(ellPts(tcx, chin - 0.06 * HH, 0.42 * T.a, 0.2 * HH, 0, 180, 0, 20), O.skin, 1.6 * u);
    for (const sd of [-1, 1]) p.poly(ellPts(tcx + sd * 1.02 * T.a, chin + 0.16 * HH, 0.3 * T.a, 0.3 * HH, 0, 360, 0, 20), O.skin, 1.6 * u);
    if (O.stripe) p.band([[tcx - 1.1 * T.a, chin + 0.05 * HH], [tcx + 1.1 * T.a, torsoBot - 0.05 * HH]], O.stripe, 0.12 * HH, 0);
    bibNum(p, tcx + 0.04 * T.a, chin + 0.46 * HH, 0.78 * T.a, 0.28 * HH, O.num || "1", u);
    p.stroke([[tcx - 0.9 * T.a, chin + 0.15 * HH], [tcx - 0.62 * T.a, torsoBot - 0.2 * HH]], 3 * u, "#00000018");
  } else if (O.uniform === "suit" || O.uniform === "official") {
    p.poly([[tcx - 0.42 * T.a, chin - 0.08 * HH], [tcx + 0.42 * T.a, chin - 0.08 * HH], [tcx, chin + 0.5 * HH]], "#f6f4ee", 1.4 * u); // shirt
    p.poly([[tcx - 0.1 * T.a, chin + 0.0 * HH], [tcx + 0.1 * T.a, chin + 0.0 * HH], [tcx + 0.06 * T.a, chin + 0.38 * HH], [tcx, chin + 0.44 * HH], [tcx - 0.06 * T.a, chin + 0.38 * HH]], O.tie || "#c8322e", 1 * u);
    for (const sd of [-1, 1]) p.poly([[tcx + sd * 0.42 * T.a, chin - 0.08 * HH], [tcx + sd * 0.22 * T.a, chin + 0.2 * HH], [tcx + sd * 0.38 * T.a, chin + 0.22 * HH], [tcx + sd * 0.04 * T.a, chin + 0.56 * HH], [tcx + sd * 0.7 * T.a, chin + 0.1 * HH]], mul(O.tunic, [0.8, 0.8, 0.85]), 1.4 * u);
    for (let k = 0; k < 2; k++) p.dot(tcx + 0.1 * T.a, chin + (0.66 + k * 0.16) * HH, 2.6 * u, "#c9a64a");
    p.stroke(ellPts(tcx - 0.35 * T.a, chin + 0.68 * HH, 0.3 * T.a, 0.08 * HH, 10, 170, 0, 12), 1.6 * u, "#e3b23c"); // watch chain
    if (O.uniform === "official") { const rx = tcx - 0.55 * T.a, ry = chin + 0.3 * HH; p.poly([[rx - 5 * u, ry], [rx - 10 * u, ry + 26 * u], [rx - 2 * u, ry + 20 * u], [rx + 4 * u, ry + 28 * u], [rx + 6 * u, ry]], "#2d5a9a", 1.2 * u);
      for (let k = 0; k < 10; k++) { const a = k / 10 * 6.283; p.ell(rx + Math.cos(a) * 7 * u, ry + Math.sin(a) * 7 * u, 4 * u, 4 * u, k % 2 ? "#c8322e" : "#f6f4ee", 0.8 * u); } p.ell(rx, ry, 5 * u, 5 * u, "#f2c23c", 1 * u); }
  } else if (O.uniform === "dress1904") {
    fabric(p, tcx, T, chin, torsoBot, HH, u);
    p.poly(rrect(tcx - 0.2 * T.a, chin - 0.22 * HH, tcx + 0.2 * T.a, chin + 0.06 * HH, 3 * u), "#fbf8f0", 1.4 * u); // high lace collar
    for (let k = 0; k < 4; k++) p.stroke([[tcx - 0.18 * T.a, chin - 0.18 * HH + k * 0.06 * HH], [tcx + 0.18 * T.a, chin - 0.18 * HH + k * 0.06 * HH]], 1 * u, "#d8cfc0");
    for (let i = 0; i < 9; i++) p.dot(tcx + Math.sin(i * 1.7) * 0.5 * T.a, chin + (0.12 + (i * 0.27) % 1 * 0.5) * HH, 2.4 * u, "#ffffff90");
    p.ell(tcx, chin + 0.12 * HH, 5 * u, 5 * u, "#e3b23c", 1.2 * u);
    p.band([[tcx - 1.4 * T.a, torsoBot - 0.24 * HH], [tcx + 1.4 * T.a, torsoBot - 0.24 * HH]], O.band || "#8a6ab8", 0.07 * HH, 1 * u);
  } else if (O.uniform === "overalls") {
    for (let i = -3; i <= 3; i++) p.stroke([[tcx + i * 0.32 * T.a, chin - 0.2 * HH], [tcx + i * 0.32 * T.a, torsoBot]], 2 * u, "#00000026");
    for (let k = 0; k < 6; k++) p.stroke([[tcx - 1.2 * T.a, chin + k * 0.14 * HH], [tcx + 1.2 * T.a, chin + k * 0.14 * HH]], 2 * u, "#ffffff24");
    p.poly(rrect(tcx - 0.62 * T.a, chin + 0.22 * HH, tcx + 0.62 * T.a, torsoBot + 0.1 * HH, 6 * u), O.over, 1.8 * u);
    for (const sd of [-1, 1]) { p.band([[tcx + sd * 0.5 * T.a, chin + 0.25 * HH], [tcx + sd * 0.82 * T.a, chin - 0.1 * HH]], O.over, 0.1 * HH, 1.2 * u); p.dot(tcx + sd * 0.48 * T.a, chin + 0.27 * HH, 3 * u, "#e3b23c"); }
    p.poly(rrect(tcx - 0.28 * T.a, chin + 0.36 * HH, tcx + 0.28 * T.a, chin + 0.56 * HH, 3 * u), mul(O.over, [0.85, 0.85, 0.9]), 1.2 * u);
  } else if (O.uniform === "duster") {
    fabric(p, tcx, T, chin, torsoBot, HH, u);
    p.poly([[tcx - 0.66 * T.a, chin - 0.08 * HH], [tcx + 0.66 * T.a, chin - 0.08 * HH], [tcx + 0.3 * T.a, chin + 0.3 * HH], [tcx, chin + 0.18 * HH], [tcx - 0.3 * T.a, chin + 0.3 * HH]], mul(O.tunic, [0.82, 0.8, 0.78]), 1.4 * u);
    p.stroke([[tcx, chin + 0.18 * HH], [tcx, torsoBot]], 2 * u, "#5a4a3a"); for (let k = 0; k < 3; k++) p.dot(tcx + 8 * u, chin + (0.34 + k * 0.17) * HH, 3 * u, "#3a2a22");
  }
};

/** late overlays: worn wreath / medal, goggles, sweat, hand props (called from castLate) */
const marLate = (p, prop, arms, u, opts, cx, hc, H) => {
  const [hx, hy] = arms[1].pts[2], [lx, ly] = arms[0].pts[2], HH = 2 * H.b;
  if (opts.medal) { const my = hc + H.b + 0.62 * HH, k = opts.medal; p.stroke([[cx - 0.36 * H.a, hc + H.b + 0.02 * HH], [cx, my - 12 * u]], 4.5 * u, "#2d5a9a"); p.stroke([[cx + 0.36 * H.a, hc + H.b + 0.02 * HH], [cx, my - 12 * u]], 4.5 * u, "#c8322e");
    p.ell(cx, my, 15 * u * k, 15 * u * k, "#f2c23c", 2.6 * u); p.ell(cx, my, 9 * u * k, 9 * u * k, "#ffe27a", 1.2 * u); p.dot(cx - 5 * u, my - 6 * u, 2.6 * u, "#ffffff"); }
  if (opts.wreath) wreathOn(p, cx, hc, H, u, opts.wreath);
  if (opts.sweat) { const t = opts.sweat; for (let i = 0; i < 3; i++) { const k = (t + i / 3) % 1, sd = i % 2 ? 1 : -1, x = cx + sd * (H.a * (0.9 + 0.5 * k)), y = hc - 0.6 * H.b + k * 0.9 * H.b - Math.sin(k * Math.PI) * 0.4 * H.b;
      p.poly([[x, y - 9 * u], [x + 5 * u, y + 2 * u], [x, y + 7 * u], [x - 5 * u, y + 2 * u]], "#9fd4ff", 1.6 * u); } }
  if (prop === "megaphone") { const g = p.g; g.save(); g.translate(hx, hy); g.rotate(rad(-20)); p.poly([[-4 * u, -8 * u], [56 * u, -26 * u], [56 * u, 26 * u], [-4 * u, 8 * u]], "#d8322e", 2.4 * u); p.ell(56 * u, 0, 6 * u, 26 * u, "#f2efe6", 2.4 * u); p.band([[22 * u, -15 * u], [22 * u, 15 * u]], "#f2efe6", 6 * u, 1 * u); g.restore(); p.dot(hx, hy, 6 * u); }
  if (prop === "pistol") { p.poly([[hx - 4 * u, hy - 6 * u], [hx + 4 * u, hy - 6 * u], [hx + 6 * u, hy - 40 * u], [hx - 2 * u, hy - 40 * u]], "#3a3a44", 2 * u); p.poly([[hx - 6 * u, hy - 4 * u], [hx + 6 * u, hy - 4 * u], [hx + 4 * u, hy + 10 * u], [hx - 4 * u, hy + 10 * u]], "#7a4a2a", 2 * u); p.dot(hx, hy, 6 * u); }
  if (prop === "bottle" || prop === "poison") { const sm = prop === "poison", g = p.g, s = (sm ? 0.72 : 1) * (opts.propS || 1); g.save(); g.translate(hx, hy); g.rotate(rad(opts.tip ?? 0)); g.scale(s, s);
    p.poly(rrect(-11 * u, -40 * u, 11 * u, 8 * u, 6 * u), sm ? "#3f8a6a" : "#7a3a1a", 2.4 * u); p.poly(rrect(-4 * u, -58 * u, 4 * u, -38 * u, 2 * u), sm ? "#3f8a6a" : "#7a3a1a", 2 * u); p.poly(rrect(-5 * u, -64 * u, 5 * u, -56 * u, 2 * u), "#c8a070", 1.6 * u);
    p.poly(rrect(-9 * u, -30 * u, 9 * u, -6 * u, 2 * u), "#f4ecd6", 1.4 * u); if (sm) skull(p, 0, -18 * u, 7 * u, u); else { p.stroke([[-6 * u, -22 * u], [6 * u, -22 * u]], 1.6 * u, "#7a3a1a"); p.stroke([[-6 * u, -15 * u], [6 * u, -15 * u]], 1.6 * u, "#7a3a1a"); }
    p.stroke([[-6 * u, -36 * u], [-6 * u, 0]], 2.2 * u, "#ffffff55"); g.restore(); p.dot(hx, hy, 6 * u); }
  if (prop === "egg") { const g = p.g, ps = opts.propS || 1; g.save(); g.translate(hx, hy); g.scale(ps, ps); g.translate(-hx, -hy); const c = opts.crack || 0, x = hx, y = hy - 14 * u; if (c < 0.5) { p.ell(x, y, 10 * u, 13 * u, "#fbf6ea", 2.2 * u); p.dot(x - 3 * u, y - 5 * u, 2.4 * u, "#ffffff"); }
    else { p.poly([[x - 11 * u, y - 4 * u], [x - 6 * u, y - 10 * u], [x - 2 * u, y - 4 * u], [x + 3 * u, y - 10 * u], [x + 8 * u, y - 4 * u], [x + 11 * u, y - 2 * u], [x + 9 * u, y + 8 * u], [x - 9 * u, y + 8 * u]], "#fbf6ea", 2 * u); const dy = (c - 0.5) * 2 * 30 * u; p.ell(x, y + 10 * u + dy, 6 * u, 7 * u, "#f2b23a", 1.6 * u); }
    g.restore(); p.dot(hx, hy, 6 * u); }
  if (prop === "eggL") { const g = p.g, ps = opts.propS || 1; g.save(); g.translate(lx, ly); g.scale(ps, ps); g.translate(-lx, -ly); const c = opts.crack || 0, x = lx, y = ly - 14 * u; if (c < 0.5) { p.ell(x, y, 10 * u, 13 * u, "#fbf6ea", 2.2 * u); p.dot(x - 3 * u, y - 5 * u, 2.4 * u, "#ffffff"); }
    else { p.poly([[x - 11 * u, y - 4 * u], [x - 6 * u, y - 10 * u], [x - 2 * u, y - 4 * u], [x + 3 * u, y - 10 * u], [x + 8 * u, y - 4 * u], [x + 11 * u, y - 2 * u], [x + 9 * u, y + 8 * u], [x - 9 * u, y + 8 * u]], "#fbf6ea", 2 * u); const dy = (c - 0.5) * 2 * 30 * u; p.ell(x, y + 10 * u + dy, 6 * u, 7 * u, "#f2b23a", 1.6 * u); }
    g.restore(); p.dot(lx, ly, 6 * u); }
  if (prop === "medalHoldL") { p.stroke([[lx - 8 * u, ly], [lx - 8 * u, ly + 30 * u]], 4 * u, "#c8322e"); p.stroke([[lx + 8 * u, ly], [lx + 8 * u, ly + 30 * u]], 4 * u, "#2d5a9a"); p.ell(lx, ly + 44 * u, 15 * u, 15 * u, "#f2c23c", 2.6 * u); p.ell(lx, ly + 44 * u, 9 * u, 9 * u, "#ffe27a", 1.2 * u); p.dot(lx, ly, 6 * u); }
  if (prop === "wreathHold") { const x = (hx + lx) / 2, y = (hy + ly) / 2 - 4 * u; wreathRing(p, x, y, 0.95 * H.a, 0.42 * H.b, u, 0); p.dot(hx, hy, 6 * u); p.dot(lx, ly, 6 * u); }
  if (prop === "medalHold") { p.stroke([[hx - 8 * u, hy], [hx - 8 * u, hy + 30 * u]], 4 * u, "#c8322e"); p.stroke([[hx + 8 * u, hy], [hx + 8 * u, hy + 30 * u]], 4 * u, "#2d5a9a"); p.ell(hx, hy + 44 * u, 15 * u, 15 * u, "#f2c23c", 2.6 * u); p.ell(hx, hy + 44 * u, 9 * u, 9 * u, "#ffe27a", 1.2 * u); p.dot(hx, hy, 6 * u); }
  if (prop === "watch") { p.ell(hx, hy - 12 * u, 12 * u, 12 * u, "#e3b23c", 2.4 * u); p.ell(hx, hy - 12 * u, 8.5 * u, 8.5 * u, "#fbf8f0", 1 * u); p.stroke([[hx, hy - 12 * u], [hx + 3 * u, hy - 18 * u]], 1.6 * u); p.dot(hx, hy, 6 * u); }
  if (opts.whistle) { const mx = cx + 8 * u * (opts.facing || 0), my = hc + 20 * u; p.poly(rrect(mx - 2 * u, my - 4 * u, mx + 22 * u, my + 5 * u, 3 * u), "#c9ccd0", 1.8 * u); p.ell(mx + 18 * u, my + 4 * u, 6 * u, 6 * u, "#c9ccd0", 1.8 * u); }
};
const skull = (p, x, y, r, u) => { p.ell(x, y - r * 0.2, r, r * 0.9, "#fbf8f0", 1.2 * u); p.poly(rrect(x - r * 0.55, y + r * 0.3, x + r * 0.55, y + r * 0.95, 1 * u), "#fbf8f0", 1.2 * u);
  p.dot(x - r * 0.38, y - r * 0.2, r * 0.26); p.dot(x + r * 0.38, y - r * 0.2, r * 0.26); for (const s of [-1, 1]) { p.stroke([[x - 1.6 * r, y + 1.3 * r * s], [x + 1.6 * r, y - 1.3 * r * s]], 1.2 * u, "#fbf8f0"); } };
const wreathRing = (p, x, y, rx, ry, u, rot = 0) => {
  const pts = ellPts(x, y, rx, ry, 0, 360, rot, 36); p.stroke(pts.concat([pts[0]]), 9 * u, INK); p.stroke(pts.concat([pts[0]]), 5 * u, "#6a8a3a");
  for (let i = 0; i < 22; i++) { const a = i / 22 * 360, ar = rad(a), lx_ = x + Math.cos(ar) * rx, ly_ = y + Math.sin(ar) * ry; const ang = a + 70;
    p.ell(lx_, ly_, 9 * u, 4.2 * u, i % 2 ? "#7aa84a" : "#5a8a36", 1.6 * u, 0, 360, ang); }
  for (let i = 0; i < 4; i++) p.dot(x + Math.cos(rad(200 + i * 40)) * rx, y + Math.sin(rad(200 + i * 40)) * ry, 2.6 * u, "#e3b23c");
};
/** laurel wreath worn on the head; w = 1 (on) or {slip} */
const wreathOn = (p, cx, hc, H, u, w) => { const slip = typeof w === "object" ? w.slip || 0 : 0; wreathRing(p, cx + 0.15 * slip * H.a, hc - (0.72 - 0.55 * slip) * H.b, 1.0 * H.a, 0.3 * H.b, u, -14 * slip); };

// ---------------- effects ----------------
const MB = (t, s = 1.7) => { t = Math.max(0, Math.min(1, t)) - 1; return t * t * ((s + 1) * t + s) + 1; };
/** horn honk burst lines */
export const fxHonk = (p, t) => { const g = p.g; g.save(); g.globalAlpha = Math.sin(Math.PI * Math.min(1, t)); const r0 = 80 + 120 * t;
  for (let i = -2; i <= 2; i++) { const a = i * 0.32; p.stroke([[300 + Math.cos(a) * r0, 500 + Math.sin(a) * r0], [300 + Math.cos(a) * (r0 + 120), 500 + Math.sin(a) * (r0 + 120)]], 22, INK); p.stroke([[300 + Math.cos(a) * r0, 500 + Math.sin(a) * r0], [300 + Math.cos(a) * (r0 + 120), 500 + Math.sin(a) * (r0 + 120)]], 11, "#fff3b0"); } g.restore(); };
/** sweat drops flying off (t loops) */
export const fxDrops = (p, t, n = 5) => { for (let i = 0; i < n; i++) { const k = (t + i / n) % 1, sd = i % 2 ? 1 : -1, x = 300 + sd * (60 + 260 * k), y = 420 - 220 * Math.sin(k * Math.PI) + 200 * k; const g = p.g; g.save(); g.globalAlpha = 1 - k * 0.6;
  p.poly([[x, y - 46], [x + 26, y + 8], [x, y + 36], [x - 26, y + 8]], "#9fd4ff", 9); p.ell(x - 7, y + 4, 6, 9, "#ffffffcc", 0); g.restore(); } };
/** whistle blast lines + rings */
export const fxTweet = (p, t) => { const g = p.g; g.save(); g.globalAlpha = Math.min(1, (1 - t) * 2.2); for (let i = 0; i < 3; i++) { const r = 60 + 110 * i + 140 * t; p.arc(240, 520, r, r * 0.9, -50, 50, 18); } g.restore(); };
/** speech bubble with a little drawing of a car carrying a waving runner */
export const fxCarBubble = (p, t = 1) => { const k = MB(t, 1.6), g = p.g; g.save(); g.translate(300, 620); g.scale(k, k); g.translate(-300, -620);
  p.poly(rrect(40, 330, 560, 640, 70), "#ffffff", 12); p.poly([[180, 630], [120, 760], [270, 632]], "#ffffff", 12); p.poly(rrect(46, 336, 554, 634, 66), "#ffffff", 0);
  // car
  p.poly([[110, 540], [140, 470], [330, 470], [360, 430], [450, 430], [490, 540]], "#c8322e", 9); p.poly([[352, 470], [374, 442], [436, 442], [452, 470]], "#bfe4f2", 6);
  for (const x of [170, 430]) { p.ell(x, 556, 44, 44, "#2a2a30", 9); p.ell(x, 556, 18, 18, "#e3b23c", 5); }
  // waving runner
  p.ell(250, 410, 30, 32, "#f1c9a2", 8); p.poly([[222, 440], [278, 440], [284, 476], [216, 476]], "#f6f3ea", 8); p.stroke([[276, 448], [312, 404], [330, 372]], 12); p.stroke([[276, 448], [312, 404], [330, 372]], 6, "#f1c9a2");
  p.dot(240, 404, 5); p.dot(262, 404, 5); p.arc(251, 418, 12, 8, 20, 160, 5);
  for (let i = 0; i < 3; i++) p.stroke([[100 - i * 18, 480 + i * 22], [50 - i * 18, 480 + i * 22]], 9, "#8a8a96");
  g.restore(); };
/** flying straw boater (thrown hats) */
export const fxBoater = (p, a = 0, col = "#e8cf8a", band = "#c8322e") => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(a); g.translate(-300, -500);
  p.ell(300, 540, 230, 70, col, 12); p.poly([[180, 540], [190, 430], [410, 430], [420, 540]], col, 12); p.ell(300, 430, 110, 30, mul(col, [1.1, 1.08, 1.04]), 9); p.band([[186, 505], [414, 505]], band, 34, 6); g.restore(); };
/** smiling sun for the hallucination */
export const fxSun = (p, t = 0) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(t * 0.8); g.translate(-300, -500);
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, r0 = 200, r1 = 270 + 25 * Math.sin(t * 6 + i); p.poly([[300 + Math.cos(a - 0.12) * r0, 500 + Math.sin(a - 0.12) * r0], [300 + Math.cos(a) * r1, 500 + Math.sin(a) * r1], [300 + Math.cos(a + 0.12) * r0, 500 + Math.sin(a + 0.12) * r0]], i % 2 ? "#ffb03a" : "#ffd84a", 9); } g.restore();
  p.ell(300, 500, 190, 190, "#ffe066", 12); p.ell(240, 480, 16, 28, INK, 0); p.ell(360, 480, 16, 28, INK, 0); p.arc(300, 540, 70, 46, 20, 160, 12); p.ell(200, 560, 26, 14, "#ff9a7a", 0); p.ell(400, 560, 26, 14, "#ff9a7a", 0); };
/** orbiting stars + little birds over a dizzy head (t loops) */
export const fxDizzy = (p, t) => { for (let i = 0; i < 5; i++) { const a = t * Math.PI * 2 + i * Math.PI * 2 / 5, x = 300 + 230 * Math.cos(a), y = 500 + 70 * Math.sin(a), s = 0.8 + 0.25 * Math.sin(a), pts = [];
  if (i % 2) { p.stroke([[x - 30 * s, y], [x - 10 * s, y - 16 * s], [x, y - 4 * s], [x + 10 * s, y - 16 * s], [x + 30 * s, y]], 9 * s); continue; }
  for (let k = 0; k < 10; k++) { const r = k % 2 ? 18 * s : 44 * s, b = rad(k * 36 - 90 + t * 200); pts.push([x + r * Math.cos(b), y + r * Math.sin(b)]); } p.poly(pts, "#ffd84a", 8); } };
/** starter-pistol bang: flash burst + smoke */
export const fxBang = (p, t) => { const g = p.g; if (t < 0.35) { const k = t / 0.35; g.save(); g.globalAlpha = 1 - k; const st = []; for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, r = (i % 2 ? 80 : 230) * (0.6 + 0.6 * k); st.push([300 + Math.cos(a) * r, 500 + Math.sin(a) * r]); } p.poly(st, "#fff3b0", 10); g.restore(); }
  g.save(); g.globalAlpha = Math.max(0, 0.95 - t * 0.9); for (let i = 0; i < 6; i++) { const a = i * 1.05 + t, r = 60 + t * 160; p.ell(300 + Math.cos(a) * r * 0.7, 500 - t * 120 + Math.sin(a) * r * 0.4, 90 + t * 70, 75 + t * 60, "#eeeae4", 0); } g.restore(); };
/** a camera flash pop (press photographers) */
export const fxFlashPop = (p, t) => { const g = p.g; g.save(); g.globalAlpha = Math.max(0, 1 - t); const gr = g.createRadialGradient(300, 500, 0, 300, 500, 280); gr.addColorStop(0, "rgba(255,255,240,1)"); gr.addColorStop(1, "rgba(255,255,240,0)"); g.fillStyle = gr; g.fillRect(0, 200, 600, 600); g.restore(); fxSparkle(p, t); };
/** clank burst for the breakdown */
export const fxClank = (p, t) => { const g = p.g, k = MB(Math.min(1, t * 2), 2); g.save(); g.globalAlpha = Math.min(1, (1 - t) * 2); g.translate(300, 500); g.scale(k, k); g.translate(-300, -500);
  const st = []; for (let i = 0; i < 14; i++) { const a = i * Math.PI / 7 + 0.2, r = i % 2 ? 90 : 220; st.push([300 + Math.cos(a) * r, 500 + Math.sin(a) * r]); } p.poly(st, "#fff3b0", 12); p.poly(st.map(([x, y]) => [300 + (x - 300) * 0.55, 500 + (y - 500) * 0.55]), "#ff8a3a", 0); g.restore(); };
/** little spinning hubcap */
export const fxHubcap = (p, a = 0) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(a); g.translate(-300, -500); p.ell(300, 500, 150, 150, "#e3b23c", 14); p.ell(300, 500, 100, 100, "#f2d27a", 8); p.ell(300, 500, 34, 34, "#a97c1e", 8); p.stroke([[240, 430], [280, 410]], 14, "#ffffffaa"); g.restore(); };
/** music notes for the jogging whistle */
export const fxTune = (p, t) => { const g = p.g; g.save(); for (let i = 0; i < 3; i++) { const tt = (t + i / 3) % 1; g.globalAlpha = Math.sin(Math.PI * tt); const x = 220 + i * 70 + 50 * Math.sin(tt * 6 + i), y = 760 - tt * 520; g.save(); g.translate(x, y); g.scale(0.45, 0.45); g.translate(-300, -500); fxNote(p, i % 2 ? "note2" : "note", "#1f2a44"); g.restore(); } g.restore(); };
/** heat shimmer wavy lines */
export const fxHeat = (p, t) => { const g = p.g; g.save(); g.globalAlpha = 0.85; for (let k = 0; k < 3; k++) { const pts = []; for (let i = 0; i <= 20; i++) pts.push([180 + k * 120 + 22 * Math.sin(i * 0.8 + t * 8 + k), 820 - i * 30]); p.stroke(pts, 14, "#ffffff"); p.stroke(pts, 7, "#ff9a5a"); } g.restore(); };
/** loose laurel wreath (handed over / snatched) */
export const fxWreath = (p, rot = 0) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(rot); g.translate(-300, -500); wreathRing(p, 300, 500, 200, 80, 5, 0); g.restore(); };
/** soft dust cloud: one ink outline around the union of puffs (k 0..1 growth) */
export const fxCloud2 = (p, k, col = "#e6d2a8", seed = 1) => { const g = p.g, n = 7, P_ = [];
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + seed, r = 70 + 120 * k; P_.push([300 + Math.cos(a) * r * 1.15, 560 + Math.sin(a) * r * 0.55 - 30 * k, 95 + 55 * k + 18 * Math.sin(i * 2.3 + seed)]); }
  P_.push([300, 540 - 20 * k, 140 + 90 * k]);
  for (const [x, y, r] of P_) p.ell(x, y, r, r * 0.82, INK, 0); g.save(); g.globalCompositeOperation = "source-atop"; g.restore();
  for (const [x, y, r] of P_) p.ell(x, y, r - 11, r * 0.82 - 11, col, 0);
  for (const [x, y, r] of P_) p.ell(x - r * 0.25, y - r * 0.3, r * 0.45, r * 0.3, "#ffffff44", 0);
  for (const [x, y, r] of P_) p.ell(x + r * 0.2, y + r * 0.35, r * 0.6, r * 0.25, "#00000018", 0); };

// ---------------- "The Fighter Jet Bought With Soda Points" cast (our own designs) — appended last in toon.js ----------------
// The student (a real, living person) is drawn ONLY from behind via founderBack({who:'L'}). The judge (living) is a far, backlit
// silhouette (tinted card, no features) or just a sleeve + hand. The ad's teen pilot wears a helmet with the visor down.
FACE.gasp = { eye: ["shock", "shock"], brow: [-6, -6], mouth: "O" };
FACE.lol = { eye: ["happy", "happy"], brow: [-4, -4], mouth: "laugh" };
FACE.gulp2 = { eye: ["shock", "shock"], brow: [5, 5], mouth: "o" };
FACE.smirk = { eye: ["lid", "lid"], brow: [-3, 4], mouth: "smileWide" };
FACE.serious = { eye: ["lid", "lid"], brow: [4, 4], mouth: "dash" };

Object.assign(OUTFITS, {
  kidA: { tunic: "#e8603a", sleeve: "#e05a34", pants: "#3a5a9a", boots: "#f2efe6", skin: "#f0c8a6", hair: "#3a2418", cap: "#2d4a8a" },
  kidB: { tunic: "#7a5ab8", sleeve: "#7052ac", dress: "#2f8a8a", pants: "#efe8dc", boots: "#2a2224", skin: "#c99067", bob: "#1e1714", hairUnder: true, lashes: true, uniform: "teen" },
  kidC: { tunic: "#f2c23c", sleeve: "#e8b832", pants: "#2a2a40", boots: "#f2efe6", skin: "#f5c9a0", hair: "#b8742e" },
  kidD: { tunic: "#3f8a5a", sleeve: "#378050", pants: "#4a4a5a", boots: "#c8322e", skin: "#e6b48e", hair: "#1a1410", cap: "#c8322e" },
  exec: { tunic: "#2a2f3a", sleeve: "#262a34", pants: "#22252e", boots: "#141216", skin: "#f3d6bb", uniform: "suit", tie: "#c8322e", hair: "#5a4030", glasses: true, stout: true },
  lawyerA: { tunic: "#3a3f4e", sleeve: "#343846", pants: "#2a2d36", boots: "#141216", skin: "#e6b48e", uniform: "suit", tie: "#2d4a8a", hair: "#2a1e18" },
  lawyerB: { tunic: "#4a3f3a", sleeve: "#433832", dress: "#4a3f3a", pants: "#efe8dc", boots: "#141216", skin: "#f7d3b4", uniform: "suit", tie: "#7a2a3a", bob: "#7a4a2a", hairUnder: true, lashes: true },
  investor: { tunic: "#2a2a34", sleeve: "#24242c", pants: "#22222a", boots: "#141216", skin: "#e0c0a0", uniform: "suit", tie: "#3a3a44", hair: "#2a2a2a" },
  judge: { tunic: "#141218", sleeve: "#141218", pants: "#141218", boots: "#141216", skin: "#b89a80", hair: "#9a9488", stout: true },
});

/** the ad's teen pilot, seen in the cockpit: flight suit shoulders, white helmet, dark visor fully down (no face). opts: wv (wave phase), arm 'wave'|'thumb'|'hang' */
export const pilotCard = (p, opts = {}) => {
  const thick = thickAngle(rad(-120)), cx = 300, hy = 560, a = 100, b = 104, suit = "#5f7a4a";
  const sh = [[cx - 150, 975], [cx - 140, 760], [cx - 70, 700], [cx + 70, 700], [cx + 140, 760], [cx + 150, 975]];
  if (opts.arm === "wave" || opts.arm === "thumb") { const w = opts.arm === "wave" ? 30 * Math.sin(opts.wv || 0) : 0, pts = [[cx + 120, 760], [cx + 220, 640], [cx + 236 + w, 470]];
    p.stroke(curve(pts[0], pts[1], pts[2]), 66, INK); p.stroke(curve(pts[0], pts[1], pts[2]), 48, suit); p.ell(pts[2][0], pts[2][1], 34, 32, "#e8e4da", 8);
    if (opts.arm === "thumb") p.stroke([[pts[2][0], pts[2][1] - 10], [pts[2][0] + 6, pts[2][1] - 52]], 16); }
  p.gradFill(sh, suit, mul(suit, [0.62, 0.62, 0.7]), rad(-120)); p.inkRing(sh, 10, thick);
  p.poly([[cx - 40, 700], [cx + 40, 700], [cx + 24, 780], [cx - 24, 780]], "#3a4a2e", 6); p.poly(rrect(cx + 50, 790, cx + 120, 830, 6), "#f2c23c", 5);
  const hp = blobPts(cx, hy, { a, b, nTop: 2.1, nBot: 2.3, egg: -0.06, asym: 0, rot: 0, noise: 0.004, seed: 3 });
  p.shadedFill(hp, "#f4f4f0", "#b8bcc4", rad(-120), a); p.inkRing(hp, 11, thick);
  const vs = ellPts(cx, hy + 18, a * 0.86, b * 0.62, 0, 360, 0, 36); p.shadedFill(vs, "#2a3448", "#141a26", rad(-120), a * 0.8, 0.6); p.inkRing(vs, 8, thick);
  p.stroke(ellPts(cx - 30, hy - 4, a * 0.4, b * 0.22, 200, 290, 0, 12), 9, "#ffffff70"); p.dot(cx + 40, hy - 18, 8, "#ffffffaa");
  p.band([[cx - a * 0.95, hy - b * 0.45], [cx + a * 0.95, hy - b * 0.45]], "#c8322e", 14, 4); p.stroke([[cx - a * 0.2, hy - b * 0.98], [cx + a * 0.2, hy - b * 0.98]], 7, "#c9ccd0");
};

// ---------------- effects ----------------
const PJB = (t, s = 1.7) => { t = Math.max(0, Math.min(1, t)) - 1; return t * t * ((s + 1) * t + s) + 1; };
/** a banded bundle of cash (flying into the stack) */
export const fxCash = (p, a = 0) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(a); g.translate(-300, -500);
  p.poly(rrect(120, 420, 480, 580, 10), "#9cc28a", 12); p.poly(rrect(140, 440, 460, 560, 8), "#b8d8a4", 5); p.ell(300, 500, 46, 50, "#d8e8c8", 5); g.textAlign = "center"; g.textBaseline = "middle"; g.font = "900 70px Arial Black, Arial"; g.fillStyle = "#3a6a30"; g.fillText("$", 300, 504);
  p.poly(rrect(200, 412, 236, 588, 4), "#f2efe6", 6); g.restore(); };
/** an envelope (mail) */
export const fxEnv = (p, a = 0) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(a); g.translate(-300, -500);
  p.poly(rrect(110, 400, 490, 600, 14), "#f4ead0", 12); p.stroke([[118, 408], [300, 520], [482, 408]], 9, "#b8a47e"); p.poly(rrect(408, 418, 466, 482, 4), "#c8322e", 6); g.restore(); };
/** a "21" number balloon */
export const fxNum = (p, s = "21", t = 1, col = "#e0607a") => { const k = PJB(t, 1.6), g = p.g; g.save(); g.translate(300, 500); g.scale(k, k); g.translate(-300, -500);
  p.stroke([[300, 690], [290, 800], [310, 900], [300, 980]], 6, INK); g.textAlign = "center"; g.textBaseline = "middle"; g.font = "900 380px Arial Black, Arial"; g.lineJoin = "round"; g.lineWidth = 34; g.strokeStyle = INK; g.strokeText(s, 300, 470); g.fillStyle = col; g.fillText(s, 300, 470);
  g.fillStyle = "#ffffff88"; g.font = "900 380px Arial Black, Arial"; g.save(); g.beginPath(); g.rect(0, 280, 600, 70); g.clip(); g.fillText(s, 300, 470); g.restore(); g.restore(); };
/** a little cardboard "points" label (the 15 real labels / points proof) */
export const fxRing2 = (p, t) => { const g = p.g; g.save(); g.globalAlpha = Math.max(0, 1 - t); for (let i = 0; i < 2; i++) { const r = 80 + 260 * t + i * 60; p.ell(300, 500, r, r * 0.9, null, 16 * (1 - t) + 2); } g.restore(); };
/** cha-ching coins popping */
export const fxCoins = (p, t) => { const g = p.g; g.save(); for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.38, r = 60 + 320 * t, x = 300 + Math.cos(a) * r, y = 560 + Math.sin(a) * r + 420 * t * t; g.globalAlpha = Math.max(0, 1 - t * 0.9);
  p.ell(x, y, 40, 40 * Math.abs(Math.cos(t * 9 + i)) + 6, "#f2c23c", 8); } g.restore(); };

// ---------------- "The Popcorn Trap" cast (our own fictional designs) — appended last in toon.js ----------------
FACE.tempt = { eye: ["happy", "happy"], brow: [-3, -3], mouth: "smileWide" };
FACE.think2 = { eye: ["lid", "lid"], brow: [3, -4], mouth: "dash" };
Object.assign(OUTFITS, {
  // the customer: young adult, teal hoodie (matches HOODIES.P back view), jeans
  cust: { tunic: "#2f7f8f", sleeve: "#2a7484", pants: "#3a4a6a", boots: "#f2efe6", skin: "#f0c8a6", hair: "#4a3020", uniform: "teen" },
  // the cinema cashier: dark-red vest over white shirt, bow tie, paper cap
  cash: { tunic: "#a8282c", sleeve: "#f4f1ea", pants: "#22252e", boots: "#141216", skin: "#c99067", hair: "#1a1410", uniform: "suit", tie: "#1c1c22", cap: "#a8282c" },
  stuA: { tunic: "#d9a441", sleeve: "#cc9a3a", pants: "#3a4a6a", boots: "#2a2224", skin: "#f5c9a0", hair: "#b8742e", uniform: "teen" },
  stuB: { tunic: "#7a5ab8", sleeve: "#7052ac", pants: "#3a3a4a", boots: "#2a2224", skin: "#c99067", hair: "#1e1714", lashes: true, uniform: "hoodie" },
  stuC: { tunic: "#3f8a5a", sleeve: "#378050", pants: "#4a4a5a", boots: "#c8322e", skin: "#e6b48e", hair: "#1a1410", uniform: "teen" },
});
HOODIES.P = { hood: "#2f7f8f", hair: "#4a3020", style: "short", skin: "#f0c8a6" };
/** hoodie front (patched into aussieTorso by build.sh): fabric, ribbed hem over the base belt, hood collar, drawstrings, kangaroo pocket */
const hoodiePaint = (p, O, tcx, T, chin, torsoBot, HH, u) => {
  fabric(p, tcx, T, chin, torsoBot, HH, u);
  const d1 = mul(O.tunic, [0.78, 0.78, 0.82]), d2 = mul(O.tunic, [0.62, 0.62, 0.68]);
  p.band([[tcx - 1.5 * T.a, torsoBot - 0.24 * HH], [tcx + 1.5 * T.a, torsoBot - 0.24 * HH]], O.tunic, 0.09 * HH, 0);          // hide the base belt
  p.band([[tcx - 1.5 * T.a, torsoBot - 0.1 * HH], [tcx + 1.5 * T.a, torsoBot - 0.1 * HH]], d1, 0.12 * HH, 1.2 * u);           // ribbed hem
  for (let i = -10; i <= 10; i++) p.stroke([[tcx + i * 0.14 * T.a, torsoBot - 0.155 * HH], [tcx + i * 0.14 * T.a, torsoBot - 0.05 * HH]], 1 * u, d2);
  const pk = [[tcx - 0.62 * T.a, torsoBot - 0.17 * HH], [tcx + 0.62 * T.a, torsoBot - 0.17 * HH], [tcx + 0.46 * T.a, torsoBot - 0.46 * HH], [tcx - 0.46 * T.a, torsoBot - 0.46 * HH]];
  p.poly(pk, mul(O.tunic, [0.92, 0.92, 0.95]), 1.6 * u); p.stroke([[tcx - 0.46 * T.a, torsoBot - 0.43 * HH], [tcx + 0.46 * T.a, torsoBot - 0.43 * HH]], 1 * u, d2);
  p.band(ellPts(tcx, chin - 0.02 * HH, 0.62 * T.a, 0.16 * HH, 0, 180, 0, 20), d1, 0.07 * HH, 1.4 * u);                       // hood collar
  for (const sd of [-1, 1]) { const x = tcx + sd * 0.2 * T.a; p.stroke([[x, chin + 0.08 * HH], [x + sd * 0.03 * T.a, chin + 0.42 * HH]], 2.2 * u, "#f4f1ea"); p.poly(rrect(x + sd * 0.03 * T.a - 2.6 * u, chin + 0.41 * HH, x + sd * 0.03 * T.a + 2.6 * u, chin + 0.47 * HH, 1 * u), "#c9ccd0", 1 * u); }
};
OUTFITS.cust.uniform = "hoodie"; OUTFITS.stuA.uniform = "hoodie"; OUTFITS.stuC.uniform = "hoodie";
/** popcorn burst: kernels flying out from the centre (t 0..1), seeded */
export const fxPop = (p, t, n = 9, seed = 1) => { const g = p.g; g.save(); const r = (i) => { const x = Math.sin((i + 1) * 127.1 * seed + 311.7) * 43758.5453; return x - Math.floor(x); };
  for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (r(i) - 0.5) * 2.6, v = 220 + 260 * r(i + 9), x = 300 + Math.cos(a) * v * t, y = 560 + Math.sin(a) * v * t + 520 * t * t, s = 0.8 + 0.5 * r(i + 3);
    g.globalAlpha = Math.max(0, 1 - Math.max(0, t - 0.65) / 0.35); g.save(); g.translate(x, y); g.rotate(t * 6 * (r(i + 5) - 0.5)); g.scale(s, s);
    for (const [dx, dy, rr_] of [[0, 0, 22], [-16, -10, 16], [15, -12, 17], [4, -22, 14], [-8, 12, 14]]) p.ell(dx, dy, rr_, rr_ * 0.9, "#fff4d6", 5); p.ell(2, 8, 7, 6, "#e8b860", 0); g.restore(); }
  g.restore(); };
/** one popped kernel (thrown/caught) */
export const fxKernel = (p, a = 0) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(a); for (const [dx, dy, rr_] of [[0, 0, 70], [-50, -30, 52], [48, -36, 54], [10, -70, 46], [-26, 38, 46]]) p.ell(dx, dy, rr_, rr_ * 0.9, "#fff4d6", 14); p.ell(6, 26, 22, 18, "#e8b860", 0); g.restore(); };

// ---------------- "Sam: Day 0 to Day 100" cast (our own fictional designs) — appended last in toon.js ----------------
// All characters are fictional. No logos. Built on romanFront (patched by build.sh: O.shoe, opts.sit, O.legK/torsoK, SAM_TORSO, samAfter, samLate).
FACE.cry = { eye: ["squeeze", "squeeze"], brow: [-4, -4], mouth: "wave" };
FACE.teary = { eye: ["lid", "lid"], brow: [-5, -5], mouth: "smile" };
FACE.tired = { eye: ["lid", "lid"], brow: [-2, -2], mouth: "dash" };
FACE.focus = { eye: ["slit", "slit"], brow: [4, 4], mouth: "dash" };
FACE.angry = { eye: ["dot", "dot"], brow: [7, 7], mouth: "frown" };
FACE.grimace = { eye: ["squeeze", "squeeze"], brow: [4, 4], mouth: "teeth" };
FACE.soft = { eye: ["happy", "happy"], brow: [-2, -2], mouth: "smile" };

const DENIM = "#34507a", DENIM_D = "#263c5e", SNEAK = "#f2efe6";
const SAMB = "#3d7fd0"; // Sam's blue hoodie
const base = (o) => ({ after: true, shoe: "#3a3036", ...o });
Object.assign(OUTFITS, {
  // Sam at 17-18: blue hoodie (drawstrings, pocket, ribbed hem), dark jeans, worn sneakers, brown short hair
  sam: base({ tunic: SAMB, sleeve: "#3574c2", pants: DENIM, jeans: 1, shoe: SNEAK, sneaker: 1, skin: "#f2c9a4", hair: "#6a4228", uniform: "hoodie" }),
  samSocks: base({ tunic: SAMB, sleeve: "#3574c2", pants: DENIM, jeans: 1, shoe: "#f4f2ee", socks: 1, skin: "#f2c9a4", hair: "#6a4228", uniform: "hoodie" }),
  sam15: base({ tunic: "#4a86c8", sleeve: "#427cbe", pants: DENIM, jeans: 1, shoe: SNEAK, sneaker: 1, skin: "#f2c9a4", hair: "#6a4228", uniform: "hoodie" }),
  sam12: base({ tunic: "#8a96a6", sleeve: "#7e8a9a", pants: DENIM, jeans: 1, shoe: "#e04a3a", sneaker: 1, skin: "#f2c9a4", hair: "#6a4228", uniform: "hoodie", legK: 0.95, torsoK: 0.95 }),
  sam9: base({ tunic: "#e0a43a", sleeve: "#d89a32", pants: "#4a6a9a", jeans: 1, shoe: "#3a7ad8", sneaker: 1, skin: "#f2c9a4", hair: "#6a4228", uniform: "stripe", stripe: "#3a6ab8", legK: 0.86, torsoK: 0.9 }),
  sam5: base({ tunic: "#d8443c", sleeve: "#cc3c34", pants: "#4a6a9a", shoe: "#f2efe6", sneaker: 1, skin: "#f4cdaa", hair: "#6a4228", uniform: "tee", truckTee: 1, legK: 0.72, torsoK: 0.85 }),
  sam1: base({ tunic: "#9ad0e8", sleeve: "#8cc4dc", pants: "#9ad0e8", shoe: "#f4f2ee", skin: "#f6d2b0", hair: "#7a5234", uniform: "onesie", legK: 0.5, torsoK: 0.78, stout: true }),
  // Mia: older sister, long dark hair, mustard sweater, jeans; kid version for flashbacks; gas-station polo at 18
  mia: base({ tunic: "#d9a326", sleeve: "#cf9a22", pants: DENIM, jeans: 1, shoe: "#f2efe6", sneaker: 1, skin: "#eec2a0", hair: "#2a1c18", longHair: "#2a1c18", lashes: true, uniform: "sweater" }),
  mia18: base({ tunic: "#c8402e", sleeve: "#c03a28", pants: "#2e3442", shoe: "#2a2428", skin: "#eec2a0", hair: "#2a1c18", longHair: "#2a1c18", lashes: true, uniform: "polo", tag: "MIA" }),
  mia12: base({ tunic: "#e2b23a", sleeve: "#d8aa34", pants: DENIM, jeans: 1, shoe: "#e05a8a", sneaker: 1, skin: "#eec2a0", hair: "#2a1c18", longHair: "#2a1c18", lashes: true, uniform: "sweater", legK: 0.92, torsoK: 0.95 }),
  mia3: base({ tunic: "#f2c23a", sleeve: "#eab832", dress: "#f2c23a", pants: "#f4e6c8", shoe: "#e05a8a", skin: "#eec2a0", hair: "#2a1c18", pig: "#2a1c18", lashes: true, uniform: "kiddress", legK: 0.6, torsoK: 0.82 }),
  // Linda (Mom): diner uniform — teal dress, white apron, name tag, hair bun; flat shoes (no boots)
  linda: base({ tunic: "#2a9a92", sleeve: "#24908a", dress: "#2a9a92", pants: "#e8c8a8", shoe: "#2a2428", skin: "#f0c8a4", hair: "#7a4a2e", bun: "#7a4a2e", lashes: true, uniform: "waitress", apronW: 1, tag: "LINDA" }),
  lindaOff: base({ tunic: "#2a9a92", sleeve: "#24908a", dress: "#2a9a92", pants: "#e8c8a8", shoe: "#2a2428", skin: "#f0c8a4", hair: "#7a4a2e", bun: "#7a4a2e", lashes: true, uniform: "waitress", tag: "LINDA" }),
  lindaHome: base({ tunic: "#b86a8a", sleeve: "#ae6282", pants: "#4a4a5e", shoe: "#c8b8a8", skin: "#f0c8a4", hair: "#7a4a2e", bun: "#7a4a2e", lashes: true, uniform: "cardigan", vestCol: "#e8dcc8" }),
  // Ray (Dad): red cap, grey beard, green work shirt, jeans, work boots
  ray: base({ tunic: "#4f7a4a", sleeve: "#487242", pants: DENIM, jeans: 1, boots: "#6a4a2e", skin: "#e8b894", cap: "#c0302c", beard: "#b8b4ac", beardK: 0.62, uniform: "work", stout: true }),
  rayYoung: base({ tunic: "#4f7a4a", sleeve: "#487242", pants: DENIM, jeans: 1, boots: "#6a4a2e", skin: "#e8b894", cap: "#c0302c", beard: "#6a4a30", beardK: 0.62, uniform: "work", stout: true }),
  rayVest: base({ tunic: "#4f7a4a", sleeve: "#487242", pants: DENIM, jeans: 1, boots: "#6a4a2e", skin: "#e8b894", cap: "#c0302c", beard: "#8a7a68", beardK: 0.62, uniform: "work", hivis: 1, stout: true }),
  rayShop: base({ tunic: "#4f7a4a", sleeve: "#487242", pants: DENIM, jeans: 1, boots: "#6a4a2e", skin: "#e8b894", cap: "#c0302c", beard: "#b8b4ac", beardK: 0.62, uniform: "work", shopApron: 1, stout: true }),
  // Mr. Hollis: bald, round glasses, white moustache, white shirt + brown vest/cardigan
  hollis: base({ tunic: "#8a5a36", sleeve: "#ece6da", pants: "#5a5048", shoe: "#3a2a22", skin: "#f0caa8", moustache: "#f4f1ea", glasses: true, tufts: "#f4f1ea", uniform: "cardigan", vestCol: "#f2eee4" }),
  // Dee: laid-off mechanic, grey-blue coveralls with name patch
  dee: base({ tunic: "#5a6e86", sleeve: "#54687e", pants: "#5a6e86", shoe: "#2a2428", boots: "#2a2428", skin: "#c99067", hair: "#1e1714", bun: "#1e1714", lashes: true, uniform: "coveralls", tag: "DEE" }),
  kidA: base({ tunic: "#2f9a6a", sleeve: "#2a8e60", pants: "#3a3a4a", shoe: SNEAK, sneaker: 1, skin: "#f5c9a0", hair: "#c07a32", uniform: "hoodie", legK: 0.96 }),
  kidB: base({ tunic: "#8a5ab8", sleeve: "#8052ae", pants: DENIM, jeans: 1, shoe: "#e04a3a", sneaker: 1, skin: "#8a5a3a", hair: "#1a1410", style: "curly", lashes: true, uniform: "tee", legK: 0.96 }),
  inspector: base({ tunic: "#5a5e66", sleeve: "#565a62", pants: "#4a4e56", shoe: "#1a1416", skin: "#e2b08c", hair: "#3a3028", uniform: "suit", tie: "#2a4a8a" }),
  cop: base({ tunic: "#22305a", sleeve: "#1e2a52", pants: "#1e2a4a", shoe: "#141216", skin: "#c99067", cap: "#1c2648", uniform: "police", copCap: 1 }),
  buyer: base({ tunic: "#2a2e38", sleeve: "#262a34", pants: "#2a2e38", shoe: "#141216", skin: "#f0c8a4", hair: "#a8a8ac", uniform: "suit", tie: "#d8a020" }),
  landlord: base({ tunic: "#7a6a5a", sleeve: "#726252", pants: "#4a4440", shoe: "#2a2220", skin: "#e8b894", hair: "#5a5048", uniform: "suit", tie: "#6a2a2a", stout: true }),
  flea: base({ tunic: "#a83a32", sleeve: "#a0342c", pants: "#5a5040", shoe: "#4a3a2a", boots: "#4a3a2a", skin: "#e2a882", cap: "#3a5a3a", beard: "#8a5a3a", beardK: 0.55, uniform: "flannel" }),
  custA: base({ tunic: "#e07a3a", sleeve: "#d87234", pants: "#4a4a5a", shoe: SNEAK, sneaker: 1, skin: "#f0c8a4", hair: "#d8b060", lashes: true, uniform: "tee" }),
  custB: base({ tunic: "#3a8a8a", sleeve: "#348080", pants: DENIM, jeans: 1, shoe: "#4a3a2a", skin: "#a8704a", cap: "#e8e4d8", uniform: "flannel" }),
  custC: base({ tunic: "#7a3a5a", sleeve: "#72344f", pants: "#3a3a4a", shoe: "#2a2428", skin: "#f5c9a0", hair: "#9a9aa0", uniform: "cardigan", vestCol: "#e8dcc8", glasses: true }),
  neighbor: base({ tunic: "#6a7a9a", sleeve: "#627292", pants: "#4a4a4a", shoe: "#2a2428", skin: "#f0c8a4", hair: "#c8c0b0", bun: "#c8c0b0", lashes: true, uniform: "cardigan", vestCol: "#f0ead8" }),
  nurse: base({ tunic: "#6ab0c8", sleeve: "#62a8c0", pants: "#6ab0c8", shoe: "#f2efe6", skin: "#c99067", hair: "#1e1714", bun: "#1e1714", lashes: true, uniform: "scrubs" }),
});

/** torso painters (clipped to the torso blob; called from aussieTorso via the build patch) */
const SAM_TORSO = {
  stripe: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    for (let k = 0; k < 6; k++) p.band([[tcx - 1.5 * T.a, chin + (0.12 + k * 0.17) * HH], [tcx + 1.5 * T.a, chin + (0.12 + k * 0.17) * HH]], O.stripe, 0.06 * HH, 0);
    p.band(ellPts(tcx, chin - 0.03 * HH, 0.5 * T.a, 0.12 * HH, 0, 180, 0, 16), mul(O.tunic, [0.8, 0.8, 0.8]), 0.05 * HH, 1.2 * u); },
  tee: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    p.band(ellPts(tcx, chin - 0.03 * HH, 0.5 * T.a, 0.12 * HH, 0, 180, 0, 16), mul(O.tunic, [0.8, 0.8, 0.8]), 0.05 * HH, 1.2 * u);
    if (O.truckTee) { const x = tcx, y = chin + 0.42 * HH; p.poly(rrect(x - 0.42 * T.a, y - 0.12 * HH, x + 0.2 * T.a, y + 0.06 * HH, 2 * u), "#f2c23a", 1.4 * u); p.poly(rrect(x + 0.2 * T.a, y - 0.06 * HH, x + 0.44 * T.a, y + 0.06 * HH, 2 * u), "#f2c23a", 1.4 * u);
      for (const dx of [-0.26, 0.28]) p.ell(x + dx * T.a, y + 0.08 * HH, 0.09 * T.a, 0.05 * HH, "#2a2a30", 1.2 * u); }
    stitch(p, [[tcx - 1.3 * T.a, torsoBot - 0.12 * HH], [tcx + 1.3 * T.a, torsoBot - 0.12 * HH]], u, "#00000030"); },
  onesie: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    for (let k = 0; k < 5; k++) p.band([[tcx - 1.5 * T.a, chin + (0.1 + k * 0.2) * HH], [tcx + 1.5 * T.a, chin + (0.1 + k * 0.2) * HH]], "#f4f8fa", 0.05 * HH, 0);
    for (let k = 0; k < 3; k++) p.dot(tcx, chin + (0.2 + k * 0.17) * HH, 2.6 * u, "#f2c23a"); },
  kiddress: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    p.poly(ellPts(tcx, chin - 0.02 * HH, 0.46 * T.a, 0.16 * HH, 0, 180, 0, 18), "#fbf8f0", 1.4 * u);
    for (let i = 0; i < 10; i++) p.dot(tcx + Math.sin(i * 2.3) * 0.8 * T.a, chin + (0.2 + (i * 0.37) % 1 * 0.6) * HH, 3 * u, "#ffffffa0"); },
  sweater: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    const d1 = mul(O.tunic, [0.8, 0.78, 0.74]);
    p.band(ellPts(tcx, chin - 0.03 * HH, 0.46 * T.a, 0.12 * HH, 0, 180, 0, 18), d1, 0.07 * HH, 1.3 * u); // ribbed crew neck
    for (const sd of [-1, 0, 1]) { const x = tcx + sd * 0.42 * T.a; for (let k = 0; k < 7; k++) { const y = chin + (0.14 + k * 0.11) * HH; p.stroke([[x - 0.08 * T.a, y], [x, y + 0.05 * HH], [x + 0.08 * T.a, y]], 1.4 * u, d1); } } // cable knit
    p.band([[tcx - 1.5 * T.a, torsoBot - 0.1 * HH], [tcx + 1.5 * T.a, torsoBot - 0.1 * HH]], d1, 0.11 * HH, 1.2 * u);
    for (let i = -10; i <= 10; i++) p.stroke([[tcx + i * 0.14 * T.a, torsoBot - 0.15 * HH], [tcx + i * 0.14 * T.a, torsoBot - 0.05 * HH]], 1 * u, mul(O.tunic, [0.62, 0.6, 0.56])); },
  polo: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    for (const sd of [-1, 1]) p.poly([[tcx, chin + 0.02 * HH], [tcx + sd * 0.5 * T.a, chin - 0.08 * HH], [tcx + sd * 0.42 * T.a, chin + 0.12 * HH]], mul(O.tunic, [0.85, 0.85, 0.85]), 1.4 * u);
    p.stroke([[tcx, chin + 0.02 * HH], [tcx, chin + 0.3 * HH]], 1.6 * u); for (let k = 0; k < 2; k++) p.dot(tcx + 3 * u, chin + (0.1 + k * 0.1) * HH, 2.2 * u, "#f4f1ea");
    if (O.tag) tagText(p, tcx + 0.55 * T.a, chin + 0.3 * HH, 0.55 * T.a, 0.1 * HH, O.tag, u); },
  waitress: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    for (const sd of [-1, 1]) p.poly([[tcx, chin + 0.04 * HH], [tcx + sd * 0.52 * T.a, chin - 0.08 * HH], [tcx + sd * 0.46 * T.a, chin + 0.14 * HH]], "#fbf8f0", 1.4 * u); // white collar
    for (let k = 0; k < 4; k++) p.dot(tcx, chin + (0.14 + k * 0.15) * HH, 2.4 * u, "#fbf8f0");
    if (O.apronW) { const top = chin + 0.36 * HH; p.poly([[tcx - 0.46 * T.a, top], [tcx + 0.46 * T.a, top], [tcx + 0.5 * T.a, torsoBot + 0.1 * HH], [tcx - 0.5 * T.a, torsoBot + 0.1 * HH]], "#fbfaf4", 1.6 * u); // apron bib
      for (const sd of [-1, 1]) p.stroke([[tcx + sd * 0.44 * T.a, top], [tcx + sd * 0.64 * T.a, chin - 0.06 * HH]], 3 * u, "#fbfaf4"); }
    p.band([[tcx - 1.4 * T.a, torsoBot - 0.2 * HH], [tcx + 1.4 * T.a, torsoBot - 0.2 * HH]], O.apronW ? "#fbfaf4" : mul(O.tunic, [0.8, 0.8, 0.8]), 0.06 * HH, 1.2 * u);
    if (O.tag) tagText(p, tcx - 0.62 * T.a, chin + 0.24 * HH, 0.58 * T.a, 0.1 * HH, O.tag, u, "#fbf6e6", "#1a4a46"); },
  work: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    const d = mul(O.tunic, [0.78, 0.78, 0.78]);
    for (const sd of [-1, 1]) p.poly([[tcx, chin + 0.05 * HH], [tcx + sd * 0.55 * T.a, chin - 0.08 * HH], [tcx + sd * 0.5 * T.a, chin + 0.16 * HH]], d, 1.4 * u); // collar
    p.stroke([[tcx + 0.03 * T.a, chin + 0.05 * HH], [tcx + 0.03 * T.a, torsoBot]], 1.6 * u, d);
    for (let k = 0; k < 5; k++) p.dot(tcx + 0.06 * T.a, chin + (0.14 + k * 0.15) * HH, 2.4 * u, "#e8e0c8");
    for (const sd of [-1, 1]) { const x = tcx + sd * 0.48 * T.a, y = chin + 0.28 * HH; p.poly(rrect(x - 0.2 * T.a, y, x + 0.2 * T.a, y + 0.18 * HH, 2 * u), O.tunic, 1.2 * u); p.stroke([[x - 0.2 * T.a, y + 0.05 * HH], [x + 0.2 * T.a, y + 0.05 * HH]], 1.2 * u); }
    stitch(p, [[tcx - 1.2 * T.a, chin + 0.04 * HH], [tcx + 1.2 * T.a, chin + 0.04 * HH]], u, "#ffffff40");
    if (O.hivis) { const y0 = chin - 0.06 * HH; for (const sd of [-1, 1]) p.poly([[tcx + sd * 0.25 * T.a, y0], [tcx + sd * 1.3 * T.a, y0], [tcx + sd * 1.3 * T.a, torsoBot], [tcx + sd * 0.35 * T.a, torsoBot]], "#e8f03a", 1.4 * u);
      for (const sd of [-1, 1]) p.band([[tcx + sd * 0.35 * T.a, chin + 0.62 * HH], [tcx + sd * 1.3 * T.a, chin + 0.62 * HH]], "#e0e4e8", 0.06 * HH, 1 * u); }
    if (O.shopApron) { const top = chin + 0.3 * HH; p.poly([[tcx - 0.55 * T.a, top], [tcx + 0.55 * T.a, top], [tcx + 0.6 * T.a, torsoBot + 0.1 * HH], [tcx - 0.6 * T.a, torsoBot + 0.1 * HH]], "#7a4a2a", 1.6 * u);
      tagText(p, tcx, top + 0.14 * HH, 0.6 * T.a, 0.08 * HH, "DAY ONE", u, "#7a4a2a", "#f2e6c8"); } },
  flannel: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    const d = mul(O.tunic, [0.62, 0.62, 0.62]); const g = p.g; g.save(); g.globalAlpha = 0.5;
    for (let k = -6; k <= 6; k++) { p.stroke([[tcx + k * 0.24 * T.a, chin - 0.2 * HH], [tcx + k * 0.24 * T.a, torsoBot]], 4 * u, d); p.stroke([[tcx - 1.5 * T.a, chin + k * 0.14 * HH + 0.5 * HH], [tcx + 1.5 * T.a, chin + k * 0.14 * HH + 0.5 * HH]], 4 * u, d); }
    g.restore(); for (const sd of [-1, 1]) p.poly([[tcx, chin + 0.05 * HH], [tcx + sd * 0.55 * T.a, chin - 0.08 * HH], [tcx + sd * 0.5 * T.a, chin + 0.16 * HH]], O.tunic, 1.4 * u);
    for (let k = 0; k < 4; k++) p.dot(tcx, chin + (0.15 + k * 0.16) * HH, 2.4 * u, "#e8e0c8"); },
  cardigan: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    p.poly([[tcx - 0.36 * T.a, chin - 0.08 * HH], [tcx + 0.36 * T.a, chin - 0.08 * HH], [tcx + 0.1 * T.a, chin + 0.62 * HH], [tcx - 0.1 * T.a, chin + 0.62 * HH]], O.vestCol || "#f2eee4", 1.4 * u); // shirt V
    for (const sd of [-1, 1]) p.poly([[tcx + sd * 0.1 * T.a, chin - 0.06 * HH], [tcx + sd * 0.3 * T.a, chin - 0.08 * HH], [tcx + sd * 0.18 * T.a, chin + 0.06 * HH]], O.vestCol || "#f2eee4", 1.2 * u);
    for (let k = 0; k < 4; k++) p.dot(tcx + 0.16 * T.a, chin + (0.7 + k * 0.12) * HH, 2.8 * u, "#d8c8a8");
    p.stroke([[tcx + 0.1 * T.a, chin + 0.62 * HH], [tcx + 0.06 * T.a, torsoBot]], 1.6 * u);
    for (const sd of [-1, 1]) { const x = tcx + sd * 0.62 * T.a, y = chin + 0.72 * HH; p.poly(rrect(x - 0.18 * T.a, y, x + 0.18 * T.a, y + 0.16 * HH, 2 * u), O.tunic, 1.2 * u); } },
  coveralls: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    const d = mul(O.tunic, [0.78, 0.78, 0.8]);
    for (const sd of [-1, 1]) p.poly([[tcx, chin + 0.06 * HH], [tcx + sd * 0.56 * T.a, chin - 0.08 * HH], [tcx + sd * 0.52 * T.a, chin + 0.16 * HH]], d, 1.4 * u);
    p.stroke([[tcx, chin + 0.06 * HH], [tcx, torsoBot]], 2.4 * u, "#c9ccd0"); p.dot(tcx, chin + 0.2 * HH, 3 * u, "#c9ccd0");
    tagText(p, tcx + 0.56 * T.a, chin + 0.3 * HH, 0.5 * T.a, 0.1 * HH, O.tag || "", u, "#f2efe6", "#a8322e");
    p.poly(rrect(tcx - 0.8 * T.a, chin + 0.24 * HH, tcx - 0.36 * T.a, chin + 0.44 * HH, 2 * u), O.tunic, 1.2 * u);
    p.band([[tcx - 1.4 * T.a, torsoBot - 0.22 * HH], [tcx + 1.4 * T.a, torsoBot - 0.22 * HH]], d, 0.05 * HH, 1 * u);
    const g = p.g; g.save(); g.globalAlpha = 0.35; for (let i = 0; i < 5; i++) p.ell(tcx + Math.sin(i * 2.1) * 0.7 * T.a, chin + (0.4 + (i * 0.31) % 1 * 0.5) * HH, 8 * u, 4 * u, "#2a2a2a", 0); g.restore(); },
  police: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    for (const sd of [-1, 1]) p.poly([[tcx, chin + 0.05 * HH], [tcx + sd * 0.55 * T.a, chin - 0.08 * HH], [tcx + sd * 0.5 * T.a, chin + 0.16 * HH]], mul(O.tunic, [0.8, 0.8, 0.85]), 1.4 * u);
    p.stroke([[tcx, chin + 0.05 * HH], [tcx, torsoBot]], 1.6 * u, "#141a30"); for (let k = 0; k < 4; k++) p.dot(tcx + 0.05 * T.a, chin + (0.16 + k * 0.15) * HH, 2.4 * u, "#c9ccd0");
    const bx = tcx - 0.55 * T.a, by = chin + 0.3 * HH; p.poly([[bx, by - 10 * u], [bx + 8 * u, by - 4 * u], [bx + 6 * u, by + 8 * u], [bx, by + 12 * u], [bx - 6 * u, by + 8 * u], [bx - 8 * u, by - 4 * u]], "#e8c45a", 1.4 * u); // badge (generic star shield)
    for (const sd of [-1, 1]) { const x = tcx + sd * 0.5 * T.a, y = chin + 0.42 * HH; p.poly(rrect(x - 0.18 * T.a, y, x + 0.18 * T.a, y + 0.14 * HH, 2 * u), O.tunic, 1.2 * u); }
    p.band([[tcx - 1.4 * T.a, torsoBot - 0.2 * HH], [tcx + 1.4 * T.a, torsoBot - 0.2 * HH]], "#141216", 0.08 * HH, 1.2 * u);
    p.poly(rrect(tcx + 0.5 * T.a, torsoBot - 0.26 * HH, tcx + 0.8 * T.a, torsoBot - 0.1 * HH, 2 * u), "#2a2a2e", 1.2 * u); },
  scrubs: (p, O, tcx, T, chin, torsoBot, HH, u) => { fabric(p, tcx, T, chin, torsoBot, HH, u);
    p.poly([[tcx - 0.36 * T.a, chin - 0.06 * HH], [tcx + 0.36 * T.a, chin - 0.06 * HH], [tcx, chin + 0.3 * HH]], O.skin, 1.4 * u);
    p.poly(rrect(tcx - 0.8 * T.a, chin + 0.32 * HH, tcx - 0.36 * T.a, chin + 0.5 * HH, 2 * u), O.tunic, 1.2 * u); },
};

/** details drawn after the torso (jeans seams, cuffs, sneaker soles + laces, socks, apron skirt) */
const samAfter = (p, O, tcx, T, chin, torsoBot, HH, u) => {
  const opts = p._opts || {}, sole = 975, hipY = torsoBot - 0.12 * HH, cx = 300;
  for (const side of [-1, 1]) {
    const up = opts.hop === side ? 46 : Math.max(0, Math.sin(Math.PI * 2 * ((opts.step || 0) + (side > 0 ? 0.5 : 0)))) * (opts.run ? 52 : 30) * (opts.step ? 1 : 0);
    const hx = cx + side * 16 * u, fx = cx + side * 22 * u, fy = sole - 4 * u - up;
    if (O.jeans && !O.dress) { const mx = (hx + fx) / 2 + side * 2 * u, my = (hipY + fy) / 2; const g = p.g; g.save(); g.setLineDash([2.6 * u, 2 * u]);
      p.stroke(curve([hx + side * 1.5 * u, torsoBot + 0.04 * HH], [mx + side * 1.5 * u, my], [fx + side * 1.5 * u, fy - 0.1 * HH]), 1 * u, "#e8c070"); g.restore();
      p.stroke([[fx - 3.4 * u, fy - 0.07 * HH], [fx + 3.4 * u, fy - 0.07 * HH]], 1.6 * u, mul(O.pants, [1.25, 1.25, 1.25])); // cuff
      if (opts.sit) p.ell(hx + side * 1 * u, torsoBot + 0.08 * HH, 4.6 * u, 3.4 * u, mul(O.pants, [1.15, 1.15, 1.15]), 1.2 * u); }
    if (O.sneaker) { p.stroke([[fx - side * 3 * u, fy + 2.4 * u], [fx + side * 13 * u, fy + 2.9 * u]], 2.2 * u, "#ffffff"); for (let k = 0; k < 3; k++) p.stroke([[fx + side * (1 + k * 3) * u, fy - 2.5 * u], [fx + side * (2.5 + k * 3) * u, fy - 0.5 * u]], 0.9 * u, "#8a8a92"); }
    if (O.socks) { p.stroke([[fx - side * 2 * u, fy - 1 * u], [fx + side * 10 * u, fy - 1 * u]], 1.1 * u, "#c8c8cc"); }
  }
  if (O.apronW && O.dress) { const top = torsoBot - 0.24 * HH; const ap = [[tcx - 0.7 * T.a, top], [tcx + 0.7 * T.a, top], [tcx + 0.76 * T.a, top + 0.62 * HH], [tcx - 0.76 * T.a, top + 0.62 * HH]];
    p.poly(ap, "#fbfaf4", 1.8 * u); p.poly(rrect(tcx - 0.42 * T.a, top + 0.14 * HH, tcx + 0.42 * T.a, top + 0.34 * HH, 2 * u), "#fbfaf4", 1.2 * u);
    p.poly(rrect(tcx + 0.1 * T.a, top + 0.06 * HH, tcx + 0.3 * T.a, top + 0.2 * HH, 1 * u), "#f2e8a8", 1 * u); p.stroke([[tcx - 0.12 * T.a, top + 0.06 * HH], [tcx - 0.1 * T.a, top + 0.22 * HH]], 1.6 * u, "#3a6ad8"); }
};

/** head geometry (mirrors romanFront) for pre-layers */
const samGeo = (O, opts) => { const H = headBlob(opts.seed ?? 3, 118, opts.facing || 0), HH = 2 * H.b, legsL = (opts.sit ? 0.62 : 1.38) * (O.legK || 1), torsoL = (O.stout ? 1.12 : 1.08) * (O.torsoK || 1);
  const torsoBot = 975 - legsL * HH - (opts.bob || 0) * HH, chin = torsoBot - torsoL * HH, hc = chin - H.b; return { H, HH, chin, hc, torsoBot, u: 2 * H.a / 100 }; };
/** back layer: long hair, bun, pigtails behind the head */
const samBack = (p, O, opts) => { const G = samGeo(O, opts), { H, hc, chin, u } = G, cx = 300; const ah = (opts.tilt || 0) + (opts.headTilt || 0); p.rot = ah ? [rad(ah), cx, chin, 0, 0] : null;
  if (O.longHair) { const pts = [[cx - 1.06 * H.a, hc - 0.2 * H.b], [cx - 1.18 * H.a, hc + 0.9 * H.b], [cx - 1.0 * H.a, chin + 0.62 * G.HH], [cx - 0.3 * H.a, chin + 0.5 * G.HH], [cx + 0.3 * H.a, chin + 0.5 * G.HH], [cx + 1.0 * H.a, chin + 0.62 * G.HH], [cx + 1.18 * H.a, hc + 0.9 * H.b], [cx + 1.06 * H.a, hc - 0.2 * H.b]];
    p.poly(pts, O.longHair, 4.2 * u); for (let i = -4; i <= 4; i++) if (Math.abs(i) > 1) p.stroke([[cx + i * 0.25 * H.a, hc + 0.6 * H.b], [cx + i * 0.27 * H.a, chin + 0.5 * G.HH]], 1.2 * u, mul(O.longHair, [1.6, 1.6, 1.6])); }
  if (O.bun) { p.ell(cx + 0.1 * H.a, hc - 1.0 * H.b, 0.42 * H.a, 0.34 * H.b, O.bun, 4.2 * u); p.stroke(ellPts(cx + 0.1 * H.a, hc - 1.0 * H.b, 0.25 * H.a, 0.18 * H.b, 200, 330, 0, 10), 1.4 * u, mul(O.bun, [1.5, 1.5, 1.5])); }
  if (O.pig) for (const sd of [-1, 1]) { p.ell(cx + sd * 1.12 * H.a, hc + 0.1 * H.b, 0.26 * H.a, 0.42 * H.b, O.pig, 4 * u); p.ell(cx + sd * 0.98 * H.a, hc - 0.32 * H.b, 0.1 * H.a, 0.08 * H.b, "#e05a8a", 2 * u); }
  p.rot = null; };

/** props and late details (drawn after the face, in head-rotation space reset) */
const PROPS = {
  camcorder: (p, x, y, u, o) => { p.poly(rrect(x - 26 * u, y - 18 * u, x + 22 * u, y + 12 * u, 4 * u), "#3a3a42", 2.6 * u); p.poly(rrect(x - 12 * u, y - 26 * u, x + 6 * u, y - 18 * u, 2 * u), "#2a2a30", 1.6 * u);
    p.ell(x - 30 * u, y - 3 * u, 9 * u, 12 * u, "#2a2a30", 2.4 * u); p.ell(x - 31 * u, y - 3 * u, 5 * u, 7 * u, "#6a8ab8", 1.2 * u); p.dot(x - 33 * u, y - 6 * u, 1.6 * u, "#ffffff");
    p.dot(x + 14 * u, y - 10 * u, 3 * u, o.rec === false ? "#5a2020" : "#ff3a2a"); p.stroke([[x + 22 * u, y - 4 * u], [x + 30 * u, y + 6 * u]], 2 * u, "#2a2a30"); },
  phoneUp: (p, x, y, u, o) => { p.poly(rrect(x - 12 * u, y - 24 * u, x + 12 * u, y + 20 * u, 4 * u), "#2a2c34", 2.4 * u); p.ell(x - 5 * u, y - 15 * u, 4 * u, 4 * u, "#4a5a7a", 1.2 * u); p.dot(x + 5 * u, y - 16 * u, 2.2 * u, o.rec === false ? "#5a2020" : "#ff3a2a"); },
  phoneShow: (p, x, y, u, o) => { p.poly(rrect(x - 14 * u, y - 26 * u, x + 14 * u, y + 22 * u, 4 * u), "#2a2c34", 2.4 * u); p.poly(rrect(x - 11 * u, y - 22 * u, x + 11 * u, y + 18 * u, 2 * u), "#e8f0fa", 0);
    p.poly(rrect(x - 9 * u, y - 19 * u, x + 9 * u, y - 4 * u, 1 * u), "#6a8a5a", 0); p.dot(x, y - 11 * u, 3 * u, "#ffffff"); const g = p.g; g.save(); g.fillStyle = "#1b2a44"; g.textAlign = "center"; g.font = `900 ${7 * u}px Arial Black, Arial`; g.fillText(o.screen || "", x, y + 6 * u); g.restore(); },
  jar: (p, x, y, u, o) => { const k = o.jarK ?? 1; p.poly(rrect(x - 17 * u * k, y - 30 * u * k, x + 17 * u * k, y + 18 * u * k, 6 * u * k), "#cfe6dacc", 2.4 * u); const fill = o.jarFill ?? 0.1;
    if (fill > 0) p.poly(rrect(x - 14 * u * k, y + (15 - 40 * fill) * u * k, x + 14 * u * k, y + 15 * u * k, 4 * u * k), "#8ab868", 1 * u); for (let i = 0; i < Math.round(fill * 8); i++) p.poly(rrect(x - 12 * u * k + (i % 3) * 7 * u * k, y + (10 - i * 4) * u * k, x - 3 * u * k + (i % 3) * 7 * u * k, y + (13 - i * 4) * u * k, 1 * u), "#a8d090", 0.8 * u);
    p.poly(rrect(x - 15 * u * k, y - 38 * u * k, x + 15 * u * k, y - 29 * u * k, 2 * u), "#d8a83a", 2 * u); p.stroke([[x - 9 * u * k, y - 18 * u * k], [x - 9 * u * k, y + 4 * u * k]], 2 * u, "#ffffff90");
    if (o.lid) { const g = p.g; g.save(); g.fillStyle = "#3a2a1a"; g.textAlign = "center"; g.font = `900 ${5.4 * u * k}px Arial Black, Arial`; g.fillText(o.lid, x, y - 31.5 * u * k); g.restore(); } },
  wrench: (p, x, y, u) => { p.band([[x - 4 * u, y + 26 * u], [x + 4 * u, y - 20 * u]], "#b8c0c8", 4.6 * u, 1.6 * u); p.ell(x + 5 * u, y - 24 * u, 8 * u, 7 * u, "#b8c0c8", 1.8 * u); p.ell(x + 7 * u, y - 29 * u, 4 * u, 3.6 * u, "#3a3a42", 0); },
  knife: (p, x, y, u) => { p.band([[x, y + 8 * u], [x + 2 * u, y - 6 * u]], "#e8d8b8", 3.4 * u, 1.2 * u); p.band([[x + 2 * u, y - 6 * u], [x + 5 * u, y - 30 * u]], "#d8dde2", 3.2 * u, 1.2 * u); },
  envelope: (p, x, y, u, o) => { p.poly(rrect(x - 26 * u, y - 18 * u, x + 26 * u, y + 16 * u, 2 * u), o.old ? "#e8dcc0" : "#f6f2e6", 2.2 * u); p.stroke([[x - 26 * u, y - 18 * u], [x, y], [x + 26 * u, y - 18 * u]], 1.6 * u);
    p.poly(rrect(x - 26 * u, y + 8 * u, x + 26 * u, y + 12 * u, 0), "#2a4a8a", 0); if (o.open) p.poly(rrect(x - 20 * u, y - 34 * u, x + 20 * u, y - 14 * u, 1 * u), "#fbf8f0", 1.4 * u); },
  letter: (p, x, y, u) => { p.poly(rrect(x - 18 * u, y - 26 * u, x + 18 * u, y + 20 * u, 1 * u), "#fbf8f0", 2 * u); for (let k = 0; k < 6; k++) p.stroke([[x - 12 * u, y - 18 * u + k * 6 * u], [x + (k % 2 ? 6 : 12) * u, y - 18 * u + k * 6 * u]], 1.2 * u, "#8a96a8"); },
  paper: (p, x, y, u) => { p.poly(rrect(x - 20 * u, y - 30 * u, x + 20 * u, y + 22 * u, 1 * u), "#fbf8f0", 2 * u); p.poly(rrect(x - 14 * u, y - 24 * u, x + 14 * u, y - 18 * u, 1 * u), "#c8322e", 0); for (let k = 0; k < 6; k++) p.stroke([[x - 14 * u, y - 10 * u + k * 5 * u], [x + (k % 2 ? 8 : 14) * u, y - 10 * u + k * 5 * u]], 1 * u, "#8a96a8"); },
  notebook: (p, x, y, u) => { p.poly(rrect(x - 22 * u, y - 16 * u, x + 22 * u, y + 14 * u, 2 * u), "#fbf8f0", 2 * u); p.stroke([[x, y - 16 * u], [x, y + 14 * u]], 1.6 * u); for (let k = 0; k < 4; k++) for (const sd of [-1, 1]) p.stroke([[x + sd * 4 * u, y - 9 * u + k * 6 * u], [x + sd * 18 * u, y - 9 * u + k * 6 * u]], 1 * u, "#6a7aa8"); p.band([[x + 16 * u, y - 22 * u], [x + 26 * u, y - 6 * u]], "#3a6ad8", 2.2 * u, 0.8 * u); },
  tips: (p, x, y, u) => { for (let k = 0; k < 4; k++) { const a = (k - 1.5) * 0.25; const g = p.g; g.save(); g.translate(x, y); g.rotate(a); p.poly(rrect(-20 * u, -40 * u, 0, 0, 1.5 * u), "#9ac07a", 1.6 * u); p.ell(-10 * u, -20 * u, 4 * u, 6 * u, "#7aa05a", 0.8 * u); g.restore(); } },
  dollar: (p, x, y, u) => { p.poly(rrect(x - 18 * u, y - 9 * u, x + 18 * u, y + 9 * u, 1.5 * u), "#9ac07a", 1.6 * u); p.ell(x, y, 5 * u, 6 * u, "#7aa05a", 0.8 * u); },
  box: (p, x, y, u) => { p.poly(rrect(x - 44 * u, y - 34 * u, x + 44 * u, y + 30 * u, 2 * u), "#c8945a", 2.6 * u); p.stroke([[x - 44 * u, y - 18 * u], [x + 44 * u, y - 18 * u]], 1.6 * u, "#8a6038"); p.poly(rrect(x - 8 * u, y - 34 * u, x + 8 * u, y - 18 * u, 0), "#d8c8a0", 1 * u); },
  sign: (p, x, y, u) => { p.poly([[x - 70 * u, y - 46 * u], [x + 72 * u, y - 42 * u], [x + 68 * u, y + 30 * u], [x - 66 * u, y + 34 * u]], "#c8945a", 2.6 * u); const g = p.g; g.save(); g.fillStyle = "#1a1a22"; g.textAlign = "center"; g.font = `900 ${17 * u}px Arial Black, Arial`; g.fillText("BRING IT", x, y - 12 * u); g.fillStyle = "#c8322e"; g.fillText("BROKEN", x, y + 16 * u); g.restore(); },
  brush: (p, x, y, u) => { p.band([[x, y + 10 * u], [x + 4 * u, y - 16 * u]], "#c8a060", 3 * u, 1 * u); p.poly(rrect(x + 1 * u, y - 26 * u, x + 9 * u, y - 15 * u, 1 * u), "#c8322e", 1.2 * u); },
  truck: (p, x, y, u) => { p.poly(rrect(x - 24 * u, y - 12 * u, x + 8 * u, y + 6 * u, 2 * u), "#e8b02a", 2 * u); p.poly(rrect(x + 8 * u, y - 18 * u, x + 22 * u, y + 6 * u, 2 * u), "#d8443c", 2 * u); p.poly(rrect(x + 12 * u, y - 14 * u, x + 19 * u, y - 7 * u, 1 * u), "#bfe0f0", 1 * u); for (const dx of [-16, 14]) p.ell(x + dx * u, y + 8 * u, 6 * u, 6 * u, "#2a2a30", 1.6 * u); },
  blower: (p, x, y, u) => { p.poly(rrect(x - 22 * u, y - 16 * u, x + 16 * u, y + 18 * u, 6 * u), "#e8742a", 2.4 * u); p.band([[x - 18 * u, y + 10 * u], [x - 64 * u, y + 40 * u]], "#3a3a42", 7 * u, 1.6 * u); p.ell(x - 2 * u, y + 2 * u, 8 * u, 8 * u, "#2a2a30", 1.4 * u); },
  cord: (p, x, y, u, o) => { p.poly(rrect(x - 10 * u, y - 4 * u, x + 10 * u, y + 4 * u, 3 * u), "#2a2a30", 1.6 * u); p.stroke([[x, y + 2 * u], [x - (o.cordX ?? 30) * u, y + (o.cordY ?? 60) * u]], 1.6 * u, "#e8e0c8"); },
  apron: (p, x, y, u) => { p.poly([[x - 22 * u, y - 10 * u], [x + 22 * u, y - 10 * u], [x + 26 * u, y + 46 * u], [x - 26 * u, y + 46 * u]], "#fbfaf4", 2 * u); p.stroke([[x - 20 * u, y - 10 * u], [x - 6 * u, y - 30 * u], [x + 6 * u, y - 30 * u], [x + 20 * u, y - 10 * u]], 2 * u, "#fbfaf4"); },
  marker: (p, x, y, u) => { p.band([[x, y + 8 * u], [x + 3 * u, y - 18 * u]], "#1a1a22", 4 * u, 1.2 * u); p.dot(x + 3.4 * u, y - 20 * u, 2 * u, "#1a1a22"); },
  mug: (p, x, y, u) => { p.poly(rrect(x - 11 * u, y - 14 * u, x + 11 * u, y + 12 * u, 3 * u), "#f2efe6", 2 * u); p.arc(x + 12 * u, y - 1 * u, 6 * u, 7 * u, -80, 80, 2.4 * u); p.ell(x, y - 14 * u, 11 * u, 3 * u, "#5a3420", 1.4 * u); },
  tag: (p, x, y, u) => { p.poly([[x - 12 * u, y - 8 * u], [x + 12 * u, y - 8 * u], [x + 12 * u, y + 8 * u], [x - 12 * u, y + 8 * u], [x - 16 * u, y]], "#fbf6e0", 1.6 * u); const g = p.g; g.save(); g.fillStyle = "#c8322e"; g.textAlign = "center"; g.font = `900 ${6 * u}px Arial Black, Arial`; g.fillText("SAM", x, y + 2 * u); g.restore(); },
};
const samLate = (p, prop, arms, u, opts, cx, hc, H) => {
  if (opts.tears) { const g = p.g; g.save(); g.globalAlpha = 0.85; for (const sd of [-1, 1]) { p.ell(cx + sd * 15 * u, hc + 12 * u + (opts.tears % 1) * 10 * u, 3 * u, 5 * u, "#9fd4ff", 1 * u); p.stroke([[cx + sd * 14 * u, hc + 6 * u], [cx + sd * 15 * u, hc + 16 * u]], 2 * u, "#bfe4ff"); } g.restore(); }
  if (opts.sweat) p.ell(cx + 1.05 * H.a, hc - 0.45 * H.b, 5 * u, 7.5 * u, "#bfe4ff", 1.6 * u);
  const O = p._O || {}; if (O.tufts) for (const sd of [-1, 1]) p.ell(cx + sd * 0.96 * H.a, hc - 0.05 * H.b, 0.16 * H.a, 0.24 * H.b, O.tufts, 2.2 * u);
  if (O.copCap) { p.poly([[cx - 7 * u, hc - 1.02 * H.b], [cx + 7 * u, hc - 1.02 * H.b], [cx + 5 * u, hc - 0.82 * H.b], [cx - 5 * u, hc - 0.82 * H.b]], "#e8c45a", 1.4 * u); }
  if (!prop) return; const fn = PROPS[prop]; if (!fn) return;
  const hand = opts.propHand === "L" ? arms[0].pts[2] : arms[1].pts[2];
  const [x, y] = opts.propAt ? [cx + opts.propAt[0] * u, hc + opts.propAt[1] * u] : [hand[0] + (opts.propDX || 0) * u, hand[1] + (opts.propDY || 0) * u];
  fn(p, x, y, u, opts);
};

/** wrapper: back layer + romanFront (patched) */
export const samFront = (p, key, opts = {}) => { const O = typeof key === "string" ? OUTFITS[key] : key; p._opts = opts; p._O = O; samBack(p, O, opts); romanFront(p, O, opts); p._opts = null; p._O = null; };
/** a swaddled newborn (own card, ~0.5 m) */
export const babyCard = (p, o = {}) => { const g = p.g; const cx = 300, cy = 760;
  p.ell(cx, cy + 40, 150, 200, "#f2d8e0", 12); p.stroke([[cx - 120, cy - 20], [cx + 110, cy + 60]], 8, "#e6c2ce"); p.stroke([[cx - 110, cy + 90], [cx + 120, cy + 150]], 8, "#e6c2ce");
  p.ell(cx, cy - 120, 120, 110, "#f6d2b0", 12); p.ell(cx, cy - 190, 125, 70, "#f2d8e0", 12, 180, 360); p.stroke([[cx - 20, cy - 178], [cx + 4, cy - 208], [cx + 26, cy - 182]], 7, "#7a5234");
  const sl = o.sleep ?? 1; if (sl) for (const sd of [-1, 1]) p.arc(cx + sd * 38, cy - 116, 18, 10, 20, 160, 8); else for (const sd of [-1, 1]) p.dot(cx + sd * 38, cy - 116, 12);
  p.ell(cx, cy - 72, o.cry ? 18 : 12, o.cry ? 16 : 6, "#c05a6a", 6); g.save(); g.globalAlpha = 0.35; for (const sd of [-1, 1]) p.ell(cx + sd * 66, cy - 84, 22, 12, "#e8707a", 0); g.restore(); };
/** "SUBSCRIBE" cardboard sign + bell (hand-drawn, no logos), held up by Sam in the ending */
export const subSign = (p, t = 1) => { const g = p.g; g.save(); g.translate(300, 600); const k = M_back(t, 1.6); g.scale(k, k); g.translate(-300, -600);
  p.poly([[60, 470], [545, 455], [552, 730], [52, 742]], "#c8945a", 12); p.poly([[80, 490], [525, 478], [530, 712], [74, 722]], "#d4a46a", 0);
  g.fillStyle = "#c8322e"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "900 66px Arial Black, Arial"; g.fillText("SUBSCRIBE", 300, 562);
  g.fillStyle = "#1a1a22"; g.font = "900 46px Arial Black, Arial"; g.fillText("PART 2 SOON", 300, 650);
  const bx = 470, by = 380; p.poly([[bx - 46, by + 40], [bx - 36, by - 20], [bx, by - 52], [bx + 36, by - 20], [bx + 46, by + 40]], "#f2c23a", 10); p.ell(bx, by + 52, 14, 12, "#f2c23a", 8);
  for (const sd of [-1, 1]) p.arc(bx + sd * 64, by - 10, 18, 30, sd > 0 ? -40 : 140, sd > 0 ? 40 : 220, 8); g.restore(); };

// talking variants: same face, open mouth (toggled while the character's voice line plays)
for (const k of Object.keys(FACE)) if (!k.endsWith('_t')) FACE[k + '_t'] = { ...FACE[k], mouth: FACE[k].mouth === 'o' ? 'smile' : 'o' };
Object.assign(PROPS, {
  keys: (p, x, y, u) => { p.ell(x, y, 7 * u, 7 * u, null, 2 * u); p.band([[x + 4 * u, y + 4 * u], [x + 14 * u, y + 22 * u]], '#d8b040', 3.4 * u, 1 * u); p.band([[x - 3 * u, y + 6 * u], [x - 8 * u, y + 24 * u]], '#c8ccd0', 3.4 * u, 1 * u); },
  toast: (p, x, y, u) => { p.poly(rrect(x - 16 * u, y - 18 * u, x + 16 * u, y + 16 * u, 8 * u), '#e8c890', 2 * u); p.poly(rrect(x - 12 * u, y - 13 * u, x + 12 * u, y + 12 * u, 6 * u), '#f6ead0', 0); },
  flea: (p, x, y, u) => { p.stroke([[x, y - 20 * u], [x, y - 8 * u]], 1 * u, '#8a8a92'); p.poly(rrect(x - 18 * u, y - 8 * u, x + 18 * u, y + 14 * u, 2 * u), '#fbf6e0', 1.6 * u); const g = p.g; g.save(); g.fillStyle = '#c8322e'; g.textAlign = 'center'; g.font = `900 ${12 * u}px Arial Black, Arial`; g.fillText('$40', x, y + 9 * u); g.restore(); },
  subsign: (p, x, y, u, o) => { const g = p.g; g.save(); g.translate(x - 300 * 0.32, y - 600 * 0.32); g.scale(0.32, 0.32); subSign(p, o.signT ?? 1); g.restore(); },
});
/** big repair tag for the stolen-mower insert (own card) */
export const tagCard = (p) => { const g = p.g; p.stroke([[300, 330], [300, 420]], 10, '#1a1a22'); p.poly([[170, 420], [440, 420], [440, 700], [170, 700], [120, 560]], '#fbf6e0', 14); p.ell(165, 560, 18, 18, '#c8c4b8', 8);
  g.save(); g.textAlign = 'center'; g.fillStyle = '#1b2a44'; g.font = '900 58px Arial Black, Arial'; g.fillText('FIXED BY', 300, 520); g.fillStyle = '#c8322e'; g.font = '900 92px Comic Sans MS, Arial Black'; g.fillText('SAM', 300, 620); g.fillStyle = '#2f8a4a'; g.font = '900 54px Arial'; g.fillText('\u2713 DAY 31', 300, 680); g.restore(); };
/** a lit bulb idea */
export const ideaCard = (p, t = 1) => { const g = p.g; g.save(); g.translate(300, 500); const k = M_back(Math.min(1, t * 2), 1.6); g.scale(k, k); g.translate(-300, -500); g.globalAlpha = 0.5; p.ell(300, 470, 210, 210, '#fff3b0', 0); g.globalAlpha = 1;
  p.ell(300, 460, 120, 130, '#ffe36a', 12); p.poly(rrect(250, 570, 350, 650, 10), '#b8bec6', 10); for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; p.stroke([[300 + Math.cos(a) * 160, 460 + Math.sin(a) * 170], [300 + Math.cos(a) * 210, 460 + Math.sin(a) * 220]], 14, '#ffd23a'); } g.restore(); };
/** big hand-painted number / word that auto-fits the card width (pops in with t) */
export const fxBig = (p, s = "$43", t = 1, col = "#f2c23a") => { const k = M_back(Math.min(1, t), 1.7), g = p.g; g.save(); g.translate(300, 500); g.scale(k, k); g.translate(-300, -500);
  g.textAlign = "center"; g.textBaseline = "middle"; let fs = 300; g.font = `900 ${fs}px Arial Black, Arial`; while (g.measureText(s).width > 540 && fs > 40) { fs *= 0.92; g.font = `900 ${fs}px Arial Black, Arial`; }
  g.lineJoin = "round"; g.lineWidth = fs * 0.12; g.strokeStyle = INK; g.strokeText(s, 300, 500); g.fillStyle = col; g.fillText(s, 300, 500); g.save(); g.beginPath(); g.rect(0, 500 - fs * 0.45, 600, fs * 0.2); g.clip(); g.fillStyle = "#ffffff70"; g.fillText(s, 300, 500); g.restore(); g.restore(); };
/** cartoon potato (Mia's review) */
export const potatoCard = (p, t = 1) => { const g = p.g; g.save(); g.translate(300, 500); const k = M_back(Math.min(1, t), 1.7); g.scale(k, k); g.translate(-300, -500); p.ell(300, 500, 200, 140, "#c8945a", 14, 0, 360, -12); for (const [x, y] of [[220, 450], [360, 430], [300, 560], [400, 540]]) p.ell(x, y, 12, 8, "#8a6038", 0); p.dot(250, 490, 12); p.dot(330, 480, 12); p.arc(292, 520, 30, 14, 20, 160, 8); g.restore(); };
