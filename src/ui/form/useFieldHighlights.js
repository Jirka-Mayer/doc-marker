import { highlightsAtom } from "../../state/reportStore"
import { useAtom } from "jotai"

export function useFieldHighlights(fieldId) {
  // TODO: highlights need to be optimized via parallel atoms,
  // like field activity and field state is

  // HACK: The highlighting is disabled for now:
  // const [highlightsGlobal] = useAtom(highlightsAtom)
  highlightsGlobal = {}

  const highlightsRanges = highlightsGlobal[fieldId] || []

  const hasHighlights = highlightsRanges.length > 0

  return {
    highlightsRanges,
    hasHighlights
  }
}