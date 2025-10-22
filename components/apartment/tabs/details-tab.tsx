import type { ApartmentDetail } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { getImageUrl } from "@/lib/api"

interface DetailsTabProps {
  apartment: ApartmentDetail
}

export function DetailsTab({ apartment }: DetailsTabProps) {
  const imageClaims = apartment.claims.filter(c => c.source.type === "image")
  const textClaims = apartment.claims.filter(c => c.source.type === "text")

  return (
    <div className="flex flex-col gap-8 md:gap-16">
      <div className="space-y-4">
        <h2 className="text-neutral-900 text-lg font-medium">Overview</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-neutral-600 text-sm">Total Claims</p>
            <p className="text-neutral-900 text-xl font-medium">{apartment.total_claims}</p>
          </div>
          {apartment.summary && (
            <>
              <div>
                <p className="text-neutral-600 text-sm">Verified Claims</p>
                <p className="text-neutral-900 text-xl font-medium">{apartment.summary.verified_claims}</p>
              </div>
              <div>
                <p className="text-neutral-600 text-sm">Base Claims</p>
                <p className="text-neutral-900 text-xl font-medium">{apartment.summary.base_claims}</p>
              </div>
              <div>
                <p className="text-neutral-600 text-sm">Derived Claims</p>
                <p className="text-neutral-900 text-xl font-medium">{apartment.summary.derived_claims}</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-neutral-900 text-lg font-medium mb-4">Claim Sources</h2>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="md:w-36 shrink-0 text-sm">
              <span className="text-neutral-600">Text Sources</span>
            </div>
            <div className="flex-1">
              <p className="text-neutral-900">{textClaims.length} claims from listing text</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="md:w-36 shrink-0 text-sm">
              <span className="text-neutral-600">Image Sources</span>
            </div>
            <div className="flex-1">
              <p className="text-neutral-900">{imageClaims.length} claims from {apartment.image_urls?.length || 0} images</p>
            </div>
          </div>
        </div>
      </div>

      {apartment.image_urls && apartment.image_urls.length > 0 && (
        <div>
          <h2 className="text-neutral-900 text-lg font-medium mb-4">Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {apartment.image_urls.map((url, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden bg-neutral-100">
                <img
                  src={getImageUrl(url)}
                  alt={`Apartment ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-neutral-900 text-lg font-medium mb-4">Claim Types</h2>
        <div className="space-y-4">
          {Array.from(new Set(apartment.claims.map(c => c.claim_type))).map(type => {
            const count = apartment.claims.filter(c => c.claim_type === type).length
            return (
              <div key={type} className="flex items-center justify-between">
                <Badge className="bg-violet-50/80 text-violet-700 border border-violet-200/60">
                  {type}
                </Badge>
                <span className="text-neutral-600 text-sm">{count} claims</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

