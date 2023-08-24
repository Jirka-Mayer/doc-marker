import React from "react"
import { isEnumControl, rankWith } from "@jsonforms/core"
import { withJsonFormsEnumProps, withTranslateProps } from "@jsonforms/react"
import { DmInputControl } from "./DmInputControl"
import { ControlInputSelect } from "./ControlInputSelect"

export function DmEnumControl(props) {
  const {
    schema,
    uischema
  } = props

  return (
    <DmInputControl
      {...props}
      ignoreNullability={true}
      controlInput={ControlInputSelect}
    />
  )
}

export const dmEnumControlTester = rankWith(
  2, isEnumControl
)

export default withJsonFormsEnumProps( // passes in the "options" prop
  withTranslateProps( // passes in the "t" prop
    React.memo(DmEnumControl)
  )
)
