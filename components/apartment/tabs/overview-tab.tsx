"use client"

import { useState, useRef, useEffect, lazy, Suspense } from "react"
import Image from "next/image"
import type { ApartmentDetail, ImageMetadata } from "@/lib/types"
import type { Location3DMapRef } from "../location-3d-map"
import { generateMapsGroundedContent } from "@/lib/api"

const Location3DMap = lazy(() => 
  import("../location-3d-map").then(mod => ({ default: mod.Location3DMap }))
)

interface OverviewTabProps {
  apartment: ApartmentDetail
  onLocationQuerySubmit?: (handler: (query: string) => Promise<void>) => void
  onMapVisibilityChange?: (isVisible: boolean) => void
  animationsComplete?: boolean
  isActive?: boolean
}

interface PhotoSection {
  title: string
  photos: ImageMetadata[]
}

const PHOTO_SECTIONS_CONFIG = [
  { type: "bedroom", title: "Where You&apos;ll Sleep" },
  { type: "living_room", title: "Where You&apos;ll Chill" }
]

export function OverviewTab({ apartment, onLocationQuerySubmit, onMapVisibilityChange, animationsComplete = false, isActive = true }: OverviewTabProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showReadMore, setShowReadMore] = useState(false)
  const [shouldRenderMap, setShouldRenderMap] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)
  const mapRef = useRef<Location3DMapRef>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapTriggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight)
      const height = textRef.current.scrollHeight
      const lines = height / lineHeight
      setShowReadMore(lines > 3)
    }
  }, [apartment.property_summary])

  useEffect(() => {
    if (!animationsComplete || !mapTriggerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRenderMap(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: "400px 0px 400px 0px",
        threshold: 0,
      }
    )

    observer.observe(mapTriggerRef.current)

    return () => observer.disconnect()
  }, [animationsComplete])

  useEffect(() => {
    if (!onLocationQuerySubmit || !apartment.location) return

    const handleQuery = async (query: string) => {
      if (!apartment.location || !mapRef.current) return

      const result = await generateMapsGroundedContent({
        prompt: query,
        latitude: apartment.location.lat,
        longitude: apartment.location.lon,
        enableWidget: false,
      })

      const grounding = result.groundingMetadata
      if (grounding?.groundingChunks) {
        const placeIds = grounding.groundingChunks
          .filter((chunk) => chunk.maps?.placeId)
          .map((chunk) => chunk.maps!.placeId)

        if (placeIds.length > 0) {
          await mapRef.current.addPlaceMarkers(placeIds)
        }
      }
    }

    onLocationQuerySubmit(handleQuery)
  }, [onLocationQuerySubmit, apartment.location])

  useEffect(() => {
    if (!mapTriggerRef.current || !onMapVisibilityChange || !isActive) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        onMapVisibilityChange(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: "-100px 0px 0px 0px"
      }
    )

    observer.observe(mapTriggerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [onMapVisibilityChange, isActive])

  const hasContent = apartment.property_summary || apartment.location_summary

  if (!hasContent) {
    return (
      <div className="text-neutral-500 text-center py-8">
        No overview available for this property yet.
      </div>
    )
  }

  const hasLocation = apartment.location && apartment.location.lat && apartment.location.lon

  const photosByType = apartment.image_metadata?.reduce((acc, photo) => {
    const type = photo.type || "other"
    if (!acc[type]) acc[type] = []
    acc[type].push(photo)
    return acc
  }, {} as Record<string, ImageMetadata[]>) || {}

  const photoSections: PhotoSection[] = PHOTO_SECTIONS_CONFIG
    .map(config => ({
      title: config.title,
      photos: photosByType[config.type] || []
    }))
    .filter(section => section.photos.length > 0)

  return (
    <div className="space-y-12">
      <div className="max-w-4xl space-y-12">
        {apartment.property_summary && (
          <section>
            <h2 className="text-lg font-medium text-neutral-900 mb-3">
              About the Property
            </h2>
            <p 
              ref={textRef}
              className={`text-neutral-700 leading-relaxed whitespace-pre-line ${!isExpanded && showReadMore ? 'line-clamp-3' : ''}`}
            >
              {apartment.property_summary}
            </p>
            {showReadMore && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-3 text-sm font-medium text-neutral-900 hover:text-neutral-700 transition-colors"
              >
                {isExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </section>
        )}

        {photoSections.map((section, idx) => (
          <section key={idx}>
            <h2 className="text-lg font-medium text-neutral-900 mb-4">
              {section.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.photos.map((photo) => (
                <div
                  key={photo.index}
                  className="relative aspect-video rounded-lg overflow-hidden bg-neutral-100"
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${photo.url}`}
                    alt={section.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {apartment.location_summary && (
        <section className="max-w-4xl">
          <h2 className="text-lg font-medium text-neutral-900 mb-3">
            Where You&apos;ll Be
          </h2>
          <p className="text-neutral-700 leading-relaxed whitespace-pre-line mb-6">
            {apartment.location_summary}
          </p>
        </section>
      )}

      {hasLocation && apartment.location && (
        <div ref={mapTriggerRef}>
          {shouldRenderMap ? (
            <div ref={mapContainerRef}>
              <Suspense fallback={
                <div className="relative rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100 animate-pulse">
                  <div className="w-full h-[500px] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-300 border-t-neutral-900" />
                      <p className="text-sm text-neutral-600">Loading map...</p>
                    </div>
                  </div>
                </div>
              }>
                <Location3DMap
                  ref={mapRef}
                  latitude={apartment.location.lat}
                  longitude={apartment.location.lon}
                  address={apartment.address}
                />
              </Suspense>
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
              <div className="w-full h-[500px]" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

