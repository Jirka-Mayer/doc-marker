import * as styles from "./Form.module.scss"
import { Field } from "./Field"
import { useState } from "react"

import { materialRenderers, materialCells } from "@jsonforms/material-renderers"
import { resqRenderers, resqCells } from "./renderers"
import { JsonForms } from "@jsonforms/react"

const schema = {
  "type": "object",
  "properties": {
    "age": {
      "type": "integer",
      "minimum": 0,
      "maximum": 150
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

export function Form({ onActivate }) {
  const [data, setData] = useState(initialData);

  return (
    <div>
      {/* <Field title="Person name" fieldName="0" onActivate={onActivate} />
      <Field title="Age" fieldName="1" onActivate={onActivate} /> */}
      
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={data}
        renderers={resqRenderers}
        cells={resqCells}
        onChange={({ data, errors }) => setData(data)}
      />

      <pre>{ JSON.stringify(data, null, 2) }</pre>

    </div>
  )
}