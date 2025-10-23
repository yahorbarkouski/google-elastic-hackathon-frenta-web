import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { getImageUrl } from "@/lib/api"
import { formatClaimText } from "@/lib/format-claim"
import type { MatchedClaim, SearchResult } from "@/lib/types"
import { motion } from "framer-motion"
import { Bath, Building2, Calendar, ChefHat, DollarSign, Briefcase, Home, MapPin, Star, Trees, Bed, Sofa, LucideIcon, CheckCheckIcon } from "lucide-react"
import Image from "next/image"

export interface ApartmentCardProps {
  apartment: SearchResult
  onClick?: () => void
}

function getVariantFromSimilarity(similarity: number): "emerald" | "amber" | "rose" {
  if (similarity > 0.88) return "emerald"
  return "amber"
}

function capitalizeFirst(text: string): string {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function getClaimIcon(claim: MatchedClaim): LucideIcon {
  if (claim.room_type) {
    const roomType = claim.room_type.toLowerCase()
    switch (roomType) {
      case 'kitchen':
        return ChefHat
      case 'bedroom':
        return Bed
      case 'bathroom':
        return Bath
      case 'living_room':
      case 'living room':
        return Sofa
      case 'dining_room':
      case 'dining room':
        return Sofa
      case 'office':
        return Briefcase
      case 'balcony':
      case 'outdoor_space':
      case 'outdoor space':
        return Trees
      case 'closet':
        return Home
      default:
        console.log('Unknown room_type:', claim.room_type, 'for claim:', claim.matched_claim)
        return Home
    }
  }
  
  switch (claim.domain) {
    case 'room':
      return Home
    case 'apartment':
      return Building2
    case 'neighborhood':
      return Trees
    default:
      return Home
  }
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
      className="flex flex-col w-full h-full rounded-[24px] md:rounded-[32px] p-1 group hover:bg-[#DBDAD8]"
      transition={{
        layout: {
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.4,
        }
      }}
    >
      <div className="flex flex-col w-full h-full group-hover:bg-[#F7F6F4]/90 bg-[#F7F6F4] rounded-[20px] md:rounded-[28px] overflow-hidden">

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
          className="flex flex-col gap-3 md:gap-5 p-3 md:p-5 cursor-pointer"
          onClick={onClick}
        >
          <div className="flex flex-col gap-2 md:gap-3">
            <div className="flex items-center justify-between gap-2 md:gap-3">
              <span className="text-lg md:text-xl font-medium font-title">
                {apartment.title || apartment.address || apartment.apartment_id}
              </span>
            </div>

            {apartment.geo_proximity && (
              <div className="flex items-center gap-1 text-xs md:text-sm">
                <MapPin className="size-3 md:size-3.5 text-[#727170]" />
                {apartment.geo_proximity.distance} to {apartment.geo_proximity.location}
              </div>
            )}
          </div>

          {(apartment.rent_price || (apartment.availability_dates && apartment.availability_dates.length > 0)) && (
            <div className="flex flex-wrap gap-2 md:gap-3 text-xs md:text-sm">
              {apartment.rent_price && (
                <div className="flex items-center gap-1 font-medium">
                  <DollarSign className="size-3.5 md:size-4 text-[#727170]" />
                  <span>${apartment.rent_price.toLocaleString()}/mo</span>
                </div>
              )}
              {apartment.availability_dates && apartment.availability_dates.length > 0 && (
                <div className="flex items-center gap-1 text-[#727170]">
                  <Calendar className="size-3.5 md:size-4" />
                  <span>{formatAvailabilityDates(apartment.availability_dates)}</span>
                </div>
              )}
            </div>
          )}
          {apartment.matched_claims.length > 0 && (
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {apartment.matched_claims
                .sort((a, b) => b.similarity - a.similarity)
                .slice(0, 8)
                .map((claim, idx) => {
                const ClaimIcon = getClaimIcon(claim)
                return (
                  <Badge
                    key={idx}
                    variant={getVariantFromSimilarity(claim.similarity)}
                    className="text-[10px] md:text-xs cursor-help flex items-center gap-0.5 md:gap-1"
                    title={`${Math.round(claim.similarity * 100)}% match${claim.room_type ? ` · ${claim.room_type}` : ''} · ${claim.domain}`}
                  >
                    <ClaimIcon className="h-2.5 md:h-3 w-2.5 md:w-3" />
                    {capitalizeFirst(formatClaimText(claim.matched_claim, claim.matched_quantifiers))}
                    {claim.kind === "verified" && (
                      <CheckCheckIcon className="h-2 md:h-2.5 w-2 md:w-2.5 fill-current ml-0.5" />
                    )}
                  </Badge>
                )
              })}
              {apartment.matched_claims.length > 8 && (
                <Badge variant="neutral" className="text-[10px] md:text-xs">
                  +{apartment.matched_claims.length - 8}
                </Badge>
              )}
            </div>
          )}

          {apartment.grounded_sources && apartment.grounded_sources.length > 0 && (
            <div className="flex flex-col gap-1.5 md:gap-2">
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {apartment.grounded_sources.map((source, idx) => (
                  <div key={idx} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#E8E7E5] text-[10px] md:text-xs">
                    <span>{source.title}</span>
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
