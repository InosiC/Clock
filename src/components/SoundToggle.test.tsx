import { fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SoundToggle from './SoundToggle'

describe('SoundToggle', () => {
  function setup(overrides: Partial<React.ComponentProps<typeof SoundToggle>> = {}) {
    const props = {
      soundEnabled: false,
      onToggleSound: vi.fn(),
      hour12: false,
      onToggleHour12: vi.fn(),
      ...overrides,
    }
    render(<SoundToggle {...props} />)
    return props
  }

  it('renders an "enable sound" affordance when muted', () => {
    setup({ soundEnabled: false })

    const button = screen.getByTestId('sound-toggle-button')
    expect(button).toHaveAccessibleName(/enable sound/i)
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(button).toHaveTextContent(/enable sound/i)
  })

  it('reflects the enabled state with a mute affordance', () => {
    setup({ soundEnabled: true })

    const button = screen.getByTestId('sound-toggle-button')
    expect(button).toHaveAccessibleName(/mute sound/i)
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(button).toHaveTextContent(/sound on/i)
  })

  it('invokes onToggleSound when the sound button is clicked', () => {
    const props = setup({ soundEnabled: false })

    fireEvent.click(screen.getByTestId('sound-toggle-button'))

    expect(props.onToggleSound).toHaveBeenCalledTimes(1)
  })

  it('renders the 24h label when in 24-hour mode', () => {
    setup({ hour12: false })

    const button = screen.getByTestId('hour-format-button')
    expect(button).toHaveTextContent('24h')
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(button).toHaveAccessibleName(/switch to 12-hour time/i)
  })

  it('renders the 12h label when in 12-hour mode', () => {
    setup({ hour12: true })

    const button = screen.getByTestId('hour-format-button')
    expect(button).toHaveTextContent('12h')
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(button).toHaveAccessibleName(/switch to 24-hour time/i)
  })

  it('invokes onToggleHour12 when the format button is clicked', () => {
    const props = setup()

    fireEvent.click(screen.getByTestId('hour-format-button'))

    expect(props.onToggleHour12).toHaveBeenCalledTimes(1)
    expect(props.onToggleSound).not.toHaveBeenCalled()
  })
})
