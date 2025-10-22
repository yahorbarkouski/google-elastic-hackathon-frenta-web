import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ClaimItem } from "./claim-item"
import type { Claim } from "@/lib/types"

interface ClaimsByDomainProps {
  claims: Claim[]
}

export function ClaimsByDomain({ claims }: ClaimsByDomainProps) {
  const groupedClaims = claims.reduce((acc, claim) => {
    if (!acc[claim.domain]) {
      acc[claim.domain] = []
    }
    acc[claim.domain].push(claim)
    return acc
  }, {} as Record<string, Claim[]>)

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Claims by Domain</h4>
      {Object.entries(groupedClaims).map(([domain, domainClaims]) => (
        <Collapsible key={domain}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
            <div className="flex items-center gap-2">
              <span className="font-medium capitalize">{domain}</span>
              <Badge variant="outline">{domainClaims.length}</Badge>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {domainClaims.map((claim, idx) => (
              <ClaimItem key={idx} claim={claim} index={idx} />
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}

