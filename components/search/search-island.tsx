"use client"

import { motion } from "framer-motion"
import { ArrowUp, Check, Loader2, Search } from "lucide-react"
import { useId, useState } from "react"

import { ClaimMagicInput, type SuggestionNotice } from "./claim-magic-input"

type SearchIslandProps = {
  onSubmit?: (tags: string[], verifyMatches: boolean, doubleCheckMatches: boolean) => void
  loading?: boolean
  disabled?: boolean
  showSuggestion?: SuggestionNotice | null
  onAcceptSuggestion?: () => void
  onRejectSuggestion?: () => void
  forceTags?: string[]
  suggestions?: string[]
  onOpenFilters?: () => void
  doubleCheckMatches?: boolean
  onDoubleCheckMatchesChange?: (value: boolean) => void
}

export function SearchIsland({ onSubmit, loading, disabled, showSuggestion, onAcceptSuggestion, onRejectSuggestion, forceTags, suggestions, onOpenFilters, doubleCheckMatches = false, onDoubleCheckMatchesChange }: SearchIslandProps) {
  const id = useId()
  const [currentTags, setCurrentTags] = useState<string[]>([])
  const [currentText, setCurrentText] = useState("")
  const [verifyMatches, setVerifyMatches] = useState(true)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="pointer-events-auto mx-auto flex w-full max-w-4xl items-center justify-center"
    >
      <div className="w-full max-w-4xl">
        <label htmlFor={id} className="sr-only">
          Search
        </label>
        <motion.div
          className="relative overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/3 to-transparent" />

          <div className="flex items-center gap-3 px-5 py-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <ClaimMagicInput
              className="flex-1"
              placeholder="Search apartments..."
              disabled={Boolean(disabled || loading)}
              onSubmit={value => onSubmit?.(value, verifyMatches, doubleCheckMatches)}
              onChangeTags={setCurrentTags}
              onChangeText={setCurrentText}
              onFocusChange={undefined}
              suggestions={suggestions ?? ["2BR with hardwood floors near subway", "Pet-friendly with balcony", "Luxury building with gym and doorman"]}
              showSuggestion={showSuggestion ?? undefined}
              inputId={id}
              forceTags={forceTags}
            />
            {showSuggestion ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Reject"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-foreground/70 ring-1 ring-border transition-colors hover:cursor-pointer hover:bg-red-500/10"
                  onClick={() => onRejectSuggestion?.()}
                >
                  ×
                </button>
                <button
                  type="button"
                  aria-label="Accept"
                  onClick={() => onAcceptSuggestion?.()}
                  className="relative ml-1 flex h-[34px] items-center gap-1 rounded-[16px] border-[1px] bg-green-700/10 px-3 text-green-700 ring-1 transition-transform hover:cursor-pointer hover:bg-green-700/20"
                >
                  <Check size={16} />
                  <span className="text-sm font-medium">Accept</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground/70 ring-1 ring-border transition-colors hover:bg-accent"
                onClick={() => {
                  if (disabled || loading) return
                  const pending = currentText.trim()
                  const submitted = [...currentTags, ...(pending ? [pending] : [])]
                  if (submitted.length === 0) return
                  onSubmit?.(submitted, verifyMatches, doubleCheckMatches)
                }}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp size={18} />}
              </button>
            )}
          </div>

          <div className="border-t border-border/60 px-5 py-3">
            <div className="flex items-center gap-2">
              <motion.button
                type="button"
                className={`flex items-center gap-2 rounded-full border px-3 py-1 ${
                  verifyMatches
                    ? "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/40 dark:bg-sky-500/15 dark:text-sky-200"
                    : "text-muted-foreground/50 border-border"
                }`}
                onClick={() => setVerifyMatches(!verifyMatches)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                <motion.div 
                  className={`h-1 w-1 rounded-full ${verifyMatches ? "bg-sky-600" : "bg-muted-foreground/40"}`}
                  animate={{ 
                    scale: verifyMatches ? [1, 1.3, 1] : 1,
                    opacity: verifyMatches ? [1, 0.7, 1] : 0.6
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: verifyMatches ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                />
                <span className="select-none text-sm font-medium">Double-check matches</span>
              </motion.button>

              <motion.button
                type="button"
                className={`flex items-center gap-2 rounded-full border px-3 py-1 ${
                  doubleCheckMatches
                    ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-200"
                    : "text-muted-foreground/50 border-border"
                }`}
                onClick={() => onDoubleCheckMatchesChange?.(!doubleCheckMatches)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                <motion.div 
                  className={`h-1 w-1 rounded-full ${doubleCheckMatches ? "bg-amber-600" : "bg-muted-foreground/40"}`}
                  animate={{ 
                    scale: doubleCheckMatches ? [1, 1.3, 1] : 1,
                    opacity: doubleCheckMatches ? [1, 0.7, 1] : 0.6
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: doubleCheckMatches ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                />
                <span className="select-none text-sm font-medium">Ignore thresholds</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

