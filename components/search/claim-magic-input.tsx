"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"
import type { KeyboardEvent } from "react"

type Tag = {
  id: string
  text: string
  color: string
  tint: string
}

function generateColorFromText(text: string) {
  let hash = 0
  for (let i = 0; i < text.length; i++) hash = (hash << 5) - hash + text.charCodeAt(i)
  const hue = Math.abs(hash) % 360
  const bg = `oklch(0.96 0.03 ${hue})`
  const fg = `oklch(0.45 0.12 ${hue})`
  return { bg, fg }
}

function shallowEqualStrings(a: readonly string[] | null | undefined, b: readonly string[] | null | undefined) {
  if (a === b) return true
  if (!a || !b) return false
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

export type SuggestionNotice = {
  originalTags: string[]
  suggestedTags: string[]
}

export type ClaimMagicInputProps = {
  placeholder?: string
  className?: string
  onChangeText?: (value: string) => void
  onChangeTags?: (tags: string[]) => void
  suggestions?: string[]
  rotateMs?: number
  disabled?: boolean
  onSubmit?: (submitted: string[]) => void
  forceTags?: string[]
  showSuggestion?: SuggestionNotice | null
  inputId?: string
  onFocusChange?: (focused: boolean) => void
}

const fallbackTips = [
  "2BR with hardwood floors near subway",
  "Pet-friendly apartment with balcony",
  "Luxury building with gym, doorman, laundry",
]

export function ClaimMagicInput({ placeholder = "Search apartments...", className, onChangeText, onChangeTags, suggestions, rotateMs = 2600, disabled = false, onSubmit, forceTags, showSuggestion, inputId, onFocusChange }: ClaimMagicInputProps) {
  const generatedId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState("")
  const [tags, setTags] = useState<Tag[]>([])
  const prevTagsLen = useRef(0)
  const [isExiting, setIsExiting] = useState(false)
  const [suggestionReady, setSuggestionReady] = useState(false)
  const tagRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [focusedTagIndex, setFocusedTagIndex] = useState<number | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const tipTexts = useMemo(() => (suggestions && suggestions.length > 0 ? suggestions : fallbackTips), [suggestions])
  const [tipIndex, setTipIndex] = useState(0)
  const lastForcedTags = useRef<string[] | null>(null)

  const showOverlayPlaceholder = tags.length === 0 && value.length === 0 && !isExiting && !disabled && !showSuggestion

  useEffect(() => {
    if (!showOverlayPlaceholder) return
    const id = window.setInterval(() => setTipIndex(i => (i + 1) % tipTexts.length), rotateMs)
    return () => clearInterval(id)
  }, [rotateMs, showOverlayPlaceholder, tipTexts.length])

  useEffect(() => {
    setTipIndex(index => (tipTexts.length === 0 ? 0 : index % tipTexts.length))
  }, [tipTexts])

  useEffect(() => {
    if (prevTagsLen.current > 0 && tags.length === 0) setIsExiting(true)
    prevTagsLen.current = tags.length
  }, [tags.length])

  useEffect(() => {
    if (!forceTags) {
      lastForcedTags.current = null
      return
    }
    if (shallowEqualStrings(lastForcedTags.current, forceTags)) return
    lastForcedTags.current = [...forceTags]
    const seeded: Tag[] = forceTags.map(text => {
      const { bg, fg } = generateColorFromText(text)
      return { id: `${text}-${Math.random().toString(36).slice(2, 8)}`, text, color: fg, tint: bg }
    })
    setTags(prev => {
      const same = prev.length === seeded.length && prev.every((tag, index) => tag.text === seeded[index].text)
      return same ? prev : seeded
    })
    setValue(prev => (prev.length === 0 ? prev : ""))
  }, [forceTags])

  useEffect(() => {
    if (!showSuggestion) {
      setSuggestionReady(false)
      return
    }
    setTags(prev => (prev.length === 0 ? prev : []))
    setValue(prev => (prev.length === 0 ? prev : ""))
    const timer = window.setTimeout(() => setSuggestionReady(true), 120)
    return () => {
      window.clearTimeout(timer)
      setSuggestionReady(false)
    }
  }, [showSuggestion])

  useEffect(() => {
    onFocusChange?.(isFocused)
  }, [isFocused, onFocusChange])

  const handleAddTag = useCallback(() => {
    const text = value.trim()
    if (!text) return
    const { bg, fg } = generateColorFromText(text)
    const newTag: Tag = { id: `${Date.now()}-${text}`.toLowerCase(), text, color: fg, tint: bg }
    setTags(prev => {
      const next = [...prev, newTag]
      onChangeTags?.(next.map(t => t.text))
      return next
    })
    setValue("")
    onChangeText?.("")
    setFocusedTagIndex(null)
  }, [onChangeTags, onChangeText, value])

  const removeTagAt = useCallback(
    (targetIndex: number) => {
      setTags(prev => {
        if (prev.length === 0) return prev
        const index = Math.min(targetIndex, prev.length - 1)
        if (index < 0) return prev
        const next = prev.filter((_, i) => i !== index)
        if (next.length === prev.length) return prev
        onChangeTags?.(next.map(t => t.text))
        queueMicrotask(() => {
          const newIndex = Math.min(index - 1, next.length - 1)
          if (newIndex >= 0) {
            setFocusedTagIndex(newIndex)
            tagRefs.current[newIndex]?.focus()
            return
          }
          setFocusedTagIndex(null)
          inputRef.current?.focus()
        })
        return next
      })
    },
    [onChangeTags]
  )

  const handleBackspace = useCallback(() => {
    if (value.length > 0) return
    if (tags.length === 0) return
    if (focusedTagIndex !== null) {
      removeTagAt(focusedTagIndex)
      return
    }
    removeTagAt(Number.POSITIVE_INFINITY)
  }, [focusedTagIndex, removeTagAt, tags.length, value.length])

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Tab") {
        e.preventDefault()
        handleAddTag()
      } else if (e.key === "Backspace") {
        handleBackspace()
      } else if (e.key === "Enter") {
        e.preventDefault()
        const pending = value.trim()
        const submitted = [...tags.map(t => t.text), ...(pending ? [pending] : [])]
        onSubmit?.(submitted)
      } else if (e.key === "ArrowLeft") {
        const caretAtStart = (e.currentTarget.selectionStart || 0) === 0
        if (caretAtStart && tags.length > 0) {
          e.preventDefault()
          const index = tags.length - 1
          setFocusedTagIndex(index)
          queueMicrotask(() => {
            tagRefs.current[index]?.focus()
          })
        }
      } else if (e.key === "ArrowRight") {
        const caretAtEnd = (e.currentTarget.selectionStart || 0) === value.length
        if (caretAtEnd && focusedTagIndex !== null) {
          e.preventDefault()
          queueMicrotask(() => {
            setFocusedTagIndex(null)
            inputRef.current?.focus()
          })
        }
      }
    },
    [focusedTagIndex, handleAddTag, handleBackspace, onSubmit, tags, value]
  )

  const containerClass = useMemo(
    () =>
      [
        "group relative flex min-h-10 flex-wrap items-center gap-2 rounded-[20px]",
        disabled ? "opacity-70" : "opacity-100",
        "px-0 py-0 transition-opacity duration-200",
        className || "",
      ].join(" "),
    [className, disabled]
  )

  return (
    <div className={`${containerClass} claim-magic-input-container`} data-keyboard-exempt="true">
      <div className="flex min-h-10 flex-1 flex-wrap items-center gap-2">
        <AnimatePresence initial={false} onExitComplete={() => setIsExiting(false)}>
          {tags.map((tag, i) => (
            <motion.button
              key={tag.id}
              type="button"
              initial={{ scale: 0.9, opacity: 0, y: 4 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -4 }}
              transition={{ type: "spring", duration: 0.1, bounce: 0.1 }}
              ref={el => {
                tagRefs.current[i] = el
              }}
              className={[
                "inline-flex items-center px-3 py-1 text-sm rounded-[13px] focus:outline-none",
                focusedTagIndex === i ? "ring-1" : "ring-0",
              ].join(" ")}
              style={{ backgroundColor: tag.tint, color: tag.color, border: `1px solid color-mix(in oklch, ${tag.color} 25%, transparent)` }}
              onKeyDown={e => {
                if (e.key === "ArrowLeft") {
                  e.preventDefault()
                  const prev = i - 1
                  if (prev >= 0) {
                    setFocusedTagIndex(prev)
                    tagRefs.current[prev]?.focus()
                  }
                } else if (e.key === "ArrowRight") {
                  e.preventDefault()
                  const next = i + 1
                  if (next < tags.length) {
                    setFocusedTagIndex(next)
                    tagRefs.current[next]?.focus()
                  } else {
                    setFocusedTagIndex(null)
                    inputRef.current?.focus()
                  }
                } else if (e.key === "Backspace" || e.key === "Delete") {
                  e.preventDefault()
                  const next = tags.filter((_, idx) => idx !== i)
                  setTags(next)
                  onChangeTags?.(next.map(t => t.text))
                  const newIndex = Math.min(i - 1, next.length - 1)
                  if (newIndex >= 0) {
                    setFocusedTagIndex(newIndex)
                    queueMicrotask(() => tagRefs.current[newIndex]?.focus())
                  } else {
                    setFocusedTagIndex(null)
                    queueMicrotask(() => inputRef.current?.focus())
                  }
                }
              }}
              onFocus={() => {
                setFocusedTagIndex(i)
                setIsFocused(true)
              }}
              onBlur={e => {
                if (!e.currentTarget.closest(".claim-magic-input-container")?.contains(e.relatedTarget)) {
                  setIsFocused(false)
                }
              }}
            >
              {tag.text}
            </motion.button>
          ))}
        </AnimatePresence>

        {showSuggestion && suggestionReady ? (
          <div className="flex flex-1 flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">No matches for</span>
            <span className="inline-flex items-center rounded-[10px] border border-red-200/50 bg-red-50 px-2 py-1 text-red-700">
              {showSuggestion.originalTags[0]}
            </span>
            <span className="-ml-1.5 text-muted-foreground">, you might be searching for:</span>
            {showSuggestion.originalTags.slice(1).map((tag, index) => {
              const { bg, fg } = generateColorFromText(tag)
              return (
                <span
                  key={`kept-${index}`}
                  className="inline-flex cursor-pointer items-center rounded-[10px] px-2 py-1 transition-opacity hover:opacity-80"
                  style={{ backgroundColor: bg, color: fg, border: `1px solid color-mix(in oklch, ${fg} 25%, transparent)` }}
                >
                  {tag}
                </span>
              )
            })}
            {showSuggestion.suggestedTags.map((tag, index) => {
              const { bg, fg } = generateColorFromText(tag)
              return (
                <span
                  key={`sugg-${index}`}
                  className="inline-flex cursor-pointer items-center rounded-[10px] px-2 py-1 transition-opacity hover:opacity-80"
                  style={{ backgroundColor: bg, color: fg, border: `1px solid color-mix(in oklch, ${fg} 25%, transparent)` }}
                >
                  {tag}
                </span>
              )
            })}
          </div>
        ) : (
          <div className="relative min-w-[10ch] flex-1">
            <input
              id={inputId || generatedId}
              ref={inputRef}
              value={value}
              onChange={e => {
                setValue(e.target.value)
                onChangeText?.(e.target.value)
              }}
              onKeyDown={onKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={e => {
                if (!e.currentTarget.closest(".claim-magic-input-container")?.contains(e.relatedTarget)) {
                  setIsFocused(false)
                }
              }}
              disabled={disabled}
              placeholder=""
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="w-full bg-transparent text-base outline-none"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center">
              <div className="relative h-6 overflow-hidden">
                <AnimatePresence mode="wait">
                  {showOverlayPlaceholder && (
                    <motion.span
                      key={tipIndex}
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                      className="block text-muted-foreground/80"
                    >
                      {tipTexts[tipIndex] || placeholder}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClaimMagicInput

