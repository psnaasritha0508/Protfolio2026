// Module-level mutable ref — safe to read inside R3F useFrame without React re-renders
export const scroll = { progress: 0 }

if (typeof window !== 'undefined') {
  window.addEventListener(
    'scroll',
    () => {
      const el = document.documentElement
      scroll.progress = el.scrollTop / (el.scrollHeight - el.clientHeight || 1)
    },
    { passive: true }
  )
}
