import { atom } from "jotai"
import { EventEmitter } from "../utils/EventEmitter"

/**
 * Emits events related to the form store
 */
export const eventEmitter = new EventEmitter()

/**
 * Contains the ID of the currently used form
 */
export const formIdAtom = atom(null)

/**
 * Contains the set of errors in the form data
 */
export const formErrorsAtom = atom(null)

/**
 * Set this atom to force a form reload
 */
 export const formReloadTriggerAtom = atom(
  (get) => get(formReloadTriggerAtomBase),
  (get, set, _) => {
    let value = get(formReloadTriggerAtomBase)
    value = (value + 1) % 100
    set(formReloadTriggerAtomBase, value)
  }
)
const formReloadTriggerAtomBase = atom(0)


///////////////
// Form Data //
///////////////

import * as formDataStore from "./form/formDataStore"

// bind events to the emitter
for (let eventName in formDataStore.eventHandlers) {
  formDataStore.eventHandlers[eventName] = (...args) => {
    eventEmitter.emit(eventName, ...args)
  }
}

export const formDataAtom = formDataStore.formDataAtom;
export const formDataRenderingAtom = formDataStore.formDataRenderingAtom;
export const getExportedFormData = formDataStore.getExportedFormData;
export const useExportValue = formDataStore.useExportValue;
export const useGetExportedValue = formDataStore.useGetExportedValue;
export const initiateExportRefresh = formDataStore.initiateExportRefresh;
