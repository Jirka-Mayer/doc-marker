import { QuillManager } from "./report/QuillManager"
import { contentsToHighlights } from "../quill/highlights/contentsToHighlights"
import { atom } from "jotai"
import { readAtom, writeAtom } from "../utils/JotaiNexus"


// === private backing-field (base) atoms ===

const contentBaseAtom = atom({})
const highlightsBaseAtom = atom({ ops: [] })


// === public read-only atoms ===

export const contentAtom = atom(get => get(contentBaseAtom))
export const highlightsAtom = atom(get => get(highlightsBaseAtom))


// === public action atoms ===

// none so far


// === quill ===

function onTextChange(delta) {
  let contents = quillManager.getContents()
  let highlights = contentsToHighlights(contents)
  
  writeAtom(contentBaseAtom, contents)
  writeAtom(highlightsBaseAtom, highlights)
}

export const quillManager = new QuillManager(onTextChange)

// TODO: quillExtended.on("text-change") ...
