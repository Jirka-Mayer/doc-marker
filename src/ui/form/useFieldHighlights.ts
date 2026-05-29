import { useAtomValue } from "jotai";
import { useContext } from "react";
import { DocMarkerContext } from "../DocMarkerContext";

/**
 * Provides access to current highlights for a given field
 */
export function useFieldHighlights(fieldId: string) {
  const { reportStore } = useContext(DocMarkerContext);
  const highlightsRanges = useAtomValue(
    reportStore.getFieldHighlightsAtom(fieldId),
  );

  const hasHighlights = highlightsRanges.length > 0;

  return {
    highlightsRanges,
    hasHighlights,
  };
}
