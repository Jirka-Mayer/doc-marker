import React from "react"
import { or, isDateControl, isTimeControl, isDateTimeControl, rankWith } from "@jsonforms/core"
import { withJsonFormsControlProps, withTranslateProps } from "@jsonforms/react"
import { ResqInputControl } from "./ResqInputControl"
import { ControlInputDateTime } from "./ControlInputDateTime"

export function ResqDateTimeControl(props) {
  const {
    schema,
    uischema
  } = props

  return (
    <ResqInputControl
      {...props}
      controlInput={ControlInputDateTime}
    />
  )
}

export const resqDateTimeControlTester = rankWith(
  2, or(isDateControl, isTimeControl, isDateTimeControl)
)

export default withJsonFormsControlProps( // passes in the "options" prop
  withTranslateProps( // passes in the "t" prop
    React.memo(ResqDateTimeControl)
  )
)
