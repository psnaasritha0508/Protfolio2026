import './index.css'
import BackgroundCanvas from './components/BackgroundCanvas'
import Contact from './components/Contact'
import CustomCursor from './components/CustomCursor'
import Hero from './components/Hero'
import Merits from './components/Merits'
import Narrative from './components/Narrative'
import Projects from './components/Projects'
import Skills from './components/Skills'

export default function App() {
  return (
    <>
      {/* Custom mouse cursor */}
      <CustomCursor />

      {/* Fixed 3D scene — pointer-events-none so it never blocks UI */}
      <BackgroundCanvas />

      {/* Scrollable content stack, layered above canvas */}
      <div className="relative z-10">
        <Hero />
        <Narrative />
        <Skills />
        <Projects />
        <Merits />
        <Contact />
      </div>
    </>
  )
}
