import React from "react"
import { isBooleanControl, rankWith } from "@jsonforms/core"
import { withJsonFormsControlProps, withTranslateProps } from "@jsonforms/react"
import { DmInputControl } from "./DmInputControl"
import { ControlInputBoolean } from "./ControlInputBoolean"

export function DmBooleanControl(props) {
  return (
    <DmInputControl
      {...props}
      ignoreNullability={true}
      controlInput={ControlInputBoolean}
    />
  )
}

export const dmBooleanControlTester = rankWith(
  2, isBooleanControl
)

export default withJsonFormsControlProps(
  withTranslateProps( // passes in the "t" prop
    React.memo(DmBooleanControl)
  )
)
