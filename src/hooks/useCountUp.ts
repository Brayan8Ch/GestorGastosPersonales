import { useEffect, useRef, useState } from 'react'

export function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = useState(0)
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (reducedMotion.current) {
      setValue(target)
      return
    }
    if (target === 0) {
      setValue(0)
      return
    }
    const start = performance.now()
    let raf: number

    function step(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return value
}
