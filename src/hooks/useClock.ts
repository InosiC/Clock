import { useEffect, useState } from 'react'

/** A function that returns the "current" instant. Injectable for testability. */
export type NowProvider = () => Date

/**
 * React hook that returns the current `Date` and updates it once per second.
 *
 * A `setInterval` ticks every 1000ms and refreshes the returned value; the
 * interval is cleared automatically on unmount. The hook is presentation-
 * agnostic — it only exposes the current `Date`, leaving formatting/rendering
 * to consumers.
 *
 * @param now Optional provider for the current instant. Defaults to
 *   `() => new Date()`. Injecting a provider makes the hook deterministic and
 *   easy to test with fake timers.
 */
export function useClock(now: NowProvider = () => new Date()): Date {
  const [date, setDate] = useState<Date>(() => now())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDate(now())
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [now])

  return date
}
