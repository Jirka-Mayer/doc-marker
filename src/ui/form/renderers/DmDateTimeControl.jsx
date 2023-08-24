import React from "react"
import { or, isDateControl, isTimeControl, isDateTimeControl, rankWith } from "@jsonforms/core"
import { withJsonFormsControlProps, withTranslateProps } from "@jsonforms/react"
import { DmInputControl } from "./DmInputControl"
import { ControlInputDateTime } from "./ControlInputDateTime"

export function DmDateTimeControl(props) {
  const {
    schema,
    uischema
  } = props

  return (
    <DmInputControl
      {...props}
      controlInput={ControlInputDateTime}
    />
  )
}

export const dmDateTimeControlTester = rankWith(
  2, or(isDateControl, isTimeControl, isDateTimeControl)
)

export default withJsonFormsControlProps( // passes in the "options" prop
  withTranslateProps( // passes in the "t" prop
    React.memo(DmDateTimeControl)
  )
)
