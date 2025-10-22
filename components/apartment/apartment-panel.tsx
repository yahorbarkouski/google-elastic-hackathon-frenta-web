"use client"

import { useMemo, useState, useEffect } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { useTransitionRouter } from "next-view-transitions"

import { ScrollArea } from "@/components/ui/scroll-area"
import { ApartmentCard } from "./apartment-card"
import type { SearchResult } from "@/lib/types"

export function ApartmentPanel({ results }: { results: SearchResult[] }) {
  const router = useTransitionRouter()

  const handleApartmentSelect = (apartment: SearchResult) => {
    router.push(`/apartments/${apartment.apartment_id}`)
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-1 p-1">
      <div className="flex flex-col items-center justify-center gap-10 min-h-0 flex-1 overflow-hidden rounded-lg p-6">
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
                <div className="mx-auto grid w-full max-w-6xl grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-4">
                  {results.map((apartment) => (
                    <ApartmentCard 
                      key={apartment.apartment_id}
                      apartment={apartment} 
                      onClick={() => handleApartmentSelect(apartment)}
                    />
                  ))}
                </div>
              </LayoutGroup>
            </ScrollArea>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

