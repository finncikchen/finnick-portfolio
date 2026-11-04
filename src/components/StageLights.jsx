import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Homepage opening: two follow-spots in a hazy house. They swing in from the wings, cross once and
// land on the room, then trail the cursor like a hand-worked lamp. Rigged at the top of the room, they never leave it.
const KEY = [1, 0.945, 0.86]        // warm white
const GEL = [0.56, 0.71, 1]         // cold blue
const IDLE_AFTER = 2.5              // seconds without input before the lamps return home

const VERT = `attribute vec2 a; void main() { gl_Position = vec4(a, 0.0, 1.0); }`

const FRAG = `precision highp float;
uniform vec2 uRes;
uniform float uScale, uTime, uHaze;
uniform vec3 uKeyColor, uGelColor;
uniform vec4 uKey, uGel;     // apex.xy, land.xy in CSS px
uniform float uPool, uOn;    // pool half-width, overall level
uniform vec4 uRoom;          // left, top, right, bottom of the room in CSS px: no light falls outside it

float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float smoke(vec2 p) {
  return noise(p) * 0.55 + noise(p * 2.1 + 7.3) * 0.3 + noise(p * 4.3 + 13.1) * 0.15;
}

// x: light in the air, y: pool where it lands, z: the lamp
vec3 lamp(vec2 p, vec4 g) {
  vec2 axis = g.zw - g.xy;
  float len = max(length(axis), 1.0);
  vec2 dir = axis / len;
  vec2 v = p - g.xy;
  float along = dot(v, dir);
  float across = abs(dot(v, vec2(-dir.y, dir.x)));
  float radius = 4.0 + max(along, 0.0) * uPool / len;
  float u = across / radius;
  float body = sqrt(max(1.0 - u * u, 0.0)) * smoothstep(1.0, 0.5, u) * smoothstep(0.0, 24.0, along);
  float fade = 1.0 / (1.0 + along / (0.2 * len));
  float stop = 1.0 - smoothstep(len - 0.1 * uPool, len + 0.5 * uPool, along);
  vec2 e = (p - g.zw) / (vec2(1.0 + 0.45 * abs(dir.x), 0.32) * uPool);
  float q = length(e);
  float pool = smoothstep(1.0, 0.1, q) * (0.5 + 0.5 * exp(-q * q * 2.0)) + 0.07 * exp(-q * q * 0.5);
  float d = length(v);
  return vec3(body * fade * stop, pool, 0.55 / (1.0 + d * d / 150.0));
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uScale;
  vec3 k = lamp(p, uKey), g = lamp(p, uGel);
  float air = 1.0;
  if (k.x + g.x > 0.001) {
    float n = smoke(p / 210.0 + vec2(uTime * 0.012, -uTime * 0.018) + noise(vec2(uTime * 0.04)) * 0.6);
    air = mix(1.0, 0.5 + 0.9 * smoothstep(0.25, 0.72, n), uHaze);
  }
  vec3 light = pow(uKeyColor, vec3(2.2)) * (k.x * air * 0.09 + k.y * 0.012 + k.z)
             + pow(uGelColor, vec3(2.2)) * (g.x * air * 0.09 + g.y * 0.012 + g.z);
  light *= smoothstep(uRoom.x, uRoom.x + 50.0, p.x) * (1.0 - smoothstep(uRoom.z - 50.0, uRoom.z, p.x))
         * smoothstep(uRoom.y, uRoom.y + 14.0, p.y) * (1.0 - smoothstep(uRoom.w - 70.0, uRoom.w, p.y));
  vec3 col = pow(1.0 - exp(-light * uOn * 1.15), vec3(1.0 / 2.2));
  col += (fract(52.9829 * fract(dot(gl_FragCoord.xy, vec2(0.0671, 0.0058)))) - 0.5) / 255.0;
  col = clamp(col, 0.0, 1.0);
  gl_FragColor = vec4(col, max(col.r, max(col.g, col.b)));   // premultiplied, so light only ever adds
}`

const clamp = gsap.utils.clamp

export default function StageLights({ titleSelector, revealSelector, level }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false })
    if (!gl) return
    const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s }
    const program = gl.createProgram()
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.bindAttribLocation(program, 0, 'a')
    gl.linkProgram(program)
    gl.useProgram(program)
    gl.vertexAttribPointer(gl.getAttribLocation(program, 'a'), 2, gl.FLOAT, false, 0, 0)
    const U = Object.fromEntries(['uRes', 'uScale', 'uTime', 'uHaze', 'uKeyColor', 'uGelColor', 'uKey', 'uGel', 'uPool', 'uOn', 'uRoom'].map((n) => [n, gl.getUniformLocation(program, n)]))
    gl.uniform3fv(U.uKeyColor, KEY)
    gl.uniform3fv(U.uGelColor, GEL)
    gl.uniform1f(U.uHaze, 0.8)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const stage = canvas.parentElement
    const title = document.querySelector(titleSelector)
    const S = { kx: 0, ky: 0, gx: 0, gy: 0, on: 0, wide: 1.3, sway: 0 }
    const geo = { w: 0, h: 0, top: 0, fk: 0, fg: 0, pool: 300, kx: 0, ky: 0, gx: 0, gy: 0, setX: 0, setY: 0 }
    const reveal = stage.querySelector(revealSelector)
    let letters = [], clock = 14, visible = true, lost = false, aim = null, entering = !reduce
    let toKX, toKY, toGX, toGY

    // the soft light can be drawn below device resolution, which keeps the shader cheap
    const measure = () => {
      const box = stage.getBoundingClientRect()
      const scale = fine ? 1 : 0.75
      geo.w = box.width; geo.h = box.height
      canvas.width = Math.round(geo.w * scale); canvas.height = Math.round(geo.h * scale)
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(U.uRes, canvas.width, canvas.height)
      gl.uniform1f(U.uScale, scale)
      // aim at the words themselves: the heading box is wider than its text
      const spot = (name) => {
        const b = stage.querySelector(`[data-spot="${name}"]`).getBoundingClientRect()
        return [b.left - box.left + b.width / 2, b.top - box.top + b.height / 2]
      }
      ;[geo.kx, geo.ky] = spot('key')
      ;[geo.gx, geo.gy] = spot('gel')
      const set = stage.querySelector(revealSelector).getBoundingClientRect()
      geo.setX = set.left - box.left; geo.setY = set.top - box.top; geo.setW = set.width; geo.setH = set.height
      gl.uniform4f(U.uRoom, geo.setX, geo.setY, geo.setX + set.width, geo.setY + set.height)
      geo.top = geo.setY; geo.fk = geo.setX + set.width * 0.3; geo.fg = geo.setX + set.width * 0.7
      geo.pool = set.width * 0.42
      letters = [...title.querySelectorAll('.home-title-char')]
    }

    const home = () => {
      if (toKX) { toKX(geo.kx); toKY(geo.ky); toGX(geo.gx); toGY(geo.gy) }
      gsap.to(S, { sway: 1, duration: 1.6, ease: 'sine.inOut', overwrite: 'auto' })
    }
    const idle = gsap.delayedCall(IDLE_AFTER, home).pause()

    const render = () => {
      if (lost) return
      const on = S.on * level.current
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      const halfW = geo.pool * 0.5 * S.wide
      const place = (x, y, fx, phase) => {
        const dist = Math.hypot(x - fx, y - geo.top)
        return [x + S.sway * dist * 0.03 * Math.sin(clock * 0.55 + phase), y]
      }
      const [kx, ky] = place(S.kx, S.ky, geo.fk, 0)
      const [gx, gy] = place(S.gx, S.gy, geo.fg, 1.9)
      gl.uniform1f(U.uTime, clock)
      gl.uniform1f(U.uPool, halfW)
      gl.uniform1f(U.uOn, on)
      gl.uniform4f(U.uKey, geo.fk, geo.top, kx, ky)
      gl.uniform4f(U.uGel, geo.fg, geo.top, gx, gy)
      if (on > 0.002) gl.drawArrays(gl.TRIANGLES, 0, 3)
      // only what the beams fall on can be seen
      reveal.style.setProperty('--r', `${(halfW * 1.45 * Math.min(1, on * 1.4)).toFixed(0)}px`)
      reveal.style.setProperty('--kx', `${(kx - geo.setX).toFixed(0)}px`)
      reveal.style.setProperty('--ky', `${(ky - geo.setY).toFixed(0)}px`)
      reveal.style.setProperty('--gx', `${(gx - geo.setX).toFixed(0)}px`)
      reveal.style.setProperty('--gy', `${(gy - geo.setY).toFixed(0)}px`)
    }

    const tick = (_, delta) => {
      if (!visible || lost) return
      clock = (clock + Math.min(delta, 50) / 1000) % 1000
      // the headline splits once its font is in, and again on resize
      if (title.querySelector('.home-title-char') && !letters[0]?.isConnected) measure()
      render()
    }

    const land = () => {
      entering = false
      toKX = gsap.quickTo(S, 'kx', { duration: 0.85, ease: 'back.out(1.5)' })
      toKY = gsap.quickTo(S, 'ky', { duration: 0.85, ease: 'back.out(1.5)' })
      toGX = gsap.quickTo(S, 'gx', { duration: 1.3, ease: 'back.out(1.8)' })
      toGY = gsap.quickTo(S, 'gy', { duration: 1.3, ease: 'back.out(1.8)' })
      if (aim && fine) aimAt(aim.x, aim.y)
      else home()
    }

    const aimAt = (x, y) => {
      const off = geo.pool * 0.06
      const xx = clamp(geo.setX + geo.setW * 0.14, geo.setX + geo.setW * 0.86, x)
      const yy = clamp(geo.setY + geo.setH * 0.2, geo.setY + geo.setH * 0.8, y)
      toKX(xx - off); toKY(yy); toGX(xx + off); toGY(yy)
    }

    const onMove = (e) => {
      const box = stage.getBoundingClientRect()
      const x = e.clientX - box.left, y = e.clientY - box.top
      if (y < 0 || y > box.height) return
      aim = { x, y }
      if (entering) return
      if (S.sway) gsap.to(S, { sway: 0, duration: 0.6, ease: 'power2.out', overwrite: 'auto' })
      aimAt(x, y)
      idle.restart(true)
    }

    const ctx = gsap.context(() => {
      measure()
      if (reduce) {
        Object.assign(S, { kx: geo.kx, ky: geo.ky, gx: geo.gx, gy: geo.gy, on: 1, wide: 1 })
        return
      }
      const cross = geo.setW * 0.16
      Object.assign(S, { kx: geo.setX, gx: geo.setX + geo.setW, ky: geo.setY + geo.setH * 0.25, gy: geo.setY + geo.setH * 0.25 })
      gsap.timeline({ onComplete: land })
        .to(S, { on: 1, duration: 0.5, ease: 'power2.out' }, 0)
        .to(S, { kx: geo.kx + cross, gx: geo.gx - cross, ky: geo.ky - geo.h * 0.05, gy: geo.gy - geo.h * 0.05, duration: 1, ease: 'expo.inOut' }, 0)
        .to(S, { kx: geo.kx, gx: geo.gx, ky: geo.ky, gy: geo.gy, duration: 0.7, ease: 'expo.inOut' }, 1)
        .to(S, { wide: 1, duration: 1.2, ease: 'power2.inOut' }, 0.5)
    })

    const onResize = () => {
      measure()
      if (reduce) { S.kx = geo.kx; S.gx = geo.gx; S.ky = geo.ky; S.gy = geo.gy; render() }
      else if (!entering && !aim) home()
    }
    const onLost = (e) => { e.preventDefault(); lost = true; canvas.style.display = 'none' }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(stage)
    window.addEventListener('resize', onResize)
    canvas.addEventListener('webglcontextlost', onLost)
    if (fine && !reduce) window.addEventListener('pointermove', onMove, { passive: true })
    if (reduce) render(); else gsap.ticker.add(tick)
    document.fonts?.ready.then(() => { if (canvas.isConnected) { measure(); if (reduce) render() } })

    return () => {
      gsap.ticker.remove(tick)
      idle.kill(); ctx.revert()
      gsap.killTweensOf(S)
      io.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('webglcontextlost', onLost)
      letters.forEach((el) => { el.style.color = '' })
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
}
