import { Button } from "@/components/ui/button"
import { getImageUrl } from "@/lib/api"
import type { ApartmentDetail } from "@/lib/types"
import { Heart, Share2, User } from "lucide-react"
import Image from "next/image"

interface ApartmentHeaderProps {
  apartment: ApartmentDetail
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

function PhotoGrid({ images, apartmentId }: { images: string[]; apartmentId: string }) {
  const imageCount = images.length

  if (imageCount === 0) {
    return (
      <div className="w-full h-[500px] bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl flex items-center justify-center">
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
        className="w-full h-[500px] relative rounded-xl overflow-hidden"
        style={{
          viewTransitionName: `apartment-image-${apartmentId}`,
        }}
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

  if (imageCount === 2) {
    return (
      <div
        className="grid grid-cols-2 gap-2 h-[500px]"
        style={{
          viewTransitionName: `apartment-image-${apartmentId}`,
        }}
      >
        <div className="relative rounded-l-xl overflow-hidden">
          <Image src={getImageUrl(images[0])} alt="Apartment" fill className="object-cover" sizes="50vw" priority />
        </div>
        <div className="relative rounded-r-xl overflow-hidden">
          <Image src={getImageUrl(images[1])} alt="Apartment" fill className="object-cover" sizes="50vw" priority />
        </div>
      </div>
    )
  }

  if (imageCount === 3) {
    return (
      <div
        className="grid grid-cols-2 gap-2 h-[500px]"
        style={{
          viewTransitionName: `apartment-image-${apartmentId}`,
        }}
      >
        <div className="relative rounded-l-xl overflow-hidden">
          <Image src={getImageUrl(images[0])} alt="Apartment" fill className="object-cover" sizes="50vw" priority />
        </div>
        <div className="grid grid-rows-2 gap-2">
          <div className="relative rounded-tr-xl overflow-hidden">
            <Image src={getImageUrl(images[1])} alt="Apartment" fill className="object-cover" sizes="50vw" priority />
          </div>
          <div className="relative rounded-br-xl overflow-hidden">
            <Image src={getImageUrl(images[2])} alt="Apartment" fill className="object-cover" sizes="50vw" />
          </div>
        </div>
      </div>
    )
  }

  if (imageCount === 4) {
    return (
      <div
        className="grid grid-cols-2 gap-2 h-[500px]"
        style={{
          viewTransitionName: `apartment-image-${apartmentId}`,
        }}
      >
        <div className="relative rounded-l-xl overflow-hidden">
          <Image src={getImageUrl(images[0])} alt="Apartment" fill className="object-cover" sizes="50vw" priority />
        </div>
        <div className="grid grid-rows-2 gap-2">
          <div className="relative rounded-tr-xl overflow-hidden">
            <Image src={getImageUrl(images[1])} alt="Apartment" fill className="object-cover" sizes="50vw" priority />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative overflow-hidden">
              <Image src={getImageUrl(images[2])} alt="Apartment" fill className="object-cover" sizes="25vw" />
            </div>
            <div className="relative rounded-br-xl overflow-hidden">

              <Image src={getImageUrl(images[3])} alt="Apartment" fill className="object-cover" sizes="25vw" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-2 gap-2 h-[500px]"
      style={{
        viewTransitionName: `apartment-image-${apartmentId}`,
      }}
    >
      <div className="relative rounded-l-xl overflow-hidden">
        <Image src={getImageUrl(images[0])} alt="Apartment" fill className="object-cover" sizes="50vw" priority />
      </div>
      <div className="grid grid-rows-2 gap-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="relative overflow-hidden">
            <Image src={getImageUrl(images[1])} alt="Apartment" fill className="object-cover" sizes="25vw" priority />
          </div>
          <div className="relative rounded-tr-xl overflow-hidden">
            <Image src={getImageUrl(images[2])} alt="Apartment" fill className="object-cover" sizes="25vw" priority />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative overflow-hidden">
            <Image src={getImageUrl(images[3])} alt="Apartment" fill className="object-cover" sizes="25vw" />
          </div>
          <div className="relative rounded-br-xl overflow-hidden">
            <Image src={getImageUrl(images[4])} alt="Apartment" fill className="object-cover" sizes="25vw" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ApartmentHeader({ apartment }: ApartmentHeaderProps) {
  const amenities = extractAmenities(apartment)
  const availabilityInfo = formatAvailabilityInfo(apartment.availability_dates || [])
  const images = apartment.image_urls || []

  return (
    <div className="w-full">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium text-neutral-600 uppercase tracking-wide mb-2">
            {apartment.address || apartment.neighborhood_id?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Location'}
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 font-title mb-4">
            {apartment.title || apartment.neighborhood_id?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || apartment.apartment_id}
          </h1>

          {amenities.length > 0 && (
            <div className="text-lg font-medium text-neutral-900 mb-3">
              {amenities.join(' · ')}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-neutral-700 hover:bg-neutral-100">
            <Heart className="h-4 w-4 mr-2" />
            Wishlist
          </Button>
          <Button variant="ghost" size="sm" className="text-neutral-700 hover:bg-neutral-100">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="relative mb-8">
        <PhotoGrid images={images} apartmentId={apartment.apartment_id} />
        {images.length > 5 && (
          <Button
            variant="outline"
            size="sm"
            className="absolute bottom-4 right-4 bg-white hover:bg-neutral-50"
          >
            Show all photos
          </Button>
        )}
      </div>

      <div className="flex flex-col w-full md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-neutral-200">
        <div className="flex flex-col gap-2 w-full">

          <div className="flex items-center gap-8 text-neutral-700 w-full">
            {apartment.rent_price && (
              <div className="text-2xl font-bold text-neutral-900 font-title">
                ${apartment.rent_price.toLocaleString()}<span className="text-base font-medium text-neutral-600">/month</span>
              </div>
            )}
            {availabilityInfo && (
              <div className="flex flex-col gap-2 ml-auto">
                <div className="flex items-center gap-2 text-accent-foreground ml-auto">
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
    </div>
  )
}

