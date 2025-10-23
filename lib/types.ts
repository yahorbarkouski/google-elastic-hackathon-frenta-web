export interface AvailabilityRange {
  start: string
  end?: string
}

export interface ImageMetadata {
  url: string
  type: string
  index: number
  prompt?: string
  camera?: string
}

export interface Apartment {
  apartment_id: string
  title?: string
  address?: string
  neighborhood_id?: string
  location?: {
    lat: number
    lon: number
  }
  image_urls?: string[]
  image_metadata?: ImageMetadata[]
  claim_count: number
  rent_price?: number
  availability_dates?: AvailabilityRange[]
  property_summary?: string
  location_summary?: string
  location_widget_token?: string
}

export interface Quantifier {
  qtype: "count" | "area" | "money" | "distance" | "time"
  noun: string
  vmin: number
  vmax: number
  op: "EQUALS" | "GTE" | "LTE" | "APPROX"
  unit?: string
}

export interface Claim {
  claim: string
  claim_type: string
  kind: "base" | "derived" | "anti" | "verified"
  domain: "neighborhood" | "apartment" | "room"
  room_type?: string
  is_specific: boolean
  has_quantifiers: boolean
  from_claim?: string
  weight: number
  negation: boolean
  source: {
    type: "text" | "image"
    image_url?: string
    image_index?: number
  }
  grounding_metadata?: GroundingMetadata
  quantifiers?: Quantifier[]
}

export interface GroundingMetadata {
  verified: boolean
  source: string
  place_id?: string
  place_name?: string
  place_uri?: string
  coordinates?: {
    lat: number
    lon: number
  }
  exact_distance_meters?: number
  walking_time_minutes?: number
  confidence: number
  verified_at?: string
  supporting_evidence?: string
}

export interface ApartmentDetail extends Apartment {
  total_claims: number
  claims: Claim[]
  summary?: {
    base_claims: number
    verified_claims: number
    derived_claims: number
  }
}

export interface MatchedClaim {
  query_claim: string
  matched_claim: string
  similarity: number
  domain: string
  kind: string
  room_type?: string
  query_quantifiers?: Quantifier[]
  matched_quantifiers?: Quantifier[]
}

export interface GroundedSource {
  title: string
  uri: string
  rating?: number
  category: string
}

export interface SearchResult {
  apartment_id: string
  title?: string
  address?: string
  final_score: number
  coverage_count: number
  coverage_ratio: number
  weight_coverage: number
  matched_claims: MatchedClaim[]
  domain_scores: {
    apartment: number
    neighborhood: number
    room: number
  }
  geo_proximity?: {
    distance: string
    location: string
  }
  grounded_sources?: GroundedSource[]
  map_widget_tokens?: string[]
  image_urls?: string[]
  image_metadata?: ImageMetadata[]
  rent_price?: number
  availability_dates?: AvailabilityRange[]
}

export interface PaginationInfo {
  page: number
  page_size: number
  total: number
  total_pages: number
}

export interface ApartmentsListResponse {
  apartments: Apartment[]
  pagination: PaginationInfo
}

