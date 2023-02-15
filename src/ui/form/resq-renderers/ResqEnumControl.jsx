import { isEnumControl, rankWith } from "@jsonforms/core"
import { withJsonFormsControlProps } from "@jsonforms/react"
import { ResqInputControl } from "./ResqInputControl"
import { ControlInputSelect } from "./ControlInputSelect"

export function ResqEnumControl(props) {
  const {
    schema,
    uischema
  } = props
  
  const controlInputProps = {
    optionValues: schema.enum,
    optionLabels: uischema.enumValueLabels || {}
  }

  return (
    <ResqInputControl
      {...props}
      controlInput={ControlInputSelect}
      controlInputProps={controlInputProps}
    />
  )
}

export const resqEnumControlTester = rankWith(
  2, isEnumControl
)

export default withJsonFormsControlProps(ResqEnumControl)
