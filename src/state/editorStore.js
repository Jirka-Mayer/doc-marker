import { atom } from "jotai"
import { AppMode } from "./editor/AppMode"
import { EventEmitter } from "../utils/EventEmitter"

/**
 * Emits events related to the editor store
 */
export const eventEmitter = new EventEmitter()


//////////////////////
// Application mode //
//////////////////////

const appModeBaseAtom = atom(AppMode.EDIT_TEXT)

/**
 * What operational mode is the application currently in
 */
export const appModeAtom = atom(
  (get) => get(appModeBaseAtom),
  (get, set, value) => {
    // allow only valid values
    if (value === AppMode.EDIT_TEXT
      || value === AppMode.ANONYMIZE
      || value === AppMode.ANNOTATE_HIGHLIGHTS)
    {
      const oldMode = get(appModeBaseAtom)
      set(appModeBaseAtom, value)

      eventEmitter.emit("appModeChanged", {
        oldMode: oldMode,
        newMode: value
      })
    }
  }
)


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
