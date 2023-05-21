import React from "react"
import { rankWith } from "@jsonforms/core"
import { JsonFormsDispatch, withJsonFormsLayoutProps, withTranslateProps } from "@jsonforms/react"
import { isPostAcuteFindings } from "./isPostAcuteFindings"
import { Divider, InputLabel, Paper } from "@mui/material"
import * as styles from "../renderers.module.scss"
import CheckboxControl, { checkboxControlTester } from "./CheckboxControl"
import { PostAcuteFindingsContext } from "./PostAcuteFindingsContext"

const bodyRenderers = [
  { tester: checkboxControlTester, renderer: CheckboxControl }
]
const bodyCells = []

export function ResqPostAcuteFindingsGroup(props) {
  const {
    label,
    enabled,
    schema,
    uischema,
    visible
  } = props

  const elements = uischema.elements
  
  ///////////////
  // Rendering //
  ///////////////

  return (
    <PostAcuteFindingsContext.Provider value={{
      groupVisible: visible
    }}>
      <Paper sx={{ display: visible ? "block" : "none" }}>
        <InputLabel
          className={styles["field-label"]}
        >{ label || "[missing group label]" }</InputLabel>
        <Divider />
        
        { elements.map((child, index) => (
          <JsonFormsDispatch
            key={"" + index}
            uischema={child}
            schema={schema}
            enabled={enabled}
            renderers={bodyRenderers}
            cells={bodyCells}
          />
        )) }

      </Paper>
    </PostAcuteFindingsContext.Provider>
  )
}

export const resqPostAcuteFindingsGroupTester = rankWith(
  10, isPostAcuteFindings
)

export default withJsonFormsLayoutProps(
  React.memo(ResqPostAcuteFindingsGroup)
)
