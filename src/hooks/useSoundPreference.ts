import { useCallback, useEffect, useState } from 'react'

/** localStorage key under which the sound-on/off choice is persisted. */
export const SOUND_PREFERENCE_KEY = 'clock:soundEnabled'

/**
 * Reads the persisted sound preference from `localStorage`.
 *
 * Defaults to `false` (muted) so the app never tries to play audio before the
 * user has opted in — this respects browser autoplay policies, which block
 * sound until there has been a user gesture. Any access error (e.g. storage
 * disabled in private mode) is swallowed and treated as "no preference".
 */
function readStoredPreference(): boolean {
  try {
    return window.localStorage.getItem(SOUND_PREFERENCE_KEY) === 'true'
  } catch {
    return false
  }
}

/** Persists the sound preference, ignoring storage access errors. */
function writeStoredPreference(enabled: boolean): void {
  try {
    window.localStorage.setItem(SOUND_PREFERENCE_KEY, String(enabled))
  } catch {
    /* storage unavailable (private mode / disabled) — ignore */
  }
}

/** Return shape of {@link useSoundPreference}. */
export interface SoundPreference {
  /** Whether sound is currently enabled (i.e. not muted). */
  enabled: boolean
  /** Enable sound (the one-time "enable sound" affordance calls this). */
  enable: () => void
  /** Mute sound. */
  disable: () => void
  /** Flip between enabled and muted. */
  toggle: () => void
}

/**
 * Manages the user's sound-on/off preference, persisting the choice to
 * `localStorage` so it survives reloads.
 *
 * The preference starts muted by default (see {@link readStoredPreference}) so
 * that {@link useHourlyChime} never plays audio until the user has explicitly
 * enabled it via a gesture, satisfying browser autoplay restrictions.
 *
 * @returns The current `enabled` flag plus `enable`/`disable`/`toggle` actions.
 */
export function useSoundPreference(): SoundPreference {
  const [enabled, setEnabled] = useState<boolean>(readStoredPreference)

  // Keep storage in sync whenever the in-memory preference changes.
  useEffect(() => {
    writeStoredPreference(enabled)
  }, [enabled])

  const enable = useCallback(() => setEnabled(true), [])
  const disable = useCallback(() => setEnabled(false), [])
  const toggle = useCallback(() => setEnabled((prev) => !prev), [])

  return { enabled, enable, disable, toggle }
}

export default useSoundPreference
