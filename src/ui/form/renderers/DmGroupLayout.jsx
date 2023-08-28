import { rankWith, uiTypeIs } from '@jsonforms/core'
import { withJsonFormsLayoutProps } from '@jsonforms/react'
import { Typography } from '@mui/material'
import { useContext } from 'react'
import DmLinearLayout from "./DmLinearLayout"
import { GroupLayoutContext } from "./GroupLayoutContext"

function DmGroupLayout(props) {
  const {
    label,
    visible
  } = props

  const { depth } = useContext(GroupLayoutContext)

  let variant = "h3"
  let fontSize = "48px"
  let mt = 8
  
  if (depth >= 2) {
    variant = "h4"
    fontSize = "36px"
    mt = 4
  }

  if (depth >= 3) {
    variant = "h5"
    fontSize = "30px"
    mt = 2
  }

  return (
    <>
      <Typography
        variant={variant}
        sx={{
          display: visible ? "block" : "none",
          ml: 2,
          mt: mt,
          fontSize: fontSize
        }}
      >
        {label || "[missing group label]"}
      </Typography>
      <GroupLayoutContext.Provider value={{
        depth: depth + 1
      }}>
        <DmLinearLayout {...props} />
      </GroupLayoutContext.Provider>
    </>
  )
}

export default withJsonFormsLayoutProps(DmGroupLayout)

export const dmGroupTester = rankWith(1, uiTypeIs("Group"))