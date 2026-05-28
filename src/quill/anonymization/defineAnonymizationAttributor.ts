import Quill from "quill";
import { styles, allAnonymizationKindIds } from "../ui/quillStyles";

// Quill's internal import infrastructure
const Parchment = Quill.import("parchment");

/**
 * Registers anonymization attributor into the
 * static Quill registry. Call this once when
 * the application loads before any Quill
 * instance gets created.
 */
export function defineAnonymizationAttributor() {
  const formatName = "anonymized";

  // the "anonymization-" CSS class name prefix,
  // but extracted in this weird way to also include
  // the random hash prefix added by SCSS compilation
  const cssClass = styles["anonymization--other"].slice(0, -"-other".length);

  // create the attributor
  let attributor = new Parchment.Attributor.Class(formatName, cssClass, {
    scope: Parchment.Scope.INLINE,
    whitelist: allAnonymizationKindIds,
  });

  // register the attributor
  Quill.register(attributor, true);
}
