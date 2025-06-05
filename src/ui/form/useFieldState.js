import { useAtom } from "jotai"
import { FieldState, formStore } from "../../state"

export function useFieldState(fieldId, isFieldActive) {
  const [fieldState, setFieldState] = useAtom(
    formStore.getFieldStateAtom(fieldId)
  )

  const hasRobotValue = (
    fieldState === FieldState.ROBOT_VALUE
    || fieldState === FieldState.ROBOT_VALUE_VERIFIED
  )

  const isVerified = (
    fieldState === FieldState.ROBOT_VALUE_VERIFIED
    || fieldState === FieldState.HUMAN_VALUE
  )

  function toggleRobotVerified() {
    if (fieldState === FieldState.ROBOT_VALUE_VERIFIED)
      setFieldState(FieldState.ROBOT_VALUE)
    else if (fieldState === FieldState.ROBOT_VALUE)
      setFieldState(FieldState.ROBOT_VALUE_VERIFIED)
  }

  function updateFieldStateWithChange(newData) {
    if (newData === undefined)
      setFieldState(FieldState.EMPTY)
    else
      setFieldState(FieldState.HUMAN_VALUE)
  }
  
  return {
    fieldState, setFieldState,
    hasRobotValue,
    isVerified,
    toggleRobotVerified,
    updateFieldStateWithChange
  }
}