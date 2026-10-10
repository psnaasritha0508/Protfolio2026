import { type BezierDefinition } from 'framer-motion'
import { motion } from 'framer-motion'
import { Briefcase, ChevronDown, GitFork, Mail, Sparkles } from 'lucide-react'

const FULL_NAME = 'Aasritha Pasumarthi'

/* Letter-by-letter entrance animation */
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.038, delayChildren: 0.4 } },
}

const EASE: BezierDefinition = [0.23, 1, 0.32, 1]

const letterVariant = {
  hidden:  { opacity: 0, y: 48, rotateX: -90 },
  visible: {
    opacity: 1, y: 0, rotateX: 0,
    transition: { duration: 0.65, ease: EASE },
  },
}

const socials = [
  { href: 'https://github.com/psnacode0508',                            icon: GitFork,   label: 'GitHub'   },
  { href: 'https://www.linkedin.com/in/aasritha-pasumarthi-3b046037a', icon: Briefcase, label: 'LinkedIn' },
  { href: 'mailto:psnaasritha.0508@gmail.com',                          icon: Mail,      label: 'Email'    },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">

      {/* Radial bloom — purely decorative, doesn't affect text readability */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(224,215,255,0.18) 0%, rgba(255,214,232,0.10) 40%, transparent 70%)',
        }}
      />

      {/* ── Status badge ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
        className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
        style={{
          background: 'rgba(224,215,255,0.08)',
          border: '1px solid rgba(224,215,255,0.28)',
          color: '#E0D7FF',
        }}
      >
        <Sparkles size={14} />
        Full-Stack Engineer · Open to Opportunities
      </motion.div>

      {/* ── Animated name ────────────────────────────────────────── */}
      <motion.h1
        variants={container}
        initial="hidden"
        animate="visible"
        className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight leading-none mb-6"
        style={{ perspective: '1200px' }}
        aria-label={FULL_NAME}
      >
        {FULL_NAME.split('').map((char, i) => (
          <motion.span
            key={i}
            variants={letterVariant}
            className="inline-block"
            style={{
              /* First name: lavender gradient; Last name: rose gradient */
              background:
                i < 8
                  ? 'linear-gradient(135deg, #E0D7FF 20%, #c4b5fd 80%)'
                  : 'linear-gradient(135deg, #FFD6E8 20%, #f9a8d4 80%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 24px rgba(224,215,255,0.35))',
              whiteSpace: char === ' ' ? 'pre' : undefined,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.h1>

      {/* ── Tagline ──────────────────────────────────────────────── */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.05 }}
        className="text-base md:text-lg text-white/55 max-w-lg mx-auto mb-10 leading-relaxed"
      > "Turning complex workflows into fast, secure web applications driven by intelligent data and AI automation."
        {/* Crafting immersive digital experiences at the intersection of{' '}
        <span className="font-medium text-[#C7F9E8]">robust engineering</span> and{' '}
        <span className="font-medium text-[#FFD6E8]">dreamlike aesthetics</span>. */}
      </motion.p>

      {/* ── CTA buttons ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="flex flex-wrap gap-4 justify-center mb-12"
      >
        <a
          href="#projects"
          data-cursor="hover"
          className="px-8 py-3.5 rounded-full font-semibold text-[#0b0612] transition-transform duration-200 hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #E0D7FF, #FFD6E8)' }}
        >
          View My Work
        </a>
        <a
          href="#contact"
          data-cursor="hover"
          className="px-8 py-3.5 rounded-full font-semibold transition-transform duration-200 hover:scale-105 active:scale-95"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.18)',
            color: '#f8f4ff',
          }}
        >
          Get in Touch
        </a>
      </motion.div>

      {/* ── Social icons ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="flex gap-3 mb-16"
      >
        {socials.map(({ href, icon: Icon, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            data-cursor="hover"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.14)',
              color: '#E0D7FF',
            }}
          >
            <Icon size={16} />
          </a>
        ))}
      </motion.div>

      {/* ── Scroll indicator ─────────────────────────────────────── */}
      <motion.div
        animate={{ y: [0, 9, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        style={{ color: 'rgba(255,255,255,0.28)' }}
        aria-hidden
      >
        <span className="text-[10px] tracking-[0.22em] uppercase font-medium">Scroll</span>
        <ChevronDown size={15} />
      </motion.div>
    </section>
  )
}
