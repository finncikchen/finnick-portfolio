// Lightweight, cookie-free analytics. Sends page views, visible time, scroll depth and clicks
// to /api/track. Visitors get a random id in localStorage; nothing personal is collected.
// Disabled on localhost and for the site owner (set when /admin is opened).

const store = (s, k, make) => {
  try { let v = s.getItem(k); if (!v) { v = make(); s.setItem(k, v) } return v } catch { return make() }
}
const rid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
const optedOut = () => { try { return localStorage.getItem('fc_no_track') === '1' } catch { return false } }
const enabled = () => typeof window !== 'undefined' && !/^(localhost|127\.0\.0\.1)$/.test(location.hostname) && !optedOut()

let vid, sid, queue = [], page = null

function send(force) {
  if (optedOut()) { queue = []; return }
  if (!queue.length) return
  const body = JSON.stringify({ events: queue.splice(0) })
  if (force && navigator.sendBeacon) navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }))
  else fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {})
}
const push = (type, extra) => { if (optedOut()) { queue = []; return } queue.push({ vid, sid, type, path: page?.path || location.pathname, ...extra }) }

function closePage() {
  if (!page) return
  if (page.visibleSince) page.visible += Date.now() - page.visibleSince
  const secs = Math.round(page.visible / 1000)
  if (secs > 0) push('duration', { value: Math.min(secs, 3600) })
  push('scroll', { value: page.maxScroll })
  page = null
}

function trackScroll() {
  if (!page) return
  const h = document.documentElement.scrollHeight - innerHeight
  const pct = h > 0 ? Math.round((scrollY / h) * 100) : 100
  if (pct > page.maxScroll) page.maxScroll = Math.min(pct, 100)
}

export function trackPageview(path) {
  if (!enabled()) return
  closePage()
  page = { path, visible: 0, visibleSince: document.visibilityState === 'visible' ? Date.now() : 0, maxScroll: 0 }
  // Referrer only counts on the first page of a session, and only when it is another site.
  let referrer = ''
  const first = store(sessionStorage, 'fc_ref_done', () => '0') === '0'
  if (first) {
    try { const r = document.referrer && new URL(document.referrer).hostname; if (r && r !== location.hostname) referrer = r.replace(/^www\./, '') } catch { /* ignore */ }
    try { sessionStorage.setItem('fc_ref_done', '1') } catch { /* ignore */ }
  }
  push('pageview', { referrer })
  send()
}

export function initAnalytics() {
  if (!enabled()) return
  vid = store(localStorage, 'fc_vid', rid)
  sid = store(sessionStorage, 'fc_sid', rid)
  addEventListener('scroll', trackScroll, { passive: true })
  document.addEventListener('visibilitychange', () => {
    if (!page) return
    if (document.visibilityState === 'hidden') {
      if (page.visibleSince) { page.visible += Date.now() - page.visibleSince; page.visibleSince = 0 }
      const p = page; closePage(); page = { ...p, visible: 0, visibleSince: 0 } // flush time so far
      send(true)
    } else page.visibleSince = Date.now()
  })
  addEventListener('pagehide', () => { closePage(); send(true) })
  document.addEventListener('click', e => {
    const el = e.target.closest('a, button, [data-track], video, iframe')
    if (!el) return
    const label = el.dataset?.track || el.getAttribute('aria-label') || (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60)
      || el.getAttribute('alt') || el.getAttribute('href') || el.tagName.toLowerCase()
    push('click', { label })
    send()
  }, true)
}
