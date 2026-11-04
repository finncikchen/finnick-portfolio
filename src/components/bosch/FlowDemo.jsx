import { useEffect, useRef, useState } from 'react'
import { C, FONT, KEYFRAMES } from './kit'
import { TicketList, TicketDetail, Posting, PostingForm, ReminderSetting, Inbox } from './screens'

// Scripted walkthroughs of the Phase 2 prototype, played on the live UI.
// Actions: set (merge state) · click (move cursor to data-hot, press) · type (into state key) · fill (count up) · wait
const SCREENS = { list: TicketList, detail: TicketDetail, posting: Posting, postingForm: PostingForm, reminder: ReminderSetting, inbox: Inbox }
const LOG_REMIND = ['Manual reminder sent', '"Dear Wei, please upload the invoice number ASAP."', 'Cheng ZHANG · just now']
const LOG_INVOICE = ['Invoice number uploaded', 'INV-2025-004187 · matched to DP 4532034316', 'Wei KANG · just now']

export const FLOWS = [
  { name: 'Find a ticket', who: 'AP', caption: 'Filter the list and open the item that needs attention.', start: { screen: 'list', step: 2 }, steps: [
    { click: 'filter', set: { focus: 'filter' } }, { wait: 400 }, { set: { filter: true, focus: null } }, { click: 'btn-query' }, { wait: 700 },
    { click: 'row-99', then: { screen: 'detail' } }, { wait: 1200 }, { set: { scroll: 150 } }, { wait: 1600 }] },
  { name: 'Manual reminder', who: 'AP', caption: 'Nudge UD and the vendor from the ticket. The reminder is logged.', start: { screen: 'detail', step: 2 }, steps: [
    { click: 'btn-remind', then: { modal: 'remind', focus: 'msg' } }, { wait: 300 }, { type: 'msg', text: 'Dear Wei, the vendor invoice for TicketCode 99 is due on Dec 30. Please upload the invoice number ASAP.' },
    { click: 'modal-ok', then: { modal: null, focus: null, toast: 'Reminder sent to Wei KANG', logs: [LOG_REMIND] } }, { wait: 2200 }, { set: { toast: null } }] },
  { name: 'Upload invoice', who: 'UD', caption: 'UD opens the reminder email and uploads the invoice number in two clicks.', start: { screen: 'inbox', step: 2, logs: [LOG_REMIND] }, steps: [
    { wait: 600 }, { click: 'mail-cta', then: { screen: 'detail' } }, { wait: 700 }, { click: 'btn-invoice', then: { modal: 'invoice', focus: 'inv' } }, { type: 'inv', text: 'INV-2025-004187', speed: 70 },
    { click: 'modal-ok', then: { modal: null, focus: null, invoice: 'INV-2025-004187', toast: 'Invoice number uploaded', logs: [LOG_INVOICE, LOG_REMIND] } }, { wait: 500 }, { set: { step: 3 } }, { wait: 2200 }, { set: { toast: null } }] },
  { name: 'Comment', who: 'AP · UD', caption: 'Keep the conversation on the ticket instead of in email threads.', start: { screen: 'detail', step: 3, invoice: 'INV-2025-004187' }, steps: [
    { click: 'tab-comment', then: { tab: 'comment' } }, { wait: 500 }, { click: 'btn-add-comment', then: { modal: 'comment', focus: 'msg' } }, { type: 'msg', text: 'Invoice received and matched. Moving to clearing today.' },
    { click: 'modal-ok', then: { modal: null, focus: null, comments: [['Cheng ZHANG', 'AP', 'Invoice received and matched. Moving to clearing today.', 'just now']], toast: 'Comment posted' } }, { wait: 2000 }, { set: { toast: null } }] },
  { name: 'Post for payment', who: 'AP', caption: 'Paste the request, and smart recognition fills the posting form.', start: { screen: 'posting' }, steps: [
    { click: 'card-downpay', then: { screen: 'postingForm' } }, { wait: 500 }, { click: 'paste', set: { focus: 'paste' } },
    { type: 'paste', text: 'DP for Qinghai lab lease, vendor VD97537439, CNY 33,056.85, company 1160, cost center 116600, UD Wei KANG', speed: 16 },
    { click: 'btn-recognize', then: { focus: null } }, { fill: 12 }, { wait: 400 }, { click: 'btn-submit', then: { toast: 'Posted for payment · Doc. 8932874673' } }, { wait: 2200 }, { set: { toast: null } }] },
  { name: 'Reminder rules', who: 'Admin', caption: 'Set rules once and the platform chases due dates automatically.', start: { screen: 'reminder', rules: { r1: true, r2: false, r3: false } }, steps: [
    { wait: 500 }, { click: 'toggle-2', then: { rules: { r1: true, r2: true, r3: false }, toast: 'Rule 2 enabled' } }, { wait: 1400 },
    { click: 'toggle-3', then: { rules: { r1: true, r2: true, r3: true }, toast: 'Rule 3 enabled' } }, { wait: 2000 }, { set: { toast: null } }] },
]

const CW = 1440, CH = 900
export default function FlowDemo() {
  const outer = useRef(null), canvas = useRef(null)
  const [scale, setScale] = useState(0.6)
  const [inView, setInView] = useState(false)
  const [flow, setFlow] = useState(0)
  const [s, setS] = useState(FLOWS[0].start)
  const [cur, setCur] = useState([900, 600])
  const [press, setPress] = useState(0)
  const [prog, setProg] = useState(0)

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / CW)); ro.observe(outer.current)
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 }); io.observe(outer.current)
    return () => { ro.disconnect(); io.disconnect() }
  }, [])

  useEffect(() => {
    if (!inView) return
    let alive = true
    const sleep = ms => new Promise(r => setTimeout(r, ms))
    const where = hot => {
      const el = canvas.current?.querySelector(`[data-hot="${hot}"]`)
      if (!el) return null
      const a = el.getBoundingClientRect(), b = canvas.current.getBoundingClientRect(), k = b.width / CW
      return [(a.left - b.left + a.width / 2) / k, (a.top - b.top + a.height / 2) / k]
    }
    ;(async () => {
      const f = FLOWS[flow]
      setS({ ...f.start }); setProg(0)
      await sleep(900)
      for (let i = 0; i < f.steps.length && alive; i++) {
        const a = f.steps[i]
        if (a.click) {
          const p = where(a.click); if (p) { setCur(p); await sleep(850) }
          if (!alive) return
          setPress(n => n + 1); setS(x => ({ ...x, ...(a.set || {}), press: a.click })); await sleep(260)
          setS(x => ({ ...x, press: null, ...(a.then || {}) })); await sleep(250)
        } else if (a.type) {
          for (let c = 1; c <= a.text.length && alive; c++) { setS(x => ({ ...x, [a.type]: a.text.slice(0, c) })); await sleep(a.speed ?? 28) }
        } else if (a.fill) {
          for (let c = 1; c <= a.fill && alive; c++) { setS(x => ({ ...x, filled: c })); await sleep(120) }
        } else if (a.set) { setS(x => ({ ...x, ...a.set })); await sleep(250) }
        else if (a.wait) await sleep(a.wait)
        setProg((i + 1) / f.steps.length)
      }
      await sleep(800)
      if (alive) setFlow(n => (n + 1) % FLOWS.length)
    })()
    return () => { alive = false }
  }, [inView, flow])

  const Screen = SCREENS[s.screen]
  return (
    <div style={{ fontFamily: FONT }}>
      <style>{KEYFRAMES + '@keyframes bkRip{0%{opacity:.8;transform:scale(.3)}100%{opacity:0;transform:scale(1.8)}}'}</style>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {FLOWS.map((f, i) => (
          <button key={f.name} onClick={() => setFlow(i)} style={{ position: 'relative', overflow: 'hidden', border: 'none', cursor: 'pointer', borderRadius: 999, padding: '9px 16px', fontFamily: 'inherit', fontSize: 13.5, background: i === flow ? '#111' : '#fff', color: i === flow ? '#fff' : '#333', boxShadow: i === flow ? 'none' : 'inset 0 0 0 1px rgba(0,0,0,0.1)', transition: 'all .25s' }}>
            {i === flow && <span style={{ position: 'absolute', left: 0, bottom: 0, height: 2, width: `${prog * 100}%`, background: '#4fb3ff', transition: 'width .3s' }} />}
            <span style={{ opacity: 0.55, marginRight: 6 }}>0{i + 1}</span>{f.name}
          </button>))}
      </div>
      <div style={{ borderRadius: 14, overflow: 'hidden', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 30px 80px rgba(20,30,60,0.14)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', background: '#f6f7f9', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          {['#ff5f57', '#febc2e', '#28c840'].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
          <span style={{ marginLeft: 12, fontSize: 12, color: '#8a8f98' }}>{s.screen === 'inbox' ? 'Outlook · Wei KANG (UD)' : 'dp-deposit.bosch.com'}</span>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#8a8f98' }}>{FLOWS[flow].who}</span>
        </div>
        <div ref={outer} style={{ position: 'relative', width: '100%', aspectRatio: `${CW} / ${CH}`, overflow: 'hidden' }}>
          <div ref={canvas} style={{ position: 'absolute', left: 0, top: 0, width: CW, height: CH, transform: `scale(${scale})`, transformOrigin: '0 0' }}>
            <div key={s.screen} style={{ position: 'absolute', inset: 0, animation: 'bkFade .35s ease both' }}><Screen s={s} /></div>
            <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 50, pointerEvents: 'none', transform: `translate(${cur[0]}px, ${cur[1]}px)`, transition: 'transform .8s cubic-bezier(.6,0,.25,1)' }}>
              <span key={press} style={{ position: 'absolute', left: -20, top: -20, width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,123,192,0.4)', opacity: 0, animation: press ? 'bkRip .5s ease-out' : 'none' }} />
              <svg width="26" height="26" viewBox="0 0 24 24" style={{ position: 'absolute', left: -4, top: -3, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.3))' }}><path d="M4 2l15 10.5-6.6 1.3 3.8 7.3-2.8 1.4-3.8-7.3L4 20z" fill="#111" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" /></svg>
            </div>
          </div>
        </div>
      </div>
      <p style={{ fontSize: 15, color: '#6b6b6b', margin: '16px 2px 0' }}>{FLOWS[flow].caption}</p>
    </div>
  )
}
