import { atom } from "jotai"

/*
 * Having one "activeFieldId" atom breaks down if every form field is watching
 * this atom for chages. It then causes the entire form to re-render with every
 * change, despite only up to two fields needing to re-render.
 * 
 * So instead we have a two-way bound solution where the "activeFieldId" atom
 * behaves as expected and also a dictionary of per-field yes/no atoms that
 * are watched by corresponding fields.
 */

function guardNullFieldId(fieldId) {
  if (fieldId === null) {
    throw new Error("Field ID cannot be null")
  }
}


///////////////////
// ActiveFieldId //
///////////////////

/**
 * The base atom storing the active field, the only ground-truth value
 * in this whole system. Everything else is a cached copy.
 */
const activeFieldIdBaseAtom = atom(null)

/**
 * The public atom that appears to be the one variable storing the active field ID
 */
export const activeFieldIdAtom = atom(
  get => get(activeFieldIdBaseAtom),
  (get, set, newValue) => {
    const oldValue = get(activeFieldIdBaseAtom)

    // set the old value field activity to false, unless it was null
    if (oldValue !== null) {
      set(getFieldIsActiveBaseAtom(oldValue), false)
    }

    // set the base atom
    set(activeFieldIdBaseAtom, newValue)

    // set the new field activity atom to true, unless it's null
    if (newValue !== null) {
      set(getFieldIsActiveBaseAtom(newValue), true)
    }
  }
)


////////////////////////////////
// FieldIsActive (base atoms) //
////////////////////////////////

/**
 * Simple boolean atoms, one for each field ID, storing the information,
 * whether the given field is active. The non-base variants of these atoms
 * need to depend on these, rather then the activeFieldIdBaseAtom to prevent
 * refresh cascade to all of the fields, but only to the two affected.
 */
const fieldIsActiveBaseAtoms = {}

function createFieldIsActiveBaseAtom(fieldId) {
  guardNullFieldId(fieldId)

  fieldIsActiveBaseAtoms[fieldId] = atom(false)
}

function getFieldIsActiveBaseAtom(fieldId) {
  guardNullFieldId(fieldId)

  if (!fieldIsActiveBaseAtoms.hasOwnProperty(fieldId))
    createFieldIsActiveBaseAtom(fieldId)
  
  return fieldIsActiveBaseAtoms[fieldId]
}


//////////////////////////////////
// FieldIsActive (public atoms) //
//////////////////////////////////

/**
 * Public variants of the base atoms for each field above
 */
const fieldIsActiveAtoms = {}

function createFieldIsActiveAtom(fieldId) {
  guardNullFieldId(fieldId)

  fieldIsActiveAtoms[fieldId] = atom(
    get => get(getFieldIsActiveBaseAtom(fieldId)),
    (get, set, newValue) => {
      const activeFieldId = get(activeFieldIdBaseAtom)

      // we want to become active and are not currently
      if (newValue === true && activeFieldId !== fieldId) {
        set(activeFieldIdAtom, fieldId)
      }
      
      // we want to deactivate ourselves and we are active
      if (newValue === false && activeFieldId === fieldId) {
        set(activeFieldIdAtom, null)
      }

      // Anything else is activating ourselves when we already are
      // or deactivating ourselves, when we already are.
      // In either case do nothing.
    }
  )
}

/**
 * Returns the boolean atom representing whether the given field is active or not
 * @param {string?} fieldId 
 */
export function getFieldIsActiveAtom(fieldId) {
  guardNullFieldId(fieldId)

  if (!fieldIsActiveAtoms.hasOwnProperty(fieldId))
    createFieldIsActiveAtom(fieldId)

  return fieldIsActiveAtoms[fieldId]
}
