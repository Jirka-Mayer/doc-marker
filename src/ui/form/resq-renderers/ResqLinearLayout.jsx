import * as styles from "./renderers.module.scss"
import { rankWith, uiTypeIs, or } from '@jsonforms/core'
import { JsonFormsDispatch, withJsonFormsLayoutProps } from '@jsonforms/react'
import { Grid } from "@mui/material"

function renderLayoutElements(props, elements) {
  const {
    schema,
    enabled,
    renderers,
    cells,
    visible
  } = props

  return elements.map((child, index) => (
    <Grid
      item
      key={`${index}`}
      xs
    >
      <JsonFormsDispatch
        uischema={child}
        schema={schema}
        enabled={enabled}
        renderers={renderers}
        cells={cells}
      />
    </Grid>
  ))
}

function ResqLinearLayout(props) {
  const {
    uischema,
    visible
  } = props

  const elements = uischema.elements
  const direction = (uischema.type === "HorizontalLayout") ? "row" : "column"

  if (elements.length === 0)
    return null

  return (
    <Grid
      container
      direction={direction}
      spacing={2}
      style={{ display: visible ? undefined : "none" }}
    >
      {renderLayoutElements(props, elements)}
    </Grid>
  )
}

export default withJsonFormsLayoutProps(ResqLinearLayout)

export const resqLinearLayoutTester = rankWith(
  1,
  or(uiTypeIs("VerticalLayout"), uiTypeIs("HorizontalLayout"))
)