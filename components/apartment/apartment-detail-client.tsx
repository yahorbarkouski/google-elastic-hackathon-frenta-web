"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ApartmentActionIsland } from "@/components/apartment/apartment-action-island"
import { ApartmentHeader } from "@/components/apartment/apartment-header"
import { ApartmentTabs } from "@/components/apartment/apartment-tabs"
import { OverviewTab } from "@/components/apartment/tabs/overview-tab"
import { ClaimsTab } from "@/components/apartment/tabs/claims-tab"
import { DetailsTab } from "@/components/apartment/tabs/details-tab"
import { LocationTab } from "@/components/apartment/tabs/location-tab"
import { LocationSearchIsland } from "@/components/apartment/location-search-island"
import type { ApartmentDetail } from "@/lib/types"

interface ApartmentDetailClientProps {
  apartment: ApartmentDetail
}

export function ApartmentDetailClient({ apartment }: ApartmentDetailClientProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "claims" | "details" | "location">("overview")
  const [locationQueryHandler, setLocationQueryHandler] = useState<((query: string) => Promise<void>) | null>(null)
  const [locationSearchLoading, setLocationSearchLoading] = useState(false)
  const [isMapVisible, setIsMapVisible] = useState(false)

  const handleTabChange = (value: "overview" | "claims" | "details" | "location") => {
    setActiveTab(value)
  }

  const handleLocationQuerySubmit = useCallback((handler: (query: string) => Promise<void>) => {
    setLocationQueryHandler(() => handler)
  }, [])

  const handleMapVisibilityChange = useCallback((isVisible: boolean) => {
    setIsMapVisible(isVisible)
  }, [])

  const handleLocationSearch = async (query: string) => {
    if (!locationQueryHandler) return
    setLocationSearchLoading(true)
    try {
      await locationQueryHandler(query)
    } catch (err) {
      console.error("Location search failed:", err)
    } finally {
      setLocationSearchLoading(false)
    }
  }

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
  }

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 250,
        damping: 25,
        duration: 0.5,
      },
    },
  }

  return (
    <motion.div
      className="relative flex min-h-screen w-full flex-col bg-[#E8E7E5] pb-32"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <div className="relative z-10 flex w-full flex-col items-center pt-8">
        <div className="w-full max-w-7xl px-2 md:px-6 lg:px-12">
          <motion.div
            variants={itemVariants}
            initial="initial"
            animate="animate"
          >
            <ApartmentActionIsland />
          </motion.div>

          <motion.div
            className="flex flex-col w-full rounded-[16px] p-1"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            <motion.div 
              className="flex flex-col w-full bg-[#F7F6F4] rounded-[16px] p-5 md:p-8 lg:p-12"
            >
              <motion.div variants={itemVariants}>
                <ApartmentHeader apartment={apartment} />
              </motion.div>

              <motion.div variants={itemVariants}>
                <ApartmentTabs activeTab={activeTab} onTabChange={handleTabChange} />
              </motion.div>

              <motion.div 
                className="mt-6 text-[15px] w-full"
                variants={itemVariants}
              >
                {activeTab === "overview" && (
                  <OverviewTab 
                    apartment={apartment} 
                    onLocationQuerySubmit={handleLocationQuerySubmit}
                    onMapVisibilityChange={handleMapVisibilityChange}
                  />
                )}
                {activeTab === "claims" && <ClaimsTab apartment={apartment} />}
                {activeTab === "details" && <DetailsTab apartment={apartment} />}
                {activeTab === "location" && <LocationTab apartment={apartment} />}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isMapVisible && apartment.location && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-8 left-0 right-0 z-50 pointer-events-none px-2 md:px-6"
          >
            <LocationSearchIsland
              onSubmit={handleLocationSearch}
              loading={locationSearchLoading}
              disabled={!locationQueryHandler}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
