import * as THREE from 'three'

// Finnick's rigged model, shared by the homepage room and the about page's booth.
const EYE = [0.045, 1.506, 0.0155, 0.0235]
const CHAIN = [['Head', 'HeadTop_End'], ['LeftArm', 'LeftForeArm'], ['LeftForeArm', 'LeftHand'], ['LeftHand', null], ['RightArm', 'RightForeArm'], ['RightForeArm', 'RightHand'], ['RightHand', null], ['LeftUpLeg', 'LeftLeg'], ['LeftLeg', 'LeftFoot'], ['RightUpLeg', 'RightLeg'], ['RightLeg', 'RightFoot']]
export const SEATED = { LeftUpLeg: [0.12, -0.05, 1], LeftLeg: [0, -1, 0.05], RightUpLeg: [-0.12, -0.05, 1], RightLeg: [0, -1, 0.05], LeftArm: [0.2, -0.95, 0.2], LeftForeArm: [-0.2, -0.1, 1], LeftHand: [-0.2, -0.1, 1] }

export function rigFigure(gltf) {
  const model = gltf.scene
  model.updateMatrixWorld(true)
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
