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
      "label": "~~Age~~ Hospital arrival time (if not known, enter the best available estimate):"
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
          renderers={formRenderers}
          cells={formCells}
          onChange={({ data, errors }) => setData(data)}
        />
      </FormContext.Provider>

      <pre>{ JSON.stringify(data, null, 2) }</pre>

    </div>
  )
}