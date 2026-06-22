/**
 * Pure, dependency-free time utilities for the clock app.
 *
 * - `getTimeInZone` extracts hours/minutes/seconds for an IANA timezone using
 *   the built-in `Intl.DateTimeFormat` (no external deps).
 * - `toAnalogAngles` converts a time-of-day into degrees for analog clock hands.
 * - `LOTR_LOCATIONS` maps fictional Middle-earth places to real IANA timezones.
 */

export interface TimeParts {
  hours: number
  minutes: number
  seconds: number
}

export interface AnalogAngles {
  /** Degrees for the hour hand, 0–360 (0 = 12 o'clock). */
  hour: number
  /** Degrees for the minute hand, 0–360. */
  minute: number
  /** Degrees for the second hand, 0–360. */
  second: number
}

export interface LotrLocation {
  /** Fictional Middle-earth place name. */
  name: string
  /** Real-world IANA timezone backing the location. */
  ianaTimeZone: string
}

/**
 * Fictional Middle-earth locations mapped to real IANA timezones so the clock
 * can display "world clocks" themed around Lord of the Rings.
 */
export const LOTR_LOCATIONS: readonly LotrLocation[] = [
  { name: 'The Shire', ianaTimeZone: 'Europe/London' },
  { name: 'Rivendell', ianaTimeZone: 'Europe/Zurich' },
  { name: 'Gondor', ianaTimeZone: 'Europe/Rome' },
  { name: 'Rohan', ianaTimeZone: 'Europe/Berlin' },
  { name: 'Mordor', ianaTimeZone: 'Asia/Baghdad' },
  { name: 'Lothlórien', ianaTimeZone: 'Europe/Paris' },
  { name: 'Mirkwood', ianaTimeZone: 'Europe/Oslo' },
  { name: 'Erebor', ianaTimeZone: 'Europe/Helsinki' },
  { name: 'Isengard', ianaTimeZone: 'Europe/Dublin' },
  { name: 'The Grey Havens', ianaTimeZone: 'Atlantic/Reykjavik' },
] as const

/**
 * Returns the hours (0–23), minutes (0–59) and seconds (0–59) for the given
 * instant as observed in the supplied IANA timezone.
 *
 * Uses `Intl.DateTimeFormat` with the `timeZone` option, so it correctly
 * accounts for DST and offset without any external dependency.
 *
 * @throws RangeError if `ianaTimeZone` is not a valid IANA timezone.
 */
export function getTimeInZone(date: Date, ianaTimeZone: string): TimeParts {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: ianaTimeZone,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  const parts = formatter.formatToParts(date)

  const get = (type: Intl.DateTimeFormatPartTypes): number => {
    const part = parts.find((p) => p.type === type)
    if (!part) {
      throw new Error(`Missing "${type}" in formatted parts for zone ${ianaTimeZone}`)
    }
    return Number(part.value)
  }

  // `hour12: false` can emit "24" for midnight in some environments; normalize.
  let hours = get('hour')
  if (hours === 24) hours = 0

  return {
    hours,
    minutes: get('minute'),
    seconds: get('second'),
  }
}

/**
 * Converts a time-of-day into degrees for analog clock hands.
 *
 * Angles are measured clockwise from the 12 o'clock position:
 * - The second hand sweeps 360° per 60 seconds (6°/s).
 * - The minute hand sweeps 360° per 60 minutes (6°/min) plus a smooth
 *   contribution from the current seconds.
 * - The hour hand sweeps 360° per 12 hours (30°/h) plus a smooth contribution
 *   from the current minutes (and seconds).
 *
 * All returned angles are normalized to the half-open range [0, 360).
 */
export function toAnalogAngles({ hours, minutes, seconds }: TimeParts): AnalogAngles {
  const second = seconds * 6
  const minute = minutes * 6 + seconds * 0.1
  const hour = (hours % 12) * 30 + minutes * 0.5 + seconds * (0.5 / 60)

  const normalize = (deg: number): number => ((deg % 360) + 360) % 360

  return {
    hour: normalize(hour),
    minute: normalize(minute),
    second: normalize(second),
  }
}
