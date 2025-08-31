"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface SectionTransitionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function SectionTransition({ children, className = "", delay = 0 }: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("animate-section-enter")
              entry.target.classList.remove("opacity-0", "translate-y-20")
            }, delay)
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={`opacity-0 translate-y-20 transition-all duration-1000 ease-out ${className}`}>
      {children}
    </div>
  )
}
