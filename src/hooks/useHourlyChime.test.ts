import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useHourlyChime } from './useHourlyChime'
import { CHIME_SOUND_URLS } from '../assets/audio'

/**
 * Builds a mock that stands in for an `HTMLAudioElement`, capturing the `src`
 * it was created with and exposing a spy-able `play()`.
 */
function makeAudioFactory() {
  const play = vi.fn(() => Promise.resolve())
  const created: { src: string; el: { play: typeof play } }[] = []
  const factory = vi.fn((src: string) => {
    const el = { play } as unknown as HTMLAudioElement
    created.push({ src, el: el as unknown as { play: typeof play } })
    return el
  })
  return { factory, play, created }
}

describe('useHourlyChime', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('plays exactly once at the top of the hour when enabled', () => {
    const { factory, play } = makeAudioFactory()
    const date = new Date('2024-01-01T09:00:00.000Z')

    renderHook(() =>
      useHourlyChime({ date, enabled: true, audioFactory: factory }),
    )

    expect(play).toHaveBeenCalledTimes(1)
    expect(factory).toHaveBeenCalledTimes(1)
  })

  it('does not play when not at the top of the hour', () => {
    const { factory, play } = makeAudioFactory()
    const date = new Date('2024-01-01T09:00:30.000Z') // 30 seconds past

    renderHook(() =>
      useHourlyChime({ date, enabled: true, audioFactory: factory }),
    )

    expect(play).not.toHaveBeenCalled()
  })

  it('does not play at minute 00 if seconds are not 00', () => {
    const { factory, play } = makeAudioFactory()
    const date = new Date('2024-01-01T09:00:01.000Z')

    renderHook(() =>
      useHourlyChime({ date, enabled: true, audioFactory: factory }),
    )

    expect(play).not.toHaveBeenCalled()
  })

  it('does not play when disabled, even at the top of the hour', () => {
    const { factory, play } = makeAudioFactory()
    const date = new Date('2024-01-01T09:00:00.000Z')

    renderHook(() =>
      useHourlyChime({ date, enabled: false, audioFactory: factory }),
    )

    expect(play).not.toHaveBeenCalled()
  })

  it('fires only once across re-renders within the same hour boundary', () => {
    const { factory, play } = makeAudioFactory()
    const topOfHour = new Date('2024-01-01T09:00:00.000Z')

    const { rerender } = renderHook(
      (props: { date: Date }) =>
        useHourlyChime({ date: props.date, enabled: true, audioFactory: factory }),
      { initialProps: { date: topOfHour } },
    )

    expect(play).toHaveBeenCalledTimes(1)

    // A subsequent tick still inside the same clock hour must not re-chime,
    // even though `date` changed identity.
    rerender({ date: new Date('2024-01-01T09:00:00.500Z') })
    rerender({ date: new Date('2024-01-01T09:00:01.000Z') })
    rerender({ date: new Date('2024-01-01T09:30:00.000Z') })

    expect(play).toHaveBeenCalledTimes(1)
  })

  it('chimes again at the next hour boundary', () => {
    const { factory, play } = makeAudioFactory()

    const { rerender } = renderHook(
      (props: { date: Date }) =>
        useHourlyChime({ date: props.date, enabled: true, audioFactory: factory }),
      { initialProps: { date: new Date('2024-01-01T09:00:00.000Z') } },
    )

    expect(play).toHaveBeenCalledTimes(1)

    // Advance through the hour, then hit the next top-of-hour.
    rerender({ date: new Date('2024-01-01T09:59:59.000Z') })
    expect(play).toHaveBeenCalledTimes(1)

    rerender({ date: new Date('2024-01-01T10:00:00.000Z') })
    expect(play).toHaveBeenCalledTimes(2)
  })

  it('uses the requested sound asset URL', () => {
    const { factory } = makeAudioFactory()
    const date = new Date('2024-01-01T09:00:00.000Z')

    renderHook(() =>
      useHourlyChime({ date, enabled: true, sound: 'lotr', audioFactory: factory }),
    )

    expect(factory).toHaveBeenCalledWith(CHIME_SOUND_URLS.lotr)
  })

  it('defaults to the mickey cue', () => {
    const { factory } = makeAudioFactory()
    const date = new Date('2024-01-01T09:00:00.000Z')

    renderHook(() =>
      useHourlyChime({ date, enabled: true, audioFactory: factory }),
    )

    expect(factory).toHaveBeenCalledWith(CHIME_SOUND_URLS.mickey)
  })

  it('swallows rejected play() promises (autoplay blocked)', async () => {
    const play = vi.fn(() => Promise.reject(new Error('autoplay blocked')))
    const factory = vi.fn(() => ({ play }) as unknown as HTMLAudioElement)
    const date = new Date('2024-01-01T09:00:00.000Z')

    expect(() =>
      renderHook(() =>
        useHourlyChime({ date, enabled: true, audioFactory: factory }),
      ),
    ).not.toThrow()

    expect(play).toHaveBeenCalledTimes(1)
    // Allow the rejected promise's catch handler to run.
    await Promise.resolve()
  })
})
