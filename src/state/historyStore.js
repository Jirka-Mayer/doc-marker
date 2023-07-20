import { atom, getDefaultStore } from "jotai"
import * as formStore from "./formStore"
import * as reportStore from "./reportStore"
import * as editorStore from "./editorStore"

// Inspired by: https://quilljs.com/docs/modules/history/

const MAX_STACK_SIZE = 100
const DELAY_MS = 1000

// lets us manipulate atoms from the non-jotai/react code
const jotaiStore = getDefaultStore()

// disables state change listening when undo/redo triggers state changes
let isStateChangeHandlingEnabled = true

class HistorySnapshot {
  constructor({
    eventName,
    formData,
    reportDelta,
    reportSelection,
    appMode,
    activeFieldId
  }) {
    // essential state
    this.formData = formData
    this.reportDelta = reportDelta

    // surrounding state
    this.reportSelection = reportSelection
    this.appMode = appMode
    this.activeFieldId = activeFieldId

    // metadata
    this.eventName = eventName
    this.takenAt = new Date()
  }

  static takeNow(eventName = null) {
    return new HistorySnapshot({
      eventName: eventName,
      formData: jotaiStore.get(formStore.formDataAtom),
      reportDelta: jotaiStore.get(reportStore.contentAtom),
      reportSelection: reportStore.quillExtended.getSelection(),
      appMode: jotaiStore.get(editorStore.appModeAtom),
      activeFieldId: jotaiStore.get(editorStore.activeFieldIdAtom)
    })
  }

  static empty() {
    return new HistorySnapshot({
      eventName: null,
      formData: null,
      reportDelta: { ops:[] },
      reportSelection: null,
      appMode: null,
      activeFieldId: null
    })
  }

  restore() {
    try
    {
      // disable state change handling, because we are about to change state
      isStateChangeHandlingEnabled = false

      // essential state
      jotaiStore.set(formStore.formDataAtom, this.formData)
      reportStore.quillExtended.setContents(this.reportDelta, "api")

      // surrounding state
      if (this.reportSelection) {
        reportStore.quillExtended.setSelection(
          this.reportSelection.index,
          this.reportSelection.length,
          "api"
        )
      }
      if (this.appMode) {
        jotaiStore.set(editorStore.appModeAtom, this.appMode)
      }
      jotaiStore.set(editorStore.activeFieldIdAtom, this.activeFieldId)
    } finally {
      // enable state change handling again
      isStateChangeHandlingEnabled = true
    }
  }
}

/**
 * Base atom that holds the history stack
 */
const stackAtom = atom([
  HistorySnapshot.empty()
])

/**
 * Where in the stack we currently are?
 * (when outside the bounds, we are at the end)
 */
const stackPointerAtom = atom(0)

/**
 * True if the undo operation can be performed
 */
export const canUndoAtom = atom((get) => {
  const stackPointer = get(stackPointerAtom)
  const stack = get(stackAtom)
  return stackPointer > 0 && stack.length > 0 && stackPointer < stack.length
})

/**
 * Set this atom to execute the "undo" operation
 */
export function performUndo() {
  if (!jotaiStore.get(canUndoAtom)) {
    return
  }

  // read
  let stackPointer = jotaiStore.get(stackPointerAtom)
  const stack = jotaiStore.get(stackAtom)
  
  // decrement stack pointer
  stackPointer -= 1

  // restore state
  const state = stack[stackPointer]
  state.restore()

  // write
  jotaiStore.set(stackPointerAtom, stackPointer)

  // console.log("UNDO!", jotaiStore.get(stackPointerAtom), jotaiStore.get(stackAtom))
}

/**
 * True if the redo operation can be performed
 */
 export const canRedoAtom = atom((get) => {
  const stackPointer = get(stackPointerAtom)
  const stack = get(stackAtom)
  return stackPointer < stack.length - 1
})

/**
 * Set this atom to execute the "redo" operation
 */
export function performRedo() {
  if (!jotaiStore.get(canRedoAtom)) {
    return
  }

  // read
  let stackPointer = jotaiStore.get(stackPointerAtom)
  const stack = jotaiStore.get(stackAtom)
  
  // increment stack pointer
  stackPointer += 1

  // restore state
  const state = stack[stackPointer]
  state.restore()

  // write
  jotaiStore.set(stackPointerAtom, stackPointer)

  // console.log("REDO!", jotaiStore.get(stackPointerAtom), jotaiStore.get(stackAtom))
}

/**
 * Set this atom to clear the history stack
 */
export const clearAtom = atom(null, (get, set) => {
  const now = HistorySnapshot.takeNow("clearHistory")
  
  jotaiStore.set(stackAtom, [now])
  jotaiStore.set(stackPointerAtom, 0)

  // console.log("CLEAR!", jotaiStore.get(stackPointerAtom), jotaiStore.get(stackAtom))
})

function handleStateChange({
  eventName
}) {
  if (!isStateChangeHandlingEnabled) {
    return
  }

  // read
  let stackPointer = jotaiStore.get(stackPointerAtom)
  let stack = [...jotaiStore.get(stackAtom)] // create array copy
  const now = HistorySnapshot.takeNow(eventName)
  const lastItem = stack[stackPointer] || now

  // clear stack after the pointer
  while (stack.length > stackPointer + 1) {
    stack.pop()
  }

  // replace last if early enough
  const sameEventName = lastItem.eventName === eventName
  const recentEnoughForReplacement = now.takenAt - lastItem.takenAt < DELAY_MS
  const performReplacement = sameEventName && recentEnoughForReplacement
  if (performReplacement)
  {
    if (stack.length > 0) {
      stack[stack.length - 1] = now
    } else {
      stack.push(now) // malformed edgecase when the stack is empty
    }
  }
  else // else append new history item
  {
    // add item to stack
    stack.push(now)
    
    // limit stack size
    while (stack.length > MAX_STACK_SIZE) {
      stack.shift()
    }
  }
  
  // update stack pointer
  stackPointer = stack.length - 1

  // write
  jotaiStore.set(stackPointerAtom, stackPointer)
  jotaiStore.set(stackAtom, stack)

  // DEBUG LOG
  // if (performReplacement)
  //   console.log("REPLACE", stackPointer, stack)
  // else
  //   console.log("APPEND", stackPointer, stack)
}

// === handle change events ===

formStore.eventEmitter.on("formDataChanged", (e) => {
  handleStateChange({ eventName: "formDataChanged" })
})

reportStore.eventEmitter.on("reportDeltaChanged", (e) => {
  handleStateChange({ eventName: "reportDeltaChanged" })
})

editorStore.eventEmitter.on("appModeChanged", (e) => {
  // TODO: this is only a cosmetic change, this does not mark the file as modified
  handleStateChange({ eventName: "appModeChanged" })
})
