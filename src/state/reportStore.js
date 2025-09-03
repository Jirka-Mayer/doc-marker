import { QuillExtended } from "../quill/QuillExtended"
import { contentsToHighlights } from "../quill/highlights/contentsToHighlights"
import { atom, getDefaultStore } from "jotai"
import { EventEmitter } from "../utils/EventEmitter"
import _ from "lodash"

// lets us manipulate atoms from the non-jotai/react code
const jotaiStore = getDefaultStore()

/**
 * Emits events related to the report store
 */
export const eventEmitter = new EventEmitter()


///////////////
// Selection //
///////////////

const selectionRangeBaseAtom = atom(null)
export const selectionRangeAtom = atom(get => get(selectionRangeBaseAtom))

const selectionFormatsBaseAtom = atom({})
export const selectionFormatsAtom = atom(get => get(selectionFormatsBaseAtom))


/////////////
// Content //
/////////////

const contentBaseAtom = atom({ ops: [] })
const textBaseAtom = atom("")

export const contentAtom = atom(get => get(contentBaseAtom))
export const textAtom = atom(get => get(textBaseAtom))


//////////////
// Language //
//////////////

const reportLanguageBaseAtom = atom(null); // nullable string

// nullable string
export const reportLanguageAtom = atom(
  (get) => get(reportLanguageBaseAtom),
  (get, set, newValue) => {
    set(reportLanguageBaseAtom, newValue);

    eventEmitter.emit("reportLanguageChanged", {
      newValue: newValue
    });
  }
);


////////////////
// Highlights //
////////////////

import * as highlightsStore from "./report/highlightsStore"

export const highlightsAtom = highlightsStore.highlightsAtom
export const getFieldHighlightsAtom = highlightsStore.getFieldHighlightsAtom


////////////////////
// Quill Extended //
////////////////////

export const quillExtended = new QuillExtended()

function handleTextChange() {
  const contents = quillExtended.getContents()
  const text = quillExtended.getText()
  let highlights = contentsToHighlights(contents)
  
  jotaiStore.set(contentBaseAtom, contents)
  if (jotaiStore.get(textBaseAtom) !== text) {
    jotaiStore.set(textBaseAtom, text)
  }
  jotaiStore.set(highlightsAtom, highlights)

  eventEmitter.emit("reportDeltaChanged", {})
}

const handleTextChangeDebounced = _.debounce(handleTextChange, 300)

quillExtended.on("text-change", (delta, oldContents, source) => {
  // selection and formats are always updated immediately
  jotaiStore.set(selectionRangeBaseAtom, quillExtended.getSelection())
  jotaiStore.set(selectionFormatsBaseAtom, quillExtended.getFormat())

  // debounce user changes
  if (source === "user") {
    handleTextChangeDebounced()
    return
  }

  // but apply api changes immediately
  handleTextChangeDebounced.cancel()
  handleTextChange()
})

quillExtended.on("selection-change", (range, oldRange, source) => {
  // selection and formats are always updated immediately
  jotaiStore.set(selectionRangeBaseAtom, range)
  jotaiStore.set(selectionFormatsBaseAtom, quillExtended.getFormat())
})

// emitted when formats change without selection or text change
// (clicking a format button with the caret inside text)
quillExtended.on("format-change", (formats) => {
  jotaiStore.set(selectionFormatsBaseAtom, formats)
})
