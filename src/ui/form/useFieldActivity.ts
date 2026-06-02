import { useAtom } from "jotai";
import { useContext } from "react";
import { DocMarkerContext } from "../DocMarkerContext";

/**
 * Provides access to current activity for a given field
 */
export function useFieldActivity(fieldId: string) {
  const { editorStore } = useContext(DocMarkerContext);
  const [isFieldActive, setIsFieldActive] = useAtom(
    editorStore.fieldIsActiveAtoms.get(fieldId),
  );

  function toggleFieldActivity() {
    setIsFieldActive(!isFieldActive);
  }

  function setFieldActive() {
    setIsFieldActive(true);
  }

  return {
    isFieldActive,
    toggleFieldActivity,
    setFieldActive,
  };
}
