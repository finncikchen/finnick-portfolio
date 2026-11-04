import { useEffect, useState } from 'react'

const format = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit' })

// Seattle's clock, whatever the visitor's own timezone is
export default function LocalTime() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(id)
  }, [])

  return <span style={{ fontVariantNumeric: 'tabular-nums' }}>{format.format(now)}</span>
}
