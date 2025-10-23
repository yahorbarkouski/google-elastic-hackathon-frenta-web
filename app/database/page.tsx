"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTransitionRouter } from "next-view-transitions"
import { DatabaseApartmentCard } from "@/components/apartment/database-apartment-card"
import { GenerateApartmentDialog } from "@/components/apartment/generate-apartment-dialog"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { useApartments } from "@/hooks/use-apartments"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"

export default function DatabasePage() {
  const { apartments, loading, page, totalPages, setPage, loadApartments } = useApartments()
  const router = useTransitionRouter()
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false)

  useEffect(() => {
    loadApartments()
  }, [loadApartments])

  const handleApartmentClick = (apartmentId: string) => {
    router.push(`/apartments/${apartmentId}`)
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-[#E8E7E5]">
      <div className="relative flex w-full flex-1 flex-col items-center pt-4 md:pt-8 pb-24">
        <div className="w-full max-w-3xl px-3 md:px-4">

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 md:mb-8"
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <h1 className="text-4xl font-title">Apartment database</h1>
              <Button 
                onClick={() => setGenerateDialogOpen(true)}
                size="sm"
                className="gap-1.5 shrink-0"
              >
                <Sparkles className="size-4" />
                <span className="hidden sm:inline">Generate</span>
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-muted-foreground">
                Browse all apartments in the database
              </p>
              {!loading && apartments.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </div>
              )}
            </div>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <EmptyState message="Loading apartments..." />
            </div>
          ) : apartments.length === 0 ? (
            <div className="flex items-center justify-center py-24">
              <EmptyState message="No apartments in database" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.1 }}
              className="flex flex-col gap-3 md:gap-4"
            >
              {apartments.map((apartment, index) => (
                <motion.div
                  key={apartment.apartment_id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.2 }}
                >
                  <DatabaseApartmentCard
                    apartment={apartment}
                    onClick={() => handleApartmentClick(apartment.apartment_id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {!loading && totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="fixed bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 z-20 px-3"
        >
          <div className="relative overflow-hidden rounded-[20px] border border-border bg-card shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/3 to-transparent" />
            <div className="flex items-center gap-2 px-3 md:px-4 py-2.5 md:py-3">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground/70 ring-1 ring-border transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="px-3 md:px-4 text-sm font-medium">
                <span className="text-foreground">{page}</span>
                <span className="text-muted-foreground"> / {totalPages}</span>
              </div>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground/70 ring-1 ring-border transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <GenerateApartmentDialog
        open={generateDialogOpen}
        onClose={() => setGenerateDialogOpen(false)}
        onSuccess={() => {
          loadApartments()
        }}
      />
    </div>
  )
}
