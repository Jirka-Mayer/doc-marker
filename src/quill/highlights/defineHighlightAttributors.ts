import Quill from "quill";
import { styles, allHighlightNumbers } from "../ui/quillStyles";

// Quill's internal import infrastructure
const Parchment = Quill.import("parchment");

/**
 * Names of highlight formats as registered in Quill
 */
export const allHighlightFormatNames = allHighlightNumbers.map(
  (n) => "highlight-" + n.toString(),
);

/**
 * Registers highlight attributors into the static Quill registry.
 * Call this once when the application loads before any Quill
 * instance gets created.
 */
export function defineHighlightAttributors() {
  for (let highlightNumber of allHighlightNumbers) {
    defineAttributor(highlightNumber);
  }
}

function defineAttributor(highlightNumber: number): void {
  const formatName = "highlight-" + highlightNumber.toString();

  // the "highlight-" CSS class name prefix,
  // but extracted in this weird way to also include
  // the random hash prefix added by SCSS compilation
  const cssClass = styles[`highlight-${highlightNumber}-yes`].slice(
    0,
    -"-yes".length,
  );

  // create the attributor
  let attributor = new Parchment.Attributor.Class(formatName, cssClass, {
    scope: Parchment.Scope.INLINE,
    whitelist: ["yes"], // allow only "yes" as the value
  });

  // register the attributor
  Quill.register(attributor, true);
}
