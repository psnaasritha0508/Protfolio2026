import { motion, useInView } from 'framer-motion'
import { Code, Cpu, Database, Layout, Terminal } from 'lucide-react'
import { useRef, useState } from 'react'

type SkillGroup = {
  category: string
  subtitle: string
  icon: typeof Code
  color: string
  glow: string
  skills: string[]
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'Languages',
    subtitle: 'Core Computing & Scripting',
    icon: Code,
    color: '#E0D7FF',
    glow: 'rgba(224, 215, 255, 0.45)',
    skills: ['C++', 'JS', 'Python'],
  },
  {
    category: 'Frontend',
    subtitle: 'Interactive & Modern Interfaces',
    icon: Layout,
    color: '#FFD6E8',
    glow: 'rgba(255, 214, 232, 0.45)',
    skills: ['React', 'Next.js', 'Tailwind', 'HTML', 'CSS'],
  },
  {
    category: 'Backend',
    subtitle: 'APIs, Services & Cloud Databases',
    icon: Database,
    color: '#C7F9E8',
    glow: 'rgba(199, 249, 232, 0.45)',
    skills: ['Node.js', 'Express', 'Supabase', 'PostgreSQL', 'MongoDB'],
  },
  {
    category: 'AI',
    subtitle: 'Intelligent Systems & Neural Models',
    icon: Cpu,
    color: '#BEE3F8',
    glow: 'rgba(190, 227, 248, 0.45)',
    skills: ['LLM APIs', 'Generative AI'],
  },
  {
    category: 'DevOps',
    subtitle: 'Deployment Pipelines & Version Control',
    icon: Terminal,
    color: '#D8B4FE',
    glow: 'rgba(216, 180, 254, 0.45)',
    skills: ['Git', 'GitHub', 'Vercel'],
  },
]

export default function Skills() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [activeSkill, setActiveSkill] = useState<string | null>(null)

  return (
    <section id="skills" ref={ref} className="section-container">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <span
          className="block text-xs font-semibold tracking-[0.25em] uppercase mb-3"
          style={{ color: 'rgba(224, 215, 255, 0.65)' }}
        >
          Tech Stack & Tooling
        </span>
        <h2
          className="text-4xl md:text-5xl font-extrabold gradient-text mb-4"
          style={{ backgroundImage: 'linear-gradient(135deg, #C7F9E8, #E0D7FF)' }}
        >
          Skills & Capabilities
        </h2>
        <p className="text-white/50 text-sm md:text-base max-w-lg mx-auto">
          Production-proven engineering toolkit spanning low-level logic, modern frontend systems,
          cloud infrastructure, and generative AI.
        </p>
      </motion.div>

      {/* Grid of Skill Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SKILL_GROUPS.map(({ category, subtitle, icon: Icon, color, glow, skills }, gi) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 35 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: gi * 0.1, ease: [0.23, 1, 0.32, 1] }}
            className={`glass-card p-6 md:p-7 relative overflow-hidden flex flex-col justify-between ${
              gi === 3 || gi === 4 ? 'lg:col-span-1' : ''
            }`}
            style={{
              borderColor: `${color}25`,
              boxShadow: `0 8px 30px rgba(0, 0, 0, 0.3), 0 0 24px ${color}0C`,
            }}
          >
            {/* Ambient Background Accent Glow */}
            <div
              aria-hidden="true"
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none blur-3xl opacity-20"
              style={{ background: color }}
            />

            <div>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${color}18`,
                    border: `1px solid ${color}35`,
                    color,
                    boxShadow: `0 0 14px ${color}20`,
                  }}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight" style={{ color }}>
                    {category}
                  </h3>
                  <p className="text-[11px] text-white/40 tracking-wide">{subtitle}</p>
                </div>
              </div>

              {/* Interactive Pills */}
              <div className="flex flex-wrap gap-2.5 pt-5">
                {skills.map((skill, si) => {
                  const isHovered = activeSkill === skill

                  return (
                    <motion.button
                      key={skill}
                      type="button"
                      onMouseEnter={() => setActiveSkill(skill)}
                      onMouseLeave={() => setActiveSkill(null)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.35, delay: gi * 0.08 + si * 0.04 }}
                      whileHover={{ scale: 1.07, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      data-cursor="hover"
                      className="relative px-3.5 py-1.5 rounded-full text-xs md:text-sm font-semibold tracking-wide transition-all duration-200 outline-none select-none"
                      style={{
                        background: isHovered
                          ? `${color}22`
                          : 'rgba(255, 255, 255, 0.05)',
                        border: isHovered
                          ? `1px solid ${color}`
                          : `1px solid ${color}35`,
                        color: isHovered ? '#FFFFFF' : color,
                        boxShadow: isHovered
                          ? `0 0 20px ${glow}, inset 0 0 10px ${color}30`
                          : `0 0 10px ${color}0D`,
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                      }}
                    >
                      {skill}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Micro bottom status indicator */}
            <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/30">
              <span>{skills.length} core competencies</span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
