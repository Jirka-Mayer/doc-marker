import { FormContext } from "./FormContext"
import { useContext } from "react"

export function useFieldHighlights(fieldId) {
  const {
    highlights: highlightsGlobal
  } = useContext(FormContext)

  const highlightsRanges = highlightsGlobal[fieldId] || []

  const hasHighlights = highlightsRanges.length > 0

  return {
    highlightsRanges,
    hasHighlights
  }
}