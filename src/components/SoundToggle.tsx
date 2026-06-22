import { MICKEY_COLORS } from './mickeyTheme'

/**
 * Props for {@link SoundToggle}.
 */
export interface SoundToggleProps {
  /** Whether sound is currently enabled (unmuted). */
  soundEnabled: boolean
  /** Toggle the sound on/off. Invoked on user gesture so audio can autoplay. */
  onToggleSound: () => void
  /** Whether the digital clocks are in 12-hour mode. */
  hour12: boolean
  /** Toggle between 12-hour and 24-hour display. */
  onToggleHour12: () => void
}

const buttonBaseStyle: React.CSSProperties = {
  fontFamily: '"Courier New", ui-monospace, monospace',
  fontWeight: 700,
  fontSize: '0.95rem',
  padding: '0.45em 0.9em',
  borderRadius: '0.6em',
  border: `2px solid ${MICKEY_COLORS.black}`,
  cursor: 'pointer',
  color: MICKEY_COLORS.black,
  background: MICKEY_COLORS.cream,
}

/**
 * Settings controls for the clock: a sound on/off button and a 12h/24h format
 * toggle.
 *
 * The sound button doubles as the one-time "enable sound" affordance required
 * by browser autoplay policies — because the user clicks it (a gesture),
 * subsequent hourly chimes are allowed to play. When muted it invites the user
 * to enable sound; when enabled it offers to mute. Both controls are fully
 * controlled by the parent so the persisted preferences live in one place.
 */
export function SoundToggle({
  soundEnabled,
  onToggleSound,
  hour12,
  onToggleHour12,
}: SoundToggleProps) {
  return (
    <section
      data-testid="sound-toggle"
      aria-label="Clock settings"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '0.5rem',
      }}
    >
      <button
        type="button"
        data-testid="sound-toggle-button"
        onClick={onToggleSound}
        aria-pressed={soundEnabled}
        aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
        style={{
          ...buttonBaseStyle,
          background: soundEnabled ? MICKEY_COLORS.yellow : MICKEY_COLORS.cream,
        }}
      >
        {soundEnabled ? '🔊 Sound on' : '🔇 Enable sound'}
      </button>

      <button
        type="button"
        data-testid="hour-format-button"
        onClick={onToggleHour12}
        aria-pressed={hour12}
        aria-label={
          hour12 ? 'Switch to 24-hour time' : 'Switch to 12-hour time'
        }
        style={buttonBaseStyle}
      >
        {hour12 ? '12h' : '24h'}
      </button>
    </section>
  )
}

export default SoundToggle
