import React from "react"
import { isIntegerControl, rankWith } from "@jsonforms/core"
import { withJsonFormsControlProps, withTranslateProps } from "@jsonforms/react"
import { ResqInputControl } from "./ResqInputControl"
import { ControlInputInteger } from "./ControlInputInteger"

export function ResqIntegerControl(props) {
  return (
    <ResqInputControl
      {...props}
      controlInput={ControlInputInteger}
    />
  )
}

export const resqIntegerControlTester = rankWith(
  2, isIntegerControl
)

export default withJsonFormsControlProps(
  withTranslateProps( // passes in the "t" prop
    React.memo(ResqIntegerControl)
  )
)
