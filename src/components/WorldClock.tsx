import { useMemo } from 'react'
import { useClock } from '../hooks/useClock'
import {
  LOTR_LOCATIONS,
  formatDigital,
  getTimeInZone,
  type LotrLocation,
  type TimeParts,
} from '../lib/time'
import { MICKEY_COLORS } from './mickeyTheme'
import AnalogClock from './AnalogClock'

/**
 * Props for {@link WorldClock}.
 */
export interface WorldClockProps {
  /**
   * Locations to render, one card each. Defaults to the shared
   * {@link LOTR_LOCATIONS} list of Middle-earth places.
   */
  locations?: readonly LotrLocation[]
  /** When true, render each card's digital readout in 12-hour mode. */
  hour12?: boolean
  /** Pixel size for the mini analog clock on each card. */
  size?: number
  /**
   * Optional provider for the "current" instant, forwarded to {@link useClock}.
   * Injecting a fixed provider keeps tests deterministic regardless of host zone.
   */
  now?: () => Date
}

/**
 * Props for an individual {@link WorldClockCard}.
 */
interface WorldClockCardProps {
  location: LotrLocation
  /** Shared clock instant used to compute the location's local time. */
  date: Date
  hour12: boolean
  size: number
}

/**
 * A small clock card for a single Middle-earth location: the place name, a
 * digital HH:MM:SS readout and a mini Mickey analog clock, all derived from the
 * supplied shared `date` via {@link getTimeInZone}.
 */
function WorldClockCard({ location, date, hour12, size }: WorldClockCardProps) {
  const time: TimeParts = useMemo(
    () => getTimeInZone(date, location.ianaTimeZone),
    [date, location.ianaTimeZone],
  )
  const { text } = useMemo(() => formatDigital(time, hour12), [time, hour12])

  return (
    <article
      data-testid="world-clock-card"
      data-location={location.name}
      data-zone={location.ianaTimeZone}
      aria-label={`${location.name} clock`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.75rem',
        borderRadius: '0.6rem',
        background: MICKEY_COLORS.cream,
        border: `2px solid ${MICKEY_COLORS.black}`,
        minWidth: '7rem',
      }}
    >
      <span
        data-testid="world-clock-name"
        style={{ fontWeight: 700, color: MICKEY_COLORS.black }}
      >
        {location.name}
      </span>
      <AnalogClock time={time} size={size} label={`${location.name} analog clock`} />
      <span
        data-testid="world-clock-time"
        role="timer"
        aria-label={`${location.name} time`}
        style={{
          fontFamily: '"Courier New", ui-monospace, monospace',
          fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
          color: MICKEY_COLORS.black,
        }}
      >
        {text}
      </span>
    </article>
  )
}

/**
 * Renders a board of small clock cards, one per configured Middle-earth
 * location. Every card is driven by a single shared {@link useClock} `Date`, so
 * all locations stay in sync while showing their own zone-local time computed
 * via {@link getTimeInZone}.
 *
 * Intended to sit beneath (or around) the main {@link ClockPanel} clock.
 */
export function WorldClock({
  locations = LOTR_LOCATIONS,
  hour12 = false,
  size = 80,
  now,
}: WorldClockProps) {
  const date = useClock(now ?? (() => new Date()))

  return (
    <section
      data-testid="world-clock"
      aria-label="Middle-earth world clocks"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1rem',
        width: '100%',
        maxWidth: '60rem',
        margin: '0 auto',
        padding: '1rem',
      }}
    >
      {locations.map((location) => (
        <WorldClockCard
          key={location.name}
          location={location}
          date={date}
          hour12={hour12}
          size={size}
        />
      ))}
    </section>
  )
}

export default WorldClock
