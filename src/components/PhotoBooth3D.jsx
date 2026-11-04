import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { MODEL_URL } from '../three/modelUrl'

// The photo booth in real 3D, lit like the homepage room: press the button, count down, flash, and a strip prints.
const CENTER = [-0.85, 3.85], VIEW_HEIGHT = 8.5
const ROOM_FADE = 'radial-gradient(ellipse 50% 50% at 50% 50%,#000 70%,transparent 100%)'
const BLEED = 1.24
const EJECT = 2.4
const FIGURE_SCALE = 2.3

export default function PhotoBooth3D({ photos }) {
  const stage = useRef(null), box = useRef(null), ref = useRef(null), pressRef = useRef(null), flashRef = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let dead = false, cleanup = () => {}
    Promise.all([import('three'), import('../three/createBooth'), import('three/addons/loaders/GLTFLoader.js'), import('../three/figure')]).then(([THREE, { createBooth, BUTTON_AT, STRIP_H, CURTAIN_OPEN, SEAT }, { GLTFLoader }, { rigFigure, SEATED }]) => {
      if (dead) return
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const canvas = ref.current, wrap = box.current, press = pressRef.current, flash = flashRef.current
      let renderer
      try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }) } catch { setFailed(true); return }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
      renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap
      renderer.localClippingEnabled = true
      const scene = new THREE.Scene()
      const booth = createBooth(photos)
      scene.add(booth.room)
      const dist = VIEW_HEIGHT / 2 / Math.tan(THREE.MathUtils.degToRad(8))
      const camera = new THREE.PerspectiveCamera(16, 1, 1, 100)
      camera.position.set(CENTER[0], CENTER[1] + 0.6, dist); camera.lookAt(CENTER[0], CENTER[1], 0)
      scene.add(new THREE.HemisphereLight('#c4cdf5', '#3a3d60', 0.15))
      const fill = new THREE.SpotLight('#ffe6cc', 0.9, 0, 0.95, 1, 0); fill.position.set(-5, 13, 15); fill.target.position.set(0, 3, 0.6); scene.add(fill, fill.target)
      fill.castShadow = true; fill.shadow.mapSize.set(1024, 1024); fill.shadow.bias = -0.0006; fill.shadow.normalBias = 0.03
      const rim = new THREE.DirectionalLight('#7f9bff', 0.8); rim.position.set(8, 3, 3); scene.add(rim)

      const S = { curtain: 1, flash: 0, printed: 0, down: 0, wave: 0, wag: 0, blink: 0, swing: 1 }
      const stripOff = STRIP_H + 0.1, curtainW = booth.curtain.userData.width
      const look = { x: 0, y: 0, tx: 0, ty: 0 }, swing = { a: 0, v: 0 }, lit = { level: 1, on: true }
      const probe = new THREE.Vector3()
      let blinks = null, busy = true, printing = false, hover = false, visible = true, started = false, lastX = null, statusAt = 0, run
      booth.covers.forEach((m) => { m.opacity = 1 })

      const say = (text) => booth.drawStatus(text)
      // the curtain stays shut until the strip is on its way out, then he is revealed and waves
      const print = (tl) => tl
        .addLabel('print')
        .call(() => { printing = true })
        .fromTo(S, { printed: 0 }, { printed: 1, duration: EJECT, ease: 'power2.inOut' })
        .to(booth.covers, { opacity: 0, duration: 1.8, ease: 'sine.out', stagger: 0.4 }, '>-0.5')
        .call(() => { printing = false; busy = false; say('Press') }, null, '-=1.6')
        .to(S, { curtain: CURTAIN_OPEN, duration: 0.8, ease: 'power2.inOut' }, 'print+=1')
        .to(S, { swing: 0, duration: 0.5 }, 'print+=1')
        .call(() => { if (greeted) wave(); else { opened = true; greet() } }, null, 'print+=1.5')
      // he sits facing the visitor with his hands on his knees, looks towards the pointer, and waves once the curtain is open
      const REST = { LeftArm: [0.2, -0.95, 0.22], LeftForeArm: [-0.08, -0.3, 1], RightArm: [-0.2, -0.95, 0.22], RightForeArm: [0.08, -0.3, 1] }
      const WAVE = { LeftArm: [0.12, -0.5, 0.86], LeftForeArm: [-0.1, 1, 0.2] }
      const gaze = { x: 0, y: 0, tx: 0, ty: 0 }
      let figure = null, waving = null
      const wave = () => {
        if (reduce || !figure || dead) return
        waving?.kill()
        waving = gsap.timeline()
          .to(S, { wave: 1, duration: 0.7, ease: 'power2.out' })
          .to(S, { wag: 1, duration: 0.18, ease: 'sine.inOut' }, 0.45)
          .to(S, { wag: -1, duration: 0.32, ease: 'sine.inOut', repeat: 3, yoyo: true })
          .to(S, { wag: 0, duration: 0.18, ease: 'sine.inOut' })
          .to(S, { wave: 0, duration: 0.8, ease: 'power2.inOut' }, '+=0.05')
      }
      // the first wave waits for both the curtain and the model, whichever comes last
      let greeted = false, opened = false
      const greet = () => {
        if (greeted || !opened || !figure) return
        greeted = true
        wave()
      }
      const mix = (a, b, k) => a.map((n, i) => n + (b[i] - n) * k)
      const posed = new THREE.Quaternion(), turn = new THREE.Euler()
      const poseFigure = (t) => {
        const { point, bones, lids, smileLine, fingers } = figure
        gaze.x += (gaze.tx - gaze.x) * 0.06; gaze.y += (gaze.ty - gaze.y) * 0.06
        const live = reduce ? 0 : 1, w = S.wave
        const kick = Math.sin(t * 3.4) * 0.16 * S.swing
        point('LeftUpLeg', ...SEATED.LeftUpLeg); point('RightUpLeg', ...SEATED.RightUpLeg)
        point('LeftLeg', 0, -1, SEATED.LeftLeg[2] + kick); point('RightLeg', 0, -1, SEATED.RightLeg[2] - kick)
        point('RightArm', ...REST.RightArm); point('RightForeArm', ...REST.RightForeArm); point('RightHand', ...REST.RightForeArm)
        const fore = mix(REST.LeftForeArm, WAVE.LeftForeArm, w); fore[0] += S.wag * 0.08 * w
        point('LeftArm', ...mix(REST.LeftArm, WAVE.LeftArm, w)); point('LeftForeArm', ...fore); point('LeftHand', fore[0] + S.wag * 0.14 * w, fore[1], fore[2])
        lids.forEach(({ lid, lash, h }) => { lid.visible = S.blink > 0.02; lash.visible = S.blink > 0.6; lid.scale.y = h * Math.max(0.05, S.blink) })
        const smile = gsap.parseEase('sine.inOut')(Math.min(1, w * 1.6))
        fingers.morphTargetInfluences[1] = 0.8 * smile; smileLine.material.opacity = smile; smileLine.visible = smile > 0.01
        posed.setFromEuler(turn.set(-0.04 + gaze.y + Math.sin(t * 0.7) * 0.012 * live, gaze.x + Math.sin(t * 0.43) * 0.02 * live, -w * 0.07))
        bones.Head.node.quaternion.copy(posed.multiply(bones.Head.restWorld).premultiply(bones.Head.parentRest.clone().invert()))
      }
      new GLTFLoader().loadAsync(MODEL_URL).then((gltf) => {
        if (dead) return
        figure = rigFigure(gltf)
        const hips = gltf.scene.getObjectByName('mixamorigHips') ?? gltf.scene.getObjectByName('mixamorig:Hips')
        const restY = hips.getWorldPosition(probe).y
        figure.model.scale.setScalar(FIGURE_SCALE)
        figure.model.position.set(SEAT[0], SEAT[1] - restY * FIGURE_SCALE, SEAT[2])
        scene.add(figure.model)
        greet()
        if (!reduce) blinks = gsap.timeline({ repeat: -1, repeatDelay: 3.1, delay: 1 })
          .to(S, { blink: 1, duration: 0.07, ease: 'none' }).to(S, { blink: 0, duration: 0.11, ease: 'none' })
          .to(S, { blink: 1, duration: 0.07, ease: 'none' }, '+=3.4').to(S, { blink: 0, duration: 0.11, ease: 'none' })
      }).catch(() => {})
      const snap = () => {
        if (busy) return
        busy = true
        run?.kill()
        run = gsap.timeline()
          .to(S, { down: 1, duration: 0.08 }).to(S, { down: 0, duration: 0.3, ease: 'back.out(3)' })
          .to(S, { curtain: 1, duration: 0.5, ease: 'power2.inOut' }, 0)
          .to(S, { swing: 1, duration: 0.5 }, 0.2)
          .to(booth.covers, { opacity: 1, duration: 0.25 }, 0)
          .to(S, { printed: 0, duration: 0.3, ease: 'power2.in' }, 0)
        ;['3…', '2…', '1…'].forEach((n, i) => run.call(say, [n], 0.15 + i * 0.65))
        run.call(say, ['Smile!'], 0.15 + 3 * 0.65)
          .to(S, { flash: 1, duration: 0.06 }, 2.1)
          .to(S, { flash: 0, duration: 0.7, ease: 'power2.out' }, 2.48)
          .call(say, ['Printing'], 2.55)
        print(run)
      }
      press.onclick = snap
      press.onpointerenter = () => { if (!busy) hover = true }
      press.onpointerleave = () => { hover = false }

      // same tug as the homepage lamp: it swings, and the light stutters before it settles
      const nearLamp = (x, y, r) => {
        const rect = wrap.getBoundingClientRect()
        booth.lampArm.localToWorld(probe.set(0, -2.75, 0)).project(camera)
        return Math.hypot(rect.left + (probe.x + 1) / 2 * rect.width - x, rect.top + (1 - probe.y) / 2 * rect.height - y) < rect.width * r / BLEED
      }
      // only while the curtain leaves him in view
      const nearHim = (x, y) => {
        if (!figure || S.curtain > 0.6) return false
        const rect = wrap.getBoundingClientRect()
        figure.bones.Head.node.getWorldPosition(probe).setY(probe.y + 0.5).project(camera)
        return Math.hypot(rect.left + (probe.x + 1) / 2 * rect.width - x, rect.top + (1 - probe.y) / 2 * rect.height - y) < rect.width * 0.09 / BLEED
      }
      const onPointer = (e) => {
        look.tx = e.clientX / window.innerWidth - 0.5; look.ty = e.clientY / window.innerHeight - 0.5
        gaze.tx = look.tx * 0.5; gaze.ty = look.ty * 0.22
        const onHim = nearHim(e.clientX, e.clientY)
        const over = nearLamp(e.clientX, e.clientY, 0.08)
        document.body.style.cursor = over || onHim ? 'pointer' : ''
        if (over && lastX !== null) swing.v += THREE.MathUtils.clamp(e.clientX - lastX, -24, 24) * 0.00022
        lastX = e.clientX
      }
      const onClick = (e) => {
        if (e.target.closest?.('a, button')) return
        if (nearHim(e.clientX, e.clientY)) { wave(); return }
        if (!nearLamp(e.clientX, e.clientY, 0.08)) return
        swing.v += 0.012 * (Math.random() < 0.5 ? -1 : 1)
        lit.on = !lit.on
        gsap.killTweensOf(lit, 'level')
        if (lit.on) gsap.timeline().to(lit, { level: 0.75, duration: 0.05 }).to(lit, { level: 0.1, duration: 0.07 }, '+=0.05').to(lit, { level: 1, duration: 0.3, ease: 'power2.out' }, '+=0.09')
        else gsap.timeline().to(lit, { level: 0.25, duration: 0.05 }).to(lit, { level: 0.6, duration: 0.05 }).to(lit, { level: 0, duration: 0.18, ease: 'power2.in' })
      }
      if (!reduce) { window.addEventListener('pointermove', onPointer, { passive: true }); window.addEventListener('click', onClick) }

      let w = 0, h = 0
      const size = () => {
        w = wrap.clientWidth; h = wrap.clientHeight
        renderer.setSize(w, h, false); camera.aspect = w / h; camera.zoom = 1 / BLEED; camera.updateProjectionMatrix()
      }
      // the real button is a transparent one sitting over the 3D button, so it keeps focus and keyboard use
      const placePress = () => {
        probe.set(...BUTTON_AT).project(camera)
        const rect = wrap.getBoundingClientRect(), out = stage.current.getBoundingClientRect()
        press.style.transform = `translate(${rect.left - out.left + (probe.x + 1) / 2 * rect.width}px, ${rect.top - out.top + (1 - probe.y) / 2 * rect.height}px) translate(-50%, -50%)`
      }
      const draw = () => {
        const t = performance.now() / 1000
        if (!reduce) {
          look.x += (look.tx - look.x) * 0.05; look.y += (look.ty - look.y) * 0.05
          camera.position.x = CENTER[0] + look.x * 0.9; camera.position.y = CENTER[1] + 0.6 - look.y * 0.5
          camera.lookAt(CENTER[0], CENTER[1], 0)
          swing.v += (Math.sin(t * 0.6) * 0.012 - swing.a) * 0.012; swing.v *= 0.992; swing.a = THREE.MathUtils.clamp(swing.a + swing.v, -0.3, 0.3)
        }
        booth.lamp(lit.level, swing.a, t)
        if (figure) poseFigure(t)
        const dark = 1 - lit.level
        booth.curtain.scale.x = curtainW * S.curtain
        booth.inside.intensity = 9 + S.flash * 70 + dark * 2
        booth.spill.material.uniforms.k.value = 0.34 + S.flash * 1.1 + dark * 0.1
        rim.intensity = 0.8 + dark * 0.5
        booth.strip.position.y = booth.restY + (1 - S.printed) * stripOff
        const glow = busy ? 0 : (reduce ? 0.6 : 0.5 + Math.sin(t * 2.6) * 0.5) * (hover ? 1.5 : 1)
        booth.buttonMat.emissiveIntensity = 0.48 + glow * 0.45
        booth.buttonGlow.material.uniforms.k.value = 0.1 + glow * 0.22
        booth.button.position.z = BUTTON_AT[2] - 0.02 - S.down * 0.05
        flash.style.opacity = S.flash * 0.85
        if (printing && !reduce && t - statusAt > 0.033) { statusAt = t; booth.drawStatus('Printing', t) }
        placePress()
        renderer.render(scene, camera)
      }
      const tick = () => { if (visible) draw() }
      size(); draw()
      const ro = new ResizeObserver(() => { size(); draw() }); ro.observe(wrap)
      // the first strip prints when the booth comes into view
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting
        if (!visible || started) return
        started = true
        if (reduce) { S.printed = 1; S.curtain = CURTAIN_OPEN; S.swing = 0; booth.covers.forEach((m) => { m.opacity = 0 }); busy = false; return }
        run = gsap.timeline({ delay: 0.5 }); say('Printing'); print(run)
      })
      io.observe(wrap)
      document.fonts?.load('600 76px Manrope').then(() => { if (!dead) { booth.drawSign(); say('Press') } })
      gsap.ticker.add(tick)
      cleanup = () => {
        window.removeEventListener('pointermove', onPointer); window.removeEventListener('click', onClick); document.body.style.cursor = ''
        gsap.ticker.remove(tick); run?.kill(); waving?.kill(); blinks?.kill(); gsap.killTweensOf(lit); ro.disconnect(); io.disconnect()
        press.onclick = press.onpointerenter = press.onpointerleave = null
        scene.traverse((o) => { o.geometry?.dispose(); o.material?.map?.dispose(); o.material?.dispose?.() })
        renderer.dispose()
      }
    }).catch(() => setFailed(true))
    return () => { dead = true; cleanup() }
  }, [photos])

  if (failed) return (
    <div style={{ width: 'min(240px, 70vw)', padding: 10, display: 'flex', flexDirection: 'column', gap: 8, background: '#f4efe3' }}>
      {photos.map((src) => <img key={src} src={src} alt="" style={{ width: '100%', display: 'block' }} />)}
    </div>
  )
  return (
    <div ref={stage} className="ab-stage" style={{ position: 'relative' }}>
      <div ref={flashRef} style={{ position: 'fixed', inset: 0, background: '#fff', opacity: 0, pointerEvents: 'none', zIndex: 300 }} />
      <div ref={box} role="img" aria-label="Finnick sitting inside a blue photo booth under a pendant lamp at night, as it prints a strip of three photos of him"
        style={{ position: 'absolute', left: '50%', top: '50%', width: `${BLEED * 100}%`, height: `${BLEED * 100}%`, transform: 'translate(-50%, -50%)', pointerEvents: 'none', WebkitMaskImage: ROOM_FADE, maskImage: ROOM_FADE }}>
        <canvas ref={ref} style={{ display: 'block', width: '100%', height: '100%' }} />
      </div>
      <button ref={pressRef} className="ab-press" aria-label="Take photos" />
    </div>
  )
}
