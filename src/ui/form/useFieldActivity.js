import { FormContext } from "./FormContext"
import { useContext } from "react"

export function useFieldActivity(fieldId) {
  const {
    activeFieldId,
    setActiveFieldId
  } = useContext(FormContext)
  
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