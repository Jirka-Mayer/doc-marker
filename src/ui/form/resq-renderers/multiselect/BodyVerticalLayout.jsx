import { rankWith, uiTypeIs } from '@jsonforms/core'
import { JsonFormsDispatch, withJsonFormsLayoutProps } from '@jsonforms/react'

function BodyVerticalLayout(props) {
  const {
    uischema,
    schema,
    path,
    enabled,
    renderers,
    cells,
    visible
  } = props

  const elements = uischema.elements

  if (elements.length === 0)
    return null

  return elements.map((child, index) => (
    <div key={`${path}-${index}`} style={{ display: visible ? "block" : "none" }}>
      <JsonFormsDispatch
        uischema={child}
        schema={schema}
        path={path}
        enabled={enabled}
        renderers={renderers}
        cells={cells}
      />
    </div>
  ))
}

export const bodyVerticalLayoutTester = rankWith(
  1, uiTypeIs("VerticalLayout")
)

export default withJsonFormsLayoutProps(BodyVerticalLayout)
