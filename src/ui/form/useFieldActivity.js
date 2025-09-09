import { useAtom } from "jotai"
import * as editorStore from "../../state/editorStore"

export function useFieldActivity(fieldId) {
  const [isFieldActive, setIsFieldActive] = useAtom(
    editorStore.getFieldIsActiveAtom(fieldId)
  )

  function toggleFieldActivity() {
    setIsFieldActive(!isFieldActive)
  }

  function setFieldActive() {
    setIsFieldActive(true)
  }

  return {
    isFieldActive,
    toggleFieldActivity,
    setFieldActive
  }
}