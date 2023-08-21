import { FieldState } from "../form/FieldState"
import { getFieldStateAtom } from "../form/fieldStatesStore"
import { formDataAtom } from "../formStore"
import { quillExtended } from "../reportStore"
import { getDefaultStore } from "jotai"

// lets us manipulate atoms from the non-jotai/react code
const jotaiStore = getDefaultStore()

/**
 * Runs the automatic NLP form pre-filling
 */
export function runAutomaticExtraction() {
  const formData = jotaiStore.get(formDataAtom) || {}
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

  // TODO: programmatic form data manipulation has been modified,
  // because of data exporting and such. So this direct modification
  // may not work anymore. Check that once you need to implement this.
  // One approach would be to simulate how form controls modify data.
  // Another would be to set form data, but read the exported data first,
  // then do the merge with autoextracted and then set it.

  jotaiStore.set(formDataAtom, newFormData)
  jotaiStore.set(getFieldStateAtom(fieldId), FieldState.ROBOT_VALUE)
  quillExtended.highlightText(rangeIndex, rangeLength, fieldId)
}