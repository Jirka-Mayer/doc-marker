import { rankWith } from '@jsonforms/core'
import { withJsonFormsLayoutProps } from '@jsonforms/react'
import { isMultiselectGroup } from './isMultiselectGroup'

function ResqMultiselectGroup(props) {
  const {
    uischema,
    schema
  } = props

  return (
    <>
      <div>[Multiselect group]</div>
      <pre>{ JSON.stringify({uischema, schema}, null, 2) }</pre>
    </>
  )
}

export const resqMultiselectGroupTester = rankWith(
  10, isMultiselectGroup
)

export default withJsonFormsLayoutProps(ResqMultiselectGroup)
