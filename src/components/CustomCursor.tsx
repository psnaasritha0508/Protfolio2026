import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function CustomCursor() {
  const rawX = useMotionValue(-200)
  const rawY = useMotionValue(-200)
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)

  // Outer ring — lag behind for a trailing effect
  const ringX = useSpring(rawX, { stiffness: 220, damping: 28 })
  const ringY = useSpring(rawY, { stiffness: 220, damping: 28 })

  // Inner dot — snappy, near-instant
  const dotX = useSpring(rawX, { stiffness: 800, damping: 50 })
  const dotY = useSpring(rawY, { stiffness: 800, damping: 50 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      setHovering(!!t.closest('a, button, [data-cursor="hover"]'))
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
    }
  }, [rawX, rawY, visible])

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
      >
        <motion.div
          animate={{
            width:  hovering ? 52 : 32,
            height: hovering ? 52 : 32,
            borderColor: hovering ? '#FFD6E8' : '#E0D7FF',
            opacity: hovering ? 0.9 : 0.55,
          }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="rounded-full"
          style={{
            border: '1px solid',
            backdropFilter: 'blur(2px)',
          }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
      >
        <motion.div
          animate={{
            width:  hovering ? 7 : 4,
            height: hovering ? 7 : 4,
            backgroundColor: hovering ? '#FFD6E8' : '#E0D7FF',
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="rounded-full"
        />
      </motion.div>
    </>
  )
}
