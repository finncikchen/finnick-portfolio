import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import fallback from '../assets/images/studio-reference.webp'
import { MODEL_URL } from '../three/modelUrl'

// Homepage opening in real 3D: a room lit by its pendant lamp.
// Finnick works, stops for a sip of coffee, and it rains at the real Seattle hour.
const hash = (n) => { const s = Math.sin(n * 91.7) * 43758.5453; return s - Math.floor(s) }
const seattleTime = () => new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Los_Angeles' })
const CENTER = [0.7, 2.2], VIEW_HEIGHT = 7.4
const FIGURE_SCALE = 4.2, FIGURE_AT = [0, -4.2, -0.45], FIGURE_TURN = 0
const PLANT_AT = [-3.74, 1.05, 0.5]
const TYPE = { RightArm: [-0.2, -0.95, 0.2], RightForeArm: [0.2, -0.1, 1], RightHand: [0.2, -0.1, 1] }
const MUG_HOME = [-1.35, 0, 0.85], MOUTH = [0, 1.47, 0.105], MUG_R = 0.06, MUG_H = 0.126, HANDLE_UP = 0.065, HANDLE_OUT = 0.122
const HOLD = { g: [-0.25, 0, 0.97], u: [0, 1, 0] }, SIP = { g: [0.05, 0.47, 0.88], u: [0.03, 0.88, -0.47] }
const POSES = {
  reach: { RightArm: [-0.6, -0.6, 0.55], RightForeArm: [-0.55, -0.25, 0.8], RightHand: [-0.55, -0.25, 0.8] },
  lift: { RightArm: [-0.12, -0.42, 0.9], RightForeArm: [0.62, 0.78, 0.12], RightHand: [0.7, 0.65, 0.25] },
  wave: { RightArm: [-0.8, -0.2, 0.45], RightForeArm: [-0.22, 1, 0.14] },
}

function drawWindow(g, w, h) {
  const sky = g.createLinearGradient(0, 0, 0, h)
  sky.addColorStop(0, '#10186e'); sky.addColorStop(1, '#2a3ab8')
  g.fillStyle = sky; g.fillRect(0, 0, w, h)
  const u = w / 548
  ;[[60, 370, 120], [215, 300, 110], [340, 340, 95], [440, 240, 108], [330, 480, 218]].forEach(([x, y, tw], t) => {
    g.fillStyle = t % 2 ? '#5468ea' : '#4557d6'; g.fillRect(x * u, y * u, tw * u, h)
    for (let r = 0; r < 12; r++) for (let c = 0; c < 3; c++) {
      g.fillStyle = hash(r * 7 + c + x) > 0.86 ? '#ffd98a' : '#2c3bb0'
      g.fillRect((x + 14 + c * ((tw - 20) / 3)) * u, (y + 18 + r * 34) * u, 13 * u, 20 * u)
    }
  })
  g.fillStyle = '#fff'; g.font = `500 ${52 * u}px Manrope, sans-serif`; g.fillText('Seattle', 30 * u, 74 * u)
  g.fillStyle = 'rgba(255,255,255,.8)'; g.font = `400 ${32 * u}px Manrope, sans-serif`; g.fillText(seattleTime(), 30 * u, 118 * u)
}

// the room falls away into the dark in a soft oval, like the reach of the lamp
const ROOM_FADE = 'radial-gradient(ellipse 50% 50% at 50% 50%,#000 62%,transparent 100%)'
// the canvas is this much larger than the room it shows, so the oval fades out before it reaches the canvas edge
const BLEED = 1.24

export default function Studio3D() {
  const box = useRef(null), ref = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let dead = false, cleanup = () => {}
    Promise.all([import('three'), import('../three/createFinnickModel'), import('three/addons/loaders/GLTFLoader.js'), import('../three/figure')]).then(async ([THREE, { createProps, createRoom }, { GLTFLoader }, { rigFigure, SEATED }]) => {
      const gltf = await new GLTFLoader().loadAsync(MODEL_URL)
      if (dead) return
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const canvas = ref.current, wrap = box.current
      let renderer
      try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }) } catch { setFailed(true); return }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
      renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap
      const scene = new THREE.Scene()
      const { model, bones, lids, smileLine, fingers, point } = rigFigure(gltf)
      model.scale.setScalar(FIGURE_SCALE); model.position.set(...FIGURE_AT); model.rotation.y = FIGURE_TURN
      const { props, mug } = createProps()
      mug.scale.setScalar(0.8)
      props.position.set(0, 0, 0.32); props.scale.setScalar(0.78)
      const { room, refresh, rain, steam, sway, lamp, lampArm, glass } = createRoom(drawWindow)
      scene.add(model, props, mug, room)
      // a live status under the clock, on its own small texture so the bouncing letters don't redraw the whole window
      const status = document.createElement('canvas'); status.width = 600; status.height = 80
      const statusMap = new THREE.CanvasTexture(status); statusMap.colorSpace = THREE.SRGBColorSpace
      const statusMesh = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.4), new THREE.MeshBasicMaterial({ map: statusMap, transparent: true, depthWrite: false }))
      statusMesh.position.set(-0.94, 1.87, 0.02); statusMesh.castShadow = false; glass.add(statusMesh)
      const STATUS = 'Vibe coding...'
      let statusAt = 0
      const drawStatus = (t = 0) => {
        const g = status.getContext('2d'); g.clearRect(0, 0, 600, 80)
        g.fillStyle = 'rgba(255,255,255,.8)'; g.font = '400 50px Manrope, sans-serif'; g.textBaseline = 'middle'
        // a ripple runs through the letters, each one hopping as it passes
        ;[...STATUS].forEach((c, i) => {
          const hop = reduce ? 0 : Math.pow(Math.max(0, Math.sin(t * 4.2 - i * 0.5)), 3) * 13
          g.fillText(c, g.measureText(STATUS.slice(0, i)).width, 46 - hop)
        })
        statusMap.needsUpdate = true
      }
      drawStatus()
      const dist = VIEW_HEIGHT / 2 / Math.tan(THREE.MathUtils.degToRad(8))
      const camera = new THREE.PerspectiveCamera(16, 3 / 2, 1, 100)
      camera.position.set(CENTER[0], CENTER[1] + 0.6, dist); camera.lookAt(CENTER[0], CENTER[1], 0)
      scene.add(new THREE.HemisphereLight('#c4cdf5', '#3a3d60', 0.15))
      // the pendant lamp is the room's light; this soft wash only keeps the figure readable and gives him a shadow
      const fill = new THREE.SpotLight('#ffe6cc', 0.9, 0, 0.95, 1, 0); fill.position.set(-4, 11, 13); fill.target.position.set(-0.6, 0, 0.3); scene.add(fill, fill.target)
      fill.castShadow = true; fill.shadow.mapSize.set(1024, 1024); fill.shadow.bias = -0.0006; fill.shadow.normalBias = 0.03
      // cold window light along his far side, and the screen's glow on his face
      const rim = new THREE.DirectionalLight('#7f9bff', 0.7); rim.position.set(8, 3, 2); scene.add(rim)
      const screen = new THREE.PointLight('#d5e0ff', 2.2, 5, 1.4); screen.position.set(0, 1.5, 0.75); scene.add(screen)
      // the arm leaves the screen's glow when it lifts: this keeps its skin matching his face, and its short reach stops short of the wall
      const armGlow = new THREE.PointLight('#ffe2c8', 0, 2.2, 1); scene.add(armGlow)

      let visible = true, lastExit = 0
      const P = { blink: 0, wave: 0, wag: 0, reach: 0, lift: 0, carry: 0, tilt: 0, look: 0, steam: 1 }
      const hand = new THREE.Vector3(), grip = new THREE.Vector3(), dir = new THREE.Vector3(), from = new THREE.Vector3(), to = new THREE.Vector3(), q = new THREE.Quaternion(), q2 = new THREE.Quaternion()
      const mix = (a, b, k) => a.map((n, i) => n + (b[i] - n) * k)
      Object.entries(SEATED).forEach(([n, d]) => point(n, ...d))
      // hand and mug are one rigid body: the hand is placed by fingers + thumb directions and the arm is solved to reach it
      const V = (a) => new THREE.Vector3(...a)
      const shoulder = bones.RightArm.restPos, L1 = shoulder.distanceTo(bones.RightForeArm.restPos), L2 = bones.RightForeArm.restPos.distanceTo(bones.RightHand.restPos)
      const POLE = V([-0.75, -0.65, -0.1])
      const basis = (g, u, out = new THREE.Quaternion()) => {
        const x = g.clone().normalize(), z = new THREE.Vector3().crossVectors(x, u).normalize(), y = new THREE.Vector3().crossVectors(z, x)
        return out.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z))
      }
      const handRest = bones.RightHand, thumbRest = V([0, 0, 1]), restBasis = basis(handRest.restDir, thumbRest).invert()
      const POLE_UP = V([-0.45, -0.9, 0.05])
      const placeArm = (wrist, g, u, lift = 0) => {
        const pole = POLE.clone().lerp(POLE_UP, lift)
        const d = wrist.clone().sub(shoulder), len = Math.min(d.length(), L1 + L2 - 1e-3); d.normalize()
        const along = (L1 * L1 - L2 * L2 + len * len) / (2 * len), up = Math.sqrt(Math.max(0, L1 * L1 - along * along))
        const elbow = shoulder.clone().addScaledVector(d, along).addScaledVector(pole.addScaledVector(d, -pole.dot(d)).normalize(), up)
        return { arm: elbow.clone().sub(shoulder).normalize(), fore: wrist.clone().sub(elbow).normalize(), g, u }
      }
      const applyArm = ({ arm, fore, g, u }) => {
        // the forearm carries the twist so the wrist only ever bends
        const twisted = thumbRest.clone().applyQuaternion(q2.setFromUnitVectors(bones.RightForeArm.restDir, fore))
        const a1 = twisted.addScaledVector(fore, -twisted.dot(fore)).normalize(), a2 = u.clone().addScaledVector(fore, -u.dot(fore)).normalize()
        const roll = Math.atan2(new THREE.Vector3().crossVectors(a1, a2).dot(fore), a1.dot(a2))
        point('RightArm', arm.x, arm.y, arm.z, roll * 0.62)
        point('RightForeArm', fore.x, fore.y, fore.z, roll * 0.86)
        const world = basis(g, u).multiply(restBasis).multiply(handRest.restWorld)
        handRest.world.copy(world)
        handRest.node.quaternion.copy(world.clone().premultiply(bones.RightForeArm.world.clone().invert()))
      }
      const palmSide = (g, u) => new THREE.Vector3().crossVectors(u, g).normalize()
      // wrist position for a mug held by its handle: fingers through the loop, body of the mug beyond the palm
      const wristFor = (base, g, u) => base.clone().addScaledVector(u, HANDLE_UP).addScaledVector(palmSide(g, u), -HANDLE_OUT).addScaledVector(g.clone().normalize(), -0.062)
      const type = { g: V(TYPE.RightHand).normalize(), u: V([1, 0, 0]) }
      const typeWrist = shoulder.clone().addScaledVector(V(TYPE.RightArm).normalize(), L1).addScaledVector(V(TYPE.RightForeArm).normalize(), L2)
      const home = { g: V(HOLD.g).normalize(), u: V(HOLD.u).normalize() }, lips = { g: V(SIP.g).normalize(), u: V(SIP.u).normalize() }
      const homeBase = V(MUG_HOME).sub(model.position).multiplyScalar(1 / FIGURE_SCALE)
      const lipsBase = V(MOUTH).addScaledVector(lips.u, -MUG_H).addScaledVector(lips.g, MUG_R)
      const carry = new THREE.CatmullRomCurve3([homeBase, homeBase.clone().add(V([0.03, 0.09, 0])), lipsBase.clone().add(V([-0.08, -0.1, 0])), lipsBase], false, 'centripetal')
      const waveArm = V(POSES.wave.RightArm).normalize(), waveFore = V(POSES.wave.RightForeArm).normalize()
      const base = new THREE.Vector3(), mugBasis = new THREE.Matrix4()
      // he glances towards the visitor's pointer
      const gaze = { x: 0, y: 0, tx: 0, ty: 0 }
      // a pointer passing through the plant pushes the leaves the way it was moving; they spring back on their own
      const plantAt = new THREE.Vector3(), brush = { x: 0, v: 0, lastX: null }
      const look = { x: 0, y: 0, tx: 0, ty: 0 }, swing = { a: 0, v: 0 }, lit = { level: 1, on: true }
      const probe = new THREE.Vector3(), probe2 = new THREE.Vector3()
      let lastX = null, wave, sip, greet = false, drink = false
      const onPointer = (e) => {
        gaze.tx = (e.clientX / window.innerWidth - 0.5) * 0.5; gaze.ty = (e.clientY / window.innerHeight - 0.5) * 0.22
        const box = wrap.getBoundingClientRect()
        plantAt.set(...PLANT_AT).project(camera)
        const px = box.left + (plantAt.x + 1) / 2 * box.width, py = box.top + (1 - plantAt.y) / 2 * box.height
        const near = Math.hypot(e.clientX - px, e.clientY - py) < box.width * 0.085 / BLEED
        if (near && brush.lastX !== null) brush.v += THREE.MathUtils.clamp(e.clientX - brush.lastX, -24, 24) * 0.0016
        brush.lastX = e.clientX
        // the view leans a little with the pointer, so the room has depth
        look.tx = e.clientX / window.innerWidth - 0.5; look.ty = e.clientY / window.innerHeight - 0.5
        const inside = e.clientX > box.left && e.clientX < box.right && e.clientY > box.top && e.clientY < box.bottom
        const hit = inside ? hitAt(e.clientX, e.clientY, box) : null
        document.body.dataset.sceneHot = hit ? '1' : ''
        if (hit === 'lamp' && lastX !== null) swing.v += THREE.MathUtils.clamp(e.clientX - lastX, -24, 24) * 0.00022
        lastX = e.clientX
      }
      // what the pointer is over, measured in screen space from where each thing is right now
      const onScreen = (v, box) => { const p = v.project(camera); return [box.left + (p.x + 1) / 2 * box.width, box.top + (1 - p.y) / 2 * box.height] }
      const near = (obj, y, r, x0, y0, box) => { const [x, yy] = onScreen(obj.getWorldPosition(probe).add(probe2.set(0, y, 0)), box); return Math.hypot(x - x0, yy - y0) < box.width * r / BLEED }
      const hitAt = (x, y, box) => {
        if (near(lampArm, -2.75, 0.07, x, y, box)) return 'lamp'
        if (near(mug, 0.3, 0.05, x, y, box)) return 'mug'
        if (near(bones.Head.node, 0.5, 0.075, x, y, box)) return 'him'
        return null
      }
      const onClick = (e) => {
        if (e.target.closest?.('a, button')) return
        const box = wrap.getBoundingClientRect()
        if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) return
        const hit = hitAt(e.clientX, e.clientY, box)
        if (hit === 'lamp') pull()
        else if (hit === 'him' && !wave.isActive()) greet = true   // mid-sip he finishes first
        else if (hit === 'mug') drink = true
      }
      // a tug on the lamp: it swings, and the light stutters before it settles
      const pull = () => {
        swing.v += 0.012 * (Math.random() < 0.5 ? -1 : 1)
        lit.on = !lit.on
        gsap.killTweensOf(lit, 'level')
        if (lit.on) gsap.timeline().to(lit, { level: 0.75, duration: 0.05 }).to(lit, { level: 0.1, duration: 0.07 }, '+=0.05').to(lit, { level: 1, duration: 0.3, ease: 'power2.out' }, '+=0.09')
        else gsap.timeline().to(lit, { level: 0.25, duration: 0.05 }).to(lit, { level: 0.6, duration: 0.05 }).to(lit, { level: 0, duration: 0.18, ease: 'power2.in' })
      }
      if (!reduce) { window.addEventListener('pointermove', onPointer, { passive: true }); window.addEventListener('click', onClick) }
      const pose = (t = 0) => {
        gaze.x += (gaze.tx - gaze.x) * 0.06; gaze.y += (gaze.ty - gaze.y) * 0.06
        const calm = 1 - Math.max(P.look, P.tilt)
        lids.forEach(({ lid, lash, h }) => { lid.visible = P.blink > 0.02; lash.visible = P.blink > 0.6; lid.scale.y = h * Math.max(0.05, P.blink) })
        const sway = reduce ? 0 : 1, away = 1 - Math.min(1, P.wave * 4)
        const tap = Math.sin(t * 9) * Math.sin(t * 2.3) * 0.05 * sway
        carry.getPoint(P.lift, base)
        const heldG = home.g.clone().lerp(lips.g, P.lift).normalize(), heldU = home.u.clone().lerp(lips.u, P.tilt * 0.65 + P.lift * 0.35).normalize()
        const g = type.g.clone().lerp(heldG, P.reach).normalize(), u = type.u.clone().lerp(heldU, P.reach).normalize()
        const wrist = typeWrist.clone().lerp(wristFor(base, heldG, heldU), P.reach)
        wrist.y += tap * 0.02 * (1 - P.reach)
        const solved = placeArm(wrist, g, u, P.lift * P.reach)
        if (P.wave > 0.001) {
          const wag = P.wag * P.wave
          solved.arm.lerp(waveArm, P.wave).normalize()
          solved.fore.lerp(waveFore, P.wave).normalize(); solved.fore.x += wag * 0.1; solved.fore.normalize()
          solved.g = g.lerp(solved.fore.clone().setX(solved.fore.x + wag * 0.16), P.wave).normalize()
          solved.u = u.lerp(V([1, 0, 0]), P.wave).normalize()
        }
        applyArm(solved)
        bones.RightForeArm.node.getWorldPosition(armGlow.position); armGlow.position.z += 1.2; armGlow.position.y += 0.25
        armGlow.intensity = 1.5 * Math.min(1, P.wave * 2.5)
        const smile = gsap.parseEase('sine.inOut')(Math.min(1, P.wave * 1.6))
        fingers.morphTargetInfluences[1] = 0.8 * smile; smileLine.material.opacity = smile; smileLine.visible = smile > 0.01
        fingers.morphTargetInfluences[0] = Math.min(1, Math.max(0, (P.reach - 0.55) / 0.4)) * 0.82 * (1 - P.wave)
        point('LeftForeArm', SEATED.LeftForeArm[0], SEATED.LeftForeArm[1] - tap * away, SEATED.LeftForeArm[2])
        q.setFromEuler(new THREE.Euler(-0.1 + gaze.y * calm - P.tilt * 0.3 + P.look * 0.1 + Math.sin(t * 0.7) * 0.012 * sway, -P.look * 0.3 + gaze.x * calm + Math.sin(t * 0.43) * 0.02 * sway, P.wave * 0.07))
        bones.Head.node.quaternion.copy(q.multiply(bones.Head.restWorld).premultiply(bones.Head.parentRest.clone().invert()))
        const n = palmSide(heldG, heldU).negate(), z = new THREE.Vector3().crossVectors(n, heldU).normalize()
        mug.quaternion.setFromRotationMatrix(mugBasis.makeBasis(n, new THREE.Vector3().crossVectors(z, n), z))
        mug.position.copy(base).multiplyScalar(FIGURE_SCALE).add(model.position)
      }
      const ctx = gsap.context(() => {
        if (reduce) return
        const ease = 'sine.inOut'
        gsap.timeline({ repeat: -1, repeatDelay: 3.1, delay: 1.2 })
          .to(P, { blink: 1, duration: 0.07, ease: 'none' }).to(P, { blink: 0, duration: 0.11, ease: 'none' })
          .to(P, { blink: 1, duration: 0.07, ease: 'none' }, '+=3.4').to(P, { blink: 0, duration: 0.11, ease: 'none' })
          .to(P, { blink: 1, duration: 0.07, ease: 'none' }, '+=0.12').to(P, { blink: 0, duration: 0.11, ease: 'none' })
        // once per load, as the lights finish coming up: a wave at the visitor
        wave = gsap.timeline({ delay: 1.5, onComplete: () => sip.resume() })
          .to(P, { wave: 1, duration: 0.85, ease: 'power2.out' })
          .to(P, { wag: 1, duration: 0.2, ease }, 0.55)
          .to(P, { wag: -1, duration: 0.36, ease, repeat: 3, yoyo: true })
          .to(P, { wag: 0, duration: 0.2, ease })
          .to(P, { wave: 0, duration: 0.95, ease: 'power2.inOut' }, '+=0.05')
        sip = gsap.timeline({ repeat: -1, repeatDelay: 6, delay: 8.5 })
          .to(P, { look: 1, duration: 0.7, ease })
          .to(P, { reach: 1, duration: 1.05, ease: 'power2.inOut' }, 0.12)
          .to(P, { steam: 0, duration: 0.5, ease }, 0.8)
          .set(P, { carry: 1 }, '>0.02')
          .to(P, { lift: 1, duration: 1.55, ease: 'power2.inOut' }, '+=0.12')
          .to(P, { look: 0, duration: 0.9, ease }, '<0.3')
          .to(P, { tilt: 1, duration: 0.8, ease }, '<0.45')
          .to({}, { duration: 1.1 })
          .to(P, { tilt: 0, duration: 0.65, ease })
          .to(P, { lift: 0, duration: 1.45, ease: 'power2.inOut' }, '<0.1')
          .to(P, { look: 0.7, duration: 0.8, ease }, '<0.2')
          .set(P, { carry: 0 }, '>0.08')
          .to(P, { reach: 0, duration: 1.1, ease: 'power2.inOut' }, '+=0.06')
          .to(P, { steam: 1, duration: 0.8, ease }, '<')
          .to(P, { look: 0, duration: 0.8, ease }, '<')
      }, wrap)

      let w = 0, h = 0
      const size = () => {
        w = wrap.clientWidth; h = wrap.clientHeight
        renderer.setSize(w, h, false); camera.aspect = w / h; camera.zoom = 1 / BLEED; camera.updateProjectionMatrix()
      }
      const draw = () => {
        const t = performance.now() / 1000
        const exit = parseFloat(wrap.style.getPropertyValue('--exit')) || 0, level = lit.level * (1 - exit * 0.85)
        if (exit !== lastExit) { lastExit = exit; camera.zoom = (1 + exit * 0.55) / BLEED; camera.updateProjectionMatrix() }
        if (!reduce) {
          look.x += (look.tx - look.x) * 0.05; look.y += (look.ty - look.y) * 0.05
          camera.position.x = CENTER[0] + look.x * 0.9; camera.position.y = CENTER[1] + 0.6 - look.y * 0.5
          camera.lookAt(CENTER[0] * (1 - exit), CENTER[1] + exit * 0.5, 0)
          swing.v += (Math.sin(t * 0.6) * 0.012 - swing.a) * 0.012; swing.v *= 0.992; swing.a = THREE.MathUtils.clamp(swing.a + swing.v, -0.3, 0.3)
        }
        if (greet && P.reach < 0.02) { greet = false; sip.pause(); wave.restart() }
        else if (drink && P.reach < 0.02 && !wave.isActive()) { drink = false; sip.restart() }
        if (!reduce && t - statusAt > 0.033) { statusAt = t; drawStatus(t) }
        lamp(level, swing.a, t)
        // with the lamp out the screen and the city take over the room
        screen.intensity = 2.2 + (1 - level) * 1.8; rim.intensity = 0.7 + (1 - level) * 0.5
        glass.material.emissiveIntensity = 0.24 + (1 - level) * 0.1
        pose(t); rain(t); if (!reduce) {
          brush.v += -brush.x * 0.035; brush.v *= 0.93; brush.x = THREE.MathUtils.clamp(brush.x + brush.v, -0.16, 0.16)
          sway(t, brush.x)
        }
        steam(t, mug.position.x, 0.68, mug.position.z, P.steam * (1 - Math.min(1, P.wave * 3)))
        renderer.render(scene, camera)
      }
      const tick = () => { if (visible) draw() }
      size(); pose()
      const ro = new ResizeObserver(() => { size(); draw() }); ro.observe(wrap)
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }); io.observe(wrap)
      const clock = setInterval(refresh, 15000)
      document.fonts?.ready.then(() => { if (!dead) { refresh(); drawStatus() } })
      gsap.ticker.add(tick)
      cleanup = () => {
        window.removeEventListener('pointermove', onPointer); window.removeEventListener('click', onClick); delete document.body.dataset.sceneHot; gsap.ticker.remove(tick); ctx.revert(); ro.disconnect(); io.disconnect(); clearInterval(clock)
        scene.traverse((o) => { o.geometry?.dispose(); o.material?.map?.dispose(); o.material?.dispose?.() })
        renderer.dispose()
      }
    }).catch(() => setFailed(true))
    return () => { dead = true; cleanup() }
  }, [])

  return (
    <div ref={box} className="home-hero studio-scene" role="img" aria-label="Finnick working at a laptop and sipping coffee at night while it rains over Seattle"
      style={{ position: 'absolute', left: '50%', top: `calc(clamp(84px, 11vh, 110px) - min(96vw, 84vh) * ${(BLEED - 1) / 3})`, width: `calc(min(96vw, 84vh) * ${BLEED})`, aspectRatio: '3 / 2', transform: 'translateX(-50%)', pointerEvents: 'none', WebkitMaskImage: ROOM_FADE, maskImage: ROOM_FADE }}>
      {failed ? <img src={fallback} alt="" style={{ width: '100%', display: 'block' }} /> : <canvas ref={ref} style={{ display: 'block', width: '100%', height: '100%' }} />}
    </div>
  )
}
