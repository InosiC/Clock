import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import DigitalClock from './DigitalClock'
import { MICKEY_COLORS } from './mickeyTheme'

describe('DigitalClock', () => {
  it('renders an accessible timer region', () => {
    render(<DigitalClock time={{ hours: 9, minutes: 5, seconds: 3 }} />)

    expect(
      screen.getByRole('timer', { name: /mickey mouse digital clock/i }),
    ).toBeInTheDocument()
  })

  it('formats 24-hour time with zero padding by default', () => {
    render(<DigitalClock time={{ hours: 9, minutes: 5, seconds: 3 }} />)

    expect(screen.getByTestId('digital-time')).toHaveTextContent('09:05:03')
    expect(screen.queryByTestId('digital-period')).not.toBeInTheDocument()
  })

  it('zero-pads single-digit hours, minutes and seconds', () => {
    render(<DigitalClock time={{ hours: 1, minutes: 2, seconds: 9 }} />)

    expect(screen.getByTestId('digital-time')).toHaveTextContent('01:02:09')
  })

  it('renders midnight as 00:00:00 in 24-hour mode', () => {
    render(<DigitalClock time={{ hours: 0, minutes: 0, seconds: 0 }} />)

    expect(screen.getByTestId('digital-time')).toHaveTextContent('00:00:00')
  })

  it('renders an afternoon time in 24-hour mode', () => {
    render(<DigitalClock time={{ hours: 23, minutes: 59, seconds: 58 }} />)

    expect(screen.getByTestId('digital-time')).toHaveTextContent('23:59:58')
  })

  it('renders 12-hour time with an AM period before noon', () => {
    render(<DigitalClock time={{ hours: 9, minutes: 5, seconds: 3 }} hour12 />)

    expect(screen.getByTestId('digital-time')).toHaveTextContent('9:05:03')
    expect(screen.getByTestId('digital-period')).toHaveTextContent('AM')
  })

  it('renders 12-hour time with a PM period in the afternoon', () => {
    render(<DigitalClock time={{ hours: 15, minutes: 7, seconds: 0 }} hour12 />)

    expect(screen.getByTestId('digital-time')).toHaveTextContent('3:07:00')
    expect(screen.getByTestId('digital-period')).toHaveTextContent('PM')
  })

  it('renders midnight as 12:00:00 AM in 12-hour mode', () => {
    render(<DigitalClock time={{ hours: 0, minutes: 0, seconds: 0 }} hour12 />)

    expect(screen.getByTestId('digital-time')).toHaveTextContent('12:00:00')
    expect(screen.getByTestId('digital-period')).toHaveTextContent('AM')
  })

  it('renders noon as 12:00:00 PM in 12-hour mode', () => {
    render(<DigitalClock time={{ hours: 12, minutes: 0, seconds: 0 }} hour12 />)

    expect(screen.getByTestId('digital-time')).toHaveTextContent('12:00:00')
    expect(screen.getByTestId('digital-period')).toHaveTextContent('PM')
  })

  it('applies the Mickey palette accent to the period suffix', () => {
    render(<DigitalClock time={{ hours: 9, minutes: 5, seconds: 3 }} hour12 />)

    expect(screen.getByTestId('digital-period')).toHaveStyle({
      color: MICKEY_COLORS.red,
    })
  })
})
