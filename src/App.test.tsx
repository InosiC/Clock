import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the primary clock panel with both clocks', () => {
    render(<App />)

    expect(screen.getByTestId('clock-panel')).toBeInTheDocument()
    expect(screen.getByTestId('analog-clock')).toBeInTheDocument()
    expect(screen.getByTestId('digital-clock')).toBeInTheDocument()
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
