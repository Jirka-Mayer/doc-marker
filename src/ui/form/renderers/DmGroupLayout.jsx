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
        sx={{
          display: visible ? "block" : "none",
          ml: 2,
          mt: 8,
          fontSize: "48px"
        }}
      >
        {label || "[missing group label]"}
      </Typography>
      <DmLinearLayout {...props} />
    </>
  )
}

export default withJsonFormsLayoutProps(DmGroupLayout)

export const dmGroupTester = rankWith(1, uiTypeIs("Group"))