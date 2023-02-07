import { formRenderers, formCells } from "./formRenderersAndCells"
import { JsonForms } from "@jsonforms/react"
import { DesigningControls } from "./DesigningControls"
import { exportToResqOnline } from "./exportToResqOnline"
import { quillManager } from "../../state/reportStore"
import { formDataAtom, allFieldStatesAtom, formErrorsAtom } from "../../state/formStore"
import { useAtom } from "jotai"

// load the correct form
import dataSchema from "../../../forms/ResQPlus AppDevelopmentForm 1.0 CZ/data-schema.json"
import uiSchema from "../../../forms/ResQPlus AppDevelopmentForm 1.0 CZ/ui-schema.json"
import { displayDebugInfoAtom } from "../../state/userPreferencesStore"

export function Form() {
  const [formErrors, setFormErrors] = useAtom(formErrorsAtom)
  const [formData, setFormData] = useAtom(formDataAtom)
  const [fieldStates] = useAtom(allFieldStatesAtom)
  const [displayDebugInfo] = useAtom(displayDebugInfoAtom)

  return (
    <div>

      <button onClick={() => {
        // let fieldId = "#/properties/anamnesis/properties/age"
        // let d = formData || {}
        // setFormData({ ...d, anamnesis: { ...d.anamnesis, age: 42 } })
        // setFieldState(fieldId, FieldState.ROBOT_VALUE)
        // quillManager.highlightText(72, 9, fieldId)
      }}>Robot resolve age</button>
      <button onClick={() => {
        exportToResqOnline(formData, uiSchema, dataSchema)
      }}>Export to RESQ online form</button>
      <br/>
      <br/>
      
      <JsonForms
        schema={dataSchema}
        uischema={uiSchema}
        data={formData}
        renderers={formRenderers}
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

      {/* <DesigningControls /> */}

    </div>
  )
}