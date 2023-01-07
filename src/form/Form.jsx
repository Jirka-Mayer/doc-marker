import * as styles from "./Form.module.scss"
import { useState } from "react"

import { materialRenderers, materialCells } from "@jsonforms/material-renderers"
import { resqRenderers, resqCells } from "./renderers"
import { JsonForms } from "@jsonforms/react"
import { FormContext } from "./FormContext"

const schema = {
  "type": "object",
  "properties": {
    "age": {
      "type": "string", // DEBUG, should be integer
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
      "label": "Age"
    },
    {
      "type": "Control",
      "scope": "#/properties/gender",
      "label": "Gender"
    }
  ]
}

const initialData = {}

export function Form({ activeFieldId, setActiveFieldId }) {
  const [data, setData] = useState(initialData);

  return (
    <div style={{background: "#E7EBF0", padding: 20}}>
      
      <FormContext.Provider value={{ activeFieldId, setActiveFieldId }}>
        <JsonForms
          schema={schema}
          uischema={uischema}
          data={data}
          renderers={resqRenderers}
          cells={resqCells}
          onChange={({ data, errors }) => setData(data)}
        />
      </FormContext.Provider>

      <pre>{ JSON.stringify(data, null, 2) }</pre>

    </div>
  )
}