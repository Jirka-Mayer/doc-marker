import React from "react"
import { isBooleanControl, rankWith } from "@jsonforms/core"
import { withJsonFormsControlProps, withTranslateProps } from "@jsonforms/react"
import { ResqInputControl } from "./ResqInputControl"
import { ControlInputBoolean } from "./ControlInputBoolean"

export function ResqBooleanControl(props) {
  return (
    <ResqInputControl
      {...props}
      ignoreNullability={true}
      controlInput={ControlInputBoolean}
    />
  )
}

export const resqBooleanControlTester = rankWith(
  2, isBooleanControl
)

export default withJsonFormsControlProps(
  withTranslateProps( // passes in the "t" prop
    React.memo(ResqBooleanControl)
  )
)
