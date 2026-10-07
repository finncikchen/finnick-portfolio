import { sql, ensureSchema } from './_db.js'

const TYPES = new Set(['pageview', 'duration', 'scroll', 'click'])
const clip = (v, n) => (typeof v === 'string' ? v.slice(0, n) : null)
const header = (req, k) => {
  const v = req.headers[k]
  return v ? decodeURIComponent(Array.isArray(v) ? v[0] : v) : null
}

// Receives a batch of events from the site (sent with navigator.sendBeacon).
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  let body = req.body
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch { return res.status(400).end() } }
  const events = Array.isArray(body?.events) ? body.events.slice(0, 50) : []
  if (!events.length) return res.status(204).end()

  // City comes from Vercel's edge geolocation headers; the IP itself is never saved.
  const city = header(req, 'x-vercel-ip-city')
  const region = header(req, 'x-vercel-ip-country-region')
  const country = header(req, 'x-vercel-ip-country')
  const ua = req.headers['user-agent'] || ''
  if (/bot|crawl|spider|preview|headless/i.test(ua)) return res.status(204).end()
  const device = /Mobi|Android|iPhone/i.test(ua) ? 'mobile' : /iPad|Tablet/i.test(ua) ? 'tablet' : 'desktop'

  await ensureSchema()
  for (const e of events) {
    if (!TYPES.has(e.type) || typeof e.vid !== 'string' || typeof e.sid !== 'string') continue
    await sql`
      INSERT INTO events (vid, sid, type, path, label, value, referrer, city, region, country, device)
      VALUES (${clip(e.vid, 40)}, ${clip(e.sid, 40)}, ${e.type}, ${clip(e.path, 200) || '/'},
              ${clip(e.label, 120)}, ${Number.isFinite(e.value) ? Math.round(e.value) : null},
              ${clip(e.referrer, 200)}, ${city}, ${region}, ${country}, ${device})`
  }
  res.status(204).end()
}
