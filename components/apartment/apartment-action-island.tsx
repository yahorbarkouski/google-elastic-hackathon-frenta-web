"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Share2, BookmarkPlus, MoreHorizontal } from "lucide-react"
import { useTransitionRouter } from "next-view-transitions"

export function ApartmentActionIsland() {
  const router = useTransitionRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="pointer-events-auto mx-auto flex w-full items-center justify-center"
    >
      <div className="w-full">
        <motion.div
          className="relative overflow-hidden rounded-[20px] p-1"
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="relative overflow-hidden rounded-[16px] bg-[#F7F6F4]">
            <div className="flex items-center justify-between gap-2 px-1 py-1">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-[#E8E7E5] hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="Share apartment"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="More options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

