import { render, screen, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import WorldClock from './WorldClock'
import {
  LOTR_LOCATIONS,
  formatDigital,
  getTimeInZone,
  type LotrLocation,
} from '../lib/time'

// A fixed instant keeps every assertion deterministic regardless of host zone:
// 2024-01-15T12:00:00Z.
const FIXED_INSTANT = new Date('2024-01-15T12:00:00Z')
const fixedNow = () => FIXED_INSTANT

describe('WorldClock', () => {
  it('renders exactly one card per configured location', () => {
    render(<WorldClock now={fixedNow} />)

    const cards = screen.getAllByTestId('world-clock-card')
    expect(cards).toHaveLength(LOTR_LOCATIONS.length)
  })

  it('labels each card with its Middle-earth location name', () => {
    render(<WorldClock now={fixedNow} />)

    for (const { name } of LOTR_LOCATIONS) {
      expect(screen.getByText(name)).toBeInTheDocument()
    }
  })

  it('shows each location time computed for its own IANA zone', () => {
    render(<WorldClock now={fixedNow} />)

    for (const { name, ianaTimeZone } of LOTR_LOCATIONS) {
      const card = screen
        .getAllByTestId('world-clock-card')
        .find((el) => el.getAttribute('data-location') === name)!
      expect(card).toBeDefined()

      const expected = formatDigital(getTimeInZone(FIXED_INSTANT, ianaTimeZone)).text
      expect(within(card).getByTestId('world-clock-time')).toHaveTextContent(expected)
    }
  })

  it('reflects different times for zones with different offsets', () => {
    render(<WorldClock now={fixedNow} />)

    // The Shire (Europe/London, UTC+0 in January) vs Mordor (Asia/Baghdad,
    // UTC+3) must differ for the same shared instant.
    const shire = formatDigital(getTimeInZone(FIXED_INSTANT, 'Europe/London')).text
    const mordor = formatDigital(getTimeInZone(FIXED_INSTANT, 'Asia/Baghdad')).text
    expect(shire).not.toEqual(mordor)
  })

  it('honours a custom list of locations', () => {
    const custom: LotrLocation[] = [
      { name: 'Hobbiton', ianaTimeZone: 'UTC' },
      { name: 'Bree', ianaTimeZone: 'Asia/Tokyo' },
    ]
    render(<WorldClock locations={custom} now={fixedNow} />)

    const cards = screen.getAllByTestId('world-clock-card')
    expect(cards).toHaveLength(2)
    expect(screen.getByText('Hobbiton')).toBeInTheDocument()
    expect(screen.getByText('Bree')).toBeInTheDocument()
  })

  it('renders a mini analog clock per card', () => {
    render(<WorldClock now={fixedNow} />)

    expect(screen.getAllByTestId('analog-clock')).toHaveLength(LOTR_LOCATIONS.length)
  })
})
