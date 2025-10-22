import type { ApartmentDetail } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

interface LocationTabProps {
  apartment: ApartmentDetail
}

export function LocationTab({ apartment }: LocationTabProps) {
  const verifiedLocations = apartment.claims
    .filter(c => c.grounding_metadata?.verified && c.grounding_metadata.place_name)
    .map(c => c.grounding_metadata!)

  const neighborhoodClaims = apartment.claims.filter(c => c.domain === "neighborhood")

  return (
    <div className="flex flex-col gap-8 md:gap-16">
      {apartment.address && (
        <div className="space-y-4">
          <h2 className="text-neutral-900 text-lg font-medium">Address</h2>
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-neutral-600 mt-0.5" />
            <p className="text-neutral-900 text-[15px]">{apartment.address}</p>
          </div>
        </div>
      )}

      {apartment.location && (
        <div className="space-y-4">
          <h2 className="text-neutral-900 text-lg font-medium">Coordinates</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-neutral-600 text-sm">Latitude</p>
              <p className="text-neutral-900 font-mono">{apartment.location.lat}</p>
            </div>
            <div>
              <p className="text-neutral-600 text-sm">Longitude</p>
              <p className="text-neutral-900 font-mono">{apartment.location.lon}</p>
            </div>
          </div>
        </div>
      )}

      {verifiedLocations.length > 0 && (
        <div>
          <h2 className="text-neutral-900 text-lg font-medium mb-4">Nearby Verified Locations</h2>
          <div className="space-y-3">
            {verifiedLocations.map((location, index) => (
              <div key={index} className="flex flex-col gap-2 p-4 rounded-lg bg-emerald-50/50 border border-emerald-200/60">
                <div className="flex items-start justify-between">
                  <h3 className="text-neutral-900 font-medium">{location.place_name}</h3>
                  <Badge className="bg-emerald-50/80 text-emerald-700 border border-emerald-200/60">
                    Verified
                  </Badge>
                </div>
                {location.exact_distance_meters && (
                  <p className="text-neutral-600 text-sm">
                    {Math.round(location.exact_distance_meters)}m away
                    {location.walking_time_minutes && ` • ${location.walking_time_minutes} min walk`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-neutral-900 text-lg font-medium mb-4">Neighborhood</h2>
        {apartment.neighborhood_id && (
          <p className="text-neutral-600 text-sm mb-4">ID: {apartment.neighborhood_id}</p>
        )}
        {neighborhoodClaims.length > 0 && (
          <div className="space-y-2">
            <p className="text-neutral-600 text-sm mb-3">
              {neighborhoodClaims.length} neighborhood claims
            </p>
            <ul className="space-y-2">
              {neighborhoodClaims.slice(0, 10).map((claim, index) => (
                <li key={index} className="text-neutral-700 text-[15px] flex items-start gap-2">
                  <span className="text-neutral-400 mt-1">•</span>
                  <span>{claim.claim}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

