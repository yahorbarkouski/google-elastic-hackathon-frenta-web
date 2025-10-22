"use client"

import { motion } from "framer-motion"
import { ArrowUp, Loader2, MapPin } from "lucide-react"
import { useId, useState } from "react"

type LocationSearchIslandProps = {
  onSubmit?: (query: string) => void
  loading?: boolean
  disabled?: boolean
  placeholder?: string
}

export function LocationSearchIsland({ onSubmit, loading, disabled, placeholder }: LocationSearchIslandProps) {
  const id = useId()
  const [query, setQuery] = useState("")

  const handleSubmit = () => {
    const trimmed = query.trim()
    if (!trimmed || disabled || loading) return
    onSubmit?.(trimmed)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="pointer-events-auto mx-auto flex w-full max-w-3xl items-center justify-center"
    >
      <div className="w-full max-w-3xl">
        <label htmlFor={id} className="sr-only">
          Search location
        </label>
        <motion.div
          className="relative overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/3 to-transparent" />

          <div className="flex items-center gap-3 px-5 py-4">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <input
              id={id}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit()
                }
              }}
              placeholder={placeholder || "Ask about this location (e.g., 'best coffee shops nearby')"}
              disabled={Boolean(disabled || loading)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
            />
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground/70 ring-1 ring-border transition-colors hover:bg-accent"
              onClick={handleSubmit}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp size={18} />}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

