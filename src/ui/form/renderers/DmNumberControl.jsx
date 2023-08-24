import React from "react"
import { isNumberControl, rankWith } from "@jsonforms/core"
import { withJsonFormsControlProps, withTranslateProps } from "@jsonforms/react"
import { DmInputControl } from "./DmInputControl"
import { ControlInputNumber } from "./ControlInputNumber"

export function DmNumberControl(props) {
  return (
    <DmInputControl
      {...props}
      controlInput={ControlInputNumber}
    />
  )
}

export const dmNumberControlTester = rankWith(
  2, isNumberControl
)

export default withJsonFormsControlProps(
  withTranslateProps( // passes in the "t" prop
    React.memo(DmNumberControl)
  )
)
