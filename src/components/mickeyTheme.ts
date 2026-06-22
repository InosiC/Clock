/**
 * Styled constants for the Mickey Mouse themed analog clock.
 *
 * Colors and geometry live here (rather than inline in the component) so the
 * palette can be reused across components and tweaked in one place. The classic
 * Mickey watch palette is red / white / black with a yellow glove accent.
 */

export const MICKEY_COLORS = {
  /** Classic Mickey red used for the second hand and rim accents. */
  red: '#e2231a',
  /** White clock face. */
  white: '#ffffff',
  /** Black body, ears and hour/minute hands. */
  black: '#1a1a1a',
  /** Yellow glove cuff / hub accent. */
  yellow: '#ffd200',
  /** Soft outer ring tint. */
  cream: '#fff7e6',
} as const

/**
 * Geometry for the SVG viewBox. The clock is drawn in a 100x100 coordinate
 * space centred at (50, 50) so callers can scale freely via the `size` prop.
 */
export const CLOCK_GEOMETRY = {
  viewBox: 100,
  center: 50,
  faceRadius: 42,
  earRadius: 18,
  /** Ear centre offset from the face centre (both x and y). */
  earOffset: 34,
  hourHandLength: 22,
  minuteHandLength: 32,
  secondHandLength: 36,
  hubRadius: 4,
} as const

export type MickeyColor = keyof typeof MICKEY_COLORS
