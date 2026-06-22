/**
 * Bundled URLs for the hourly chime audio cues.
 *
 * Vite resolves these `?url`-less imports to hashed asset URLs at build time.
 * The committed `.wav` files are short, silent placeholders — see the adjacent
 * `README.md` for how to swap in the real Mickey / LOTR audio.
 */
import mickeyHourUrl from './mickey-hour.wav'
import lotrChimeUrl from './lotr-chime.wav'

/** Identifies which audio cue to play on the hour. */
export type ChimeSound = 'mickey' | 'lotr'

/** Maps a {@link ChimeSound} to its bundled asset URL. */
export const CHIME_SOUND_URLS: Record<ChimeSound, string> = {
  mickey: mickeyHourUrl,
  lotr: lotrChimeUrl,
}
