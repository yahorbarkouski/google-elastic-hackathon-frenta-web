import { motion } from "framer-motion"
import { Image as ImageIcon, FileText, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatClaimText } from "@/lib/format-claim"
import type { Claim } from "@/lib/types"

interface ClaimItemProps {
  claim: Claim
  index: number
}

export function ClaimItem({ claim, index }: ClaimItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
      className="p-3 bg-card border rounded-lg"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="font-medium">{formatClaimText(claim.claim, claim.quantifiers)}</div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {claim.claim_type}
            </Badge>
            <Badge
              variant={claim.kind === "verified" ? "default" : "secondary"}
              className="text-xs"
            >
              {claim.kind}
            </Badge>
            {claim.room_type && (
              <Badge variant="outline" className="text-xs">
                {claim.room_type}
              </Badge>
            )}
            {claim.source.type === "image" && (
              <Badge variant="outline" className="text-xs">
                <ImageIcon className="h-3 w-3 mr-1" />
                image
              </Badge>
            )}
            {claim.source.type === "text" && (
              <Badge variant="outline" className="text-xs">
                <FileText className="h-3 w-3 mr-1" />
                text
              </Badge>
            )}
            {claim.grounding_metadata?.verified && (
              <Badge variant="outline" className="text-xs text-green-600">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                verified
              </Badge>
            )}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {(claim.weight * 100).toFixed(0)}%
        </div>
      </div>
      {claim.grounding_metadata && (
        <div className="mt-2 p-2 bg-muted rounded text-xs space-y-1">
          {claim.grounding_metadata.place_name && (
            <div>📍 {claim.grounding_metadata.place_name}</div>
          )}
          {claim.grounding_metadata.exact_distance_meters && (
            <div>📏 {claim.grounding_metadata.exact_distance_meters}m away</div>
          )}
          {claim.grounding_metadata.walking_time_minutes && (
            <div>🚶 {claim.grounding_metadata.walking_time_minutes.toFixed(1)} min walk</div>
          )}
        </div>
      )}
    </motion.div>
  )
}

