import { rankWith, uiTypeIs } from '@jsonforms/core'
import { withJsonFormsLayoutProps } from '@jsonforms/react'
import { Typography } from '@mui/material'
import ResqVerticalLayout from "./ResqVerticalLayout"

function ResqGroupLayout(props) {
  const {
    label
  } = props

  return (
    <>
      <Typography variant="h3" gutterBottom>
        {label || "[missing group label]"}
      </Typography>
      <ResqVerticalLayout {...props} />
    </>
  )
}

export default withJsonFormsLayoutProps(ResqGroupLayout)

export const resqGroupTester = rankWith(1, uiTypeIs("Group"))