import { atom } from "jotai"
import _ from "lodash"

/**
 * The form data used by JSON Forms
 * (use (set) this when deserializing the form)
 */
export const formDataAtom = atom(null)

/**
 * Contains all the exported data
 * (this is the backing variable)
 */
const exportedValues = {}

/**
 * Returns the form data that the form actually publicly exports
 * (use (call) this when serializing the form)
 */
 export function getExportedFormData() {
  const out = {}
  for (const path in exportedValues) {
    _.set(out, path, exportedValues[path])
  }
  return out
}

/**
 * Call this during component render to keep the exported form data updated
 * @param {*} path What data is being exported
 * @param {*} value The exported value
 */
export function exportValue(path, value) {
  // console.log("EXPORT", path, value)
  exportedValues[path] = value
}

/**
 * Returns the latest exported value for a given path
 */
export function getExportedValue(path) {
  return exportedValues[path]
}

/**
 * Call this during deserialization or form change to get rid of old,
 * unused exported values
 */
export function clearExportedFormData() {
  for (const key in exportedValues) {
    exportedValues[key] = undefined
  }
}