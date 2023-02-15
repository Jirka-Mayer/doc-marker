import { atom } from "jotai"
import { assignIfNeeded } from "../../utils/assignIfNeeded"


///////////////////////////////////
// Global highlights object atom //
///////////////////////////////////

const highlightsBaseAtom = atom({})

/**
 * Read-only view of all the defined highlights
 * Structure: { [fieldId]: [range1, range2] }
 */
export const highlightsAtom = atom(
  get => get(highlightsBaseAtom),
  (get, set, newValue) => {
    const oldValue = get(highlightsBaseAtom)
    const improvedNewValue = assignIfNeeded(oldValue, newValue)

    // set the global view
    set(highlightsBaseAtom, improvedNewValue)

    // set individual field values (if they were modified)
    for (const key of Object.keys(improvedNewValue)) {
      if (improvedNewValue[key] !== oldValue[key]) {
        set(getFieldHighlightsBackingAtom(key), improvedNewValue[key])
      }
    }

    // forget removed field highlights
    for (const key of Object.keys(oldValue)) {
      if (!improvedNewValue.hasOwnProperty(key)) { // is a removed value
        const fieldAtom = getFieldHighlightsBackingAtom(key)
        if (get(fieldAtom).length !== 0) { // if the ranges are not empty yet
          set(fieldAtom, []) // forget ranges
        }
      }
    }
  }
)


///////////////////////////////////////
// Per-field highlights object atoms //
///////////////////////////////////////

// === Backing atoms ===

const fieldHighlightBackingAtoms = {}

function createfieldHighlightBackingAtom(fieldId) {
  fieldHighlightBackingAtoms[fieldId] = atom([])
}

function getFieldHighlightsBackingAtom(fieldId) {
  if (!fieldHighlightBackingAtoms.hasOwnProperty(fieldId))
    createfieldHighlightBackingAtom(fieldId)

  return fieldHighlightBackingAtoms[fieldId]
}

// === Public facing atoms ===

const fieldHighlightAtoms = {}

function createfieldHighlightAtom(fieldId) {
  fieldHighlightAtoms[fieldId] = atom(
    get => get(getFieldHighlightsBackingAtom(fieldId))
    // read-only atom
  )
}

/**
 * Returns an atom containing the list of highlight ranges for the field
 * @param {string?} fieldId
 */
 export function getFieldHighlightsAtom(fieldId) {
  if (!fieldHighlightAtoms.hasOwnProperty(fieldId))
    createfieldHighlightAtom(fieldId)

  return fieldHighlightAtoms[fieldId]
}

