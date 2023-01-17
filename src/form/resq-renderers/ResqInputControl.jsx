import { InputLabel, FormControl, IconButton, OutlinedInput, Input, Paper, FormHelperText, Typography } from "@mui/material"
import InputBase from "@mui/material/InputBase"
import Divider from "@mui/material/Divider"
import DoneIcon from "@mui/icons-material/Done"
import ShortTextIcon from "@mui/icons-material/ShortText"
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import BorderColorIcon from "@mui/icons-material/BorderColor"
import { useContext } from "react"
import { FormContext } from "../FormContext"

import * as styles from "./renderers.module.scss"

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
    data,
    path
  } = props;

  function onFocus() {
    formContext.setActiveFieldId(id)
  }

  function onChange(e) {
    let newValue = e.target.value
    if (newValue === "")
      newValue = undefined
    handleChange(path, newValue)
  }

  // TODO: debounce input
  // (bounces when typing too fast)

  const isFieldActive = formContext.activeFieldId === id
  
  return (
    <Paper
      className={`${styles["paper"]} ${isFieldActive ? styles["is-field-active"] : ""}`}
      elevation={isFieldActive ? 8 : 2}
    >
      <InputLabel
        className={styles["label"]}
        htmlFor={id + "-input"}
      >{ label }</InputLabel>

      <Divider />

      <InputBase
        className={styles["input"]}
        fullWidth={true}
        id={id + "-input"}
        placeholder={`${path} (${id})`}
        value={data}
        onFocus={onFocus}
        onChange={onChange}
      />

      <Divider />

      <div className={styles["row"]}>
        <IconButton
          disabled={false}
          color={isFieldActive ? "primary" : "default"}
          sx={{ p: '10px' }}
        >
          {/* <ShortTextIcon /> */}
          <ManageSearchIcon />
          {/* <BorderColorIcon fontSize="small"/> */}
        </IconButton>

        <div className={styles["highlights"]}>
          <span className={styles["highlight"]}>Lorem ipsum dolor sit amet consectetur lorem ipsum dolor</span>
          <span className={styles["highlight"]}>Hello world!</span>
          {/* <span className={styles["highlight"]}>Foobar baz bar. Lorem ipsum dolor sit amet. Lorem ipsum dolor.</span> */}
        </div>
        
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton color="default" disabled={false} sx={{ p: '10px' }}>
          <DoneIcon />
        </IconButton>
      </div>

      { errors === "" ? "" : (
        <FormHelperText
          className={styles["helper-text"]}
          error={true}
        >{errors}</FormHelperText>
      )}
    </Paper>
  )
}