import { useAtom } from "jotai"
import { getFieldIsActiveAtom } from "../../state/editorStore"

export function useFieldActivity(fieldId) {
  const [isFieldActive, setIsFieldActive] = useAtom(getFieldIsActiveAtom(fieldId))

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