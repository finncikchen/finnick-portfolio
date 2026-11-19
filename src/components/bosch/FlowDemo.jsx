import { useEffect, useRef, useState } from 'react'
import { C, KEYFRAMES } from './kit'
import { TicketList, TicketDetail, Posting, PostingForm, ReminderSetting, Inbox } from './screens'

// The Phase 2 flows on the live UI. Each is shown frozen on its key moment (SHOTS below).
// `steps` keeps the scripted walkthrough: set (merge state) · click (data-hot) · type (into state key) · fill (count up) · wait
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
// The six flows laid out, each frozen on the moment that tells its story and cropped to where it happens,
// so a reader scrolling past gets all six without waiting for a player.
// crop: [x, y, w, h] on the 1440 x 900 canvas (full screen: each flow has its own full-width container)
const LOG_COMMENT = [['Cheng ZHANG', 'AP', 'Invoice received and matched. Moving to clearing today.', 'just now']]
const SHOTS = [
  { state: { screen: 'list', step: 2, filter: true }, crop: [0, 0, 1440, 900] },
  { state: { screen: 'detail', step: 2, modal: 'remind', focus: 'msg', msg: 'Dear Wei, the vendor invoice for TicketCode 99 is due on Dec 30. Please upload the invoice number ASAP.' }, crop: [0, 0, 1440, 900] },
  { state: { screen: 'detail', step: 3, invoice: 'INV-2025-004187', logs: [LOG_INVOICE, LOG_REMIND], toast: 'Invoice number uploaded' }, crop: [0, 0, 1440, 900] },
  { state: { screen: 'detail', step: 3, invoice: 'INV-2025-004187', tab: 'comment', comments: LOG_COMMENT }, crop: [0, 0, 1440, 900] },
  { state: { screen: 'postingForm', paste: 'DP for Qinghai lab lease, vendor VD97537439, CNY 33,056.85, company 1160, cost center 116600, UD Wei KANG', filled: 12 }, crop: [0, 0, 1440, 900] },
  { state: { screen: 'reminder', rules: { r1: true, r2: true, r3: true } }, crop: [0, 0, 1440, 900] },
]

export function FlowShot({ i }) {
  const { state, crop: [x, y, w, h] } = SHOTS[i], who = FLOWS[i].who
  const ref = useRef(null)
  const [k, setK] = useState(0)
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / w)); ro.observe(ref.current)
    return () => ro.disconnect()
  }, [w])
  const Screen = SCREENS[state.screen]
  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', background: '#fff', boxShadow: '0 1px 2px rgba(30,20,70,0.06), 0 24px 56px -28px rgba(30,20,70,0.3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 12px', background: '#f6f7f9', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        {['#ff5f57', '#febc2e', '#28c840'].map(c => <span key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />)}
        <span style={{ marginLeft: 10, fontSize: 11.5, color: '#8a8f98', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>dp-deposit.bosch.com</span>
        <span style={{ marginLeft: 'auto', paddingLeft: 10, fontSize: 11.5, color: '#8a8f98', whiteSpace: 'nowrap' }}>{who}</span>
      </div>
      <div ref={ref} aria-hidden style={{ position: 'relative', width: '100%', aspectRatio: `${w} / ${h}`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: CW, height: CH, transformOrigin: '0 0', transform: `scale(${k}) translate(${-x}px, ${-y}px)`, visibility: k ? 'visible' : 'hidden', pointerEvents: 'none' }}>
          <style>{KEYFRAMES}</style>
          <Screen s={state} />
        </div>
      </div>
    </div>
  )
}
