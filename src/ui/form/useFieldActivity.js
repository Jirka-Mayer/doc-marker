import { useAtom } from "jotai"
import { editorStore } from "../../state"

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