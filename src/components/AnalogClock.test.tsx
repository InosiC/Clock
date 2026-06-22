import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AnalogClock from './AnalogClock'
import { toAnalogAngles } from '../lib/time'
import { CLOCK_GEOMETRY, MICKEY_COLORS } from './mickeyTheme'

const { center } = CLOCK_GEOMETRY
const rotate = (deg: number) => `rotate(${deg} ${center} ${center})`

describe('AnalogClock', () => {
  it('renders an accessible SVG clock with a face and two ears', () => {
    render(<AnalogClock time={{ hours: 0, minutes: 0, seconds: 0 }} />)

    expect(screen.getByRole('img', { name: /mickey mouse analog clock/i })).toBeInTheDocument()
    expect(screen.getByTestId('clock-face')).toBeInTheDocument()
    expect(screen.getByTestId('ear-left')).toBeInTheDocument()
    expect(screen.getByTestId('ear-right')).toBeInTheDocument()
  })

  it('points all hands to 12 (0deg) at midnight', () => {
    render(<AnalogClock time={{ hours: 0, minutes: 0, seconds: 0 }} />)

    expect(screen.getByTestId('hand-hour')).toHaveAttribute('transform', rotate(0))
    expect(screen.getByTestId('hand-minute')).toHaveAttribute('transform', rotate(0))
    expect(screen.getByTestId('hand-second')).toHaveAttribute('transform', rotate(0))
  })

  it('rotates hands to expected angles for 3:00:00', () => {
    render(<AnalogClock time={{ hours: 3, minutes: 0, seconds: 0 }} />)

    // 3 o'clock -> hour hand at 90deg, minute & second at 0deg.
    expect(screen.getByTestId('hand-hour')).toHaveAttribute('transform', rotate(90))
    expect(screen.getByTestId('hand-minute')).toHaveAttribute('transform', rotate(0))
    expect(screen.getByTestId('hand-second')).toHaveAttribute('transform', rotate(0))
  })

  it('rotates hands using the time util for 9:15:30', () => {
    const time = { hours: 9, minutes: 15, seconds: 30 }
    const expected = toAnalogAngles(time)
    render(<AnalogClock time={time} />)

    expect(screen.getByTestId('hand-hour')).toHaveAttribute('transform', rotate(expected.hour))
    expect(screen.getByTestId('hand-minute')).toHaveAttribute('transform', rotate(expected.minute))
    expect(screen.getByTestId('hand-second')).toHaveAttribute('transform', rotate(expected.second))
  })

  it('accepts pre-computed angles which override time', () => {
    render(
      <AnalogClock
        time={{ hours: 0, minutes: 0, seconds: 0 }}
        angles={{ hour: 120, minute: 240, second: 6 }}
      />,
    )

    expect(screen.getByTestId('hand-hour')).toHaveAttribute('transform', rotate(120))
    expect(screen.getByTestId('hand-minute')).toHaveAttribute('transform', rotate(240))
    expect(screen.getByTestId('hand-second')).toHaveAttribute('transform', rotate(6))
  })

  it('applies the Mickey palette to the second hand and face', () => {
    render(<AnalogClock time={{ hours: 0, minutes: 0, seconds: 0 }} />)

    expect(screen.getByTestId('hand-second')).toHaveAttribute('stroke', MICKEY_COLORS.red)
    expect(screen.getByTestId('clock-face')).toHaveAttribute('fill', MICKEY_COLORS.white)
    expect(screen.getByTestId('ear-left')).toHaveAttribute('fill', MICKEY_COLORS.black)
  })

  it('respects the size prop', () => {
    render(<AnalogClock time={{ hours: 0, minutes: 0, seconds: 0 }} size={400} />)

    const svg = screen.getByTestId('analog-clock')
    expect(svg).toHaveAttribute('width', '400')
    expect(svg).toHaveAttribute('height', '400')
  })
})
