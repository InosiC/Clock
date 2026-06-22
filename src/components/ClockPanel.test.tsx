import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ClockPanel from './ClockPanel'

describe('ClockPanel', () => {
  it('renders both the analog and digital sub-components', () => {
    render(<ClockPanel />)

    expect(screen.getByTestId('clock-panel')).toBeInTheDocument()
    expect(screen.getByTestId('analog-clock')).toBeInTheDocument()
    expect(screen.getByTestId('digital-clock')).toBeInTheDocument()
  })

  it('exposes an accessible analog and digital clock', () => {
    render(<ClockPanel />)

    expect(
      screen.getByRole('img', { name: /mickey mouse analog clock/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('timer', { name: /mickey mouse digital clock/i }),
    ).toBeInTheDocument()
  })

  it('honours an explicit timezone for both clocks', () => {
    // UTC keeps the rendered time deterministic regardless of host zone.
    render(<ClockPanel timeZone="UTC" />)

    expect(screen.getByTestId('digital-time')).toBeInTheDocument()
    expect(screen.getByTestId('analog-clock')).toBeInTheDocument()
  })
})
