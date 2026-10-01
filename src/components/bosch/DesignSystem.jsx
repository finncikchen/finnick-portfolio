import { useEffect, useState } from 'react'
import { Scaled } from './Dashboard'
import { C, FONT, Btn, Tag, Field, Toggle, KEYFRAMES } from './kit'

// Component sheet for the platform, rendered from the same primitives as the live UI.
const T = ({ children, c = C.text, s = 13, w = 400, style }) => <span style={{ fontFamily: FONT, fontSize: s, color: c, fontWeight: w, ...style }}>{children}</span>

function Tile({ name, area, children, gap = 14 }) {
  return (
    <div style={{ gridArea: area, background: '#fff', borderRadius: 20, padding: 26, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0, overflow: 'hidden' }}>
      <span style={{ fontFamily: FONT, fontSize: 11, color: C.faint, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{name}</span>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap, minHeight: 0 }}>{children}</div>
    </div>
  )
}
const Row = ({ children, gap = 10, wrap = true, style }) => <div style={{ display: 'flex', alignItems: 'center', gap, flexWrap: wrap ? 'wrap' : 'nowrap', ...style }}>{children}</div>

const Check = ({ on, label, part }) => (
  <Row gap={8} wrap={false}>
    <span style={{ width: 16, height: 16, borderRadius: 3, border: `1px solid ${on || part ? C.blue : '#c7cbd1'}`, background: on ? C.blue : '#fff', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 10, transition: 'all .2s' }}>{on ? '✓' : part ? <span style={{ width: 8, height: 2, background: C.blue }} /> : ''}</span>
    <T>{label}</T>
  </Row>
)

function useTick(ms, n) {
  const [i, setI] = useState(0)
  useEffect(() => { const id = setInterval(() => setI(x => (x + 1) % n), ms); return () => clearInterval(id) }, [ms, n])
  return i
}

function Stepper() {
  const step = useTick(1200, 6)
  return (
    <div style={{ display: 'flex' }}>
      {['Created', 'Approved', 'Paid', 'Invoice', 'Cleared'].map((t, i) => {
        const done = i <= step - 1, cur = i === step - 1
        return (
          <div key={t} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
            {i > 0 && <div style={{ position: 'absolute', top: 7, right: '50%', width: '100%', height: 2, background: '#e0e2e5' }}><div style={{ height: '100%', width: done ? '100%' : 0, background: C.blue, transition: 'width .5s' }} /></div>}
            <div style={{ position: 'relative', zIndex: 1, width: 16, height: 16, margin: '0 auto', borderRadius: '50%', background: done ? C.blue : '#fff', border: `2px solid ${done ? C.blue : '#c7cbd1'}`, boxShadow: cur ? `0 0 0 5px ${C.blueSoft}` : 'none', transition: 'all .4s' }} />
            <div style={{ marginTop: 8 }}><T s={11.5} w={cur ? 700 : 400} c={done ? C.ink : C.sub}>{t}</T></div>
          </div>
        )
      })}
    </div>
  )
}

function Segmented() {
  const i = useTick(1600, 3)
  return (
    <div style={{ display: 'inline-flex', background: '#eef0f3', borderRadius: 6, padding: 3, position: 'relative' }}>
      <span style={{ position: 'absolute', top: 3, bottom: 3, left: 3 + i * 72, width: 72, background: '#fff', borderRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,.12)', transition: 'left .35s cubic-bezier(.4,0,.2,1)' }} />
      {['Value', 'Item', 'Trend'].map((t, k) => <span key={t} style={{ position: 'relative', width: 72, textAlign: 'center', padding: '5px 0', fontFamily: FONT, fontSize: 12.5, color: k === i ? C.ink : C.sub, fontWeight: k === i ? 600 : 400 }}>{t}</span>)}
    </div>
  )
}

function ToggleDemo() {
  const i = useTick(1400, 2)
  return <Row gap={14}><Toggle on={!i} /><Toggle on={!!i} /><Toggle on /><span style={{ opacity: 0.4 }}><Toggle /></span></Row>
}

function Tabs() {
  const i = useTick(1500, 3)
  return (
    <div style={{ display: 'flex', gap: 24, borderBottom: `1px solid ${C.line}` }}>
      {['Details', 'Comments', 'Files'].map((t, k) => <span key={t} style={{ fontFamily: FONT, fontSize: 13.5, paddingBottom: 8, color: k === i ? C.blue : C.text, fontWeight: k === i ? 600 : 400, borderBottom: `2px solid ${k === i ? C.blue : 'transparent'}`, transition: 'all .25s' }}>{t}</span>)}
    </div>
  )
}

const CW = 1200, ROW = 260, GAP = 16, CH = ROW * 4 + GAP * 3
const AREAS = '"color color type button" "status field prog prog" "kpi tabs tips download" "table table table toast"'

export default function DesignSystem() {
  return (
    <Scaled w={CW} h={CH}>
      <style>{KEYFRAMES}</style>
      <div style={{ width: CW, height: CH, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: `repeat(4, ${ROW}px)`, gap: GAP, gridTemplateAreas: AREAS, fontFamily: FONT }}>
        <Tile name="Colour" area="color">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px 10px' }}>
            {[['Bosch Red', C.red], ['Blue', C.blue], ['Blue dark', C.blueDark], ['Purple', C.purple], ['Teal', C.teal], ['Green', C.green], ['Ink', C.ink], ['Grey 70', C.sub], ['Grey 40', C.faint], ['Line', C.line], ['Canvas', C.bg], ['Blue 5', C.blueSoft]].map(([n, c]) => (
              <div key={n}><div style={{ height: 52, borderRadius: 10, background: c, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)' }} /><div style={{ marginTop: 7 }}><T s={11.5} w={600}>{n}</T></div><T s={10.5} c={C.faint}>{c.toUpperCase()}</T></div>
            ))}
          </div>
        </Tile>

        <Tile name="Typography" area="type" gap={10}>
          <T s={44} w={700} c={C.ink} style={{ lineHeight: 1, letterSpacing: '-0.02em' }}>Aa</T>
          <T s={12} c={C.sub}>Helvetica Neue · Bosch Sans in product</T>
          <div style={{ height: 1, background: C.line, margin: '4px 0' }} />
          {[[20, 700, 'Title 20'], [14, 700, 'Heading 14'], [13, 400, 'Body 13 / 20'], [11.5, 400, 'Caption 11.5']].map(([sz, w, t]) => <T key={t} s={sz} w={w} c={C.ink}>{t}</T>)}
        </Tile>

        <Tile name="Button" area="button" gap={12}>
          <Row><Btn primary>Apply</Btn><Btn>Cancel</Btn></Row>
          <Row><Btn primary active>Pressed</Btn><Btn active>Selected</Btn></Row>
          <Row><Btn ghost style={{ paddingLeft: 0 }}>↺ Reset filter</Btn><Btn primary small>Small</Btn></Row>
          <span style={{ opacity: 0.4 }}><Btn primary>Disabled</Btn></span>
        </Tile>

        <Tile name="Status" area="status" gap={18}>
          <div><div style={{ marginBottom: 8 }}><T s={11.5} c={C.sub}>Ticket</T></div><Row gap={6}>{['Pending approval', 'Approved', 'Paid', 'Invoice received', 'Cleared', 'Overdue'].map(t => <Tag key={t}>{t}</Tag>)}</Row></div>
          <div><div style={{ marginBottom: 8 }}><T s={11.5} c={C.sub}>Priority</T></div><Row gap={6}>{['Critical', 'Serious', 'Medium', 'Low'].map(t => <Tag key={t}>{t}</Tag>)}</Row></div>
        </Tile>

        <Tile name="Input & select" area="field">
          <Field label="Invoice number" value="INV-2025-004187" focus />
          <Field label="Legal entity" value="RBCN" select />
          <Field label="Vendor" placeholder="Please select" select />
        </Tile>

        <Tile name="Progress" area="prog" gap={26}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div><T s={20} w={700} c={C.ink}>TicketCode 99</T><div style={{ marginTop: 6 }}><Tag>Invoice received</Tag></div></div>
            <div style={{ textAlign: 'right' }}><T s={11.5} c={C.sub}>Amount</T><div><T s={24} w={700} c={C.ink}>¥33,056.85</T></div></div>
          </div>
          <Stepper />
        </Tile>

        <Tile name="KPI card" area="kpi">
          <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: '16px 18px' }}>
            <Row gap={8}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#d6009f' }} /><T s={14} w={500} c={C.ink}>Total overdue</T></Row>
            <T s={12} c={C.sub}>1,123 items</T>
            <div style={{ margin: '10px 0 6px' }}><T s={14}>¥</T><T s={30} w={700} c={C.ink}>211k</T></div>
            <Row gap={8}><T s={12} w={600} c={C.green}>↓ -0.25%</T><T s={11.5} c={C.faint}>since last month</T></Row>
          </div>
        </Tile>

        <Tile name="Tabs & switch" area="tabs" gap={20}>
          <Tabs />
          <Segmented />
          <Row gap={18}><ToggleDemo /></Row>
        </Tile>

        <Tile name="Tips & hover" area="tips" gap={10}>
          <div style={{ background: '#16263a', color: '#fff', borderRadius: 8, padding: '10px 12px', fontSize: 12, lineHeight: 1.5, position: 'relative', marginBottom: 8 }}>Deposits that expire next month.<span style={{ position: 'absolute', left: 22, bottom: -5, width: 10, height: 10, background: '#16263a', transform: 'rotate(45deg)' }} /></div>
          {[['#eef6fc', C.blue, `1px solid ${C.blue}`, 'Default'], [C.blue, '#fff', 'none', 'Hover'], ['#0a4f8a', '#fff', 'none', 'Pressed']].map(([bg, fg, b, k]) => (
            <div key={k} style={{ background: bg, color: fg, border: b, borderRadius: 6, textAlign: 'center', padding: '8px 0', fontSize: 12.5, fontWeight: 600 }}>View more diagrams</div>
          ))}
        </Tile>

        <Tile name="Download & filter" area="download" gap={10}>
          <Row gap={6}><T c={C.blue} w={600}>⤓ Item list</T><T c={C.sub} s={11} style={{ marginLeft: 'auto' }}>▴</T></Row>
          <Check on label="Filtered item list" />
          <Check label="Non-filtered list" />
          <Btn primary small style={{ justifyContent: 'center' }}>Download now</Btn>
          <div style={{ height: 1, background: C.line, margin: '4px 0' }} />
          <Check part label="Expire period" />
          <div style={{ paddingLeft: 24, display: 'flex', gap: 14 }}><Check on label="0-6 mth" /><Check label="12+" /></div>
        </Tile>

        <Tile name="Table" area="table">
          <div style={{ display: 'grid', gridTemplateColumns: '36px 1.1fr 1.3fr 0.7fr 2fr 1fr 1fr', fontSize: 12.5, border: `1px solid ${C.line}`, borderRadius: 10, overflow: 'hidden' }}>
            {['', 'Ticket number', 'Status', 'Division', 'Vendor name', 'Aging period', 'Amount'].map(h => <div key={h} style={{ padding: '10px 12px', background: '#fafafa', color: C.sub, borderBottom: `1px solid ${C.line}` }}>{h}</div>)}
            {[['TicketCode 99', 'Invoice received', 'CSCW', 'Hulunbuir Honghai Digital Talent', '7-12 months', '¥33,056.85'], ['TicketCode 98', 'Overdue', 'DCCB', 'Suzhou Precision Tooling Co., Ltd.', 'Over 12 months', '¥128,300.00'], ['TicketCode 96', 'Cleared', 'ASCJ', 'Chengdu Hi-Tech Property Mgmt.', '0-6 months', '¥5,600.00']].map((r, i) => [
              <div key={r[0] + 'c'} style={{ padding: '12px', borderBottom: i < 2 ? `1px solid ${C.line}` : 'none', background: i === 0 ? C.blueSoft : '#fff' }}><Check on={i === 0} label="" /></div>,
              ...r.map((v, k) => <div key={r[0] + k} style={{ padding: '12px', borderBottom: i < 2 ? `1px solid ${C.line}` : 'none', background: i === 0 ? C.blueSoft : '#fff', color: k === 0 ? C.blue : k === 4 && v === 'Over 12 months' ? C.red : C.text, textDecoration: k === 0 ? 'underline' : 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{k === 1 ? <Tag>{v}</Tag> : v}</div>),
            ])}
          </div>
          <Row gap={6} style={{ justifyContent: 'flex-end' }}>{['‹', '1', '2', '3', '…', '12', '›'].map((p, i) => <span key={i} style={{ minWidth: 26, height: 26, borderRadius: 6, display: 'grid', placeItems: 'center', fontSize: 12, border: `1px solid ${p === '1' ? C.blue : C.line}`, color: p === '1' ? C.blue : C.text }}>{p}</span>)}</Row>
        </Tile>

        <Tile name="Feedback" area="toast" gap={10}>
          <Row gap={8} wrap={false} style={{ padding: '10px 12px', background: '#fff', borderRadius: 8, boxShadow: '0 6px 20px rgba(0,0,0,.10)' }}><span style={{ width: 16, height: 16, flex: '0 0 auto', borderRadius: '50%', background: C.green, color: '#fff', fontSize: 10, display: 'grid', placeItems: 'center' }}>✓</span><T s={12.5}>Reminder sent</T></Row>
          <Row gap={8} wrap={false} style={{ padding: '10px 12px', background: C.redSoft, borderRadius: 8 }}><span style={{ width: 16, height: 16, flex: '0 0 auto', borderRadius: '50%', background: C.red, color: '#fff', fontSize: 10, display: 'grid', placeItems: 'center' }}>!</span><T s={12.5} c={C.red}>24 deposits expire soon</T></Row>
          <Row gap={0} style={{ marginTop: 6 }}>{[['CZ', C.blueSoft, C.blue], ['WK', '#f5e9f5', C.purple], ['HP', C.greenSoft, C.green], ['+4', '#eef0f3', C.sub]].map(([t, bg, fg], i) => <span key={t} style={{ width: 32, height: 32, borderRadius: '50%', background: bg, color: fg, border: '2px solid #fff', marginLeft: i ? -8 : 0, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>{t}</span>)}<T s={12} c={C.sub} style={{ marginLeft: 10 }}>7 watching</T></Row>
        </Tile>
      </div>
    </Scaled>
  )
}
