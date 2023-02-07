import { readAtom, writeAtom } from "../../utils/JotaiNexus"
import { FieldState } from "../form/FieldState"
import { getFieldStateAtom } from "../form/fieldStatesStore"
import { formDataAtom } from "../formStore"
import { quillManager } from "../reportStore"

/**
 * Runs the automatic NLP form pre-filling
 */
export function runAutomaticExtraction() {
  const formData = readAtom(formDataAtom) || {}
  const fieldId = "#/properties/anamnesis/properties/age"
  const rangeIndex = 72
  const rangeLength = 9

  const newFormData = {
    ...formData,
    anamnesis: {
      ...formData.anamnesis,
      age: 42
    }
  }

  writeAtom(formDataAtom, newFormData)
  writeAtom(getFieldStateAtom(fieldId), FieldState.ROBOT_VALUE)
  quillManager.highlightText(rangeIndex, rangeLength, fieldId)
}