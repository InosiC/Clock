import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useClock } from './useClock'

describe('useClock', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the initial instant from the injected provider', () => {
    const start = new Date('2024-01-01T00:00:00.000Z')
    const now = vi.fn(() => start)

    const { result } = renderHook(() => useClock(now))

    expect(result.current).toEqual(start)
  })

  it('updates the returned Date on each one-second tick', () => {
    const times = [
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:01.000Z'),
      new Date('2024-01-01T00:00:02.000Z'),
    ]
    let index = 0
    const now = vi.fn(() => times[Math.min(index, times.length - 1)])

    const { result } = renderHook(() => useClock(now))

    expect(result.current).toEqual(times[0])

    index = 1
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current).toEqual(times[1])

    index = 2
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current).toEqual(times[2])
  })

  it('ticks once per 1000ms (not faster)', () => {
    const now = vi.fn(() => new Date())
    renderHook(() => useClock(now))

    // Initial render calls the provider exactly once.
    expect(now).toHaveBeenCalledTimes(1)

    act(() => {
      vi.advanceTimersByTime(999)
    })
    expect(now).toHaveBeenCalledTimes(1)

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(now).toHaveBeenCalledTimes(2)
  })

  it('clears the interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')
    const now = vi.fn(() => new Date())

    const { unmount } = renderHook(() => useClock(now))

    const callsBeforeUnmount = now.mock.calls.length
    unmount()
    expect(clearIntervalSpy).toHaveBeenCalled()

    // No further ticks fire after unmount.
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(now).toHaveBeenCalledTimes(callsBeforeUnmount)

    clearIntervalSpy.mockRestore()
  })

  it('defaults to a real-time provider when none is injected', () => {
    vi.setSystemTime(new Date('2024-06-01T12:00:00.000Z'))

    const { result } = renderHook(() => useClock())

    expect(result.current).toEqual(new Date('2024-06-01T12:00:00.000Z'))
  })
})
