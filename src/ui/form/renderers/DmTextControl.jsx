import React from "react"
import { isStringControl, rankWith } from "@jsonforms/core"
import { withJsonFormsControlProps, withTranslateProps } from "@jsonforms/react"
import { DmInputControl } from "./DmInputControl"
import { ControlInputText } from "./ControlInputText"

export function DmTextControl(props) {
  return (
    <DmInputControl
      {...props}
      controlInput={ControlInputText}
    />
  )
}

export const dmTextControlTester = rankWith(
  1, isStringControl
)

export default withJsonFormsControlProps(
  withTranslateProps( // passes in the "t" prop
    React.memo(DmTextControl)
  )
)
