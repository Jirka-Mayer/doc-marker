import Quill from "quill"
import { styles, allHighlightNumbers } from "../ui/quillStyles"

const Parchment = Quill.import("parchment")

/**
 * Names of highlight formats as registered in Quill
 */
export const allHighlightFormatNames = allHighlightNumbers.map(
  n => "highlight-" + n
)

/**
 * Registers highlight attributors into the static Quill registry
 */
export function defineHighlightAttributors() {
  for (let highlightNumber in allHighlightNumbers) {
    defineAttributor(highlightNumber)
  }
}

function defineAttributor(highlightNumber) {
  const formatName = "highlight-" + highlightNumber
  const cssClass = styles[`highlight-${highlightNumber}-yes`]
    .slice(0, -("-yes".length))

  let attributor = new Parchment.Attributor.Class(
    formatName,
    cssClass,
    {
      scope: Parchment.Scope.INLINE,
      whitelist: ["yes"] // allow only "yes" as the value
    }
  )

  Quill.register(attributor, true)
}