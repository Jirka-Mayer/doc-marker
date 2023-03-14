import { atom } from "jotai"

/**
 * Contains the filled-out data of the form,
 * null means the form is completely empty and has not been even touched yet,
 * otherwise an empty form is represented by an empty json object
 */
export const formDataAtom = atom(null)

/**
 * Contains the set of errors in the form data
 */
export const formErrorsAtom = atom(null)

/**
 * Contains the ID of the currently used form
 */
export const formIdAtom = atom(null)


//////////////////
// Field States //
//////////////////

import * as fieldStatesStore from "./form/fieldStatesStore"

export const getFieldStateAtom = fieldStatesStore.getFieldStateAtom;
export const allFieldStatesAtom = fieldStatesStore.allFieldStatesAtom;
