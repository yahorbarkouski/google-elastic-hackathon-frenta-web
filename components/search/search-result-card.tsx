import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { SearchResult } from "@/lib/types"
import { Home, MapPin, Star } from "lucide-react"

interface SearchResultCardProps {
  result: SearchResult
}

function getScoreColor(score: number): string {
  if (score >= 0.8) return "text-green-600"
  if (score >= 0.6) return "text-yellow-600"
  if (score >= 0.4) return "text-orange-600"
  return "text-red-600"
}

function getScoreLabel(score: number): string {
  if (score >= 0.8) return "Excellent"
  if (score >= 0.6) return "Good"
  if (score >= 0.4) return "Partial"
  return "Weak"
}

export function SearchResultCard({ result }: SearchResultCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-lg">
                {result.apartment_id}
              </h3>
            </div>
            {result.geo_proximity && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {result.geo_proximity.distance} to {result.geo_proximity.location}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Match Score:</span>
              <span className={`text-2xl font-bold ${getScoreColor(result.final_score)}`}>
                {(result.final_score * 100).toFixed(0)}%
              </span>
            </div>
            <Badge variant="outline">
              {getScoreLabel(result.final_score)} Match
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Coverage</div>
            <div className="font-semibold">
              {result.coverage_count} claims ({(result.coverage_ratio * 100).toFixed(0)}%)
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Apartment</div>
            <div className="font-semibold">
              {(result.domain_scores.apartment * 100).toFixed(0)}%
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Neighborhood</div>
            <div className="font-semibold">
              {(result.domain_scores.neighborhood * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {result.matched_claims.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Matched Claims</div>
            <div className="flex flex-wrap gap-2">
              {result.matched_claims.slice(0, 8).map((claim, idx) => {
                const similarityValue = claim.similarity ?? 0
                const similarity = (similarityValue * 100).toFixed(0)
                const getBgColor = (sim: number) => {
                  if (sim >= 90) return "bg-green-100 text-green-800 border-green-200"
                  if (sim >= 80) return "bg-blue-100 text-blue-800 border-blue-200"
                  if (sim >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200"
                  return "bg-gray-100 text-gray-800 border-gray-200"
                }
                
                return (
                  <Badge
                    key={idx}
                    variant="outline"
                    className={`text-xs ${getBgColor(similarityValue * 100)}`}
                  >
                    <span className="font-semibold mr-1">{similarity}%</span>
                    {claim.matched_claim}
                    {claim.kind === "verified" && (
                      <Star className="h-3 w-3 ml-1 inline fill-yellow-400 text-yellow-400" />
                    )}
                  </Badge>
                )
              })}
              {result.matched_claims.length > 8 && (
                <Badge variant="outline" className="text-xs">
                  +{result.matched_claims.length - 8} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {result.grounded_sources && result.grounded_sources.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Verified Locations</div>
            <div className="flex flex-wrap gap-2">
              {result.grounded_sources.map((source, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {source.title}
                  {source.rating && ` (${source.rating}★)`}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

