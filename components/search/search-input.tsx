import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  disabled?: boolean
}

export function SearchInput({ value, onChange, onSearch, disabled }: SearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch()
    }
  }

  return (
    <div className="flex gap-2">
      <Input
        placeholder="e.g., 2BR with hardwood floors near subway in Brooklyn"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
      />
      <Button onClick={onSearch} disabled={disabled}>
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  )
}

