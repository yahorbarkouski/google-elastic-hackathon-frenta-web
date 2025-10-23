"use client"

import { useMemo } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { useTransitionRouter } from "next-view-transitions"

import { ScrollArea } from "@/components/ui/scroll-area"
import { ApartmentCard } from "./apartment-card"
import type { SearchResult } from "@/lib/types"
import { Heart, Star } from "lucide-react"

export function ApartmentPanel({ results }: { results: SearchResult[] }) {
  const router = useTransitionRouter()

  const handleApartmentSelect = (apartment: SearchResult) => {
    router.push(`/apartments/${apartment.apartment_id}`)
  }

  const { bestMatches, youMightLike } = useMemo(() => {
    const bestMatches = results.filter(apt => apt.final_score > 0.9)
    const youMightLike = results.filter(apt => apt.final_score <= 0.9)
    return { bestMatches, youMightLike }
  }, [results])

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-1 p-1">
      <div className="flex flex-col items-center justify-center gap-10 min-h-0 flex-1 overflow-hidden rounded-lg p-3 md:p-6 pt-2 md:pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex min-h-0 w-full flex-1 flex-col gap-6"
          >
            <ScrollArea className="flex-1 h-full">
              <LayoutGroup>
                <div className="mx-auto w-full max-w-6xl px-2 md:px-4 flex flex-col gap-6 md:gap-8">
                  {bestMatches.length > 0 && (
                    <div className="flex flex-col gap-3 md:gap-4">
                      <h2 className="text-sm text-foreground/80 items-center border w-fit flex gap-1 mx-auto rounded-full px-3 py-1 bg-muted border-gray-300">
                      <Star className="size-3.5" />  
                      Best matches
                      </h2>
                      <div className={`grid w-full auto-rows-fr gap-3 md:gap-6 ${
                        bestMatches.length === 1 
                          ? "grid-cols-1 justify-items-center max-w-md mx-auto" 
                          : "grid-cols-1 md:grid-cols-2"
                      }`}>
                        {bestMatches.map((apartment) => (
                          <ApartmentCard 
                            key={apartment.apartment_id}
                            apartment={apartment} 
                            onClick={() => handleApartmentSelect(apartment)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {youMightLike.length > 0 && (
                    <div className="flex flex-col gap-3 md:gap-4">
                      <h2 className="text-sm text-foreground/80 items-center border w-fit flex gap-1 mx-auto rounded-full px-3 py-1 bg-muted border-gray-300">
                      <Heart className="size-3.5" />  
                      You might like
                      </h2>
                      <div className={`grid w-full auto-rows-fr gap-3 md:gap-6 ${
                        youMightLike.length === 1 
                          ? "grid-cols-1 justify-items-center max-w-md mx-auto" 
                          : "grid-cols-1 md:grid-cols-2"
                      }`}>
                        {youMightLike.map((apartment) => (
                          <ApartmentCard 
                            key={apartment.apartment_id}
                            apartment={apartment} 
                            onClick={() => handleApartmentSelect(apartment)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </LayoutGroup>
            </ScrollArea>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

