import * as styles from "./Form.module.scss"
import { useState } from "react"

import { formRenderers, formCells } from "./formRenderersAndCells"
import { JsonForms } from "@jsonforms/react"
import { FormContext } from "./FormContext"
import { DesigningControls } from "./DesigningControls"

import dataSchema from "./schemas/data-schema.json"
import uiSchema from "./schemas/ui-schema.json"
import { FieldState } from "./FieldState"

export function Form(props) {
  const {
    activeFieldId,
    setActiveFieldId,
    formData,
    setFormData
  } = props

  const [formErrors, setFormErrors] = useState(null)

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
    <div style={{background: "#E7EBF0", padding: 20}}>

      <button onClick={() => {
        setFormData({ ...formData, age: 42 })
        setFieldState("#/properties/age", FieldState.ROBOT_VALUE)
      }}>Robot resolve age</button>
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