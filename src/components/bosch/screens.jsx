import { C, FONT, Btn, Tag, Field, Toggle, Card, Modal, Toast, Shell } from './kit'

// Every screen is a pure render of the demo state `s`. Hot spots carry data-hot for the cursor.
const T = ({ children, c = C.text, s = 13, w = 400, style }) => <span style={{ fontFamily: FONT, fontSize: s, color: c, fontWeight: w, ...style }}>{children}</span>

const TICKETS = [
  ['TicketCode 104', 'Pending approval', 'AACN', 'MAGNET-SCHULTZ GmbH & Co. KG', '0-6 months', '¥12,480.00'],
  ['TicketCode 103', 'Approved', 'ASCJ', 'Hulunbuir Honghai Digital Talent', '0-6 months', '¥8,250.00'],
  ['TicketCode 102', 'Paid', 'AACN', 'Shanghai Lingang Facility Services', '7-12 months', '¥46,900.00'],
  ['TicketCode 99', 'Invoice received', 'CSCW', 'Hulunbuir Honghai Digital Talent', '7-12 months', '¥33,056.85'],
  ['TicketCode 98', 'Overdue', 'DCCB', 'Suzhou Precision Tooling Co., Ltd.', 'Over 12 months', '¥128,300.00'],
  ['TicketCode 97', 'Paid', 'DCCB', 'MAGNET-SCHULTZ GmbH & Co. KG', '7-12 months', '¥21,775.40'],
  ['TicketCode 96', 'Cleared', 'ASCJ', 'Chengdu Hi-Tech Property Mgmt.', '0-6 months', '¥5,600.00'],
  ['TicketCode 95', 'Overdue', 'AACN', 'Wuxi Green Energy Leasing', 'Over 12 months', '¥64,020.00'],
  ['TicketCode 94', 'Cleared', 'CSCW', 'Shanghai Lingang Facility Services', '0-6 months', '¥9,310.00'],
  ['TicketCode 93', 'Approved', 'AACN', 'Beijing Ruitong Logistics', '0-6 months', '¥17,450.00'],
]

export function TicketList({ s }) {
  return (
    <Shell active="downpay" crumbs={['Home', 'Ticket list']} title="Ticket List" actions={<><Btn>Export</Btn><Btn primary hot="btn-new">+ New ticket</Btn></>}
      sub={<div style={{ display: 'flex', gap: 24, marginTop: 14 }}>{['Downpay', 'Deposit'].map((t, i) => <span key={t} style={{ fontFamily: FONT, fontSize: 14, paddingBottom: 6, color: i ? C.sub : C.blue, borderBottom: i ? 'none' : `2px solid ${C.blue}`, fontWeight: i ? 400 : 600 }}>{t}</span>)}</div>}>
      <Card pad={16} style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
          <Field label="Business division" value={s.filter ? 'CSCW' : ''} placeholder="Please select" select w={220} focus={s.focus === 'filter'} hot="filter" />
          <Field label="Vendor name" placeholder="Please select" select w={220} />
          <Field label="Status" placeholder="Please select" select w={220} />
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}><Btn>Reset</Btn><Btn primary hot="btn-query" active={s.press === 'btn-query'}>Query</Btn></div>
        </div>
      </Card>
      <Card title="Downpay table" pad={0} extra={<T s={12} c={C.sub}>{s.filter ? '1 result' : '128 results'}</T>}>
        <div style={{ display: 'grid', gridTemplateColumns: '40px 1.1fr 1.1fr 0.7fr 2fr 1fr 1fr', fontFamily: FONT, fontSize: 12.5 }}>
          {['', 'Ticket number', 'Status', 'Division', 'Vendor name', 'Aging period', 'Amount'].map(h => <div key={h} style={{ padding: '10px 12px', background: '#fafafa', color: C.sub, borderBottom: `1px solid ${C.line}` }}>{h}</div>)}
          {TICKETS.filter(r => !s.filter || r[2] === 'CSCW').map((r, i) => {
            const hot = r[0] === 'TicketCode 99'
            return [<div key={r[0] + 'c'} style={{ padding: '11px 12px', borderBottom: `1px solid ${C.line}` }}><span style={{ display: 'inline-block', width: 13, height: 13, border: '1px solid #c7cbd1', borderRadius: 3 }} /></div>,
              <div key={r[0]} data-hot={hot ? 'row-99' : undefined} style={{ padding: '11px 12px', borderBottom: `1px solid ${C.line}`, color: C.blue, textDecoration: 'underline', background: hot && s.press === 'row-99' ? C.blueSoft : 'transparent' }}>{r[0]}</div>,
              ...r.slice(1).map((v, k) => <div key={r[0] + k} style={{ padding: '11px 12px', borderBottom: `1px solid ${C.line}`, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', animation: s.filter ? `bkIn .3s ${i * 0.04}s both` : 'none' }}>{k === 0 ? <Tag>{v}</Tag> : k === 3 && v === 'Over 12 months' ? <T c={C.red} s={12.5}>{v}</T> : v}</div>)]
          })}
        </div>
      </Card>
    </Shell>
  )
}

const STEPS = [['Created', '2025-03-18'], ['Approved', '2025-03-20'], ['Paid', '2025-03-28'], ['Invoice', 'Due 2025-12-30'], ['Cleared', 'Pending']]
function Progress({ step }) {
  return (
    <div style={{ display: 'flex', padding: '8px 12px 0' }}>
      {STEPS.map(([t, d], i) => {
        const done = i <= step, cur = i === step
        return (
          <div key={t} style={{ flex: 1, position: 'relative', textAlign: 'center' }}>
            {i > 0 && <div style={{ position: 'absolute', top: 7, right: '50%', width: '100%', height: 2, background: '#e0e2e5' }}><div style={{ height: '100%', width: done ? '100%' : 0, background: C.blue, transition: 'width .8s ease' }} /></div>}
            <div style={{ position: 'relative', zIndex: 1, width: 16, height: 16, margin: '0 auto', borderRadius: '50%', background: done ? C.blue : '#fff', border: `2px solid ${done ? C.blue : '#c7cbd1'}`, boxShadow: cur ? `0 0 0 5px ${C.blueSoft}` : 'none', transition: 'all .5s', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 9 }}>{done && !cur ? '✓' : ''}</div>
            <div style={{ marginTop: 10 }}><T s={13} w={cur ? 700 : 400} c={done ? C.ink : C.sub}>{t}</T></div>
            <div><T s={11.5} c={C.faint}>{i === 4 && step === 4 ? '2025-12-29' : i === 3 && step >= 3 ? '2025-12-27' : d}</T></div>
          </div>
        )
      })}
    </div>
  )
}

const INFO = [['Company code', '1160 (RBCY)'], ['Category', 'I2P: Partial / down payments'], ['Assigned to', 'Wei KANG'], ['Vendor', 'Hulunbuir Honghai Digital Talent Service Co., Ltd.'], ['Vendor number', 'VD97537439'], ['Service team', 'GSA-CN SSF Specialist AP Team B'], ['Document date', '2025-05-07'], ['Currency', 'CNY'], ['Cost center', '116600']]

export function TicketDetail({ s }) {
  const tab = s.tab || 'details'
  return (
    <Shell active="downpay" crumbs={['Home', 'Ticket list', 'Ticket details']} title="TicketCode 99"
      actions={<><Btn hot="btn-invoice" active={s.press === 'btn-invoice'}>Upload invoice number</Btn><Btn hot="btn-comment" active={s.press === 'btn-comment'}>Comment</Btn><Btn primary hot="btn-remind" active={s.press === 'btn-remind'}>Manual reminder</Btn></>}
      sub={
        <div style={{ display: 'flex', alignItems: 'flex-end', marginTop: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: '6px 48px' }}>
            {[['Type', 'Downpay'], ['PO number', '4532034316'], ['Priority', 'Medium']].map(([k, v]) => <T key={k} c={C.sub}>{k}: <span style={{ color: C.text }}>{k === 'Priority' ? <Tag>{v}</Tag> : v}</span></T>)}
            <T c={C.sub} style={{ gridColumn: '1 / -1' }}>Description: <span style={{ color: C.text }}>DP 4532034316 · Deposit for Qinghai lab lease, 100% in advance</span></T>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}><T s={12} c={C.sub}>Amount</T><div><T s={28} w={700} c={C.ink}>¥33,056.85</T> <T w={700}>CNY</T></div></div>
        </div>}>
      <div style={{ display: 'flex', gap: 28, marginBottom: 16, borderBottom: `1px solid ${C.line}` }}>
        {[['details', 'Details'], ['comment', `Comment ${(s.comments || []).length + 2}`], ['attach', 'Attachment 2']].map(([k, t]) => <span key={k} data-hot={'tab-' + k} style={{ fontFamily: FONT, fontSize: 14, paddingBottom: 8, color: tab === k ? C.blue : C.text, fontWeight: tab === k ? 600 : 400, borderBottom: `2px solid ${tab === k ? C.blue : 'transparent'}` }}>{t}</span>)}
      </div>
      <div style={{ overflow: 'hidden', height: 620 }}><div style={{ transform: `translateY(${-(s.scroll || 0)}px)`, transition: 'transform 1.1s cubic-bezier(.45,0,.2,1)' }}>
        {tab === 'details' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card title="Overall progress"><Progress step={s.step ?? 3} /></Card>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
              <Card title="Ticket info" extra={<Btn small>Edit</Btn>}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px 20px' }}>
                  {[...INFO, ['Invoice number', s.invoice || '-']].map(([k, v]) => <div key={k}><div><T s={12} c={C.sub}>{k}</T></div><T s={13} c={k === 'Invoice number' && s.invoice ? C.blue : C.text} w={k === 'Invoice number' && s.invoice ? 600 : 400}>{v}</T></div>)}
                </div>
              </Card>
              <Card title="Operational log">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {(s.logs || []).concat(BASE_LOG).slice(0, 5).map(([t, d, by], i) => (
                    <div key={t + by} style={{ display: 'flex', gap: 10, animation: i < (s.logs || []).length ? 'bkIn .4s both' : 'none' }}>
                      <span style={{ width: 8, height: 8, marginTop: 5, borderRadius: '50%', border: `2px solid ${i < (s.logs || []).length ? C.blue : '#c7cbd1'}`, flex: '0 0 auto' }} />
                      <div><div><T s={12.5} w={600}>{t}</T></div><div><T s={12} c={C.sub}>{d}</T></div><T s={11} c={C.faint}>{by}</T></div>
                    </div>))}
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <Card title={`Comment threads (${(s.comments || []).length + 2})`} extra={<Btn primary small hot="btn-add-comment" active={s.press === 'btn-add-comment'}>Add new comment</Btn>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {(s.comments || []).concat(BASE_COMMENTS).map(([who, role, t, when], i) => (
                <div key={t} style={{ display: 'flex', gap: 12, animation: i < (s.comments || []).length ? 'bkIn .4s both' : 'none' }}>
                  <span style={{ width: 32, height: 32, borderRadius: '50%', background: role === 'AP' ? C.blueSoft : '#f5e9f5', color: role === 'AP' ? C.blue : C.purple, display: 'grid', placeItems: 'center', fontFamily: FONT, fontSize: 12, fontWeight: 700, flex: '0 0 auto' }}>{who.split(' ').map(x => x[0]).join('')}</span>
                  <div><T w={600}>{who}</T> <Tag style={{ marginLeft: 6 }}>{role === 'AP' ? 'Open' : 'Approved'}</Tag> <T s={11.5} c={C.faint} style={{ marginLeft: 8 }}>{when}</T><div style={{ marginTop: 4 }}><T c={C.text}>{t}</T></div></div>
                </div>))}
            </div>
          </Card>
        )}
      </div></div>
      {s.modal === 'remind' && (
        <Modal title="Manual reminder" footer={<><Btn>Cancel</Btn><Btn primary hot="modal-ok" active={s.press === 'modal-ok'}>Send reminder</Btn></>}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Send to" value="Wei KANG (UD)" select />
            <Field label="CC" value="Vendor · Hulunbuir Honghai" select />
          </div>
          <Field label="Template" value="Invoice follow-up" select />
          <Field label="Message" area value={s.msg} focus={s.focus === 'msg'} placeholder="Write a message" />
        </Modal>
      )}
      {s.modal === 'invoice' && (
        <Modal title="Upload invoice number" footer={<><Btn>Cancel</Btn><Btn primary hot="modal-ok" active={s.press === 'modal-ok'}>Submit</Btn></>}>
          <Field label="Invoice number *" value={s.inv} focus={s.focus === 'inv'} placeholder="Please input the full invoice number" />
          <T s={12.5} c={C.sub}>If the vendor hasn't sent the invoice yet, remind them to send it to the designated mailbox. <span style={{ color: C.blue }}>View requirements</span></T>
        </Modal>
      )}
      {s.modal === 'comment' && (
        <Modal title="Add new comment" footer={<><Btn>Cancel</Btn><Btn primary hot="modal-ok" active={s.press === 'modal-ok'}>Post</Btn></>}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}><Field label="Type" value="To do" select /><Field label="Mention" value="@Wei KANG" select /></div>
          <Field label="Comment" area value={s.msg} focus={s.focus === 'msg'} placeholder="Share an update" />
        </Modal>
      )}
      {s.toast && <Toast>{s.toast}</Toast>}
    </Shell>
  )
}
const BASE_LOG = [['System reminder sent', '"Invoice due in 5 days. Please upload payment proof."', 'System · 2025-12-25 08:00'], ['Invoice due date changed', '2025-12-30 to 2026-01-09', 'Hongyan PU · 2025-09-01'], ['Payment posted', 'Doc. number 8932874673', 'Cheng ZHANG · 2025-03-28'], ['Ticket approved', 'SSF ticket successfully approved', 'System · 2025-03-20']]
const BASE_COMMENTS = [['Wei KANG', 'UD', 'Vendor confirmed the invoice will be issued this week.', '2025-12-26 16:20'], ['Cheng ZHANG', 'AP', 'Payment posted. Waiting for the invoice from the vendor.', '2025-03-28 10:05']]

export function Posting({ s }) {
  return (
    <Shell active="posting" crumbs={['Home', 'Posting']} title="Posting for payment" sub={<div style={{ marginTop: 6 }}><T c={C.sub}>Choose what you want to post. The form adapts to the document type.</T></div>}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[['Downpay posting', 'Advance payment to a vendor before goods or services are delivered.', C.blue, 'card-downpay'], ['Deposit posting', 'Refundable deposit, such as rent, tuition or utilities.', C.teal], ['Invoice matching', 'Link one invoice to several down payments in the system.', C.purple]].map(([t, d, c, hot]) => (
          <div key={t} data-hot={hot} style={{ background: '#fff', border: `1px solid ${s.press === hot ? C.blue : C.line}`, boxShadow: s.press === hot ? `0 0 0 3px ${C.blueSoft}` : 'none', borderRadius: 8, padding: 24, transition: 'all .2s' }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: c, opacity: 0.12, marginBottom: -40 }} />
            <div style={{ width: 40, height: 40, display: 'grid', placeItems: 'center', color: c, marginBottom: 18 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 3h10l4 4v14H5zM9 12h6M9 16h6" /></svg></div>
            <div style={{ marginBottom: 8 }}><T s={16} w={700} c={C.ink}>{t}</T></div>
            <T c={C.sub}>{d}</T>
          </div>))}
      </div>
    </Shell>
  )
}

const FORM = [['Type', 'Downpay'], ['Company code', '1160'], ['Period', '2025-05'], ['Currency', 'CNY'], ['Doc. header text', 'SSF-2025-0418 · 116600'], ['Posting key', '29'], ['Account', 'VD97537439'], ['Amount', '33,056.85'], ['Assignment', 'Wei KANG'], ['Payment terms', 'Z030'], ['Baseline date', '2025-05-07'], ['Reference', 'Qinghai lab lease deposit']]
export function PostingForm({ s }) {
  const n = s.filled || 0
  return (
    <Shell active="posting" crumbs={['Home', 'Posting', 'Downpay posting']} title="Downpay posting">
      <Card title="Smart recognition" extra={<Btn primary small hot="btn-recognize" active={s.press === 'btn-recognize'}>Recognize</Btn>} style={{ marginBottom: 16 }}>
        <Field area value={s.paste} focus={s.focus === 'paste'} placeholder="Paste the request text and the form fills itself" hot="paste" />
      </Card>
      <Card title="Document details" extra={n > 0 && <Tag>{n >= FORM.length ? 'Approved' : 'Open'}</Tag>}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px 20px' }}>
          {FORM.map(([k, v], i) => <Field key={k} label={k} value={i < n ? v : ''} placeholder={`Enter ${k.toLowerCase()}`} focus={i === n - 1 && n < FORM.length} />)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}><Btn>Cancel</Btn><Btn primary hot="btn-submit" active={s.press === 'btn-submit'}>Submit</Btn></div>
      </Card>
      {s.toast && <Toast>{s.toast}</Toast>}
    </Shell>
  )
}

export function ReminderSetting({ s }) {
  const r = s.rules || { r1: true, r2: false }
  const Radio = ({ on, children }) => <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}><span style={{ width: 14, height: 14, borderRadius: '50%', border: `${on ? 4 : 1}px solid ${on ? C.blue : '#c7cbd1'}` }} /><T>{children}</T></div>
  const Rule = ({ n, title, on, hot, open }) => (
    <Card pad={0} style={{ marginBottom: 16, opacity: on ? 1 : 0.9 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', borderBottom: open ? `1px solid ${C.line}` : 'none' }}>
        <T w={700} c={C.ink}>Rule {n} · {title}</T>
        <span style={{ marginLeft: 'auto' }}><Tag>{on ? 'Approved' : 'Open'}</Tag></span>
        <Toggle on={on} hot={hot} />
      </div>
      {open && (
        <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, opacity: on ? 1 : 0.45, transition: 'opacity .3s' }}>
          <div><T c={C.sub} s={12}>When</T><Radio on>3 days before the invoice due date</Radio><Radio>7 days before the invoice due date</Radio><Radio>On the due date</Radio></div>
          <div><T c={C.sub} s={12}>Frequency</T><Radio on>Once</Radio><Radio>Every day at 12:00 until uploaded</Radio></div>
          <div style={{ gridColumn: '1 / -1' }}><Field label="Email content" area value="Dear {UD}, the invoice for {ticket} is due in 3 days. Please ask the vendor to send it, then upload the invoice number here: {link}" /></div>
        </div>
      )}
    </Card>
  )
  return (
    <Shell active="reminder" crumbs={['Home', 'Setting']} title="Reminder setting" actions={<Btn primary hot="btn-add-rule">+ Add rule</Btn>}>
      <Rule n={1} title="Invoice due reminder" on={r.r1} hot="toggle-1" open />
      <Rule n={2} title="Overdue over 6 months, escalate to manager" on={r.r2} hot="toggle-2" />
      <Rule n={3} title="Deposit refund follow-up" on={r.r3} hot="toggle-3" />
      {s.toast && <Toast>{s.toast}</Toast>}
    </Shell>
  )
}

export function Inbox({ s }) {
  const mails = [['Down Payment Platform', 'Invoice due in 3 days · TicketCode 99', '08:00', true], ['Hongyan PU', 'Re: Qinghai lab lease deposit', 'Yesterday'], ['Finance Newsletter', 'Month-end closing checklist', 'Mon'], ['Li Xiaoming', 'Vendor master data update', 'Mon']]
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#fff', fontFamily: FONT, display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 48, background: '#0f6cbd', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 14 }}><T c="#fff" w={700} s={15}>Mail</T><div style={{ flex: 1, maxWidth: 420, height: 30, borderRadius: 4, background: 'rgba(255,255,255,.2)' }} /><span style={{ marginLeft: 'auto', width: 28, height: 28, borderRadius: '50%', background: '#f5e9f5', color: C.purple, display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700 }}>WK</span></div>
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div style={{ width: 200, background: '#f5f6f8', padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>{['Inbox', 'Sent', 'Drafts', 'Archive'].map((f, i) => <div key={f} style={{ padding: '8px 12px', borderRadius: 4, background: i ? 'transparent' : '#dfe9f5' }}><T w={i ? 400 : 600}>{f}</T>{!i && <T s={12} c={C.blue} style={{ float: 'right' }}>1</T>}</div>)}</div>
        <div style={{ width: 380, borderRight: `1px solid ${C.line}` }}>
          {mails.map(([from, sub, t, unread], i) => <div key={sub} style={{ padding: '14px 18px', borderBottom: `1px solid ${C.line}`, background: i === 0 ? '#eef5fc' : '#fff', borderLeft: `3px solid ${i === 0 ? '#0f6cbd' : 'transparent'}` }}><div style={{ display: 'flex' }}><T w={unread ? 700 : 400}>{from}</T><T s={12} c={C.sub} style={{ marginLeft: 'auto' }}>{t}</T></div><T s={12.5} c={unread ? '#0f6cbd' : C.sub} w={unread ? 600 : 400}>{sub}</T></div>)}
        </div>
        <div style={{ flex: 1, padding: '28px 40px' }}>
          <T s={20} w={700} c={C.ink}>Invoice due in 3 days · TicketCode 99</T>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0 24px' }}><span style={{ width: 32, height: 32, borderRadius: '50%', background: C.blueSoft, color: C.blue, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>DP</span><div><div><T w={600}>Down Payment Platform</T></div><T s={12} c={C.sub}>To: Wei KANG · CC: Cheng ZHANG</T></div></div>
          <div style={{ maxWidth: 560, border: `1px solid ${C.line}`, borderRadius: 8, padding: 28 }}>
            <div style={{ marginBottom: 20 }}><svg width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.4" stroke={C.ink} strokeWidth="1.6" fill="none" /></svg> <T w={800} c={C.red} s={16}>BOSCH</T></div>
            <p style={{ fontFamily: FONT, fontSize: 14, lineHeight: 1.6, color: C.text, margin: '0 0 12px' }}>Dear Wei KANG,</p>
            <p style={{ fontFamily: FONT, fontSize: 14, lineHeight: 1.6, color: C.text, margin: '0 0 20px' }}>The invoice for <b>TicketCode 99</b> (¥33,056.85, Hulunbuir Honghai Digital Talent) is due on <b>2025-12-30</b>. Please ask the vendor to send it, then upload the invoice number.</p>
            <Btn primary hot="mail-cta" active={s.press === 'mail-cta'}>Upload invoice number</Btn>
          </div>
        </div>
      </div>
    </div>
  )
}
