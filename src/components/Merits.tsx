import { motion, useInView } from 'framer-motion'
import { Award, GraduationCap } from 'lucide-react'
import { useRef } from 'react'

export default function Merits() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const cards = [
    {
      title: 'Education',
      icon: GraduationCap,
      institution: 'NIAT × Chaitanya Deemed University',
      points: [
        'B.Tech in Computer Science & Engineering',
        'SGPA: 9.8',
      ],
    },
    {
      title: 'Competitive Merits',
      icon: Award,
      institution: 'State & National Admissions',
      points: [
        'AP EAPCET: Rank 5,783',
        'JEE Mains: 91.57%ile',
      ],
    },
  ]

  return (
    <section id="merits" ref={ref} className="max-w-4xl mx-auto px-6 py-20">
      {/* Subdued, low-key header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <span className="block text-xs font-medium tracking-widest uppercase text-white/40 mb-1.5">
          Academics & Merits
        </span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white/90">
          Education & Achievements
        </h2>
      </motion.div>

      {/* Minimal, uniform cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl p-6 transition-colors duration-200"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
            >
              {/* Card Header: understated icon + label */}
              <div className="flex items-center gap-2.5 mb-3 text-white/60">
                <Icon size={16} className="text-white/70" />
                <span className="text-xs font-medium tracking-wide uppercase text-white/50">
                  {card.title}
                </span>
              </div>

              {/* Institution / Body */}
              <h3 className="text-base font-medium text-white/95 mb-3">
                {card.institution}
              </h3>

              {/* Standard, uniform bullet points without loud highlights */}
              <ul className="space-y-2 text-sm text-white/70">
                {card.points.map((point) => (
                  <li key={point} className="flex items-baseline gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-white/40 flex-shrink-0 relative top-[-2px]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
