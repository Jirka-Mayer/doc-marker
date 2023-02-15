import { formRenderers, formCells } from "./formRenderersAndCells"
import { JsonForms } from "@jsonforms/react"
import { DesigningControls } from "./DesigningControls"
import { formDataAtom, allFieldStatesAtom, formErrorsAtom } from "../../state/formStore"
import { useAtom } from "jotai"
import { displayDebugInfoAtom } from "../../state/userPreferencesStore"

// load the correct form
// import dataSchema from "../../../forms/ResQPlus AppDevelopmentForm 1.0 CZ/data-schema.json"
// import uiSchema from "../../../forms/ResQPlus AppDevelopmentForm 1.0 CZ/ui-schema.json"

// debug stuff
import dataSchema from "../../../forms/simple-dump/data-schema.json"
import uiSchema from "../../../forms/simple-dump/ui-schema.json"
// import { materialRenderers } from "@jsonforms/material-renderers"

export function Form() {
  const [formErrors, setFormErrors] = useAtom(formErrorsAtom)
  const [formData, setFormData] = useAtom(formDataAtom)
  const [fieldStates] = useAtom(allFieldStatesAtom)
  const [displayDebugInfo] = useAtom(displayDebugInfoAtom)

  return (
    <div>
      <JsonForms
        schema={dataSchema}
        uischema={uiSchema}
        data={formData}
        renderers={formRenderers}
        // renderers={materialRenderers}
        cells={formCells}
        onChange={({ data, errors }) => {
          setFormData(data)
          setFormErrors(errors)
        }}
      />

      { displayDebugInfo ? <>
        <pre>Data: { JSON.stringify(formData, null, 2) }</pre>
        <pre>States: { JSON.stringify(fieldStates, null, 2) }</pre>
        <pre>Errors: { JSON.stringify(formErrors, null, 2) }</pre>
      </> : null}

      <DesigningControls />

    </div>
  )
}