import type { Quantifier } from "./types"

const formatQuantifierValue = (q: Quantifier): string => {
  const formatNumber = (n: number) => {
    if (n === Math.floor(n)) return n.toString()
    return n.toFixed(1)
  }

  const value = q.vmin === q.vmax ? formatNumber(q.vmin) : `${formatNumber(q.vmin)}-${formatNumber(q.vmax)}`

  if (q.qtype === "money") {
    return `$${value}`
  }
  if (q.qtype === "area") {
    return q.unit === "sqm" ? `${value}m²` : `${value} ${q.unit || ""}`
  }
  if (q.qtype === "distance") {
    if (q.unit === "meters" && q.vmin < 10) {
      const feetMin = q.vmin * 3.28084
      const feetMax = q.vmax * 3.28084
      const feetValue = q.vmin === q.vmax 
        ? formatNumber(feetMin) 
        : `${formatNumber(feetMin)}-${formatNumber(feetMax)}`
      return `${feetValue}ft`
    }
    if (q.unit === "meters" && q.vmin < 1000) {
      return `${value}m`
    }
    if (q.unit === "meters") {
      const km = q.vmin / 1000
      return `${formatNumber(km)}km`
    }
    return `${value}${q.unit || ""}`
  }
  if (q.qtype === "time") {
    return `${value} ${q.unit || "min"}`
  }

  return q.unit ? `${value} ${q.unit}` : value
}

export const formatClaimText = (text: string, quantifiers?: Quantifier[]): string => {
  let formatted = text
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())

  if (quantifiers && quantifiers.length > 0) {
    quantifiers.forEach((q, index) => {
      const placeholder = `VAR ${index + 1}`
      const value = formatQuantifierValue(q)
      formatted = formatted.replace(placeholder, value)
    })
  }

  return formatted
}

