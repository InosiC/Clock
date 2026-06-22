import { useState } from 'react'
import ClockPanel from './components/ClockPanel'
import WorldClock from './components/WorldClock'
import SoundToggle from './components/SoundToggle'
import { useClock } from './hooks/useClock'
import { useHourlyChime } from './hooks/useHourlyChime'
import { useSoundPreference } from './hooks/useSoundPreference'
// Map of Middle-earth background asset. See the SVG file's header comment for the
// asset licensing note (original placeholder artwork, safe to commit/redistribute).
import middleEarthMap from './assets/middle-earth-map.svg'
import './App.css'

function App() {
  // Single shared clock instant drives the hourly chime; the clock components
  // keep their own internal ticks for rendering.
  const now = useClock()
  // Sound preference persists across reloads; starts muted to respect autoplay.
  const { enabled: soundEnabled, toggle: toggleSound } = useSoundPreference()
  // 12h/24h display preference for the digital readouts.
  const [hour12, setHour12] = useState(false)

  // Play the Mickey/LOTR cue on the hour, but only while sound is enabled.
  useHourlyChime({ date: now, enabled: soundEnabled })

  return (
    <div
      className="lotr-background"
      data-testid="lotr-background"
      style={{ backgroundImage: `url(${middleEarthMap})` }}
    >
      {/* Dark overlay keeps the Mickey-themed clock legible over the map. */}
      <div className="lotr-overlay" aria-hidden="true" />
      <main id="center">
        <SoundToggle
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          hour12={hour12}
          onToggleHour12={() => setHour12((prev) => !prev)}
        />
        <ClockPanel hour12={hour12} />
        {/* World clock board: one Mickey-styled card per Middle-earth location. */}
        <WorldClock hour12={hour12} />
      </main>
    </div>
  )
}

export default App
