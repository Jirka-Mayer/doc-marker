import { isBooleanControl, rankWith } from "@jsonforms/core"
import { withJsonFormsControlProps } from "@jsonforms/react"
import { ResqInputControl } from "./ResqInputControl"
import { ControlInputBoolean } from "./ControlInputBoolean"

export function ResqBooleanControl(props) {
  return (
    <ResqInputControl
      {...props}
      controlInput={ControlInputBoolean}
    />
  )
}

export const resqBooleanControlTester = rankWith(
  2, isBooleanControl
)

export default withJsonFormsControlProps(ResqBooleanControl)
