import { isStringControl, rankWith } from "@jsonforms/core"
import { withJsonFormsControlProps } from "@jsonforms/react"
import { ResqInputControl } from "./ResqInputControl"

export function ResqTextControl(props) {
  return <ResqInputControl {...props} />
}

export const resqTextControlTester = rankWith(
  1, isStringControl
)

export default withJsonFormsControlProps(ResqTextControl)
