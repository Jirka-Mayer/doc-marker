import { buildJavascriptCode } from "./export/buildJavascriptCode";

// import dataSchema from "../../../forms/ResQPlus AppDevelopmentForm 1.0 CZ/data-schema.json"
// import uiSchema from "../../../forms/ResQPlus AppDevelopmentForm 1.0 CZ/ui-schema.json"
import { readAtom } from "../../utils/JotaiNexus";
import { formDataAtom } from "../formStore";

// import exportMap from "../../../forms/ResQPlus Alpha 1.0/export-map-cz"

/**
 * Builds the necessary javascript code and puts it into the clipboard
 */
export function exportToResqRegistry() {
  const formData = readAtom(formDataAtom)

  // TODO: this is temporary, load it based on the form open!

  // const jsCode = exportMap
  // const jsCode = buildJavascriptCode(formData, uiSchema, dataSchema)
  const jsCode = `alert("Test!")`;

  console.log(jsCode)
  navigator.clipboard.writeText(jsCode)
}