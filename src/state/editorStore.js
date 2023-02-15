import { atom } from "jotai"
import { AppMode } from "./editor/AppMode"

/**
 * What operational mode is the application currently in
 */
export const appModeAtom = atom(AppMode.EDIT_TEXT)


////////////////////
// Field Activity //
////////////////////

import * as fieldActivityStore from "./editor/fieldActivityStore"

/**
 * Which field (field ID) in the form is active,
 * null means no field is active
 */
export const activeFieldIdAtom = fieldActivityStore.activeFieldIdAtom;

/**
 * Get atom for a field ID that will be true when that field is active
 */
export const getFieldIsActiveAtom = fieldActivityStore.getFieldIsActiveAtom;
