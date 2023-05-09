import React from "react"
import { isStringControl, rankWith } from "@jsonforms/core"
import { withJsonFormsControlProps, withTranslateProps } from "@jsonforms/react"
import { ResqInputControl } from "./ResqInputControl"
import { ControlInputText } from "./ControlInputText"

export function ResqTextControl(props) {
  return (
    <ResqInputControl
      {...props}
      controlInput={ControlInputText}
    />
  )
}

export const resqTextControlTester = rankWith(
  1, isStringControl
)

export default withJsonFormsControlProps(
  withTranslateProps( // passes in the "t" prop
    React.memo(ResqTextControl)
  )
)
