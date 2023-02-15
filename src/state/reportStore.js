import { QuillExtended } from "../quill/QuillExtended"
import { contentsToHighlights } from "../quill/highlights/contentsToHighlights"
import { atom } from "jotai"
import { readAtom, writeAtom } from "../utils/JotaiNexus"


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

quillExtended.on("text-change", (delta, oldContents, source) => {
  const contents = quillExtended.getContents()
  let highlights = contentsToHighlights(contents)
  
  writeAtom(contentBaseAtom, contents)
  writeAtom(highlightsAtom, highlights)
})
