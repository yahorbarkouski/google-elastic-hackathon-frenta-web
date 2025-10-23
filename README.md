# Apartment Search Frontend (for google & elastic hackathon)

Semantic apartment search interface. Search by natural language, see results with matched claims and verified locations.

## Stack

- Next.js 15 (Turbopack)
- React 19
- Jotai (state)
- shadcn/ui + Tailwind
- Framer Motion
- Google Maps JavaScript API

## Setup

Install dependencies:
```bash
bun install
```

Configure environment:
```bash
cp .env.local.example .env.local
# Edit .env.local with your API keys
```

Required keys:
- `GEMINI_API_KEY` - Gemini API for Maps grounding widgets
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API (enable Maps JavaScript API + Places API)
- `NEXT_PUBLIC_API_URL` - Backend URL (default: `http://localhost:8000`)

## Run

```bash
bun dev
```

Open http://localhost:3000

## Features

**Search**: Type natural language queries like "2BR with hardwood floors near subway in Brooklyn under $4000"

**Results**: 
- Color-coded claim badges showing match strength
- Verified location claims marked with checkmarks
- Image galleries for apartments with photos
- Interactive Google Maps widgets

**Pages**:
- `/` - Search interface
- `/apartments/[id]` - Apartment detail view
- `/database` - All indexed apartments

## How it works

1. User types query → debounced search request to backend
2. Backend returns ranked results with matched claims
3. Display apartments sorted by coverage + score
4. Claims shown as badges (green = strong match, amber = weaker)
5. Maps widgets render for verified location data

State managed with Jotai atoms. API calls in `lib/api.ts`. Search logic in `hooks/use-search.ts`.

