import React from "react"
import { isEnumControl, rankWith } from "@jsonforms/core"
import { withJsonFormsEnumProps, withTranslateProps } from "@jsonforms/react"
import { ResqInputControl } from "./ResqInputControl"
import { ControlInputSelect } from "./ControlInputSelect"

export function ResqEnumControl(props) {
  const {
    schema,
    uischema
  } = props

  return (
    <ResqInputControl
      {...props}
      ignoreNullability={true}
      controlInput={ControlInputSelect}
    />
  )
}

export const resqEnumControlTester = rankWith(
  2, isEnumControl
)

export default withJsonFormsEnumProps( // passes in the "options" prop
  withTranslateProps( // passes in the "t" prop
    React.memo(ResqEnumControl)
  )
)
