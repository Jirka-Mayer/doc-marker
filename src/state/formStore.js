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


//////////////////
// Field States //
//////////////////

import * as fieldStatesStore from "./form/fieldStatesStore"

export const getFieldStateAtom = fieldStatesStore.getFieldStateAtom;
export const allFieldStatesAtom = fieldStatesStore.allFieldStatesAtom;
