"use client"

import { SearchIsland } from "@/components/search/search-island"
import { ApartmentPanel } from "@/components/apartment/apartment-panel"
import { useSearch } from "@/hooks/use-search"
import { EmptyState } from "@/components/shared/empty-state"

export default function Home() {
  const { results, loading, searched, search, doubleCheckMatches, setDoubleCheckMatches } = useSearch()

  const handleSearch = (tags: string[], verifyMatches: boolean, doubleCheck: boolean) => {
    if (tags.length === 0) return
    search(tags.join(" "), verifyMatches, doubleCheck)
  }

  return (
    <div className="relative flex min-h-[calc(100vh-100px)] flex-col items-center justify-between bg-[#E8E7E5] h-full">
      <div className="relative flex w-full flex-1">
        {results.length > 0 && !loading ? (
          <ApartmentPanel results={results} />
        ) : (
          <div className="flex flex-1 items-center justify-center px-4">
            {loading ? (
              <EmptyState message="Searching for apartments..." />
            ) : searched ? (
              <EmptyState message="No results found. Try a different query." />
            ) : (
              <div className="text-center space-y-4">
                <h1 className="text-3xl md:text-4xl font-title">Find your new home</h1>
                <p className="text-sm md:text-base text-muted-foreground">Share what you&apos;re looking for and we&apos;ll help you discover it</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="sticky bottom-3 md:bottom-5 z-30 flex w-full justify-center px-3 md:px-4">
        <SearchIsland
          onSubmit={handleSearch}
          loading={loading}
          disabled={loading}
          doubleCheckMatches={doubleCheckMatches}
          onDoubleCheckMatchesChange={setDoubleCheckMatches}
        />
      </div>
    </div>
  )
}
