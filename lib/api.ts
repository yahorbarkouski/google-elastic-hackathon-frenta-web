import type { ApartmentsListResponse, ApartmentDetail, SearchResult, AvailabilityRange } from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function fetchApartments(
  page: number = 1,
  pageSize: number = 20,
  hasImages: boolean = false
): Promise<ApartmentsListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    has_images: hasImages.toString(),
  })

  const response = await fetch(`${API_BASE}/api/apartments?${params}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch apartments: ${response.statusText}`)
  }

  return response.json()
}

export async function fetchApartmentDetail(apartmentId: string): Promise<ApartmentDetail> {
  const response = await fetch(`${API_BASE}/api/apartments/${apartmentId}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch apartment: ${response.statusText}`)
  }

  return response.json()
}

export async function searchApartments(
  query: string,
  topK: number = 10,
  userLocation?: { lat: number; lng: number },
  verifyMatches?: boolean,
  doubleCheckMatches?: boolean
): Promise<{ results: SearchResult[] }> {
  const body: {
    query: string
    top_k: number
    user_location?: { lat: number; lng: number }
    verify_claims?: boolean
    double_check_matches?: boolean
  } = { query, top_k: topK }
  
  if (userLocation) {
    body.user_location = userLocation
  }
  
  if (verifyMatches !== undefined) {
    body.verify_claims = verifyMatches
  }
  
  if (doubleCheckMatches !== undefined) {
    body.double_check_matches = doubleCheckMatches
  }

  const response = await fetch(`${API_BASE}/api/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
  
  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`)
  }

  return response.json()
}

export async function generateApartmentPreview(params: {
  description?: string
  priceRange?: { min?: number; max?: number }
  numImages?: number
  neighborhoodHint?: string
  aspectRatio?: string
}): Promise<{
  preview_id: string
  apartment_id: string
  title: string
  description: string
  address: string
  neighborhood_id: string
  rent_price: number
  availability_dates: AvailabilityRange[]
  style_aesthetic: string
  images: Array<{
    index: number
    url: string
    type: string
    prompt: string
  }>
  num_images: number
  expires_in_hours: number
}> {
  const response = await fetch(`${API_BASE}/api/apartments/generate/preview`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description: params.description,
      price_range: params.priceRange,
      num_images: params.numImages || 6,
      neighborhood_hint: params.neighborhoodHint,
      aspect_ratio: params.aspectRatio || "16:9",
    }),
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }))
    throw new Error(error.detail || `Failed to generate preview: ${response.statusText}`)
  }

  return response.json()
}

export async function confirmApartmentGeneration(
  previewId: string,
  overrides?: {
    title?: string
    description?: string
    rent_price?: number
  }
): Promise<{
  apartment_id: string
  indexed: boolean
  elasticsearch_id: string
  message: string
}> {
  const response = await fetch(`${API_BASE}/api/apartments/generate/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      preview_id: previewId,
      overrides,
    }),
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }))
    throw new Error(error.detail || `Failed to confirm generation: ${response.statusText}`)
  }

  return response.json()
}

export async function cancelPreview(previewId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/preview/${previewId}`, {
    method: "DELETE",
  })
  
  if (!response.ok) {
    throw new Error(`Failed to cancel preview: ${response.statusText}`)
  }
}

export function getPreviewImageUrl(previewId: string, imageIndex: number): string {
  return `${API_BASE}/api/preview/${previewId}/${imageIndex}.png`
}

export function getImageUrl(imagePath: string): string {
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  if (imagePath.startsWith('/api/')) {
    return `${API_BASE}${imagePath}`
  }
  
  if (imagePath.includes('output/generated_apartments/')) {
    const filename = imagePath.split('/').pop()
    return `${API_BASE}/api/images/generated/${filename}`
  }
  
  return imagePath
}

export async function generateMapsGroundedContent(params: {
  prompt: string
  latitude: number
  longitude: number
  enableWidget?: boolean
}): Promise<{
  text: string
  widgetContextToken?: string
  groundingMetadata?: {
    groundingChunks?: Array<{
      maps?: {
        uri: string
        title: string
        placeId: string
      }
    }>
    googleMapsWidgetContextToken?: string
  }
}> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('Gemini API key not configured')
  }

  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: params.prompt,
              },
            ],
          },
        ],
        tools: [
          {
            googleMaps: {
              enableWidget: params.enableWidget ?? true,
            },
          },
        ],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: params.latitude,
              longitude: params.longitude,
            },
          },
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(
      error.error?.message || 'Failed to generate grounded content'
    )
  }

  const data = await response.json()
  const candidate = data.candidates?.[0]
  const grounding = candidate?.groundingMetadata

  return {
    text: candidate?.content?.parts?.[0]?.text || '',
    widgetContextToken: grounding?.googleMapsWidgetContextToken,
    groundingMetadata: grounding,
  }
}

export function getGeminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY
}

