import ClockPanel from './components/ClockPanel'
// Map of Middle-earth background asset. See the SVG file's header comment for the
// asset licensing note (original placeholder artwork, safe to commit/redistribute).
import middleEarthMap from './assets/middle-earth-map.svg'
import './App.css'

function App() {
  return (
    <div
      className="lotr-background"
      data-testid="lotr-background"
      style={{ backgroundImage: `url(${middleEarthMap})` }}
    >
      {/* Dark overlay keeps the Mickey-themed clock legible over the map. */}
      <div className="lotr-overlay" aria-hidden="true" />
      <main id="center">
        <ClockPanel />
      </main>
    </div>
  )
}

export default App
