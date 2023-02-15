import { QuillExtended } from "../quill/QuillExtended"
import { contentsToHighlights } from "../quill/highlights/contentsToHighlights"
import { atom } from "jotai"
import { readAtom, writeAtom } from "../utils/JotaiNexus"
import { assignIfNeeded } from "../utils/assignIfNeeded"


// === private backing-field (base) atoms ===

const contentBaseAtom = atom({})
const highlightsBaseAtom = atom({ ops: [] })


// === public read-only atoms ===

export const contentAtom = atom(get => get(contentBaseAtom))
export const highlightsAtom = atom(get => get(highlightsBaseAtom))


// === public action atoms ===

// none so far


// === quill ===

export const quillExtended = new QuillExtended()

quillExtended.on("text-change", (delta, oldContents, source) => {
  const contents = quillExtended.getContents()
  let highlights = contentsToHighlights(contents)
  
  writeAtom(contentBaseAtom, contents)

  writeAtom(
    highlightsBaseAtom,
    assignIfNeeded(readAtom(highlightsBaseAtom), highlights)
  )
})
