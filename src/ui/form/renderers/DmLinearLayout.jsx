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

function DmLinearLayout(props) {
  const {
    uischema,
    visible
  } = props

  const elements = uischema.elements || []
  const direction = (uischema.type === "HorizontalLayout") ? "row" : "column"

  if (elements.length === 0)
    return null
  
  // display column layout as block (override flex since it
  // stetches some elements weirdly)
  let displayStyle = (direction === "row") ? undefined : "block"

  if (!visible)
    displayStyle = "none"

  return (
    <Grid
      container
      direction={direction}
      spacing={0} // the controls have margin (2 = 16px), not the layout
                  // so that empty layouts take up zero space
      style={{ display: displayStyle }}
    >
      {renderLayoutElements(props, elements)}
    </Grid>
  )
}

export default withJsonFormsLayoutProps(DmLinearLayout)

export const dmLinearLayoutTester = rankWith(
  1,
  or(uiTypeIs("VerticalLayout"), uiTypeIs("HorizontalLayout"))
)