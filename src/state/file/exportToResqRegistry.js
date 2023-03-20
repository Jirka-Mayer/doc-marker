import { buildJavascriptCode } from "./export/buildJavascriptCode";

import dataSchema from "../../../forms/ResQPlus AppDevelopmentForm 1.0 CZ/data-schema.json"
import uiSchema from "../../../forms/ResQPlus AppDevelopmentForm 1.0 CZ/ui-schema.json"
import { readAtom } from "../../utils/JotaiNexus";
import { formDataAtom } from "../formStore";

/**
 * Builds the necessary javascript code and puts it into the clipboard
 */
export function exportToResqRegistry() {
  const formData = readAtom(formDataAtom)

  const jsCode = buildJavascriptCode(formData, uiSchema, dataSchema)

  console.log(jsCode)
  navigator.clipboard.writeText(jsCode)
}