import { atom, getDefaultStore } from "jotai"
import * as historyStore from "./historyStore"
import * as fileStore from "./fileStore"

const AUTOSAVE_DEBOUNCE_DELAY_MS = 5000

// lets us manipulate atoms from the non-jotai/react code
const jotaiStore = getDefaultStore()

const isDirtyBaseAtom = atom(false)

/**
 * If the file is dirty, it should be saved on closing
 * and also autosave is enabled
 */
export const isDirtyAtom = atom((get) => get(isDirtyBaseAtom))

/**
 * Call this to set the file dirty and ultimately trigger a save
 */
export function setDirty() {
  jotaiStore.set(isDirtyBaseAtom, true)
  scheduleAutosave()
}


// === autosave logic ===

let autosaveTimeoutId = null

function scheduleAutosave() {
  cancelScheduledAutosave()
  autosaveTimeoutId = setTimeout(
    onAutosaveTrigger,
    AUTOSAVE_DEBOUNCE_DELAY_MS
  )
}

function cancelScheduledAutosave() {
  if (autosaveTimeoutId === null) {
    return
  }

  clearTimeout(autosaveTimeoutId)
  autosaveTimeoutId = null
}

function onAutosaveTrigger() {
  autosaveTimeoutId = null
  fileStore.saveCurrentFile()
}


// === event handlers ===

historyStore.eventEmitter.on("clear", (e) => {
  jotaiStore.set(isDirtyBaseAtom, false)
  cancelScheduledAutosave()
})

historyStore.eventEmitter.on("change", (e) => {
  // ignore cosmetic changes
  if (e.cosmeticChange) {
    return
  }

  setDirty()
})

fileStore.eventEmitter.on("beforeFileClose", (e) => {
  if (jotaiStore.get(isDirtyAtom)) {
    fileStore.saveCurrentFile()
  }

  cancelScheduledAutosave()
})

fileStore.eventEmitter.on("fileSaved", (e) => {
  jotaiStore.set(isDirtyBaseAtom, false)
  cancelScheduledAutosave()
})
