import { atom } from "jotai"
import { FieldState } from "./FieldState"

/**
 * Modify this atom value whenever any field state changes
 */
const globalNotifierAtom = atom(0)

/**
 * Dictionary of the already created field state atoms
 */
const fieldStateAtoms = {}

function createFieldStateAtom(fieldId) {
  const baseAtom = atom(FieldState.EMPTY)
  
  const publicAtom = atom(
    (get) =>  get(baseAtom),
    (get, set, newValue) => {
      set(baseAtom, newValue)
      set(globalNotifierAtom, (get(globalNotifierAtom) + 1) % 10) // notify
    }
  )

  fieldStateAtoms[fieldId] = publicAtom
}

/**
 * Returns a read-write atom holding the field state value for the given form field
 */
export function getFieldStateAtom(fieldId) {
  if (!fieldStateAtoms.hasOwnProperty(fieldId))
    createFieldStateAtom(fieldId)
  
  return fieldStateAtoms[fieldId]
}

/**
 * Read-only atom containing the entire dictionary of field states
 */
export const allFieldStatesAtom = atom((get) => {
  get(globalNotifierAtom) // subscribe to notifications

  // build the dictionary of values
  return Object.keys(fieldStateAtoms).reduce((result, key) => {
    result[key] = get(fieldStateAtoms[key])
    return result
  }, {})
})
