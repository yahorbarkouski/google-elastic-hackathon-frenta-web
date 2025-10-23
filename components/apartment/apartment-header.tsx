'use client'

import { Button } from "@/components/ui/button"
import { getImageUrl } from "@/lib/api"
import type { ApartmentDetail } from "@/lib/types"
import { Bookmark, BookmarkPlus, Heart, Share2, User } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { PhotoGalleryModal } from "./photo-gallery-modal"
import { motion } from "framer-motion"

interface ApartmentHeaderProps {
  apartment: ApartmentDetail
  onGalleryOpenChange?: (isOpen: boolean) => void
}

function formatAvailabilityDates(dates: { start: string; end?: string }[]): string {
  if (dates.length === 0) return ''
  if (dates.length === 1) {
    const { start, end } = dates[0]
    const startDate = new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    if (end) {
      const endDate = new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      return `${startDate} - ${endDate}`
    }
    return `From ${startDate}`
  }
  return dates.map(d => {
    const start = new Date(d.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    if (d.end) {
      const end = new Date(d.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      return `${start}-${end}`
    }
    return start
  }).join(', ')
}

function extractAmenities(apartment: ApartmentDetail): string[] {
  const amenities: string[] = []

  const relevantClaims = apartment.claims
    ?.filter(c => c.domain === 'apartment' && c.kind === 'base')
    ?.map(c => c.claim) || []

  const keywords = ['pool', 'hot tub', 'gym', 'parking', 'view', 'balcony', 'patio', 'fireplace', 'terrace', 'rooftop']

  keywords.forEach(keyword => {
    const match = relevantClaims.find(claim =>
      claim.toLowerCase().includes(keyword)
    )
    if (match) {
      const formatted = match
        .split(' ')
        .slice(0, 3)
        .join(' ')
        .replace(/\b\w/g, l => l.toUpperCase())
      amenities.push(formatted)
    }
  })

  return amenities.slice(0, 3)
}

function formatAvailabilityInfo(dates: { start: string; end?: string }[]): { date: string; duration: string } | null {
  if (!dates || dates.length === 0) return null

  const firstDate = dates[0]
  const startDate = new Date(firstDate.start)
  const endDate = firstDate.end ? new Date(firstDate.end) : null

  const dateStr = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  let duration = ''
  if (endDate) {
    const months = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
    duration = months === 12 ? '1 year' : `${months} months`
  }

  return { date: dateStr, duration }
}

function PhotoGrid({ images, apartmentId, onImageClick }: { images: string[]; apartmentId: string; onImageClick: (index: number) => void }) {
  const imageCount = images.length

  if (imageCount === 0) {
    return (
      <div className="w-full h-[300px] md:h-[500px] bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl flex items-center justify-center">
        <div className="text-center text-neutral-400">
          <User className="h-16 w-16 mx-auto mb-2" />
          <p>No photos available</p>
        </div>
      </div>
    )
  }

  if (imageCount === 1) {
    return (
      <div
        className="w-full h-[300px] md:h-[500px] relative rounded-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
        style={{
          viewTransitionName: `apartment-image-${apartmentId}`,
        }}
        onClick={() => onImageClick(0)}
      >
        <Image
          src={getImageUrl(images[0])}
          alt="Apartment"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
    )
  }

  return (
    <>
      <div className="md:hidden">
        <div
          className="w-full h-[300px] relative rounded-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
          style={{
            viewTransitionName: `apartment-image-${apartmentId}`,
          }}
          onClick={() => onImageClick(0)}
        >
          <Image
            src={getImageUrl(images[0])}
            alt="Apartment"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      <div className="hidden md:block">
        {imageCount === 2 && (
          <div
            className="grid grid-cols-2 gap-2 h-[500px]"
            style={{
              viewTransitionName: `apartment-image-${apartmentId}`,
            }}
          >
            <div className="relative rounded-l-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity" onClick={() => onImageClick(0)}>
              <Image src={getImageUrl(images[0])} alt="Apartment" fill className="object-cover" sizes="50vw" priority />
            </div>
            <div className="relative rounded-r-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity" onClick={() => onImageClick(1)}>
              <Image src={getImageUrl(images[1])} alt="Apartment" fill className="object-cover" sizes="50vw" priority />
            </div>
          </div>
        )}

        {imageCount === 3 && (
          <div
            className="grid grid-cols-2 gap-2 h-[500px]"
            style={{
              viewTransitionName: `apartment-image-${apartmentId}`,
            }}
          >
            <div className="relative rounded-l-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity" onClick={() => onImageClick(0)}>
              <Image src={getImageUrl(images[0])} alt="Apartment" fill className="object-cover" sizes="50vw" priority />
            </div>
            <div className="grid grid-rows-2 gap-2">
              <div className="relative rounded-tr-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity" onClick={() => onImageClick(1)}>
                <Image src={getImageUrl(images[1])} alt="Apartment" fill className="object-cover" sizes="50vw" priority />
              </div>
              <div className="relative rounded-br-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity" onClick={() => onImageClick(2)}>
                <Image src={getImageUrl(images[2])} alt="Apartment" fill className="object-cover" sizes="50vw" />
              </div>
            </div>
          </div>
        )}

        {imageCount === 4 && (
          <div
            className="grid grid-cols-2 gap-2 h-[500px]"
            style={{
              viewTransitionName: `apartment-image-${apartmentId}`,
            }}
          >
            <div className="relative rounded-l-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity" onClick={() => onImageClick(0)}>
              <Image src={getImageUrl(images[0])} alt="Apartment" fill className="object-cover" sizes="50vw" priority />
            </div>
            <div className="grid grid-rows-2 gap-2">
              <div className="relative rounded-tr-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity" onClick={() => onImageClick(1)}>
                <Image src={getImageUrl(images[1])} alt="Apartment" fill className="object-cover" sizes="50vw" priority />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative overflow-hidden cursor-pointer hover:opacity-95 transition-opacity" onClick={() => onImageClick(2)}>
                  <Image src={getImageUrl(images[2])} alt="Apartment" fill className="object-cover" sizes="25vw" />
                </div>
                <div className="relative rounded-br-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity" onClick={() => onImageClick(3)}>
                  <Image src={getImageUrl(images[3])} alt="Apartment" fill className="object-cover" sizes="25vw" />
                </div>
              </div>
            </div>
          </div>
        )}

        {imageCount >= 5 && (
          <div
            className="grid grid-cols-2 gap-2 h-[500px]"
            style={{
              viewTransitionName: `apartment-image-${apartmentId}`,
            }}
          >
            <div className="relative rounded-l-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity" onClick={() => onImageClick(0)}>
              <Image src={getImageUrl(images[0])} alt="Apartment" fill className="object-cover" sizes="50vw" priority />
            </div>
            <div className="grid grid-rows-2 gap-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="relative overflow-hidden cursor-pointer hover:opacity-95 transition-opacity" onClick={() => onImageClick(1)}>
                  <Image src={getImageUrl(images[1])} alt="Apartment" fill className="object-cover" sizes="25vw" priority />
                </div>
                <div className="relative rounded-tr-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity" onClick={() => onImageClick(2)}>
                  <Image src={getImageUrl(images[2])} alt="Apartment" fill className="object-cover" sizes="25vw" priority />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative overflow-hidden cursor-pointer hover:opacity-95 transition-opacity" onClick={() => onImageClick(3)}>
                  <Image src={getImageUrl(images[3])} alt="Apartment" fill className="object-cover" sizes="25vw" />
                </div>
                <div className="relative rounded-br-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity" onClick={() => onImageClick(4)}>
                  <Image src={getImageUrl(images[4])} alt="Apartment" fill className="object-cover" sizes="25vw" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export function ApartmentHeader({ apartment, onGalleryOpenChange }: ApartmentHeaderProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [initialImageIndex, setInitialImageIndex] = useState(0)
  const amenities = extractAmenities(apartment)
  const availabilityInfo = formatAvailabilityInfo(apartment.availability_dates || [])
  const images = apartment.image_urls || []

  const handleImageClick = (index: number) => {
    setInitialImageIndex(index)
    setIsGalleryOpen(true)
    onGalleryOpenChange?.(true)
  }

  const handleGalleryClose = () => {
    setIsGalleryOpen(false)
    onGalleryOpenChange?.(false)
  }

  return (
    <div className="w-full">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="text-xs md:text-sm font-medium text-neutral-600 uppercase tracking-wide mb-2">
            {apartment.address || apartment.neighborhood_id?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Location'}
          </div>
          <h1 className="text-2xl md:text-4xl font-semibold text-neutral-900 font-title mb-3 md:mb-4">
            {apartment.title || apartment.neighborhood_id?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || apartment.apartment_id}
          </h1>

          {amenities.length > 0 && (
            <div className="text-base md:text-lg font-medium text-neutral-900 mb-3">
              {amenities.join(' · ')}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 group">
          <Button variant="secondary" size="sm" className="text-neutral-700 hover:bg-white hover:border-border rounded-lg border border-card cursor-pointer text-xs md:text-sm">
            <motion.div
              initial={false}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                initial={false}
                animate={{ opacity: 1 }}
                className="relative"
              >
                <Bookmark className="h-3.5 md:h-4 w-3.5 md:w-4 group-hover:opacity-0 transition-opacity duration-200" />
                <BookmarkPlus className="h-3.5 md:h-4 w-3.5 md:w-4 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </motion.div>
            </motion.div>
            <span className="hidden md:inline">Bookmark</span>
          </Button>
        </div>
      </div>

      <div className="relative mb-8">
        <PhotoGrid images={images} apartmentId={apartment.apartment_id} onImageClick={handleImageClick} />
        {images.length > 1 && (
          <Button
            variant="outline"
            size="sm"
            className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-accent/90 text-accent-foreground border border-gray-200 rounded-xl text-xs md:text-sm"
            onClick={() => handleImageClick(0)}
          >
            {images.length > 5 ? 'Show all photos' : `View ${images.length} photos`}
          </Button>
        )}
      </div>

      <div className="flex flex-col w-full md:flex-row md:items-center md:justify-between gap-3 md:gap-4 pb-4 md:pb-6 border-b border-neutral-200">
        <div className="flex flex-col gap-2 w-full">

          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-8 text-neutral-700 w-full">
            {apartment.rent_price && (
              <div className="text-xl md:text-2xl font-bold text-neutral-900 font-title">
                ${apartment.rent_price.toLocaleString()}<span className="text-sm md:text-base font-medium text-neutral-600">/month</span>
              </div>
            )}
            {availabilityInfo && (
              <div className="flex flex-col gap-2 md:ml-auto">
                <div className="flex items-center gap-2 text-accent-foreground text-sm md:text-base md:ml-auto">
                  <span className="text-neutral-600">Available since <span className="text-black">{new Date(availabilityInfo.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long' }).replace(/(\d+)/, (match) => {
                    const day = parseInt(match);
                    const suffix = day === 1 || day === 21 || day === 31 ? 'st' : 
                                  day === 2 || day === 22 ? 'nd' : 
                                  day === 3 || day === 23 ? 'rd' : 'th';
                    return `${day}${suffix}`;
                  })}</span></span>
                  {availabilityInfo.duration && (
                    <>
                      <span className="">•</span>
                      <span className="">{availabilityInfo.duration}</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <PhotoGalleryModal
        images={images}
        isOpen={isGalleryOpen}
        onClose={handleGalleryClose}
        initialIndex={initialImageIndex}
      />
    </div>
  )
}

