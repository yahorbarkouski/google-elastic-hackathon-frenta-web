"use client"

import { useEffect, useRef } from "react"

interface GoogleMapsWidgetProps {
  contextToken: string
  className?: string
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gmp-place-contextual': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'context-token'?: string
        },
        HTMLElement
      >
    }
  }
}

export function GoogleMapsWidget({ contextToken, className }: GoogleMapsWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    if (scriptLoadedRef.current || typeof window === 'undefined') {
      return
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      console.error('Google Maps API key not configured')
      return
    }

    const existingScript = document.querySelector(
      `script[src*="maps.googleapis.com"]`
    )
    
    if (existingScript) {
      scriptLoadedRef.current = true
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`
    script.async = true
    script.defer = true
    script.onload = () => {
      scriptLoadedRef.current = true
    }
    script.onerror = () => {
      console.error('Failed to load Google Maps JavaScript API')
    }

    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  if (!contextToken) {
    return null
  }

  return (
    <div ref={containerRef} className={className}>
      <gmp-place-contextual context-token={contextToken} />
    </div>
  )
}

