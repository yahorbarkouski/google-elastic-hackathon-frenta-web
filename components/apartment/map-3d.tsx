"use client"

import { useRef, forwardRef, useImperativeHandle, useEffect, useState } from "react"
import { useMapsLibrary } from "@vis.gl/react-google-maps"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "gmp-map-3d": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        center?: any
        range?: number
        heading?: number
        tilt?: number
        roll?: number
        defaultUIHidden?: boolean
        mode?: string
      }
    }
  }
}

interface Map3DProps {
  center: {
    lat: number
    lng: number
    altitude?: number
  }
  range?: number
  heading?: number
  tilt?: number
  roll?: number
  className?: string
}

export const Map3D = forwardRef<any, Map3DProps>((props, forwardedRef) => {
  useMapsLibrary("maps3d" as any)
  const mapRef = useRef<any>(null)
  const [customElementsReady, setCustomElementsReady] = useState(false)
  const initializedRef = useRef(false)

  const {
    center,
    range = 500,
    heading = 0,
    tilt = 67.5,
    roll = 0,
    className,
  } = props

  useImperativeHandle(forwardedRef, () => mapRef.current, [])

  useEffect(() => {
    customElements.whenDefined("gmp-map-3d").then(() => {
      setCustomElementsReady(true)
    })
  }, [])

  useEffect(() => {
    if (!mapRef.current || !customElementsReady || initializedRef.current) return

    const element = mapRef.current
    
    const initializeMap = () => {
      element.center = center
      element.range = range
      element.heading = heading
      element.tilt = tilt
      element.roll = roll
      initializedRef.current = true
    }

    setTimeout(initializeMap, 200)
  }, [customElementsReady, mapRef.current])

  if (!customElementsReady) {
    return (
      <div className={className} style={{ minHeight: "600px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-300 border-t-neutral-900" />
      </div>
    )
  }

  return (
    // @ts-ignore
    <gmp-map-3d
      ref={mapRef}
      defaultUIHidden={true}
      mode="SATELLITE"
      className={className}
      style={{ width: "100%", height: "600px", display: "block" }}
    />
  )
})

Map3D.displayName = "Map3D"

