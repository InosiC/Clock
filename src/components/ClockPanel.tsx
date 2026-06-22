import { useMemo } from 'react'
import { useClock } from '../hooks/useClock'
import { getTimeInZone, type TimeParts } from '../lib/time'
import AnalogClock from './AnalogClock'
import DigitalClock from './DigitalClock'

/**
 * Props for {@link ClockPanel}.
 */
export interface ClockPanelProps {
  /**
   * IANA timezone to display. Defaults to the user's local timezone resolved
   * via `Intl.DateTimeFormat().resolvedOptions().timeZone`.
   */
  timeZone?: string
  /** When true, render the digital readout in 12-hour mode with AM/PM. */
  hour12?: boolean
  /** Rendered pixel size forwarded to {@link AnalogClock}. */
  size?: number
}

/** Resolve the user's local IANA timezone, falling back to UTC. */
function resolveLocalTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

/**
 * The primary clock view: wires {@link useClock} to both {@link AnalogClock}
 * and {@link DigitalClock} for the user's local timezone, presenting them
 * together as the main Mickey Mouse clock.
 *
 * Layout is responsive and centred so the panel sits comfortably over a
 * themed background added later.
 */
export function ClockPanel({ timeZone, hour12 = false, size = 240 }: ClockPanelProps) {
  const now = useClock()

  const zone = timeZone ?? resolveLocalTimeZone()
  const time: TimeParts = useMemo(() => getTimeInZone(now, zone), [now, zone])

  return (
    <section
      data-testid="clock-panel"
      aria-label="Mickey Mouse clock"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        width: '100%',
        maxWidth: '32rem',
        margin: '0 auto',
        padding: '1rem',
        textAlign: 'center',
      }}
    >
      <AnalogClock time={time} size={size} />
      <DigitalClock time={time} hour12={hour12} />
    </section>
  )
}

export default ClockPanel
