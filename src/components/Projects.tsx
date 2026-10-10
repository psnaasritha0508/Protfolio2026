import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { useRef } from 'react'

/* Lucide-compatible Github SVG icon */
function Github({ size = 15, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

type Project = {
  title: string
  subtitle: string
  description: string
  tech: string[]
  accentColor: string
  github: string
  live: string
  liveLabel?: string
}

const PROJECTS: Project[] = [
  {
    title: 'ContribHQ',
    subtitle: 'AI-Powered Open-Source Discovery',
    description:
      'Built an AI-powered platform to discover beginner-friendly open-source issues with difficulty ratings, summaries, and actionable plans.Integrated GitHub issue search, smart filters, contribution tracking, and Codespaces access to simplify open-source contributions.',
    tech: [
      'Next.js 14',
      'React 18',
      'TS',
      'Tailwind',
      'Node.js',
      'Express',
      'PostgreSQL',
      'Prisma',
      'Gemini API',
    ],
    accentColor: '#E0D7FF',
    github: 'https://github.com/psnacode0508/ContribHQ.git',
    live: 'https://github.com/psnacode0508/ContribHQ.git',
    liveLabel: 'Repository',
  },
  {
    title: 'Imagify',
    subtitle: 'AI Image Generator',
    description:
      'Built an AI image-generation platform that transforms text prompts into images, with user authentication and downloadable results.Integrated MongoDB user management.',
    tech: ['React', 'Vite', 'Tailwind', 'Node.js', 'Express', 'MongoDB', 'Clipdrop API'],
    accentColor: '#FFD6E8',
    github: 'https://github.com/psnacode0508/Imagify.git',
    live: 'https://imagify-three-xi.vercel.app/',
    liveLabel: 'Live Demo',
  },
  {
    title: 'CORE9',
    subtitle: 'Autonomous Crisis Operating System',
    description:
      'Built an AI-powered crisis management platform to monitor incidents, coordinate emergency response tasks, and manage emergency contacts.Integrated Google Gemini AI, real-time incident updates, automated crisis monitoring, and report generation to support faster, data-driven response decisions.',
    tech: ['React', 'Vite', 'Tailwind', 'Node.js', 'Express', 'MongoDB', 'Supabase', 'Gemini AI'],
    accentColor: '#C7F9E8',
    github: 'https://github.com/NagaTejaSriCore/Core9.git',
    live: 'https://core9-frontend.vercel.app/',
    liveLabel: 'Live Demo',
  },
  {
    title: 'Krishna Fancies',
    subtitle: 'Fancy Store Platform',
    description:
      'Developed a responsive, mobile-first website for a local fancy store, featuring product browsing, a clean user interface, and smooth animations.Implemented reusable React components, dark/light theme support, admin dashboard and  WhatsApp-based ordering to provide customers with a convenient shopping experience .',
    tech: ['React', 'Vite', 'Tailwind', 'HTML'],
    accentColor: '#BEE3F8',
    github: 'https://github.com/psnacode0508/fancy-store-website.git',
    live: 'https://fancy-store-website.vercel.app/',
    liveLabel: 'Live Demo',
  },
]

/* ─── 3D Tilt Card ────────────────────────────────────────────────── */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const inView = useInView(wrapRef, { once: true, margin: '-60px' })

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const springX = useSpring(rawX, { stiffness: 280, damping: 26 })
  const springY = useSpring(rawY, { stiffness: 280, damping: 26 })

  const rotateX = useTransform(springY, [-0.5, 0.5], [9, -9])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-9, 9])
  const glowX = useTransform(springX, [-0.5, 0.5], [10, 90])
  const glowY = useTransform(springY, [-0.5, 0.5], [10, 90])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    rawX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <motion.div
      ref={wrapRef}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.23, 1, 0.32, 1] }}
      style={{ perspective: '1200px' }}
      className="h-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.018 }}
        data-cursor="hover"
        className="relative overflow-hidden rounded-3xl p-7 md:p-9 h-full flex flex-col justify-between group transition-shadow duration-300"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          background: 'rgba(15, 23, 42, 0.68)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: `1px solid ${project.accentColor}2A`,
          boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.37), 0 0 35px ${project.accentColor}10`,
        }}
      >
        {/* Cursor-tracking radial spotlight glow */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([gx, gy]) =>
                `radial-gradient(circle at ${gx}% ${gy}%, ${project.accentColor}22 0%, transparent 65%)`
            ),
          }}
        />

        {/* Content container */}
        <div className="relative z-10">
          {/* Card Top: Index & Subtitle */}
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: `${project.accentColor}CC` }}
            >
              {project.subtitle}
            </span>
            <span
              className="text-4xl md:text-5xl font-black leading-none select-none opacity-25"
              style={{ color: project.accentColor }}
            >
              0{index + 1}
            </span>
          </div>

          {/* Project Title */}
          <h3
            className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3"
            style={{ color: project.accentColor }}
          >
            {project.title}
          </h3>

          {/* Project Description with high contrast readability */}
          <p className="text-white/75 text-sm md:text-base leading-relaxed mb-6 font-normal">
            {project.description}
          </p>

          {/* Tech stack badge pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full text-xs font-medium tracking-wide transition-transform duration-150 hover:scale-105"
                style={{
                  background: `${project.accentColor}12`,
                  border: `1px solid ${project.accentColor}30`,
                  color: project.accentColor,
                  boxShadow: `0 0 12px ${project.accentColor}10`,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Action links opening in new tabs */}
        <div className="relative z-10 flex items-center gap-6 pt-4 border-t border-white/10 mt-auto">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} source code on GitHub`}
            className="inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors duration-200"
          >
            <Github size={16} />
            <span>GitHub</span>
          </a>

          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} live preview`}
            className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:brightness-125"
            style={{ color: project.accentColor }}
          >
            <ExternalLink size={16} />
            <span>{project.liveLabel || 'Live Demo'}</span>
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Projects Section ────────────────────────────────────────────── */
export default function Projects() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="projects" ref={ref} className="section-container">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <span
          className="block text-xs font-semibold tracking-[0.22em] uppercase mb-3"
          style={{ color: 'rgba(224, 215, 255, 0.65)' }}
        >
          Selected Portfolio
        </span>
        <h2
          className="text-4xl md:text-5xl font-extrabold gradient-text"
          style={{ backgroundImage: 'linear-gradient(135deg, #FFD6E8, #E0D7FF)' }}
        >
          Featured Projects
        </h2>
      </motion.div>

      {/* Grid of 4 Tilt Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  )
}
