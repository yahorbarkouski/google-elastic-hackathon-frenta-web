import { MapPin } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ClaimsByDomain } from "../claims/claims-by-domain"
import { getImageUrl } from "@/lib/api"
import type { ApartmentDetail } from "@/lib/types"

interface ApartmentDetailModalProps {
  apartment: ApartmentDetail | null
  isLoading: boolean
  onClose: () => void
}

export function ApartmentDetailModal({ apartment, isLoading, onClose }: ApartmentDetailModalProps) {
  const isOpen = !!apartment

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading details...
          </div>
        ) : apartment && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {apartment.apartment_id}
              </DialogTitle>
              {apartment.address && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>{apartment.address}</span>
                </div>
              )}
            </DialogHeader>

            <div className="space-y-6">
              {apartment.image_urls && apartment.image_urls.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Images</h4>
                  <Carousel className="w-full">
                    <CarouselContent>
                      {apartment.image_urls.map((url, idx) => (
                        <CarouselItem key={idx}>
                          <Image
                            src={getImageUrl(url)}
                            alt={`${apartment.apartment_id} - ${idx + 1}`}
                            width={1200}
                            height={800}
                            className="w-full h-96 object-cover rounded-lg"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Total Claims</div>
                  <div className="text-2xl font-bold">{apartment.total_claims || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Base Claims</div>
                  <div className="text-2xl font-bold">{apartment.summary?.base_claims || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Verified</div>
                  <div className="text-2xl font-bold text-green-600">
                    {apartment.summary?.verified_claims || 0}
                  </div>
                </div>
              </div>

              <ClaimsByDomain claims={apartment.claims} />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

