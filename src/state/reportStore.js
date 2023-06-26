import { QuillExtended } from "../quill/QuillExtended"
import { contentsToHighlights } from "../quill/highlights/contentsToHighlights"
import { atom } from "jotai"
import { readAtom, writeAtom } from "../utils/JotaiNexus"
import { EventEmitter } from "../utils/EventEmitter"
import _ from "lodash"

/**
 * Emits events related to the report store
 */
export const eventEmitter = new EventEmitter()


/////////////
// Content //
/////////////

const contentBaseAtom = atom({ ops: [] })

export const contentAtom = atom(get => get(contentBaseAtom))


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

function handleTextChange(delta, oldContents, source) {
  const contents = quillExtended.getContents()
  let highlights = contentsToHighlights(contents)
  
  writeAtom(contentBaseAtom, contents)
  writeAtom(highlightsAtom, highlights)

  eventEmitter.emit("reportDeltaChanged", {
    newReportDelta: contents,
    oldReportDelta: oldContents,
    changeDelta: delta,
    source: source
  })
}

const handleTextChangeDebounced = _.debounce(handleTextChange, 300)

quillExtended.on("text-change", (delta, oldContents, source) => {
  // debounce user changes
  if (source === "user") {
    handleTextChangeDebounced(delta, oldContents, source)
    return
  }

  // but apply api changes immediately
  handleTextChangeDebounced.cancel()
  handleTextChange(delta, oldContents, source)
})
