import { formRenderers, formCells } from "./formRenderersAndCells"
import { JsonForms } from "@jsonforms/react"
import { DesigningControls } from "./DesigningControls"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { FormDefinition } from "../../../forms/FormDefinition"
import * as formStore from "../../state/formStore"
import * as userPreferencesStore from "../../state/userPreferencesStore"

export function Form() {
  const [formId] = useAtom(formStore.formIdAtom)
  const [dataSchema, setDataSchema] = useState({})
  const [uiSchema, setUiSchema] = useState({})

  const [formErrors, setFormErrors] = useAtom(formStore.formErrorsAtom)
  const [formData, setFormData] = useAtom(formStore.formDataAtom)
  const [fieldStates] = useAtom(formStore.allFieldStatesAtom)
  const [displayDebugInfo] = useAtom(userPreferencesStore.displayDebugInfoAtom)

  useEffect(() => {
    if (formId === null) {
      setDataSchema({})
      setUiSchema({})
      return
    }
    FormDefinition.load(formId).then(form => {
      setDataSchema(form.dataSchema)
      setUiSchema(form.uiSchema)
    })
  }, [formId])

  return (
    <div>
      { formId === null ? null : (
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
      )}

      { displayDebugInfo ? <>
        <pre>FormID: { JSON.stringify(formId, null, 2) }</pre>
        <pre>Data: { JSON.stringify(formData, null, 2) }</pre>
        <pre>States: { JSON.stringify(fieldStates, null, 2) }</pre>
        <pre>Errors: { JSON.stringify(formErrors, null, 2) }</pre>
      </> : null}

      <DesigningControls />

    </div>
  )
}