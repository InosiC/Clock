import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, it, expect, vi } from 'vitest'
import App from './App'
import { SOUND_PREFERENCE_KEY } from './hooks/useSoundPreference'

/** Installs an in-memory localStorage stand-in for App-level persistence tests. */
function mockLocalStorage(initial: Record<string, string> = {}) {
  const store = new Map<string, string>(Object.entries(initial))
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
  })
  return store
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('App', () => {
  it('renders the primary clock panel with both clocks', () => {
    render(<App />)

    const panel = screen.getByTestId('clock-panel')
    expect(panel).toBeInTheDocument()
    // Scope to the main panel: the world clock board also renders analog clocks.
    expect(within(panel).getByTestId('analog-clock')).toBeInTheDocument()
    expect(within(panel).getByTestId('digital-clock')).toBeInTheDocument()
  })

  it('renders the Middle-earth world clock board beneath the main clock', () => {
    render(<App />)

    expect(screen.getByTestId('world-clock')).toBeInTheDocument()
    expect(screen.getAllByTestId('world-clock-card').length).toBeGreaterThan(0)
  })

  it('wraps the clock in the Middle-earth map background container', () => {
    render(<App />)

    const background = screen.getByTestId('lotr-background')
    expect(background).toBeInTheDocument()
    expect(background).toHaveClass('lotr-background')
    // The background image is applied inline from the imported map asset.
    expect(background.style.backgroundImage).toContain('url(')
    // The clock panel must live inside the themed background container.
    expect(background).toContainElement(screen.getByTestId('clock-panel'))
  })

  it('renders the sound/format settings controls', () => {
    mockLocalStorage()
    render(<App />)

    expect(screen.getByTestId('sound-toggle')).toBeInTheDocument()
    // Starts muted with the one-time "enable sound" affordance.
    expect(screen.getByTestId('sound-toggle-button')).toHaveAccessibleName(
      /enable sound/i,
    )
    expect(screen.getByTestId('hour-format-button')).toBeInTheDocument()
  })

  it('enables sound and persists the choice when the user clicks enable', () => {
    const store = mockLocalStorage()
    render(<App />)

    fireEvent.click(screen.getByTestId('sound-toggle-button'))

    expect(screen.getByTestId('sound-toggle-button')).toHaveAccessibleName(
      /mute sound/i,
    )
    expect(store.get(SOUND_PREFERENCE_KEY)).toBe('true')
  })

  it('restores an enabled sound preference from localStorage on load', () => {
    mockLocalStorage({ [SOUND_PREFERENCE_KEY]: 'true' })
    render(<App />)

    expect(screen.getByTestId('sound-toggle-button')).toHaveAccessibleName(
      /mute sound/i,
    )
  })

  it('toggles the digital clocks between 24h and 12h', () => {
    mockLocalStorage()
    render(<App />)

    const formatButton = screen.getByTestId('hour-format-button')
    expect(formatButton).toHaveTextContent('24h')

    fireEvent.click(formatButton)

    expect(formatButton).toHaveTextContent('12h')
  })
})
