import { atom } from "jotai"
import { AppMode } from "./editor/AppMode"

/**
 * What operational mode is the application currently in
 */
export const appModeAtom = atom(AppMode.EDIT_TEXT)

/**
 * Which field (field ID) in the form is active,
 * null means no field is active
 */
export const activeFieldIdAtom = atom(null)
