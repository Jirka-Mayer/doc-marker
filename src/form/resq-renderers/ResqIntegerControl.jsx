import { isIntegerControl, rankWith } from "@jsonforms/core"
import { withJsonFormsControlProps } from "@jsonforms/react"
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

export default withJsonFormsControlProps(ResqIntegerControl)
