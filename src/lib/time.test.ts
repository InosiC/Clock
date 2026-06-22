import { describe, it, expect } from 'vitest'
import {
  getTimeInZone,
  toAnalogAngles,
  formatDigital,
  LOTR_LOCATIONS,
  type TimeParts,
} from './time'

describe('toAnalogAngles', () => {
  it('returns all zeros at 12:00:00', () => {
    expect(toAnalogAngles({ hours: 0, minutes: 0, seconds: 0 })).toEqual({
      hour: 0,
      minute: 0,
      second: 0,
    })
  })

  it('places the second hand at 6 degrees per second', () => {
    expect(toAnalogAngles({ hours: 0, minutes: 0, seconds: 1 }).second).toBe(6)
    expect(toAnalogAngles({ hours: 0, minutes: 0, seconds: 30 }).second).toBe(180)
    expect(toAnalogAngles({ hours: 0, minutes: 0, seconds: 45 }).second).toBe(270)
  })

  it('places the minute hand at 6 degrees per minute', () => {
    expect(toAnalogAngles({ hours: 0, minutes: 15, seconds: 0 }).minute).toBe(90)
    expect(toAnalogAngles({ hours: 0, minutes: 30, seconds: 0 }).minute).toBe(180)
    expect(toAnalogAngles({ hours: 0, minutes: 45, seconds: 0 }).minute).toBe(270)
  })

  it('advances the minute hand smoothly with seconds (0.1 deg/s)', () => {
    expect(toAnalogAngles({ hours: 0, minutes: 0, seconds: 30 }).minute).toBeCloseTo(3, 10)
    expect(toAnalogAngles({ hours: 0, minutes: 10, seconds: 30 }).minute).toBeCloseTo(63, 10)
  })

  it('places the hour hand at 30 degrees per hour', () => {
    expect(toAnalogAngles({ hours: 3, minutes: 0, seconds: 0 }).hour).toBe(90)
    expect(toAnalogAngles({ hours: 6, minutes: 0, seconds: 0 }).hour).toBe(180)
    expect(toAnalogAngles({ hours: 9, minutes: 0, seconds: 0 }).hour).toBe(270)
  })

  it('advances the hour hand smoothly with minutes (0.5 deg/min)', () => {
    // 3:30 -> 90 + 15 = 105
    expect(toAnalogAngles({ hours: 3, minutes: 30, seconds: 0 }).hour).toBeCloseTo(105, 10)
    // 12:30 -> wraps hour to 0 -> 0 + 15 = 15
    expect(toAnalogAngles({ hours: 12, minutes: 30, seconds: 0 }).hour).toBeCloseTo(15, 10)
  })

  it('advances the hour hand with seconds (0.5/60 deg/s)', () => {
    // 0:00:60-equivalent: at 1 minute the hour hand moved 0.5 deg.
    const angles = toAnalogAngles({ hours: 0, minutes: 0, seconds: 60 })
    expect(angles.hour).toBeCloseTo(0.5, 10)
  })

  it('wraps 12-hour and 24-hour values onto the same position', () => {
    expect(toAnalogAngles({ hours: 12, minutes: 0, seconds: 0 }).hour).toBe(0)
    expect(toAnalogAngles({ hours: 15, minutes: 0, seconds: 0 }).hour).toBe(90)
    expect(toAnalogAngles({ hours: 23, minutes: 0, seconds: 0 }).hour).toBe(330)
  })

  it('normalizes all angles into [0, 360)', () => {
    const samples: TimeParts[] = [
      { hours: 0, minutes: 0, seconds: 0 },
      { hours: 11, minutes: 59, seconds: 59 },
      { hours: 23, minutes: 59, seconds: 59 },
      { hours: 13, minutes: 37, seconds: 42 },
    ]
    for (const t of samples) {
      const { hour, minute, second } = toAnalogAngles(t)
      for (const angle of [hour, minute, second]) {
        expect(angle).toBeGreaterThanOrEqual(0)
        expect(angle).toBeLessThan(360)
      }
    }
  })
})

describe('formatDigital', () => {
  it('formats 24-hour time with zero-padding by default', () => {
    expect(formatDigital({ hours: 9, minutes: 5, seconds: 3 })).toEqual({
      text: '09:05:03',
      time: '09:05:03',
    })
  })

  it('zero-pads single-digit hours, minutes and seconds', () => {
    expect(formatDigital({ hours: 1, minutes: 2, seconds: 9 }).time).toBe('01:02:09')
  })

  it('formats midnight and just-before-midnight in 24-hour mode', () => {
    expect(formatDigital({ hours: 0, minutes: 0, seconds: 0 }).time).toBe('00:00:00')
    expect(formatDigital({ hours: 23, minutes: 59, seconds: 59 }).time).toBe('23:59:59')
  })

  it('omits the period in 24-hour mode', () => {
    expect(formatDigital({ hours: 13, minutes: 0, seconds: 0 }).period).toBeUndefined()
  })

  it('formats 12-hour time with an AM period before noon', () => {
    expect(formatDigital({ hours: 9, minutes: 5, seconds: 3 }, true)).toEqual({
      text: '9:05:03 AM',
      time: '09:05:03',
      period: 'AM',
    })
  })

  it('formats 12-hour time with a PM period in the afternoon', () => {
    expect(formatDigital({ hours: 15, minutes: 7, seconds: 0 }, true)).toEqual({
      text: '3:07:00 PM',
      time: '15:07:00',
      period: 'PM',
    })
  })

  it('renders midnight as 12 AM and noon as 12 PM', () => {
    expect(formatDigital({ hours: 0, minutes: 0, seconds: 0 }, true).text).toBe('12:00:00 AM')
    expect(formatDigital({ hours: 12, minutes: 0, seconds: 0 }, true).text).toBe('12:00:00 PM')
  })

  it('still zero-pads minutes and seconds in 12-hour mode', () => {
    expect(formatDigital({ hours: 1, minutes: 4, seconds: 6 }, true).text).toBe('1:04:06 AM')
  })
})

describe('getTimeInZone', () => {
  // A fixed instant: 2024-01-15T12:00:00Z (winter, so no DST in Europe).
  const fixed = new Date('2024-01-15T12:00:00.000Z')

  it('returns UTC time for the UTC zone', () => {
    expect(getTimeInZone(fixed, 'UTC')).toEqual({
      hours: 12,
      minutes: 0,
      seconds: 0,
    })
  })

  it('applies a positive offset (London is UTC+0 in winter)', () => {
    expect(getTimeInZone(fixed, 'Europe/London')).toEqual({
      hours: 12,
      minutes: 0,
      seconds: 0,
    })
  })

  it('applies a +1 offset (Berlin is UTC+1 in winter)', () => {
    expect(getTimeInZone(fixed, 'Europe/Berlin')).toEqual({
      hours: 13,
      minutes: 0,
      seconds: 0,
    })
  })

  it('applies a +3 offset (Baghdad / Mordor is UTC+3)', () => {
    expect(getTimeInZone(fixed, 'Asia/Baghdad')).toEqual({
      hours: 15,
      minutes: 0,
      seconds: 0,
    })
  })

  it('applies a negative offset (New York is UTC-5 in winter)', () => {
    expect(getTimeInZone(fixed, 'America/New_York')).toEqual({
      hours: 7,
      minutes: 0,
      seconds: 0,
    })
  })

  it('preserves minutes and seconds', () => {
    const instant = new Date('2024-06-15T08:34:56.000Z')
    expect(getTimeInZone(instant, 'UTC')).toEqual({
      hours: 8,
      minutes: 34,
      seconds: 56,
    })
  })

  it('normalizes midnight to hour 0 rather than 24', () => {
    const midnightUtc = new Date('2024-03-10T00:00:00.000Z')
    expect(getTimeInZone(midnightUtc, 'UTC').hours).toBe(0)
  })

  it('throws for an invalid timezone', () => {
    expect(() => getTimeInZone(fixed, 'Not/AZone')).toThrow()
  })
})

describe('LOTR_LOCATIONS', () => {
  it('contains the canonical Middle-earth places', () => {
    const names = LOTR_LOCATIONS.map((l) => l.name)
    expect(names).toContain('The Shire')
    expect(names).toContain('Mordor')
    expect(names).toContain('Rivendell')
    expect(names).toContain('Gondor')
  })

  it('maps every location to a usable IANA timezone', () => {
    const fixed = new Date('2024-01-15T12:00:00.000Z')
    for (const loc of LOTR_LOCATIONS) {
      expect(typeof loc.ianaTimeZone).toBe('string')
      expect(loc.ianaTimeZone.length).toBeGreaterThan(0)
      // Each timezone must be valid enough for getTimeInZone to succeed.
      expect(() => getTimeInZone(fixed, loc.ianaTimeZone)).not.toThrow()
    }
  })

  it('has unique location names', () => {
    const names = LOTR_LOCATIONS.map((l) => l.name)
    expect(new Set(names).size).toBe(names.length)
  })
})
