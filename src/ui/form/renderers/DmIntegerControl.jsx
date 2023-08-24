import React from "react"
import { isIntegerControl, rankWith } from "@jsonforms/core"
import { withJsonFormsControlProps, withTranslateProps } from "@jsonforms/react"
import { DmInputControl } from "./DmInputControl"
import { ControlInputInteger } from "./ControlInputInteger"

export function DmIntegerControl(props) {
  return (
    <DmInputControl
      {...props}
      controlInput={ControlInputInteger}
    />
  )
}

export const dmIntegerControlTester = rankWith(
  2, isIntegerControl
)

export default withJsonFormsControlProps(
  withTranslateProps( // passes in the "t" prop
    React.memo(DmIntegerControl)
  )
)
