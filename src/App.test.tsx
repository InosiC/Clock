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
})
