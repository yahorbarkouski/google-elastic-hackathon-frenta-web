"use client"

import { APIProvider } from "@vis.gl/react-google-maps"

export function MapsProvider({ children }: { children: React.ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

  return (
    <APIProvider 
      apiKey={apiKey} 
      version="alpha"
      solutionChannel="GMP_apartment_search_v1"
    >
      {children}
    </APIProvider>
  )
}

