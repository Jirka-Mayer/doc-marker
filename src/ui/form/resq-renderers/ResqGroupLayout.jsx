import { rankWith, uiTypeIs } from '@jsonforms/core'
import { withJsonFormsLayoutProps } from '@jsonforms/react'
import { Typography } from '@mui/material'

// TODO: replace with the resq vertical layout
//import { MaterialVerticalLayout } from "@jsonforms/material-renderers"
import ResqVerticalLayout from "./ResqVerticalLayout"

function ResqGroupLayout(props) {
  const {
    uischema
  } = props

  return (
    <>
      <Typography variant="h3" gutterBottom>
        {uischema.label || "[missing group label]"}
      </Typography>
      <ResqVerticalLayout {...props} />
    </>
  )
}

export default withJsonFormsLayoutProps(ResqGroupLayout)

export const resqGroupTester = rankWith(1, uiTypeIs("Group"))