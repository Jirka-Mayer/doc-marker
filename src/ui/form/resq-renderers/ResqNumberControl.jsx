import { isNumberControl, rankWith } from "@jsonforms/core"
import { withJsonFormsControlProps } from "@jsonforms/react"
import { ResqInputControl } from "./ResqInputControl"
import { ControlInputNumber } from "./ControlInputNumber"

export function ResqNumberControl(props) {
  return (
    <ResqInputControl
      {...props}
      controlInput={ControlInputNumber}
    />
  )
}

export const resqNumberControlTester = rankWith(
  2, isNumberControl
)

export default withJsonFormsControlProps(ResqNumberControl)
