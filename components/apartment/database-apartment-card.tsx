import { Calendar, DollarSign, Home, Image as ImageIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Apartment } from "@/lib/types"
import { getImageUrl } from "@/lib/api"
import { motion } from "framer-motion"

export interface DatabaseApartmentCardProps {
  apartment: Apartment
  onClick?: () => void
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
  return `${dates.length} periods`
}

export function DatabaseApartmentCard({ apartment, onClick }: DatabaseApartmentCardProps) {
  return (
    <motion.button
      layout
      onClick={onClick}
      className="flex flex-col w-full rounded-[32px] p-1 group hover:bg-[#DBDAD8] text-left"
      transition={{
        layout: {
          duration: 0.3,
          ease: "easeInOut",
        }
      }}
    >
      <div className="flex flex-col w-full group-hover:bg-[#F7F6F4]/90 bg-[#F7F6F4] rounded-[28px] p-5">
        <div className="flex flex-col gap-6 w-full">

          <div className="flex flex-wrap items-start justify-between gap-6 w-full">
            <div className="flex items-start gap-3.5">

              <Avatar className="size-18 shadow-inner rounded-xl rounded-t-2xl">
                <AvatarImage 
                  src={apartment.image_urls?.[0] ? getImageUrl(apartment.image_urls[0]) : undefined}
                  alt={apartment.apartment_id} 
                  loading="eager" 
                  style={{ imageRendering: 'auto' }} 
                />
                <AvatarFallback className="bg-black/60 text-2xl text-white rounded-lg">
                  <Home className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1 -mt-0.5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xl font-medium font-title">{apartment.apartment_id}</span>
                </div>

                <p className="text-sm -mt-0.5">
                  {apartment.claim_count} claims
                </p>

                {apartment.address && (
                  <p className="text-xs text-[#727170] mt-0.5 line-clamp-1">
                    {apartment.address}
                  </p>
                )}

                {(apartment.rent_price || (apartment.availability_dates && apartment.availability_dates.length > 0)) && (
                  <div className="flex flex-wrap gap-2 mt-1 text-xs">
                    {apartment.rent_price && (
                      <div className="flex items-center gap-1 font-medium">
                        <DollarSign className="size-3" />
                        <span>${apartment.rent_price.toLocaleString()}/mo</span>
                      </div>
                    )}
                    {apartment.availability_dates && apartment.availability_dates.length > 0 && (
                      <div className="flex items-center gap-1 text-[#727170]">
                        <Calendar className="size-3" />
                        <span>{formatAvailabilityDates(apartment.availability_dates)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {apartment.image_urls && apartment.image_urls.length > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-[#727170]">
                <ImageIcon className="size-3.5" />
                {apartment.image_urls.length}
              </div>
            )}

          </div>

        </div>
      </div>
    </motion.button>
  )
}
