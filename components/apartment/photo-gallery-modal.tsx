'use client'

import { getImageUrl } from "@/lib/api"
import { photoGalleryOpenAtom } from "@/lib/atoms/ui"
import { useSetAtom } from "jotai"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

interface PhotoGalleryModalProps {
  images: string[]
  isOpen: boolean
  onClose: () => void
  initialIndex?: number
}

export function PhotoGalleryModal({ images, isOpen, onClose, initialIndex = 0 }: PhotoGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)
  const setGalleryOpen = useSetAtom(photoGalleryOpenAtom)

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  useEffect(() => {
    setGalleryOpen(isOpen)
  }, [isOpen, setGalleryOpen])

  useEffect(() => {
    if (thumbnailContainerRef.current && isOpen) {
      const container = thumbnailContainerRef.current
      const thumbnailWidth = 104
      const scrollPosition = currentIndex * thumbnailWidth - container.clientWidth / 2 + thumbnailWidth / 2
      container.scrollTo({ left: scrollPosition, behavior: 'smooth' })
    }
  }, [currentIndex, isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, currentIndex])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          className="fixed inset-0 z-[100] flex flex-col bg-black"
          onClick={onClose}
        >
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6">
            <div className="text-white/90 text-sm font-medium backdrop-blur-md bg-black/20 px-4 py-2 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
            <button
              onClick={onClose}
              className="text-white/90 hover:text-white backdrop-blur-md bg-black/20 hover:bg-black/30 p-2 rounded-full transition-all"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div
            className="flex-1 relative flex items-center justify-center px-20 py-24"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait" custom={currentIndex}>
              <motion.div
                key={currentIndex}
                custom={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 100) goToPrevious()
                  else if (info.offset.x < -100) goToNext()
                }}
                className="relative w-full h-full"
              >
                <Image
                  src={getImageUrl(images[currentIndex])}
                  alt={`Photo ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-white/90 hover:text-white backdrop-blur-md bg-black/20 hover:bg-black/30 p-3 rounded-full transition-all"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-white/90 hover:text-white backdrop-blur-md bg-black/20 hover:bg-black/30 p-3 rounded-full transition-all"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
            className="relative z-10 border-t border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div ref={thumbnailContainerRef} className="px-6 py-4 overflow-x-auto flex justify-center">
              <div className="flex gap-2 min-w-min">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden transition-all ${
                      index === currentIndex
                        ? 'ring-2 ring-white opacity-100 scale-105'
                        : 'opacity-50 hover:opacity-75'
                    }`}
                  >
                    <Image
                      src={getImageUrl(image)}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

