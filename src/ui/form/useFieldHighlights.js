import { getFieldHighlightsAtom } from "../../state/reportStore"
import { useAtom } from "jotai"

export function useFieldHighlights(fieldId) {
  const [highlightsRanges] = useAtom(getFieldHighlightsAtom(fieldId))

  const hasHighlights = highlightsRanges.length > 0

  return {
    highlightsRanges,
    hasHighlights
  }
}