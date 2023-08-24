import { rankWith, uiTypeIs } from '@jsonforms/core'
import { withJsonFormsLayoutProps } from '@jsonforms/react'
import { Typography } from '@mui/material'
import DmLinearLayout from "./DmLinearLayout"

function DmGroupLayout(props) {
  const {
    label,
    visible
  } = props

  return (
    <>
      <Typography
        variant="h3"
        gutterBottom
        sx={{ display: visible ? "block" : "none" }}
      >
        {label || "[missing group label]"}
      </Typography>
      <DmLinearLayout {...props} />
    </>
  )
}

export default withJsonFormsLayoutProps(DmGroupLayout)

export const dmGroupTester = rankWith(1, uiTypeIs("Group"))