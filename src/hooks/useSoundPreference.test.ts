import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import {
  SOUND_PREFERENCE_KEY,
  useSoundPreference,
} from './useSoundPreference'

/**
 * Installs an in-memory stand-in for `localStorage` on the global `window`,
 * returning spy-able `getItem`/`setItem` plus a peek at the backing store.
 */
function mockLocalStorage(initial: Record<string, string> = {}) {
  const store = new Map<string, string>(Object.entries(initial))
  const getItem = vi.fn((key: string) => store.get(key) ?? null)
  const setItem = vi.fn((key: string, value: string) => {
    store.set(key, value)
  })
  const removeItem = vi.fn((key: string) => {
    store.delete(key)
  })
  const mock = { getItem, setItem, removeItem }
  vi.stubGlobal('localStorage', mock)
  return { ...mock, store }
}

describe('useSoundPreference', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('defaults to muted (disabled) when nothing is stored', () => {
    mockLocalStorage()

    const { result } = renderHook(() => useSoundPreference())

    expect(result.current.enabled).toBe(false)
  })

  it('reads an enabled preference from localStorage', () => {
    mockLocalStorage({ [SOUND_PREFERENCE_KEY]: 'true' })

    const { result } = renderHook(() => useSoundPreference())

    expect(result.current.enabled).toBe(true)
  })

  it('treats a non-"true" stored value as muted', () => {
    mockLocalStorage({ [SOUND_PREFERENCE_KEY]: 'false' })

    const { result } = renderHook(() => useSoundPreference())

    expect(result.current.enabled).toBe(false)
  })

  it('persists the choice to localStorage when enabled', () => {
    const ls = mockLocalStorage()

    const { result } = renderHook(() => useSoundPreference())

    act(() => result.current.enable())

    expect(result.current.enabled).toBe(true)
    expect(ls.setItem).toHaveBeenCalledWith(SOUND_PREFERENCE_KEY, 'true')
    expect(ls.store.get(SOUND_PREFERENCE_KEY)).toBe('true')
  })

  it('persists the muted choice to localStorage when disabled', () => {
    const ls = mockLocalStorage({ [SOUND_PREFERENCE_KEY]: 'true' })

    const { result } = renderHook(() => useSoundPreference())
    expect(result.current.enabled).toBe(true)

    act(() => result.current.disable())

    expect(result.current.enabled).toBe(false)
    expect(ls.store.get(SOUND_PREFERENCE_KEY)).toBe('false')
  })

  it('toggles between enabled and muted', () => {
    const ls = mockLocalStorage()

    const { result } = renderHook(() => useSoundPreference())

    act(() => result.current.toggle())
    expect(result.current.enabled).toBe(true)
    expect(ls.store.get(SOUND_PREFERENCE_KEY)).toBe('true')

    act(() => result.current.toggle())
    expect(result.current.enabled).toBe(false)
    expect(ls.store.get(SOUND_PREFERENCE_KEY)).toBe('false')
  })

  it('does not throw when localStorage access fails', () => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => {
        throw new Error('storage disabled')
      }),
      setItem: vi.fn(() => {
        throw new Error('storage disabled')
      }),
    })

    let result: ReturnType<typeof renderHook<ReturnType<typeof useSoundPreference>, unknown>>['result']
    expect(() => {
      ;({ result } = renderHook(() => useSoundPreference()))
    }).not.toThrow()

    // Falls back to muted, and toggling still works in-memory.
    expect(result!.current.enabled).toBe(false)
    expect(() => act(() => result!.current.enable())).not.toThrow()
    expect(result!.current.enabled).toBe(true)
  })
})
