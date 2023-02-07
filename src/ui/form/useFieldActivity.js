import { useAtom } from "jotai"
import { activeFieldIdAtom } from "../../state/editorStore"

export function useFieldActivity(fieldId) {
  const [activeFieldId, setActiveFieldId] = useAtom(activeFieldIdAtom)
  
  const isFieldActive = activeFieldId === fieldId

  function toggleFieldActivity() {
    if (isFieldActive)
      setActiveFieldId(null)
    else
      setActiveFieldId(fieldId)
  }

  function setFieldActive() {
    setActiveFieldId(fieldId)
  }

  return {
    isFieldActive,
    toggleFieldActivity,
    setFieldActive
  }
}