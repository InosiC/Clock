import { formatDigital, type TimeParts } from '../lib/time'
import { MICKEY_COLORS } from './mickeyTheme'

/**
 * Props for {@link DigitalClock}.
 */
export interface DigitalClockProps {
  /** Time-of-day to display ({ hours, minutes, seconds }). */
  time: TimeParts
  /** When true, render 12-hour time with an AM/PM suffix. Defaults to false (24h). */
  hour12?: boolean
  /** Accessible label for the clock. */
  label?: string
}

/**
 * Digital HH:MM:SS readout styled to complement the Mickey Mouse analog clock.
 *
 * Minutes and seconds are always zero-padded; with `hour12` the hour is shown
 * 1–12 with an AM/PM period. All formatting is delegated to {@link formatDigital}
 * so the digital and analog clocks share a single source of truth.
 *
 * Designed to sit visually beside {@link AnalogClock} using the shared
 * {@link MICKEY_COLORS} palette (cream face, black text, red accent).
 */
export function DigitalClock({
  time,
  hour12 = false,
  label = 'Mickey Mouse digital clock',
}: DigitalClockProps) {
  const { text, time: time24, period } = formatDigital(time, hour12)
  // Show the clock string without the trailing period (the period is rendered
  // as a separate accent span). In 24h mode this is just the HH:MM:SS value.
  const timeText = period ? text.slice(0, text.length - period.length - 1) : time24

  return (
    <div
      role="timer"
      aria-label={label}
      data-testid="digital-clock"
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: '0.4ch',
        padding: '0.4em 0.8em',
        borderRadius: '0.6em',
        fontFamily: '"Courier New", ui-monospace, monospace',
        fontWeight: 700,
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '0.05em',
        color: MICKEY_COLORS.black,
        background: MICKEY_COLORS.cream,
        border: `2px solid ${MICKEY_COLORS.red}`,
      }}
    >
      <span data-testid="digital-time" style={{ fontSize: '2rem', lineHeight: 1 }}>
        {timeText}
      </span>
      {period && (
        <span
          data-testid="digital-period"
          style={{ fontSize: '1rem', color: MICKEY_COLORS.red }}
        >
          {period}
        </span>
      )}
    </div>
  )
}

export default DigitalClock
