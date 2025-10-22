import { useState, useCallback } from "react"
import { fetchApartmentDetail } from "@/lib/api"
import type { ApartmentDetail } from "@/lib/types"

export function useApartmentDetail() {
  const [apartment, setApartment] = useState<ApartmentDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadApartment = useCallback(async (apartmentId: string) => {
    setLoading(true)
    setError(null)
    try {
      const detail = await fetchApartmentDetail(apartmentId)
      setApartment(detail)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load apartment")
    } finally {
      setLoading(false)
    }
  }, [])

  const clearApartment = useCallback(() => {
    setApartment(null)
  }, [])

  return {
    apartment,
    loading,
    error,
    loadApartment,
    clearApartment,
  }
}

