import { InputLabel, FormControl, IconButton, OutlinedInput, Input, Paper } from "@mui/material"
import InputBase from "@mui/material/InputBase"
import Divider from "@mui/material/Divider"
import DoneIcon from "@mui/icons-material/Done"
import ShortTextIcon from "@mui/icons-material/ShortText"
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import BorderColorIcon from "@mui/icons-material/BorderColor"
import { useContext } from "react"
import { FormContext } from "../FormContext"

export function ResqInputControl(props) {
  const formContext = useContext(FormContext)
  
  const {
    id,
    description,
    errors,
    label,
    uischema,
    visible,
    required,
    config,
    input,
    
    handleChange,
    path
  } = props;

  function onFocus() {
    formContext.setActiveFieldId(id)
  }

  function onChange(newValue) {
    //
    // handleChange(path, newValue)
  }

  const isFieldActive = formContext.activeFieldId === id
  
  return (
    <Paper
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
    >
      <IconButton
        disabled={false}
        color={isFieldActive ? "primary" : "default"}
        sx={{ p: '10px' }}
      >
        {/* <ShortTextIcon /> */}
        <ManageSearchIcon />
        {/* <BorderColorIcon fontSize="small"/> */}
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={id}
        onFocus={onFocus}
        onChange={onChange}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton color="default" disabled={false} sx={{ p: '10px' }}>
        <DoneIcon />
      </IconButton>
    </Paper>
  )
}