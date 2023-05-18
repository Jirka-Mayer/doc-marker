import { atom } from "jotai"

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

export const formDataAtom = formDataStore.formDataAtom;
export const getExportedFormData = formDataStore.getExportedFormData;
export const exportValue = formDataStore.exportValue;
export const getExportedValue = formDataStore.getExportedValue;
export const clearExportedFormData = formDataStore.clearExportedFormData;


//////////////////
// Field States //
//////////////////

import * as fieldStatesStore from "./form/fieldStatesStore"

export const getFieldStateAtom = fieldStatesStore.getFieldStateAtom;
export const allFieldStatesAtom = fieldStatesStore.allFieldStatesAtom;
