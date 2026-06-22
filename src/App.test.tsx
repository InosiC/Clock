import { render, screen, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

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
})
