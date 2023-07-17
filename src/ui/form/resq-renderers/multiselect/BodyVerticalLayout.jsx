import React, { useContext } from "react"
import { rankWith, uiTypeIs } from '@jsonforms/core'
import { JsonFormsDispatch, withJsonFormsLayoutProps } from '@jsonforms/react'
import { MultiselectGroupContext } from "./MultiselectGroupContext"

function BodyVerticalLayout(props) {
  const {
    uischema,
    schema,
    path,
    renderers,
    cells
  } = props

  const {
    leaderValue
  } = useContext(MultiselectGroupContext)


  // === visible ===

  let visible = false

  if (leaderValue === undefined) {
    visible = true
  }

  if (leaderValue === true) {
    visible = true
  }

  
  // === rendering ===

  const elements = uischema.elements

  if (elements.length === 0)
    return null

  return elements.map((child, index) => (
    <div key={`${path}-${index}`} style={{ display: visible ? "block" : "none" }}>
      <JsonFormsDispatch
        uischema={child}
        schema={schema}
        path={path}
        enabled={true} // checkboxes handle that on their own
        renderers={renderers}
        cells={cells}
      />
    </div>
  ))
}

export const bodyVerticalLayoutTester = rankWith(
  2, uiTypeIs("VerticalLayout")
)

export default withJsonFormsLayoutProps(
  React.memo(BodyVerticalLayout)
)
