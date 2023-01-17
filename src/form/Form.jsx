import * as styles from "./Form.module.scss"
import { useState } from "react"

import { formRenderers, formCells } from "./formRenderersAndCells"
import { JsonForms } from "@jsonforms/react"
import { FormContext } from "./FormContext"

const schema = {
  "type": "object",
  "properties": {
    "age": {
      "type": "string", // DEBUG, should be integer
      // "type": "integer",
      // "minimum": 0,
      // "maximum": 150
    },
    "gender": {
      "type": "string",
      "enum": [
        "Male",
        "Female",
        "Other"
      ]
    }
  },
  "required": ["gender"]
}
const uischema = {
  "type": "HorizontalLayout",
  "elements": [
    {
      "type": "Control",
      "scope": "#/properties/age",
      "label": "Hospital arrival time (if not known, enter the best available estimate):"
    },
    {
      "type": "Control",
      "scope": "#/properties/gender",
      "label": "Gender"
    }
  ]
}

export function Form(props) {
  const {
    activeFieldId,
    setActiveFieldId,
    formData,
    setFormData
  } = props

  return (
    <div style={{background: "#E7EBF0", padding: 20}}>
      
      <FormContext.Provider value={{ activeFieldId, setActiveFieldId }}>
        <JsonForms
          schema={schema}
          uischema={uischema}
          data={formData}
          renderers={formRenderers}
          cells={formCells}
          onChange={({ data, errors }) => setFormData(data)}
        />
      </FormContext.Provider>

      <pre>{ JSON.stringify(formData, null, 2) }</pre>

    </div>
  )
}