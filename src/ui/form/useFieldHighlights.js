import { reportStore } from "../../state"
import { useAtom } from "jotai"

export function useFieldHighlights(fieldId) {
  const [highlightsRanges] = useAtom(
    reportStore.getFieldHighlightsAtom(fieldId)
  )

  const hasHighlights = highlightsRanges.length > 0

  return {
    highlightsRanges,
    hasHighlights
  }
}