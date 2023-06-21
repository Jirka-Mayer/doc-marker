import { atom } from "jotai"
import { readAtom, writeAtom } from "../utils/JotaiNexus"
import * as formStore from "./formStore"
import * as reportStore from "./reportStore"
import * as editorStore from "./editorStore"

// Inspired by: https://quilljs.com/docs/modules/history/

const MAX_STACK_SIZE = 100
const DELAY_MS = 1000

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

  static takeNow(get, eventName = null) {
    return new HistorySnapshot({
      eventName: eventName,
      formData: get(formStore.formDataAtom),
      reportDelta: get(reportStore.contentAtom),
      reportSelection: reportStore.quillExtended.getSelection(),
      appMode: get(editorStore.appModeAtom),
      activeFieldId: get(editorStore.activeFieldIdAtom)
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

  restore(set) {
    try
    {
      // disable state change handling, because we are about to change state
      isStateChangeHandlingEnabled = false

      // essential state
      set(formStore.formDataAtom, this.formData)
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
        set(editorStore.appModeAtom, this.appMode)
      }
      set(editorStore.activeFieldIdAtom, this.activeFieldId)
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
export const undoAtom = atom(null, (get, set) => {
  if (!get(canUndoAtom)) {
    return
  }

  // read
  let stackPointer = get(stackPointerAtom)
  const stack = get(stackAtom)
  
  // decrement stack pointer
  stackPointer -= 1

  // restore state
  const state = stack[stackPointer]
  state.restore(set)

  // write
  set(stackPointerAtom, stackPointer)

  // console.log("UNDO!", get(stackPointerAtom), get(stackAtom))
})

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
export const redoAtom = atom(null, (get, set) => {
  if (!get(canRedoAtom)) {
    return
  }

  // read
  let stackPointer = get(stackPointerAtom)
  const stack = get(stackAtom)
  
  // increment stack pointer
  stackPointer += 1

  // restore state
  const state = stack[stackPointer]
  state.restore(set)

  // write
  set(stackPointerAtom, stackPointer)

  // console.log("REDO!", get(stackPointerAtom), get(stackAtom))
})

/**
 * Set this atom to clear the history stack
 */
export const clearAtom = atom(null, (get, set) => {
  const now = HistorySnapshot.takeNow(get, "clearHistory")
  
  set(stackAtom, [now])
  set(stackPointerAtom, 0)

  // console.log("CLEAR!", get(stackPointerAtom), get(stackAtom))
})

function handleStateChange({
  eventName
}) {
  if (!isStateChangeHandlingEnabled) {
    return
  }

  // read
  let stackPointer = readAtom(stackPointerAtom)
  let stack = [...readAtom(stackAtom)] // create array copy
  const now = HistorySnapshot.takeNow(readAtom, eventName)
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
  writeAtom(stackPointerAtom, stackPointer)
  writeAtom(stackAtom, stack)

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
