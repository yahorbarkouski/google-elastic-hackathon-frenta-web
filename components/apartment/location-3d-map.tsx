"use client"

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react"
import { useMapsLibrary } from "@vis.gl/react-google-maps"
import { Map3D } from "./map-3d"

interface Location3DMapProps {
  latitude: number
  longitude: number
  address?: string
}

export interface Location3DMapRef {
  addPlaceMarkers: (placeIds: string[]) => Promise<void>
}

interface MapMarker {
  position: {
    lat: number
    lng: number
    altitude: number
  }
  label: string
}

interface SelectedPlace {
  name: string
  address?: string
  rating?: number
  userRatingCount?: number
  phoneNumber?: string
  websiteURI?: string
  googleMapsURI?: string
  photos?: string[]
  reviews?: Array<{
    authorName: string
    rating: number
    text: string
    relativePublishTime: string
  }>
  priceLevel?: string
  editorialSummary?: string
}

interface Photo {
  uri: string
  attributions: string[]
}

export const Location3DMap = forwardRef<Location3DMapRef, Location3DMapProps>(({
  latitude,
  longitude,
  address,
}, ref) => {
  const [map, setMap] = useState<any>(null)
  const maps3dLib = useMapsLibrary("maps3d" as any)
  const placesLib = useMapsLibrary("places" as any)
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(null)
  const [loadingPlaceDetails, setLoadingPlaceDetails] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const placeMarkersRef = useRef<any[]>([])

  useEffect(() => {
    if (!map || !maps3dLib) return

    const homeMarker = new maps3dLib.Marker3DInteractiveElement({
      position: {
        lat: latitude,
        lng: longitude,
        altitude: 10,
      },
      altitudeMode: "RELATIVE_TO_MESH",
      label: "🏠 Your Apartment",
      title: address || "Your Location",
      drawsWhenOccluded: true,
    })

    homeMarker.addEventListener("gmp-click", () => {
      setSelectedPlace({
        name: address || "Your Apartment",
        address: address,
        googleMapsURI: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
      })
      setCurrentPhotoIndex(0)
    })

    map.appendChild(homeMarker)
  }, [map, maps3dLib, latitude, longitude, address])

  const addMarkersToMap = async (placeIds: string[]) => {
    if (!map || !maps3dLib || !placesLib) return

    placeMarkersRef.current.forEach((marker) => {
      if (marker.parentNode) {
        marker.parentNode.removeChild(marker)
      }
    })
    placeMarkersRef.current = []

    for (const placeId of placeIds) {
      try {
        const cleanId = placeId.replace("places/", "")
        const place = new placesLib.Place({ id: cleanId })
        const result = await place.fetchFields({ fields: ["location", "displayName"] })

        if (result.place.location) {
          const markerElement = new maps3dLib.Marker3DInteractiveElement({
            position: {
              lat: result.place.location.lat(),
              lng: result.place.location.lng(),
              altitude: 1,
            },
            altitudeMode: "RELATIVE_TO_MESH",
            label: result.place.displayName || "",
            title: result.place.displayName || "",
            drawsWhenOccluded: true,
          })

          placeMarkersRef.current.push(markerElement)

          markerElement.addEventListener("gmp-click", async () => {
            setLoadingPlaceDetails(true)
            setSelectedPlace(null)
            setCurrentPhotoIndex(0)

            try {
              const detailedPlace = new placesLib.Place({ id: cleanId })
              const detailsResult = await detailedPlace.fetchFields({
                fields: [
                  "displayName",
                  "formattedAddress",
                  "rating",
                  "userRatingCount",
                  "nationalPhoneNumber",
                  "websiteURI",
                  "googleMapsURI",
                  "photos",
                  "reviews",
                  "priceLevel",
                  "editorialSummary",
                ],
              })

              const photos = detailsResult.place.photos
                ? detailsResult.place.photos.map((photo: any) => 
                    photo.getURI({ maxWidth: 600, maxHeight: 400 })
                  )
                : []

              const reviews = detailsResult.place.reviews
                ? detailsResult.place.reviews.slice(0, 3).map((review: any) => ({
                    authorName: review.authorAttribution?.displayName || "Anonymous",
                    rating: review.rating || 0,
                    text: review.text?.text || "",
                    relativePublishTime: review.relativePublishTimeDescription || "",
                  }))
                : []

              setSelectedPlace({
                name: detailsResult.place.displayName || "",
                address: detailsResult.place.formattedAddress,
                rating: detailsResult.place.rating,
                userRatingCount: detailsResult.place.userRatingCount,
                phoneNumber: detailsResult.place.nationalPhoneNumber,
                websiteURI: detailsResult.place.websiteURI,
                googleMapsURI: detailsResult.place.googleMapsURI,
                photos,
                reviews,
                priceLevel: detailsResult.place.priceLevel,
                editorialSummary: detailsResult.place.editorialSummary?.text,
              })
            } catch (err) {
              console.error("Failed to fetch place details:", err)
            } finally {
              setLoadingPlaceDetails(false)
            }
          })

          map.appendChild(markerElement)
        }
      } catch (err) {
        console.error("Failed to fetch place:", err)
      }
    }
  }

  useImperativeHandle(ref, () => ({
    addPlaceMarkers: addMarkersToMap
  }))

  return (
    <div className="space-y-4">

      <div className="relative rounded-lg overflow-hidden border border-neutral-200">
        <Map3D
          key={`${latitude}-${longitude}`}
          ref={(element) => setMap(element)}
          center={{
            lat: latitude,
            lng: longitude,
            altitude: 200,
          }}
          range={500}
          tilt={67.5}
          heading={0}
          className="w-full"
        />

        {loadingPlaceDetails && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-neutral-300 border-t-neutral-900" />
              <p className="text-sm text-neutral-700">Loading...</p>
            </div>
          </div>
        )}

        {selectedPlace && !loadingPlaceDetails && (
          <div className="absolute top-4 right-4 w-80 bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden">
            {selectedPlace.photos && selectedPlace.photos.length > 0 ? (
              <div className="relative">
                <img
                  src={selectedPlace.photos[currentPhotoIndex]}
                  alt={selectedPlace.name}
                  className="w-full h-56 object-cover"
                />
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {selectedPlace.photos.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentPhotoIndex((prev) =>
                          prev === 0 ? selectedPlace.photos!.length - 1 : prev - 1
                        )
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-lg"
                    >
                      ‹
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentPhotoIndex((prev) =>
                          prev === selectedPlace.photos!.length - 1 ? 0 : prev + 1
                        )
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-lg"
                    >
                      ›
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {selectedPlace.photos.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            idx === currentPhotoIndex ? "bg-white w-4" : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                      {currentPhotoIndex + 1} / {selectedPlace.photos.length}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 h-32 flex items-center justify-center">
                <div className="text-6xl">🏠</div>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 text-base">
                {selectedPlace.name}
              </h3>
              {selectedPlace.address && (
                <p className="text-xs text-neutral-600 mt-1">{selectedPlace.address}</p>
              )}
              {selectedPlace.rating && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium text-neutral-900 text-sm">
                      {selectedPlace.rating.toFixed(1)}
                    </span>
                  </div>
                  {selectedPlace.userRatingCount && (
                    <span className="text-xs text-neutral-500">
                      ({selectedPlace.userRatingCount.toLocaleString()})
                    </span>
                  )}
                </div>
              )}
              {selectedPlace.googleMapsURI && (
                <a
                  href={selectedPlace.googleMapsURI}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-medium"
                >
                  View on Google Maps
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

Location3DMap.displayName = "Location3DMap"

