import * as THREE from 'three'

// Finnick's rigged model, shared by the homepage room and the about page's booth.
const EYE = [0.045, 1.506, 0.0155, 0.0235]
const CHAIN = [['Head', 'HeadTop_End'], ['LeftArm', 'LeftForeArm'], ['LeftForeArm', 'LeftHand'], ['LeftHand', null], ['RightArm', 'RightForeArm'], ['RightForeArm', 'RightHand'], ['RightHand', null], ['LeftUpLeg', 'LeftLeg'], ['LeftLeg', 'LeftFoot'], ['RightUpLeg', 'RightLeg'], ['RightLeg', 'RightFoot']]
export const SEATED = { LeftUpLeg: [0.12, -0.05, 1], LeftLeg: [0, -1, 0.05], RightUpLeg: [-0.12, -0.05, 1], RightLeg: [0, -1, 0.05], LeftArm: [0.2, -0.95, 0.2], LeftForeArm: [-0.2, -0.1, 1], LeftHand: [-0.2, -0.1, 1] }

// The mesh is a decimated scan: its surface is lumpy and the elbow and shoulder bend on a hard line.
// Relaxing the vertices along their normals (Taubin, so nothing shrinks) and rebuilding the normals
// across UV seams gives a clay-smooth surface without sliding the baked texture.
const SMOOTH = { passes: 10, lambda: 0.55, mu: -0.58 }
function relax(mesh) {
  const geometry = mesh.geometry
  const pos = geometry.attributes.position, index = geometry.index, n = pos.count
  const ids = new Uint32Array(n), seen = new Map()
  let count = 0
  for (let i = 0; i < n; i++) {
    const key = `${Math.round(pos.getX(i) * 1e5)},${Math.round(pos.getY(i) * 1e5)},${Math.round(pos.getZ(i) * 1e5)}`
    let id = seen.get(key)
    if (id === undefined) { id = count++; seen.set(key, id) }
    ids[i] = id
  }
  const near = Array.from({ length: count }, () => new Set())
  for (let i = 0; i < index.count; i += 3) {
    const a = ids[index.getX(i)], b = ids[index.getX(i + 1)], c = ids[index.getX(i + 2)]
    near[a].add(b).add(c); near[b].add(a).add(c); near[c].add(a).add(b)
  }
  const ring = near.map(s => [...s])
  const faceNormals = (at) => {
    const out = new Float32Array(count * 3), A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3()
    for (let i = 0; i < index.count; i += 3) {
      const a = ids[index.getX(i)], b = ids[index.getX(i + 1)], c = ids[index.getX(i + 2)]
      A.fromArray(at, a * 3); B.fromArray(at, b * 3).sub(A); C.fromArray(at, c * 3).sub(A); B.cross(C)
      for (const v of [a, b, c]) { out[v * 3] += B.x; out[v * 3 + 1] += B.y; out[v * 3 + 2] += B.z }
    }
    for (let v = 0; v < count; v++) { A.fromArray(out, v * 3).normalize(); out[v * 3] = A.x; out[v * 3 + 1] = A.y; out[v * 3 + 2] = A.z }
    return out
  }
  let p = new Float32Array(count * 3), next = new Float32Array(count * 3)
  for (let i = 0; i < n; i++) { p[ids[i] * 3] = pos.getX(i); p[ids[i] * 3 + 1] = pos.getY(i); p[ids[i] * 3 + 2] = pos.getZ(i) }
  const step = (k) => {
    for (let v = 0; v < count; v++) {
      const r = ring[v]
      for (let d = 0; d < 3; d++) {
        let sum = 0
        for (let j = 0; j < r.length; j++) sum += p[r[j] * 3 + d]
        next[v * 3 + d] = r.length ? p[v * 3 + d] + k * (sum / r.length - p[v * 3 + d]) : p[v * 3 + d]
      }
    }
    [p, next] = [next, p]
  }
  // the head and hands keep their sculpt (the grip morph is authored on the raw fingers), and everything else only moves along its own normal:
  // sliding a vertex sideways would drag the painted texture with it
  const rest = p.slice(), keep = new Float32Array(count), restNormal = faceNormals(rest)
  const guarded = mesh.skeleton.bones.map(b => /Head|Neck|Hand/.test(b.name))
  for (let i = 0; i < n; i++) {
    let g = 0
    for (let k = 0; k < 4; k++) if (guarded[geometry.attributes.skinIndex.getComponent(i, k)]) g += geometry.attributes.skinWeight.getComponent(i, k)
    keep[ids[i]] = Math.max(keep[ids[i]], Math.min(1, g * 2))
  }
  for (let i = 0; i < SMOOTH.passes; i++) { step(SMOOTH.lambda); step(SMOOTH.mu) }
  for (let v = 0; v < count; v++) {
    const a = v * 3, along = ((p[a] - rest[a]) * restNormal[a] + (p[a + 1] - rest[a + 1]) * restNormal[a + 1] + (p[a + 2] - rest[a + 2]) * restNormal[a + 2]) * (1 - keep[v])
    for (let d = 0; d < 3; d++) p[a + d] = rest[a + d] + restNormal[a + d] * along
  }
  for (let i = 0; i < n; i++) pos.setXYZ(i, p[ids[i] * 3], p[ids[i] * 3 + 1], p[ids[i] * 3 + 2])
  pos.needsUpdate = true

  // normals shared across UV seams, weighted by face area
  const nor = faceNormals(p), normal = geometry.attributes.normal
  for (let i = 0; i < n; i++) if (keep[ids[i]] < 1) normal.setXYZ(i, nor[ids[i] * 3], nor[ids[i] * 3 + 1], nor[ids[i] * 3 + 2])
  normal.needsUpdate = true
  geometry.computeBoundingSphere(); geometry.computeBoundingBox()
}

export function rigFigure(gltf) {
  const model = gltf.scene
  model.updateMatrixWorld(true)
  model.traverse((o) => { if (o.isSkinnedMesh && !o.geometry.userData.relaxed) { relax(o); o.geometry.userData.relaxed = true } })
  const bones = {}
  for (const [name, tip] of CHAIN) {
    const node = model.getObjectByName(`mixamorig${name}`) ?? model.getObjectByName(`mixamorig:${name}`), child = model.getObjectByName(`mixamorig${tip}`) ?? model.getObjectByName(`mixamorig:${tip}`)
    const a = node.getWorldPosition(new THREE.Vector3()), restDir = child ? child.getWorldPosition(new THREE.Vector3()).sub(a).normalize() : null
    const parentName = node.parent.name.replace(/^mixamorig:?/, '')
    bones[name] = { node, restDir, restPos: a.clone(), parentName, world: new THREE.Quaternion(), restWorld: node.getWorldQuaternion(new THREE.Quaternion()), parentRest: node.parent.getWorldQuaternion(new THREE.Quaternion()) }
  }
  bones.LeftHand.restDir = bones.LeftForeArm.restDir.clone(); bones.RightHand.restDir = bones.RightForeArm.restDir.clone()
  // the eyes are painted on, so a blink is a skin lid and a lash line that ride on the head
  const facePos = gltf.scene.getObjectByProperty('isSkinnedMesh', true).geometry.attributes.position
  const lids = [-1, 1].map((side) => {
    let z = 0
    for (let i = 0; i < facePos.count; i++) if (Math.abs(facePos.getX(i) - side * EYE[0]) < 0.012 && Math.abs(facePos.getY(i) - EYE[1]) < 0.02) z = Math.max(z, facePos.getZ(i))
    const lid = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), new THREE.MeshStandardMaterial({ color: '#c99a80', roughness: 0.82 }))
    lid.position.set(side * EYE[0], EYE[1], z + 0.0005); lid.scale.set(EYE[2], EYE[3], 0.004)
    const lash = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), new THREE.MeshBasicMaterial({ color: '#17131a' }))
    lash.position.set(side * EYE[0], EYE[1] - 0.004, z + 0.0045); lash.scale.set(EYE[2] * 0.85, 0.0022, 0.0012)
    bones.Head.node.attach(lid); bones.Head.node.attach(lash)
    lid.visible = lash.visible = false
    return { lid, lash, h: lid.scale.y }
  })
  // the wave's smile line exists only while he waves; at rest the face keeps its own painted mouth
  const surfaceZ = (x, y) => { let z = 0; for (let i = 0; i < facePos.count; i++) if (Math.abs(facePos.getX(i) - x) < 0.012 && Math.abs(facePos.getY(i) - y) < 0.012) z = Math.max(z, facePos.getZ(i)); return z }
  const smileLine = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3([-1, -0.5, 0, 0.5, 1].map((k) => { const x = k * 0.036, y = 1.432 + 0.015 * k * k; return new THREE.Vector3(x, y, surfaceZ(x, y) + 0.002) })), 24, 0.0015, 6),
    new THREE.MeshBasicMaterial({ color: '#a8533f', transparent: true, opacity: 0 }))
  bones.Head.node.attach(smileLine)
  model.traverse((o) => {
    if (!o.isSkinnedMesh) return
    o.frustumCulled = false; o.castShadow = true
    Object.assign(o.material, { metalness: 0, metalnessMap: null, roughness: 0.82, roughnessMap: null })
    o.material.color.setScalar(0.72)
    o.material.map.anisotropy = 8
    // a faint glow of his own colours, so the inside of a sleeve that no light reaches is not a black hole
    o.material.emissive.set('#ffffff'); o.material.emissiveMap = o.material.map; o.material.emissiveIntensity = 0.18
  })
  const fingers = model.getObjectByProperty('isSkinnedMesh', true)
  const dir = new THREE.Vector3(), q = new THREE.Quaternion(), q2 = new THREE.Quaternion()
  // each bone is aimed along a body-space direction (x his left, y up, z forward) from its rest pose
  const point = (name, x, y, z, roll = 0) => {
    const b = bones[name]
    q.setFromUnitVectors(b.restDir, dir.set(x, y, z).normalize()).multiply(b.restWorld)
    if (roll) q.premultiply(q2.setFromAxisAngle(dir, roll))
    b.world.copy(q)
    const parent = bones[b.parentName]?.world ?? b.parentRest
    b.node.quaternion.copy(q.clone().premultiply(parent.clone().invert()))
  }
  return { model, bones, lids, smileLine, fingers, point }
}
