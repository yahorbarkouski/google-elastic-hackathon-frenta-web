import type { ApartmentDetail } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { formatClaimText } from "@/lib/format-claim"
import {
  MapPin,
  Sparkles,
  Wifi,
  Maximize2,
  Wrench,
  DollarSign,
  Accessibility,
  Shield,
  Zap,
  Train,
  Home,
  FileText,
} from "lucide-react"

interface FeaturesTabProps {
  apartment: ApartmentDetail
}

const claimTypeIcons = {
  location: MapPin,
  features: Sparkles,
  amenities: Wifi,
  size: Maximize2,
  condition: Wrench,
  pricing: DollarSign,
  accessibility: Accessibility,
  policies: Shield,
  utilities: Zap,
  transport: Train,
  neighborhood: Home,
  restrictions: FileText,
}

export function FeaturesTab({ apartment }: FeaturesTabProps) {
  const baseClaims = apartment.claims.filter((claim) => claim.kind === "base")

  const groupedClaims = baseClaims.reduce((acc, claim) => {
    const groupKey = claim.domain === "room" && claim.room_type ? claim.room_type : claim.domain
    if (!acc[groupKey]) acc[groupKey] = []
    acc[groupKey].push(claim)
    return acc
  }, {} as Record<string, typeof apartment.claims>)

  return (
    <div className="flex flex-col gap-6">
      {Object.entries(groupedClaims).map(([groupKey, claims]) => (
        <div key={groupKey} className="space-y-3">
          <h2 className="text-neutral-900 text-base font-medium capitalize">
            {formatClaimText(groupKey)}
          </h2>
          <div className="flex flex-wrap gap-2">
            {claims.map((claim, index) => {
              const Icon = claimTypeIcons[claim.claim_type as keyof typeof claimTypeIcons]
              return (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-neutral-50 text-neutral-700 border border-neutral-200 hover:bg-neutral-100 px-3 py-1.5 text-[13px] font-normal"
                >
                  {Icon && <Icon className="h-3.5 w-3.5 mr-1.5" />}
                  {formatClaimText(claim.claim, claim.quantifiers)}
                </Badge>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

