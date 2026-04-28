"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import Lenis from "lenis"

const LenisContext = createContext<Lenis | null>(null)

export function useLenis() {
  return useContext(LenisContext)
}

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const lenisRef = useRef<Lenis | null>(null)
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const instance = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenisRef.current = instance
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance)

    let rafId: number

    function raf(time: number) {
      instance.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    const ro = new ResizeObserver(() => instance.resize())
    ro.observe(document.body)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      instance.destroy()
      setLenis(null)
    }
  }, [])

  useEffect(() => {
    const id = setTimeout(() => lenisRef.current?.resize(), 100)
    return () => clearTimeout(id)
  }, [pathname])

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  )
}
