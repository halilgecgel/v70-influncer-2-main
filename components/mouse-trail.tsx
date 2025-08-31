"use client"

import { useEffect, useRef } from "react"

export default function MouseTrail() {
  const lastMousePos = useRef({ x: 0, y: 0 })
  const isMoving = useRef(false)
  const waterfallInterval = useRef<NodeJS.Timeout>()
  const particlePool = useRef<HTMLDivElement[]>([])
  const activeParticles = useRef<Set<HTMLDivElement>>(new Set())
  const lastMoveTime = useRef(Date.now())
  const moveSpeed = useRef(0)

  useEffect(() => {
    let animationId: number

    const createParticlePool = () => {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div")
        particle.className = "mouse-trail"
        particle.style.display = "none"
        document.body.appendChild(particle)
        particlePool.current.push(particle)
      }
    }

    const getParticle = () => {
      const particle = particlePool.current.find((p) => !activeParticles.current.has(p))
      if (particle) {
        activeParticles.current.add(particle)
        particle.style.display = "block"
        return particle
      }
      return null
    }

    const returnParticle = (particle: HTMLDivElement) => {
      activeParticles.current.delete(particle)
      particle.style.display = "none"
    }

    const handleMouseMove = (e: MouseEvent) => {
      const currentTime = Date.now()
      const deltaTime = currentTime - lastMoveTime.current
      const deltaX = Math.abs(e.clientX - lastMousePos.current.x)
      const deltaY = Math.abs(e.clientY - lastMousePos.current.y)
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      moveSpeed.current = deltaTime > 0 ? distance / deltaTime : 0
      lastMoveTime.current = currentTime

      lastMousePos.current = { x: e.clientX, y: e.clientY }
      isMoving.current = true

      if (animationId) {
        cancelAnimationFrame(animationId)
      }

      animationId = requestAnimationFrame(() => {
        const baseParticles = 1
        const speedMultiplier = Math.min(moveSpeed.current * 0.5, 3) // Cap at 3x
        const particleCount = Math.floor(baseParticles + speedMultiplier)

        for (let i = 0; i < particleCount; i++) {
          const trail = getParticle()
          if (trail) {
            const offsetX = (Math.random() - 0.5) * 6
            const offsetY = (Math.random() - 0.5) * 6
            trail.style.left = e.clientX - 3 + offsetX + "px"
            trail.style.top = e.clientY - 3 + offsetY + "px"

            setTimeout(() => {
              returnParticle(trail)
            }, 400)
          }
        }

        document.documentElement.style.setProperty("--mouse-x", e.clientX - 8 + "px")
        document.documentElement.style.setProperty("--mouse-y", e.clientY - 8 + "px")
      })

      setTimeout(() => {
        isMoving.current = false
      }, 100)
    }

    const startWaterfallEffect = () => {
      waterfallInterval.current = setInterval(() => {
        const baseWaterfallParticles = 2
        const horizontalSpeedBonus = moveSpeed.current > 0.3 ? Math.floor(moveSpeed.current * 2) : 0
        const particleCount = Math.min(baseWaterfallParticles + horizontalSpeedBonus, 6)

        for (let i = 0; i < particleCount; i++) {
          const trail = getParticle()
          if (trail) {
            trail.className = "mouse-trail-static"
            const offsetX = (Math.random() - 0.5) * 8
            trail.style.left = lastMousePos.current.x - 2 + offsetX + "px"
            trail.style.top = lastMousePos.current.y + "px"

            setTimeout(() => {
              trail.className = "mouse-trail"
              returnParticle(trail)
            }, 1200)
          }
        }
      }, 60)
    }

    createParticlePool()
    document.addEventListener("mousemove", handleMouseMove)
    startWaterfallEffect()

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      if (waterfallInterval.current) {
        clearInterval(waterfallInterval.current)
      }
      particlePool.current.forEach((particle) => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle)
        }
      })
    }
  }, [])

  return null
}
