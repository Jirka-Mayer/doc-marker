import Quill from "quill"
import { styles, allAnonymizationKindIds } from "../ui/quillStyles"

const Parchment = Quill.import("parchment")

/**
 * Registers anonymization attributor into the static Quill registry
 */
export function defineAnonymizationAttributor() {
  const formatName = "anonymized"
  const cssClass = styles["anonymization--other"]
    .slice(0, -("-other".length))

  let attributor = new Parchment.Attributor.Class(
    formatName,
    cssClass,
    {
      scope: Parchment.Scope.INLINE,
      whitelist: allAnonymizationKindIds
    }
  )

  Quill.register(attributor, true)
}