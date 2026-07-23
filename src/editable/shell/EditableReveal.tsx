'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

export function EditableReveal({
  children,
  index = 0,
  className = '',
}: {
  children: ReactNode
  index?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`editable-reveal ${mounted ? 'is-mounted' : ''} ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: mounted ? `${Math.min(index, 8) * 70}ms` : undefined }}
    >
      {children}
    </div>
  )
}
