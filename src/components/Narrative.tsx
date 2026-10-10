import { type BezierDefinition, motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const EASE: BezierDefinition = [0.23, 1, 0.32, 1]


// const STATS = [
//   { value: '3+',  label: 'Years Experience'          },
//   { value: '20+', label: 'Projects Shipped'           },
//   { value: '5',   label: 'Open-Source Contributions'  },
//   { value: '∞',   label: 'Curiosity'                  },
// ]

const PHILOSOPHY = [
  'Ship fast, iterate faster — perfect is the enemy of shipped',
  'Every millisecond of performance IS user experience',
  "Code is a craft — write it like you're proud of it",
  'Accessibility and aesthetics are never a trade-off',
]

const fadeSlide = (dir: 'left' | 'right', delay = 0) => ({
  hidden:  { opacity: 0, x: dir === 'left' ? -40 : 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, delay, ease: EASE } },
})

export default function Narrative() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" ref={ref} className="section-container">

      {/* ── Section header ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <span
          className="block text-xs font-semibold tracking-[0.22em] uppercase mb-3"
          style={{ color: 'rgba(224,215,255,0.55)' }}
        >
          About Me
        </span>
        <h2
          className="text-4xl md:text-5xl font-extrabold gradient-text"
          style={{ backgroundImage: 'linear-gradient(135deg, #E0D7FF, #FFD6E8)' }}
        >
          Where Logic Meets Imagination
        </h2>
      </motion.div>

      {/* ── Two-column cards ──────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">

        {/* Bio */}
        <motion.div
          variants={fadeSlide('left', 0.15)}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="glass-card p-8"
        >
          <p className="text-white/80 text-lg leading-relaxed mb-5">
            Hi! I'm{' '}
            <strong className="font-bold" style={{ color: '#E0D7FF' }}>
              Aasritha
            </strong>{' '}
            — a builder. I take raw product ideas and turn them into shipped, production-ready applications. My sweet spot lives at the intersection of slick UI design, rock-solid server architecture, and intelligent AI models. I love the challenge of taking a fresh design concept, connecting it to a scalable database, and adding a layer of artificial intelligence to make the final application feel like magic."
          </p>
          <p className="text-white/55 leading-relaxed">
            I specialise in crafting end-to-end web experiences — from
            pixel-perfect frontends to scalable, cloud-native backends. I believe
            great software should feel <em>magical</em>.
          </p>
        </motion.div>

        {/* Philosophy */}
        <motion.div
          variants={fadeSlide('right', 0.25)}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="glass-card p-8"
        >
          <h3 className="font-semibold mb-5 text-base" style={{ color: '#C7F9E8' }}>
            Engineering Philosophy
          </h3>
          <ul className="space-y-3.5">
            {PHILOSOPHY.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-white/65 text-sm leading-relaxed">
                <span
                  className="mt-[5px] flex-shrink-0 w-1.5 h-1.5 rounded-full"
                  style={{ background: '#C7F9E8' }}
                />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* ── Stats row ────────────────────────────────────────── */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(({ value, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
            whileHover={{ y: -3, scale: 1.02 }}
            className="glass-card p-6 text-center"
          >
            <div
              className="text-4xl font-extrabold mb-1.5 gradient-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #E0D7FF, #C7F9E8)' }}
            >
              {value}
            </div>
            <div className="text-xs text-white/45 font-medium">{label}</div>
          </motion.div>
        ))}
      </div> */}
    </section>
  )
}
