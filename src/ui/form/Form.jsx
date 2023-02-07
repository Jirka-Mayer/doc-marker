import * as styles from "./Form.module.scss"
import { useState } from "react"
import { formRenderers, formCells } from "./formRenderersAndCells"
import { JsonForms } from "@jsonforms/react"
import { FormContext } from "./FormContext"
import { DesigningControls } from "./DesigningControls"
import { FieldState } from "../state/form/FieldState"
import { exportToResqOnline } from "./exportToResqOnline"
import { quillManager } from "../../state/reportStore"
import { formDataAtom } from "../../state/formStore"
import { useAtom } from "jotai"

// load the correct form
import dataSchema from "../../../forms/ResQPlus AppDevelopmentForm 1.0 CZ/data-schema.json"
import uiSchema from "../../../forms/ResQPlus AppDevelopmentForm 1.0 CZ/ui-schema.json"

export function Form(props) {
  const {
    activeFieldId,
    setActiveFieldId,
  } = props

  const [formErrors, setFormErrors] = useState(null)

  const [formData, setFormData] = useAtom(formDataAtom)

  const [fieldStates, setFieldStates] = useState({})
  function getFieldState(fieldId) {
    return fieldStates[fieldId] || FieldState.EMPTY
  }
  function setFieldState(fieldId, state) {
    setFieldStates({
      ...fieldStates,
      [fieldId]: state
    })
  }

  return (
    <div>

      <button onClick={() => {
        let fieldId = "#/properties/anamnesis/properties/age"
        let d = formData || {}
        setFormData({ ...d, anamnesis: { ...d.anamnesis, age: 42 } })
        setFieldState(fieldId, FieldState.ROBOT_VALUE)
        quillManager.highlightText(72, 9, fieldId)
      }}>Robot resolve age</button>
      <button onClick={() => {
        exportToResqOnline(formData, uiSchema, dataSchema)
      }}>Export to RESQ online form</button>
      <br/>
      <br/>
      
      <FormContext.Provider value={{
        activeFieldId, setActiveFieldId,
        getFieldState, setFieldState
      }}>
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
      </FormContext.Provider>

      <pre>Data: { JSON.stringify(formData, null, 2) }</pre>

      <pre>States: { JSON.stringify(fieldStates, null, 2) }</pre>

      <pre>Errors: { JSON.stringify(formErrors, null, 2) }</pre>

      {/* <DesigningControls /> */}

    </div>
  )
}