import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { createPendant, mat, mesh, pool } from './createFinnickModel'

// The photo booth on the about page, standing in the same night as the homepage room:
// cobalt clay under the pendant lamp, warm light behind the curtain, a yellow button like his mug.
const W = 4.4, H = 6, BASE = 0.22, FRONT = 1.1, REVEAL = 0.7
const DOOR = { x0: -1.92, x1: -0.2, y0: 0.42, y1: 5.72 }
const SLOT = { x0: 0.16, x1: 1.92, y0: 1.06, y1: 5.86 }
export const SEAT = [-0.92, 1.79, -0.5]   // where his hips rest: high enough that his shoes stand on the booth floor
const PHOTO_W = 1.08, PHOTO_H = 1.44, GAP = 0.07
export const STRIP_H = PHOTO_H * 3 + GAP * 4
export const CURTAIN_OPEN = 0.3
const BACK = -1.2
export const BUTTON_AT = [0.62, 0.64, FRONT + 0.08]

function hole(path, { x0, x1, y0, y1 }, r = 0.1) {
  path.moveTo(x0 + r, y0); path.lineTo(x1 - r, y0); path.quadraticCurveTo(x1, y0, x1, y0 + r)
  path.lineTo(x1, y1 - r); path.quadraticCurveTo(x1, y1, x1 - r, y1); path.lineTo(x0 + r, y1)
  path.quadraticCurveTo(x0, y1, x0, y1 - r); path.lineTo(x0, y0 + r); path.quadraticCurveTo(x0, y0, x0 + r, y0)
  return path
}

function canvasPlane(name, cw, ch, w, h, parent, at) {
  const canvas = document.createElement('canvas'); canvas.width = cw; canvas.height = ch
  const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = 4
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false }))
  plane.name = name; plane.position.set(...at); parent.add(plane)
  return { g: canvas.getContext('2d'), map, plane }
}

const spaced = (g, text, cx, y, gap) => {
  const width = [...text].reduce((n, c) => n + g.measureText(c).width + gap, -gap)
  let x = cx - width / 2
  for (const c of text) { g.fillText(c, x, y); x += g.measureText(c).width + gap }
}

export function createBooth(photos) {
  const room = new THREE.Group(); room.name = 'booth-room'
  const blue = mat('#2534c8', 0.74), deep = mat('#101a86', 0.6), ink = mat('#0b1045', 0.8)
  mesh('wall', new THREE.PlaneGeometry(30, 20), mat('#191c24', 0.95), room, [0, 7, -1.6]).castShadow = false
  mesh('floor', new THREE.PlaneGeometry(30, 10), mat('#141735', 0.85), room, [0, 0, 3.4], [1, 1, 1], [-Math.PI / 2, 0, 0]).castShadow = false

  // the cabinet: one thick shell with the doorway and the print window cut through it, so there is a real room to sit in
  mesh('booth-plinth', new RoundedBoxGeometry(W + 0.24, BASE, FRONT + 1.5, 4, 0.05), ink, room, [0, BASE / 2, (FRONT - 1.2) / 2 + 0.05])
  mesh('booth-back', new RoundedBoxGeometry(W, H, 0.12, 4, 0.05), deep, room, [0, BASE + H / 2, BACK])
  const face = new THREE.Shape(); hole(face, { x0: -W / 2, x1: W / 2, y0: BASE, y1: BASE + H }, 0.14)
  face.holes.push(hole(new THREE.Path(), DOOR), hole(new THREE.Path(), SLOT))
  const front = mesh('booth-front', new THREE.ExtrudeGeometry(face, { depth: FRONT - BACK - 0.06, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 4, curveSegments: 10 }), blue, room, [0, 0, BACK + 0.01])
  front.receiveShadow = true

  // inside the doorway: warm light on the back wall, a stool, and a curtain on a rail
  const inner = document.createElement('canvas'); inner.width = 8; inner.height = 256
  const ig = inner.getContext('2d'), ramp = ig.createLinearGradient(0, 0, 0, 256)
  ramp.addColorStop(0, '#1f1109'); ramp.addColorStop(0.68, '#5c3417'); ramp.addColorStop(0.87, '#8a5628'); ramp.addColorStop(1, '#3f2511')
  ig.fillStyle = ramp; ig.fillRect(0, 0, 8, 256)
  const innerMap = new THREE.CanvasTexture(inner); innerMap.colorSpace = THREE.SRGBColorSpace
  const backMat = new THREE.MeshBasicMaterial({ map: innerMap })
  const doorW = DOOR.x1 - DOOR.x0, doorH = DOOR.y1 - DOOR.y0, doorX = (DOOR.x0 + DOOR.x1) / 2, doorY = (DOOR.y0 + DOOR.y1) / 2
  mesh('booth-inside', new THREE.PlaneGeometry(doorW + 0.1, doorH + 0.1), backMat, room, [doorX, doorY, BACK + 0.08]).castShadow = false
  const lining = mesh('booth-lining', new THREE.BoxGeometry(doorW - 0.02, doorH - 0.02, FRONT - BACK - 0.3), new THREE.MeshStandardMaterial({ color: '#7a4a24', roughness: 0.95, side: THREE.BackSide }), room, [doorX, doorY, (FRONT - 0.2 + BACK) / 2])
  lining.castShadow = false
  const stoolMat = mat('#2f79b8', 0.5)
  // set low and well behind his hips, so nothing shows between his legs
  const stoolTop = SEAT[1] - 0.46, stoolZ = SEAT[2] - 0.3
  mesh('stool-seat', new THREE.CylinderGeometry(0.36, 0.36, 0.09, 24), stoolMat, room, [SEAT[0], stoolTop - 0.045, stoolZ])
  mesh('stool-post', new THREE.CylinderGeometry(0.05, 0.05, stoolTop - DOOR.y0, 12), stoolMat, room, [SEAT[0], (stoolTop + DOOR.y0) / 2, stoolZ])
  const rail = mesh('curtain-rail', new THREE.CylinderGeometry(0.03, 0.03, doorW, 12), ink, room, [doorX, DOOR.y1 - 0.08, FRONT - 0.12], [1, 1, 1], [0, 0, Math.PI / 2])
  rail.castShadow = false
  const folds = new THREE.PlaneGeometry(1, 1, 96, 8), fp = folds.attributes.position
  for (let i = 0; i < fp.count; i++) {
    const u = fp.getX(i) + 0.5, v = fp.getY(i) + 0.5
    // velvet: deep folds that open out towards the hem
    fp.setZ(i, (Math.sin(u * Math.PI * 9) * 0.058 + Math.sin(u * Math.PI * 23 + 1) * 0.012) * (0.72 + (1 - v) * 0.42))
  }
  folds.translate(0.5, 0, 0); folds.computeVertexNormals()
  const curtain = mesh('curtain', folds, Object.assign(mat('#1c2596', 0.95), { side: THREE.DoubleSide }), room, [DOOR.x0, (DOOR.y1 - 0.08 + 1.05) / 2, FRONT - 0.13], [doorW * CURTAIN_OPEN, DOOR.y1 - 0.08 - 1.05, 1])
  curtain.userData.width = doorW
  const inside = new THREE.PointLight('#ffc48c', 9, 7, 1.4); inside.position.set(doorX + 0.2, 4.2, 0.72); room.add(inside)
  const spill = pool(room, 3.6, 2.6, 0.34, [doorX + 0.3, 0.03, FRONT + 1.15], true)

  // the print window: a dark cavity, a thin warm strip light, and the strip itself clipped at the print head
  const slotW = SLOT.x1 - SLOT.x0, slotH = SLOT.y1 - SLOT.y0, slotX = (SLOT.x0 + SLOT.x1) / 2, slotY = (SLOT.y0 + SLOT.y1) / 2
  mesh('slot-back', new THREE.PlaneGeometry(slotW + 0.2, slotH + 0.2), new THREE.MeshBasicMaterial({ color: '#070a22' }), room, [slotX, slotY, FRONT - REVEAL + 0.015]).castShadow = false
  const clip = new THREE.Plane(new THREE.Vector3(0, -1, 0), SLOT.y1 - 0.04)
  const strip = new THREE.Group(); strip.position.set(slotX, SLOT.y1 - 0.07, FRONT - 0.3); room.add(strip)
  const paperMat = new THREE.MeshStandardMaterial({ color: '#f4efe3', roughness: 0.75, emissive: '#efe6d4', emissiveIntensity: 0.34, clippingPlanes: [clip] })
  mesh('strip-paper', new RoundedBoxGeometry(PHOTO_W + GAP * 2, STRIP_H, 0.03, 2, 0.012), paperMat, strip, [0, -STRIP_H / 2, 0]).castShadow = false
  const covers = photos.map((src, i) => {
    const y = -GAP - PHOTO_H / 2 - i * (PHOTO_H + GAP)
    const texture = new THREE.TextureLoader().load(src); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 8
    const photo = new THREE.Mesh(new THREE.PlaneGeometry(PHOTO_W, PHOTO_H), new THREE.MeshStandardMaterial({ map: texture, emissive: '#ffffff', emissiveMap: texture, emissiveIntensity: 0.74, roughness: 0.7, clippingPlanes: [clip] }))
    photo.position.set(0, y, 0.018); strip.add(photo)
    // each frame develops out of milky paper
    const cover = new THREE.Mesh(new THREE.PlaneGeometry(PHOTO_W, PHOTO_H), new THREE.MeshBasicMaterial({ color: '#ece7dc', transparent: true, opacity: 1, clippingPlanes: [clip] }))
    cover.position.set(0, y, 0.021); strip.add(cover)
    return cover.material
  })
  const printLight = new THREE.PointLight('#ffd9a8', 1.6, 4, 1.4); printLight.position.set(slotX, SLOT.y1 - 0.3, FRONT - 0.05); room.add(printLight)
  mesh('print-head', new THREE.BoxGeometry(slotW - 0.1, 0.07, 0.3), mat('#05071a', 0.5), room, [slotX, SLOT.y1 - 0.035, FRONT - 0.32]).castShadow = false
  const sheen = new THREE.Mesh(new THREE.PlaneGeometry(slotW, slotH), new THREE.MeshPhysicalMaterial({ color: '#ffffff', transparent: true, opacity: 0.05, roughness: 0.12, metalness: 0, depthWrite: false }))
  sheen.position.set(slotX, slotY, FRONT - 0.1); room.add(sheen)

  // the button, yellow like the mug, in a dark collar
  const collar = mesh('button-collar', new THREE.CylinderGeometry(0.27, 0.29, 0.07, 40), ink, room, [BUTTON_AT[0], BUTTON_AT[1], FRONT + 0.05], [1, 1, 1], [Math.PI / 2, 0, 0])
  collar.castShadow = false
  const buttonMat = mat('#f4bb2a', 0.42, { emissive: '#f4bb2a', emissiveIntensity: 0.3 })
  const button = mesh('button', new THREE.SphereGeometry(0.21, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), buttonMat, room, [BUTTON_AT[0], BUTTON_AT[1], FRONT + 0.06], [1, 0.55, 1], [Math.PI / 2, 0, 0])
  button.castShadow = false
  const buttonGlow = pool(room, 1.1, 1.1, 0.16, [BUTTON_AT[0], BUTTON_AT[1], FRONT + 0.09])

  // status beside the button, in the same voice as the window's "Vibe coding..."
  const status = canvasPlane('status', 400, 80, 1.5, 0.3, room, [BUTTON_AT[0] + 1.08, BUTTON_AT[1], FRONT + 0.075])
  const drawStatus = (text, hop = 0) => {
    const { g, map } = status
    g.clearRect(0, 0, 400, 80); g.fillStyle = 'rgba(255,255,255,.86)'; g.font = '500 50px Manrope, sans-serif'; g.textBaseline = 'middle'
    let x = 0
    ;[...text].forEach((c, i) => {
      g.fillText(c, x, 46 - (hop ? Math.pow(Math.max(0, Math.sin(hop * 4.2 - i * 0.5)), 3) * 12 : 0))
      x += g.measureText(c).width
    })
    map.needsUpdate = true
  }

  // the lightbox on top
  const signY = BASE + H + 0.47, signW = W - 0.5
  mesh('sign-case', new RoundedBoxGeometry(W, 0.94, 1.05, 6, 0.14), blue, room, [0, signY, FRONT - 0.53])
  const signBack = mesh('sign-light', new RoundedBoxGeometry(signW, 0.66, 0.05, 4, 0.02), new THREE.MeshBasicMaterial({ color: '#ffe4b8' }), room, [0, signY, FRONT + 0.01])
  signBack.castShadow = false
  const sign = canvasPlane('sign', 1024, 170, signW - 0.1, (signW - 0.1) * 170 / 1024, room, [0, signY, FRONT + 0.04])
  const drawSign = () => {
    const { g, map } = sign
    g.clearRect(0, 0, 1024, 170); g.fillStyle = '#3a2412'; g.textBaseline = 'middle'
    g.font = '600 76px Manrope, sans-serif'; spaced(g, 'PHOTOS', 512, 66, 32)
    g.globalAlpha = 0.62; g.font = '500 24px Manrope, sans-serif'; spaced(g, '3 POSES · 1 STRIP', 512, 134, 8); g.globalAlpha = 1
    map.needsUpdate = true
  }
  drawSign(); drawStatus('Press')
  const signGlow = pool(room, 7, 3.2, 0.3, [0, signY + 0.1, FRONT + 0.07])
  const signLight = new THREE.PointLight('#ffd9a8', 4, 5, 1.6); signLight.position.set(0, signY - 0.2, FRONT + 0.7); room.add(signLight)

  // the same lamp as the homepage, hung just off the booth's shoulder; its cold counterpart lies on the far side
  const { lampArm, lamp } = createPendant(room, deep, blue, { at: [-2.95, 9.4, 2.5], wall: [11, 10, 0.3, [-2.8, 4, -1.55]], ground: [8, 4, 0.3, [-2.8, 0.025, 2.6]], reach: 6.15, spread: 2.5, power: 26 })
  pool(room, 8, 9, 0.2, [4.2, 3.6, -1.55], false, '0.45, 0.58, 1.0')
  pool(room, 6, 3, 0.14, [3.4, 0.02, 2], true, '0.45, 0.58, 1.0')

  return { room, lampArm, lamp, curtain, inside, spill, strip, covers, button, buttonMat, buttonGlow, drawStatus, drawSign, restY: strip.position.y }
}
