"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTransitionRouter } from "next-view-transitions"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Sparkles, 
  ChevronRight,
  ChevronLeft,
  Check, 
  X, 
  Loader2, 
  DollarSign, 
  Image as ImageIcon,
  Home,
  Calendar
} from "lucide-react"
import { 
  generateApartmentPreview, 
  confirmApartmentGeneration, 
  cancelPreview,
  getPreviewImageUrl 
} from "@/lib/api"
import type { AvailabilityRange } from "@/lib/types"

interface GenerateApartmentDialogProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

type Step = "input" | "generating" | "preview"

interface PreviewData {
  preview_id: string
  apartment_id: string
  title: string
  description: string
  address: string
  neighborhood_id: string
  rent_price: number
  availability_dates: AvailabilityRange[]
  style_aesthetic: string
  images: Array<{
    index: number
    url: string
    type: string
    prompt: string
  }>
  num_images: number
}

function formatAvailabilityDates(dates: AvailabilityRange[]): string {
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

export function GenerateApartmentDialog({ open, onClose, onSuccess }: GenerateApartmentDialogProps) {
  const router = useTransitionRouter()
  const [step, setStep] = useState<Step>("input")
  const [description, setDescription] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [numImages, setNumImages] = useState("6")
  const [preview, setPreview] = useState<PreviewData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [confirming, setConfirming] = useState(false)

  const handleGenerate = async () => {
    setError(null)
    setStep("generating")
    
    try {
      const priceRange: { min?: number; max?: number } = {}
      if (minPrice) priceRange.min = parseInt(minPrice)
      if (maxPrice) priceRange.max = parseInt(maxPrice)
      
      const result = await generateApartmentPreview({
        description: description || undefined,
        priceRange: Object.keys(priceRange).length > 0 ? priceRange : undefined,
        numImages: parseInt(numImages) || 6,
      })
      
      setPreview(result)
      setStep("preview")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate apartment")
      setStep("input")
    }
  }

  const handleConfirm = async () => {
    if (!preview) return
    
    setConfirming(true)
    setError(null)
    
    try {
      const result = await confirmApartmentGeneration(preview.preview_id)
      
      onSuccess?.()
      handleClose()
      
      router.push(`/apartments/${result.apartment_id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to confirm generation")
      setConfirming(false)
    }
  }

  const handleCancel = async () => {
    if (preview) {
      try {
        await cancelPreview(preview.preview_id)
      } catch (err) {
        console.error("Failed to cancel preview:", err)
      }
    }
    handleClose()
  }

  const handleClose = () => {
    setStep("input")
    setDescription("")
    setMinPrice("")
    setMaxPrice("")
    setNumImages("6")
    setPreview(null)
    setError(null)
    setCurrentImageIndex(0)
    setConfirming(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto border-none">
        <AnimatePresence mode="wait">
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="size-5 text-primary" />
                  Generate Apartment
                </DialogTitle>
                <DialogDescription>
                  Create a synthetic apartment with AI-generated images and metadata. Leave fields empty for random generation.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    placeholder="Modern 2BR in Williamsburg with exposed brick..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to generate a random concept
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minPrice">Min Price ($)</Label>
                    <Input
                      id="minPrice"
                      type="number"
                      placeholder="2000"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxPrice">Max Price ($)</Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      placeholder="5000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numImages">Number of Images</Label>
                  <Input
                    id="numImages"
                    type="number"
                    min="2"
                    max="12"
                    value={numImages}
                    onChange={(e) => setNumImages(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={handleClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleGenerate} className="flex-1">
                    <Sparkles className="mr-2 size-4" />
                    Generate Preview
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === "generating" && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center py-12 gap-4"
            >
              <div className="relative">
                <Loader2 className="size-12 animate-spin text-primary" />
                <Sparkles className="size-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-semibold text-lg">Creating your apartment...</h3>
                <p className="text-sm text-muted-foreground">
                  Generating style plan, images, and metadata
                </p>
              </div>
            </motion.div>
          )}

          {step === "preview" && preview && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle>Apartment Preview</DialogTitle>
                <DialogDescription>
                  Review the generated apartment before indexing
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted group">
                    <motion.img
                      key={currentImageIndex}
                      src={getPreviewImageUrl(preview.preview_id, currentImageIndex)}
                      alt={`Preview ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev - 1 + preview.images.length) % preview.images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="size-5" />
                    </button>
                    
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % preview.images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Next image"
                    >
                      <ChevronRight className="size-5" />
                    </button>

                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {preview.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`size-2 rounded-full transition-all ${
                            idx === currentImageIndex 
                              ? "bg-white w-6" 
                              : "bg-white/50 hover:bg-white/75"
                          }`}
                          aria-label={`Go to image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">{preview.title}</h3>
                  </div>

                  <div className="flex flex-col gap-2 items-start">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{preview.address}</p>
                      <p className="text-sm">{preview.style_aesthetic}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">${preview.rent_price.toLocaleString()}/mo</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg bg-muted p-3 text-sm max-h-96 overflow-y-auto">
                    {preview.description}
                  </div>

                  {error && (
                    <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 justify-end">
                    <Button 
                      variant="outline" 
                      onClick={handleCancel} 
                      disabled={confirming}
                      className="flex-1 bg-white border-none"
                    >
                      <X className="size-4" />
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleConfirm} 
                      disabled={confirming}
                      className="flex-1"
                    >
                      {confirming ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Check className="size-4" />
                      )}
                      {confirming ? "Indexing..." : "Index apartment"}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

