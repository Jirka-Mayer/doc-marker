import { highlightsAtom } from "../report/reportStore"
import { useAtom } from "jotai"

export function useFieldHighlights(fieldId) {
  const [highlightsGlobal] = useAtom(highlightsAtom)

  const highlightsRanges = highlightsGlobal[fieldId] || []

  const hasHighlights = highlightsRanges.length > 0

  return {
    highlightsRanges,
    hasHighlights
  }
}