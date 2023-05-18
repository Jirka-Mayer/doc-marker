import React from "react"
import { rankWith } from "@jsonforms/core"
import { withJsonFormsLayoutProps, withTranslateProps } from "@jsonforms/react"
import { isPostAcuteFindings } from "./isPostAcuteFindings"
import { Paper } from "@mui/material"

export function ResqPostAcuteFindingsGroup(props) {
  const {
    enabled,
    schema,
    uischema,
    visible,
    data,
    t,
  } = props
  
  ///////////////
  // Rendering //
  ///////////////

  return (
    <Paper sx={{ display: visible ? "block" : "none" }}>
      <div>POST ACUTE CARE FINDINGS!</div>

      {/* TODO: continue here */}
      {/* <JsonFormsDispatch
          uischema={bodyUischema}
          schema={schema}
          enabled={enabled}
          renderers={[
            { tester: bodyVerticalLayoutTester, renderer: BodyVerticalLayout },
            { tester: materialHorizontalLayoutTester, renderer: MaterialHorizontalLayout },
            { tester: bodyGroupLayoutTester, renderer: BodyGroupLayout },
            { tester: bodyCheckboxControlTester, renderer: BodyCheckboxControl }
          ]}
          cells={[]}
        /> */}
    </Paper>
  )
}

export const resqPostAcuteFindingsGroupTester = rankWith(
  10, isPostAcuteFindings
)

export default withJsonFormsLayoutProps(
  withTranslateProps( // passes in the "t" prop
    React.memo(ResqPostAcuteFindingsGroup)
  )
)
