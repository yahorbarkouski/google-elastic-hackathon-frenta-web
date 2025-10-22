"use client"

import { motion } from "framer-motion"

type TabType = "overview" | "claims" | "details" | "location"

interface ApartmentTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function ApartmentTabs({ activeTab, onTabChange }: ApartmentTabsProps) {
  return (
    <div className="mt-8">
      <div className="flex relative gap-x-3">
        <button
          onClick={() => onTabChange("overview")}
          className={`px-2 py-2 text-neutral-600 text-[15px] relative ${
            activeTab === "overview" ? "text-neutral-900" : ""
          }`}
        >
          Overview
          {activeTab === "overview" && (
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-neutral-900 w-full"
              layoutId="activeTab"
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            />
          )}
        </button>
        <button
          onClick={() => onTabChange("claims")}
          className={`px-2 py-2 text-neutral-600 text-[15px] relative ${
            activeTab === "claims" ? "text-neutral-900" : ""
          }`}
        >
          Claims
          {activeTab === "claims" && (
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-neutral-900 w-full"
              layoutId="activeTab"
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            />
          )}
        </button>
        <button
          onClick={() => onTabChange("details")}
          className={`px-2 py-2 text-neutral-600 text-[15px] relative ${
            activeTab === "details" ? "text-neutral-900" : ""
          }`}
        >
          Details
          {activeTab === "details" && (
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-neutral-900 w-full"
              layoutId="activeTab"
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            />
          )}
        </button>
        <button
          onClick={() => onTabChange("location")}
          className={`px-2 py-2 text-neutral-600 text-[15px] relative ${
            activeTab === "location" ? "text-neutral-900" : ""
          }`}
        >
          Location
          {activeTab === "location" && (
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-neutral-900 w-full"
              layoutId="activeTab"
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            />
          )}
        </button>
      </div>
    </div>
  )
}

