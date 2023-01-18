import * as styles from "./DesigningControls.module.scss"
import { Button, Divider, FormGroup, Paper, IconButton, ToggleButton, InputBase } from "@mui/material"
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import FlagIcon from '@mui/icons-material/Flag'
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags'
import CheckIcon from '@mui/icons-material/Check'
import { useState } from "react"

import { FieldState } from "./FieldState"

function useFieldActivity(fieldName, activeField, setActiveField) {
  const isActive = activeField === fieldName
  function toggleFieldActivity() {
    if (isActive)
      setActiveField(null)
    else
      setActiveField(fieldName)
  }
  return {
    isActive,
    toggleFieldActivity
  }
}

function useFieldState(isFieldActive) {
  const [fieldState, setFieldState] = useState(FieldState.ROBOT_VALUE)
  const hasRobotValue = (
    fieldState === FieldState.ROBOT_VALUE
    || fieldState === FieldState.ROBOT_VALUE_VERIFIED
  )
  const isVerified = (
    fieldState === FieldState.ROBOT_VALUE_VERIFIED
    || fieldState === FieldState.HUMAN_VALUE
  )
  const hasVerifiedAppearance = isVerified && !isFieldActive
  function toggleRobotVerified() {
    if (fieldState === FieldState.ROBOT_VALUE_VERIFIED)
      setFieldState(FieldState.ROBOT_VALUE)
    else if (fieldState === FieldState.ROBOT_VALUE)
      setFieldState(FieldState.ROBOT_VALUE_VERIFIED)
  }
  return {
    fieldState, setFieldState,
    hasRobotValue,
    isVerified,
    hasVerifiedAppearance,
    toggleRobotVerified
  }
}

function CheckboxRow({ fieldName, activeField, setActiveField, label }) {
  const {
    isActive,
    toggleFieldActivity
  } = useFieldActivity(fieldName, activeField, setActiveField)

  const {
    hasRobotValue,
    isVerified,
    hasVerifiedAppearance,
    toggleRobotVerified
  } = useFieldState(isActive)

  return (
    <div className={[
      styles["checkbox-row"],
      isActive ? styles["checkbox-row--active"] : "",
      hasVerifiedAppearance ? styles["checkbox-row--verified"] : ""
    ].join(" ")}>
      <FormControlLabel control={<Checkbox color={hasVerifiedAppearance ? "success" : "primary"} />} label={label} />
      
      <div className={styles["checkbox-row__whitespace"]}></div>

      <IconButton
        onClick={toggleFieldActivity}
        sx={{ p: '10px' }}
        className={styles["checkbox-row__flag-button"]}
      >
        {isActive ? <FlagIcon /> : <EmojiFlagsIcon />}
      </IconButton>

      { hasRobotValue ? (
        <ToggleButton
          size="small"
          color={hasVerifiedAppearance ? "success" : "primary"}
          value="check"
          selected={isVerified}
          onChange={toggleRobotVerified}
        >
          <SmartToyIcon />
          <CheckIcon />
        </ToggleButton>
      ) : ""}

      {/* <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" /> */}
    </div>
  )
}

export function DesigningControls() {
  const [activeField, setActiveField] = useState("")
  
  return (
    <>
      <Paper className={styles["paper"]}>
        Checkbox group
        <Divider/>
        <CheckboxRow
          fieldName="foo"
          label="Lorem ipsum dolor sit amet consectetur lorem ipsum dolor sit amet cons"
          activeField={activeField}
          setActiveField={setActiveField}
        />
        <Divider/>
        <CheckboxRow
          fieldName="bar"
          label="Dolor sit amet"
          activeField={activeField}
          setActiveField={setActiveField}
        />
        <Divider/>
        Footer
      </Paper>

      &nbsp;<br/>

      <Paper className={styles["paper"]}>
        Checkbox group
        <Divider/>
        <div className={styles["field-row"]}>
          <InputBase
            fullWidth={true}
            placeholder="Enter text..."
          />
          <ToggleButton
            size="small"
            // color={isVerified ? "success" : "primary"}
            // selected={isVerified}
            // onChange={() => {setVerified(!isVerified)}}
          >
            Unknown
          </ToggleButton>
          <ToggleButton
            size="small"
            value="check"
            // color={isVerified ? "success" : "primary"}
            // selected={isVerified}
            // onChange={() => {setVerified(!isVerified)}}
          >
            <SmartToyIcon />
            <CheckIcon />
          </ToggleButton>
        </div>
        {/* <Divider/>
        Footer */}
      </Paper>

      &nbsp;<br/>
    </>
  )
}