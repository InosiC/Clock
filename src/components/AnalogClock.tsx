import { toAnalogAngles, type AnalogAngles, type TimeParts } from '../lib/time'
import { CLOCK_GEOMETRY, MICKEY_COLORS } from './mickeyTheme'

/**
 * Props for {@link AnalogClock}.
 *
 * You may supply either:
 * - a `time` ({ hours, minutes, seconds }) which is converted to hand angles
 *   via {@link toAnalogAngles}, or
 * - pre-computed `angles` (degrees clockwise from 12 o'clock).
 *
 * If both are provided, `angles` wins.
 */
export interface AnalogClockProps {
  /** Time-of-day used to derive hand angles when `angles` is not given. */
  time?: TimeParts
  /** Pre-computed hand angles in degrees (overrides `time`). */
  angles?: AnalogAngles
  /** Rendered pixel size of the square SVG. Defaults to 240. */
  size?: number
  /** Accessible label for the clock. */
  label?: string
}

const { center, faceRadius, earRadius, earOffset, hourHandLength, minuteHandLength, secondHandLength, hubRadius, viewBox } =
  CLOCK_GEOMETRY

/**
 * SVG analog clock face styled as a classic Mickey Mouse watch.
 *
 * The face wears Mickey's two black ears, a red/white/black palette and a
 * yellow glove-style hub. Hands are positioned by rotating them around the
 * centre of the face; the rotation (in degrees) is exposed as the inline
 * `transform` so it is straightforward to assert in tests.
 */
export function AnalogClock({
  time,
  angles,
  size = 240,
  label = 'Mickey Mouse analog clock',
}: AnalogClockProps) {
  const resolved: AnalogAngles =
    angles ?? toAnalogAngles(time ?? { hours: 0, minutes: 0, seconds: 0 })

  return (
    <svg
      role="img"
      aria-label={label}
      width={size}
      height={size}
      viewBox={`0 0 ${viewBox} ${viewBox}`}
      data-testid="analog-clock"
    >
      {/* Mickey's ears sit behind the face. */}
      <circle
        data-testid="ear-left"
        cx={center - earOffset}
        cy={center - earOffset}
        r={earRadius}
        fill={MICKEY_COLORS.black}
      />
      <circle
        data-testid="ear-right"
        cx={center + earOffset}
        cy={center - earOffset}
        r={earRadius}
        fill={MICKEY_COLORS.black}
      />

      {/* Outer black rim + white face. */}
      <circle cx={center} cy={center} r={faceRadius + 3} fill={MICKEY_COLORS.black} />
      <circle
        data-testid="clock-face"
        cx={center}
        cy={center}
        r={faceRadius}
        fill={MICKEY_COLORS.white}
        stroke={MICKEY_COLORS.red}
        strokeWidth={2}
      />

      {/* Hour ticks. */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 * Math.PI) / 180
        const outer = faceRadius - 2
        const inner = faceRadius - 7
        return (
          <line
            key={i}
            data-testid={`tick-${i}`}
            x1={center + outer * Math.sin(angle)}
            y1={center - outer * Math.cos(angle)}
            x2={center + inner * Math.sin(angle)}
            y2={center - inner * Math.cos(angle)}
            stroke={MICKEY_COLORS.black}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        )
      })}

      {/* Hour hand (black, glove-cuff styled). */}
      <line
        data-testid="hand-hour"
        x1={center}
        y1={center}
        x2={center}
        y2={center - hourHandLength}
        stroke={MICKEY_COLORS.black}
        strokeWidth={4}
        strokeLinecap="round"
        transform={`rotate(${resolved.hour} ${center} ${center})`}
      />

      {/* Minute hand (black). */}
      <line
        data-testid="hand-minute"
        x1={center}
        y1={center}
        x2={center}
        y2={center - minuteHandLength}
        stroke={MICKEY_COLORS.black}
        strokeWidth={3}
        strokeLinecap="round"
        transform={`rotate(${resolved.minute} ${center} ${center})`}
      />

      {/* Second hand (Mickey red). */}
      <line
        data-testid="hand-second"
        x1={center}
        y1={center + 6}
        x2={center}
        y2={center - secondHandLength}
        stroke={MICKEY_COLORS.red}
        strokeWidth={1.5}
        strokeLinecap="round"
        transform={`rotate(${resolved.second} ${center} ${center})`}
      />

      {/* Yellow glove-style centre hub. */}
      <circle
        data-testid="clock-hub"
        cx={center}
        cy={center}
        r={hubRadius}
        fill={MICKEY_COLORS.yellow}
        stroke={MICKEY_COLORS.black}
        strokeWidth={1}
      />
    </svg>
  )
}

export default AnalogClock
