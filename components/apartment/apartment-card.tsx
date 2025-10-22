import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { getImageUrl } from "@/lib/api"
import type { SearchResult } from "@/lib/types"
import { motion } from "framer-motion"
import { Calendar, DollarSign, Home, MapPin, Star } from "lucide-react"
import Image from "next/image"

export interface ApartmentCardProps {
  apartment: SearchResult
  onClick?: () => void
}

const BADGE_VARIANTS = ["emerald", "amber", "violet", "sky", "rose", "slate"] as const

function stringToVariant(text: string): typeof BADGE_VARIANTS[number] {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i)
    hash = hash & hash
  }
  return BADGE_VARIANTS[Math.abs(hash) % BADGE_VARIANTS.length]
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
  return `${dates.length} availability periods`
}

export function ApartmentCard({ apartment, onClick }: ApartmentCardProps) {
  const hasImages = apartment.image_urls && apartment.image_urls.length > 0

  return (
    <motion.div
      layout
      className="flex flex-col w-full rounded-[32px] p-1 group hover:bg-[#DBDAD8]"
      transition={{
        layout: {
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.4,
        }
      }}
    >
      <div className="flex flex-col w-full group-hover:bg-[#F7F6F4]/90 bg-[#F7F6F4] rounded-[28px] overflow-hidden">

        {hasImages ? (
          <Carousel className="w-full">
            <CarouselContent className="ml-0">
              {apartment.image_urls!.map((url, idx) => (
                <CarouselItem key={idx} className="pl-0">
                  <div
                    className="relative w-full aspect-[3/2] cursor-pointer"
                    onClick={onClick}
                  >
                    <Image
                      src={getImageUrl(url)}
                      alt={`${apartment.apartment_id} - ${idx + 1}`}
                      fill
                      className="object-cover"
                      priority={idx === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {apartment.image_urls!.length > 1 && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </Carousel>
        ) : (
          <div
            className="relative w-full aspect-[3/2] bg-black/60 flex items-center justify-center cursor-pointer"
            onClick={onClick}
          >
            <Home className="h-16 w-16 text-white" />
          </div>
        )}

        <div
          className="flex flex-col gap-5 p-5 cursor-pointer"
          onClick={onClick}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xl font-medium font-title">
                {apartment.title || apartment.address || apartment.apartment_id}
              </span>
            </div>

            {apartment.geo_proximity && (
              <div className="flex items-center gap-1 text-sm">
                <MapPin className="size-3.5 text-[#727170]" />
                {apartment.geo_proximity.distance} to {apartment.geo_proximity.location}
              </div>
            )}
          </div>

          {(apartment.rent_price || (apartment.availability_dates && apartment.availability_dates.length > 0)) && (
            <div className="flex flex-wrap gap-3 text-sm">
              {apartment.rent_price && (
                <div className="flex items-center gap-1 font-medium">
                  <DollarSign className="size-4 text-[#727170]" />
                  <span>${apartment.rent_price.toLocaleString()}/mo</span>
                </div>
              )}
              {apartment.availability_dates && apartment.availability_dates.length > 0 && (
                <div className="flex items-center gap-1 text-[#727170]">
                  <Calendar className="size-4" />
                  <span>{formatAvailabilityDates(apartment.availability_dates)}</span>
                </div>
              )}
            </div>
          )}

          {apartment.matched_claims.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {apartment.matched_claims.slice(0, 8).map((claim, idx) => (
                <Badge
                  key={idx}
                  variant={stringToVariant(claim.matched_claim)}
                  className="text-xs"
                >
                  {claim.matched_claim}
                  {claim.kind === "verified" && (
                    <Star className="h-2.5 w-2.5 fill-current" />
                  )}
                </Badge>
              ))}
              {apartment.matched_claims.length > 8 && (
                <Badge variant="neutral" className="text-xs">
                  +{apartment.matched_claims.length - 8}
                </Badge>
              )}
            </div>
          )}

          {apartment.grounded_sources && apartment.grounded_sources.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                {apartment.grounded_sources.map((source, idx) => (
                  <div key={idx} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#E8E7E5] text-xs">
                    <span>{source.title}</span>
                    {source.rating && (
                      <span className="text-yellow-600">{source.rating}★</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
