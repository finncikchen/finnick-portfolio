import {
  Asterisk, Ban, Bell, Calendar, Check, ChevronRight, ChevronUp, ChevronsUpDown, CircleCheck, CircleHelp,
  CircleArrowRight, Ellipsis, Grip, Info, LayoutDashboard, ListFilter, Loader, Megaphone, Menu, Minimize2, MoveLeft,
  MoveRight, OctagonAlert, Plus, Power, RotateCw, Search, Settings, TriangleAlert, Upload, UserRound, WandSparkles,
  Wrench, X, Zap,
} from 'lucide-react'
import { Stage } from '../../vendor/stageshow/stage'
import { Count } from '../../vendor/stageshow/motion/Count'
import './ServersDemo.css'

// The Intersight Servers page, drawn in code at the size it was designed.
// Beats: Upgrade firmware is pressed, the card counts its 12 servers, the toast
// and the check land together, the finished card moves to the back of the
// carousel. The toast is closed and two presses of the carousel arrow bring
// the first card round again, which is what returns the loop to its opening.

const CARDS = [
  { id: 'firmware', title: '12 servers ready for firmware upgrade', desc: 'Running older firmware versions. Upgrading together keeps the environment consistent and reduces future compatibility risks.', action: 'Upgrade firmware' },
  { id: 'hcl', title: '8 servers need HCL evaluation', desc: 'HCL validation is incomplete. Evaluate affected servers for compatibility issues.', action: 'Run HCL evaluation' },
  { id: 'link', title: '8 servers disconnected from Intersight', desc: 'Status and telemetry may be outdated, delaying detection of active hardware or configuration issues.', action: 'Reconnect servers' },
]

const NAV = [
  { label: 'Operate', icon: Settings, items: ['Servers', 'Chassis', 'Unified Edge', 'Fabric Interconnects', 'Hyperflex Clusters', 'Nutanix Clusters', 'Storage', 'Virtualization', 'Integrated Systems'] },
  { label: 'Configure', icon: Wrench, items: ['Profiles', 'Templates', 'Policies', 'Pools', 'Workloads', 'Blueprints'] },
]

const COLUMNS = ['Name', 'Health', 'Lifecycle', 'Contract Status', 'Model', 'UCS Domain', 'Custom HCL', 'HCL Status', 'Firmware Version']

const HEALTH = { H: ['ok', 'Healthy', CircleCheck], C: ['bad', 'Critical', OctagonAlert], W: ['warn', 'Warning', TriangleAlert] }
const COMPLIANT = ['ok', 'Compliant to Baselines']
const NON_COMPLIANT = ['bad', 'Non-Compliant to Baselines']
const APPROVED = ['ok', 'Approved', CircleCheck]
const NOT_APPROVED = ['warn', 'Not Approved', TriangleAlert]
const COVERED = ['ok', 'Covered', CircleCheck]
const NOT_COVERED = ['bad', 'Not Covered', OctagonAlert]
const LIFE_OK = ['ok', 'OK', CircleCheck]
const lost = label => ['bad', label, OctagonAlert]

const ROWS = [
  { name: '4G-IMM-1-2', health: 'H', life: LIFE_OK, contract: COVERED, model: 'UCSC-C220-M6S', domain: '4G-IMM', hcl: COMPLIANT, status: APPROVED, fw: '4.1 (28a)' },
  { name: '4G-IMM-1-3', health: 'H', life: ['mute', 'Decommissioned', Ban], model: 'UCSB-B220-M4', domain: 'domain-name', hcl: NON_COMPLIANT, fw: '4.1 (28a)', note: Calendar },
  { name: 'C220-WZP220315M', off: true, health: 'H', life: LIFE_OK, contract: COVERED, model: 'UCSB-B220-M4', domain: 'domain-name', hcl: COMPLIANT, status: APPROVED, fw: '4.1 (31a)' },
  { name: 'CC7UCS-13-1-1', health: 'C', life: lost('Removed'), model: 'C220 M5SX', domain: 'domain-name', hcl: COMPLIANT, status: APPROVED, fw: '4.1 (28a)', note: Calendar },
  { name: '4G-IMM-1-1', health: 'W', life: LIFE_OK, contract: NOT_COVERED, model: 'UCSC-C220-M6S', domain: '4G-IMM', hcl: COMPLIANT, status: NOT_APPROVED, fw: '4.1 (31a)' },
  { name: 'CC7UCS-13-1-2', health: 'C', life: lost('Moved & Replaced'), contract: NOT_COVERED, model: 'C220 M5SX', domain: 'domain-name', hcl: COMPLIANT, status: NOT_APPROVED, fw: '4.1 (31a)' },
  { name: 'CC7UCS-13-1-3', health: 'C', life: lost('Discovery Failed'), model: 'UCSX 210C-M6', hcl: NON_COMPLIANT, fw: '4.1 (28a)' },
  { name: 'CC7UCS-13-1-4', health: 'C', life: lost('Replaced'), contract: COVERED, model: 'UCSX 210C-M6', domain: 'domain-name', hcl: COMPLIANT, status: APPROVED, fw: '4.1 (28a)', note: CircleArrowRight },
]

const ICON = { size: 16, strokeWidth: 1.75 }
const SMALL = { size: 13, strokeWidth: 2 }

function Pill({ tone, icon: Glyph, children }) {
  return (
    <span className="csd-pill" data-tone={tone}>
      {Glyph && <Glyph {...SMALL} />}
      {children}
    </span>
  )
}

function TopBar() {
  return (
    <div className="csd-top">
      <img src="/cisco-ui/cisco-logo.svg" alt="" className="csd-logo" />
      <span className="csd-product">Intersight</span>
      <span className="csd-search"><Search {...ICON} />Search</span>
      <RotateCw {...ICON} className="csd-tool" style={{ left: 1134 }} />
      <CircleCheck {...ICON} className="csd-tool" style={{ left: 1172 }} />
      <Megaphone {...ICON} className="csd-tool" style={{ left: 1210 }} />
      <span className="csd-count" style={{ left: 1230 }}>40</span>
      <Bell {...ICON} className="csd-tool" style={{ left: 1274 }} />
      <span className="csd-count" data-tone="bad" style={{ left: 1294 }}><OctagonAlert size={11} strokeWidth={2.5} />28</span>
      <span className="csd-count" data-tone="warn" style={{ left: 1340 }}><TriangleAlert size={11} strokeWidth={2.5} />18</span>
      <CircleHelp {...ICON} className="csd-tool" style={{ left: 1390 }} />
      <i className="csd-rule" />
      <UserRound {...ICON} className="csd-tool" style={{ left: 1438 }} />
      <Grip {...ICON} className="csd-tool" style={{ left: 1476 }} />
    </div>
  )
}

function SideNav() {
  return (
    <div className="csd-nav">
      <Menu {...ICON} className="csd-menu" />
      <div className="csd-nav-head csd-nav-dash"><LayoutDashboard size={16} strokeWidth={1.75} />Dashboard</div>
      <i className="csd-nav-rule" />
      {NAV.map(group => (
        <div key={group.label}>
          <div className="csd-nav-head">
            <group.icon {...ICON} />
            {group.label}
            <ChevronUp size={14} strokeWidth={1.75} className="csd-nav-caret" />
          </div>
          {group.items.map(item => (
            <div key={item} className="csd-nav-item" data-on={item === 'Servers' || undefined}>{item}</div>
          ))}
        </div>
      ))}
    </div>
  )
}

function InsightCard({ card, s }) {
  const firmware = card.id === 'firmware'
  const phase = firmware ? s.phase : 'ready'
  return (
    <div className="csd-card" data-out={s.out === card.id || undefined} data-busy={phase === 'upgrading' || undefined} style={{ '--slot': s.slots[card.id] }}>
      <div className="csd-card-face" data-on={phase === 'ready' || undefined}>
        <i className="csd-ring" />
        <div className="csd-card-title">{card.title}</div>
        <div className="csd-card-desc">{card.desc}</div>
        <div className="csd-card-acts">
          <span className="csd-act" data-target={firmware ? 'upgrade' : undefined} data-cursor="hand"><WandSparkles {...SMALL} />{card.action}</span>
          <span className="csd-act csd-act--quiet" data-target={firmware ? 'view' : undefined} data-cursor="hand"><ListFilter {...SMALL} />View servers</span>
        </div>
      </div>
      {firmware && (
        <>
          <div className="csd-card-face" data-on={phase === 'upgrading' || undefined}>
            <i className="csd-dots"><b /><b /></i>
            <div className="csd-card-title">Upgrading firmware on 12 servers</div>
            <div className="csd-card-desc csd-progress"><Count value={s.count} duration={260} /> / 12 servers upgrading</div>
          </div>
          <div className="csd-card-face csd-card-done" data-on={phase === 'done' || undefined}>
            <span className="csd-done-mark"><Check size={18} strokeWidth={3} /></span>
            <div className="csd-card-desc">All servers are up to date</div>
          </div>
        </>
      )}
    </div>
  )
}

function Summary() {
  return (
    <div className="csd-metrics">
      <div className="csd-metric" style={{ width: 191 }}>
        <div className="csd-metric-title">Health</div>
        <div className="csd-health">
          <span className="csd-donut"><span>1519</span></span>
          <ul>
            <li data-tone="bad">Critical <b>26</b></li>
            <li data-tone="warn">Warning <b>108</b></li>
            <li data-tone="ok">Healthy <b>1385</b></li>
          </ul>
        </div>
      </div>
      <div className="csd-metric" style={{ width: 105 }}>
        <div className="csd-metric-title">Power</div>
        <div className="csd-pills"><Pill tone="bad" icon={Power}>Off 72</Pill><Pill tone="ok" icon={Power}>On 1447</Pill></div>
      </div>
      <div className="csd-metric" style={{ width: 192 }}>
        <div className="csd-metric-title">Custom HCL</div>
        <div className="csd-pills"><Pill tone="bad">Non-Compliant to Baselines 2</Pill><Pill tone="ok">Compliant to Baselines 1517</Pill></div>
      </div>
      <div className="csd-metric" style={{ width: 401 }}>
        <div className="csd-metric-title">Firmware Status</div>
        <div className="csd-pills">
          <Pill tone="info" icon={Loader}>Upgrading 1</Pill>
          <Pill tone="info" icon={CircleArrowRight}>Upgrade on Next Boot 2</Pill>
          <Pill tone="mute" icon={Info}>Ready for Upgrade 2</Pill>
          <Pill tone="mute" icon={Calendar}>Upgrade Scheduled 2</Pill>
          <Pill tone="bad" icon={OctagonAlert}>Failed 2</Pill>
        </div>
      </div>
      <div className="csd-metric csd-metric--cut">
        <div className="csd-metric-title">Lifecycle</div>
        <div className="csd-pills">
          <Pill tone="ok" icon={CircleCheck}>OK 1502</Pill>
          <Pill tone="bad" icon={OctagonAlert}>Discovery Failed 4</Pill>
          <Pill tone="bad" icon={OctagonAlert}>Replaced 2</Pill>
          <Pill tone="bad" icon={OctagonAlert}>Removed 2</Pill>
        </div>
      </div>
      <div className="csd-metric-tools">
        <Minimize2 {...ICON} />
        <MoveRight {...ICON} />
        <MoveLeft {...ICON} style={{ opacity: 0.4 }} />
      </div>
    </div>
  )
}

function Table() {
  return (
    <div className="csd-table">
      <div className="csd-tr csd-th">
        <i className="csd-box" />
        {COLUMNS.map(col => <span key={col}>{col}<ChevronsUpDown size={12} strokeWidth={2} /></span>)}
        <Zap size={14} strokeWidth={1.75} />
      </div>
      {ROWS.map(row => {
        const [tone, label, glyph] = HEALTH[row.health]
        return (
          <div className="csd-tr" key={row.name}>
            <i className="csd-box" />
            <span className="csd-name" data-off={row.off || undefined}><Power {...SMALL} />{row.name}</span>
            <span><Pill tone={tone} icon={glyph}>{label}</Pill></span>
            <span><Pill tone={row.life[0]} icon={row.life[2]}>{row.life[1]}</Pill></span>
            <span>{row.contract ? <Pill tone={row.contract[0]} icon={row.contract[2]}>{row.contract[1]}</Pill> : '-'}</span>
            <span>{row.model}</span>
            <span className="csd-link">{row.domain ?? '-'}</span>
            <span><Pill tone={row.hcl[0]}>{row.hcl[1]}</Pill></span>
            <span>{row.status ? <Pill tone={row.status[0]} icon={row.status[2]}>{row.status[1]}</Pill> : '-'}</span>
            <span className="csd-fw">{row.fw}{row.note && <row.note {...SMALL} />}</span>
            <Ellipsis size={16} strokeWidth={2} />
          </div>
        )
      })}
    </div>
  )
}

const OPENING = { slots: { firmware: 0, hcl: 1, link: 2 }, out: null, phase: 'ready', count: 0, toast: false }

const inSlot = (slots, n) => Object.keys(slots).find(id => slots[id] === n)

// The card at the front fades, the others close up, and it comes in again behind them.
async function rotate(a, slots, patch = {}) {
  const front = inSlot(slots, 0)
  const closed = { [inSlot(slots, 1)]: 0, [inSlot(slots, 2)]: 1, [front]: 2.04 }
  await a.set({ out: front })
  await a.wait(240)
  await a.set({ slots: closed, ...patch })
  await a.wait(60)
  const next = { ...closed, [front]: 2 }
  await a.set({ slots: next, out: null })
  return next
}

async function script(a) {
  await a.wait(900)
  await a.move('view')
  await a.wait(700)
  await a.move('upgrade')
  await a.wait(350)
  await a.click('upgrade')
  a.mark('upgrading')
  await a.set({ phase: 'upgrading', count: 1 })
  a.move({ x: 500, y: 240 }, { duration: 900 })
  for (let count = 2; count <= 12; count++) {
    await a.wait(300)
    a.put({ count })
  }
  await a.wait(450)
  a.mark('done')
  a.put({ toast: true })
  await a.wait(220)
  a.put({ phase: 'done' })
  await a.wait(2000)
  a.mark('rotated')
  let slots = await rotate(a, OPENING.slots, { phase: 'ready', count: 0 })
  await a.wait(900)
  await a.click('toast-close')
  a.put({ toast: false })
  await a.wait(500)
  await a.move('next')
  await a.wait(200)
  await a.click('next')
  slots = await rotate(a, slots)
  await a.wait(620)
  await a.click('next')
  await rotate(a, slots)
  await a.wait(620)
  await a.move({ x: 1000, y: 620 }, { duration: 900 })
}

export default function ServersDemo() {
  return (
    <Stage
      width={1512}
      height={738}
      initial={OPENING}
      poster={{ ...OPENING, phase: 'done', count: 12, toast: true }}
      script={script}
      cursor={{ at: { x: 1000, y: 620 }, style: 'large', idle: false }}
      fidelity="realistic"
      tokens={{ '--ss-font': 'Inter, system-ui, sans-serif' }}
      className="csd"
    >
      {s => (
        <div className="csd-screen">
          <SideNav />
          <div className="csd-panel csd-insights">
            <div className="csd-title">Servers</div>
            <Minimize2 {...ICON} className="csd-collapse" />
            <div className="csd-sub">Here are the top server insights and recommended actions for today:</div>
            <div className="csd-track">
              {CARDS.map(card => <InsightCard key={card.id} card={card} s={s} />)}
            </div>
            <span className="csd-next" data-target="next" data-cursor="hand"><ChevronRight {...ICON} /></span>
          </div>
          <div className="csd-panel csd-list">
            <div className="csd-tabs">
              <span className="csd-tab"><Asterisk {...ICON} />All Servers<Settings size={13} strokeWidth={1.75} /></span>
              <Plus {...ICON} />
            </div>
            <div className="csd-filters">
              <span className="csd-find"><Search size={14} strokeWidth={1.75} />Search</span>
              <span className="csd-chip">Firmware Status = <b>Outdated</b><X size={12} strokeWidth={2} /></span>
              <span className="csd-link csd-filter"><ListFilter {...SMALL} />Filters</span>
              <span className="csd-results">12 Results</span>
              <span className="csd-link">Reset all</span>
              <span className="csd-export"><Upload {...SMALL} />Export</span>
            </div>
            <Summary />
            <Table />
          </div>
          <TopBar />
          <div className="csd-toast" data-on={s.toast || undefined}>
            <span className="csd-toast-mark"><Check size={11} strokeWidth={3.5} /></span>
            <div>
              <div className="csd-toast-title">Firmware upgrade successful</div>
              <div className="csd-toast-body">12 servers have been upgraded to the latest firmware version.</div>
            </div>
            <span className="csd-toast-close" data-target="toast-close" data-cursor="hand"><X size={15} strokeWidth={2} /></span>
          </div>
        </div>
      )}
    </Stage>
  )
}
