"use client"

import { SearchIsland } from "@/components/search/search-island"
import { ApartmentPanel } from "@/components/apartment/apartment-panel"
import { useSearch } from "@/hooks/use-search"
import { EmptyState } from "@/components/shared/empty-state"

export default function Home() {
  const { query, results, loading, searched, search } = useSearch()

  const handleSearch = (tags: string[]) => {
    if (tags.length === 0) return
    search(tags.join(" "))
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between bg-[#E8E7E5]">
      <div className="relative z-[9999] flex w-full flex-1 items-stretch">
        {results.length > 0 && !loading ? (
          <ApartmentPanel results={results} />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            {loading ? (
              <EmptyState message="Searching for apartments..." />
            ) : searched ? (
              <EmptyState message="No results found. Try a different query." />
            ) : (
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-title">Find your perfect apartment</h1>
                <p className="text-muted-foreground">Search using natural language to find apartments that match your needs</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="sticky bottom-10 z-[9999] flex w-full justify-center px-4">
        <SearchIsland
          onSubmit={handleSearch}
          loading={loading}
          disabled={loading}
        />
      </div>
    </div>
  )
}
