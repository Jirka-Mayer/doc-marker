import Quill from "quill"
import { styles, allFieldNumbers } from "./quillStyles"

const Parchment = Quill.import("parchment")

export function defineHighlightAttributors() {
  for (let fieldNumber in allFieldNumbers) {
    let attributor = new Parchment.Attributor.Class(
      "highlight-" + fieldNumber,
      styles[`highlight-${fieldNumber}-yes`].slice(0, -4), // -4 for the "-yes" suffix
      {
        scope: Parchment.Scope.INLINE,
        whitelist: ["yes"] // allow only "yes" as the value
      }
    )
    Quill.register(attributor, true)
  }
}