import { useEffect, useRef } from 'react'
import { CHIME_SOUND_URLS, type ChimeSound } from '../assets/audio'

/**
 * Factory that produces something play-able when the hour rolls over. Injectable
 * so tests can supply a mocked `HTMLAudioElement`. Defaults to constructing a
 * real `Audio` element from the selected cue's bundled URL.
 */
export type AudioFactory = (src: string) => HTMLAudioElement

/** Options for {@link useHourlyChime}. */
export interface UseHourlyChimeOptions {
  /**
   * The ticking `Date` to watch — typically the value returned by `useClock`.
   * The hook fires once when this crosses an hour boundary (minutes === 0 and
   * seconds === 0).
   */
  date: Date
  /**
   * Whether playback is enabled. Browsers block autoplay until the user has
   * interacted with the page, so callers should flip this to `true` only after
   * a user gesture (e.g. an "unmute" toggle). Defaults to `false`.
   */
  enabled?: boolean
  /** Which cue to play. Defaults to `'mickey'`. */
  sound?: ChimeSound
  /**
   * Factory for the audio element. Defaults to `new Audio(src)`. Override in
   * tests to assert on `play()` without touching the real Audio API.
   */
  audioFactory?: AudioFactory
}

const defaultAudioFactory: AudioFactory = (src) => new Audio(src)

/**
 * Identifies the hour-slot of an instant as an absolute hour count since the
 * epoch. Two instants within the same clock hour share the same key, which lets
 * us guard against firing more than once per hour.
 */
function hourKey(date: Date): number {
  return Math.floor(date.getTime() / 3_600_000)
}

/**
 * Plays an audio cue (Mickey voice clip or LOTR chime) at the top of every hour.
 *
 * The hook watches the supplied ticking `date` and, when it rolls to the top of
 * the hour (minutes === 0 && seconds === 0), plays the selected cue exactly
 * once. A per-hour guard prevents double-firing across the multiple re-renders
 * that can occur within the same second/minute, and playback only happens while
 * `enabled` is `true` so the app can respect browser autoplay policies (enable
 * after a user interaction / unmute toggle).
 *
 * @returns Nothing — the hook is a pure side effect.
 */
export function useHourlyChime({
  date,
  enabled = false,
  sound = 'mickey',
  audioFactory = defaultAudioFactory,
}: UseHourlyChimeOptions): void {
  // The hour-slot we have already chimed for. `null` means "not yet chimed".
  const lastChimedHourRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) return

    const atTopOfHour = date.getMinutes() === 0 && date.getSeconds() === 0
    if (!atTopOfHour) return

    const key = hourKey(date)
    if (lastChimedHourRef.current === key) return
    lastChimedHourRef.current = key

    const audio = audioFactory(CHIME_SOUND_URLS[sound])
    // `play()` returns a promise that rejects when autoplay is blocked; swallow
    // it so a blocked cue never surfaces as an unhandled rejection.
    void Promise.resolve(audio.play()).catch(() => {
      /* autoplay blocked or playback failed — ignore */
    })
  }, [date, enabled, sound, audioFactory])
}

export default useHourlyChime
