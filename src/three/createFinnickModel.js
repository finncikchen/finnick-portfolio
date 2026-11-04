import * as THREE from 'three'

// Finnick at the desk, built in code from the illustration. One unit is 100px of the source art,
// y=0 is the desk plane, +z faces the viewer. Only the front is measured; the back is inferred.
export const mat = (color, roughness = 0.8, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, ...extra })
const M = {
  skin: mat('#ffd0be', 0.7), blush: mat('#fbb9a8', 0.8), nose: mat('#f6b6a2', 0.6), cotton: Object.assign(mat('#eef0f8', 0.92), { emissive: new THREE.Color('#505264') }), rib: mat('#c8c9d8', 0.95),
  cap: mat('#4a48dc', 0.55), dark: mat('#10152e', 0.5), laptop: mat('#e4e6ec', 0.42, { metalness: 0.1, emissive: '#d8dbe4', emissiveIntensity: 0.48 }), logo: mat('#b4b7c0', 0.3, { emissive: '#8d909a', emissiveIntensity: 0.5 }),
  mug: mat('#f4bb2a', 0.55, { emissive: '#f4bb2a', emissiveIntensity: 0.24 }), mugLight: mat('#fff0b8', 0.4),
}
export const mesh = (name, geo, material, parent, p = [0, 0, 0], s = [1, 1, 1], r = [0, 0, 0]) => {
  const m = new THREE.Mesh(geo, material)
  m.name = name; m.position.set(...p); m.scale.set(...s); m.rotation.set(...r); m.castShadow = m.receiveShadow = true
  parent.add(m)
  return m
}
const sphere = (n = 48) => new THREE.SphereGeometry(1, n, Math.round(n * 0.75))
const tube = (pts, r, closed = false) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), 40, r, 12, closed)

// a sphere that narrows towards the chin, so the face is one continuous surface
function skullGeometry() {
  const g = new THREE.SphereGeometry(1, 72, 54), p = g.attributes.position
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i), k = y < 0 ? 1 - 0.3 * y * y : 1
    p.setXYZ(i, p.getX(i) * k, y, p.getZ(i) * k)
  }
  g.computeVertexNormals()
  return g
}

function buildHead() {
  const head = new THREE.Group(); head.name = 'head'; head.position.set(0, 2.94, 0.25)
  mesh('skull', skullGeometry(), M.skin, head, [0, 0, 0], [0.48, 0.65, 0.47])
  for (const s of [-1, 1]) {
    const side = s < 0 ? 'r' : 'l'
    mesh(`ear-${side}`, sphere(24), M.skin, head, [s * 0.5, -0.04, -0.02], [0.085, 0.13, 0.06])
    mesh(`eye-${side}`, sphere(24), M.dark, head, [s * 0.165, -0.02, 0.44], [0.034, 0.05, 0.016])
    mesh(`brow-${side}`, tube([[s * 0.27, 0.12, 0.38], [s * 0.17, 0.165, 0.43], [s * 0.07, 0.135, 0.46]], 0.012), M.dark, head)
    mesh(`blush-${side}`, sphere(24), M.blush, head, [s * 0.25, -0.18, 0.345], [0.1, 0.085, 0.035])
  }
  mesh('nose', sphere(32), M.nose, head, [0, -0.1, 0.46], [0.042, 0.05, 0.045])
  mesh('smile', tube([[-0.075, -0.3, 0.39], [0, -0.335, 0.405], [0.075, -0.3, 0.39]], 0.011), M.dark, head)
  // backwards cap: crown tipped back, the arched opening and strap on the forehead, tuft through it
  const crown = new THREE.SphereGeometry(1, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.5)
  mesh('cap-crown', crown, M.cap, head, [0, 0.16, -0.03], [0.52, 0.56, 0.53], [-0.36, 0, 0])
  mesh('cap-opening', sphere(32), M.dark, head, [0.02, 0.52, 0.34], [0.15, 0.1, 0.05], [-0.6, 0, 0])
  mesh('cap-strap', tube([[-0.44, 0.27, 0.18], [-0.22, 0.38, 0.38], [0, 0.42, 0.42], [0.22, 0.38, 0.38], [0.44, 0.27, 0.18]], 0.026), M.cap, head)
  mesh('cap-buckle', new THREE.BoxGeometry(0.1, 0.055, 0.03), M.rib, head, [0.07, 0.425, 0.43])
  mesh('cap-brim', sphere(32), M.cap, head, [0.3, -0.14, -0.36], [0.2, 0.24, 0.06], [0.2, 0.5, 0])
  const tuft = new THREE.Shape()
  tuft.moveTo(-0.12, 0); tuft.bezierCurveTo(-0.2, 0.14, -0.1, 0.32, 0.04, 0.38); tuft.bezierCurveTo(-0.02, 0.26, 0.04, 0.18, 0.16, 0.12); tuft.quadraticCurveTo(0.2, 0.04, 0.12, -0.02); tuft.quadraticCurveTo(0, 0.03, -0.12, 0)
  mesh('hair-tuft', new THREE.ExtrudeGeometry(tuft, { depth: 0.08, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 4 }), M.dark, head, [0, 0.52, 0.3], [0.72, 0.72, 0.72], [-0.45, 0, 0])
  head.traverse((o) => { if (o.isMesh) o.receiveShadow = false })
  return head
}

function buildTorso() {
  const torso = new THREE.Group(); torso.name = 'torso'
  torso.add(buildTee())
  mesh('neck', new THREE.CylinderGeometry(0.27, 0.34, 0.65, 32), M.skin, torso, [0, 2.4, 0.15])
  mesh('collar', tube([[0, 2.13, 0.47], [0.2, 2.15, 0.44], [0.37, 2.23, 0.29], [0.47, 2.31, 0.11], [0.42, 2.4, -0.1], [0, 2.44, -0.22], [-0.42, 2.4, -0.1], [-0.47, 2.31, 0.11], [-0.37, 2.23, 0.29], [-0.2, 2.15, 0.44]], 0.06, true), M.rib, torso)
  return torso
}

const DOWN = new THREE.Vector3(0, -1, 0)
const SHOULDER_R = new THREE.Vector3(-1.18, 1.62, -0.05), SHOULDER_L = new THREE.Vector3(1.18, 1.62, -0.05)
const UPPER = 1.35, FORE = 1.25

// a limb of true length hanging from y=0 to y=-len, never stretched, so its roundness survives every pose
function taper(r0, r1, len, flat = false) {
  const pts = []
  if (flat) pts.push(new THREE.Vector2(0.001, -len))
  else for (let i = 0; i < 10; i++) { const t = (-0.5 + i / 20) * Math.PI; pts.push(new THREE.Vector2(Math.max(0.001, Math.cos(t) * r1), -len + Math.sin(t) * r1)) }
  pts.push(new THREE.Vector2(r1, -len))
  for (let i = 0; i <= 12; i++) { const t = (i / 12) * Math.PI * 0.5; pts.push(new THREE.Vector2(Math.max(0.001, Math.cos(t) * r0), Math.sin(t) * r0)) }
  return new THREE.LatheGeometry(pts, 40)
}
const aimDown = (o, from, to) => { o.position.copy(from); o.quaternion.setFromUnitVectors(DOWN, to.clone().sub(from).normalize()) }
const capsule = (name, a, b, r, parent) => {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), m = mesh(name, new THREE.CapsuleGeometry(r, A.distanceTo(B), 8, 20), M.skin, parent)
  m.position.copy(A).add(B).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize())
  return m
}

// the torso is the illustration's rounded silhouette inflated over a polar grid, so there is no flat
// front or bevel edge: the cloth is one continuous curve from chest to rim, and its shoulder line meets the sleeve's ball on a tangent
const SHOULDER_CUT = 1.21
function buildTee() {
  const outline = new THREE.Shape()
  outline.moveTo(1.05, -0.3); outline.lineTo(1.32, 0.6)
  outline.bezierCurveTo(1.34, 1.0, 1.62, 1.3, 1.625, 1.97); outline.bezierCurveTo(1.19, 2.22, 0.7, 2.42, 0, 2.42)
  outline.bezierCurveTo(-0.7, 2.42, -1.19, 2.22, -1.625, 1.97); outline.bezierCurveTo(-1.62, 1.3, -1.34, 1.0, -1.32, 0.6)
  outline.lineTo(-1.05, -0.3); outline.closePath()
  const poly = outline.getPoints(40).map((p) => p.setX(p.x * 0.84)), cy = 1
  const reach = (dx, dy) => {
    let best = 0
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i], q = poly[(i + 1) % poly.length], ex = q.x - p.x, ey = q.y - p.y, den = dx * ey - dy * ex
      if (Math.abs(den) < 1e-9) continue
      const t = (p.x * ey - (p.y - cy) * ex) / den, u = (p.x * dy - (p.y - cy) * dx) / den
      if (t > 0 && u >= 0 && u <= 1) best = Math.max(best, t)
    }
    return best
  }
  const A = 240, N = 30, DEPTH = 0.66, pos = [], idx = []
  const radii = Array.from({ length: A }, (_, i) => reach(Math.cos((i / A) * Math.PI * 2), Math.sin((i / A) * Math.PI * 2)))
  for (let i = 0; i < A; i++) {
    const th = (i / A) * Math.PI * 2, R = Array.from({ length: 9 }, (_, n) => radii[(i + n - 4 + A) % A]).reduce((a, b) => a + b) / 9 // rounds away the outline's corners
    for (let j = 0; j <= N * 2; j++) {
      const k = Math.sqrt(1 - Math.abs(j / N - 1)), side = j <= N ? 1 : -1
      pos.push(Math.cos(th) * R * k, cy + Math.sin(th) * R * k, side * DEPTH * Math.sqrt(Math.max(0, 1 - Math.pow(k, 3.2))) - 0.1)
    }
  }
  const row = N * 2 + 1
  for (let i = 0; i < A; i++) for (let j = 0; j < N * 2; j++) {
    const a = i * row + j, b = ((i + 1) % A) * row + j
    idx.push(a, a + 1, b, b, a + 1, b + 1)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals()
  // the shoulder caps go: each sleeve grows out of the edge left behind, so tee and sleeve are one piece of cloth
  g.setIndex(idx.filter((_, t) => t % 3 === 0).flatMap((_, t) => {
    const tri = [idx[t * 3], idx[t * 3 + 1], idx[t * 3 + 2]]
    return tri.every((v) => Math.abs(pos[v * 3]) < SHOULDER_CUT + 0.03) ? tri : []
  }))
  const tee = new THREE.Mesh(g, M.cotton); tee.name = 'tee'; tee.castShadow = true; tee.receiveShadow = false
  return tee
}

function buildArm(side, S) {
  const arm = new THREE.Group(); arm.name = `arm-${side}`
  const upper = new THREE.Group(), fore = new THREE.Group(), hand = new THREE.Group(); arm.add(upper, fore, hand)
  mesh(`upper-arm-${side}`, taper(0.33, 0.3, UPPER), M.skin, upper).receiveShadow = false
  mesh(`forearm-${side}`, taper(0.3, 0.22, FORE), M.skin, fore).receiveShadow = false
  // the sleeve is rigid and starts as a ball buried in the shoulder, so raising the arm can never tear it
  mesh(`sleeve-${side}`, taper(0.45, 0.43, 0.9, true), M.cotton, upper).receiveShadow = false
  // the shadowed inside of the sleeve, so its open end reads as cloth rather than glass
  mesh(`sleeve-inside-${side}`, new THREE.CircleGeometry(0.365, 40), new THREE.MeshBasicMaterial({ color: '#a7a9c2', side: THREE.DoubleSide }), upper, [0, -0.785, 0], [1, 1, 1], [Math.PI / 2, 0, 0])
  mesh(`sleeve-hem-${side}`, new THREE.TorusGeometry(0.368, 0.016, 12, 48), M.cotton, upper, [0, -0.78, 0], [1, 1, 1], [Math.PI / 2, 0, 0])
  aimDown(upper, S, S.clone().add(DOWN))
  return { arm, upper, fore, hand }
}

// one skin for a whole hand: tapered capsules [ax, ay, az, ar, bx, by, bz, br] melted together with a smooth
// union and meshed by surface nets, so fingers grow out of the palm and the palm out of the wrist with no seam.
// The wrist ball at the origin has the forearm's end radius, so the arm runs into it on a tangent too.
function sculpt(name, palm, digits, parent, back) {
  const prims = [...palm, ...digits], SOFT = 0.12, K = 0.03, CELL = 0.015, PAD = 0.2
  const lo = [0, 1, 2].map((i) => Math.min(...prims.flatMap((p) => [p[i], p[i + 4]])) - PAD)
  const hi = [0, 1, 2].map((i) => Math.max(...prims.flatMap((p) => [p[i], p[i + 4]])) + PAD)
  const n = lo.map((l, i) => Math.ceil((hi[i] - l) / CELL) + 1)
  const field = (x, y, z) => {
    let d = Infinity
    for (let e = 0; e < prims.length; e++) {
      const [ax, ay, az, ar, bx, by, bz, br] = prims[e], k = e < palm.length ? SOFT : K
      const ux = bx - ax, uy = by - ay, uz = bz - az, px = x - ax, py = y - ay, pz = z - az
      const t = Math.min(1, Math.max(0, (px * ux + py * uy + pz * uz) / (ux * ux + uy * uy + uz * uz || 1)))
      const c = Math.hypot(px - ux * t, py - uy * t, pz - uz * t) - (ar + (br - ar) * t)
      const h = Math.min(1, Math.max(0, 0.5 + (0.5 * (c - d)) / k))
      d = d === Infinity ? c : c + (d - c) * h - k * h * (1 - h)
    }
    return d
  }
  const at = (i, j, k) => i + n[0] * (j + n[1] * k), vals = new Float32Array(n[0] * n[1] * n[2])
  for (let k = 0; k < n[2]; k++) for (let j = 0; j < n[1]; j++) for (let i = 0; i < n[0]; i++) vals[at(i, j, k)] = field(lo[0] + i * CELL, lo[1] + j * CELL, lo[2] + k * CELL)
  const pos = [], nor = [], idx = [], ids = new Map()
  const vert = (i, j, k) => {
    const key = at(i, j, k)
    if (ids.has(key)) return ids.get(key)
    let sx = 0, sy = 0, sz = 0, m = 0
    for (let c = 0; c < 8; c++) for (const axis of [0, 1, 2]) {
      if (c >> axis & 1) continue
      const a = [c & 1, c >> 1 & 1, c >> 2 & 1], b = [...a]; b[axis] = 1
      const va = vals[at(i + a[0], j + a[1], k + a[2])], vb = vals[at(i + b[0], j + b[1], k + b[2])]
      if (va < 0 === vb < 0) continue
      const t = va / (va - vb)
      sx += a[0] + (b[0] - a[0]) * t; sy += a[1] + (b[1] - a[1]) * t; sz += a[2] + (b[2] - a[2]) * t; m++
    }
    const x = lo[0] + (i + sx / m) * CELL, y = lo[1] + (j + sy / m) * CELL, z = lo[2] + (k + sz / m) * CELL, e = 0.006
    pos.push(x, y, z)
    const g = new THREE.Vector3(field(x + e, y, z) - field(x - e, y, z), field(x, y + e, z) - field(x, y - e, z), field(x, y, z + e) - field(x, y, z - e)).normalize()
    nor.push(g.x, g.y, g.z)
    ids.set(key, pos.length / 3 - 1)
    return pos.length / 3 - 1
  }
  const quad = (a, b, c, d, flip) => (flip ? idx.push(a, c, b, a, d, c) : idx.push(a, b, c, a, c, d))
  for (let k = 1; k < n[2] - 1; k++) for (let j = 1; j < n[1] - 1; j++) for (let i = 1; i < n[0] - 1; i++) {
    const v = vals[at(i, j, k)] < 0
    if (v !== vals[at(i + 1, j, k)] < 0) quad(vert(i, j - 1, k - 1), vert(i, j, k - 1), vert(i, j, k), vert(i, j - 1, k), !v)
    if (v !== vals[at(i, j + 1, k)] < 0) quad(vert(i - 1, j, k - 1), vert(i - 1, j, k), vert(i, j, k), vert(i, j, k - 1), !v)
    if (v !== vals[at(i, j, k + 1)] < 0) quad(vert(i - 1, j - 1, k), vert(i, j - 1, k), vert(i, j, k), vert(i - 1, j, k), !v)
  }
  // how wide the melted surface really is where the arm meets it, found by walking out from the stub's axis
  const side = new THREE.Vector3(0, 0, 1).cross(back).normalize()
  let inR = 0, outR = 0.4
  for (let i = 0; i < 24; i++) {
    const m = (inR + outR) / 2
    if (field(back.x * MEET + side.x * m, back.y * MEET + side.y * m, back.z * MEET + side.z * m) < 0) inR = m; else outR = m
  }
  // cut the stub off at the meeting plane and snap the cut edge to a true circle: the arm's last ring lands on the very same
  // points with the same facing, so the two are welded edge to edge and nothing overlaps
  const P = new THREE.Vector3(), rad = new THREE.Vector3(), depth = (i) => pos[i * 3] * back.x + pos[i * 3 + 1] * back.y + pos[i * 3 + 2] * back.z
  const kept = []
  for (let t = 0; t < idx.length; t += 3) if (depth(idx[t]) < MEET && depth(idx[t + 1]) < MEET && depth(idx[t + 2]) < MEET + CELL) kept.push(idx[t], idx[t + 1], idx[t + 2])
  for (let i = 0; i < pos.length / 3; i++) {
    if (depth(i) < MEET - CELL * 2) continue
    P.fromArray(pos, i * 3); rad.copy(P).addScaledVector(back, -depth(i)).normalize()
    P.copy(back).multiplyScalar(MEET).addScaledVector(rad, inR)
    pos[i * 3] = P.x; pos[i * 3 + 1] = P.y; pos[i * 3 + 2] = P.z; nor[i * 3] = rad.x; nor[i * 3 + 1] = rad.y; nor[i * 3 + 2] = rad.z
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setIndex(kept)
  const hand = mesh(name, g, M.skin, parent); hand.receiveShadow = false
  return inR
}
// each hand is sculpted with a short piece of forearm running back along its own axis; the arm tube is welded
// to that piece's cut edge, same width and same heading, so arm and hand are one continuous surface
const STUB = 0.34, MEET = 0.24, STUB_R = 0.112, GRIP_BACK = new THREE.Vector3(-1, 0, -1).normalize(), OPEN_BACK = new THREE.Vector3(0, -1, 0)
const stub = (b) => [b.x * STUB, b.y * STUB, b.z * STUB, STUB_R - 0.022, 0, 0, 0, STUB_R]
// a finger as three tapering bones, slimmer at each joint and bending a little more at each one
function finger(out, x, y, z, len, r, lean, curl) {
  const dirs = [0.45, 0.32, 0.23]
  let px = x, py = y, pz = z, pr = r, bend = curl * 0.4
  for (const share of dirs) {
    const l = len * share, nx = px + lean * l, ny = py + Math.cos(bend) * l, nz = pz + Math.sin(bend) * l, nr = pr * 0.87
    out.push([px, py, pz, pr, nx, ny, nz, nr])
    px = nx; py = ny; pz = nz; pr = nr; bend += curl
  }
}
// a handshake grip: the palm faces +x towards the mug, thumb up, fingers come forward then wrap round its front
function fist(hand, side) {
  const palm = [stub(GRIP_BACK), [-0.03, -0.09, 0.02, 0.11, -0.03, 0.09, 0.03, 0.115]], digits = []
  ;[[0.13, 0.04], [0.05, 0.043], [-0.03, 0.041], [-0.105, 0.036]].forEach(([y, r], i) => {
    const tip = i === 3 ? 0.15 : 0.19
    digits.push([-0.05, y, 0.08, r, 0.03, y, 0.2, r * 0.92], [0.03, y, 0.2, r * 0.92, tip, y, 0.225, r * 0.8])
  })
  digits.push([-0.05, 0.07, -0.02, 0.06, 0.05, 0.18, 0.01, 0.046], [0.05, 0.18, 0.01, 0.046, 0.15, 0.22, 0.04, 0.036])
  return sculpt(`hand-${side}`, palm, digits, hand, GRIP_BACK)
}
// the open hand for waving: palm to the viewer, thumb towards the head, a broad palm and fingers of real, unequal length
function openHand(hand, side) {
  const palm = [stub(OPEN_BACK), [0, 0, 0, STUB_R, 0, 0.1, 0, 0.1], [-0.1, 0.17, 0, 0.065, 0.1, 0.17, 0, 0.065], [-0.075, 0.08, 0, 0.065, 0.085, 0.08, 0, 0.065]], digits = []
  // little finger to index; roots sit inside the palm
  ;[[-0.125, 0.15, 0.2, 0.032, -0.24], [-0.042, 0.18, 0.27, 0.036, -0.08], [0.042, 0.19, 0.3, 0.038, 0.03], [0.125, 0.17, 0.27, 0.037, 0.16]].forEach(([x, y, len, r, lean]) => finger(digits, x, y, 0, len, r, lean, 0.09))
  digits.push([0.07, 0.04, 0.02, 0.06, 0.19, 0.14, 0.04, 0.046], [0.19, 0.14, 0.04, 0.046, 0.27, 0.24, 0.05, 0.036])
  return sculpt(`open-${side}`, palm, digits, hand, OPEN_BACK)
}
// the same hand domed over the keys: fingers run away from the wrist along +z and curl down at the knuckle
function flatHand(hand, side) {
  mesh(`palm-${side}`, sphere(32), M.skin, hand, [0, 0, 0.14], [0.21, 0.13, 0.25])
  for (let i = 0; i < 4; i++) {
    const x = -0.15 + i * 0.1, reach = i === 0 || i === 3 ? 0.03 : 0
    capsule(`finger-${side}-${i}`, [x, 0.02, 0.3], [x, 0, 0.42 - reach], 0.05, hand)
    capsule(`fingertip-${side}-${i}`, [x, 0, 0.42 - reach], [x, -0.07, 0.5 - reach], 0.046, hand)
  }
  capsule(`thumb-${side}`, [-0.17, -0.03, 0.1], [-0.27, -0.08, 0.27], 0.055, hand)
}

// two-bone IK: the arm keeps its length, the elbow swings out towards the pole
function solveArm(S, target, pole, elbow, hand) {
  const dir = target.clone().sub(S), dist = Math.min(dir.length(), UPPER + FORE - 0.01)
  dir.normalize()
  const a = (UPPER * UPPER - FORE * FORE + dist * dist) / (2 * dist), h = Math.sqrt(Math.max(0, UPPER * UPPER - a * a))
  const side = pole.clone().addScaledVector(dir, -pole.dot(dir)).normalize()
  elbow.copy(S).addScaledVector(dir, a).addScaledVector(side, h)
  hand.copy(S).addScaledVector(dir, dist)
}

function buildMug() {
  const mug = new THREE.Group(); mug.name = 'mug'
  mesh('mug-body', new THREE.CylinderGeometry(0.31, 0.3, 0.66, 48), M.mug, mug, [0, 0.33, 0])
  mesh('mug-base', new THREE.CircleGeometry(0.3, 48), Object.assign(M.mug.clone(), { emissive: M.mug.color.clone(), emissiveIntensity: 0.12 }), mug, [0, -0.002, 0], [1, 1, 1], [Math.PI / 2, 0, 0])
  mesh('mug-coffee', new THREE.CircleGeometry(0.27, 40), M.dark, mug, [0, 0.655, 0], [1, 1, 1], [-Math.PI / 2, 0, 0])
  mesh('mug-handle', new THREE.TorusGeometry(0.15, 0.032, 14, 40), M.mug, mug, [0.33, 0.34, 0], [0.9, 1, 1])
  mesh('mug-emblem', new THREE.TorusGeometry(0.1, 0.014, 10, 36), M.mugLight, mug, [-0.08, 0.34, 0.3], [0.8, 1, 1])
  mug.traverse((o) => { o.castShadow = false })
  return mug
}

function buildLaptop() {
  const laptop = new THREE.Group(); laptop.name = 'laptop'; laptop.position.set(0, 0, 1.2)
  const lid = new THREE.Group(); lid.name = 'laptop-lid'; lid.rotation.x = 0.16; laptop.add(lid)
  const shape = new THREE.Shape()
  const w = 1.2, h = 1.52, r = 0.09
  shape.moveTo(-w + r, 0); shape.lineTo(w - r, 0); shape.quadraticCurveTo(w, 0, w, r); shape.lineTo(w, h - r); shape.quadraticCurveTo(w, h, w - r, h); shape.lineTo(-w + r, h); shape.quadraticCurveTo(-w, h, -w, h - r); shape.lineTo(-w, r); shape.quadraticCurveTo(-w, 0, -w + r, 0)
  mesh('laptop-shell', new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 3 }), M.laptop, lid, [0, 0.03, 0])
  const apple = new THREE.Shape(), leaf = new THREE.Shape()
  apple.moveTo(0, 0.27); apple.bezierCurveTo(0.08, 0.33, 0.3, 0.38, 0.42, 0.2); apple.bezierCurveTo(0.3, 0.12, 0.26, -0.06, 0.46, -0.16)
  apple.bezierCurveTo(0.38, -0.38, 0.24, -0.52, 0.12, -0.5); apple.bezierCurveTo(0.06, -0.5, 0.04, -0.46, 0, -0.46); apple.bezierCurveTo(-0.04, -0.46, -0.06, -0.5, -0.12, -0.5)
  apple.bezierCurveTo(-0.3, -0.5, -0.52, -0.2, -0.5, 0.02); apple.bezierCurveTo(-0.48, 0.25, -0.3, 0.38, -0.14, 0.34); apple.bezierCurveTo(-0.08, 0.32, -0.04, 0.29, 0, 0.27)
  leaf.moveTo(0.02, 0.33); leaf.bezierCurveTo(0.02, 0.46, 0.12, 0.56, 0.24, 0.58); leaf.bezierCurveTo(0.24, 0.46, 0.14, 0.34, 0.02, 0.33)
  mesh('laptop-logo', new THREE.ShapeGeometry([apple, leaf], 24), M.logo, lid, [0, 0.8, 0.094], [0.3, 0.3, 1])
  mesh('laptop-base', new THREE.BoxGeometry(2.2, 0.05, 1.3), M.laptop, laptop, [0, 0.025, -0.68])
  return laptop
}

const POLE_R = new THREE.Vector3(-1, -0.85, -0.38), POLE_L = new THREE.Vector3(1, -0.85, -0.38)
const UP = new THREE.Vector3(0, 1, 0), FRONT = new THREE.Vector3(0, 0, 1), along = new THREE.Vector3(), past = new THREE.Vector3(), turn = new THREE.Quaternion()
const POLE_WAVE = new THREE.Vector3(-0.8, -1, -0.15)
// one tube bent round a middle point, its rings rewritten each pose, so there is no joint to see. Its radius
// eases to a stop at the far end, so it meets whatever it runs into without a step
const BENT_SIDES = 48
function bentArm(name, parent, material = M.skin, r0 = 0.285, r1 = STUB_R * 1.3 - 0.012, anchor = null) {
  const RINGS = 56, SIDES = BENT_SIDES, pos = new Float32Array((RINGS + 1) * (SIDES + 1) * 3), nor = new Float32Array(pos.length), idx = []
  for (let i = 0; i < RINGS; i++) for (let j = 0; j < SIDES; j++) {
    const a = i * (SIDES + 1) + j, b = a + SIDES + 1
    idx.push(a, a + 1, b, b, a + 1, b + 1)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); g.setIndex(idx)
  const tube = mesh(name, g, material, parent); tube.receiveShadow = false; tube.frustumCulled = false
  const p = new THREE.Vector3(), tan = new THREE.Vector3(), n = new THREE.Vector3(1, 0, 0), b = new THREE.Vector3(), A = new THREE.Vector3(), B = new THREE.Vector3(), Q = new THREE.Vector3(), d = new THREE.Vector3()
  // heading, if given, is the direction the tube must be travelling as it arrives at W
  return (S, E, W, heading, endR = r1) => {
    if (heading) Q.copy(W).addScaledVector(heading, -0.3); else Q.lerpVectors(E, W, 0.7)
    const c = Math.min(0.42, S.distanceTo(E) * 0.9, Q.distanceTo(E) * 0.9)
    A.copy(E).addScaledVector(d.copy(S).sub(E).normalize(), c); 
    B.copy(E).addScaledVector(d.copy(Q).sub(E).normalize(), c)
    if (anchor) n.set(0, 1, 0); else n.set(0.31, 0.53, 0.79)
    for (let i = 0; i <= RINGS; i++) {
      const u = i / RINGS
      if (u < 0.25) { const t = u / 0.25; p.lerpVectors(S, A, t); tan.copy(A).sub(S) }
      else if (u < 0.75) {
        const t = (u - 0.25) / 0.5, q = 1 - t
        p.set(0, 0, 0).addScaledVector(A, q * q).addScaledVector(E, 2 * q * t).addScaledVector(B, t * t)
        tan.copy(E).sub(A).multiplyScalar(q).addScaledVector(d.copy(B).sub(E), t)
      } else {
        const t = (u - 0.75) / 0.25, q = 1 - t
        p.set(0, 0, 0).addScaledVector(B, q * q).addScaledVector(Q, 2 * q * t).addScaledVector(W, t * t)
        tan.copy(Q).sub(B).multiplyScalar(q).addScaledVector(d.copy(W).sub(Q), t)
      }
      tan.normalize(); n.addScaledVector(tan, -n.dot(tan)).normalize(); b.crossVectors(tan, n)
      const rad = r0 + (endR - r0) * (1 - (1 - u) * (1 - u))
      for (let j = 0; j <= SIDES; j++) {
        const a = (j / SIDES) * Math.PI * 2, cs = Math.cos(a), sn = Math.sin(a), v = (i * (SIDES + 1) + j) * 3
        const nx = n.x * cs + b.x * sn, ny = n.y * cs + b.y * sn, nz = n.z * cs + b.z * sn
        pos[v] = p.x + nx * rad; pos[v + 1] = p.y + ny * rad; pos[v + 2] = p.z + nz * rad
        nor[v] = nx; nor[v + 1] = ny; nor[v + 2] = nz
        if (anchor) {
          // the first ring lies exactly on the tee's cut edge, and the next ones loft from that edge's shape and facing to a round sleeve
          const wp = THREE.MathUtils.smoothstep(u, 0, 0.55), wn = THREE.MathUtils.smoothstep(u, 0, 0.9), q = j * 3
          for (let e = 0; e < 3; e++) {
            // from the edge the cloth first carries straight on along the tee's own slope
            const from = anchor.pos[q + e] + anchor.tan[q + e] * (u * 0.9 - 0.07) - anchor.nor[q + e] * 0.004 * (1 - u)
            pos[v + e] = from + (pos[v + e] - from) * wp
            nor[v + e] = anchor.nor[q + e] + (nor[v + e] - anchor.nor[q + e]) * wn
          }
        }
      }
    }
    g.attributes.position.needsUpdate = true; g.attributes.normal.needsUpdate = true
  }
}

const elbow = new THREE.Vector3(), wrist = new THREE.Vector3()
const POLE_TUCK = new THREE.Vector3(-0.85, -1, -0.8), pole = new THREE.Vector3(), shoulder = new THREE.Vector3()
const poseArm = (A, S, target, pole) => {
  solveArm(S, target, pole, elbow, wrist)
  aimDown(A.upper, S, elbow); aimDown(A.fore, elbow, wrist); A.hand.position.copy(wrist)
}

export function createFinnickModel() {
  const root = new THREE.Group(); root.name = 'finnick'
  root.add(buildTorso())
  root.add(buildHead())
  const R = buildArm('r', SHOULDER_R), L = buildArm('l', SHOULDER_L); root.add(R.arm, L.arm)
  const grip = new THREE.Group(), open = new THREE.Group(); open.visible = false; R.hand.add(grip, open)
  const gripR = fist(grip, 'r') * 1.3, openR = openHand(open, 'r') * 1.3; flatHand(L.hand, 'l'); R.hand.scale.setScalar(1.3); L.hand.scale.setScalar(1.3)
  const restL = new THREE.Vector3(0.78, 0.28, 0.42)
  // the other hand types behind the lid, mirroring the right arm's resting pose
  poseArm(L, SHOULDER_L, restL, POLE_L); L.hand.rotation.y = -0.5
  bentArm('arm-tube-l', L.arm)(SHOULDER_L, elbow, wrist)
  const bendR = bentArm('arm-tube-r', R.arm)
  for (const n of ['upper-arm-l', 'forearm-l', 'upper-arm-r', 'forearm-r', 'sleeve-l', 'sleeve-r']) root.getObjectByName(n).visible = false
  // walk round each shoulder's cut edge, recording the tee's surface there for its sleeve to start from
  const teeG = root.getObjectByName('tee').geometry, tp = teeG.attributes.position.array, tn = teeG.attributes.normal.array, ti = teeG.index.array
  const edge = (sign) => {
    const C = new THREE.Vector3(sign * SHOULDER_CUT, 1.6, -0.1), out = { C, pos: [], nor: [], tan: [] }, X = C.x, cuts = []
    // every place a triangle edge crosses the cut plane, by its angle round the shoulder
    for (let t = 0; t < ti.length; t += 3) for (let e = 0; e < 3; e++) {
      const a = ti[t + e] * 3, b = ti[t + (e + 1) % 3] * 3
      if ((tp[a] - X) * (tp[b] - X) >= 0) continue
      const w = (X - tp[a]) / (tp[b] - tp[a]), y = tp[a + 1] + (tp[b + 1] - tp[a + 1]) * w, z = tp[a + 2] + (tp[b + 2] - tp[a + 2]) * w
      cuts.push({ y, z, ang: Math.atan2(y - C.y, z - C.z), n: [0, 1, 2].map((i) => tn[a + i] + (tn[b + i] - tn[a + i]) * w) })
    }
    const T = new THREE.Vector3(sign, 0, 0), N = new THREE.Vector3(0, 1, 0), B = new THREE.Vector3().crossVectors(T, N), d = new THREE.Vector3()
    for (let j = 0; j <= BENT_SIDES; j++) {
      const a = (j / BENT_SIDES) * Math.PI * 2
      d.copy(N).multiplyScalar(Math.cos(a)).addScaledVector(B, Math.sin(a))
      const want = Math.atan2(d.y, d.z), gap = (c) => Math.abs(Math.atan2(Math.sin(c.ang - want), Math.cos(c.ang - want)))
      const hit = cuts.reduce((best, c) => (gap(c) < gap(best) ? c : best))
      out.pos.push(X, hit.y, hit.z)
      const f = new THREE.Vector3(...hit.n).normalize()
      out.nor.push(f.x, f.y, f.z)
      const g = new THREE.Vector3(sign, 0, 0).addScaledVector(f, -f.x * sign).normalize()
      out.tan.push(g.x, g.y, g.z)
    }
    return out
  }
  const edgeR = edge(-1), edgeL = edge(1)
  // the sliver of tee left past the cut folds back onto the plane, so nothing overhangs the sleeve's first ring
  for (let i = 0; i < tp.length; i += 3) if (Math.abs(tp[i]) > SHOULDER_CUT) tp[i] = Math.sign(tp[i]) * SHOULDER_CUT
  const bendSleeveR = bentArm('sleeve-tube-r', R.arm, M.cotton, 0.44, 0.37, edgeR)
  const cuff = new THREE.Vector3(), bulge = new THREE.Vector3()
  const poseSleeve = (bend, S, ring, sign) => {
    cuff.copy(S).addScaledVector(along.copy(elbow).sub(S).normalize(), 0.78)
    bulge.copy(ring.C).add(new THREE.Vector3(sign * 0.3, 0, 0)).lerp(S, 0.5)
    bend(ring.C, bulge, cuff)
  }
  poseArm(L, SHOULDER_L, restL, POLE_L)
  poseSleeve(bentArm('sleeve-tube-l', L.arm, M.cotton, 0.44, 0.37, edgeL), SHOULDER_L, edgeL, 1)
  root.add(buildLaptop())
  const mug = buildMug(); mug.position.set(-2.14, 0, 0.95); mug.rotation.y = Math.PI; root.add(mug)
  const rig = {
    head: root.getObjectByName('head'), mug,
    eyes: [root.getObjectByName('eye-r'), root.getObjectByName('eye-l')],
    // swapped only while the hand is out of sight behind the lid
    openHand(on) { open.visible = on; grip.visible = !on },
    reach(target, tip = 0, tuck = 1) {
      // as the cup rises the elbow swings out to the side and stays above the laptop, one unbroken sweep
      const t = THREE.MathUtils.smoothstep(target.y, 0.8, 2.3) * tuck
      // the shoulder rolls in with it and the sleeve narrows, so its rounded top doesn't bulge past the torso
      poseArm(R, shoulder.copy(SHOULDER_R).setX(SHOULDER_R.x + 0.12 * t), target, pole.copy(POLE_R).lerp(POLE_TUCK, t).lerp(POLE_WAVE, 1 - tuck))
      poseSleeve(bendSleeveR, shoulder, edgeR, -1)
      // the waving hand carries on along the forearm's line; the grip keeps its fixed thumb-up hold
      turn.setFromAxisAngle(FRONT, -tip)
      if (open.visible) R.hand.quaternion.setFromUnitVectors(UP, along.copy(wrist).sub(elbow).normalize()).premultiply(turn)
      else R.hand.quaternion.copy(turn)
      // the arm arrives along the hand's own axis, so it ends exactly on the hand's piece of forearm
      along.copy(open.visible ? OPEN_BACK : GRIP_BACK).applyQuaternion(R.hand.quaternion)
      bendR(shoulder, elbow, past.copy(wrist).addScaledVector(along, MEET * 1.3), along.negate(), open.visible ? openR : gripR)
    },
  }
  return { root, rig }
}

// what sits on the desk in front of the GLB figure
export function createProps() {
  const props = new THREE.Group(); props.name = 'props'
  props.add(buildLaptop())
  const mug = buildMug(); mug.rotation.y = Math.PI
  return { props, mug }
}

// a soft pool of light that fades to nothing at its edge
export const pool = (parent, w, h, strength, at, flat, color = '1.0, 0.76, 0.46') => {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { k: { value: strength } },
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform float k; varying vec2 vUv; void main() { float d = length(vUv - 0.5) * 2.0; float a = pow(max(1.0 - d, 0.0), 2.2) * k; gl_FragColor = vec4(vec3(${color}) * a, a); }`,
  }))
  m.position.set(...at); if (flat) m.rotation.x = -Math.PI / 2; m.userData.k = strength; parent.add(m); return m
}

// pendant lamp: everything below the ceiling hook swings together, and level dims all of its light at once
// reach is how far the beam falls below the shade; wall and ground are the pools it throws: [w, h, strength, position]
export function createPendant(room, cord, shade, { at, wall, ground, reach = 3.35, spread = 1.75, power = 20 }) {
  const lampArm = new THREE.Group(); lampArm.name = 'lamp'; lampArm.position.set(...at); room.add(lampArm)
  mesh('lamp-cord', new THREE.CylinderGeometry(0.012, 0.012, 2.5, 8), cord, lampArm, [0, -1.25, 0])
  mesh('lamp-shade', new THREE.SphereGeometry(0.53, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2), shade, lampArm, [0, -2.75, 0])
  const shadeGlow = new THREE.MeshBasicMaterial({ color: '#ffb066', side: THREE.BackSide, transparent: true, opacity: 0.8 })
  mesh('lamp-shade-inside', new THREE.SphereGeometry(0.51, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2), shadeGlow, lampArm, [0, -2.75, 0]).castShadow = false
  const bulbMat = new THREE.MeshBasicMaterial({ color: '#fff4cf' }), bulbOn = new THREE.Color('#fff4cf'), bulbOff = new THREE.Color('#3b3a40')
  mesh('lamp-bulb', sphere(20), bulbMat, lampArm, [0, -2.75, 0], [0.14, 0.14, 0.14]).castShadow = false
  // the light in the air: strongest under the shade, thinning towards the desk, with no edge to its sides
  const beam = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, uniforms: { k: { value: 1 } },
    vertexShader: 'varying vec2 vUv; varying vec3 vN, vV; void main() { vUv = uv; vec4 p = modelViewMatrix * vec4(position, 1.0); vN = normalMatrix * normal; vV = -p.xyz; gl_Position = projectionMatrix * p; }',
    fragmentShader: 'uniform float k; varying vec2 vUv; varying vec3 vN, vV; void main() { float f = abs(dot(normalize(vN), normalize(vV))); float a = pow(f, 3.0) * pow(vUv.y, 1.6) * smoothstep(0.0, 0.12, vUv.y) * k; gl_FragColor = vec4(vec3(1.0, 0.8, 0.52) * a * 0.42, a); }',
  })
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.2, spread, reach, 48, 1, true), beam)
  cone.position.set(0, -2.775 - reach / 2, 0); lampArm.add(cone)
  const halo = pool(lampArm, 1.5, 1.5, 0.75, [0, -2.83, 0.08])
  const wallPool = pool(room, ...wall), groundPool = pool(room, ...ground, true)
  const glow = new THREE.PointLight('#ffc98a', power, 14, 1.4); glow.position.set(0, -3.15, 0.4); lampArm.add(glow)
  // dust turning in the beam
  const DUST = 55, dustPos = new Float32Array(DUST * 3), dustSeed = new Float32Array(DUST)
  for (let i = 0; i < DUST; i++) {
    const t = Math.random(), r = Math.sqrt(Math.random()) * (0.2 + t * 1.3), a = Math.random() * Math.PI * 2
    dustPos.set([Math.cos(a) * r, -3 - t * (reach - 0.35), Math.sin(a) * r * 0.6 + 0.3], i * 3); dustSeed[i] = Math.random() * 100
  }
  const dustGeo = new THREE.BufferGeometry()
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3)); dustGeo.setAttribute('seed', new THREE.BufferAttribute(dustSeed, 1))
  const dustMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { t: { value: 0 }, k: { value: 1 } },
    vertexShader: 'attribute float seed; uniform float t; varying float v; void main() { vec3 p = position; p.x += sin(t * 0.13 + seed) * 0.16; p.y += mod(t * 0.03 + seed * 0.1, 0.5) - 0.25 + sin(t * 0.09 + seed * 2.0) * 0.1; v = 0.35 + 0.65 * sin(t * 0.5 + seed) * sin(t * 0.5 + seed); gl_PointSize = 2.0 + mod(seed, 3.0); gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }',
    fragmentShader: 'uniform float k; varying float v; void main() { float a = smoothstep(0.5, 0.05, length(gl_PointCoord - 0.5)) * v * k * 0.38; gl_FragColor = vec4(vec3(1.0, 0.86, 0.62) * a, a); }',
  })
  const dust = new THREE.Points(dustGeo, dustMat); dust.frustumCulled = false; lampArm.add(dust)
  const wallX = wall[3][0], groundX = ground[3][0]
  const lamp = (level, swing, t) => {
    lampArm.rotation.z = swing
    const dx = Math.sin(swing) * 2.75
    wallPool.position.x = wallX + dx * 0.7; groundPool.position.x = groundX + dx * 0.9
    beam.uniforms.k.value = level; dustMat.uniforms.k.value = level; dustMat.uniforms.t.value = t
    ;[halo, wallPool, groundPool].forEach((m) => { m.material.uniforms.k.value = m.userData.k * level })
    glow.intensity = power * level; shadeGlow.opacity = 0.8 * level
    bulbMat.color.copy(bulbOff).lerp(bulbOn, level)
  }
  return { lampArm, lamp }
}

// the room around him, from the same illustration measurements
export function createRoom(drawWindow) {
  const room = new THREE.Group(); room.name = 'room'
  const wall = mesh('wall', new THREE.PlaneGeometry(24, 18), mat('#191c24', 0.95), room, [1, 1.5, -1.6])
  wall.castShadow = false
  const paint = document.createElement('canvas'); paint.width = 548 * 2; paint.height = 680 * 2
  const texture = new THREE.CanvasTexture(paint); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4
  const glass = mesh('window-view', new THREE.PlaneGeometry(5.48, 6.8), new THREE.MeshStandardMaterial({ map: texture, emissive: '#ffffff', emissiveMap: texture, emissiveIntensity: 0.24, roughness: 0.4 }), room, [3.51, 2.72, -1.5])
  glass.castShadow = false
  const refresh = () => { drawWindow(paint.getContext('2d'), paint.width, paint.height); texture.needsUpdate = true }
  refresh()
  const bar = mat('#0b1250', 0.5)
  for (const [x, y, w, h] of [[3.51, 6.14, 5.68, 0.1], [3.51, -0.7, 5.68, 0.1], [0.77, 2.72, 0.1, 6.9], [6.25, 2.72, 0.1, 6.9], [3.51, 2.72, 0.09, 6.9], [3.51, 4.0, 5.5, 0.09]]) mesh('window-frame', new THREE.BoxGeometry(w, h, 0.16), bar, room, [x, y, -1.42])
  const drops = new THREE.InstancedMesh(new THREE.BoxGeometry(0.018, 0.26, 0.01), new THREE.MeshBasicMaterial({ color: '#dfe6ff', transparent: true, opacity: 0.6 }), 46)
  drops.name = 'rain'; room.add(drops)
  const seeds = Array.from({ length: 46 }, (_, i) => [Math.abs(Math.sin(i * 12.9) * 437) % 1, Math.abs(Math.sin(i * 78.2) * 917) % 1, 0.7 + (Math.abs(Math.sin(i * 3.1) * 91) % 1) * 0.6])
  const m4 = new THREE.Matrix4(), rot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -0.1)
  const rain = (t) => {
    seeds.forEach(([x, y, v], i) => {
      const fall = (y + t * 0.85 * v) % 1
      const px = 0.85 + ((x + fall * 0.08) % 1) * 5.3
      m4.compose(new THREE.Vector3(px, 5.95 - fall * 6.5, -1.46), rot, new THREE.Vector3(1, v, 1)); drops.setMatrixAt(i, m4)
    })
    drops.instanceMatrix.needsUpdate = true
  }
  rain(0)
  // desk and what sits under it
  const blue = mat('#2534c8', 0.55), deep = mat('#101a86', 0.6), pants = mat('#0b1045', 0.8)
  mesh('desk-top', new THREE.BoxGeometry(7.86, 0.13, 3.3), mat('#5468ea', 0.45), room, [-0.5, -0.065, 0.45])
  mesh('desk-apron', new THREE.BoxGeometry(7.6, 0.72, 3), deep, room, [-0.5, -0.49, 0.45])
  for (const x of [-4.1, -3.45, 2.3, 3.05]) mesh('desk-leg', new THREE.BoxGeometry(0.16, 2.6, 0.16), blue, room, [x, -2.1, 1.7])
  mesh('stool-post', new THREE.CylinderGeometry(0.07, 0.07, 1.9, 16), mat('#2f79b8', 0.5), room, [-0.1, -2.35, -0.7])
  mesh('stool-seat', new THREE.BoxGeometry(1.6, 0.1, 0.9), mat('#2f79b8', 0.5), room, [-0.1, -1.4, -0.7])
  const { lampArm, lamp } = createPendant(room, deep, blue, { at: [-1.6, 6.25, 0.2], wall: [9, 8, 0.26, [-1.6, 2.5, -1.55]], ground: [5.2, 2.6, 0.3, [-1.6, 0.02, 0.45]] })
  pool(room, 5, 2.4, 0.16, [3, 0.02, 0.45], true, '0.45, 0.58, 1.0')
  // plant
  mesh('pot', new THREE.CylinderGeometry(0.33, 0.27, 0.72, 32), mat('#6a5fb8', 0.7), room, [-3.74, 0.36, 0.5])
  const stemMat = mat('#0f3f4a', 0.7)
  const greens = ['#114a58', '#155562', '#0f4250'].map((c) => Object.assign(mat(c, 0.8), { side: THREE.DoubleSide }))
  mesh('soil', new THREE.CircleGeometry(0.31, 28), mat('#1c1626', 0.95), room, [-3.74, 0.715, 0.5], [1, 1, 1], [-Math.PI / 2, 0, 0])
  // a pointed blade, creased along its midrib and drooping towards the tip; base at the origin, growing along +y
  const blade = (len, wide) => {
    const g = new THREE.PlaneGeometry(1, 1, 6, 14), p = g.attributes.position
    for (let i = 0; i < p.count; i++) {
      const u = p.getX(i) * 2, t = p.getY(i) + 0.5, w = Math.pow(Math.sin(Math.PI * Math.pow(t, 0.8)), 0.85) * wide
      p.setXYZ(i, u * w, t * len, Math.abs(u) * w * 0.28 - t * t * len * 0.3)
    }
    g.computeVertexNormals(); return g
  }
  const fronds = Array.from({ length: 7 }, (_, i) => {
    const a = -0.42 + i * 0.14, back = i % 2, h = 0.36 + ((i * 5) % 3) * 0.07 + (0.42 - Math.abs(a)) * 0.3
    const pivot = new THREE.Group(); pivot.position.set(-3.74 + a * 0.12, 0.7, 0.5 + (back ? -0.07 : 0.08)); room.add(pivot)
    const end = new THREE.Vector3(Math.sin(a) * h * 0.75, Math.cos(a) * h * 0.82, back ? -0.06 : 0.06)
    const stem = new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(Math.sin(a) * h * 0.14, Math.cos(a) * h * 0.55, 0), end)
    mesh('stem', new THREE.TubeGeometry(stem, 16, 0.015, 8), stemMat, pivot)
    const leaf = new THREE.Group(); leaf.position.copy(end)
    leaf.rotation.set(back ? 0.1 : -0.1, a * 0.4, -a * 1.15); pivot.add(leaf)
    const len = 0.44 + ((i * 3) % 3) * 0.06
    mesh('leaf', blade(len, 0.075 + (i % 3) * 0.008), greens[i % greens.length], leaf)
    return { pivot, leaf, tilt: leaf.rotation.z, phase: i * 1.7, speed: 0.55 + (i % 3) * 0.12 }
  })
  // the plant breathes: the stem leans a touch and the blade follows a beat later
  // brush gives the lean from a passing pointer; each blade answers by its own amount so they don't move as one
  const sway = (t, brush = 0) => fronds.forEach(({ pivot, leaf, tilt, phase, speed }, i) => {
    pivot.rotation.z = Math.sin(t * speed + phase) * 0.008 - brush * (0.45 + (i % 3) * 0.2)
    leaf.rotation.z = tilt + Math.sin(t * speed * 1.4 + phase - 0.8) * 0.018 - brush * (0.9 + ((i * 2) % 3) * 0.35)
  })
  // steam
  const puffs = Array.from({ length: 5 }, () => { const p = new THREE.Mesh(sphere(14), new THREE.MeshBasicMaterial({ color: '#cfd8f5', transparent: true, opacity: 0, depthWrite: false })); room.add(p); return p })
  const steam = (t, x, y, z, amount) => puffs.forEach((p, i) => {
    const k = (t * 0.28 + i / puffs.length) % 1
    p.position.set(x + Math.sin(k * 7 + i) * 0.07, y + k * 1.05, z); p.scale.setScalar(0.05 + k * 0.13)
    p.material.opacity = amount * Math.sin(k * Math.PI) * 0.26
  })
  return { room, refresh, rain, steam, sway, lamp, lampArm, glass }
}
